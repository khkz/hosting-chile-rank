// Helpers compartidos para páginas SEO por país (LATAM, .com).
// NO tocar Chile: estas utilidades solo se usan bajo /pe /mx /co /ar.

import type { CountryCode } from './country';

export const LATAM_META: Record<'pe' | 'mx' | 'co' | 'ar', {
  code: CountryCode;
  name: string;
  flag: string;
  locale: string;
  regex: RegExp; // detecta "datacenter local" en la cadena datacenter_location
}> = {
  pe: { code: 'PE', name: 'Perú',      flag: '🇵🇪', locale: 'es-PE', regex: /per[uú]/i },
  mx: { code: 'MX', name: 'México',    flag: '🇲🇽', locale: 'es-MX', regex: /m[eé]xico/i },
  co: { code: 'CO', name: 'Colombia',  flag: '🇨🇴', locale: 'es-CO', regex: /colombia/i },
  ar: { code: 'AR', name: 'Argentina', flag: '🇦🇷', locale: 'es-AR', regex: /argentina/i },
};

export type LatamSlug = keyof typeof LATAM_META;

export const isLatamSlug = (s: string | undefined): s is LatamSlug =>
  !!s && ['pe', 'mx', 'co', 'ar'].includes(s.toLowerCase());

// Slug del nombre largo del país sin acentos, usado en rutas como
// /pe/mejor-hosting-peru-2026. Las rutas registradas en App.tsx NO llevan
// acentos, así que aquí normalizamos con NFD para eliminar diacríticos.
export const LATAM_LONG_SLUG: Record<LatamSlug, string> = {
  pe: 'peru',
  mx: 'mexico',
  co: 'colombia',
  ar: 'argentina',
};

// OG image por país (imagen propia bajo public/og/).
export const LATAM_OG_IMAGE: Record<LatamSlug, string> = {
  pe: 'https://eligetuhosting.com/og/pe.png',
  mx: 'https://eligetuhosting.com/og/mx.png',
  co: 'https://eligetuhosting.com/og/co.png',
  ar: 'https://eligetuhosting.com/og/ar.png',
};

// Phrases that flip a country mention into a "NO local DC" statement.
// We strip them from the string before testing for the country name so
// that "sin datacenter en Perú" no longer produces a false positive.
const NEGATION_RE = /sin\s+datacenter[^,.;]*|sin\s+dc[^,.;]*|fuera\s+de[^,.;]*|revende(?:\s+infraestructura)?[^,.;]*|opera\s+de\s+forma\s+remota[^,.;]*/gi;

export const hasLocalDatacenter = (slug: LatamSlug, datacenter_location?: string | null): boolean => {
  if (!datacenter_location) return false;
  const cleaned = datacenter_location.replace(NEGATION_RE, ' ');
  return LATAM_META[slug].regex.test(cleaned);
};

// Tri-state (true/false/null) for JSON payloads: null = "no declara".
export const datacenterLocalStatus = (slug: LatamSlug, datacenter_location?: string | null): boolean | null => {
  if (!datacenter_location) return null;
  return hasLocalDatacenter(slug, datacenter_location);
};

// Orden objetivo declarado (Fase 2, pre-benchmark):
// 1) datacenter local real  2) entidad legal local declarada  3) antigüedad (año fundación asc)
export const rankProviders = <T extends {
  datacenter_location?: string | null;
  legal_name?: string | null;
  year_founded?: number | null;
  name: string;
}>(providers: T[], slug: LatamSlug): T[] => {
  return providers.slice().sort((a, b) => {
    const la = hasLocalDatacenter(slug, a.datacenter_location) ? 0 : 1;
    const lb = hasLocalDatacenter(slug, b.datacenter_location) ? 0 : 1;
    if (la !== lb) return la - lb;
    const ea = a.legal_name ? 0 : 1;
    const eb = b.legal_name ? 0 : 1;
    if (ea !== eb) return ea - eb;
    const ya = a.year_founded ?? 9999;
    const yb = b.year_founded ?? 9999;
    if (ya !== yb) return ya - yb;
    return a.name.localeCompare(b.name);
  });
};

// Slug canónico para la comparativa entre dos proveedores (ordenados alfabéticamente).
export const pairSlug = (a: string, b: string): string => a < b ? `${a}-vs-${b}` : `${b}-vs-${a}`;
