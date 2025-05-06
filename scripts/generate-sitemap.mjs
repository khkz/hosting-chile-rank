// scripts/generate-sitemap.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE = 'https://eligetuhosting.cl';           // dominio raíz
const OUT  = resolve('public', 'sitemap.xml');      // ruta destino

// lee los últimos dominios que ya genera nic-to-json.mjs
const dataPath = resolve('public', 'data', 'latest.json');
const domains  = JSON.parse(readFileSync(dataPath, 'utf8'));

// lista base de URL fijas que siempre quieres indexar
const staticUrls = [
  '/',
  '/ranking',
  '/comparativa',
  '/ultimos-dominios',
  '/cotiza-hosting',
  // añade aquí otras rutas internas…
];

// Helper para generar cada <url>
const urlTag = (loc, lastmod = new Date()) => `
  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmod.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

// 1) URLs fijas
let urlsXml = staticUrls.map(p => urlTag(p)).join('');

// 2) páginas “/whois/:slug” de los últimos dominios
urlsXml += domains
  .slice(0, 400)               // los 400 más recientes
  .map(({ d, date }) => urlTag(`/whois/${d}`, new Date(date)))
  .join('');

// 3) (opcional) páginas “/vs/:competidor-vs-hostingplus”
import providers from './providers.json' assert { type: 'json' }; // lista de 50 hostings
urlsXml += providers
  .map(name => urlTag(`/comparativa/${name}-vs-hostingplus`))
  .join('');

// Ensambla el XML completo (sin salto de línea antes de la cabecera)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlsXml}
</urlset>`;

// asegúrate de que public/ exista (GitHub Runner lo tiene, pero para local)
if (!existsSync('public')) mkdirSync('public', { recursive: true });

writeFileSync(OUT, xml);
console.log('✅  sitemap.xml generado:', OUT);
