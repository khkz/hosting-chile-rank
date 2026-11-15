import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { CL_PAGES, RESENAS_EN_SITEMAP, announceable, resenaSlugs } from './lib/cl-pages.mjs';

// Slugs de comparativas vs/ rivales (sitios de comparación falsa)
const VS_RIVALS = ['comparahosting', 'rankinghosting'];

// Comparativas 1 a 1 (/comparativa/a-vs-b): por ahora solo se anuncia el hub /comparativa.
// Las parejas son todas las combinaciones del catálogo y no hay todavía una regla de contenido
// que diga cuáles valen la pena; cuando exista, se reactiva aquí.
const INCLUDE_PAIR_COMPARISONS = false;

// Anon key hardcoded fallback (mismo valor público de src/integrations/supabase/client.ts).
// CRÍTICO: en el deploy real de Lovable NO están seteadas las envs SUPABASE_*, así que
// sin este fallback fetchCountryProviders devolvía [] y el sitemap salía sin fichas /pais/slug.
const SUPABASE_URL_FALLBACK = 'https://oegvwjxrlmtwortyhsrv.supabase.co';
const SUPABASE_ANON_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA4NzEsImV4cCI6MjA2MjAzNjg3MX0.ruA3v0xiTGgH2vubqAnWPgbvwSOlaVp7Oc0e2YeZq4M';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK;
const ANON = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || SUPABASE_ANON_FALLBACK;

// Solo empresas de Chile (country=CL, el mismo filtro de generate-llms-data.mjs): las fichas
// LATAM viven en eligetuhosting.com y su /catalogo/:slug en .cl declara otro canonical.
async function fetchVerifiedCompanySlugs() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/hosting_companies?select=slug,updated_at&is_verified=eq.true&country=eq.CL`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    console.log(`📦 ${data.length} empresas verificadas de Chile para /catalogo/`);
    return data;
  } catch (e) {
    console.log('⚠️  Error fetching companies:', e.message);
    return [];
  }
}

async function fetchCountryProviders() {
  const COUNTRIES = [['PE','pe'],['MX','mx'],['CO','co'],['AR','ar']];
  const out = [];
  for (const [code, cslug] of COUNTRIES) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/hosting_companies?select=slug,updated_at&is_verified=eq.true&country=eq.${code}`, {
        headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const r of data) out.push({ country: cslug, slug: r.slug, updated_at: r.updated_at });
      console.log(`🌎 ${data.length} fichas ${code}`);
    } catch (e) {
      console.log(`⚠️  Error fetching ${code}:`, e.message);
    }
  }
  return out;
}

// Read wiki terms from TypeScript file as text and extract slugs
function extractWikiSlugs() {
  try {
    const content = readFileSync('src/data/wiki/terms.ts', 'utf8');
    const slugMatches = content.match(/slug:\s*['"]([^'"]+)['"]/g);
    // Sin repetidos: terms.ts trae algunos slugs dos veces y el sitemap los duplicaba.
    const unique = [...new Set((slugMatches || []).map(match => match.match(/slug:\s*['"]([^'"]+)['"]/)[1]))];
    return unique.map(slug => ({ slug }));
  } catch (error) {
    console.log('⚠️  No se pudo leer términos wiki:', error.message);
    return [];
  }
}

const wikiTerms = extractWikiSlugs();

// Lista de ASN chilenos principales (REDUCIDA - solo top 10 para evitar penalización)
const CHILEAN_ASNS = [
  // Telecom principales
  { asn: 13489, name: 'Movistar Chile', priority: '0.7' },
  { asn: 22047, name: 'VTR', priority: '0.7' },
  { asn: 14117, name: 'Claro Chile', priority: '0.7' },
  { asn: 23201, name: 'Entel Chile', priority: '0.7' },
  { asn: 27651, name: 'Entel PCS', priority: '0.6' },
  
  // Hosting principales chilenos
  { asn: 269840, name: 'HostingPlus Chile', priority: '0.7' },
  { asn: 262589, name: 'Ecohosting Chile', priority: '0.7' },
  { asn: 28006, name: 'NIC Chile', priority: '0.6' },
  
  // ISPs importantes
  { asn: 18863, name: 'GTD Internet', priority: '0.6' },
  { asn: 16629, name: 'REUNA', priority: '0.6' },
];

const ROOT = 'https://eligetuhosting.cl';
const NOW = new Date().toISOString();

/* ---------- helpers ---------------------------------------------------- */
// LATAM (eligetuhosting.com): sin cambios.
const urlTag = (loc, prio = '0.7', changefreq = 'weekly', lastmod = NOW) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${prio}</priority>
  </url>`;

// Chile (eligetuhosting.cl): <lastmod> solo cuando hay una fecha real del dato; nunca la hora del script.
const clTag = (loc, prio = '0.7', changefreq = 'weekly', lastmod = null) => `
  <url>
    <loc>${loc}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${prio}</priority>
  </url>`;

// Filtra rutas de Chile con la regla de lib/cl-pages.mjs y registra las que se omiten.
const omitted = [];
const announce = (path) => {
  const { ok, reason } = announceable(path);
  if (!ok) omitted.push(`${path} (${reason})`);
  return ok;
};
let clCount = 0;
const clUrls = (items) => {
  const out = items.filter((it) => announce(it.path));
  clCount += out.length;
  return out.map((it) => clTag(`${ROOT}${it.path}`, it.prio, it.freq, it.lastmod)).join('');
};

/* ---------- SITEMAP 1: MAIN (páginas principales) ---------------------- */
const generateMainSitemap = (companySlugs = [], countryProviders = []) => {
  // Páginas fijas y hubs de intención (lista única en lib/cl-pages.mjs)
  const staticUrls = clUrls(CL_PAGES);

  // Comparativas VS rivales falsos
  const vsRivalUrls = clUrls(VS_RIVALS.map(slug => ({ path: `/vs/${slug}`, prio: '0.9', freq: 'weekly' })));

  // Comparativas programáticas (parejas): desactivadas, ver INCLUDE_PAIR_COMPARISONS
  const verifiedSlugs = companySlugs.map(c => c.slug);
  const ANCHORS = new Set(['hostingplus', 'ecohosting']);
  const isAnchor = (s) => ANCHORS.has(s);
  const canonicalPair = (x, y) => {
    if (isAnchor(x) && !isAnchor(y)) return `${y}-vs-${x}`;
    if (isAnchor(y) && !isAnchor(x)) return `${x}-vs-${y}`;
    if (isAnchor(x) && isAnchor(y)) return x === 'hostingplus' ? `${x}-vs-${y}` : `${y}-vs-${x}`;
    return x < y ? `${x}-vs-${y}` : `${y}-vs-${x}`;
  };
  const pairSet = new Set();
  if (INCLUDE_PAIR_COMPARISONS) {
    for (let i = 0; i < verifiedSlugs.length; i++) {
      for (let j = i + 1; j < verifiedSlugs.length; j++) {
        pairSet.add(`/comparativa/${canonicalPair(verifiedSlugs[i], verifiedSlugs[j])}`);
      }
    }
  }
  const programmaticVsUrls = clUrls([...pairSet].map(p => ({ path: p, prio: '0.7', freq: 'weekly' })));

  // Alternativas a X (competidores de Chile excepto anchors)
  const alternativasUrls = clUrls(verifiedSlugs
    .filter(s => !isAnchor(s))
    .map(s => ({ path: `/alternativas-a/${s}`, prio: '0.7', freq: 'weekly' })));

  // Landings de migración (8 competidores objetivo)
  const migrationSlugs = ['hostgator','bluehost','godaddy','hostingcl','planetahosting','fasthosting','cloudhosting','webhosting'];
  const migrarUrls = clUrls(migrationSlugs
    .filter(s => verifiedSlugs.includes(s))
    .map(s => ({ path: `/migrar-de/${s}`, prio: '0.8', freq: 'weekly' })));

  // Reseñas editoriales: solo las que ya se anunciaban y que /resenas/:slug sí renderiza
  const hostingReviews = clUrls(resenaSlugs()
    .filter(slug => RESENAS_EN_SITEMAP.includes(slug))
    .map(slug => ({ path: `/resenas/${slug}`, prio: '0.8', freq: 'weekly' })));

  // Detalle de empresas verificadas de Chile (/catalogo/:slug); lastmod = updated_at del registro
  const catalogoUrls = clUrls(companySlugs
    .map(c => ({ path: `/catalogo/${c.slug}`, prio: '0.7', freq: 'weekly', lastmod: c.updated_at || null })));

  // Multi-country .com URLs con alternates hreflang bidireccionales
  const HREFLANG_CLUSTER = [
    { hreflang: 'es-CL', href: 'https://eligetuhosting.cl/' },
    { hreflang: 'es-PE', href: 'https://eligetuhosting.com/pe' },
    { hreflang: 'es-MX', href: 'https://eligetuhosting.com/mx' },
    { hreflang: 'es-CO', href: 'https://eligetuhosting.com/co' },
    { hreflang: 'es-AR', href: 'https://eligetuhosting.com/ar' },
    { hreflang: 'x-default', href: 'https://eligetuhosting.com/latam' },
  ];
  const alternatesXml = HREFLANG_CLUSTER
    .map(a => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
    .join('\n');
  const dotComUrls = [
    'https://eligetuhosting.com/',
    'https://eligetuhosting.com/latam',
    'https://eligetuhosting.com/datos',
    'https://eligetuhosting.com/pe',
    'https://eligetuhosting.com/mx',
    'https://eligetuhosting.com/co',
    'https://eligetuhosting.com/ar',
  ].map(loc => `  <url>
    <loc>${loc}</loc>
    <lastmod>${NOW}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
${alternatesXml}
  </url>`).join('\n');

  // Fichas por país LATAM (/pe/:slug, /mx/:slug, /co/:slug, /ar/:slug) — sin alternates hreflang
  const countryProviderUrls = countryProviders
    .map(c => `  <url>
    <loc>https://eligetuhosting.com/${c.country}/${c.slug}</loc>
    <lastmod>${c.updated_at || NOW}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${vsRivalUrls}
${programmaticVsUrls}
${alternativasUrls}
${migrarUrls}
${hostingReviews}
${catalogoUrls}
${dotComUrls}
${countryProviderUrls}
</urlset>`.trimStart();
};


/* ---------- SITEMAP 2: WIKI -------------------------------------------- */
const generateWikiSitemap = () => {
  const wikiIndex = clUrls([{ path: '/wiki', prio: '0.8', freq: 'weekly' }]);

  const wikiUrls = clUrls(wikiTerms.map(term => ({ path: `/wiki/${term.slug}`, prio: '0.7', freq: 'weekly' })));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${wikiIndex}
${wikiUrls}
</urlset>`.trimStart();
};

/* ---------- SITEMAP 3: ASN (NUEVO) ------------------------------------- */
const generateASNSitemap = () => {
  // Páginas principales de ASN
  // Sin el filtro de canonical: el HTML estático de estas dos rutas trae un canonical a
  // 127.0.0.1 (artefacto del prerender, la página arma el canonical con window.location).
  // En producción la app lo corrige al renderizar; el HTML se rehace en el prerender.
  const asnMainPages = [
    clTag(`${ROOT}/asn`, '0.8', 'weekly'),
    clTag(`${ROOT}/asn/chile`, '0.9', 'weekly'),
  ].join('');
  clCount += 2;

  // ASN por número (/asn/AS*) están bloqueados por robots.txt para Googlebot;
  // no los incluimos en el sitemap para no reportar URLs bloqueadas.

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${asnMainPages}
</urlset>`.trimStart();
};

/* Las fichas /domain/:slug ya no se anuncian: son resultados de la herramienta de análisis
   (noindex) y no páginas para buscadores. Antes salían en sitemap-domains.xml. */

/* ---------- SITEMAP PAÍS (LATAM: PE/MX/CO/AR) --------------------------- */
const COUNTRY_LONG = { pe: 'peru', mx: 'mexico', co: 'colombia', ar: 'argentina' };
const generateCountrySitemap = (cslug, providers) => {
  const ROOT_COM = 'https://eligetuhosting.com';
  const urls = [];
  urls.push(urlTag(`${ROOT_COM}/${cslug}`, '0.9', 'weekly'));
  urls.push(urlTag(`${ROOT_COM}/${cslug}/mejor-hosting-${COUNTRY_LONG[cslug]}-2026`, '0.9', 'weekly'));
  urls.push(urlTag(`${ROOT_COM}/${cslug}/hosting-con-datacenter-local`, '0.8', 'weekly'));
  urls.push(urlTag(`${ROOT_COM}/${cslug}/benchmark`, '0.8', 'daily'));
  // Fichas
  for (const p of providers) {
    urls.push(urlTag(`${ROOT_COM}/${cslug}/${p.slug}`, '0.7', 'weekly', p.updated_at || NOW));
  }
  // Comparativas: TODAS las parejas canónicas dentro del país
  const slugs = providers.map(p => p.slug).sort();
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      urls.push(urlTag(`${ROOT_COM}/${cslug}/comparativa/${slugs[i]}-vs-${slugs[j]}`, '0.6', 'monthly'));
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`.trimStart();
};

/* ---------- SITEMAP INDEX (archivo principal) -------------------------- */
const generateSitemapIndex = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${ROOT}/sitemap-main.xml</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${ROOT}/sitemap-wiki.xml</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${ROOT}/sitemap-asn.xml</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://eligetuhosting.com/sitemap-pe.xml</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://eligetuhosting.com/sitemap-mx.xml</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://eligetuhosting.com/sitemap-co.xml</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://eligetuhosting.com/sitemap-ar.xml</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>
</sitemapindex>`.trimStart();
};

/* ---------- Generar todos los sitemaps --------------------------------- */
await fs.mkdir('public', { recursive: true });

// Generar sitemap index
const sitemapIndex = generateSitemapIndex();
await fs.writeFile('public/sitemap.xml', sitemapIndex, 'utf8');
console.log('✅  sitemap.xml (index) generado');

// Generar sitemap-main.xml (con slugs de catálogo desde Supabase)
const companySlugs = await fetchVerifiedCompanySlugs();
const countryProviders = await fetchCountryProviders();
const mainSitemap = generateMainSitemap(companySlugs, countryProviders);
await fs.writeFile('public/sitemap-main.xml', mainSitemap, 'utf8');
console.log(`✅  sitemap-main.xml generado (incluye ${VS_RIVALS.length} VS-rivals + ${companySlugs.length} catálogo + ${countryProviders.length} fichas LATAM)`);

// Generar sitemap-wiki.xml
const wikiSitemap = generateWikiSitemap();
await fs.writeFile('public/sitemap-wiki.xml', wikiSitemap, 'utf8');
console.log('✅  sitemap-wiki.xml generado');

// Generar sitemap-asn.xml (NUEVO)
const asnSitemap = generateASNSitemap();
await fs.writeFile('public/sitemap-asn.xml', asnSitemap, 'utf8');
console.log('✅  sitemap-asn.xml generado (páginas ASN)');

console.log(`✅  Chile: ${clCount} URL de eligetuhosting.cl anunciadas`);
if (omitted.length) console.log(`ℹ️  Omitidas por la regla de canonical/noindex (${omitted.length}): ${omitted.join(', ')}`);

// Generar sitemaps por país LATAM
for (const cslug of ['pe','mx','co','ar']) {
  const providersOfCountry = countryProviders.filter(p => p.country === cslug);
  const xml = generateCountrySitemap(cslug, providersOfCountry);
  await fs.writeFile(`public/sitemap-${cslug}.xml`, xml, 'utf8');
  const pairs = providersOfCountry.length * (providersOfCountry.length - 1) / 2;
  console.log(`✅  sitemap-${cslug}.xml generado (${providersOfCountry.length} fichas + ${pairs} comparativas)`);
}

console.log('✨  Sistema de sitemaps jerárquico completado');

/* ---------- IndexNow (reemplaza pings deprecados de Google/Bing) ---------- */
async function notifyIndexNow() {
  const KEY = 'a7f3e9b2c84d4f1e8d6a2b5c9e0f3a17';
  try {
    const urls = [
      `${ROOT}/`,
      `${ROOT}/sitemap.xml`,
      `${ROOT}/transparencia-hosting-chile`,
      `${ROOT}/ranking`,
      `${ROOT}/catalogo`,
      ...VS_RIVALS.map(s => `${ROOT}/vs/${s}`),
    ];
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'eligetuhosting.cl',
        key: KEY,
        keyLocation: `${ROOT}/${KEY}.txt`,
        urlList: urls,
      }),
    });
    console.log(res.ok ? `✅  IndexNow notificado (${urls.length} URLs)` : `⚠️  IndexNow status: ${res.status}`);
  } catch (e) {
    console.log('⚠️  Error IndexNow:', e.message);
  }
}

await notifyIndexNow();
