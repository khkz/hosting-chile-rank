// Registro único de ediciones por país.
//
// Fuente única de verdad para todo lo que dependa del país: dominio, rutas,
// moneda, idioma, hreflang y estado de publicación. Sumar un país nuevo es
// agregar una entrada aquí y cargar sus proveedores en `hosting_companies`
// con `country = <code>`. Mientras un país está en `verifying`:
//   - aparece en el índice LATAM como "en verificación",
//   - su página responde con noindex,
//   - no entra a hreflang ni a los sitemaps.
//
// Chile vive en eligetuhosting.cl (raíz); el resto vive en
// eligetuhosting.com/<slug>. La portada de eligetuhosting.com es el índice
// regional (edición LATAM).

export type EditionStatus = 'published' | 'verifying';

/** Países publicados (con proveedores verificados en la base). */
export type CountryCode = 'CL' | 'PE' | 'MX' | 'CO' | 'AR';

/** Países en verificación: configurados, sin ranking público todavía. */
export type VerifyingCode = 'UY' | 'EC' | 'CR' | 'PA' | 'DO' | 'GT' | 'BO' | 'PY';

export type EditionCode = CountryCode | VerifyingCode;

/** Clave de edición para la interfaz: un país o la portada regional. */
export type EditionKey = EditionCode | 'LATAM';

export interface Edition {
  code: EditionCode;
  /** Segmento de URL en el .com ('' para Chile, que vive en la raíz del .cl). */
  slug: string;
  /** Nombre del país sin acentos para rutas tipo /pe/mejor-hosting-peru-2026. */
  longSlug: string;
  name: string;
  /** Emoji de bandera: solo para textos planos heredados. La UI usa <Flag/>. */
  flag: string;
  locale: string;
  currency: string;
  origin: string;
  status: EditionStatus;
  /** Detecta el país dentro del texto libre `datacenter_location`. */
  dcPattern: RegExp;
}

export const CL_ORIGIN = 'https://eligetuhosting.cl';
export const COM_ORIGIN = 'https://eligetuhosting.com';
export const LATAM_HOME_URL = `${COM_ORIGIN}/`;
export const RANKING_YEAR = 2026;

export const EDITIONS: readonly Edition[] = [
  { code: 'CL', slug: '',   longSlug: 'chile',     name: 'Chile',     flag: '🇨🇱', locale: 'es-CL', currency: 'CLP', origin: CL_ORIGIN,  status: 'published', dcPattern: /chile/i },
  { code: 'PE', slug: 'pe', longSlug: 'peru',      name: 'Perú',      flag: '🇵🇪', locale: 'es-PE', currency: 'PEN', origin: COM_ORIGIN, status: 'published', dcPattern: /per[uú]/i },
  { code: 'MX', slug: 'mx', longSlug: 'mexico',    name: 'México',    flag: '🇲🇽', locale: 'es-MX', currency: 'MXN', origin: COM_ORIGIN, status: 'published', dcPattern: /m[eé]xico/i },
  { code: 'CO', slug: 'co', longSlug: 'colombia',  name: 'Colombia',  flag: '🇨🇴', locale: 'es-CO', currency: 'COP', origin: COM_ORIGIN, status: 'published', dcPattern: /colombia/i },
  { code: 'AR', slug: 'ar', longSlug: 'argentina', name: 'Argentina', flag: '🇦🇷', locale: 'es-AR', currency: 'ARS', origin: COM_ORIGIN, status: 'published', dcPattern: /argentina/i },

  { code: 'UY', slug: 'uy', longSlug: 'uruguay',              name: 'Uruguay',              flag: '🇺🇾', locale: 'es-UY', currency: 'UYU', origin: COM_ORIGIN, status: 'verifying', dcPattern: /uruguay/i },
  { code: 'EC', slug: 'ec', longSlug: 'ecuador',              name: 'Ecuador',              flag: '🇪🇨', locale: 'es-EC', currency: 'USD', origin: COM_ORIGIN, status: 'verifying', dcPattern: /ecuador/i },
  { code: 'CR', slug: 'cr', longSlug: 'costa-rica',           name: 'Costa Rica',           flag: '🇨🇷', locale: 'es-CR', currency: 'CRC', origin: COM_ORIGIN, status: 'verifying', dcPattern: /costa\s*rica/i },
  { code: 'PA', slug: 'pa', longSlug: 'panama',               name: 'Panamá',               flag: '🇵🇦', locale: 'es-PA', currency: 'USD', origin: COM_ORIGIN, status: 'verifying', dcPattern: /panam[aá]/i },
  { code: 'DO', slug: 'do', longSlug: 'republica-dominicana', name: 'República Dominicana', flag: '🇩🇴', locale: 'es-DO', currency: 'DOP', origin: COM_ORIGIN, status: 'verifying', dcPattern: /dominicana|santo\s+domingo/i },
  { code: 'GT', slug: 'gt', longSlug: 'guatemala',            name: 'Guatemala',            flag: '🇬🇹', locale: 'es-GT', currency: 'GTQ', origin: COM_ORIGIN, status: 'verifying', dcPattern: /guatemala/i },
  { code: 'BO', slug: 'bo', longSlug: 'bolivia',              name: 'Bolivia',              flag: '🇧🇴', locale: 'es-BO', currency: 'BOB', origin: COM_ORIGIN, status: 'verifying', dcPattern: /bolivia/i },
  { code: 'PY', slug: 'py', longSlug: 'paraguay',             name: 'Paraguay',             flag: '🇵🇾', locale: 'es-PY', currency: 'PYG', origin: COM_ORIGIN, status: 'verifying', dcPattern: /paraguay/i },
];

export const PUBLISHED_EDITIONS = EDITIONS.filter((e) => e.status === 'published');
export const VERIFYING_EDITIONS = EDITIONS.filter((e) => e.status === 'verifying');
/** Ediciones publicadas que viven bajo eligetuhosting.com/<slug>. */
export const COM_PUBLISHED_EDITIONS = PUBLISHED_EDITIONS.filter((e) => e.slug !== '');
/** Todos los segmentos de país del .com (publicados y en verificación). */
export const COM_SLUGS: readonly string[] = EDITIONS.filter((e) => e.slug !== '').map((e) => e.slug);

const BY_CODE = new Map(EDITIONS.map((e) => [e.code, e]));
const BY_SLUG = new Map(EDITIONS.filter((e) => e.slug).map((e) => [e.slug, e]));

export const getEdition = (code: EditionCode): Edition => BY_CODE.get(code)!;
export const getEditionBySlug = (slug: string | undefined | null): Edition | null =>
  (slug && BY_SLUG.get(slug.toLowerCase())) || null;

/** Edición indicada por el primer segmento de la ruta (/pe, /uy…), si existe. */
export const editionFromPath = (pathname: string): Edition | null =>
  getEditionBySlug(pathname.split('/').filter(Boolean)[0]);

export const isPublished = (e: Edition) => e.status === 'published';

// ── Hosts ──────────────────────────────────────────────────────────────

const currentHost = (host?: string) =>
  (host ?? (typeof window !== 'undefined' ? window.location.hostname : '')).toLowerCase().replace(/\.$/, '');

export const isComHost = (host?: string) => currentHost(host).endsWith('eligetuhosting.com');
export const isClHost = (host?: string) => currentHost(host).endsWith('eligetuhosting.cl');

/**
 * Vista previa de Lovable: ahí los enlaces entre ediciones quedan relativos
 * para poder recorrer Chile, LATAM y cada país sin salir de la vista previa.
 * En producción, localhost y el prerender se usan URLs absolutas.
 */
export const isPreviewHost = (host?: string) => {
  const h = currentHost(host);
  return h.endsWith('lovable.app') || h.endsWith('lovableproject.com');
};

/**
 * Edición activa para la interfaz.
 *  1. Un prefijo de país en la ruta manda (/pe, /uy…), en cualquier dominio.
 *  2. /latam es siempre la portada regional.
 *  3. En eligetuhosting.com, sin prefijo → LATAM.
 *  4. En cualquier otro host (eligetuhosting.cl, vista previa, prerender) → Chile.
 */
export const resolveEditionKey = (pathname: string, host?: string): EditionKey => {
  const fromPath = editionFromPath(pathname);
  if (fromPath) return fromPath.code;
  if (/^\/latam(\/|$)/.test(pathname)) return 'LATAM';
  if (isComHost(host)) return 'LATAM';
  return 'CL';
};

// ── URLs ───────────────────────────────────────────────────────────────

/** Ruta del ranking de una edición, relativa a su dominio. */
export const rankingPath = (e: Edition): string =>
  e.code === 'CL' ? '/ranking' : `/${e.slug}/mejor-hosting-${e.longSlug}-${RANKING_YEAR}`;

/** Portada de una edición, relativa a su dominio. */
export const homePath = (e: Edition): string => (e.slug ? `/${e.slug}` : '/');

/** URL absoluta canónica de una ruta dentro de una edición. */
export const editionUrl = (e: Edition, path = homePath(e)): string => `${e.origin}${path}`;

/**
 * Enlace navegable a una edición desde la página actual: relativo en la
 * vista previa y en el mismo dominio; absoluto al cruzar de .cl a .com.
 */
export const editionHref = (key: EditionKey, path?: string, host?: string): string => {
  if (key === 'LATAM') {
    if (isPreviewHost(host)) return '/latam';
    return isComHost(host) ? '/' : LATAM_HOME_URL;
  }
  const e = getEdition(key);
  const target = path ?? homePath(e);
  if (isPreviewHost(host)) return target;
  const sameDomain = e.origin === COM_ORIGIN ? isComHost(host) : isClHost(host);
  return sameDomain ? target : `${e.origin}${target}`;
};

/** Alternativas hreflang: solo ediciones publicadas + x-default al índice LATAM. */
export const hreflangAlternates = (): { hrefLang: string; href: string }[] => [
  ...PUBLISHED_EDITIONS.map((e) => ({
    hrefLang: e.locale,
    href: e.code === 'CL' ? `${CL_ORIGIN}/` : `${COM_ORIGIN}/${e.slug}`,
  })),
  { hrefLang: 'x-default', href: LATAM_HOME_URL },
];

// ── Formatos ───────────────────────────────────────────────────────────

const priceFormatters = new Map<string, Intl.NumberFormat>();

/** Precio en la moneda del país (sin decimales para monedas de valor bajo). */
export const formatPrice = (amount: number, code: EditionCode = 'CL'): string => {
  const e = getEdition(code);
  const key = `${e.locale}:${e.currency}`;
  if (!priceFormatters.has(key)) {
    const decimals = ['USD', 'PEN', 'UYU', 'BOB', 'GTQ'].includes(e.currency) ? 2 : 0;
    priceFormatters.set(
      key,
      new Intl.NumberFormat(e.locale, {
        style: 'currency',
        currency: e.currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    );
  }
  return priceFormatters.get(key)!.format(amount);
};

/** Número con separadores del país (tabular en tablas vía CSS). */
export const formatNumber = (n: number, locale = 'es-CL') => n.toLocaleString(locale);

/** "noviembre de 2026" para la edición vigente. */
export const editionMonthLabel = (date = new Date(), locale = 'es-CL') =>
  date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
