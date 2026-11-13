// Helpers de país para consultas y rutas. Derivan del registro único
// (src/lib/countries.ts); no declarar países aquí.
//
// Chile (.cl) resuelve siempre a CL sin prefijo de ruta.

import {
  EDITIONS,
  COM_PUBLISHED_EDITIONS,
  editionFromPath,
  isComHost,
  type CountryCode,
  type Edition,
} from './countries';

export type { CountryCode } from './countries';

export interface CountryInfo {
  code: CountryCode;
  /** Segmento de URL en el .com ('' para Chile). */
  slug: '' | 'pe' | 'mx' | 'co' | 'ar';
  name: string;
  flag: string;
  locale: string;
  /** Origen absoluto donde vive este país. */
  origin: string;
}

const toInfo = (e: Edition): CountryInfo => ({
  code: e.code as CountryCode,
  slug: e.slug as CountryInfo['slug'],
  name: e.name,
  flag: e.flag,
  locale: e.locale,
  origin: e.origin,
});

export const COUNTRIES = Object.fromEntries(
  EDITIONS.filter((e) => e.status === 'published').map((e) => [e.code, toInfo(e)])
) as Record<CountryCode, CountryInfo>;

export const DOT_COM_COUNTRIES: CountryInfo[] = COM_PUBLISHED_EDITIONS.map(toInfo);

export function isDotCom(host?: string): boolean {
  if (typeof window === 'undefined' && !host) return false;
  return isComHost(host);
}

/** País publicado indicado por la ruta (/pe, /mx, /co, /ar). */
export function getCountryFromPath(pathname: string): CountryInfo | null {
  const e = editionFromPath(pathname);
  if (!e || e.status !== 'published') return null;
  return COUNTRIES[e.code as CountryCode] ?? null;
}

/** Quita el prefijo de país. '/pe/catalogo' → '/catalogo'. */
export function stripCountryPrefix(pathname: string): string {
  const e = editionFromPath(pathname);
  if (!e) return pathname;
  const rest = pathname.replace(new RegExp(`^/${e.slug}`, 'i'), '');
  return rest || '/';
}

/**
 * País con el que se filtran las consultas a Supabase.
 * - En .cl (o SSR/build) → siempre 'CL'.
 * - En .com → el prefijo de la ruta (/pe, /mx, /co, /ar); sin prefijo, 'CL'.
 *
 * Síncrono y sin efectos: se llama dentro de las cadenas de consulta.
 */
export function getActiveCountryCode(pathname?: string): CountryCode {
  if (typeof window === 'undefined') return 'CL';
  if (!isDotCom()) return 'CL';
  const path = pathname ?? window.location.pathname;
  const fromPath = getCountryFromPath(path);
  return fromPath?.code ?? 'CL';
}
