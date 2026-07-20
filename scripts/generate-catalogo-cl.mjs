// Generador estático de fichas de catálogo Chile en formato P1 nivel-venta.
// Produce public/catalogo/{slug}/index.html con BODY crawleable propio.
// La SPA (CatalogoDetalle.tsx) hidrata encima manteniendo el diseño Chile visible.
import fs from 'node:fs/promises';
import { buildHtml } from './lib/shell.mjs';
import { buildSalesBody } from './lib/sales-body.mjs';

const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://oegvwjxrlmtwortyhsrv.supabase.co';
const SB_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA4NzEsImV4cCI6MjA2MjAzNjg3MX0.ruA3v0xiTGgH2vubqAnWPgbvwSOlaVp7Oc0e2YeZq4M';

const META = { code: 'CL', slug: 'cl', name: 'Chile', long: 'chile', flag: '🇨🇱', locale: 'es-CL', currency: 'CLP' };
const ROOT = 'https://eligetuhosting.cl';

async function sb(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } });
  if (!r.ok) { console.warn(`  sb ${path} → ${r.status}`); return []; }
  return r.json();
}

async function run() {
  const companies = await sb(`hosting_companies?select=id,slug,name,country,website,legal_name,corporate_group,datacenter_location,year_founded,technologies,contact_phone,contact_email,editorial_summary,updated_at,uptime_guarantee,has_ssl_free,has_migration_free&country=eq.CL&is_verified=eq.true&limit=999`);
  if (!companies.length) { console.log('⚠️  CL: 0 proveedores'); return; }
  const ids = companies.map(c => `"${c.id}"`).join(',');
  const [complaints, plans] = await Promise.all([
    sb(`public_complaints?select=company_id,status&company_id=in.(${ids})&status=in.(verified,resolved)&limit=5000`),
    sb(`hosting_plans?select=company_id,name,price,updated_at&company_id=in.(${ids})&limit=5000`),
  ]);
  const complaintMap = {};
  for (const r of complaints) complaintMap[r.company_id] = (complaintMap[r.company_id] || 0) + 1;
  const plansMap = {};
  for (const p of plans) (plansMap[p.company_id] ||= []).push(p);

  const dcLocalOf = (o) => o.datacenter_location && /chile/i.test(String(o.datacenter_location).replace(/sin\s+datacenter[^,.;]*/gi, ' '));

  let total = 0;
  for (const c of companies) {
    const complaintsCount = complaintMap[c.id] || 0;
    const providerPlans = plansMap[c.id] || [];
    const canonical = `${ROOT}/catalogo/${c.slug}`;
    const { body, headExtra, title, description } = buildSalesBody({
      c, meta: META, chk: null, complaintsCount, plans: providerPlans, others: companies,
      urlBase: '/catalogo', canonical, currency: META.currency,
      breadcrumbHome: 'Catálogo', breadcrumbHomeUrl: '/catalogo',
      compareUrl: '/mejor-hosting-chile-2026',
      dcLocalOf,
    });
    const html = buildHtml({
      title, description, canonical, locale: META.locale, headExtra, bodyContent: body,
      keywords: `${c.name.toLowerCase()}, hosting chile, ${c.name.toLowerCase()} opiniones, hosting chileno`,
      ogImage: `${ROOT}/og/cl.png`,
    });
    await fs.mkdir(`public/catalogo/${c.slug}`, { recursive: true });
    await fs.writeFile(`public/catalogo/${c.slug}/index.html`, html, 'utf8');
    total++;
  }
  console.log(`✨ Catálogo CL regenerado (P1 nivel-venta): ${total} fichas`);
}

await run();
