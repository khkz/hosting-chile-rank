import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import providers from './providers.json' assert { type: 'json' };

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

// Lista de ASN chilenos principales
const CHILEAN_ASNS = [
  // Telecom principales
  { asn: 13489, name: 'Movistar Chile', priority: '0.8' },
  { asn: 22047, name: 'VTR', priority: '0.8' },
  { asn: 14117, name: 'Claro Chile', priority: '0.8' },
  { asn: 23201, name: 'Entel Chile', priority: '0.8' },
  { asn: 27651, name: 'Entel PCS', priority: '0.7' },
  { asn: 18863, name: 'GTD Internet', priority: '0.7' },
  { asn: 23520, name: 'Telefonica del Sur', priority: '0.7' },
  
  // Hosting principales
  { asn: 52468, name: 'UFRO', priority: '0.7' },
  { asn: 269840, name: 'HostingPlus Chile', priority: '0.7' },
  { asn: 262589, name: 'Ecohosting Chile', priority: '0.7' },
  { asn: 28006, name: 'NIC Chile', priority: '0.7' },
  
  // ISPs regionales
  { asn: 61440, name: 'GTD Manquehue', priority: '0.6' },
  { asn: 6535, name: 'Telefonica Chile', priority: '0.6' },
  { asn: 18747, name: 'Netline', priority: '0.6' },
  { asn: 14117, name: 'Claro Servicios Empresariales', priority: '0.6' },
  { asn: 16629, name: 'REUNA', priority: '0.6' },
  { asn: 27651, name: 'ENTEL CHILE', priority: '0.6' },
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
const generateMainSitemap = () => {
  const staticUrls = [
    // Páginas de máxima prioridad
    ['/mejor-hosting-chile-2025', '1.0', 'daily'],
    ['/', '0.9', 'daily'],
    ['/ranking', '0.9', 'daily'],
    
    // Páginas de alta prioridad
    ['/mejor-hosting-chile', '0.8', 'daily'],
    ['/comparativa', '0.8', 'weekly'],
    ['/cotiza-hosting', '0.8', 'weekly'],
    
    // Guías (contenido de valor)
    ['/guia-elegir-hosting', '0.8', 'weekly'],
    ['/guia-hosting-wordpress', '0.8', 'weekly'],
    ['/guia-elegir-vps', '0.8', 'weekly'],
    ['/guia-elegir-ssl', '0.8', 'weekly'],
    ['/guia-elegir-cdn', '0.8', 'weekly'],
    ['/guia-elegir-servidor-dedicado', '0.8', 'weekly'],
    ['/guia-migrar-hosting', '0.8', 'weekly'],
    ['/guia-seguridad-web', '0.8', 'weekly'],
    
    // Páginas secundarias
    ['/ultimos-dominios', '0.7', 'daily'],
    ['/contacto', '0.6', 'monthly'],
    ['/acerca-de', '0.6', 'monthly'],
    ['/vota-hosting', '0.6', 'weekly'],
    ['/calculadora-tco', '0.6', 'monthly'],
    ['/benchmark', '0.6', 'weekly'],
  ].map(([path, prio, freq]) => urlTag(`${ROOT}${path}`, prio, freq)).join('');

  // Páginas "VS" de proveedores
  const providerUrls = providers
    .map(slug => urlTag(`${ROOT}/comparativa/${slug}`, '0.7', 'weekly'))
    .join('');

  // Páginas de reseñas de hosting
  const hostingReviews = [
    'hostingplus', 'ecohosting', '1hosting', 'hostgator', 
    'bluehost', 'donweb', 'godaddy', 'siteground'
  ].map(slug => urlTag(`${ROOT}/resena/${slug}`, '0.8', 'weekly'))
   .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${providerUrls}
${hostingReviews}
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

/* ---------- SITEMAP 4: DOMAINS (limitado a 500 más recientes) ---------- */
const generateDomainsSitemap = () => {
  let domainsArr = [];
  try {
    const raw = JSON.parse(readFileSync('public/data/latest.json', 'utf8'));
    domainsArr = Array.isArray(raw) ? raw : (raw.domains || []);
    console.log(`📊 Procesando ${domainsArr.length} dominios (limitando a 500 más recientes)`);
  } catch (error) {
    console.log('⚠️  No se pudo leer latest.json:', error.message);
  }

  // Limitar a 500 dominios más recientes con prioridad reducida
  const domainUrls = domainsArr
    .slice(0, 500)
    .map((domain, index) => {
      const { d, date } = domain;
      // Los primeros 100 dominios tienen prioridad ligeramente mayor
      const isRecent = index < 100;
      const priority = isRecent ? '0.5' : '0.4';
      const changefreq = isRecent ? 'daily' : 'weekly';
      const lastmod = date ? new Date(date).toISOString() : NOW;
      
      return urlTag(`${ROOT}/domain/${d.replace(/\./g, '-')}/`, priority, changefreq, lastmod);
    })
    .join('');

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

// Generar sitemap-main.xml
const mainSitemap = generateMainSitemap();
await fs.writeFile('public/sitemap-main.xml', mainSitemap, 'utf8');
console.log('✅  sitemap-main.xml generado');

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

/* ---------- notificar a Google sobre actualización del sitemap --------- */
async function notifyGoogle() {
  try {
    const sitemapUrl = encodeURIComponent(`${ROOT}/sitemap.xml`);
    const pingUrl = `http://www.google.com/ping?sitemap=${sitemapUrl}`;
    
    const response = await fetch(pingUrl);
    if (response.ok) {
      console.log('✅  Google notificado sobre actualización del sitemap');
    } else {
      console.log('⚠️  No se pudo notificar a Google (esto es normal)');
    }
  } catch (error) {
    console.log('⚠️  Error al notificar a Google:', error.message);
  }
}

// Notificar a Google
await notifyGoogle();
