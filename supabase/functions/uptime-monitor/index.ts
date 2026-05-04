// Uptime Monitor — pings horarios HEAD a cada empresa habilitada.
// Sin secretos externos. Diseñado para correr vía pg_cron cada hora.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface Company {
  id: string;
  slug: string;
  benchmark_target_url: string;
}

async function pingOne(url: string): Promise<{
  status_code: number | null;
  ttfb_ms: number | null;
  total_ms: number | null;
  ok: boolean;
  error: string | null;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  const start = performance.now();
  try {
    // HEAD primero; algunos servers no lo soportan, fallback a GET.
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "EligeTuHosting-UptimeMonitor/1.0" },
    });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "EligeTuHosting-UptimeMonitor/1.0" },
      });
      // consumir body
      try { await res.text(); } catch { /* ignore */ }
    }
    const ttfb = Math.round(performance.now() - start);
    return {
      status_code: res.status,
      ttfb_ms: ttfb,
      total_ms: ttfb,
      ok: res.status >= 200 && res.status < 400,
      error: null,
    };
  } catch (err) {
    const e = err as Error;
    return {
      status_code: null,
      ttfb_ms: null,
      total_ms: Math.round(performance.now() - start),
      ok: false,
      error: e.name === "AbortError" ? "timeout" : (e.message ?? "unknown"),
    };
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: companies, error } = await supabase
    .from("hosting_companies")
    .select("id, slug, benchmark_target_url")
    .eq("benchmark_enabled", true)
    .not("benchmark_target_url", "is", null);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const list = (companies as Company[]) ?? [];
  const rows: Array<Record<string, unknown>> = [];

  for (const c of list) {
    const res = await pingOne(c.benchmark_target_url);
    rows.push({
      company_id: c.id,
      ...res,
      region: "supabase-edge",
    });
  }

  if (rows.length > 0) {
    const { error: insErr } = await supabase.from("uptime_pings").insert(rows);
    if (insErr) {
      return new Response(
        JSON.stringify({ error: insErr.message, attempted: rows.length }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }

  return new Response(
    JSON.stringify({ checked: list.length, inserted: rows.length }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
