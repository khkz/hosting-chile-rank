// Generador estático de las 55 fichas LATAM en formato P1 nivel-venta.
// Basado en el piloto /pe/hostdime-pe y extendido a todos los proveedores.
// - Respuesta directa AEO (40-60 palabras)
// - Historia real del proveedor desde datos de la DB
// - Bloque "para quién sí / para quién no"
// - Verificación técnica como badges (si hay datos en latam_site_checks)
// - FAQ + FAQPage JSON-LD
// - CTA jerarquizado con divulgación
// - Interlinking a alternativas del mismo país (priorizando DC local)
// Cualquier campo faltante en la DB omite su bloque; no se inventa nada.
import fs from 'node:fs/promises';
import { buildHtml } from './lib/shell.mjs';
import { hasLocalDatacenter } from './lib/dc-local.mjs';
import { buildSalesBody } from './lib/sales-body.mjs';

const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://oegvwjxrlmtwortyhsrv.supabase.co';
const SB_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA4NzEsImV4cCI6MjA2MjAzNjg3MX0.ruA3v0xiTGgH2vubqAnWPgbvwSOlaVp7Oc0e2YeZq4M';

const COUNTRIES = {
  pe: { code: 'PE', slug: 'pe', name: 'Perú', long: 'peru', flag: '🇵🇪', locale: 'es-PE', currency: 'PEN' },
  mx: { code: 'MX', slug: 'mx', name: 'México', long: 'mexico', flag: '🇲🇽', locale: 'es-MX', currency: 'MXN' },
  co: { code: 'CO', slug: 'co', name: 'Colombia', long: 'colombia', flag: '🇨🇴', locale: 'es-CO', currency: 'COP' },
  ar: { code: 'AR', slug: 'ar', name: 'Argentina', long: 'argentina', flag: '🇦🇷', locale: 'es-AR', currency: 'ARS' },
};
const ROOT = 'https://eligetuhosting.com';

async function sb(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } });
  if (!r.ok) { console.warn(`  sb ${path} → ${r.status}`); return []; }
  return r.json();
}

async function run() {
  let total = 0;
  for (const [cslug, meta] of Object.entries(COUNTRIES)) {
    const companies = await sb(`hosting_companies?select=id,slug,name,country,website,legal_name,corporate_group,datacenter_location,year_founded,technologies,contact_phone,contact_email,editorial_summary,updated_at&country=eq.${meta.code}&is_verified=eq.true&limit=999`);
    if (!companies.length) { console.log(`⚠️  ${meta.code}: 0 proveedores`); continue; }
    const ids = companies.map(c => `"${c.id}"`).join(',');
    const [checks, complaints, plans] = await Promise.all([
      sb(`latam_site_checks?select=company_id,resolved_ip,asn,asn_org,ssl_issuer,ssl_valid_to,ttfb_ms,http_status,checked_at&company_id=in.(${ids})&order=checked_at.desc&limit=1000`),
      sb(`public_complaints?select=company_id,status&company_id=in.(${ids})&status=in.(verified,resolved)&limit=5000`),
      sb(`hosting_plans?select=company_id,name,price,updated_at&company_id=in.(${ids})&limit=5000`),
    ]);
    const checkMap = {};
    for (const r of checks) if (!checkMap[r.company_id]) checkMap[r.company_id] = r;
    const complaintMap = {};
    for (const r of complaints) complaintMap[r.company_id] = (complaintMap[r.company_id] || 0) + 1;
    const plansMap = {};
    for (const p of plans) (plansMap[p.company_id] ||= []).push(p);

    const dcLocalOf = (o) => hasLocalDatacenter(cslug, o.datacenter_location);

    for (const c of companies) {
      const chk = checkMap[c.id];
      const complaintsCount = complaintMap[c.id] || 0;
      const providerPlans = plansMap[c.id] || [];
      const canonical = `${ROOT}/${cslug}/${c.slug}`;
      const { body, headExtra, title, description } = buildSalesBody({
        c, meta, chk, complaintsCount, plans: providerPlans, others: companies,
        urlBase: `/${cslug}`, canonical, currency: meta.currency,
        breadcrumbHome: `Hosting en ${meta.name}`, breadcrumbHomeUrl: `/${cslug}`,
        compareUrl: `/${cslug}/mejor-hosting-${meta.long}-2026`,
        dcLocalOf,
      });
      const extraHead = `<link rel="alternate" type="text/markdown" href="/${cslug}/${c.slug}.md" />\n    ${headExtra}`;
      const html = buildHtml({
        title, description, canonical, locale: meta.locale, headExtra: extraHead, bodyContent: body,
        keywords: `${c.name.toLowerCase()}, hosting ${meta.long}, ${c.name.toLowerCase()} opiniones, hosting ${meta.name.toLowerCase()}`,
        ogImage: `${ROOT}/og/${cslug}.png`,
      });
      await fs.mkdir(`public/${cslug}/${c.slug}`, { recursive: true });
      await fs.writeFile(`public/${cslug}/${c.slug}/index.html`, html, 'utf8');
      total++;
    }
    console.log(`✅ ${meta.code}: ${companies.length} fichas nivel-venta`);
  }
  console.log(`✨ Total fichas LATAM regeneradas (P1): ${total}`);
}

await run();
