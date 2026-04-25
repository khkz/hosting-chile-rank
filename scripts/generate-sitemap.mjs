import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const providers = require('./providers.json');

// Slugs de comparativas vs/ rivales (sitios de comparación falsa)
const VS_RIVALS = ['comparahosting', 'mejorhosting', 'rankinghosting', 'hostingexperto'];

// Fetch slugs verificados desde Supabase REST (sin SDK para evitar deps)
async function fetchVerifiedCompanySlugs() {
  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hpqhylsvojzazmmaviek.supabase.co';
  const ANON = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!ANON) {
    console.log('⚠️  Sin SUPABASE_ANON_KEY: omitiendo slugs de /catalogo/');
    return [];
  }
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
const generateMainSitemap = (companySlugs = []) => {
  const staticUrls = [
    // Páginas de máxima prioridad
    ['/mejor-hosting-chile-2026', '1.0', 'daily'],
    ['/mejor-hosting-chile-2025', '0.9', 'monthly'],
    ['/', '0.9', 'daily'],
    ['/ranking', '0.9', 'daily'],
    ['/directorio-hosting-chile', '0.9', 'daily'],

    // Transparencia y comparativas anti-fake (CRÍTICO para SEO/GEO)
    ['/transparencia-hosting-chile', '0.9', 'weekly'],

    // Páginas de alta prioridad
    ['/catalogo', '0.8', 'daily'],
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
  ].map(([path, prio, freq]) => urlTag(`${ROOT}${path}`, prio, freq)).join('');

  // Páginas "VS" de proveedores (comparativas internas)
  const providerUrls = providers
    .map(slug => urlTag(`${ROOT}/comparativa/${slug}`, '0.7', 'weekly'))
    .join('');

  // Comparativas VS rivales falsos (CRÍTICO: indexar para captar búsquedas de los rankings truchos)
  const vsRivalUrls = VS_RIVALS
    .map(slug => urlTag(`${ROOT}/vs/${slug}`, '0.9', 'weekly'))
    .join('');

  // Páginas de reseñas de hosting
  const hostingReviews = [
    'hostingplus', 'ecohosting', '1hosting', 'hostgator',
    'bluehost', 'donweb', 'godaddy', 'siteground'
  ].map(slug => urlTag(`${ROOT}/resena/${slug}`, '0.8', 'weekly'))
   .join('');

  // Detalle de empresas verificadas (/catalogo/:slug) desde Supabase
  const catalogoUrls = companySlugs
    .map(c => urlTag(`${ROOT}/catalogo/${c.slug}`, '0.7', 'weekly', c.updated_at || NOW))
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${providerUrls}
${vsRivalUrls}
${hostingReviews}
${catalogoUrls}
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
const mainSitemap = generateMainSitemap(companySlugs);
await fs.writeFile('public/sitemap-main.xml', mainSitemap, 'utf8');
console.log(`✅  sitemap-main.xml generado (incluye ${VS_RIVALS.length} VS-rivals + ${companySlugs.length} catálogo)`);

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
