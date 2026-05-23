// Full SEO Audit — authenticated. Runs a deep audit using DataForSEO + PageSpeed.
// Validates subscription quota before running.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PAGESPEED_KEY = Deno.env.get("GOOGLE_PAGESPEED_API_KEY");
const DFS_LOGIN = Deno.env.get("DATAFORSEO_LOGIN");
const DFS_PASSWORD = Deno.env.get("DATAFORSEO_PASSWORD");

function cleanDomain(s: string) {
  return s.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
}

function dfsAuthHeader() {
  if (!DFS_LOGIN || !DFS_PASSWORD) return null;
  return `Basic ${btoa(`${DFS_LOGIN}:${DFS_PASSWORD}`)}`;
}

async function dfsCall(path: string, payload: unknown): Promise<any | null> {
  const auth = dfsAuthHeader();
  if (!auth) return null;
  try {
    const res = await fetch(`https://api.dataforseo.com/v3/${path}`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchOnPage(domain: string) {
  try {
    const res = await fetch(`https://${domain}`, { headers: { "User-Agent": "EligeTuHostingBot/1.0" }, redirect: "follow" });
    const html = await res.text();
    return {
      reachable: true,
      status: res.status,
      final_url: res.url,
      has_https: res.url.startsWith("https://"),
      title: /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? null,
      description: /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i.exec(html)?.[1] ?? null,
      h1_count: (html.match(/<h1[\s>]/gi) || []).length,
      h2_count: (html.match(/<h2[\s>]/gi) || []).length,
      images_total: (html.match(/<img[^>]*>/gi) || []).length,
      images_without_alt: (html.match(/<img[^>]*>/gi) || []).filter((t) => !/\salt\s*=/i.test(t)).length,
      has_canonical: /<link[^>]+rel=["']canonical["']/i.test(html),
      has_schema_org: /application\/ld\+json/i.test(html),
      has_viewport: /<meta[^>]+name=["']viewport["']/i.test(html),
      has_og_tags: /<meta[^>]+property=["']og:/i.test(html),
      html_size_kb: Math.round(html.length / 1024),
    };
  } catch (err) {
    return { reachable: false, error: (err as Error).message };
  }
}

async function fetchPageSpeed(domain: string) {
  if (!PAGESPEED_KEY) return null;
  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(`https://${domain}`)}&strategy=mobile&category=performance&category=seo&category=accessibility&category=best-practices&key=${PAGESPEED_KEY}`);
    if (!res.ok) return null;
    const data = await res.json();
    const c = data.lighthouseResult?.categories ?? {};
    const a = data.lighthouseResult?.audits ?? {};
    return {
      performance: Math.round((c.performance?.score ?? 0) * 100),
      seo: Math.round((c.seo?.score ?? 0) * 100),
      accessibility: Math.round((c.accessibility?.score ?? 0) * 100),
      best_practices: Math.round((c["best-practices"]?.score ?? 0) * 100),
      lcp_ms: Math.round(a["largest-contentful-paint"]?.numericValue ?? 0),
      fcp_ms: Math.round(a["first-contentful-paint"]?.numericValue ?? 0),
      cls: Number((a["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(3)),
      tbt_ms: Math.round(a["total-blocking-time"]?.numericValue ?? 0),
    };
  } catch {
    return null;
  }
}

function buildIssues(onpage: any, perf: any, kw: any, bl: any) {
  const issues: any[] = [];
  if (!onpage?.reachable) {
    issues.push({ severity: "critical", category: "technical", title: "Sitio inaccesible", recommendation: "Verifica DNS y respuesta HTTP 200." });
    return issues;
  }
  if (!onpage.has_https) issues.push({ severity: "critical", category: "security", title: "Sin HTTPS", recommendation: "Activa Let's Encrypt y fuerza 301 a HTTPS." });
  if (!onpage.title || onpage.title.length < 30) issues.push({ severity: "high", category: "on_page", title: "Title débil", recommendation: "Crea un <title> de 50-60 caracteres con keyword principal." });
  if (!onpage.description || onpage.description.length < 70) issues.push({ severity: "high", category: "on_page", title: "Meta description débil", recommendation: "Escribe 140-160 caracteres con CTA." });
  if (onpage.h1_count !== 1) issues.push({ severity: "high", category: "on_page", title: `H1 incorrecto (${onpage.h1_count})`, recommendation: "Mantén exactamente un H1 por página." });
  if (!onpage.has_canonical) issues.push({ severity: "medium", category: "technical", title: "Sin canonical", recommendation: "Agrega <link rel=\"canonical\">." });
  if (!onpage.has_schema_org) issues.push({ severity: "medium", category: "schema", title: "Sin schema.org", recommendation: "Implementa JSON-LD para Rich Results." });
  if (onpage.images_without_alt > 0) issues.push({ severity: "medium", category: "on_page", title: `${onpage.images_without_alt} imágenes sin alt`, recommendation: "Añade alt descriptivo a todas las imágenes." });
  if (perf) {
    if (perf.performance < 50) issues.push({ severity: "critical", category: "ux", title: `Performance ${perf.performance}/100`, recommendation: "Optimiza imágenes, activa Brotli, considera CDN." });
    if (perf.lcp_ms > 2500) issues.push({ severity: "high", category: "ux", title: `LCP ${(perf.lcp_ms/1000).toFixed(1)}s`, recommendation: "Reduce LCP < 2.5s: preload hero, server más cerca." });
    if (perf.cls > 0.1) issues.push({ severity: "medium", category: "ux", title: `CLS ${perf.cls}`, recommendation: "Reserva dimensiones a imágenes/embeds." });
  }
  if (kw?.total_keywords === 0) issues.push({ severity: "high", category: "content", title: "Sin keywords rankeando", recommendation: "Crea contenido orientado a keywords con volumen en tu nicho." });
  if (bl && bl.total_backlinks < 10) issues.push({ severity: "high", category: "backlinks", title: `Solo ${bl.total_backlinks} backlinks`, recommendation: "Inicia campaña de link building: directorios, guest posts, PR digital." });
  return issues;
}

function computeScores(onpage: any, perf: any, kw: any, bl: any) {
  if (!onpage?.reachable) return { total: 0, technical: 0, content: 0, backlinks: 0, ux: 0, serp: 0 };
  const technical = (onpage.has_https ? 30 : 0) + 25 + (onpage.has_canonical ? 20 : 0) + (onpage.has_schema_org ? 15 : 0) + (onpage.has_viewport ? 10 : 0);
  const titleLen = onpage.title?.length ?? 0;
  const descLen = onpage.description?.length ?? 0;
  const content = (titleLen >= 30 && titleLen <= 70 ? 25 : 5) + (descLen >= 70 && descLen <= 170 ? 25 : 5) + (onpage.h1_count === 1 ? 20 : 5) + (onpage.h2_count > 0 ? 15 : 0) + (onpage.images_without_alt === 0 ? 15 : 5);
  const ux = perf ? Math.round(perf.performance * 0.5 + perf.accessibility * 0.25 + perf.best_practices * 0.25) : 50;
  const serp = kw ? Math.min(100, Math.round((kw.total_keywords || 0) / 10) + 20) : 30;
  const backlinks = bl ? Math.min(100, Math.round(Math.log10((bl.total_backlinks || 1) + 1) * 20) + Math.min(40, (bl.referring_domains || 0))) : 0;
  const total = Math.round(technical * 0.3 + content * 0.25 + backlinks * 0.2 + ux * 0.15 + serp * 0.1);
  return { total, technical, content, backlinks, ux, serp };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const domainInput = cleanDomain(body?.domain ?? "");
    if (!domainInput || !domainInput.includes(".")) {
      return new Response(JSON.stringify({ error: "Dominio inválido" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Verify subscription + domain ownership
    const { data: domainRow } = await admin
      .from("seo_audit_domains")
      .select("id, subscription_id, user_id, country_code, language_code")
      .eq("user_id", user.id)
      .eq("domain", domainInput)
      .eq("is_active", true)
      .maybeSingle();

    if (!domainRow) {
      return new Response(JSON.stringify({ error: "Dominio no registrado en tu plan", needs_subscription: true }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: audit } = await admin
      .from("seo_audits")
      .insert({
        domain_id: domainRow.id,
        user_id: user.id,
        domain: domainInput,
        status: "running",
        is_mini: false,
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    const auditId = audit!.id;
    const locationCode = domainRow.country_code === "cl" ? 2152 : 2840;
    const languageCode = domainRow.language_code ?? "es";

    const [onpage, perf, kwData, blData, compData] = await Promise.all([
      fetchOnPage(domainInput),
      fetchPageSpeed(domainInput),
      dfsCall("dataforseo_labs/google/ranked_keywords/live", [{ target: domainInput, location_code: locationCode, language_code: languageCode, limit: 100, order_by: ["ranked_serp_element.serp_item.rank_group,asc"] }]),
      dfsCall("backlinks/summary/live", [{ target: domainInput, internal_list_limit: 10 }]),
      dfsCall("dataforseo_labs/google/competitors_domain/live", [{ target: domainInput, location_code: locationCode, language_code: languageCode, limit: 10 }]),
    ]);

    const kwItems = kwData?.tasks?.[0]?.result?.[0]?.items ?? [];
    const keywords = {
      total_keywords: kwData?.tasks?.[0]?.result?.[0]?.total_count ?? kwItems.length,
      top: kwItems.slice(0, 50).map((it: any) => ({
        keyword: it.keyword_data?.keyword,
        position: it.ranked_serp_element?.serp_item?.rank_group,
        search_volume: it.keyword_data?.keyword_info?.search_volume,
        cpc: it.keyword_data?.keyword_info?.cpc,
        difficulty: it.keyword_data?.keyword_properties?.keyword_difficulty,
        url: it.ranked_serp_element?.serp_item?.url,
      })),
    };
    const blSummary = blData?.tasks?.[0]?.result?.[0];
    const backlinks = blSummary
      ? {
        total_backlinks: blSummary.backlinks ?? 0,
        referring_domains: blSummary.referring_domains ?? 0,
        rank: blSummary.rank ?? 0,
        spam_score: blSummary.backlinks_spam_score ?? 0,
      }
      : null;
    const competitors = (compData?.tasks?.[0]?.result?.[0]?.items ?? []).slice(0, 10).map((c: any) => ({
      domain: c.domain,
      intersections: c.intersections,
      etv: c.full_domain_metrics?.organic?.etv,
      organic_keywords: c.full_domain_metrics?.organic?.count,
    }));

    const issues = buildIssues(onpage, perf, keywords, backlinks);
    const scores = computeScores(onpage, perf, keywords, backlinks);

    await admin.from("seo_audits").update({
      status: "completed",
      score_total: scores.total,
      score_technical: scores.technical,
      score_content: scores.content,
      score_backlinks: scores.backlinks,
      score_ux: scores.ux,
      score_serp: scores.serp,
      report_data: { onpage, performance: perf, keywords, backlinks, competitors, issues },
      completed_at: new Date().toISOString(),
    }).eq("id", auditId);

    if (issues.length) {
      await admin.from("seo_audit_issues").insert(issues.map((i) => ({
        audit_id: auditId,
        user_id: user.id,
        category: i.category,
        severity: i.severity,
        title: i.title,
        recommendation: i.recommendation,
      })));
    }

    if (keywords.top.length) {
      await admin.from("seo_audit_keywords").insert(keywords.top.map((k: any) => ({
        domain_id: domainRow.id,
        user_id: user.id,
        keyword: k.keyword,
        position: k.position,
        search_volume: k.search_volume,
        cpc: k.cpc,
        difficulty: k.difficulty,
        url: k.url,
      })));
    }

    await admin.from("seo_audit_domains").update({
      last_audited_at: new Date().toISOString(),
      current_score: scores.total,
    }).eq("id", domainRow.id);

    return new Response(JSON.stringify({ success: true, audit_id: auditId, scores, issues_count: issues.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[seo-audit-full]", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
