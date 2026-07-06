// Generador programático (SIN puppeteer) para Fase 3-4:
//  1) public/data/benchmarks-{pais}.json (snapshot de últimos pings, CC-BY-4.0)
//  2) public/{pais}/benchmark/index.html (página estática con tabla)
//  3) public/{pais}.md y public/{pais}/{slug}.md (dataset en Markdown para IA)
//  4) public/datos/index.html (documentación de datos abiertos)
//
// Reusa el shell de index.html + los datos vía REST público de Supabase.

import fs from 'node:fs/promises';
import path from 'node:path';
import { buildHtml, esc } from './lib/shell.mjs';

const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://oegvwjxrlmtwortyhsrv.supabase.co';
const SB_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA4NzEsImV4cCI6MjA2MjAzNjg3MX0.ruA3v0xiTGgH2vubqAnWPgbvwSOlaVp7Oc0e2YeZq4M';

const COUNTRIES = {
  pe: { code: 'PE', name: 'Perú', long: 'peru', flag: '🇵🇪', locale: 'es-PE' },
  mx: { code: 'MX', name: 'México', long: 'mexico', flag: '🇲🇽', locale: 'es-MX' },
  co: { code: 'CO', name: 'Colombia', long: 'colombia', flag: '🇨🇴', locale: 'es-CO' },
  ar: { code: 'AR', name: 'Argentina', long: 'argentina', flag: '🇦🇷', locale: 'es-AR' },
};
const ROOT = 'https://eligetuhosting.com';
const NOW = new Date().toISOString();


async function sbFetch(path) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

async function loadProvidersLatam() {
  try {
    return JSON.parse(await fs.readFile('public/data/proveedores-latam.json', 'utf8')).proveedores || [];
  } catch { return []; }
}

async function fetchCompanies(code) {
  return sbFetch(`hosting_companies?select=id,slug,name,website,legal_name,corporate_group,datacenter_location,year_founded,technologies,contact_phone,contact_email,editorial_summary,updated_at&country=eq.${code}&is_verified=eq.true&limit=999`);
}

async function fetchPings(ids) {
  if (!ids.length) return [];
  const since = new Date(Date.now() - 7 * 24 * 3600_000).toISOString();
  const idList = ids.map(id => `"${id}"`).join(',');
  const url = `uptime_pings?select=company_id,ttfb_ms,ok,measured_at&company_id=in.(${idList})&measured_at=gte.${since}&order=measured_at.desc&limit=10000`;
  return sbFetch(url);
}

async function fetchSiteChecks(ids) {
  if (!ids.length) return {};
  const idList = ids.map(id => `"${id}"`).join(',');
  const rows = await sbFetch(`latam_site_checks?select=company_id,resolved_ip,asn,asn_org,ssl_issuer,ssl_valid_to,ttfb_ms,checked_at&company_id=in.(${idList})&order=checked_at.desc&limit=1000`);
  const map = {};
  for (const r of rows) if (!map[r.company_id]) map[r.company_id] = r;
  return map;
}

const LICENSE = {
  licencia: 'CC-BY-4.0',
  licencia_url: 'https://creativecommons.org/licenses/by/4.0/',
  atribucion: 'EligeTuHosting — https://eligetuhosting.com/',
  como_citar: `EligeTuHosting (${new Date().getFullYear()}). Benchmarks de hosting LATAM [Dataset]. https://eligetuhosting.com/datos — CC-BY-4.0.`,
};

async function generateForCountry(cslug) {
  const meta = COUNTRIES[cslug];
  const companies = await fetchCompanies(meta.code);
  const ids = companies.map(c => c.id);
  const pings = await fetchPings(ids);
  const checks = await fetchSiteChecks(ids);

  const byCompany = new Map();
  for (const p of pings) {
    const b = byCompany.get(p.company_id) ?? { ttfb: [], ok: 0, total: 0, last: null };
    if (typeof p.ttfb_ms === 'number') b.ttfb.push(p.ttfb_ms);
    b.total += 1; if (p.ok) b.ok += 1;
    if (!b.last || p.measured_at > b.last) b.last = p.measured_at;
    byCompany.set(p.company_id, b);
  }

  const rows = companies.map(c => {
    const b = byCompany.get(c.id) ?? { ttfb: [], ok: 0, total: 0, last: null };
    return {
      slug: c.slug,
      nombre: c.name,
      sitio_oficial: c.website,
      ttfb_mediano_ms: median(b.ttfb),
      ttfb_muestras: b.ttfb.length,
      uptime_7d_pct: b.total ? Math.round((b.ok / b.total) * 1000) / 10 : null,
      ultima_medicion: b.last,
      ficha: `${ROOT}/${cslug}/${c.slug}`,
    };
  }).sort((a, b) => {
    if (a.ttfb_mediano_ms == null && b.ttfb_mediano_ms == null) return a.nombre.localeCompare(b.nombre);
    if (a.ttfb_mediano_ms == null) return 1;
    if (b.ttfb_mediano_ms == null) return -1;
    return a.ttfb_mediano_ms - b.ttfb_mediano_ms;
  });

  // 1) Benchmarks JSON
  const benchmarksDoc = {
    nombre: `Benchmarks de hosting en ${meta.name}`,
    fecha_generacion: NOW,
    ventana: '7d',
    metodologia: 'Ping HTTP horario (HEAD, fallback GET) desde infraestructura de EligeTuHosting con timeout 10s. TTFB en ms; uptime = pings OK / pings totales; mediana calculada sobre muestras exitosas.',
    nota_puntajes: 'Los puntajes numéricos por país (1–10) se publicarán cuando existan 60–90 días de datos continuos.',
    ...LICENSE,
    total_proveedores: rows.length,
    proveedores: rows,
  };
  await fs.mkdir('public/data', { recursive: true });
  await fs.writeFile(`public/data/benchmarks-${cslug}.json`, JSON.stringify(benchmarksDoc, null, 2), 'utf8');

  // 2) HTML estático /{pais}/benchmark
  const tableHtml = `
    <table><thead><tr><th>#</th><th>Proveedor</th><th>TTFB mediano (ms)</th><th>Muestras 7d</th><th>Uptime 7d</th><th>Última medición</th></tr></thead>
    <tbody>${rows.map((r, i) => `<tr><td>${i + 1}</td><td><a href="/${cslug}/${r.slug}">${esc(r.nombre)}</a></td><td>${r.ttfb_mediano_ms ?? '—'}</td><td>${r.ttfb_muestras}</td><td>${r.uptime_7d_pct != null ? r.uptime_7d_pct + '%' : '—'}</td><td>${r.ultima_medicion ? r.ultima_medicion.slice(0,16).replace('T', ' ') : '—'}</td></tr>`).join('')}</tbody></table>`;
  const canonicalBench = `${ROOT}/${cslug}/benchmark`;
  const titleBench = `Benchmark de hosting en ${meta.name} · TTFB y uptime medidos | EligeTuHosting`;
  const descBench = `Mediciones propias de TTFB y uptime de proveedores de hosting verificados en ${meta.name}. Datos abiertos CC-BY-4.0.`;
  const datasetLd = {
    '@context': 'https://schema.org', '@type': 'Dataset',
    name: `Benchmarks de hosting en ${meta.name}`, description: descBench, url: canonicalBench,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'EligeTuHosting', url: `${ROOT}/` },
    distribution: [{ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${ROOT}/data/benchmarks-${cslug}.json` }],
    dateModified: NOW,
  };
  const bodyBench = `
    <header><h1>Benchmark de hosting en ${meta.name} ${meta.flag}</h1>
    <p>${esc(descBench)} <strong>Los puntajes globales por país llegarán cuando acumulemos 60–90 días de datos continuos.</strong></p>
    <p><a href="/data/benchmarks-${cslug}.json">Descargar JSON (CC-BY-4.0)</a> · <a href="/datos">Documentación</a></p></header>
    ${tableHtml}
    <section><h2>Metodología</h2><p>Ping HTTP cada hora contra el sitio oficial declarado. Fallback a GET si HEAD no está soportado. Se calcula la mediana de TTFB sobre las muestras exitosas de los últimos 7 días.</p></section>`;
  const headExtraBench = `
    <link rel="alternate" type="application/json" href="/data/benchmarks-${cslug}.json" title="Benchmarks JSON (CC-BY-4.0)" />
    <script type="application/ld+json">${JSON.stringify(datasetLd)}</script>`;
  await fs.mkdir(`public/${cslug}/benchmark`, { recursive: true });
  await fs.writeFile(`public/${cslug}/benchmark/index.html`,
    buildHtml({ title: titleBench, description: descBench, canonical: canonicalBench, locale: meta.locale, headExtra: headExtraBench, bodyContent: bodyBench, keywords: `benchmark hosting ${meta.long}, ttfb ${meta.long}, uptime ${meta.long}, hosting ${meta.name.toLowerCase()}` }), 'utf8');

  // 3) Markdown por país
  const mdCountry = `# Hosting en ${meta.name} ${meta.flag} — Directorio verificado

Fuente: ${ROOT}/${cslug}
Licencia: CC-BY-4.0 · Atribución: EligeTuHosting
Última actualización: ${NOW}

## Metodología resumida
- Datacenter local verificado por ASN y declaraciones oficiales.
- Razón social local: registros mercantiles / RUC / RFC / NIT / CUIT.
- Antigüedad: año de fundación declarado.
- TTFB y uptime: mediciones horarias propias (7 días de ventana en esta tabla).

## Proveedores verificados (${companies.length})

${companies.map(c => {
    const b = byCompany.get(c.id) ?? { ttfb: [], ok: 0, total: 0 };
    const chk = checks[c.id];
    return `### ${c.name}
- Ficha: ${ROOT}/${cslug}/${c.slug}
- Sitio oficial: ${c.website ?? '—'}
- Razón social: ${c.legal_name ?? '—'}
- Grupo corporativo: ${c.corporate_group ?? '—'}
- Datacenter declarado: ${c.datacenter_location ?? '—'}
- Fundación: ${c.year_founded ?? '—'}
- Tecnologías: ${(c.technologies || []).join(', ') || '—'}
${chk ? `- IP resuelta: ${chk.resolved_ip ?? '—'}\n- ASN: ${chk.asn ? 'AS' + chk.asn : '—'} (${chk.asn_org ?? '—'})\n- SSL: ${chk.ssl_issuer ?? '—'}${chk.ssl_valid_to ? ' — vence ' + chk.ssl_valid_to.slice(0,10) : ''}` : ''}
- TTFB mediano 7d: ${median(b.ttfb) ?? '—'} ms (muestras: ${b.ttfb.length})
- Uptime 7d: ${b.total ? Math.round((b.ok / b.total) * 1000) / 10 + '%' : '—'}
- Resumen editorial: ${(c.editorial_summary || '').replace(/\n+/g, ' ') || '—'}
`;
  }).join('\n')}

## Enlaces
- Ranking editorial: ${ROOT}/${cslug}/mejor-hosting-${meta.long}-2026
- Datacenter local: ${ROOT}/${cslug}/hosting-con-datacenter-local
- Benchmark: ${ROOT}/${cslug}/benchmark
- JSON: ${ROOT}/data/proveedores-${cslug}.json
- Benchmarks JSON: ${ROOT}/data/benchmarks-${cslug}.json
`;
  await fs.writeFile(`public/${cslug}.md`, mdCountry, 'utf8');

  // 4) Markdown por proveedor
  for (const c of companies) {
    const b = byCompany.get(c.id) ?? { ttfb: [], ok: 0, total: 0 };
    const chk = checks[c.id];
    const md = `# ${c.name} — Hosting en ${meta.name} ${meta.flag}

Fuente: ${ROOT}/${cslug}/${c.slug}
Licencia: CC-BY-4.0 · Atribución: EligeTuHosting
Última actualización: ${c.updated_at || NOW}

## Datos verificables
- Sitio oficial: ${c.website ?? '—'}
- Razón social: ${c.legal_name ?? '—'}
- Grupo corporativo: ${c.corporate_group ?? '—'}
- Datacenter declarado: ${c.datacenter_location ?? '—'}
- Año de fundación: ${c.year_founded ?? '—'}
- Tecnologías declaradas: ${(c.technologies || []).join(', ') || '—'}
- Teléfono: ${c.contact_phone ?? '—'}
- Email: ${c.contact_email ?? '—'}

## Verificación técnica${chk ? '' : ' (pendiente)'}
${chk ? `- IP resuelta: ${chk.resolved_ip ?? '—'}
- ASN: ${chk.asn ? 'AS' + chk.asn : '—'} (${chk.asn_org ?? '—'})
- SSL emisor: ${chk.ssl_issuer ?? '—'}
- SSL vigencia hasta: ${chk.ssl_valid_to ? chk.ssl_valid_to.slice(0,10) : '—'}
- TTFB muestra: ${chk.ttfb_ms ?? '—'} ms
- Última verificación: ${chk.checked_at ?? '—'}` : '- Sin datos aún; se completará en el próximo ciclo del edge function `latam-site-check`.'}

## Benchmark (últimos 7 días)
- TTFB mediano: ${median(b.ttfb) ?? '—'} ms
- Muestras: ${b.ttfb.length}
- Uptime observado: ${b.total ? Math.round((b.ok / b.total) * 1000) / 10 + '%' : '—'}

## Contexto editorial
${c.editorial_summary || '_Sin resumen editorial aún._'}

## Enlaces
- Volver al directorio: ${ROOT}/${cslug}
- Comparativas: ${ROOT}/${cslug}/comparativa/
- Reclamos verificados: ${ROOT}/reclamos
`;
    await fs.mkdir(`public/${cslug}/${c.slug}`, { recursive: true });
    await fs.writeFile(`public/${cslug}/${c.slug}.md`, md, 'utf8');
  }

  console.log(`✅ ${meta.name}: ${companies.length} md + benchmarks JSON + /${cslug}/benchmark/`);
  return { cslug, providers: companies.length };
}

async function generateDatosPage() {
  const canonical = `${ROOT}/datos`;
  const title = 'Datos abiertos de hosting (LATAM) · CC-BY-4.0 | EligeTuHosting';
  const description = 'Endpoints JSON abiertos con proveedores, verificaciones técnicas y benchmarks de hosting en Chile, Perú, México, Colombia y Argentina. Licencia CC-BY-4.0.';
  const endpoints = [
    '/data/proveedores-latam.json',
    '/data/proveedores-cl.json',
    '/data/proveedores-pe.json',
    '/data/proveedores-mx.json',
    '/data/proveedores-co.json',
    '/data/proveedores-ar.json',
    '/data/benchmarks-pe.json',
    '/data/benchmarks-mx.json',
    '/data/benchmarks-co.json',
    '/data/benchmarks-ar.json',
  ];
  const body = `<header><h1>Datos abiertos de hosting en LATAM</h1><p>${esc(description)}</p></header>
    <section><h2>Endpoints JSON</h2><ul>${endpoints.map(e => `<li><a href="${e}">${ROOT}${e}</a></li>`).join('')}</ul></section>
    <section><h2>Markdown para agentes de IA</h2><ul>
      ${['pe','mx','co','ar'].map(c => `<li><a href="/${c}.md">/${c}.md</a></li>`).join('')}
      <li><a href="/llms.txt">/llms.txt</a></li><li><a href="/llms-full.txt">/llms-full.txt</a></li>
    </ul></section>
    <section><h2>Licencia</h2><p>Todos los archivos se publican bajo <a href="https://creativecommons.org/licenses/by/4.0/deed.es" rel="noopener">CC-BY-4.0</a>. Citá <strong>EligeTuHosting</strong> y enlazá a <a href="${ROOT}/">${ROOT}/</a>.</p></section>`;
  const datasetLd = {
    '@context': 'https://schema.org', '@type': 'Dataset',
    name: 'Directorio de hosting LATAM', description, url: canonical,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'EligeTuHosting', url: `${ROOT}/` },
    distribution: endpoints.map(p => ({ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${ROOT}${p}` })),
    dateModified: NOW,
  };
  const headExtra = `<script type="application/ld+json">${JSON.stringify(datasetLd)}</script>`;
  await fs.mkdir('public/datos', { recursive: true });
  await fs.writeFile('public/datos/index.html',
    buildHtml({ title, description, canonical, locale: 'es', headExtra, bodyContent: body, keywords: 'datos abiertos hosting, benchmarks hosting latam, cc-by-4.0, api hosting' }), 'utf8');
  console.log('✅ /datos generado');
}

async function generateLatamHub() {
  const canonical = `${ROOT}/latam`;
  const title = 'Hosting en Latinoamérica — Directorios verificados por país | EligeTuHosting';
  const description = 'Directorios verificados de hosting en Chile, Perú, México, Colombia y Argentina. Datos abiertos CC-BY-4.0: razón social, datacenter, ASN, SSL, TTFB, reputación.';
  const totals = {};
  for (const cslug of Object.keys(COUNTRIES)) {
    const rows = await sbFetch(`hosting_companies?select=id&country=eq.${COUNTRIES[cslug].code}&is_verified=eq.true&limit=999`);
    totals[cslug] = rows.length;
  }
  const items = Object.entries(COUNTRIES).map(([cslug, m]) => ({ cslug, m, total: totals[cslug] }));
  items.push({ cslug: '', m: { name: 'Chile', long: 'chile', flag: '🇨🇱', locale: 'es-CL' }, total: null, chile: true });
  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: title,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1,
      url: it.chile ? 'https://eligetuhosting.cl/' : `${ROOT}/${it.cslug}`,
      name: `Hosting en ${it.m.name}`,
    })),
  };
  const body = `<header><h1>Hosting en Latinoamérica ${items.map(i => i.m.flag).join(' ')}</h1>
    <p>${esc(description)}</p>
    <p style="font-size:13px;color:#6B7280"><strong>Última actualización:</strong> ${NOW.slice(0, 10)}</p></header>
    <section><h2>Directorios verificados</h2><ul>
      ${items.map(it => `<li>${it.m.flag} <a href="${it.chile ? 'https://eligetuhosting.cl/' : `/${it.cslug}`}"><strong>${esc(it.m.name)}</strong></a>${it.total != null ? ` — ${it.total} proveedores verificados` : ''}${it.chile ? '' : ` · <a href="/${it.cslug}/mejor-hosting-${it.m.long}-2026">mejor hosting ${it.m.long}</a> · <a href="/${it.cslug}/hosting-con-datacenter-local">datacenter local</a> · <a href="/${it.cslug}/benchmark">benchmark</a>`}</li>`).join('')}
    </ul></section>
    <section><h2>Metodología</h2><p>Verificamos: (1) razón social local en el registro mercantil, (2) datacenter declarado y contrastado con ASN + BGP, (3) tecnología pública, (4) TTFB medido cada hora, (5) reclamos verificados por email. No publicamos puntajes numéricos por país hasta acumular 60–90 días de benchmarks continuos. Chile mantiene su metodología completa vigente en <a href="https://eligetuhosting.cl/">eligetuhosting.cl</a>.</p></section>
    <section><h2>Datos abiertos</h2><p>Todo el dataset se publica bajo <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a>. Ver <a href="/datos">endpoints JSON</a>.</p></section>`;
  const headExtra = `<script type="application/ld+json">${JSON.stringify(itemListLd)}</script>`;
  await fs.mkdir('public/latam', { recursive: true });
  await fs.writeFile('public/latam/index.html',
    buildHtml({ title, description, canonical, locale: 'es-419', headExtra, bodyContent: body }), 'utf8');
  console.log('✅ /latam generado');
}

// Main
const results = [];
for (const cslug of Object.keys(COUNTRIES)) {
  results.push(await generateForCountry(cslug));
}
await generateDatosPage();
await generateLatamHub();
console.log('\n📊 Resumen LATAM Fase 3-4:');
console.log(results);
