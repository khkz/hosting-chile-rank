// Helpers compartidos para páginas SEO por país (LATAM, .com).
// Derivan del registro único (src/lib/countries.ts). Solo cubren los países
// publicados bajo eligetuhosting.com/<slug>; Chile vive en el .cl.

import { COM_PUBLISHED_EDITIONS, COM_ORIGIN } from './countries';
import type { CountryCode } from './countries';

export type LatamSlug = 'pe' | 'mx' | 'co' | 'ar';

type LatamMeta = {
  code: CountryCode;
  name: string;
  flag: string;
  locale: string;
  regex: RegExp; // detecta "datacenter local" en la cadena datacenter_location
};

const PUBLISHED_COM = COM_PUBLISHED_EDITIONS as readonly { slug: string; code: string; name: string; flag: string; locale: string; dcPattern: RegExp; longSlug: string }[];

export const LATAM_META = Object.fromEntries(
  PUBLISHED_COM.map((e) => [e.slug, { code: e.code as CountryCode, name: e.name, flag: e.flag, locale: e.locale, regex: e.dcPattern }])
) as Record<LatamSlug, LatamMeta>;

export const isLatamSlug = (s: string | undefined): s is LatamSlug =>
  !!s && Object.prototype.hasOwnProperty.call(LATAM_META, s.toLowerCase());

// Slug del nombre largo del país sin acentos, usado en rutas como
// /pe/mejor-hosting-peru-2026.
export const LATAM_LONG_SLUG = Object.fromEntries(
  PUBLISHED_COM.map((e) => [e.slug, e.longSlug])
) as Record<LatamSlug, string>;

// OG image por país (imagen propia bajo public/og/).
export const LATAM_OG_IMAGE = Object.fromEntries(
  PUBLISHED_COM.map((e) => [e.slug, `${COM_ORIGIN}/og/${e.slug}.png`])
) as Record<LatamSlug, string>;

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

// Orden objetivo actualizado (LOTE PAISES-DC-TIER):
// 1) calidad certificada del DC (Uptime Institute / ICREA)
// 2) latencia/red al país (ASN local verificado por IP)
// 3) razón social local
// 4) antigüedad
export { rankProvidersByDcTier as rankProviders } from './dcTier';

// Slug canónico para la comparativa entre dos proveedores (ordenados alfabéticamente).
export const pairSlug = (a: string, b: string): string => a < b ? `${a}-vs-${b}` : `${b}-vs-${a}`;
