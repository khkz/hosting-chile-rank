/**
 * nic-to-json.mjs
 * Extrae los dominios registrados en las últimas 24 h desde NIC Chile
 * y guarda un JSON en public/data/latest.json
 * — actualizado 2025-05-05 —
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { XMLParser } from "fast-xml-parser";

/*───────────────────────────────────────────────*
 * 0. Asegurar carpeta de salida
 *───────────────────────────────────────────────*/
const dataDir = "public/data";
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
  console.log(`Created directory: ${dataDir}`);
}

/*───────────────────────────────────────────────*
 * 1. Scraping HTML de NIC.cl
 *───────────────────────────────────────────────*/
async function fetchDomainsFromNic() {
  const URL = "https://www.nic.cl/registry/Ultimos.do?t=1d";
  const res = await fetch(URL, {
    headers: { "User-Agent": "Mozilla/5.0 (EligetuBot/1.0)" }
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const dom = new JSDOM(await res.text());
  const anchors = [
    ...dom.window.document.querySelectorAll('a[href*="Whois.do?d="]')
  ];
  console.log(`Encontradas ${anchors.length} anclas en el HTML`);

  const rows = [];
  for (const a of anchors) {
    const domain = a.textContent.trim().toLowerCase();
    const sibling = (a.nextSibling?.textContent || "").trim();
    const m = sibling.match(
      /(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d+)/
    );
    if (!m) continue;

    const isoDate = m[1].replace(" ", "T").replace(/\.\d+$/, "") + "Z";
    rows.push({ d: domain, date: isoDate });
  }

  console.log(`Extraídos ${rows.length} dominios del HTML`);
  rows.sort((a, b) => new Date(b.date) - new Date(a.date));
  return rows;
}

/*───────────────────────────────────────────────*
 * 2. Backup: XML feed
 *───────────────────────────────────────────────*/
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

  console.log(`Extraídos ${rows.length} dominios del XML`);
  rows.sort((a, b) => new Date(b.date) - new Date(a.date));
  return rows;
}

/*───────────────────────────────────────────────*
 * 3. Main
 *───────────────────────────────────────────────*/
async function main() {
  console.log("Fetching domains from NIC.cl…");

  let domains = await fetchDomainsFromNic();
  if (domains.length === 0) {
    console.log("Fallback al XML…");
    domains = await fetchDomainsFromXml();
  }
  if (domains.length === 0) throw new Error("No domains found");

  const payload = {
    updated: new Date().toISOString(), // fuerza diff para el commit
    domains: domains.slice(0, 800)     // guarda los últimos 800
  };

  writeFileSync(
    `${dataDir}/latest.json`,
    JSON.stringify(payload, null, 2)
  );
  console.log(
    `💾 Guardados ${payload.domains.length} dominios en ${dataDir}/latest.json`
  );
}

/*───────────────────────────────────────────────*/
main().catch(err => {
  console.error("Script failed:", err);
  process.exit(1);
});

