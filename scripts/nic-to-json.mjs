import { writeFileSync, mkdirSync, existsSync } from "fs";
import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

const dataDir = "public/data";
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

/* ─────────── 1. Scrape NIC HTML con regex global ─────────── */
async function fetchDomainsFromNic() {
  const url = "https://www.nic.cl/registry/Ultimos.do?t=1d";
  const html = await fetch(url, {
    headers: { "User-Agent": "EligetuBot/1.0 (+https://eligetuhosting.cl)" }
  }).then(r => r.text());

  const rows = [];
  // s flag = dotAll  (captura saltos de línea), i = ignoreCase
  const re = /Whois\.do\?d=([a-z0-9-]+\.cl)[\s\S]{0,120}?(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d+)/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const domain = m[1].toLowerCase();
    const iso = m[2].replace(" ", "T").replace(/\.\d+$/, "") + "Z";
    rows.push({ d: domain, date: iso });
  }
  console.log(`HTML → capturados ${rows.length} dominios`);
  rows.sort((a, b) => new Date(b.date) - new Date(a.date));
  return rows;
}

/* ─────────── 2. Backup XML ─────────── */
async function fetchDomainsFromXml() {
  const xml = await fetch(
    "https://www.nic.cl/registry/UltimosDominios.xml"
  ).then(r => r.text());

  const parser = new XMLParser({ ignoreAttributes: false });
  const feed = parser.parse(xml);
  const items = feed?.rss?.channel?.item || [];

  const rows = items.map(i => ({
    d: i.title.toLowerCase(),
    date: new Date(i.pubDate).toISOString()
  }));
  console.log(`XML → capturados ${rows.length} dominios`);
  rows.sort((a, b) => new Date(b.date) - new Date(a.date));
  return rows;
}

/* ─────────── 3. Main ─────────── */
async function main() {
  let domains = await fetchDomainsFromNic();
  if (domains.length === 0) {
    console.log("HTML vacío, usando XML…");
    domains = await fetchDomainsFromXml();
  }
  if (domains.length === 0) throw new Error("No domains found");

  const payload = {
    updated: new Date().toISOString(),
    domains: domains.slice(0, 800)
  };
  writeFileSync(`${dataDir}/latest.json`, JSON.stringify(payload, null, 2));
  console.log(`💾 Guardados ${payload.domains.length} dominios en latest.json`);
}

main().catch(e => {
  console.error("Script failed:", e);
  process.exit(1);
});
