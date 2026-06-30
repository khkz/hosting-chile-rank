// Country routing helpers for the multi-country (.com) shell.
// IMPORTANT: This file is purely additive. The Chilean (.cl) site
// always resolves to CL with no path prefix and is unaffected.

export type CountryCode = 'CL' | 'PE' | 'MX' | 'CO' | 'AR';

export interface CountryInfo {
  code: CountryCode;
  /** Lowercase slug used in URLs on the .com domain ('' for Chile). */
  slug: '' | 'pe' | 'mx' | 'co' | 'ar';
  name: string;
  flag: string;
  locale: string;
  /** Absolute origin where this country lives. */
  origin: string;
}

export const COUNTRIES: Record<CountryCode, CountryInfo> = {
  CL: { code: 'CL', slug: '',   name: 'Chile',     flag: '🇨🇱', locale: 'es-CL', origin: 'https://eligetuhosting.cl' },
  PE: { code: 'PE', slug: 'pe', name: 'Perú',      flag: '🇵🇪', locale: 'es-PE', origin: 'https://eligetuhosting.com' },
  MX: { code: 'MX', slug: 'mx', name: 'México',    flag: '🇲🇽', locale: 'es-MX', origin: 'https://eligetuhosting.com' },
  CO: { code: 'CO', slug: 'co', name: 'Colombia',  flag: '🇨🇴', locale: 'es-CO', origin: 'https://eligetuhosting.com' },
  AR: { code: 'AR', slug: 'ar', name: 'Argentina', flag: '🇦🇷', locale: 'es-AR', origin: 'https://eligetuhosting.com' },
};

export const DOT_COM_COUNTRIES: CountryInfo[] = [
  COUNTRIES.PE,
  COUNTRIES.MX,
  COUNTRIES.CO,
  COUNTRIES.AR,
];

const COUNTRY_SLUGS = ['pe', 'mx', 'co', 'ar'] as const;

export function isDotCom(host?: string): boolean {
  if (typeof window === 'undefined' && !host) return false;
  const h = (host ?? window.location.hostname).toLowerCase();
  return h.endsWith('.com') || h.endsWith('.com.');
}

export function getCountryFromPath(pathname: string): CountryInfo | null {
  const first = pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (!first) return null;
  const match = COUNTRY_SLUGS.find((s) => s === first);
  if (!match) return null;
  return COUNTRIES[match.toUpperCase() as CountryCode];
}

/** Strip the country prefix from a path. '/pe/catalogo' → '/catalogo'. */
export function stripCountryPrefix(pathname: string): string {
  const country = getCountryFromPath(pathname);
  if (!country) return pathname;
  const rest = pathname.replace(new RegExp(`^/${country.slug}`), '');
  return rest || '/';
}

/**
 * Determines the active country to filter Supabase queries by.
 * - On `.cl` (or SSR/build) → always 'CL'.
 * - On `.com` → reads from the URL path (/pe, /mx, /co, /ar);
 *   defaults to 'CL' when no country prefix is present.
 *
 * IMPORTANT: keep this side-effect-free and synchronous so it can be
 * called inside Supabase query chains.
 */
export function getActiveCountryCode(pathname?: string): CountryCode {
  if (typeof window === 'undefined') return 'CL';
  if (!isDotCom()) return 'CL';
  const path = pathname ?? window.location.pathname;
  const fromPath = getCountryFromPath(path);
  return fromPath?.code ?? 'CL';
}
