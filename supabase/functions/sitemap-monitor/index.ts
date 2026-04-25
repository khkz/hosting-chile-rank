// Sitemap Monitor: valida que sitemap.xml y sus sitemaps hijos existan,
// devuelvan 200, sean XML válido y contengan rutas críticas.
// Diseñado para correr vía cron diario y reportar fallos en logs (consultable
// desde el dashboard) y opcionalmente como alert via webhook.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_ROOT = 'https://eligetuhosting.cl';

// Sitemap index esperado
const INDEX_URL = `${SITE_ROOT}/sitemap.xml`;

// Sitemaps hijos esperados (deben aparecer en el index)
const EXPECTED_CHILD_SITEMAPS = [
  `${SITE_ROOT}/sitemap-main.xml`,
  `${SITE_ROOT}/sitemap-wiki.xml`,
  `${SITE_ROOT}/sitemap-asn.xml`,
  `${SITE_ROOT}/sitemap-domains.xml`,
];

// Rutas CRÍTICAS que SIEMPRE deben estar en sitemap-main.xml.
// Si alguna falta, se considera fallo bloqueante.
const CRITICAL_MAIN_ROUTES = [
  '/',
  '/mejor-hosting-chile-2026',
  '/ranking',
  '/comparativa',
  '/transparencia-hosting-chile',
  '/reclamos',
  '/catalogo',
  '/vs/comparahosting',
  '/vs/mejorhosting',
  '/vs/rankinghosting',
  '/vs/hostingexperto',
  '/nuestro-metodo',
  '/dominios-premium',
  '/certificaciones',
];

interface CheckResult {
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
  urlCount?: number;
  missingRoutes?: string[];
}

async function fetchText(url: string): Promise<{ status: number; body: string }> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'EligeTuHosting-SitemapMonitor/1.0' },
  });
  return { status: res.status, body: await res.text() };
}

function extractLocs(xml: string): string[] {
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  return Array.from(matches, (m) => m[1].trim());
}

async function checkIndex(): Promise<CheckResult> {
  try {
    const { status, body } = await fetchText(INDEX_URL);
    if (status !== 200) {
      return { url: INDEX_URL, ok: false, status, error: `HTTP ${status}` };
    }
    if (!body.includes('<sitemapindex')) {
      return { url: INDEX_URL, ok: false, status, error: 'Not a sitemap index (missing <sitemapindex>)' };
    }
    const childUrls = extractLocs(body);
    const missing = EXPECTED_CHILD_SITEMAPS.filter((u) => !childUrls.includes(u));
    return {
      url: INDEX_URL,
      ok: missing.length === 0,
      status,
      urlCount: childUrls.length,
      missingRoutes: missing.length ? missing : undefined,
      error: missing.length ? `Missing child sitemaps: ${missing.join(', ')}` : undefined,
    };
  } catch (err) {
    return { url: INDEX_URL, ok: false, error: (err as Error).message };
  }
}

async function checkChildSitemap(
  url: string,
  requiredRoutes: string[] = []
): Promise<CheckResult> {
  try {
    const { status, body } = await fetchText(url);
    if (status !== 200) {
      return { url, ok: false, status, error: `HTTP ${status}` };
    }
    if (!body.includes('<urlset')) {
      return { url, ok: false, status, error: 'Not a urlset (missing <urlset>)' };
    }
    const locs = extractLocs(body);
    const locPaths = new Set(locs.map((l) => l.replace(SITE_ROOT, '')));
    const missing = requiredRoutes.filter((r) => !locPaths.has(r));
    return {
      url,
      ok: missing.length === 0,
      status,
      urlCount: locs.length,
      missingRoutes: missing.length ? missing : undefined,
      error: missing.length ? `Missing critical routes: ${missing.join(', ')}` : undefined,
    };
  } catch (err) {
    return { url, ok: false, error: (err as Error).message };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = new Date().toISOString();
  const results: CheckResult[] = [];

  // 1. Validar sitemap index
  const indexResult = await checkIndex();
  results.push(indexResult);

  // 2. Validar cada sitemap hijo
  results.push(await checkChildSitemap(`${SITE_ROOT}/sitemap-main.xml`, CRITICAL_MAIN_ROUTES));
  results.push(await checkChildSitemap(`${SITE_ROOT}/sitemap-wiki.xml`));
  results.push(await checkChildSitemap(`${SITE_ROOT}/sitemap-asn.xml`));
  results.push(await checkChildSitemap(`${SITE_ROOT}/sitemap-domains.xml`));

  const failed = results.filter((r) => !r.ok);
  const ok = failed.length === 0;

  // Log estructurado para consultar desde el dashboard de edge functions
  if (ok) {
    console.log(
      `✅ Sitemap monitor OK at ${startedAt}. Checked ${results.length} URLs. Total URLs in sitemaps: ${results.reduce((s, r) => s + (r.urlCount || 0), 0)}`
    );
  } else {
    console.error(
      `🚨 Sitemap monitor FAILED at ${startedAt}. ${failed.length}/${results.length} checks failed:`
    );
    for (const f of failed) {
      console.error(`  - ${f.url}: ${f.error || 'unknown error'} (status=${f.status ?? 'n/a'})`);
      if (f.missingRoutes?.length) {
        for (const r of f.missingRoutes) console.error(`      missing: ${r}`);
      }
    }
  }

  return new Response(
    JSON.stringify({
      ok,
      checkedAt: startedAt,
      summary: {
        total: results.length,
        passed: results.length - failed.length,
        failed: failed.length,
        totalUrls: results.reduce((s, r) => s + (r.urlCount || 0), 0),
      },
      results,
    }),
    {
      status: ok ? 200 : 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
});
