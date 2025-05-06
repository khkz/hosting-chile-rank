
import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import providers from './providers.json' assert { type: 'json' };

const ROOT   = 'https://eligetuhosting.cl';
const NOW    = new Date().toISOString().split('T')[0];   // YYYY-MM-DD

/* ---------- helpers ---------------------------------------------------- */
const urlTag = (loc, prio = '0.7') => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${NOW}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${prio}</priority>
  </url>`;

/* ---------- rutas estáticas (home, ranking, etc) ----------------------- */
const staticUrls = [
  '/', '/ranking', '/comparativa', '/cotiza-hosting',
  '/ultimos-dominios', '/contacto', '/faq'
].map(p => urlTag(`${ROOT}${p}`, '0.9')).join('');

/* ---------- páginas "VS" de proveedores -------------------------------- */
const providerUrls = providers
  .filter(slug => slug !== 'hostingplus') // Exclude hostingplus from comparison with itself
  .map(slug => urlTag(`${ROOT}/comparativa/hostingplus-vs/${slug}`))
  .join('');

/* ---------- páginas "comparativa" de proveedores ----------------------- */
const comparativeUrls = providers
  .map(slug => urlTag(`${ROOT}/comparativa/${slug}`))
  .join('');

/* ---------- últimos dominios (.whois/) --------------------------------- */
let raw = JSON.parse(readFileSync('public/data/latest.json', 'utf8'));
const domainsArr = Array.isArray(raw) ? raw : (raw.domains || []);     // <-- aquí el cambio
const domainUrls = domainsArr
  .slice(0, 400)                                                      // 400 más recientes
  .map(({ d }) => urlTag(`${ROOT}/whois/${d}`, '0.6'))
  .join('');

/* ---------- compone el XML -------------------------------------------- */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${providerUrls}
${comparativeUrls}
${domainUrls}
</urlset>`.trimStart();

/* ---------- escribe ---------------------------------------------------- */
await fs.mkdir('public', { recursive: true });
await fs.writeFile('public/sitemap.xml', sitemap, 'utf8');
console.log('✅  Sitemap regenerado (static + providers + vs-pages + whois)');
