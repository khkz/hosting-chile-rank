
import { parse } from "fast-xml-parser";
import { writeFileSync } from "fs";
import fetch from "node-fetch";

const FEED = "https://www.nic.cl/registry/UltimosDominios.xml";
const xml   = await fetch(FEED).then(r => r.text());
const feed  = parse(xml, { ignoreAttributes: false });

const domains = (feed.rss.channel.item || [])
  .map(i => ({ 
    d: i.title.toLowerCase(), 
    date: i.pubDate 
  }));

// Write to a JSON file in the public directory
writeFileSync("public/data/latest.json", JSON.stringify(domains, null, 2));

console.log(`Guardados ${domains.length} dominios recientes de NIC.cl`);
