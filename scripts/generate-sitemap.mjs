import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import providers from './providers.json' assert { type: 'json' };

const ROOT   = 'https://eligetuhosting.cl';
const NOW    = new Date().toISOString().split('T')[0];   // YYYY-MM-DD
const PRIOR  = '0.7';                                    // prioridad base

// Carga últimos dominios (por si los incluyes)
const domains = JSON.parse(
  readFileSync('public/data/latest.json', 'utf8')
);

// ----­ helpers -------------------------------------------------------------

const urlTag = (loc, priority = PRIOR) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${NOW}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;

// ----­ arma el XML ---------------------------------------------------------

const staticUrls = [
  '/', '/ranking', '/comparativa/', '/cotiza-hosting',
  '/ultimos-dominios', '/guia-elegir-hosting', '/contacto', '/faq'
].map(p => urlTag(`${ROOT}${p}`, '0.9')).join('');

const providerUrls = providers
  .map(slug => urlTag(`${ROOT}/comparativa/${slug}`))
  .join('');

const domainUrls = domains    // por ejemplo, los 400 más recientes
  .slice(0, 400)
  .map(({ d }) => urlTag(`${ROOT}/whois/${d}`, '0.6'))
  .join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>` +      // ⚠ sin \n delante
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${providerUrls}
${domainUrls}
</urlset>`;

// ----­ guarda --------------------------------------------------------------

await fs.mkdir('public', { recursive: true });
await fs.writeFile('public/sitemap.xml', xml.trimStart(), 'utf8');

console.log('✅  Sitemap regenerado -> public/sitemap.xml');

