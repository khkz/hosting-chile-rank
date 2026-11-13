// Navegación del sitio por edición. Las secciones cambian según el país
// activo; el menú de guías y herramientas es común (vive en el .cl).

import {
  CL_ORIGIN,
  editionHref,
  getEdition,
  isComHost,
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
const link = (label: string, path: string, opts?: { cl?: boolean }): NavLinkItem =>
  opts?.cl && isComHost()
    ? { label, href: `${CL_ORIGIN}${path}`, external: true }
    : { label, href: path, external: /^https?:/.test(path) };

/** Secciones principales del encabezado para cada edición. */
export const sectionsFor = (key: EditionKey): NavLinkItem[] => {
  if (key === 'LATAM') {
    return [
      link('Índice por país', editionHref('LATAM')),
      link('Datos abiertos', '/datos'),
      link('Metodología', '/metodologia', { cl: true }),
      link('Cómo elegir hosting', '/guia-elegir-hosting', { cl: true }),
    ];
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
  if (e.status === 'verifying') {
    return [link('Estado de verificación', `/${e.slug}`), link('Metodología', '/metodologia', { cl: true })];
  }
  return [
    link('Ranking', rankingPath(e)),
    link('Proveedores', `/${e.slug}`),
    link('Datacenter local', `/${e.slug}/hosting-con-datacenter-local`),
    link('Reputación', `/${e.slug}/benchmark`),
    link('Metodología', '/metodologia', { cl: true }),
  ];
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
