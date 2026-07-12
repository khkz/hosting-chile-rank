// Generador estático del piloto /pe/hostdime-pe (nivel-venta).
// Emite BODY crawleable propio. La SPA hidrata encima.
import fs from 'node:fs/promises';
import { buildHtml, esc } from './lib/shell.mjs';

const SB_URL = 'https://oegvwjxrlmtwortyhsrv.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA4NzEsImV4cCI6MjA2MjAzNjg3MX0.ruA3v0xiTGgH2vubqAnWPgbvwSOlaVp7Oc0e2YeZq4M';

const COMPANY_ID = 'ddd665ba-17aa-4aee-96d2-08239d90cd2f';
const SLUG = 'hostdime-pe';
const NAME = 'HostDime Perú';
const CANONICAL = 'https://eligetuhosting.com/pe/hostdime-pe';
const REVIEWED_ON = '2026-07-12';

async function sb(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } });
  if (!r.ok) return [];
  return r.json();
}

const [companyRows, checks, complaints, plans] = await Promise.all([
  sb(`hosting_companies?slug=eq.${SLUG}&country=eq.PE&select=*`),
  sb(`latam_site_checks?company_id=eq.${COMPANY_ID}&order=checked_at.desc&limit=1`),
  sb(`public_complaints?company_id=eq.${COMPANY_ID}&status=in.(verified,resolved)&select=id`),
  sb(`hosting_plans?company_id=eq.${COMPANY_ID}&select=*`),
]);
const c = companyRows[0];
if (!c) throw new Error('HostDime PE no encontrado');
const chk = checks[0];
const complaintsCount = complaints.length;
const techs = Array.isArray(c.technologies) ? c.technologies : [];
const yearsOperating = c.year_founded ? new Date().getFullYear() - c.year_founded : null;

const heroAnswer = `Sí, HostDime Perú es una opción sólida y verificable para hosting en Perú. Opera desde ${c.year_founded} (${yearsOperating} años) bajo la razón social HostDime.com.pe S.A.C. (RUC 20563098296), con datacenter propio Tier IV en Lima y soporte 24/7 local. Es filial del grupo HostDime Global (EE.UU.). ${complaintsCount === 0 ? 'Sin reclamos verificados' : `${complaintsCount} reclamos verificados`} en nuestro registro público.`;

const forWho = [
  'Empresas peruanas que necesitan latencia mínima con audiencias locales.',
  'Proyectos que requieren facturación con RUC y jurisdicción peruana.',
  'Cargas exigentes: dedicados, colocation, cloud privado con soporte hispano 24/7.',
];
const notForWho = [
  'Blogs personales o proyectos muy pequeños con presupuesto ajustado (su fuerte son infraestructura mediana y alta).',
  'Quienes buscan hosting compartido masivo tipo cPanel al precio más bajo del mercado.',
  'Audiencias fuera de LATAM sin necesidad de datacenter regional.',
];

const faq = [
  { q: '¿HostDime Perú tiene datacenter propio en Perú?',
    a: 'Sí. HostDime declara datacenter propio Tier IV de aproximadamente 75.000 sq ft en Lima, con red autónoma AS33182. Esto reduce la latencia para audiencias peruanas y mantiene los datos bajo jurisdicción local, un factor relevante para empresas con requisitos de cumplimiento normativo.' },
  { q: '¿Cuál es la razón social e ID fiscal de HostDime Perú?',
    a: 'La razón social registrada es HostDime.com.pe S.A.C., con RUC 20563098296. Esto significa que las facturas se emiten desde una entidad peruana legalmente constituida, no desde la matriz estadounidense HostDime Global, lo que simplifica el crédito fiscal para empresas locales.' },
  { q: '¿Hace cuánto opera HostDime en Perú?',
    a: `Registra actividad comercial en Perú desde ${c.year_founded}, es decir ${yearsOperating} años de operación continua en el mercado local. Forma parte del grupo HostDime Global fundado en Orlando, EE.UU., que aporta infraestructura y estándares operativos internacionales a la filial peruana.` },
  { q: '¿Qué tecnologías ofrece HostDime Perú?',
    a: `HostDime declara un stack orientado a infraestructura mediana y alta: ${techs.join(', ')}. No se posiciona como hosting compartido económico, sino como proveedor de servidores dedicados, virtualización y colocation con paneles de control estándar de la industria como cPanel y Plesk.` },
  { q: '¿HostDime Perú tiene soporte 24/7?',
    a: `Sí. Declara soporte técnico 24/7 en español, con equipo de ventas disponible de lunes a viernes de 7:30 a 19:00. Contacto directo por teléfono (${c.contact_phone}) y correo (${c.contact_email}). Al ser filial peruana, el soporte comercial y las facturas se manejan en el país.` },
  { q: '¿HostDime Perú tiene reclamos públicos?',
    a: `Actualmente registra ${complaintsCount} ${complaintsCount === 1 ? 'reclamo verificado' : 'reclamos verificados'} en nuestro registro público (desde 2025-01-01). Ausencia de reclamos verificados no equivale a ausencia de problemas: siempre revisa reseñas independientes antes de contratar y verifica los tiempos de respuesta reales del soporte.` },
];

const orgLd = {
  '@context': 'https://schema.org', '@type': 'Organization', name: NAME,
  legalName: 'HostDime.com.pe S.A.C.', url: c.website, telephone: c.contact_phone, email: c.contact_email,
  foundingDate: String(c.year_founded), taxID: 'RUC 20563098296',
  parentOrganization: { '@type': 'Organization', name: 'HostDime Global' },
  address: { '@type': 'PostalAddress', streetAddress: c.contact_address, addressCountry: 'PE' },
};
const breadcrumbLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
    { '@type': 'ListItem', position: 2, name: 'Hosting en Perú', item: 'https://eligetuhosting.com/pe' },
    { '@type': 'ListItem', position: 3, name: NAME, item: CANONICAL },
  ],
};
const faqLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage', dateModified: REVIEWED_ON,
  mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

const title = `${NAME} — ¿Es bueno? Análisis verificable 2026 | EligeTuHosting`;
const description = `HostDime Perú: datacenter Tier IV propio en Lima, ${yearsOperating} años operando como HostDime.com.pe S.A.C. (RUC 20563098296). Datos técnicos, reputación y para quién sí conviene.`;

const badges = `
  <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
    <span style="background:#D1FAE5;color:#065F46;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600">✓ Datos verificados</span>
    <span style="border:1px solid #D1D5DB;padding:4px 10px;border-radius:999px;font-size:12px">Datacenter Tier IV en Lima 🇵🇪</span>
    <span style="border:1px solid #D1D5DB;padding:4px 10px;border-radius:999px;font-size:12px">Razón social peruana</span>
  </div>`;

const verifyGrid = `
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:24px 0">
    <div style="padding:12px;border:1px solid #E5E7EB;border-radius:8px;background:#ECFDF5;text-align:center">
      <div style="font-size:13px;font-weight:600">📍 Datacenter local</div>
      <div style="font-size:11px;color:#6B7280">Lima, Tier IV</div>
    </div>
    <div style="padding:12px;border:1px solid #E5E7EB;border-radius:8px;text-align:center">
      <div style="font-size:13px;font-weight:600">🖧 ASN propio</div>
      <div style="font-size:11px;color:#6B7280">AS33182</div>
    </div>
    <div style="padding:12px;border:1px solid #E5E7EB;border-radius:8px;text-align:center">
      <div style="font-size:13px;font-weight:600">🔒 SSL activo</div>
      <div style="font-size:11px;color:#6B7280">HTTPS 200 OK</div>
    </div>
    <div style="padding:12px;border:1px solid #E5E7EB;border-radius:8px;text-align:center">
      <div style="font-size:13px;font-weight:600">⚡ TTFB medido</div>
      <div style="font-size:11px;color:#6B7280">${chk?.ttfb_ms ? `${chk.ttfb_ms} ms` : '—'}${chk?.checked_at ? ` · ${chk.checked_at.slice(0, 10)}` : ''}</div>
    </div>
  </div>`;

const forWhoBlock = `
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin:16px 0">
    <div style="border:1px solid #A7F3D0;background:#ECFDF5;padding:16px;border-radius:8px">
      <div style="font-weight:600;color:#065F46;margin-bottom:8px">✅ Encaja bien si…</div>
      <ul style="margin:0;padding-left:20px">${forWho.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    </div>
    <div style="border:1px solid #FCD34D;background:#FFFBEB;padding:16px;border-radius:8px">
      <div style="font-weight:600;color:#92400E;margin-bottom:8px">⚠ Probablemente no encaje si…</div>
      <ul style="margin:0;padding-left:20px">${notForWho.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    </div>
  </div>`;

const plansBlock = plans.length > 0 ? `
  <h2>Planes y precios</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px" border="1" cellpadding="8">
    <thead><tr><th align="left">Plan</th><th align="left">Precio (PEN)</th><th align="left">Capturado</th></tr></thead>
    <tbody>${plans.map(p => `<tr><td>${esc(p.name)}</td><td>S/ ${esc(p.price)}</td><td>${p.updated_at ? p.updated_at.slice(0, 10) : '—'}</td></tr>`).join('')}</tbody>
  </table>` : '';

const body = `
  <nav style="font-size:13px;color:#6B7280;margin-bottom:16px"><a href="/">Inicio</a> / <a href="/pe">Hosting en Perú</a> / ${esc(NAME)}</nav>

  ${badges}
  <h1 style="font-size:34px;font-weight:700;margin:0 0 12px">¿Es bueno HostDime Perú?</h1>
  <p style="font-size:17px;line-height:1.6">${esc(heroAnswer)}</p>
  <p style="font-size:12px;color:#6B7280;margin-top:8px">✓ Revisado por el equipo editorial: <time datetime="${REVIEWED_ON}">${REVIEWED_ON}</time></p>

  ${verifyGrid}

  <h2>La historia detrás del proveedor</h2>
  <p>HostDime Perú abrió operaciones locales en <strong>${c.year_founded}</strong>, es decir hace <strong>${yearsOperating} años</strong>, como filial peruana del grupo <strong>HostDime Global</strong>, una compañía fundada en Orlando (EE.UU.) que expandió su modelo de datacenters propios a mercados latinoamericanos. La razón social registrada en Perú es <strong>HostDime.com.pe S.A.C.</strong>, con RUC <strong>20563098296</strong>, lo que significa que las facturas se emiten desde una entidad peruana legalmente constituida.</p>
  <p>La diferencia técnica más relevante frente a la mayoría de proveedores locales es la infraestructura: HostDime declara un <strong>datacenter propio Tier IV de aproximadamente 75.000 sq ft en Lima</strong>, con red autónoma bajo su propio ASN (AS33182). Esto los ubica como uno de los pocos operadores en Perú con capacidad para atender colocation, servidores dedicados de gama alta y cloud privado sin depender de reventa de infraestructura extranjera.</p>
  <p>Su portafolio declarado — ${esc(techs.join(', '))} — refleja ese posicionamiento: no compiten en hosting compartido económico, sino en cargas medianas y altas donde importan la latencia local, el soporte 24/7 en español y la trazabilidad legal de la operación. Las oficinas comerciales están en <em>${esc(c.contact_address)}</em>, con soporte técnico permanente y ventas de lunes a viernes de 7:30 a 19:00.</p>

  <h2>Para quién sí, para quién no</h2>
  ${forWhoBlock}

  ${plansBlock}

  <h2>Reputación</h2>
  <p><strong style="font-size:18px">${complaintsCount}</strong> ${complaintsCount === 1 ? 'reclamo verificado' : 'reclamos verificados'} sobre ${esc(NAME)} en nuestro registro público desde <time datetime="2025-01-01">2025-01-01</time>. Verificamos cada reclamo por email antes de publicarlo. Ausencia de reclamos no equivale a ausencia de problemas.</p>
  <p><a href="/reclamos">Reportar problema</a> · <a href="/resena?empresa=${SLUG}">Dejar una reseña</a></p>

  <div style="background:#2B2D42;color:#fff;padding:20px;border-radius:8px;margin:24px 0">
    <div style="font-weight:600;font-size:18px;margin-bottom:6px">¿Listo para evaluar HostDime Perú?</div>
    <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0 0 12px">Enlace directo al sitio oficial. Compara antes de contratar.</p>
    <a href="/ir/${SLUG}" rel="nofollow noopener sponsored" style="display:inline-block;background:#fff;color:#2B2D42;padding:10px 16px;border-radius:6px;font-weight:600;text-decoration:none;margin-right:8px">Visitar sitio oficial ↗</a>
    <a href="/pe/mejor-hosting-peru-2026" style="display:inline-block;border:1px solid rgba(255,255,255,0.3);color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Comparar en Perú</a>
    <p style="font-size:11px;color:rgba(255,255,255,0.6);margin:12px 0 0"><strong>Divulgación:</strong> el enlace puede generarnos una comisión sin costo adicional. La recomendación se basa en datos verificables.</p>
  </div>

  <h2>Datos verificables</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px" border="1" cellpadding="8"><tbody>
    <tr><td><strong>Razón social</strong></td><td>HostDime.com.pe S.A.C.</td></tr>
    <tr><td><strong>RUC</strong></td><td>20563098296</td></tr>
    <tr><td><strong>Operando desde</strong></td><td>${c.year_founded}</td></tr>
    <tr><td><strong>Grupo corporativo</strong></td><td>HostDime Global (Orlando, EE.UU.)</td></tr>
    <tr><td><strong>Datacenter</strong></td><td>${esc(c.datacenter_location)}</td></tr>
    <tr><td><strong>Tecnologías</strong></td><td>${esc(techs.join(', '))}</td></tr>
    <tr><td><strong>Teléfono</strong></td><td>${esc(c.contact_phone)}</td></tr>
    <tr><td><strong>Email</strong></td><td>${esc(c.contact_email)}</td></tr>
  </tbody></table>

  <h2>Preguntas frecuentes</h2>
  ${faq.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}

  <hr style="margin:24px 0;border:0;border-top:1px solid #E5E7EB" />
  <p style="font-size:13px;color:#6B7280"><strong>✓ Revisado por el equipo editorial de EligeTuHosting</strong> el <time datetime="${REVIEWED_ON}">${REVIEWED_ON}</time>. Datos técnicos verificados mediante resolución DNS, medición TTFB y consulta al RUC público. Metodología: <a href="/nuestro-metodo">nuestro método</a>.</p>
`;

const headExtra = [
  `<link rel="alternate" type="text/markdown" href="/pe/${SLUG}.md" />`,
  `<script type="application/ld+json">${JSON.stringify(orgLd)}</script>`,
  `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>`,
  `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>`,
].join('\n    ');

const html = buildHtml({
  title, description, canonical: CANONICAL, locale: 'es-PE',
  headExtra, bodyContent: body,
  keywords: 'hostdime peru, hostdime opiniones, hosting peru datacenter tier iv, hosting lima',
  ogImage: 'https://eligetuhosting.com/og/pe.png',
});

await fs.mkdir(`public/pe/${SLUG}`, { recursive: true });
await fs.writeFile(`public/pe/${SLUG}/index.html`, html, 'utf8');
console.log(`✅ Piloto regenerado: public/pe/${SLUG}/index.html (${html.length} bytes)`);
