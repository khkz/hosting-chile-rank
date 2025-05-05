/**
 * scripts/nic-to-json.mjs
 * Extrae los dominios registrados en las últimas 24 h desde NIC Chile
 * y guarda un JSON en public/data/latest.json
 * Probado con el HTML del 05-may-2025
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { XMLParser } from "fast-xml-parser";

/*───────────────────────────────────────────────*
 * 0. Asegurar carpeta de salida                 *
 *───────────────────────────────────────────────*/
const dataDir = "public/data";
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
  console.log(`Created directory: ${dataDir}`);
}

/*───────────────────────────────────────────────*
 * 1. Scraping HTML (tabla <tr><td>)             *
 *───────────────────────────────────────────────*/
async function fetchDomainsFromNic() {
  const url = "https://www.nic.cl/registry/Ultimos.do?t=1d";
  const html = await fetch(url, {
    headers: { "User-Agent": "EligetuBot/1.0 (+https://eligetuhosting.cl)" }
  }).then(r => r.text());

  const dom = new JSDOM(html);
  const trs = [...dom.window.document.querySelectorAll("table tbody tr")];
  const rows = [];

  trs.forEach(tr => {
    const [tdDomain, tdDate] = tr.querySelectorAll("td");
    if (!tdDomain || !tdDate) return;

    const domain = tdDomain.textContent.trim().toLowerCase();
    const raw    = tdDate.textContent.trim();                 // 2025-05-05 17:52:03.0
    const m      = raw.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/);
    if (!m) return;

    const iso = m[0].replace(" ", "T") + "Z";                 // → ISO 8601
    rows.push({ d: domain, date: iso });
  });

  console.log(`HTML → capturados ${rows.length} dominios`);
  rows.sort((a, b) => new Date(b.date) - new Date(a.date));    // más nuevo primero
  return rows;
}

/*───────────────────────────────────────────────*
 * 2. Respaldo XML (feed)                        *
 *───────────────────────────────────────────────*/
async function fetchDomainsFromXml() {
  const xml = await fetch("https://www.nic.cl/registry/UltimosDominios.xml")
             .then(r => r.text());

  const parser = new XMLParser({ ignoreAttributes: false });
  const feed   = parser.parse(xml);
  const items  = feed?.rss?.channel?.item || [];

  const rows = items.map(i => ({
    d:    i.title.toLowerCase(),
    date: new Date(i.pubDate).toISOString()
  }));

  console.log(`XML → capturados ${rows.length} dominios`);
  rows.sort((a, b) => new Date(b.date) - new Date(a.date));
  return rows;
}

/*───────────────────────────────────────────────*
 * 3. Main                                       *
 *───────────────────────────────────────────────*/
async function main() {
  let domains = await fetchDomainsFromNic();

  if (domains.length === 0) {
    console.log("HTML vacío, usando XML…");
    domains = await fetchDomainsFromXml();
  }
  if (domains.length === 0) throw new Error("No domains found");

  const payload = {
    updated: new Date().toISOString(),   // marca de tiempo para forzar diff
    domains: domains.slice(0, 800)       // guarda los 800 más recientes
  };

  writeFileSync(
    `${dataDir}/latest.json`,
    JSON.stringify(payload, null, 2)
  );
  console.log(`💾 Guardados ${payload.domains.length} dominios en latest.json`);
}

/*───────────────────────────────────────────────*/
main().catch(err => {
  console.error("Script failed:", err);
  process.exit(1);
});
