/**
 * nic-to-json.mjs  –  versión 2
 * Corrige: captura de fecha después del <a> y fallback usando regex.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { XMLParser } from "fast-xml-parser";

/*──────────────── 0. Crear carpeta ────────────────*/
const dataDir = "public/data";
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

/*──────────────── 1. HTML NIC.cl ──────────────────*/
async function fetchDomainsFromNic() {
  const URL = "https://www.nic.cl/registry/Ultimos.do?t=1d";
  const res = await fetch(URL, {
    headers: { "User-Agent": "EligetuBot/1.0 (+https://eligetuhosting.cl)" }
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const html = await res.text();
  const dom = new JSDOM(html);
  const anchors = [
    ...dom.window.document.querySelectorAll('a[href*="Whois.do?d="]')
  ];
  console.log(`Anclas encontradas: ${anchors.length}`);

  const rows = [];

  // 1-A. Recorrer anclas y buscar la fecha saltando nodos vacíos
  const dateRe = /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d+/;
  for (const a of anchors) {
    let node = a.nextSibling;
    while (node && !dateRe.test(node.textContent)) node = node.nextSibling;
    if (!node) continue;

    const iso = node.textContent
      .match(dateRe)[0]
      .replace(" ", "T")
      .replace(/\.\d+$/, "") + "Z";

    rows.push({ d: a.textContent.trim().toLowerCase(), date: iso });
  }

  // 1-B. Si por alguna razón quedaron 0, usa regex sobre todo el HTML
  if (rows.length === 0) {
    console.log("Nodo hermano vacío; usando regex global…");
    const re = /Whois\.do\?d=([a-z0-9-]+\.cl)[\s\S]{0,120}?(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d+)/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      const iso = m[2].replace(" ", "T").replace(/\.\d+$/, "") + "Z";
      rows.push({ d: m[1], date: iso });
    }
    console.log(`Regex capturó ${rows.length} dominios`);
  }

  rows.sort((a, b) => new Date(b.date) - new Date(a.date));
  return rows;
}

/*──────────────── 2. XML Backup ───────────────────*/
async function fetchDomainsFromXml() {
  const FEED = "https://www.nic.cl/registry/UltimosDominios.xml";
  const xml = await fetch(FEED).then(r => r.text());
  const parser = new XMLParser({ ignoreAttributes: false });
  const items = parser.parse(xml)?.rss?.channel?.item || [];
  return items.map(i => ({
    d: i.title.toLowerCase(),
    date: new Date(i.pubDate).toISOString()
  }));
}

/*──────────────── 3. Main ─────────────────────────*/
async function main() {
  console.log("Fetching NIC.cl…");
  let domains = await fetchDomainsFromNic();
  if (domains.length === 0) {
    console.log("Fallback XML…");
    domains = await fetchDomainsFromXml();
  }
  if (domains.length === 0) throw new Error("No domains found.");

  const payload = {
    updated: new Date().toISOString(),
    domains: domains.slice(0, 800)
  };
  writeFileSync(
    `${dataDir}/latest.json`,
    JSON.stringify(payload, null, 2)
  );
  console.log(`💾 Guardados ${payload.domains.length} dominios`);
}

main().catch(err => {
  console.error("Script failed:", err);
  process.exit(1);
});
