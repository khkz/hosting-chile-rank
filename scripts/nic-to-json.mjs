import { parse } from "fast-xml-parser";
import { writeFileSync } from "fs";
import fetch from "node-fetch";

const FEED = "https://www.nic.cl/registry/UltimosDominios.xml";
const xml   = await fetch(FEED).then(r => r.text());
const feed  = parse(xml, { ignoreAttributes: false });

const ONE_HOUR = 1000 * 60 * 60;
const now      = Date.now();

const recent = (feed.rss.channel.item || [])
  .filter(i => now - new Date(i.pubDate).getTime() < ONE_HOUR)
  .map(i => ({ d: i.title.toLowerCase(), date: i.pubDate }));

writeFileSync("public/data/latest.json", JSON.stringify(recent, null, 2));
console.log(`Guardados ${recent.length} dominios recientes`);
