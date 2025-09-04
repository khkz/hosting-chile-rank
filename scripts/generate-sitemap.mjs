
import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import providers from './providers.json' assert { type: 'json' };
import { wikiTerms } from '../src/data/wiki/terms.ts';

const ROOT   = 'https://eligetuhosting.cl';
const NOW    = new Date().toISOString();   // ISO format with time for better precision

/* ---------- helpers ---------------------------------------------------- */
const urlTag = (loc, prio = '0.7', changefreq = 'weekly', lastmod = NOW) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${prio}</priority>
  </url>`;

/* ---------- rutas estáticas (home, ranking, etc) ----------------------- */
const staticUrls = [
  ['/', '0.9', 'daily'],
  ['/ranking', '0.9', 'daily'],
  ['/mejor-hosting-chile-2025', '1.0', 'daily'],
  ['/mejor-hosting-chile', '0.9', 'daily'],
  ['/comparativa', '0.8', 'weekly'],
  ['/cotiza-hosting', '0.8', 'weekly'],
  ['/ultimos-dominios', '0.9', 'hourly'], // Optimizado para crawleo frecuente
  ['/wiki', '0.8', 'weekly'], // Wiki index page
  ['/contacto', '0.7', 'monthly'],
  ['/faq', '0.7', 'monthly'],
  ['/asn', '0.7', 'weekly']
].map(([path, prio, freq]) => urlTag(`${ROOT}${path}`, prio, freq)).join('');

/* ---------- páginas "VS" de proveedores -------------------------------- */
const providerUrls = providers
  .map(slug => urlTag(`${ROOT}/comparativa/${slug}`, '0.8', 'weekly'))
  .join('');

/* ---------- páginas de reseñas de hosting ------------------------------ */
const hostingReviews = [
  'hostingplus', 'ecohosting', '1hosting', 'hostgator', 
  'bluehost', 'donweb', 'godaddy'
].map(slug => urlTag(`${ROOT}/reseñas/${slug}`, '0.8', 'weekly'))
 .join('');

/* ---------- páginas Wiki (términos) ------------------------------------ */
const wikiUrls = wikiTerms
  .map(term => urlTag(`${ROOT}/wiki/${term.slug}`, '0.7', 'weekly'))
  .join('');

/* ---------- últimos dominios (.domain/) --------------------------------- */
let raw = JSON.parse(readFileSync('public/data/latest.json', 'utf8'));
const domainsArr = Array.isArray(raw) ? raw : (raw.domains || []);

// Optimizar dominios por recencia
const domainUrls = domainsArr
  .slice(0, 5000)
  .map((domain, index) => {
    const { d, t } = domain;
    // Dominios más recientes (primeros 100) con mayor prioridad y frecuencia diaria
    const isRecent = index < 100;
    const priority = isRecent ? '0.8' : '0.6';
    const changefreq = isRecent ? 'daily' : 'weekly';
    const lastmod = t ? new Date(t).toISOString() : NOW;
    
    return urlTag(`${ROOT}/domain/${d.replace(/\./g, '-')}/`, priority, changefreq, lastmod);
  })
  .join('');

/* ---------- compone el XML -------------------------------------------- */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${providerUrls}
${hostingReviews}
${wikiUrls}
${domainUrls}
</urlset>`.trimStart();

/* ---------- escribe ---------------------------------------------------- */
await fs.mkdir('public', { recursive: true });
await fs.writeFile('public/sitemap.xml', sitemap, 'utf8');
console.log('✅  Sitemap regenerado con optimizaciones para Google crawleo');

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

// Notificar a Google si hay dominios recientes
if (domainsArr.length > 0) {
  await notifyGoogle();
}
