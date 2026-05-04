// Run Benchmark — ejecución completa mensual (TTFB x5, PageSpeed, headers).
// Crea benchmark_runs + benchmark_results por empresa habilitada.
// Disparable manual (POST) o vía cron mensual.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-api-key",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PSI_KEY = Deno.env.get("GOOGLE_PAGESPEED_API_KEY") ?? "";

interface Company {
  id: string;
  slug: string;
  name: string;
  benchmark_target_url: string;
}

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}
function p95(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  const idx = Math.min(s.length - 1, Math.floor(0.95 * s.length));
  return s[idx];
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function measureTtfb(url: string): Promise<{
  samples: Array<{ ttfb_ms: number | null; status: number | null; error?: string }>;
  serverHeader: string | null;
  contentEncoding: string | null;
}> {
  const samples: Array<{ ttfb_ms: number | null; status: number | null; error?: string }> = [];
  let serverHeader: string | null = null;
  let contentEncoding: string | null = null;

  for (let i = 0; i < 5; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15_000);
    const start = performance.now();
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "User-Agent": "EligeTuHosting-Benchmark/1.0", "Accept-Encoding": "br, gzip" },
      });
      const ttfb = Math.round(performance.now() - start);
      try { await res.text(); } catch { /* ignore */ }
      samples.push({ ttfb_ms: ttfb, status: res.status });
      if (i === 0) {
        serverHeader = res.headers.get("server");
        contentEncoding = res.headers.get("content-encoding");
      }
    } catch (err) {
      const e = err as Error;
      samples.push({ ttfb_ms: null, status: null, error: e.name === "AbortError" ? "timeout" : (e.message ?? "unknown") });
    } finally {
      clearTimeout(timer);
    }
    if (i < 4) await sleep(2000);
  }
  return { samples, serverHeader, contentEncoding };
}

async function runPageSpeed(url: string): Promise<Record<string, unknown> | null> {
  if (!PSI_KEY) return null;
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=seo&category=accessibility&key=${PSI_KEY}`;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 90_000);
    const res = await fetch(apiUrl, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) {
      await res.text();
      return { error: `PSI ${res.status}` };
    }
    return await res.json();
  } catch (err) {
    const e = err as Error;
    return { error: e.message ?? "psi_failed" };
  }
}

function extractLighthouse(psi: Record<string, unknown> | null): {
  perf: number | null; seo: number | null; a11y: number | null;
  lcp: number | null; fcp: number | null; cls: number | null;
} {
  const empty = { perf: null, seo: null, a11y: null, lcp: null, fcp: null, cls: null };
  if (!psi) return empty;
  // deno-lint-ignore no-explicit-any
  const lh = (psi as any)?.lighthouseResult;
  if (!lh) return empty;
  const cats = lh.categories ?? {};
  const audits = lh.audits ?? {};
  const score = (k: string) => (cats[k]?.score != null ? Math.round(cats[k].score * 100) : null);
  const ms = (k: string) => (audits[k]?.numericValue != null ? Math.round(audits[k].numericValue) : null);
  const num = (k: string) => (audits[k]?.numericValue != null ? Number(audits[k].numericValue) : null);
  return {
    perf: score("performance"),
    seo: score("seo"),
    a11y: score("accessibility"),
    lcp: ms("largest-contentful-paint"),
    fcp: ms("first-contentful-paint"),
    cls: num("cumulative-layout-shift"),
  };
}

function compositeScore(args: {
  perf: number | null;
  ttfb_med: number | null;
  uptime_pct: number | null;
  seo: number | null;
}): number | null {
  const { perf, ttfb_med, uptime_pct, seo } = args;
  if (perf == null && ttfb_med == null && uptime_pct == null && seo == null) return null;
  const ttfbScore = ttfb_med == null ? 0 : Math.max(0, 100 - ttfb_med / 10);
  const uptimeScore = uptime_pct ?? 0;
  const perfScore = perf ?? 0;
  const seoScore = seo ?? 0;
  return Math.round((0.35 * perfScore + 0.25 * ttfbScore + 0.25 * uptimeScore + 0.15 * seoScore) * 10) / 10;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // Crear run
  const { data: runRow, error: runErr } = await supabase
    .from("benchmark_runs")
    .insert({ status: "running", methodology_version: "v1.0" })
    .select()
    .single();
  if (runErr || !runRow) {
    return new Response(
      JSON.stringify({ error: runErr?.message ?? "run_insert_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const runId = runRow.id;

  // Empresas
  const { data: companies, error: cErr } = await supabase
    .from("hosting_companies")
    .select("id, slug, name, benchmark_target_url")
    .eq("benchmark_enabled", true)
    .not("benchmark_target_url", "is", null);
  if (cErr) {
    await supabase.from("benchmark_runs").update({ status: "failed", notes: cErr.message }).eq("id", runId);
    return new Response(
      JSON.stringify({ error: cErr.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const list = (companies as Company[]) ?? [];

  // Procesar (serial)
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  let okCount = 0;

  for (const c of list) {
    try {
      const { samples, serverHeader, contentEncoding } = await measureTtfb(c.benchmark_target_url);
      const okSamples = samples.filter((s) => s.ttfb_ms != null).map((s) => s.ttfb_ms as number);
      const ttfb_median = okSamples.length ? median(okSamples) : null;
      const ttfb_p95v = okSamples.length ? p95(okSamples) : null;

      const psi = await runPageSpeed(c.benchmark_target_url);
      const lh = extractLighthouse(psi);

      // Uptime 30d
      const { data: pings } = await supabase
        .from("uptime_pings")
        .select("ok")
        .eq("company_id", c.id)
        .gte("measured_at", since);
      let uptimePct: number | null = null;
      if (pings && pings.length > 0) {
        const okCnt = (pings as Array<{ ok: boolean }>).filter((p) => p.ok).length;
        uptimePct = Math.round((okCnt / pings.length) * 10000) / 100;
      }

      const composite = compositeScore({
        perf: lh.perf, ttfb_med: ttfb_median, uptime_pct: uptimePct, seo: lh.seo,
      });

      await supabase.from("benchmark_results").insert({
        run_id: runId,
        company_id: c.id,
        ttfb_median_ms: ttfb_median,
        ttfb_p95_ms: ttfb_p95v,
        ttfb_samples: samples,
        lighthouse_perf: lh.perf,
        lighthouse_seo: lh.seo,
        lighthouse_a11y: lh.a11y,
        lcp_ms: lh.lcp,
        fcp_ms: lh.fcp,
        cls: lh.cls,
        uptime_30d_pct: uptimePct,
        server_software: serverHeader,
        http_version: null,
        has_brotli: contentEncoding ? contentEncoding.includes("br") : null,
        composite_score: composite,
        raw_json: psi ?? null,
      });
      okCount++;
    } catch (err) {
      const e = err as Error;
      await supabase.from("benchmark_results").insert({
        run_id: runId,
        company_id: c.id,
        error: e.message ?? "unknown",
      });
    }
    await sleep(3000);
  }

  await supabase.from("benchmark_runs").update({
    status: "completed",
    total_providers: okCount,
  }).eq("id", runId);

  return new Response(
    JSON.stringify({ run_id: runId, total_providers: okCount, attempted: list.length }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
