// scripts/generate-sitemap.mjs
// Genera public/sitemap.xml con:
//   • 800 dominios más recientes de latest.json
//   • 100 proveedores (providers.json)

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ─── Utiles de ruta ───────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const resolve    = (...p) => join(__dirname, ...p);

// ─── Cargar datos ─────────────────────────────────────────────────────────────
const rawLatest   = JSON.parse(readFileSync(resolve('../public/data/latest.json'), 'utf8'));
const providers   = JSON.parse(readFileSync(resolve('./providers.json'), 'utf8'));

// latest.json puede ser:
//  A) [ { d, date }, … ]
//  B) { domains: [ … ] }
const domainsArr = Array.isArray(rawLatest)           ? rawLatest :
                   Array.isArray(rawLatest.domains)   ? rawLatest.domains :
                   [];

const recent400  = domainsArr.slice(0, 800);           // máx 800

// ─── Construir nodos <url> ────────────────────────────────────────────────────
const url = (loc, lastmod = new Date().toISOString()) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`.trim();

const domainUrls = recent400.map(({ d, date }) =>
  url(`https://eligetuhosting.cl/whois/${d}`, new Date(date).toISOString())
).join('\n');

const providerUrls = providers.map(p =>
  url(`https://eligetuhosting.cl/comparativa/${p}`)
).join('\n');

// ─── Sitemap completo ─────────────────────────────────────────────────────────
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${domainUrls}
${providerUrls}
</urlset>
`.trim();

// ─── Guardar ──────────────────────────────────────────────────────────────────
writeFileSync(resolve('../public/sitemap.xml'), sitemap);
console.log('✅  public/sitemap.xml actualizado con',
            recent400.length, 'dominios y', providers.length, 'proveedores.');
