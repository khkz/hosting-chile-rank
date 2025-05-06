// scripts/generate-rss.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ───────────────────────── helpers ─────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const jsonPath   = resolve(__dirname, '../public/data/latest.json');
const feedDir    = resolve(__dirname, '../public/feed');
const feedPath   = resolve(feedDir, 'latest-domains.xml');

// lee y normaliza el JSON (array o {domains:[…]})
const raw   = JSON.parse(readFileSync(jsonPath, 'utf8'));
const items = Array.isArray(raw) ? raw : raw.domains ?? [];

if (!items.length) {
  console.error('❌ latest.json no contiene dominios');
  process.exit(1);
}

// garantiza carpeta feed
if (!existsSync(feedDir)) mkdirSync(feedDir, { recursive: true });

// toma los 20 más recientes
const rssItems = items.slice(0, 20).map(({ d, date }) => `
  <item>
    <title>${d}</title>
    <link>https://eligetuhosting.cl/whois/${d}</link>
    <description>Nuevo dominio registrado el ${new Date(date).toLocaleDateString('es-CL')}</description>
    <pubDate>${new Date(date).toUTCString()}</pubDate>
    <guid>${d}</guid>
  </item>`).join('');

// arma el RSS
const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Últimos dominios .CL – EligeTuHosting.cl</title>
    <description>Feed con los dominios .cl recién inscritos en NIC Chile.</description>
    <link>https://eligetuhosting.cl</link>
    <atom:link href="https://eligetuhosting.cl/feed/latest-domains.xml" rel="self" type="application/rss+xml"/>
    <language>es-cl</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

// escribe el archivo
writeFileSync(feedPath, rssXml);
console.log(`✅ RSS generado con ${items.slice(0, 20).length} dominios -> public/feed/latest-domains.xml`);
