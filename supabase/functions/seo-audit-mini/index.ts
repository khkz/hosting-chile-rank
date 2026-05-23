import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DFS_LOGIN = Deno.env.get("DATAFORSEO_LOGIN");
const DFS_PASS = Deno.env.get("DATAFORSEO_PASSWORD");
const PSI_KEY = Deno.env.get("GOOGLE_PAGESPEED_API_KEY");

const RATE_LIMIT_PER_DAY = 10;

function cleanDomain(input: string): string | null {
  try {
    const trimmed = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
    if (!/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(trimmed)) return null;
    return trimmed;
  } catch {
    return null;
  }
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function checkRateLimit(supabase: ReturnType<typeof createClient>, ipHash: string): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase.from("seo_audit_rate_limit").select("count").eq("ip_hash", ipHash).eq("bucket_date", today).maybeSingle();
  const current = (data as { count?: number } | null)?.count ?? 0;
  if (current >= RATE_LIMIT_PER_DAY) return false;
  await supabase.from("seo_audit_rate_limit").upsert(
    { ip_hash: ipHash, bucket_date: today, count: current + 1, last_request_at: new Date().toISOString() },
    { onConflict: "ip_hash,bucket_date" },
  );
  return true;
}

async function fetchHeadInfo(domain: string) {
  const url = `https://${domain}`;
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(8000) });
    const html = (await res.text()).slice(0, 200_000);
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
    const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? null;
    const h1Count = (html.match(/<h1\b/gi) ?? []).length;
    const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
    const hasOg = /<meta[^>]+property=["']og:/i.test(html);
    const hasSchema = /application\/ld\+json/i.test(html);
    const hasRobots = /<meta[^>]+name=["']robots["']/i.test(html);
    const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
    return {
      reachable: res.ok,
      status: res.status,
      title,
      title_length: title?.length ?? 0,
      description: desc,
      description_length: desc?.length ?? 0,
      h1_count: h1Count,
      has_viewport: hasViewport,
      has_canonical: hasCanonical,
      has_open_graph: hasOg,
      has_schema_org: hasSchema,
      has_robots_meta: hasRobots,
      is_noindex: noindex,
      final_url: res.url,
      https: res.url.startsWith("https://"),
    };
  } catch (e) {
    return { reachable: false, error: e instanceof Error ? e.message : "fetch_failed" };
  }
}

async function fetchPageSpeed(domain: string) {
  if (!PSI_KEY) return null;
  try {
    const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent("https://" + domain)}&strategy=mobile&category=performance&category=seo&category=accessibility&key=${PSI_KEY}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) return null;
    const data = await res.json();
    const cats = data?.lighthouseResult?.categories ?? {};
    const audits = data?.lighthouseResult?.audits ?? {};
    return {
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
      accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
      lcp_ms: audits["largest-contentful-paint"]?.numericValue ?? null,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
      fcp_ms: audits["first-contentful-paint"]?.numericValue ?? null,
      tbt_ms: audits["total-blocking-time"]?.numericValue ?? null,
    };
  } catch {
    return null;
  }
}

async function fetchRankedKeywords(domain: string) {
  if (!DFS_LOGIN || !DFS_PASS) return null;
  try {
    const auth = btoa(`${DFS_LOGIN}:${DFS_PASS}`);
    const res = await fetch("https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify([{
        target: domain,
        location_code: 2152, // Chile
        language_code: "es",
        limit: 10,
        order_by: ["ranked_serp_element.serp_item.rank_group,asc"],
      }]),
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const items = data?.tasks?.[0]?.result?.[0]?.items ?? [];
    const total = data?.tasks?.[0]?.result?.[0]?.total_count ?? 0;
    const top10 = items.slice(0, 10).map((it: Record<string, unknown>) => {
      const ki = (it.keyword_data as Record<string, unknown>)?.keyword_info as Record<string, unknown> | undefined;
      const sel = ((it.ranked_serp_element as Record<string, unknown>)?.serp_item) as Record<string, unknown> | undefined;
      return {
        keyword: (it.keyword_data as Record<string, unknown>)?.keyword ?? null,
        position: sel?.rank_group ?? null,
        url: sel?.url ?? null,
        search_volume: ki?.search_volume ?? null,
        cpc: ki?.cpc ?? null,
        competition: ki?.competition_level ?? null,
      };
    });
    return { total_keywords: total, top: top10 };
  } catch {
    return null;
  }
}

function computeMiniScore(head: Record<string, unknown>, psi: Record<string, number | null> | null) {
  let score = 0;
  let max = 0;
  // Technical
  const checks = [
    ["https", (head.https as boolean) === true, 10],
    ["title", (head.title_length as number) >= 20 && (head.title_length as number) <= 65, 8],
    ["description", (head.description_length as number) >= 80 && (head.description_length as number) <= 165, 8],
    ["h1", (head.h1_count as number) === 1, 6],
    ["viewport", head.has_viewport, 5],
    ["canonical", head.has_canonical, 5],
    ["og", head.has_open_graph, 4],
    ["schema", head.has_schema_org, 4],
    ["indexable", !(head.is_noindex as boolean), 10],
  ] as const;
  for (const [, ok, w] of checks) { max += w; if (ok) score += w; }
  if (psi) {
    score += (psi.performance ?? 0) * 0.15;
    score += (psi.seo ?? 0) * 0.15;
    score += (psi.accessibility ?? 0) * 0.10;
    max += 100 * 0.40;
  }
  return Math.round((score / max) * 100 * 100) / 100;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { domain: rawDomain, email, name } = await req.json();
    const domain = cleanDomain(rawDomain ?? "");
    if (!domain) {
      return new Response(JSON.stringify({ error: "Dominio inválido" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = await sha256(ip + "|seo-audit-mini");
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const allowed = await checkRateLimit(supabase, ipHash);
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Límite diario alcanzado. Crea una cuenta para más auditorías." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const [head, psi, kw] = await Promise.all([fetchHeadInfo(domain), fetchPageSpeed(domain), fetchRankedKeywords(domain)]);
    const score = computeMiniScore(head as Record<string, unknown>, psi);

    // Persist audit
    const { data: audit } = await supabase.from("seo_audits").insert({
      domain,
      status: "completed",
      score_total: score,
      report_data: { head, psi, keywords: kw },
      is_mini: true,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    }).select("id").single();

    // Lead capture if email provided
    if (email) {
      await supabase.from("seo_audit_leads").insert({
        domain,
        email,
        name: name ?? null,
        mini_audit_id: (audit as { id: string } | null)?.id ?? null,
        mini_score: score,
        source: "mini_audit",
      });
    }

    return new Response(
      JSON.stringify({ success: true, domain, score, head, pagespeed: psi, keywords: kw, audit_id: (audit as { id: string } | null)?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "internal_error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
