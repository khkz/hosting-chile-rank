// Navegación del sitio por edición. Las secciones cambian según el país
// activo; el menú de guías y herramientas es común (vive en el .cl).

import {
  CL_ORIGIN,
  editionHref,
  getEdition,
  isComHost,
  isPublished,
  rankingPath,
  type EditionKey,
} from './countries';

export interface NavLinkItem {
  label: string;
  href: string;
  /** true si el enlace sale del dominio actual (se usa <a> en vez de <Link>). */
  external?: boolean;
}

/**
 * Enlace a una ruta que vive en el .cl. Desde eligetuhosting.com se vuelve
 * absoluto; en el .cl, la vista previa, localhost y el prerender queda relativo.
 */
export const link = (label: string, path: string, opts?: { cl?: boolean }): NavLinkItem =>
  opts?.cl && isComHost()
    ? { label, href: `${CL_ORIGIN}${path}`, external: true }
    : { label, href: path, external: /^https?:/.test(path) };

/** Ancla de la sección «Cómo ordenamos» en la portada de cada país (CountryLanding). */
export const HOW_WE_RANK_ID = 'como-ordenamos';

/**
 * Metodología según la edición (se decide por la edición, no por el dominio):
 * - Chile: la página publicada /metodologia.
 * - Perú, México, Colombia y Argentina: la sección «Cómo ordenamos» de su propia portada.
 * - Latinoamérica: la de Chile, y el rótulo lo dice.
 * - Países en verificación: no tienen ranking todavía, así que no hay enlace.
 */
export const methodologyLink = (key: EditionKey = 'CL'): NavLinkItem | null => {
  if (key === 'CL') return link('Metodología', '/metodologia');
  if (key === 'LATAM') return link('Metodología (Chile)', '/metodologia', { cl: true });
  const e = getEdition(key);
  if (!isPublished(e)) return null;
  return link('Metodología', `/${e.slug}#${HOW_WE_RANK_ID}`);
};

/** true si el menú de guías lleva a otra edición (desde el .com, al .cl). */
export const guidesCrossEdition = (): boolean => isComHost();

const compact = (items: (NavLinkItem | null)[]): NavLinkItem[] => items.filter((i): i is NavLinkItem => i !== null);

/** Secciones principales del encabezado para cada edición. */
export const sectionsFor = (key: EditionKey): NavLinkItem[] => {
  if (key === 'LATAM') {
    return compact([
      link('Índice por país', editionHref('LATAM')),
      link('Datos abiertos', '/datos'),
      methodologyLink('LATAM'),
      link('Cómo elegir hosting', '/guia-elegir-hosting', { cl: true }),
    ]);
  }
  if (key === 'CL') {
    return [
      link('Ranking', '/ranking'),
      link('Proveedores', '/catalogo'),
      link('Comparar', '/comparativa'),
      link('Benchmark', '/benchmark'),
      link('Metodología', '/metodologia'),
    ];
  }
  const e = getEdition(key);
  if (!isPublished(e)) {
    return [link('En verificación', `/${e.slug}`), link('Índice por país', editionHref('LATAM'))];
  }
  return compact([
    link('Ranking', rankingPath(e)),
    link('Proveedores', `/${e.slug}`),
    link('Datacenter local', `/${e.slug}/hosting-con-datacenter-local`),
    link('Reputación', `/${e.slug}/benchmark`),
    methodologyLink(key),
  ]);
};

/** Secciones que existen con la misma ruta en cada país publicado del .com. */
const SHARED_COUNTRY_SECTIONS = ['hosting-con-datacenter-local', 'benchmark'] as const;

/**
 * Enlace al cambiar de país en la barra de ediciones: si la página actual
 * existe en el país de destino (ranking, datacenter local, reputación), se va
 * a esa misma página; si no, a la portada de la edición.
 * El /benchmark de Chile es otra sección (rendimiento medido), así que no se cruza.
 */
export const editionSwitchHref = (target: EditionKey, current: EditionKey, pathname: string): string => {
  if (target === 'LATAM' || current === 'LATAM') return editionHref(target);
  const from = getEdition(current);
  const to = getEdition(target);
  if (!isPublished(from) || !isPublished(to)) return editionHref(target);
  if (pathname === rankingPath(from)) return editionHref(target, rankingPath(to));
  if (from.slug && to.slug) {
    const section = pathname.replace(/\/+$/, '').split('/')[2];
    const isShared = (SHARED_COUNTRY_SECTIONS as readonly string[]).includes(section ?? '');
    if (isShared && pathname.startsWith(`/${from.slug}/`)) {
      return editionHref(target, `/${to.slug}/${section}`);
    }
  }
  return editionHref(target);
};

export interface NavGroup {
  title: string;
  items: NavLinkItem[];
}

/** Menú "Guías y herramientas" (contenido del .cl, útil en toda la región). */
export const guideGroups = (): NavGroup[] => [
  {
    title: 'Mejor hosting según tu proyecto',
    items: [
      link('Mejor hosting Chile 2026', '/mejor-hosting-chile-2026', { cl: true }),
      link('WordPress', '/mejor-hosting-wordpress-chile', { cl: true }),
      link('Tienda online', '/mejor-hosting-ecommerce-chile', { cl: true }),
      link('Pymes', '/mejor-hosting-pymes-chile', { cl: true }),
      link('VPS', '/mejor-vps-chile', { cl: true }),
    ],
  },
  {
    title: 'Guías de compra',
    items: [
      link('Cómo elegir hosting', '/guia-elegir-hosting', { cl: true }),
      link('Cómo elegir un VPS', '/guia-elegir-vps', { cl: true }),
      link('Servidor dedicado', '/guia-elegir-servidor-dedicado', { cl: true }),
      link('Certificados SSL', '/guia-elegir-ssl', { cl: true }),
      link('CDN', '/guia-elegir-cdn', { cl: true }),
      link('Migrar de hosting', '/guia-migrar-hosting', { cl: true }),
      link('Seguridad web', '/guia-seguridad-web', { cl: true }),
    ],
  },
  {
    title: 'Herramientas y datos',
    items: [
      link('Cotizar hosting', '/cotiza-hosting', { cl: true }),
      link('Calculadora de costo total', '/calculadora-tco', { cl: true }),
      link('Estudio Hosting Chile 2026', '/estudio-hosting-chile-2026', { cl: true }),
      link('Reclamos verificados', '/reclamos', { cl: true }),
      link('Mapa de redes (ASN)', '/asn', { cl: true }),
      link('Últimos dominios .CL', '/ultimos-dominios', { cl: true }),
      link('Wiki de hosting', '/wiki', { cl: true }),
      link('Blog', '/blog', { cl: true }),
    ],
  },
];
