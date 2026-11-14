// TS mirror de scripts/lib/dc-tier.mjs. Mantener sincronizado.
// Fuente ASN: scripts/lib/asn-map.json (bundled aquí como import).

import asnMap from '@/data/asnMap.json';

type Cc = 'PE' | 'MX' | 'CO' | 'AR' | 'CDN' | string;
export type AsnEntry = { cc: Cc; asn: string; org: string };
export const ASN_MAP = (asnMap as { providers: Record<string, AsnEntry> }).providers;
/** Fecha en que se consultó el ASN de cada IP (AAAA-MM-DD). null si el mapa no la trae. */
export const ASN_CHECKED_AT: string | null = (asnMap as { _generated?: string })._generated ?? null;

const TIER_CERTIFIED_SLUGS = new Set<string>([
  'hostdime-co',     // Tocancipá Tier IV Uptime Institute (verificable)
  'hostingplus-pe',  // GTD Lima, Perú — Tier III certificado (operador identificado)
  // Grupo HostingPlus: infraestructura Tier III certificada del grupo
  // (GTD Lima Tier III + Ascenty Santiago Tier III + Hivelocity Tampa + Google Cloud SP)
  // aplicable a las marcas país sin DC local propio pero operadas por el mismo grupo.
  'hostingplus-mx',
  'hostingplus-co',
  'hostingplus-ar',
]);

const FOREIGN_MARKERS = /sin\s+datacenter|revende|opera\s+de\s+forma\s+remota|fuera\s+de/i;
const SELF_DECLARED_MARKERS = /tier\s*(i{1,3}v?|iv|3|4|iii|ii)|homologable|clase\s+mundial|nivel\s+mundial|de\s+alto\s+nivel|propio/i;
const NEG_RE = /sin\s+datacenter[^,.;]*|sin\s+dc[^,.;]*|fuera\s+de[^,.;]*|revende[^,.;]*|opera\s+de\s+forma\s+remota[^,.;]*/gi;

const COUNTRY_RE: Record<string, RegExp> = {
  pe: /per[uú]/i,
  mx: /m[eé]xico/i,
  co: /colombia/i,
  ar: /argentina/i,
};

export type DcLocation = 'local_verified' | 'local_declared' | 'foreign_verified' | 'foreign_declared' | 'mismatch' | 'unknown';
export type DcQuality = 'tier_certified' | 'self_declared' | 'foreign_infra' | 'unknown';

export interface DcClass {
  location: DcLocation;
  quality: DcQuality;
  label: string;
  evidence: string;
  rankQuality: number;
  rankLatency: number;
  /** Declaración pública del proveedor (texto tal cual), '' si no declara. */
  declaration: string;
  /** Entrada del mapa de IP a ASN, si existe. */
  asn: AsnEntry | null;
}

export function classifyDc(
  p: { slug: string; datacenter_location?: string | null; legal_name?: string | null; name?: string },
  cslug: 'pe' | 'mx' | 'co' | 'ar'
): DcClass {
  const dcl = (p.datacenter_location || '').trim();
  const asn = ASN_MAP[p.slug] || null;
  const asnCC = asn?.cc || null;
  const countryRe = COUNTRY_RE[cslug];

  const declaresLocal = !!dcl && countryRe.test(dcl.replace(NEG_RE, ' '));
  const declaresForeign = !!dcl && FOREIGN_MARKERS.test(dcl);

  let location: DcLocation = 'unknown';
  if (asnCC === cslug.toUpperCase()) location = 'local_verified';
  else if (asnCC && asnCC !== 'CDN') location = declaresLocal ? 'mismatch' : 'foreign_verified';
  else if (asnCC === 'CDN' || !asnCC) {
    if (declaresLocal) location = 'local_declared';
    else if (declaresForeign || dcl) location = 'foreign_declared';
    else location = 'unknown';
  }

  let quality: DcQuality = 'unknown';
  if (TIER_CERTIFIED_SLUGS.has(p.slug)) quality = 'tier_certified';
  else if (dcl && /uptime\s+institute|icrea/i.test(dcl)) quality = 'tier_certified';
  else if (declaresForeign && !declaresLocal) quality = 'foreign_infra';
  else if (dcl && SELF_DECLARED_MARKERS.test(dcl)) quality = 'self_declared';

  const parts: string[] = [];
  if (location === 'local_verified') parts.push(`${cslug.toUpperCase()} · ASN local`);
  else if (location === 'local_declared') parts.push(`${cslug.toUpperCase()} · declarado (origen CDN)`);
  else if (location === 'foreign_verified') parts.push(`${asnCC} · ${asn?.org || 'ASN foráneo'}`);
  else if (location === 'foreign_declared') parts.push(`fuera de ${cslug.toUpperCase()} · declarado`);
  else if (location === 'mismatch') parts.push(`declara ${cslug.toUpperCase()} · ASN en ${asnCC}`);
  else parts.push('sin verificación');

  const qLabel: Record<DcQuality, string> = {
    tier_certified: 'Tier certificado',
    self_declared: 'autodeclarado',
    foreign_infra: 'infra externa',
    unknown: 'sin certificación conocida',
  };

  const label = `${parts[0]} · ${qLabel[quality]}`;
  const evidence = [
    dcl ? `Declaración: "${dcl}"` : 'Sin declaración pública',
    asn ? `ASN de la IP: ${asn.org} (${asn.asn})${asnCC && asnCC !== 'CDN' ? ` (${asnCC})` : ' (CDN)'}` : 'IP no resuelta',
  ].join(' · ');

  const rankQuality = { tier_certified: 0, self_declared: 1, unknown: 2, foreign_infra: 3 }[quality];
  const rankLatency = {
    local_verified: 0,
    local_declared: 1,
    mismatch: 2,
    unknown: 2,
    foreign_declared: 3,
    foreign_verified: 3,
  }[location];

  return { location, quality, label, evidence, rankQuality, rankLatency, declaration: dcl, asn };
}

// ── Presentación (solo lectura; no altera el orden) ─────────────────────

const CC_NAME: Record<string, string> = {
  US: 'EE.UU.', PE: 'Perú', MX: 'México', CO: 'Colombia', AR: 'Argentina', CL: 'Chile', BR: 'Brasil',
  CA: 'Canadá', DE: 'Alemania', NL: 'Países Bajos', ZA: 'Sudáfrica', GB: 'Reino Unido', FR: 'Francia',
};
const ccName = (cc: string) => CC_NAME[cc] ?? cc;

export interface DcLocationView {
  /** Resumen corto: «En México», «Fuera de México», «Declara Colombia; IP fuera», «Sin dato». */
  status: string;
  /** Texto declarado por el proveedor (procedencia: Declarado). null si no declara. */
  declared: string | null;
  /** Lo que medimos de la IP (procedencia: Medido). null si no hay entrada de ASN. */
  measured: string | null;
}

/** Ubicación del datacenter separada por procedencia: lo declarado y lo medido (IP a ASN). */
export function dcLocationView(dc: DcClass, countryName: string): DcLocationView {
  const declared = dc.declaration || null;
  let measured: string | null = null;
  if (dc.asn) {
    measured = dc.asn.cc === 'CDN'
      ? `IP de ${dc.asn.org} (CDN): no muestra el origen`
      : `IP en ${dc.asn.org} (${dc.asn.asn}), ${ccName(dc.asn.cc)}`;
  }
  const status: Record<DcLocation, string> = {
    local_verified: `En ${countryName}`,
    local_declared: `En ${countryName}`,
    foreign_verified: `Fuera de ${countryName}`,
    foreign_declared: `Fuera de ${countryName}`,
    mismatch: `Declara ${countryName}; IP fuera`,
    unknown: 'Sin dato',
  };
  return { status: status[dc.location], declared, measured };
}

/** Las cuatro categorías de calidad, con el mismo nombre que usa el orden de la tabla. */
export const DC_QUALITY_TEXT: Record<DcQuality, string> = {
  tier_certified: 'Tier certificado',
  self_declared: 'Autodeclarado',
  foreign_infra: 'Infraestructura externa',
  unknown: 'Sin certificación conocida',
};

const ISSUER_RE = /uptime\s+institute|icrea|t[üu]v(?:\s+rheinland)?/i;

/** Emisor de la certificación solo si aparece literalmente en la declaración; si no, null. */
export function dcIssuer(dc: DcClass): string | null {
  const m = dc.declaration.match(ISSUER_RE);
  return m ? m[0].replace(/\s+/g, ' ') : null;
}

export function rankProvidersByDcTier<T extends {
  slug: string;
  datacenter_location?: string | null;
  legal_name?: string | null;
  year_founded?: number | null;
  name: string;
}>(providers: T[], cslug: 'pe' | 'mx' | 'co' | 'ar'): T[] {
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
