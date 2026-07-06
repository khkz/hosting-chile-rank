// Generador estático (SIN puppeteer) de las 55 fichas LATAM con:
//  - Datos verificables (razón social, DC, año, tech, contacto)
//  - Verificación técnica (IP, ASN, SSL, TTFB) desde latam_site_checks
//  - Contexto editorial
//  - Reputación (conteo de reclamos verificados)
//  - Alternativas en el mismo país (priorizando datacenter local)
//  - FAQ + FAQPage JSON-LD + dateModified
//  - og:locale del país
//
// Escribe public/{pais}/{slug}/index.html. La SPA hidrata encima.
import fs from 'node:fs/promises';
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
const ROOT = 'https://eligetuhosting.com';
const NOW = new Date().toISOString();

async function sb(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } });
  if (!r.ok) { console.warn(`  sb ${path} → ${r.status}`); return []; }
  return r.json();
}

function fmtDate(d) { return d ? String(d).slice(0, 10) : '—'; }
function hasLocalDc(cslug, s) { return hasLocalDatacenter(cslug, s); }

function faqs(c, cslug, meta, checksDate) {
  return [
    { q: `¿Tiene ${c.name} datacenter en ${meta.name}?`,
      a: c.datacenter_location
          ? (hasLocalDc(cslug, c.datacenter_location)
             ? `Sí. Según su información pública, ${c.name} declara datacenter en ${meta.name} (${c.datacenter_location}). Verificamos coherencia con ASN cuando fue posible.`
             : `No con presencia declarada en ${meta.name}. Datacenter declarado: ${c.datacenter_location}.`)
          : `${c.name} no publica en su sitio la ubicación exacta del datacenter, por lo que la latencia local y la jurisdicción de los datos deben confirmarse antes de contratar.`,
    },
    { q: `¿Cuál es la razón social de ${c.name}?`,
      a: c.legal_name ? `${c.legal_name}.` : `${c.name} no publica una razón social local verificable; la factura puede emitirse desde una entidad extranjera.` },
    { q: `¿Hace cuánto opera ${c.name}?`,
      a: c.year_founded ? `Declara operar desde ${c.year_founded}.` : `${c.name} no publica su año de fundación en fuentes oficiales verificables.` },
    { q: `¿Qué tecnología usa ${c.name}?`,
      a: (c.technologies && c.technologies.length) ? `Declara: ${c.technologies.join(', ')}.` : `${c.name} no publica en su sitio un stack técnico detallado.` },
    { q: `¿Cómo se verifican estos datos?`,
      a: `Cruzamos el sitio oficial, registros mercantiles públicos (RUC/RFC/NIT/CUIT), ASN + BGP para la IP de origen y una medición TTFB con timestamp${checksDate ? ` (último check: ${checksDate.slice(0, 10)})` : ''}.` },
  ];
}

function techList(c, chk, cslug, meta) {
  const rows = [
    ['Sitio oficial', c.website ? `<a href="${esc(c.website)}" rel="nofollow noopener">${esc(c.website)}</a>` : '—'],
    ['Razón social', esc(c.legal_name || '—')],
    ['Grupo corporativo', esc(c.corporate_group || '—')],
    ['Datacenter declarado', c.datacenter_location ? `${esc(c.datacenter_location)}${hasLocalDc(cslug, c.datacenter_location) ? ` <strong>(en ${meta.name})</strong>` : ''}` : '—'],
    ['Año de fundación', c.year_founded ?? '—'],
    ['Tecnologías', esc((c.technologies || []).slice(0, 8).join(', ') || '—')],
    ['Teléfono', esc(c.contact_phone || '—')],
    ['Email', esc(c.contact_email || '—')],
  ];
  return `<table style="width:100%;border-collapse:collapse;font-size:14px" border="1" cellpadding="6"><tbody>${rows.map(r => `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td></tr>`).join('')}</tbody></table>`;
}

function techVerify(chk) {
  if (!chk) return `<p><em>Verificación técnica en curso; se completa en el próximo ciclo del edge function <code>latam-site-check</code>.</em></p>`;
  const rows = [
    ['IP resuelta', chk.resolved_ip || '—'],
    ['ASN', chk.asn ? `AS${chk.asn}${chk.asn_org ? ' — ' + chk.asn_org : ''}` : '—'],
    ['SSL emisor', chk.ssl_issuer || '—'],
    ['SSL vigencia hasta', fmtDate(chk.ssl_valid_to)],
    ['TTFB muestra', chk.ttfb_ms ? `${chk.ttfb_ms} ms` : '—'],
    ['Estado HTTP', chk.http_status ?? '—'],
    ['Última verificación', chk.checked_at ? chk.checked_at.slice(0, 16).replace('T', ' ') + ' UTC' : '—'],
  ];
  return `<table style="width:100%;border-collapse:collapse;font-size:14px" border="1" cellpadding="6"><tbody>${rows.map(r => `<tr><td><strong>${esc(r[0])}</strong></td><td>${esc(String(r[1]))}</td></tr>`).join('')}</tbody></table>`;
}

function alternatives(c, others, cslug, meta) {
  const list = others
    .filter(o => o.slug !== c.slug)
    .sort((a, b) => {
      const la = hasLocalDc(cslug, a.datacenter_location) ? 0 : 1;
      const lb = hasLocalDc(cslug, b.datacenter_location) ? 0 : 1;
      if (la !== lb) return la - lb;
      return a.name.localeCompare(b.name);
    }).slice(0, 6);
  if (!list.length) return '';
  return `<ul>${list.map(o => `<li><a href="/${cslug}/${esc(o.slug)}">${esc(o.name)}</a>${hasLocalDc(cslug, o.datacenter_location) ? ` — datacenter en ${meta.name}` : ''} · <a href="/${cslug}/comparativa/${[c.slug, o.slug].sort().join('-vs-')}">comparar</a></li>`).join('')}</ul>`;
}

async function run() {
  let total = 0;
  for (const [cslug, meta] of Object.entries(COUNTRIES)) {
    const companies = await sb(`hosting_companies?select=id,slug,name,website,legal_name,corporate_group,datacenter_location,year_founded,technologies,contact_phone,contact_email,editorial_summary,updated_at&country=eq.${meta.code}&is_verified=eq.true&limit=999`);
    if (!companies.length) { console.log(`⚠️  ${meta.code}: 0 proveedores`); continue; }
    const ids = companies.map(c => `"${c.id}"`).join(',');
    const [checks, complaints] = await Promise.all([
      sb(`latam_site_checks?select=company_id,resolved_ip,asn,asn_org,ssl_issuer,ssl_valid_to,ttfb_ms,http_status,checked_at&company_id=in.(${ids})&order=checked_at.desc&limit=1000`),
      sb(`public_complaints?select=company_id,status&company_id=in.(${ids})&status=in.(verified,resolved)&limit=5000`),
    ]);
    const checkMap = {};
    for (const r of checks) if (!checkMap[r.company_id]) checkMap[r.company_id] = r;
    const complaintMap = {};
    for (const r of complaints) complaintMap[r.company_id] = (complaintMap[r.company_id] || 0) + 1;

    for (const c of companies) {
      const chk = checkMap[c.id];
      const rep = complaintMap[c.id] || 0;
      const canonical = `${ROOT}/${cslug}/${c.slug}`;
      const title = `${c.name} — Hosting en ${meta.name} · Ficha verificada | EligeTuHosting`;
      const description = `Datos verificables de ${c.name} para hosting en ${meta.name}: razón social, datacenter, ASN, SSL, TTFB medido, tecnologías y reputación. Sin puntajes inventados.`;
      const editorial = c.editorial_summary || `${c.name} es un proveedor con actividad comercial en ${meta.name}. Verificamos su información pública sin publicar puntajes hasta acumular benchmarks propios.`;
      const faq = faqs(c, cslug, meta, chk?.checked_at);
      const jsonLd = [
        { '@context': 'https://schema.org', '@type': 'Organization', name: c.name, url: c.website, address: { '@type': 'PostalAddress', addressCountry: meta.code } },
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${ROOT}/` },
          { '@type': 'ListItem', position: 2, name: `Hosting en ${meta.name}`, item: `${ROOT}/${cslug}` },
          { '@type': 'ListItem', position: 3, name: c.name, item: canonical },
        ]},
        { '@context': 'https://schema.org', '@type': 'FAQPage', dateModified: NOW, mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      ];
      const headExtra = [
        `<link rel="alternate" type="text/markdown" href="/${cslug}/${esc(c.slug)}.md" />`,
        ...jsonLd.map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`),
      ].join('\n    ');
      const body = `
        <nav style="font-size:13px;color:#6B7280"><a href="/">Inicio</a> / <a href="/${cslug}">Hosting en ${meta.name} ${meta.flag}</a> / ${esc(c.name)}</nav>
        <h1>${esc(c.name)} — Hosting en ${esc(meta.name)} ${meta.flag}</h1>
        <p style="color:#4B5563">${esc(description)}</p>
        <p style="font-size:13px;color:#6B7280"><strong>Última actualización:</strong> ${fmtDate(c.updated_at || NOW)}</p>

        <h2>Datos verificables</h2>
        ${techList(c, chk, cslug, meta)}

        <h2>Verificación técnica</h2>
        ${techVerify(chk)}

        <h2>Contexto editorial</h2>
        <p>${esc(editorial)}</p>

        <h2>Reputación</h2>
        <p><strong>${rep}</strong> reclamo${rep === 1 ? '' : 's'} verificado${rep === 1 ? '' : 's'} en nuestro registro público (desde 2026-01-01). ${rep === 0 ? 'Ausencia de reclamos verificados no equivale a ausencia de problemas.' : ''} <a href="/reclamos">Ver reclamos públicos</a>.</p>

        <h2>Alternativas en ${esc(meta.name)}</h2>
        ${alternatives(c, companies, cslug, meta) || `<p>—</p>`}

        <h2>Preguntas frecuentes</h2>
        ${faq.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}

        <p style="margin-top:24px"><a href="/${cslug}">← Directorio ${esc(meta.name)}</a> · <a href="/${cslug}/mejor-hosting-${meta.long}-2026">Mejor hosting ${esc(meta.name)} 2026</a> · <a href="/${cslug}/${esc(c.slug)}.md">Versión Markdown</a></p>
      `;
      const html = buildHtml({ title, description, canonical, locale: meta.locale, headExtra, bodyContent: body, keywords: `${c.name.toLowerCase()}, hosting ${meta.long}, ${c.name.toLowerCase()} opiniones, hosting ${meta.name.toLowerCase()}` });
      await fs.mkdir(`public/${cslug}/${c.slug}`, { recursive: true });
      await fs.writeFile(`public/${cslug}/${c.slug}/index.html`, html, 'utf8');
      total++;
    }
    console.log(`✅ ${meta.code}: ${companies.length} fichas`);
  }
  console.log(`✨ Total fichas LATAM regeneradas: ${total}`);
}

await run();
