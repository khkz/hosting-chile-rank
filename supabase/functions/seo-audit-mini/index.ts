// Mini SEO Audit — public, rate-limited demo for the landing page.
// Combines PageSpeed Insights, on-page HTML scraping and (when configured)
// DataForSEO ranked_keywords to deliver an instant value preview.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DAILY_LIMIT = 10;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PAGESPEED_KEY = Deno.env.get("GOOGLE_PAGESPEED_API_KEY");
const DFS_LOGIN = Deno.env.get("DATAFORSEO_LOGIN");
const DFS_PASSWORD = Deno.env.get("DATAFORSEO_PASSWORD");

function cleanDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9.-]/g, "");
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + "::seo-audit-salt");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkRateLimit(supabase: any, ipHash: string): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("seo_audit_rate_limit")
    .select("count")
    .eq("ip_hash", ipHash)
    .eq("bucket_date", today)
    .maybeSingle();
  const current = data?.count ?? 0;
  if (current >= DAILY_LIMIT) return false;
  await supabase
    .from("seo_audit_rate_limit")
    .upsert(
      {
        ip_hash: ipHash,
        bucket_date: today,
        count: current + 1,
        last_request_at: new Date().toISOString(),
      },
      { onConflict: "ip_hash,bucket_date" },
    );
  return true;
}

async function fetchOnPage(domain: string) {
  try {
    const url = `https://${domain}`;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "EligeTuHostingBot/1.0 SEO-Audit" },
    });
    clearTimeout(timeout);
    const html = await res.text();
    const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? null;
    const description = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i.exec(html)?.[1] ?? null;
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
    const imgs = html.match(/<img[^>]*>/gi) || [];
    const imgsWithoutAlt = imgs.filter((t) => !/\salt\s*=/i.test(t)).length;
    const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
    const hasOg = /<meta[^>]+property=["']og:/i.test(html);
    const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const hasSchema = /application\/ld\+json/i.test(html);
    const robotsMeta = /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i.exec(html)?.[1] ?? null;
    const noindex = robotsMeta?.toLowerCase().includes("noindex") ?? false;
    const hasHttps = res.url.startsWith("https://");
    return {
      reachable: true,
      status: res.status,
      final_url: res.url,
      title,
      title_length: title?.length ?? 0,
      description,
      description_length: description?.length ?? 0,
      h1_count: h1Count,
      h2_count: h2Count,
      images_total: imgs.length,
      images_without_alt: imgsWithoutAlt,
      has_canonical: hasCanonical,
      has_og_tags: hasOg,
      has_viewport: hasViewport,
      has_schema_org: hasSchema,
      noindex,
      has_https: hasHttps,
      html_size_kb: Math.round(html.length / 1024),
    };
  } catch (err) {
    return { reachable: false, error: (err as Error).message };
  }
}

async function fetchPageSpeed(domain: string) {
  if (!PAGESPEED_KEY) return null;
  try {
    const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(`https://${domain}`)}&strategy=mobile&category=performance&category=seo&category=accessibility&category=best-practices&key=${PAGESPEED_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const cats = data.lighthouseResult?.categories ?? {};
    const audits = data.lighthouseResult?.audits ?? {};
    return {
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
      accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
      best_practices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
      lcp_ms: Math.round(audits["largest-contentful-paint"]?.numericValue ?? 0),
      fcp_ms: Math.round(audits["first-contentful-paint"]?.numericValue ?? 0),
      cls: Number((audits["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(3)),
      tbt_ms: Math.round(audits["total-blocking-time"]?.numericValue ?? 0),
      speed_index_ms: Math.round(audits["speed-index"]?.numericValue ?? 0),
    };
  } catch {
    return null;
  }
}

async function fetchDfsKeywords(domain: string) {
  if (!DFS_LOGIN || !DFS_PASSWORD) return null;
  try {
    const auth = btoa(`${DFS_LOGIN}:${DFS_PASSWORD}`);
    const res = await fetch(
      "https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live",
      {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify([{
          target: domain,
          location_code: 2152,
          language_code: "es",
          limit: 10,
          order_by: ["ranked_serp_element.serp_item.rank_group,asc"],
        }]),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
    return {
      total_keywords: data.tasks?.[0]?.result?.[0]?.total_count ?? items.length,
      top: items.slice(0, 5).map((it: any) => ({
        keyword: it.keyword_data?.keyword,
        position: it.ranked_serp_element?.serp_item?.rank_group,
        search_volume: it.keyword_data?.keyword_info?.search_volume,
        cpc: it.keyword_data?.keyword_info?.cpc,
        difficulty: it.keyword_data?.keyword_properties?.keyword_difficulty,
        url: it.ranked_serp_element?.serp_item?.url,
      })),
    };
  } catch {
    return null;
  }
}

function buildIssues(onpage: any, perf: any): Array<{ severity: string; category: string; title: string; recommendation: string }> {
  const issues: any[] = [];
  if (!onpage?.reachable) {
    issues.push({ severity: "critical", category: "technical", title: "Sitio inaccesible", recommendation: "Verifica que el dominio resuelva y responda con código 200." });
    return issues;
  }
  if (!onpage.has_https) issues.push({ severity: "critical", category: "security", title: "Sitio sin HTTPS", recommendation: "Instala un certificado SSL gratuito (Let's Encrypt) y fuerza redirección 301 a HTTPS." });
  if (onpage.noindex) issues.push({ severity: "critical", category: "technical", title: "Página con noindex", recommendation: "Eliminar la meta robots=noindex si quieres aparecer en Google." });
  if (!onpage.title || onpage.title_length < 30) issues.push({ severity: "high", category: "on_page", title: "Title débil o ausente", recommendation: "Crea un <title> entre 50-60 caracteres con tu keyword principal." });
  if (onpage.title_length > 70) issues.push({ severity: "medium", category: "on_page", title: "Title demasiado largo", recommendation: "Acorta el <title> a 60 caracteres para evitar truncamiento en SERP." });
  if (!onpage.description || onpage.description_length < 70) issues.push({ severity: "high", category: "on_page", title: "Meta description débil", recommendation: "Escribe una meta description de 140-160 caracteres con CTA y keyword." });
  if (onpage.h1_count === 0) issues.push({ severity: "high", category: "on_page", title: "Sin H1", recommendation: "Añade un único H1 descriptivo con tu keyword principal." });
  if (onpage.h1_count > 1) issues.push({ severity: "medium", category: "on_page", title: `${onpage.h1_count} H1s detectados`, recommendation: "Mantén un único H1 por página." });
  if (!onpage.has_canonical) issues.push({ severity: "medium", category: "technical", title: "Sin canonical", recommendation: "Agrega <link rel=\"canonical\"> para evitar contenido duplicado." });
  if (!onpage.has_og_tags) issues.push({ severity: "low", category: "on_page", title: "Sin Open Graph", recommendation: "Añade meta og:title, og:description y og:image para previews sociales." });
  if (!onpage.has_viewport) issues.push({ severity: "high", category: "mobile", title: "Sin meta viewport", recommendation: "Agrega <meta name=\"viewport\"> para que el sitio sea mobile-friendly." });
  if (!onpage.has_schema_org) issues.push({ severity: "medium", category: "schema", title: "Sin datos estructurados", recommendation: "Añade JSON-LD schema.org (Organization, Product, Article) para Rich Results." });
  if (onpage.images_without_alt > 0) issues.push({ severity: "medium", category: "on_page", title: `${onpage.images_without_alt} imágenes sin alt`, recommendation: "Añade atributo alt descriptivo a todas las imágenes para accesibilidad y SEO." });
  if (onpage.html_size_kb > 500) issues.push({ severity: "medium", category: "ux", title: "HTML muy pesado", recommendation: "Reduce HTML inline, mueve estilos y scripts a archivos externos cacheables." });
  if (perf) {
    if (perf.performance < 50) issues.push({ severity: "critical", category: "ux", title: `Performance pobre (${perf.performance}/100)`, recommendation: "Optimiza imágenes, activa cache y compresión Brotli/Gzip." });
    else if (perf.performance < 75) issues.push({ severity: "high", category: "ux", title: `Performance mejorable (${perf.performance}/100)`, recommendation: "Reduce JavaScript no usado y prioriza Core Web Vitals." });
    if (perf.lcp_ms > 2500) issues.push({ severity: "high", category: "ux", title: `LCP lento (${(perf.lcp_ms/1000).toFixed(1)}s)`, recommendation: "Acelera el render del contenido principal: preload hero image, server más cerca." });
    if (perf.cls > 0.1) issues.push({ severity: "medium", category: "ux", title: `CLS alto (${perf.cls})`, recommendation: "Reserva dimensiones a imágenes y embeds para evitar layout shifts." });
    if (perf.seo < 90) issues.push({ severity: "medium", category: "on_page", title: `SEO Lighthouse ${perf.seo}/100`, recommendation: "Resuelve los hallazgos del audit SEO de Lighthouse." });
  }
  return issues;
}

function computeScores(onpage: any, perf: any, kw: any) {
  if (!onpage?.reachable) {
    return { total: 0, technical: 0, content: 0, backlinks: 0, ux: 0, serp: 0 };
  }
  const technical =
    (onpage.has_https ? 30 : 0) +
    (onpage.noindex ? 0 : 25) +
    (onpage.has_canonical ? 20 : 0) +
    (onpage.has_schema_org ? 15 : 0) +
    (onpage.has_viewport ? 10 : 0);
  const content =
    (onpage.title_length >= 30 && onpage.title_length <= 70 ? 25 : 5) +
    (onpage.description_length >= 70 && onpage.description_length <= 170 ? 25 : 5) +
    (onpage.h1_count === 1 ? 20 : 5) +
    (onpage.h2_count > 0 ? 15 : 0) +
    (onpage.images_total > 0 && onpage.images_without_alt === 0 ? 15 : 5);
  const ux = perf
    ? Math.round((perf.performance * 0.5 + perf.accessibility * 0.25 + perf.best_practices * 0.25))
    : 50;
  const serp = kw
    ? Math.min(100, Math.round((kw.total_keywords || 0) / 10) + 30)
    : 30;
  const backlinks = 0; // mini-audit no incluye backlinks
  const total = Math.round(
    technical * 0.30 +
    content * 0.25 +
    backlinks * 0.20 +
    ux * 0.15 +
    serp * 0.10,
  );
  return { total, technical, content, backlinks, ux, serp };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json();
    const domain = cleanDomain(body?.domain ?? "");
    if (!domain || !domain.includes(".") || domain.length > 253) {
      return new Response(JSON.stringify({ error: "Dominio inválido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ipHash = await hashIp(ip);

    const allowed = await checkRateLimit(supabase, ipHash);
    if (!allowed) {
      return new Response(JSON.stringify({
        error: "Límite diario alcanzado",
        message: `Has usado tus ${DAILY_LIMIT} análisis gratuitos de hoy. Suscríbete para análisis ilimitados.`,
      }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const [onpage, performance, keywords] = await Promise.all([
      fetchOnPage(domain),
      fetchPageSpeed(domain),
      fetchDfsKeywords(domain),
    ]);
    const issues = buildIssues(onpage, performance);
    const scores = computeScores(onpage, performance, keywords);

    const { data: audit } = await supabase
      .from("seo_audits")
      .insert({
        domain,
        status: "completed",
        is_mini: true,
        score_total: scores.total,
        score_technical: scores.technical,
        score_content: scores.content,
        score_backlinks: scores.backlinks,
        score_ux: scores.ux,
        score_serp: scores.serp,
        report_data: { onpage, performance, keywords, issues },
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    return new Response(JSON.stringify({
      success: true,
      audit_id: audit?.id,
      domain,
      scores,
      onpage,
      performance,
      keywords,
      issues,
      data_sources: {
        pagespeed: !!performance,
        dataforseo: !!keywords,
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[seo-audit-mini] error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
