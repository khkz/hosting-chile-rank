import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const providers = require('./providers.json');

// Slugs de comparativas vs/ rivales (sitios de comparación falsa)
const VS_RIVALS = ['comparahosting', 'mejorhosting', 'rankinghosting', 'hostingexperto'];

// Anon key hardcoded fallback (mismo valor público de src/integrations/supabase/client.ts).
// CRÍTICO: en el deploy real de Lovable NO están seteadas las envs SUPABASE_*, así que
// sin este fallback fetchCountryProviders devolvía [] y el sitemap salía sin fichas /pais/slug.
const SUPABASE_URL_FALLBACK = 'https://oegvwjxrlmtwortyhsrv.supabase.co';
const SUPABASE_ANON_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA4NzEsImV4cCI6MjA2MjAzNjg3MX0.ruA3v0xiTGgH2vubqAnWPgbvwSOlaVp7Oc0e2YeZq4M';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK;
const ANON = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || SUPABASE_ANON_FALLBACK;

async function fetchVerifiedCompanySlugs() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/hosting_companies?select=slug,updated_at&is_verified=eq.true`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    console.log(`📦 ${data.length} empresas verificadas para /catalogo/`);
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
    return slugMatches ? slugMatches.map(match => {
      const slug = match.match(/slug:\s*['"]([^'"]+)['"]/)[1];
      return { slug };
    }) : [];
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
const urlTag = (loc, prio = '0.7', changefreq = 'weekly', lastmod = NOW) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${prio}</priority>
  </url>`;

/* ---------- SITEMAP 1: MAIN (páginas principales) ---------------------- */
const generateMainSitemap = (companySlugs = [], countryProviders = []) => {
  const staticUrls = [
    // Páginas de máxima prioridad
    ['/mejor-hosting-chile-2026', '1.0', 'daily'],
    ['/mejor-hosting-chile-2025', '0.9', 'monthly'],
    ['/', '0.9', 'daily'],
    ['/ranking', '0.9', 'daily'],
    // /directorio-hosting-chile es noindex (canonical → /catalogo), no listar en sitemap

    // Transparencia y comparativas anti-fake (CRÍTICO para SEO/GEO)
    ['/transparencia-hosting-chile', '0.9', 'weekly'],
    ['/reclamos', '0.9', 'daily'],

    // Páginas de alta prioridad
    ['/catalogo', '0.8', 'daily'],
    ['/directorio', '0.8', 'daily'],
    ['/mejor-hosting-chile', '0.8', 'daily'],
    ['/mejor-hosting-wordpress-chile', '0.8', 'weekly'],
    ['/mejor-hosting-ecommerce-chile', '0.8', 'weekly'],
    ['/comparativa', '0.8', 'weekly'],
    ['/cotiza-hosting', '0.8', 'weekly'],
    ['/recursos-hosting-chile', '0.7', 'weekly'],
    ['/dominios-premium', '0.7', 'weekly'],
    ['/certificaciones', '0.7', 'monthly'],

    // Guías (contenido de valor)
    ['/guia-elegir-hosting', '0.8', 'weekly'],
    ['/guia-completa-elegir-hosting', '0.8', 'weekly'],
    ['/guia-hosting-wordpress', '0.8', 'weekly'],
    ['/guia-elegir-vps', '0.8', 'weekly'],
    ['/guia-elegir-ssl', '0.8', 'weekly'],
    ['/guia-elegir-cdn', '0.8', 'weekly'],
    ['/guia-elegir-servidor-dedicado', '0.8', 'weekly'],
    ['/guia-migrar-hosting', '0.8', 'weekly'],
    ['/guia-seguridad-web', '0.8', 'weekly'],
    ['/errores-comunes-hosting', '0.7', 'monthly'],
    ['/hosting-wordpress-blog-personal-chile', '0.7', 'weekly'],
    ['/nuestro-metodo', '0.7', 'monthly'],
    ['/blog', '0.7', 'daily'],

    // Páginas secundarias
    ['/ultimos-dominios', '0.7', 'daily'],
    ['/contacto', '0.6', 'monthly'],
    ['/acerca-de', '0.6', 'monthly'],
    ['/vota-hosting', '0.6', 'weekly'],
    ['/calculadora-tco', '0.6', 'monthly'],
    ['/benchmark', '0.6', 'weekly'],
    ['/seo-audit', '0.8', 'weekly'],
    ['/estudio-hosting-chile-2026', '0.9', 'yearly'],
  ].map(([path, prio, freq]) => urlTag(`${ROOT}${path}`, prio, freq)).join('');

  // Páginas "VS" de proveedores (comparativas internas anti-fake legacy)
  const providerUrls = providers
    .map(slug => urlTag(`${ROOT}/comparativa/${slug}`, '0.7', 'weekly'))
    .join('');

  // Comparativas VS rivales falsos
  const vsRivalUrls = VS_RIVALS
    .map(slug => urlTag(`${ROOT}/vs/${slug}`, '0.9', 'weekly'))
    .join('');

  // Hubs de intención (alta prioridad)
  const intentHubs = [
    '/mejor-hosting-wordpress-chile',
    '/mejor-hosting-ecommerce-chile',
    '/mejor-hosting-pymes-chile',
    '/mejor-vps-chile',
  ].map(p => urlTag(`${ROOT}${p}`, '0.9', 'weekly')).join('');

  // Comparativas programáticas: TODAS las parejas del catálogo (canonical)
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
  for (let i = 0; i < verifiedSlugs.length; i++) {
    for (let j = i + 1; j < verifiedSlugs.length; j++) {
      pairSet.add(`/comparativa/${canonicalPair(verifiedSlugs[i], verifiedSlugs[j])}`);
    }
  }
  const programmaticVsUrls = [...pairSet].map(p => urlTag(`${ROOT}${p}`, '0.7', 'weekly')).join('');

  // Alternativas a X (todos los competidores excepto anchors)
  const alternativasUrls = verifiedSlugs
    .filter(s => !isAnchor(s))
    .map(s => urlTag(`${ROOT}/alternativas-a/${s}`, '0.7', 'weekly'))
    .join('');

  // Landings de migración (8 competidores objetivo)
  const migrationSlugs = ['hostgator','bluehost','godaddy','hostingcl','planetahosting','fasthosting','cloudhosting','webhosting'];
  const migrarUrls = migrationSlugs
    .filter(s => verifiedSlugs.includes(s))
    .map(s => urlTag(`${ROOT}/migrar-de/${s}`, '0.8', 'weekly'))
    .join('');



  // Páginas de reseñas de hosting
  const hostingReviews = [
    'hostingplus', 'ecohosting', '1hosting', 'hostgator',
    'bluehost', 'donweb', 'godaddy', 'siteground'
  ].map(slug => urlTag(`${ROOT}/resenas/${slug}`, '0.8', 'weekly'))
   .join('');

  // Detalle de empresas verificadas (/catalogo/:slug) desde Supabase
  const catalogoUrls = companySlugs
    .map(c => urlTag(`${ROOT}/catalogo/${c.slug}`, '0.7', 'weekly', c.updated_at || NOW))
    .join('');

  // Multi-country .com URLs con alternates hreflang bidireccionales
  const HREFLANG_CLUSTER = [
    { hreflang: 'es-CL', href: 'https://eligetuhosting.cl/' },
    { hreflang: 'es-PE', href: 'https://eligetuhosting.com/pe' },
    { hreflang: 'es-MX', href: 'https://eligetuhosting.com/mx' },
    { hreflang: 'es-CO', href: 'https://eligetuhosting.com/co' },
    { hreflang: 'es-AR', href: 'https://eligetuhosting.com/ar' },
    { hreflang: 'x-default', href: 'https://eligetuhosting.com/' },
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
${intentHubs}
${providerUrls}
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
  const wikiIndex = urlTag(`${ROOT}/wiki`, '0.8', 'weekly');
  
  const wikiUrls = wikiTerms
    .map(term => urlTag(`${ROOT}/wiki/${term.slug}`, '0.7', 'weekly'))
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${wikiIndex}
${wikiUrls}
</urlset>`.trimStart();
};

/* ---------- SITEMAP 3: ASN (NUEVO) ------------------------------------- */
const generateASNSitemap = () => {
  // Páginas principales de ASN
  const asnMainPages = [
    urlTag(`${ROOT}/asn`, '0.8', 'weekly'),
    urlTag(`${ROOT}/asn/chile`, '0.9', 'weekly'),
  ].join('');

  // ASN chilenos específicos
  const asnUrls = CHILEAN_ASNS
    .map(asn => urlTag(`${ROOT}/asn/AS${asn.asn}`, asn.priority, 'weekly'))
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${asnMainPages}
${asnUrls}
</urlset>`.trimStart();
};

/* ---------- SITEMAP 4: DOMAINS (solo 100 más recientes <90 días) ---------- */
const generateDomainsSitemap = () => {
  let domainsArr = [];
  try {
    const raw = JSON.parse(readFileSync('public/data/latest.json', 'utf8'));
    domainsArr = Array.isArray(raw) ? raw : (raw.domains || []);
    console.log(`📊 Procesando ${domainsArr.length} dominios totales`);
  } catch (error) {
    console.log('⚠️  No se pudo leer latest.json:', error.message);
  }

  // Filtrar dominios con menos de 90 días y limitar a 100 más recientes
  const domainUrls = domainsArr
    .filter((domain) => {
      // Solo dominios con menos de 90 días
      if (!domain.date) return true; // Incluir si no tiene fecha (probablemente nuevo)
      const createdDate = new Date(domain.date);
      const ageInDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      return ageInDays <= 90;
    })
    .slice(0, 100) // Solo los 100 más recientes
    .map((domain, index) => {
      const { d, date } = domain;
      // Los primeros 20 dominios tienen prioridad mayor
      const priority = index < 20 ? '0.6' : '0.5';
      const changefreq = 'daily';
      const lastmod = date ? new Date(date).toISOString() : NOW;
      
      return urlTag(`${ROOT}/domain/${d.replace(/\./g, '-')}/`, priority, changefreq, lastmod);
    })
    .join('');
  
  console.log(`✅ Generando sitemap con ${domainUrls.split('<url>').length - 1} dominios (<90 días, máx 100)`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${domainUrls}
</urlset>`.trimStart();
};

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
    <loc>${ROOT}/sitemap-domains.xml</loc>
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

// Generar sitemap-domains.xml
const domainsSitemap = generateDomainsSitemap();
await fs.writeFile('public/sitemap-domains.xml', domainsSitemap, 'utf8');
console.log('✅  sitemap-domains.xml generado (limitado a 500 dominios)');

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
