import { readFileSync, writeFileSync } from "fs";

const json = JSON.parse(readFileSync("public/data/latest.json", "utf8"));

const items = json.map(
  ({ d, date }) => `
    <item>
      <title>${d}</title>
      <link>https://eligetuhosting.cl/whois/${d}</link>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
      <guid>${d}</guid>
    </item>`
).join("");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Últimos dominios .cl</title>
  <link>https://eligetuhosting.cl/ultimos-dominios</link>
  <description>Feed automático con los dominios recién inscritos en Chile</description>
  ${items}
</channel>
</rss>`;

writeFileSync("public/feed/latest.xml", rss.trim());
console.log("✅ RSS generado con", json.length, "dominios.");
