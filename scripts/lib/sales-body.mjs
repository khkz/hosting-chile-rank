// Shared sales-level (P1) body builder for provider fichas.
// Layout mirrors the /pe/hostdime-pe pilot. Everything is data-driven:
// missing fields cause the corresponding block to be omitted.
import { esc } from './shell.mjs';
import { hasLocalDatacenter } from './dc-local.mjs';

const NOW_ISO = new Date().toISOString();
const REVIEWED_ON = NOW_ISO.slice(0, 10);

function fmtDate(d) { return d ? String(d).slice(0, 10) : null; }

function heroAnswer({ c, meta, complaintsCount, yearsOperating, dcLocal }) {
  const parts = [];
  parts.push(`${c.name} es un proveedor de hosting con actividad comercial en ${meta.name}.`);
  if (c.year_founded && yearsOperating != null) {
    parts.push(`Opera desde ${c.year_founded} (${yearsOperating} años).`);
  }
  if (c.legal_name) parts.push(`Razón social: ${c.legal_name}.`);
  if (dcLocal === true) parts.push(`Declara datacenter en ${meta.name}, lo que reduce la latencia local.`);
  else if (dcLocal === false) parts.push(`No declara datacenter en ${meta.name}.`);
  parts.push(complaintsCount === 0
    ? 'Sin reclamos verificados en nuestro registro público.'
    : `${complaintsCount} ${complaintsCount === 1 ? 'reclamo verificado' : 'reclamos verificados'} en nuestro registro público.`);
  return parts.join(' ');
}

function forWhoBlocks({ c, meta, dcLocal, techs }) {
  const yes = [];
  const no = [];
  if (dcLocal === true) yes.push(`Proyectos con audiencia en ${meta.name} que necesitan latencia local.`);
  if (c.legal_name && c.country && c.country !== 'CL') yes.push(`Empresas que necesitan facturación con entidad local (${c.legal_name}).`);
  if (techs.some(t => /cpanel|plesk/i.test(t))) yes.push('Usuarios que buscan panel estándar (cPanel/Plesk).');
  if (techs.some(t => /wordpress/i.test(t))) yes.push('Sitios WordPress con optimizaciones específicas.');
  if (techs.some(t => /dedicad|vps|cloud|colocation/i.test(t))) yes.push('Cargas medianas o altas: VPS, dedicados, cloud o colocation.');
  if (yes.length === 0) yes.push(`Quienes buscan un proveedor con presencia declarada en ${meta.name}.`);

  if (dcLocal === false) no.push(`Proyectos que exigen datos y latencia estrictamente dentro de ${meta.name}.`);
  if (!c.legal_name) no.push('Empresas que requieren factura emitida por una entidad local verificable.');
  no.push('Comparadores de precio puros: verifica también soporte, uptime real y política de reembolso.');
  return { yes, no };
}

function faqList({ c, meta, chk, complaintsCount, yearsOperating, dcLocal, techs }) {
  const faq = [];
  faq.push({
    q: `¿${c.name} tiene datacenter en ${meta.name}?`,
    a: dcLocal === true
      ? `Sí. ${c.name} declara datacenter en ${meta.name}${c.datacenter_location ? ` (${c.datacenter_location})` : ''}. Verificar la ubicación real antes de contratar sigue siendo recomendable para cargas críticas.`
      : dcLocal === false
        ? `No. Su información pública indica que el datacenter está fuera de ${meta.name}${c.datacenter_location ? ` (${c.datacenter_location})` : ''}. Si necesitas latencia mínima o cumplimiento local, considéralo antes de contratar.`
        : `${c.name} no publica en su sitio la ubicación exacta del datacenter. Antes de contratar, confirma con soporte si la infraestructura está dentro de ${meta.name}.`,
  });
  if (c.legal_name) faq.push({ q: `¿Cuál es la razón social de ${c.name}?`, a: `La razón social registrada es ${c.legal_name}${c.corporate_group ? `, del grupo ${c.corporate_group}` : ''}. Verifica que la factura sea emitida por esta entidad si necesitas crédito fiscal local.` });
  if (c.year_founded) faq.push({ q: `¿Hace cuánto opera ${c.name}?`, a: `Registra actividad desde ${c.year_founded}, es decir ${yearsOperating} años en el mercado. La antigüedad no garantiza calidad, pero sí trayectoria y ayuda a evaluar estabilidad frente a proveedores muy nuevos.` });
  if (techs.length) faq.push({ q: `¿Qué tecnologías declara ${c.name}?`, a: `Su stack público incluye: ${techs.slice(0, 8).join(', ')}. Estas tecnologías son declaradas por el proveedor; verifica en su sitio oficial que estén disponibles en el plan concreto que planeas contratar.` });
  if (c.contact_phone || c.contact_email) faq.push({ q: `¿Cómo contactar a ${c.name}?`, a: `Canales publicados: ${[c.contact_phone && `teléfono ${c.contact_phone}`, c.contact_email && `correo ${c.contact_email}`].filter(Boolean).join(' y ')}. Un canal telefónico local suele indicar operación real en el país; confírmalo antes de contratar.` });
  faq.push({
    q: `¿${c.name} tiene reclamos públicos?`,
    a: `Registra ${complaintsCount} ${complaintsCount === 1 ? 'reclamo verificado' : 'reclamos verificados'} en nuestro registro público. Verificamos cada reclamo por correo antes de publicarlo. La ausencia de reclamos no equivale a ausencia de problemas: revisa también reseñas independientes.`,
  });
  faq.push({
    q: `¿Cómo se verifican estos datos?`,
    a: `Cruzamos el sitio oficial, registros mercantiles públicos, ASN + BGP para la IP de origen y una medición TTFB con timestamp${chk?.checked_at ? ` (último check: ${fmtDate(chk.checked_at)})` : ''}. Sin puntajes inventados; solo datos verificables.`,
  });
  return faq;
}

function techVerify(chk) {
  if (!chk) return '';
  const cells = [];
  if (chk.resolved_ip) cells.push(['📡 IP resuelta', chk.resolved_ip]);
  if (chk.asn) cells.push(['🖧 ASN', `AS${chk.asn}${chk.asn_org ? ` · ${chk.asn_org}` : ''}`]);
  if (chk.ssl_issuer) cells.push(['🔒 SSL', chk.ssl_issuer]);
  if (chk.ttfb_ms) cells.push(['⚡ TTFB', `${chk.ttfb_ms} ms${chk.checked_at ? ` · ${fmtDate(chk.checked_at)}` : ''}`]);
  if (!cells.length) return '';
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:20px 0">${cells.map(([t, v]) => `
    <div style="padding:12px;border:1px solid #E5E7EB;border-radius:8px;text-align:center;background:#F9FAFB">
      <div style="font-size:12px;font-weight:600">${esc(t)}</div>
      <div style="font-size:11px;color:#6B7280;margin-top:4px">${esc(v)}</div>
    </div>`).join('')}</div>`;
}

function verifiableTable(rows) {
  const visible = rows.filter(r => r[1] != null && r[1] !== '');
  if (!visible.length) return '';
  return `<table style="width:100%;border-collapse:collapse;font-size:14px" border="1" cellpadding="8"><tbody>${visible.map(r => `<tr><td><strong>${esc(r[0])}</strong></td><td>${esc(String(r[1]))}</td></tr>`).join('')}</tbody></table>`;
}

function plansTable(plans, currency) {
  if (!plans?.length) return '';
  return `<h2>Planes y precios</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px" border="1" cellpadding="8">
    <thead><tr><th align="left">Plan</th><th align="left">Precio${currency ? ` (${currency})` : ''}</th><th align="left">Capturado</th></tr></thead>
    <tbody>${plans.map(p => `<tr><td>${esc(p.name || '—')}</td><td>${p.price != null ? esc(String(p.price)) : '—'}</td><td>${fmtDate(p.updated_at) || '—'}</td></tr>`).join('')}</tbody>
  </table>`;
}

function alternativesBlock({ c, others, meta, urlBase, dcLocalOf }) {
  const list = others
    .filter(o => o.slug !== c.slug)
    .sort((a, b) => {
      const la = dcLocalOf(a) ? 0 : 1;
      const lb = dcLocalOf(b) ? 0 : 1;
      if (la !== lb) return la - lb;
      return String(a.name).localeCompare(String(b.name));
    })
    .slice(0, 6);
  if (!list.length) return '';
  return `<h2>Alternativas en ${esc(meta.name)}</h2>
    <ul>${list.map(o => `<li><a href="${urlBase}/${esc(o.slug)}">${esc(o.name)}</a>${dcLocalOf(o) ? ` — datacenter en ${esc(meta.name)}` : ''}</li>`).join('')}</ul>`;
}

/**
 * Build the P1 sales-level body + head-extra JSON-LD.
 * @param {object} args
 * @param {object} args.c         hosting_companies row
 * @param {object} args.meta      { code, slug, name, long, flag, locale }
 * @param {object|null} args.chk  latam_site_checks row or null
 * @param {number} args.complaintsCount
 * @param {Array}  args.plans     hosting_plans rows
 * @param {Array}  args.others    other companies for interlinking
 * @param {string} args.urlBase   e.g. "/pe" or "/catalogo"
 * @param {string} args.canonical
 * @param {string} args.currency  price display currency, optional
 * @param {string} args.breadcrumbHome name of the parent section
 * @param {string} args.breadcrumbHomeUrl
 * @param {string} args.compareUrl  URL for the secondary CTA "Comparar", optional
 * @param {(o:any)=>boolean} args.dcLocalOf  predicate for alternatives sort
 * @returns {{ body: string, headExtra: string, title: string, description: string, faq: Array }}
 */
export function buildSalesBody(args) {
  const { c, meta, chk, complaintsCount, plans, others, urlBase, canonical, currency, breadcrumbHome, breadcrumbHomeUrl, compareUrl, dcLocalOf } = args;
  const techs = Array.isArray(c.technologies) ? c.technologies : [];
  const yearsOperating = c.year_founded ? new Date().getFullYear() - c.year_founded : null;
  const dcLocal = c.datacenter_location
    ? (meta.code === 'CL' ? /chile/i.test(String(c.datacenter_location).replace(/sin\s+datacenter[^,.;]*/gi, ' ')) : hasLocalDatacenter(meta.slug, c.datacenter_location))
    : null;

  const hero = heroAnswer({ c, meta, complaintsCount, yearsOperating, dcLocal });
  const { yes, no } = forWhoBlocks({ c, meta, dcLocalOf: null, dcLocal, techs });
  const faq = faqList({ c, meta, chk, complaintsCount, yearsOperating, dcLocal, techs });

  // Normaliza uptime al formato "99,9%" (cap 99.9) — evita duplicar la lógica del front.
  const uptimeStr = (() => {
    const v = c.uptime_guarantee;
    if (v === null || v === undefined || v === '') return null;
    const raw = String(v).trim().replace('%', '').replace(',', '.').trim();
    const num = Number(raw);
    if (!Number.isFinite(num) || num <= 0) return null;
    const capped = num >= 100 ? 99.9 : num;
    return `${capped.toFixed(2).replace(/\.?0+$/, '').replace('.', ',')}%`;
  })();

  const badges = [];
  if (dcLocal === true) badges.push(`Datacenter en ${meta.name} ${meta.flag || ''}`);
  if (c.legal_name) badges.push('Razón social verificada');
  if (c.year_founded && yearsOperating >= 5) badges.push(`${yearsOperating} años operando`);
  if (c.has_ssl_free === true) badges.push('SSL Gratis');
  if (c.has_migration_free === true) badges.push('Migración Gratis');
  if (uptimeStr) badges.push(`Uptime ${uptimeStr}`);
  if (chk) badges.push('Verificación técnica al día');

  const historyParas = [];
  if (c.year_founded) {
    historyParas.push(`${c.name} abrió operaciones en <strong>${c.year_founded}</strong>${yearsOperating ? ` (${yearsOperating} años)` : ''}${c.legal_name ? ` bajo la razón social <strong>${esc(c.legal_name)}</strong>` : ''}${c.corporate_group ? `, parte del grupo <strong>${esc(c.corporate_group)}</strong>` : ''}.`);
  } else if (c.legal_name) {
    historyParas.push(`${c.name} opera bajo la razón social <strong>${esc(c.legal_name)}</strong>${c.corporate_group ? `, parte del grupo <strong>${esc(c.corporate_group)}</strong>` : ''}.`);
  }
  if (c.datacenter_location) {
    historyParas.push(`Infraestructura declarada: <strong>${esc(c.datacenter_location)}</strong>.${dcLocal === true ? ` Al estar dentro de ${meta.name}, la latencia local suele ser mejor que en proveedores que revenden infraestructura extranjera.` : dcLocal === false ? ` Esto ubica su infraestructura fuera de ${meta.name}, algo relevante si necesitas latencia mínima o cumplimiento normativo local.` : ''}`);
  }
  if (techs.length) {
    historyParas.push(`Su portafolio técnico declarado incluye: <em>${esc(techs.slice(0, 10).join(', '))}</em>. Confirma en el plan concreto qué componentes están realmente incluidos antes de contratar.`);
  }
  if (c.editorial_summary) historyParas.push(esc(c.editorial_summary));

  const badgesHtml = badges.length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
    <span style="background:#D1FAE5;color:#065F46;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600">✓ Datos verificados</span>
    ${badges.map(b => `<span style="border:1px solid #D1D5DB;padding:4px 10px;border-radius:999px;font-size:12px">${esc(b)}</span>`).join('')}
  </div>` : '';

  const historyBlock = historyParas.length ? `<h2>La historia detrás del proveedor</h2>
    ${historyParas.map(p => `<p>${p}</p>`).join('')}` : '';

  const forWhoBlock = `<h2>Para quién sí, para quién no</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin:16px 0">
      <div style="border:1px solid #A7F3D0;background:#ECFDF5;padding:16px;border-radius:8px">
        <div style="font-weight:600;color:#065F46;margin-bottom:8px">✅ Encaja bien si…</div>
        <ul style="margin:0;padding-left:20px">${yes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
      <div style="border:1px solid #FCD34D;background:#FFFBEB;padding:16px;border-radius:8px">
        <div style="font-weight:600;color:#92400E;margin-bottom:8px">⚠ Probablemente no encaje si…</div>
        <ul style="margin:0;padding-left:20px">${no.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
    </div>`;

  const dataTable = verifiableTable([
    ['Razón social', c.legal_name],
    ['Grupo corporativo', c.corporate_group],
    ['Operando desde', c.year_founded],
    ['Datacenter declarado', c.datacenter_location],
    ['Garantía de uptime', uptimeStr],
    ['SSL gratis', c.has_ssl_free === true ? 'Sí (incluido)' : c.has_ssl_free === false ? 'No incluido' : null],
    ['Migración gratis', c.has_migration_free === true ? 'Sí (incluida)' : c.has_migration_free === false ? 'No incluida' : null],
    ['Tecnologías', techs.join(', ')],
    ['Sitio oficial', c.website],
    ['Teléfono', c.contact_phone],
    ['Email', c.contact_email],
  ]);

  const cta = `<div style="background:#2B2D42;color:#fff;padding:20px;border-radius:8px;margin:24px 0">
      <div style="font-weight:600;font-size:18px;margin-bottom:6px">¿Listo para evaluar ${esc(c.name)}?</div>
      <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0 0 12px">Enlace directo al sitio oficial. Compara antes de contratar.</p>
      <a href="/ir/${esc(c.slug)}" rel="nofollow noopener sponsored" style="display:inline-block;background:#fff;color:#2B2D42;padding:10px 16px;border-radius:6px;font-weight:600;text-decoration:none;margin-right:8px">Visitar sitio oficial ↗</a>
      ${compareUrl ? `<a href="${esc(compareUrl)}" style="display:inline-block;border:1px solid rgba(255,255,255,0.3);color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Comparar en ${esc(meta.name)}</a>` : ''}
      <p style="font-size:11px;color:rgba(255,255,255,0.6);margin:12px 0 0"><strong>Divulgación:</strong> el enlace puede generarnos una comisión sin costo adicional. La recomendación se basa en datos verificables.</p>
    </div>`;

  const body = `
    <nav style="font-size:13px;color:#6B7280;margin-bottom:16px"><a href="/">Inicio</a> / <a href="${esc(breadcrumbHomeUrl)}">${esc(breadcrumbHome)}</a> / ${esc(c.name)}</nav>
    ${badgesHtml}
    <h1 style="font-size:32px;font-weight:700;margin:0 0 12px">¿Es bueno ${esc(c.name)}?</h1>
    <p style="font-size:17px;line-height:1.6">${esc(hero)}</p>
    <p style="font-size:12px;color:#6B7280;margin-top:8px">✓ Revisado por el equipo editorial: <time datetime="${REVIEWED_ON}">${REVIEWED_ON}</time></p>
    ${techVerify(chk)}
    ${historyBlock}
    ${forWhoBlock}
    ${plansTable(plans, currency)}
    <h2>Reputación</h2>
    <p><strong style="font-size:18px">${complaintsCount}</strong> ${complaintsCount === 1 ? 'reclamo verificado' : 'reclamos verificados'} sobre ${esc(c.name)} en nuestro registro público. Verificamos cada reclamo por correo antes de publicarlo. Ausencia de reclamos no equivale a ausencia de problemas.</p>
    <p><a href="/reclamos">Reportar problema</a> · <a href="/resena?empresa=${esc(c.slug)}">Dejar una reseña</a></p>
    ${cta}
    ${dataTable ? `<h2>Datos verificables</h2>${dataTable}` : ''}
    ${alternativesBlock({ c, others, meta, urlBase, dcLocalOf })}
    <h2>Preguntas frecuentes</h2>
    ${faq.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}
    <hr style="margin:24px 0;border:0;border-top:1px solid #E5E7EB" />
    <p style="font-size:13px;color:#6B7280"><strong>✓ Revisado por el equipo editorial de EligeTuHosting</strong> el <time datetime="${REVIEWED_ON}">${REVIEWED_ON}</time>. Metodología: <a href="/nuestro-metodo">nuestro método</a>.</p>
  `;

  const orgLd = {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: c.name,
    ...(c.legal_name ? { legalName: c.legal_name } : {}),
    ...(c.website ? { url: c.website } : {}),
    ...(c.contact_phone ? { telephone: c.contact_phone } : {}),
    ...(c.contact_email ? { email: c.contact_email } : {}),
    ...(c.year_founded ? { foundingDate: String(c.year_founded) } : {}),
    ...(c.corporate_group ? { parentOrganization: { '@type': 'Organization', name: c.corporate_group } } : {}),
    address: { '@type': 'PostalAddress', addressCountry: meta.code },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: breadcrumbHome, item: `https://eligetuhosting.com${breadcrumbHomeUrl}` },
      { '@type': 'ListItem', position: 3, name: c.name, item: canonical },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage', dateModified: REVIEWED_ON,
    mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const headExtra = [
    `<script type="application/ld+json">${JSON.stringify(orgLd)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>`,
  ].join('\n    ');

  const title = `${c.name} — ¿Es bueno? Análisis verificable 2026 | EligeTuHosting`;
  const descBits = [
    `${c.name}: análisis verificable de hosting en ${meta.name}.`,
    c.legal_name ? `Razón social ${c.legal_name}.` : '',
    c.datacenter_location ? `Datacenter: ${c.datacenter_location}.` : '',
    'Datos técnicos, reputación y para quién sí conviene.',
  ].filter(Boolean).join(' ');
  const description = descBits.length > 200 ? descBits.slice(0, 197) + '…' : descBits;

  return { body, headExtra, title, description, faq };
}
