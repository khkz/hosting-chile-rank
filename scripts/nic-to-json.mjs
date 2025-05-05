/**
 * Scraper NIC.cl  – versión 05-may-2025
 * - Regex global: dominio + fecha (ventana 500 chars)
 * - Fallback: si no hay fecha, usa timestamp 'updated'
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

const dir = "public/data";
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

/* 1. Regex global sobre el HTML -------------------------------- */
async function fetchFromHtml() {
  const url = "https://www.nic.cl/registry/Ultimos.do?t=1d";
  const html = await fetch(url, {
    headers: { "User-Agent": "EligetuBot/1.0 (+https://eligetuhosting.cl)" }
  }).then(r => r.text());

  const rows = [];
  const re = /Whois\.do\?d=([a-z0-9-]+\.cl)[\s\S]{0,500}?(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const domain = m[1].toLowerCase();
    const iso    = m[2].replace(" ", "T") + "Z";
    rows.push({ d: domain, date: iso });
  }
  console.log(`HTML → capturados ${rows.length} dominios`);
  return rows;
}

/* 2. Feed XML como respaldo ----------------------------------- */
async function fetchFromXml() {
  const xml = await fetch("https://www.nic.cl/registry/UltimosDominios.xml")
             .then(r => r.text());
  const parser = new XMLParser({ ignoreAttributes: false });
  const feed   = parser.parse(xml);
  const items  = feed?.rss?.channel?.item || [];

  const rows = items.map(i => ({
    d: i.title.toLowerCase(),
    date: new Date(i.pubDate).toISOString()
  }));
  console.log(`XML → capturados ${rows.length} dominios`);
  return rows;
}

/* 3. Main ------------------------------------------------------ */
async function main() {
  const nowIso = new Date().toISOString();
  let rows = await fetchFromHtml();

  if (rows.length === 0) {
    console.log("HTML vacío → intento XML…");
    rows = await fetchFromXml();
  }

  /* plan C: si aún no hay fecha, al menos devuelve dominios */
  if (rows.length === 0) throw new Error("No domains found");
  rows = rows.map(r => ({ d: r.d, date: r.date || nowIso }));
  rows.sort((a, b) => new Date(b.date) - new Date(a.date));

  const payload = {
    updated: nowIso,
    domains: rows.slice(0, 800)
  };

  writeFileSync(`${dir}/latest.json`, JSON.stringify(payload, null, 2));
  console.log(`💾 Guardados ${payload.domains.length} dominios en latest.json`);
}

main().catch(e => {
  console.error("Script failed:", e);
  process.exit(1);
});

