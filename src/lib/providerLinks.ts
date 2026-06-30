/**
 * Política de enlaces a sitios de proveedores y ocultamiento de proveedores dados de baja.
 * Solo presentación: NO modifica datos ni pipeline.
 */

export const DOFOLLOW_SLUGS = new Set(['hostingplus', 'ecohosting', 'hostingplus-pe']);
export const DOFOLLOW_DOMAINS = ['hostingplus.cl', 'ecohosting.cl', 'hostingplus.pe'];

export const HIDDEN_SLUGS = new Set([
  'hosting24',
  'hostengine',
  'masternet',
  'chileinternet',
  'afrohosting',
]);
export const HIDDEN_DOMAINS = [
  'hosting24.cl',
  'hostengine.cl',
  'masternet.cl',
  'chileinternet.cl',
  'afrohosting.cl',
];

const extractHost = (raw?: string | null): string | null => {
  if (!raw) return null;
  try {
    return new URL(raw).host.toLowerCase().replace(/^www\./, '');
  } catch {
    const h = String(raw).toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    return h || null;
  }
};

const matchDomain = (website: string | null | undefined, list: string[]) => {
  const host = extractHost(website);
  if (!host) return false;
  return list.some((d) => host === d || host.endsWith('.' + d));
};

export const isHiddenProvider = (slug?: string | null, website?: string | null): boolean => {
  if (slug && HIDDEN_SLUGS.has(String(slug).toLowerCase())) return true;
  return matchDomain(website, HIDDEN_DOMAINS);
};

export const isDofollowProvider = (slug?: string | null, website?: string | null): boolean => {
  if (slug && DOFOLLOW_SLUGS.has(String(slug).toLowerCase())) return true;
  return matchDomain(website, DOFOLLOW_DOMAINS);
};

/**
 * Devuelve { href, rel } para "Visitar sitio".
 * - HostingPlus / EcoHosting: directo a su sitio oficial, rel="noopener" (dofollow).
 * - Resto: pasa por /ir/{slug}, rel="nofollow noopener sponsored".
 */
export const getProviderLink = (
  slug?: string | null,
  website?: string | null
): { href: string; rel: string } => {
  if (isDofollowProvider(slug, website) && website) {
    return { href: website, rel: 'noopener' };
  }
  if (slug) return { href: `/ir/${slug}`, rel: 'nofollow noopener sponsored' };
  return { href: website || '#', rel: 'nofollow noopener sponsored' };
};

/**
 * Filtra una lista quitando proveedores dados de baja.
 * Acepta items con `slug` y/o `website`.
 */
export const filterVisibleProviders = <T extends { slug?: string | null; website?: string | null }>(
  items: T[] | null | undefined
): T[] => (items ?? []).filter((it) => !isHiddenProvider(it?.slug ?? null, it?.website ?? null));
