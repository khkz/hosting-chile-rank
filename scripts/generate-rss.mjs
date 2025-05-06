import { readFileSync, writeFileSync } from 'node:fs';

const json = JSON.parse(readFileSync('public/data/latest.json', 'utf8'));
const items = json.slice(0, 20).map(({ d, date }) => `
  <item>
    <title>${d}</title>
    <link>https://eligetuhosting.cl/whois/${d}</link>
    <description>Nuevo dominio ${d} registrado ${date}</description>
    <pubDate>${new Date(date).toUTCString()}</pubDate>
    <guid>${d}</guid>
  </item>`).join('');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Últimos Dominios Registrados – EligeTuHosting.cl</title>
    <description>Lista de los últimos dominios .cl registrados</description>
    <link>https://eligetuhosting.cl</link>
    <atom:link href="https://eligetuhosting.cl/feed/latest-domains.xml" rel="self" type="application/rss+xml"/>
    <language>es-cl</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

writeFileSync('public/feed/latest-domains.xml', rss);
console.log('✅ RSS feed generado');
