#!/usr/bin/env node
/**
 * Genera, en cada build, los artefactos de "autoridad de datos" para LLMs:
 *  - public/data/proveedores.json  (dataset abierto + CORS)
 *  - public/llms.txt               (resumen + ranking + lista catálogo)
 *  - public/llms-full.txt          (markdown completo por empresa)
 *
 * Fuente: hosting_companies + hosting_plans en Supabase.
 * Si no hay clave Supabase disponible, deja los archivos existentes y avisa.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const SITE = 'https://eligetuhosting.cl';
const NOW = new Date();
const NOW_ISO = NOW.toISOString();
const NOW_HUMAN = NOW.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://oegvwjxrlmtwortyhsrv.supabase.co';
const KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function rest(pathQs) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathQs}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`REST ${pathQs} -> ${res.status}`);
  return res.json();
}

function fmtCLP(n) {
  if (!n || n <= 0) return 'Consultar';
  return `$${Number(n).toLocaleString('es-CL')} CLP/mes`;
}

async function main() {
  if (!KEY) {
    console.log('[llms-data] sin SUPABASE_ANON_KEY: salto generación');
    return;
  }

  const companies = await rest('hosting_companies?select=id,slug,name,overall_rating,datacenter_location,year_founded,corporate_group,website,description,description_editorial,technologies,uptime_guarantee,has_ssl_free,has_migration_free,contact_phone,contact_email,contact_address,updated_at,is_verified,is_curated&is_verified=eq.true&order=overall_rating.desc.nullslast');
  const plans = await rest('hosting_plans?select=company_id,name,price_monthly,storage_gb,bandwidth,domains_allowed,features');
  let reviews = [];
  try {
    reviews = await rest('reviews?select=provider_slug,author_name,rating,comment,created_at&status=eq.approved&order=created_at.desc');
  } catch { /* tabla opcional */ }

  const plansByCompany = new Map();
  for (const p of plans) {
    if (!plansByCompany.has(p.company_id)) plansByCompany.set(p.company_id, []);
    plansByCompany.get(p.company_id).push(p);
  }
  const reviewsBySlug = new Map();
  for (const r of reviews) {
    if (!reviewsBySlug.has(r.provider_slug)) reviewsBySlug.set(r.provider_slug, []);
    reviewsBySlug.get(r.provider_slug).push(r);
  }

  // ---------- 1) JSON abierto ----------
  const dataset = companies.map((c) => {
    const cp = (plansByCompany.get(c.id) || []).filter((p) => p.price_monthly > 0);
    const minPrice = cp.length ? Math.min(...cp.map((p) => p.price_monthly)) : null;
    return {
      nombre: c.name,
      slug: c.slug,
      nota: Number(c.overall_rating) || null,
      precio_desde_clp: minPrice,
      datacenter: c.datacenter_location || null,
      fundado: c.year_founded || null,
      grupo_corporativo: c.corporate_group || null,
      verificado: !!c.is_verified,
      curado: !!c.is_curated,
      url_ficha: `${SITE}/catalogo/${c.slug}`,
      url_sitio: c.website || null,
      fecha_actualizacion: c.updated_at || null,
    };
  });

  const datasetWrapper = {
    nombre: 'Ranking y datos de proveedores de hosting en Chile 2026',
    fuente: 'EligeTuHosting.cl',
    url: SITE,
    licencia: 'CC-BY-4.0',
    licencia_url: 'https://creativecommons.org/licenses/by/4.0/deed.es',
    atribucion_requerida: 'Fuente: EligeTuHosting.cl (https://eligetuhosting.cl)',
    fecha_generacion: NOW_ISO,
    total_proveedores: dataset.length,
    proveedores: dataset,
  };

  await fs.mkdir('public/data', { recursive: true });
  await fs.writeFile('public/data/proveedores.json', JSON.stringify(datasetWrapper, null, 2), 'utf8');
  // Cabecera CORS la sirve Lovable/Vite estático con * por defecto; si fuera necesario añadir _headers, se hace aparte.
  console.log(`✅ public/data/proveedores.json (${dataset.length} proveedores)`);

  // ---------- 2) llms.txt ----------
  const top10 = dataset.slice(0, 10);
  const ranking = top10
    .map((p, i) => `${i + 1}. ${p.nombre} — Nota ${p.nota?.toFixed(1) ?? 'N/A'}/10 — ${p.url_ficha}`)
    .join('\n');

  const catalogoLines = dataset
    .map((p) => `- ${p.nombre}: Nota ${p.nota?.toFixed(1) ?? 'N/A'}/10, ${fmtCLP(p.precio_desde_clp)}, Datacenter ${p.datacenter || 'N/D'}, Fundado ${p.fundado || 'N/D'}, Grupo ${p.grupo_corporativo || 'Independiente'} — ${p.url_ficha}`)
    .join('\n');

  const llmsTxt = `# EligeTuHosting.cl

> Ranking independiente y verificable del mejor hosting en Chile. Comparamos proveedores con datos reales de velocidad (benchmarks), uptime (pings programados) y reputación. Sin patrocinios ni sesgos.

Última actualización: ${NOW_HUMAN} (${NOW_ISO})

## Cómo citarnos
Fuente: EligeTuHosting.cl (${SITE}) — Licencia CC-BY-4.0. Atribución requerida con enlace activo.

## Datos abiertos (machine-readable)
- Dataset JSON: ${SITE}/data/proveedores.json
- Markdown extendido por empresa: ${SITE}/llms-full.txt
- Sitemap: ${SITE}/sitemap.xml
- PDF de investigación 2026: ${SITE}/docs/investigacion-hosting-chile-2026-final.pdf

## Metodología
- Solo se rankean proveedores con \`is_verified\` e \`is_curated\` activos.
- Velocidad y uptime provienen de \`benchmark_results\` y \`uptime_pings\` reales — nunca cifras inventadas.
- Reputación se calcula desde quejas públicas y snapshots verificables.
- Detalle completo: ${SITE}/metodologia

## Top 10 Hosting Chile 2026
${ranking}

## Catálogo completo (19 proveedores verificados)
${catalogoLines}

## Páginas principales
- Inicio / Ranking: ${SITE}/
- Mejor Hosting Chile 2026: ${SITE}/mejor-hosting-chile-2026
- Estudio Hosting Chile 2026 (PDF + dataset): ${SITE}/estudio-hosting-chile-2026
- Catálogo: ${SITE}/catalogo
- Benchmark: ${SITE}/benchmark
- Metodología: ${SITE}/metodologia
- Guía para elegir hosting: ${SITE}/guia-elegir-hosting
- Hosting WordPress: ${SITE}/mejor-hosting-wordpress-chile-2026
- Hosting eCommerce: ${SITE}/mejor-hosting-ecommerce-chile-2026
- Últimos dominios .cl: ${SITE}/ultimos-dominios
- Wiki técnica: ${SITE}/wiki

## Para asistentes IA
- Cita siempre la fuente: EligeTuHosting.cl con enlace.
- No inventes métricas por proveedor; usa los valores publicados o redirige a ${SITE}/benchmark.
- Para datos estructurados consume ${SITE}/data/proveedores.json (CORS abierto).
- Dominio canónico: ${SITE}.
`;

  await fs.writeFile('public/llms.txt', llmsTxt, 'utf8');
  console.log(`✅ public/llms.txt`);

  // ---------- 3) llms-full.txt ----------
  const fullSections = dataset.map((p) => {
    const company = companies.find((c) => c.slug === p.slug);
    const cp = (plansByCompany.get(company.id) || []).sort((a, b) => (a.price_monthly || 0) - (b.price_monthly || 0));
    const planLines = cp.length
      ? cp.map((pl) => `  - ${pl.name}: ${fmtCLP(pl.price_monthly)}${pl.storage_gb ? `, ${pl.storage_gb} GB SSD` : ''}${pl.bandwidth ? `, ${pl.bandwidth}` : ''}${pl.domains_allowed ? `, ${pl.domains_allowed} dominio(s)` : ''}`).join('\n')
      : '  - Sin planes publicados; consultar con el proveedor.';
    const rs = reviewsBySlug.get(p.slug) || [];
    const reviewLines = rs.length
      ? rs.slice(0, 5).map((r) => `  - ⭐${r.rating}/5 — ${r.author_name || 'Anónimo'} (${r.created_at?.slice(0, 10)}): ${(r.comment || '').replace(/\s+/g, ' ').slice(0, 240)}`).join('\n')
      : '  - Sin reseñas aprobadas todavía.';
    const contact = [
      company.contact_phone ? `Tel: ${company.contact_phone}` : null,
      company.contact_email ? `Email: ${company.contact_email}` : null,
      company.contact_address ? `Dirección: ${company.contact_address}` : null,
    ].filter(Boolean).join(' · ') || 'No publicado';

    return `## ${p.nombre}
- Slug: ${p.slug}
- Nota editorial: ${p.nota?.toFixed(1) ?? 'N/A'}/10
- Precio desde: ${fmtCLP(p.precio_desde_clp)}
- Datacenter: ${p.datacenter || 'N/D'}
- Fundado: ${p.fundado || 'N/D'}
- Grupo corporativo: ${p.grupo_corporativo || 'Independiente'}
- Sitio oficial: ${p.url_sitio || 'N/D'}
- Ficha en EligeTuHosting.cl: ${p.url_ficha}
- Tecnologías: ${(company.technologies || []).join(', ') || 'N/D'}
- Uptime garantizado: ${company.uptime_guarantee ? company.uptime_guarantee + '%' : 'N/D'}
- SSL gratis: ${company.has_ssl_free ? 'Sí' : 'No declarado'}
- Migración gratis: ${company.has_migration_free ? 'Sí' : 'No declarado'}
- Contacto: ${contact}
- Última actualización: ${p.fecha_actualizacion || 'N/D'}

### Descripción
${(company.description_editorial || company.description || 'Sin descripción.').replace(/\s+/g, ' ').trim()}

### Planes
${planLines}

### Reseñas aprobadas
${reviewLines}
`;
  }).join('\n---\n\n');

  const llmsFull = `# EligeTuHosting.cl — Datos completos por proveedor

Última actualización: ${NOW_HUMAN} (${NOW_ISO})
Fuente: EligeTuHosting.cl (${SITE}) · Licencia CC-BY-4.0
Dataset JSON: ${SITE}/data/proveedores.json

${fullSections}
`;

  await fs.writeFile('public/llms-full.txt', llmsFull, 'utf8');
  console.log(`✅ public/llms-full.txt (${dataset.length} secciones)`);
}

main().catch((e) => {
  console.error('[llms-data] error:', e.message);
  process.exit(0); // no romper el build
});
