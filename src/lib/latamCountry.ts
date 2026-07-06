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

export const hasLocalDatacenter = (slug: LatamSlug, datacenter_location?: string | null): boolean => {
  if (!datacenter_location) return false;
  return LATAM_META[slug].regex.test(datacenter_location);
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
