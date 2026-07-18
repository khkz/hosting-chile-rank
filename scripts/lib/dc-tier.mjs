// Clasificador de datacenter para tablas por país (LATAM).
// Reemplaza el criterio binario "local Sí/No" por:
//   - location: ubicación real verificada por ASN/IP + declaración
//   - quality:  tier certificado > colocation certificado > autodeclarado > desconocido
//
// Reglas conservadoras: nunca inventar Tier. "Uptime Institute" / "ICREA" /
// fuentes públicas concretas => tier_certified. "Tier", "propio", "homologable"
// sin fuente externa => self_declared. Vacío => unknown.
//
// Fuente ASN: scripts/lib/asn-map.json (verificado 2026-07 vía ip-api.com).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const asnMapRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'data', 'asnMap.json'), 'utf8'));
export const ASN_MAP = asnMapRaw.providers;

// Slugs cuya certificación Tier está documentada públicamente por Uptime Institute / ICREA.
// Mantener EXTRA-conservador. HostDime Colombia (Tocancipá Tier IV Uptime Institute)
// está listado en el sitio de Uptime Institute; HostDime Perú anunció Tier IV en Lima
// pero sin certificación pública verificable → queda self_declared.
const TIER_CERTIFIED_SLUGS = new Set([
  'hostdime-co', // Tocancipá, Tier IV Uptime Institute (verificable)
]);

// Palabras que indican operación foránea sin datacenter local.
const FOREIGN_MARKERS = /sin\s+datacenter|revende|opera\s+de\s+forma\s+remota|fuera\s+de/i;

// Palabras que indican autodeclaración de calidad sin fuente externa.
const SELF_DECLARED_MARKERS = /tier\s*(i{1,3}v?|iv|3|4|iii|ii)|homologable|clase\s+mundial|nivel\s+mundial|de\s+alto\s+nivel|propio/i;

const COUNTRY_RE = {
  pe: /per[uú]/i,
  mx: /m[eé]xico/i,
  co: /colombia/i,
  ar: /argentina/i,
  cl: /chile/i,
};

/**
 * @typedef {Object} DcClass
 * @property {'local_verified'|'local_declared'|'foreign_verified'|'foreign_declared'|'mismatch'|'unknown'} location
 * @property {'tier_certified'|'self_declared'|'foreign_infra'|'unknown'} quality
 * @property {string} label       Etiqueta corta para columna ("Lima, PE · Tier IV*", "EE.UU. (AWS)", "Cloudflare (origen sin verificar)")
 * @property {string} evidence    Fuente resumida (ASN + declaración)
 * @property {number} rankQuality  0 mejor, 3 peor (para ordenar)
 * @property {number} rankLatency  0 (local) → 3 (foreign)
 */

/**
 * @param {{slug: string, datacenter_location?: string|null, legal_name?: string|null, name?: string}} p
 * @param {'pe'|'mx'|'co'|'ar'} cslug
 * @returns {DcClass}
 */
export function classifyDc(p, cslug) {
  const dcl = (p.datacenter_location || '').trim();
  const asn = ASN_MAP[p.slug] || null;
  const countryRe = COUNTRY_RE[cslug];
  const asnCC = asn?.cc || null;

  // ---- Location ---------------------------------------------------------
  // asn_cc "CDN" = origen enmascarado por Cloudflare/Akamai → no verificable.
  const declaresLocal = dcl && countryRe.test(dcl.replace(/sin\s+datacenter[^,.;]*|sin\s+dc[^,.;]*|fuera\s+de[^,.;]*|revende[^,.;]*|opera\s+de\s+forma\s+remota[^,.;]*/gi, ' '));
  const declaresForeign = dcl && FOREIGN_MARKERS.test(dcl);

  let location = 'unknown';
  if (asnCC === cslug.toUpperCase()) {
    location = declaresLocal ? 'local_verified' : 'local_verified';
  } else if (asnCC && asnCC !== 'CDN' && asnCC !== cslug.toUpperCase()) {
    if (declaresLocal) location = 'mismatch';
    else location = 'foreign_verified';
  } else if (asnCC === 'CDN' || !asnCC) {
    if (declaresLocal) location = 'local_declared';
    else if (declaresForeign || (dcl && !declaresLocal)) location = 'foreign_declared';
    else location = 'unknown';
  }

  // ---- Quality ----------------------------------------------------------
  let quality = 'unknown';
  if (TIER_CERTIFIED_SLUGS.has(p.slug)) {
    quality = 'tier_certified';
  } else if (dcl && /uptime\s+institute|icrea/i.test(dcl)) {
    quality = 'tier_certified';
  } else if (declaresForeign && !declaresLocal) {
    quality = 'foreign_infra';
  } else if (dcl && SELF_DECLARED_MARKERS.test(dcl)) {
    quality = 'self_declared';
  }

  // ---- Label ------------------------------------------------------------
  const asnLabel = asn ? `${asn.org} (${asn.asn})` : null;
  const parts = [];
  if (location === 'local_verified') parts.push(`${cslug.toUpperCase()} · ASN local`);
  else if (location === 'local_declared') parts.push(`${cslug.toUpperCase()} · declarado (origen CDN)`);
  else if (location === 'foreign_verified') parts.push(`${asnCC} · ${asn?.org || 'ASN foráneo'}`);
  else if (location === 'foreign_declared') parts.push(`fuera de ${cslug.toUpperCase()} · declarado`);
  else if (location === 'mismatch') parts.push(`declara ${cslug.toUpperCase()} · ASN en ${asnCC}`);
  else parts.push('sin verificación');

  const qLabel = {
    tier_certified: 'Tier certificado',
    self_declared:  'autodeclarado',
    foreign_infra:  'infra externa',
    unknown:        'sin certificación conocida',
  }[quality];

  const label = `${parts[0]} · ${qLabel}`;
  const evidence = [
    dcl ? `Declaración: "${dcl}"` : 'Sin declaración pública',
    asnLabel ? `ASN de la IP: ${asnLabel}${asnCC && asnCC !== 'CDN' ? ` (${asnCC})` : ' (CDN)'}` : 'IP no resuelta',
  ].join(' · ');

  // ---- Rank scores ------------------------------------------------------
  const rankQuality = { tier_certified: 0, self_declared: 1, unknown: 2, foreign_infra: 3 }[quality];
  const rankLatency = {
    local_verified: 0,
    local_declared: 1,
    mismatch:       2,
    unknown:        2,
    foreign_declared: 3,
    foreign_verified: 3,
  }[location];

  return { location, quality, label, evidence, rankQuality, rankLatency };
}

/**
 * Nuevo orden pedido:
 *   1) calidad certificada  2) latencia/red al país
 *   3) razón social local   4) antigüedad
 */
export function rankProvidersByDcTier(providers, cslug) {
  return providers.slice().sort((a, b) => {
    const ca = classifyDc(a, cslug);
    const cb = classifyDc(b, cslug);
    if (ca.rankQuality !== cb.rankQuality) return ca.rankQuality - cb.rankQuality;
    if (ca.rankLatency !== cb.rankLatency) return ca.rankLatency - cb.rankLatency;
    const ea = a.legal_name ? 0 : 1;
    const eb = b.legal_name ? 0 : 1;
    if (ea !== eb) return ea - eb;
    const ya = a.year_founded ?? 9999;
    const yb = b.year_founded ?? 9999;
    if (ya !== yb) return ya - yb;
    return a.name.localeCompare(b.name);
  });
}
