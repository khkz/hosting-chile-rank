1  import { writeFileSync, mkdirSync, existsSync } from "fs";
2  import fetch from "node-fetch";
3  import { JSDOM } from "jsdom";
4  import { XMLParser } from "fast-xml-parser";
5
6  const dataDir = "public/data";
7  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
8
9  /* ───── 1. Extraer desde la tabla HTML ───── */
10 async function fetchDomainsFromNic() {
11   const url = "https://www.nic.cl/registry/Ultimos.do?t=1d";
12   const html = await fetch(url, {
13     headers: { "User-Agent": "EligetuBot/1.0 (+https://eligetuhosting.cl)" }
14   }).then(r => r.text());
15
16   const dom = new JSDOM(html);
17   const trs = [...dom.window.document.querySelectorAll("table tbody tr")];
18   const rows = [];
19
20   trs.forEach(tr => {
21     const [tdDomain, tdDate] = tr.querySelectorAll("td");
22     if (!tdDomain || !tdDate) return;
23
24     const domain = tdDomain.textContent.trim().toLowerCase();
25     const raw   = tdDate.textContent.trim();               // 2025-05-05 17:52:03.0
26     const m = raw.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/);
27     if (!m) return;
28
29     const iso = m[0].replace(" ", "T") + "Z";
30     rows.push({ d: domain, date: iso });
31   });
32
33   console.log(`HTML → capturados ${rows.length} dominios`);
34   rows.sort((a, b) => new Date(b.date) - new Date(a.date));
35   return rows;
36 }
37
38 /* ───── 2. Respaldo XML ───── */
39 async function fetchDomainsFromXml() {
40   const xml = await fetch("https://www.nic.cl/registry/UltimosDominios.xml")
41               .then(r => r.text());
42   const parser = new XMLParser({ ignoreAttributes: false });
43   const feed   = parser.parse(xml);
44   const items  = feed?.rss?.channel?.item || [];
45
46   const rows = items.map(i => ({
47     d: i.title.toLowerCase(),
48     date: new Date(i.pubDate).toISOString()
49   }));
50
51   console.log(`XML → capturados ${rows.length} dominios`);
52   rows.sort((a, b) => new Date(b.date) - new Date(a.date));
53   return rows;
54 }
55
56 /* ───── 3. Main ───── */
57 async function main() {
58   let domains = await fetchDomainsFromNic();
59   if (domains.length === 0) {
60     console.log("HTML vacío, usando XML…");
61     domains = await fetchDomainsFromXml();
62   }
63   if (domains.length === 0) throw new Error("No domains found");
64
65   const payload = {
66     updated : new Date().toISOString(),
67     domains : domains.slice(0, 800)
68   };
69
70   writeFileSync(
71     `${dataDir}/latest.json`,
72     JSON.stringify(payload, null, 2)
73   );
74   console.log(`💾 Guardados ${payload.domains.length} dominios en latest.json`);
75 }
76
77 /* ───── Ejecutar ───── */
78 main().catch(e => {
79   console.error("Script failed:", e);
80   process.exit(1);
81 });
82
83 // fin del archivo
