import { writeFileSync, mkdirSync, existsSync } from "fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { XMLParser } from "fast-xml-parser";          // ← cambio v4

/* ───────────── Crear carpeta public/data ───────────── */
const dataDir = "public/data";
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
  console.log(`Created directory: ${dataDir}`);
}

/* ───────────── 1. Scraping HTML NIC.cl ─────────────── */
async function fetchDomainsFromNic() {
  const url = "https://www.nic.cl/registry/Ultimos.do?t=1d";
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (EligetuBot)" }
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const dom = new JSDOM(await res.text());
  const anchors = [...dom.window.document.querySelectorAll('a[href$=".cl"]')];

  const rows = [];
  for (const a of anchors) {
    const domain = a.textContent.trim().toLowerCase();
    const text = (a.nextSibling?.textContent || "").trim();
    const m = text.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d+)/);
    if (!m) continue;
    const iso = m[1].replace(" ", "T").replace(/\.\d+$/, "") + "Z";
    rows.push({ d: domain, date: iso });
  }

  console.log(`Extracted ${rows.length} domains from HTML`);
  rows.sort((a, b) => new Date(b.date) - new Date(a.date));
  return rows;
}

/* ───────────── 2. Backup: XML feed ───────────── */
async function fetchDomainsFromXml() {
  const FEED = "https://www.nic.cl/registry/UltimosDominios.xml";
  const xml = await fetch(FEED).then(r => r.text());
  const parser = new XMLParser({ ignoreAttributes: false });
  const feed = parser.parse(xml);
  const items = feed?.rss?.channel?.item || [];

  const rows = items.map(i => ({
    d: i.title.toLowerCase(),
    date: new Date(i.pubDate).toISOString()
  }));
  console.log(`Extracted ${rows.length} domains from XML`);
  rows.sort((a, b) => new Date(b.date) - new Date(a.date));
  return rows;
}

/* ───────────── 3. Main ───────────── */
async function main() {
  console.log("Fetching domains from NIC.cl…");

  let domains = await fetchDomainsFromNic();
  if (domains.length === 0) {
    console.log("Fallback to XML…");
    domains = await fetchDomainsFromXml();
  }
  if (domains.length === 0) throw new Error("No domains found");

  const payload = {
    updated: new Date().toISOString(),   // ⬅ fuerza diff
    domains: domains.slice(0, 800)       // guarda 800 últimos
  };

  writeFileSync(
    `${dataDir}/latest.json`,
    JSON.stringify(payload, null, 2)
  );
  console.log(`💾 Guardados ${payload.domains.length} dominios en latest.json`);
}

main().catch(err => {
  console.error("Script failed:", err);
  process.exit(1);
});
