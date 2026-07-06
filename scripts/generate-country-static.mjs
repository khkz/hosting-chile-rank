// Generador programático (SIN puppeteer) de HTML estático por país para:
//  1) /{pais}/mejor-hosting-{nombrepais}-2026
//  2) /{pais}/hosting-con-datacenter-local
//  3) /{pais}/comparativa/{a}-vs-{b}  (TODAS las parejas)
//
// Escribe directamente a public/{pais}/... Los archivos quedan committeados
// y Vite los sirve tal cual (dist copia public/). Ideal para crawlers que
// NO ejecutan JS, sin depender de puppeteer.
//
// La UI React sigue montándose encima del HTML: si un humano navega, ve la
// versión completa; si un bot pide el HTML, ve el shell con head + contenido
// crawleable + JSON-LD.

import fs from 'node:fs/promises';
import path from 'node:path';
import { buildHtml, esc } from './lib/shell.mjs';
import { hasLocalDatacenter } from './lib/dc-local.mjs';

const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://oegvwjxrlmtwortyhsrv.supabase.co';
const SB_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA4NzEsImV4cCI6MjA2MjAzNjg3MX0.ruA3v0xiTGgH2vubqAnWPgbvwSOlaVp7Oc0e2YeZq4M';

const COUNTRIES = {
  pe: { code: 'PE', slug: 'pe', name: 'Perú', long: 'peru', flag: '🇵🇪', locale: 'es-PE' },
  mx: { code: 'MX', slug: 'mx', name: 'México', long: 'mexico', flag: '🇲🇽', locale: 'es-MX' },
  co: { code: 'CO', slug: 'co', name: 'Colombia', long: 'colombia', flag: '🇨🇴', locale: 'es-CO' },
  ar: { code: 'AR', slug: 'ar', name: 'Argentina', long: 'argentina', flag: '🇦🇷', locale: 'es-AR' },
};

async function fetchProviders(code) {
  const res = await fetch(`${SB_URL}/rest/v1/hosting_companies?select=id,slug,name,website,legal_name,datacenter_location,year_founded,corporate_group,contact_phone,contact_address,technologies,is_curated,updated_at&country=eq.${code}&is_verified=eq.true`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  });
  if (!res.ok) return [];
  return await res.json();
}

const hasLocalDc = (cslug, s) => hasLocalDatacenter(cslug, s);

const rank = (list, cslug) => list.slice().sort((a, b) => {
  const la = hasLocalDc(cslug, a.datacenter_location) ? 0 : 1;
  const lb = hasLocalDc(cslug, b.datacenter_location) ? 0 : 1;
  if (la !== lb) return la - lb;
  const ea = a.legal_name ? 0 : 1;
  const eb = b.legal_name ? 0 : 1;
  if (ea !== eb) return ea - eb;
  const ya = a.year_founded ?? 9999;
  const yb = b.year_founded ?? 9999;
  if (ya !== yb) return ya - yb;
  return a.name.localeCompare(b.name);
});

async function writeFile(relPath, html) {
  const abs = path.join('public', relPath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, html, 'utf8');
}

/* ---------- 1) Mejor hosting {pais} 2026 -------------------------------- */
function renderBestHosting(cslug, meta, providers) {
  const list = rank(providers, cslug);
  const canonical = `https://eligetuhosting.com/${cslug}/mejor-hosting-${meta.long}-2026`;
  const title = `Mejor hosting en ${meta.name} 2026 · Directorio verificado | EligeTuHosting`;
  const description = `Ranking pre-benchmark de proveedores de hosting en ${meta.name}, ordenados por datos objetivos: datacenter local real, razón social local y antigüedad. Sin puntajes inventados.`;
  const curated = list.find(p => p.is_curated);
  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: title,
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://eligetuhosting.com/${cslug}/${p.slug}`, name: p.name })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${meta.name}`, item: `https://eligetuhosting.com/${cslug}` },
      { '@type': 'ListItem', position: 3, name: `Mejor hosting ${meta.name} 2026`, item: canonical },
    ],
  };
  const faqs = [
    { q: `¿Por qué no publican puntajes numéricos todavía para ${meta.name}?`, a: `Porque publicar notas de 1–10 sin benchmarks propios, reclamos verificados y auditoría de ASN es exactamente lo que hacen los sitios falsos. En ${meta.name} estamos en la fase de datos: verificamos razón social, datacenter, tecnología y trayectoria.` },
    { q: '¿Cómo se ordena este listado entonces?', a: 'Tres criterios objetivos declarados: (1) datacenter local real, (2) razón social local registrada, (3) antigüedad. Empates alfabéticos.' },
    { q: `¿HostingPlus aparece primero por pagar?`, a: 'No. HostingPlus figura como recomendación editorial con divulgación visible. El orden del ranking respeta los tres criterios objetivos.' },
    { q: '¿De dónde salen los datos?', a: `WHOIS, ASN + BGP, sitios oficiales, registros mercantiles y verificaciones técnicas propias. Todo descargable en /data/proveedores-${cslug}.json bajo CC-BY-4.0.` },
  ];
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const rows = list.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><a href="/${cslug}/${esc(p.slug)}">${esc(p.name)}</a></td>
      <td>${hasLocalDc(cslug, p.datacenter_location) ? 'Sí' : (p.datacenter_location ? `Fuera: ${esc(p.datacenter_location)}` : 'No declara')}</td>
      <td>${esc(p.legal_name || '—')}</td>
      <td>${p.year_founded || '—'}</td>
    </tr>`).join('');
  const bodyContent = `
    <nav><a href="/">Inicio</a> / <a href="/${cslug}">Hosting en ${meta.name}</a> / Mejor hosting ${meta.name} 2026</nav>
    <h1>Mejor hosting en ${esc(meta.name)} 2026 ${meta.flag}</h1>
    <p>Directorio pre-benchmark ordenado por criterios objetivos: (1) datacenter local real, (2) razón social local declarada, (3) antigüedad. Sin puntajes inventados. ${list.length} proveedores verificados.</p>
    ${curated ? `<section style="border:1px solid #EF233C40;background:#EF233C0d;padding:16px;border-radius:8px;margin:16px 0">
      <strong>Recomendado editorial:</strong> <a href="/${cslug}/${esc(curated.slug)}">${esc(curated.name)}</a>.
      Divulgación: podemos recibir comisión si contratas por este enlace; el orden objetivo del ranking no cambia.
    </section>` : ''}
    <table style="width:100%;border-collapse:collapse;font-size:14px" border="1" cellpadding="6">
      <thead><tr><th>#</th><th>Proveedor</th><th>Datacenter local</th><th>Razón social</th><th>Antigüedad</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <h2>Metodología</h2>
    <p>Publicamos únicamente datos verificables. Cuando completemos benchmarks propios reproducibles y un ciclo de reclamos verificados por email, publicaremos rankings numéricos con la misma metodología usada en Chile. Ver también <a href="/${cslug}/hosting-con-datacenter-local">proveedores con datacenter local</a>.</p>
    <h2>Preguntas frecuentes</h2>
    ${faqs.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}
  `;
  const headExtra = [itemList, breadcrumb, faqLd].map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n    ');
  return buildHtml({ title, description, canonical, locale: meta.locale, headExtra, bodyContent });
}

/* ---------- 2) Datacenter local ---------------------------------------- */
function renderDatacenterLocal(cslug, meta, providers) {
  const list = providers.filter(p => hasLocalDc(cslug, p.datacenter_location));
  const canonical = `https://eligetuhosting.com/${cslug}/hosting-con-datacenter-local`;
  const title = `Hosting con datacenter local en ${meta.name} · Verificado por ASN | EligeTuHosting`;
  const description = `Proveedores de hosting con datacenter físicamente en ${meta.name}, verificado por ASN, BGP y declaraciones del proveedor.`;
  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: title,
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://eligetuhosting.com/${cslug}/${p.slug}`, name: p.name })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${meta.name}`, item: `https://eligetuhosting.com/${cslug}` },
      { '@type': 'ListItem', position: 3, name: 'Datacenter local', item: canonical },
    ],
  };
  const items = list.map(p => `
    <li>
      <strong><a href="/${cslug}/${esc(p.slug)}">${esc(p.name)}</a></strong>
      — datacenter declarado: ${esc(p.datacenter_location)}
      ${p.legal_name ? ` · razón social: ${esc(p.legal_name)}` : ''}
      ${p.year_founded ? ` · desde ${p.year_founded}` : ''}
    </li>`).join('');
  const bodyContent = `
    <nav><a href="/">Inicio</a> / <a href="/${cslug}">Hosting en ${meta.name}</a> / Datacenter local</nav>
    <h1>Hosting con datacenter local en ${esc(meta.name)} ${meta.flag}</h1>
    <p>Únicamente proveedores cuyo datacenter está físicamente en ${esc(meta.name)} y lo declaran públicamente. Cruzamos declaración oficial con verificación técnica (IP → ASN → BGP).</p>
    <h2>Cómo se verificó</h2>
    <ul>
      <li><strong>Declaración del proveedor</strong>: sitio oficial (página de infraestructura, planes o TOS).</li>
      <li><strong>ASN + BGP</strong>: resolvemos la IP del sitio y consultamos el ASN dueño. Si está anunciado desde ${esc(meta.name)}, sube la confianza.</li>
      <li><strong>Registro mercantil</strong>: verificamos razón social local que respalde la operación.</li>
    </ul>
    ${list.length === 0
      ? `<p><em>Aún no hay proveedores con datacenter local declarado y verificable en ${esc(meta.name)}.</em></p>`
      : `<ul>${items}</ul>`}
    <p><a href="/${cslug}">← Volver al directorio de ${esc(meta.name)}</a></p>
  `;
  const headExtra = [itemList, breadcrumb].map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n    ');
  return buildHtml({ title, description, canonical, locale: meta.locale, headExtra, bodyContent });
}

/* ---------- 3) Comparativa a-vs-b -------------------------------------- */
function renderComparativa(cslug, meta, p1, p2) {
  const canonicalPair = `${p1.slug}-vs-${p2.slug}`;
  const canonical = `https://eligetuhosting.com/${cslug}/comparativa/${canonicalPair}`;
  const title = `${p1.name} vs ${p2.name} — Comparativa hosting ${meta.name} | EligeTuHosting`;
  const description = `Comparativa objetiva entre ${p1.name} y ${p2.name} para hosting en ${meta.name}: datacenter, razón social, antigüedad, tecnologías.`;
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${meta.name}`, item: `https://eligetuhosting.com/${cslug}` },
      { '@type': 'ListItem', position: 3, name: `${p1.name} vs ${p2.name}`, item: canonical },
    ],
  };
  const techs = (t) => Array.isArray(t) ? t.slice(0, 6).join(', ') || '—' : '—';
  const rows = [
    ['Razón social', p1.legal_name || '—', p2.legal_name || '—'],
    ['Datacenter declarado', p1.datacenter_location || '—', p2.datacenter_location || '—'],
    [`Datacenter en ${meta.name}`, hasLocalDc(cslug, p1.datacenter_location) ? 'Sí' : 'No', hasLocalDc(cslug, p2.datacenter_location) ? 'Sí' : 'No'],
    ['Año fundación', p1.year_founded ?? '—', p2.year_founded ?? '—'],
    ['Grupo corporativo', p1.corporate_group || '—', p2.corporate_group || '—'],
    ['Teléfono', p1.contact_phone || '—', p2.contact_phone || '—'],
    ['Tecnologías', techs(p1.technologies), techs(p2.technologies)],
  ];
  const bodyContent = `
    <nav><a href="/">Inicio</a> / <a href="/${cslug}">Hosting en ${meta.name}</a> / ${esc(p1.name)} vs ${esc(p2.name)}</nav>
    <h1>${esc(p1.name)} vs ${esc(p2.name)}</h1>
    <p>Comparativa lado a lado con datos verificables en ${esc(meta.name)}. Sin puntajes inventados.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px" border="1" cellpadding="6">
      <thead><tr><th>Criterio</th><th><a href="/${cslug}/${esc(p1.slug)}">${esc(p1.name)}</a></th><th><a href="/${cslug}/${esc(p2.slug)}">${esc(p2.name)}</a></th></tr></thead>
      <tbody>${rows.map(r => `<tr><td><strong>${esc(r[0])}</strong></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody>
    </table>
    <p><a href="/${cslug}">← Directorio ${esc(meta.name)}</a> · <a href="/${cslug}/mejor-hosting-${meta.long}-2026">Mejor hosting ${esc(meta.name)} 2026</a></p>
  `;
  const headExtra = `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`;
  return buildHtml({ title, description, canonical, locale: meta.locale, headExtra, bodyContent });
}

/* ---------- Main -------------------------------------------------------- */
let totalPages = 0;
for (const [cslug, meta] of Object.entries(COUNTRIES)) {
  const providers = await fetchProviders(meta.code);
  console.log(`🌎 ${meta.code}: ${providers.length} proveedores`);
  if (providers.length === 0) continue;

  // 1) mejor-hosting
  await writeFile(`${cslug}/mejor-hosting-${meta.long}-2026/index.html`, renderBestHosting(cslug, meta, providers));
  totalPages++;
  // 2) datacenter local
  await writeFile(`${cslug}/hosting-con-datacenter-local/index.html`, renderDatacenterLocal(cslug, meta, providers));
  totalPages++;
  // 3) todas las comparativas
  const sorted = providers.slice().sort((a, b) => a.slug.localeCompare(b.slug));
  let pairs = 0;
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const [a, b] = [sorted[i], sorted[j]];
      const html = renderComparativa(cslug, meta, a, b);
      await writeFile(`${cslug}/comparativa/${a.slug}-vs-${b.slug}/index.html`, html);
      pairs++;
      totalPages++;
    }
  }
  console.log(`  ✅ ${cslug}: mejor-hosting + datacenter-local + ${pairs} comparativas`);
}
console.log(`✨ Total páginas estáticas generadas: ${totalPages}`);
