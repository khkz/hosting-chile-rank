/**
 * Formato único para cifras y fechas del sitio (es-CL por defecto).
 * Regla: coma decimal, punto de miles, «99,9 %», «28 de agosto de 2026».
 * Ninguna fecha de datos sale de `new Date()`: estas funciones solo formatean
 * fechas que vienen de la base.
 */

const DEFAULT_LOCALE = 'es-CL';

/** Nota editorial o puntaje: «9,9». Devuelve «—» si no hay valor. */
export function formatScore(value: number | null | undefined, decimals = 1, locale = DEFAULT_LOCALE): string {
  if (value == null || !Number.isFinite(Number(value))) return '—';
  return Number(value).toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/** Porcentaje: «99,9 %» (con espacio, como recomienda la RAE). */
export function formatPercent(value: number | null | undefined, decimals = 1, locale = DEFAULT_LOCALE): string {
  if (value == null || !Number.isFinite(Number(value))) return '—';
  return `${Number(value).toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} %`;
}

/** Entero con punto de miles: «5.700». */
export function formatInteger(value: number | null | undefined, locale = DEFAULT_LOCALE): string {
  if (value == null || !Number.isFinite(Number(value))) return '—';
  return Math.round(Number(value)).toLocaleString(locale);
}

/** Milisegundos: «180 ms». */
export function formatMs(value: number | null | undefined, locale = DEFAULT_LOCALE): string {
  if (value == null || !Number.isFinite(Number(value))) return '—';
  return `${Math.round(Number(value)).toLocaleString(locale)} ms`;
}

const CURRENCY_BY_CODE: Record<string, { currency: string; locale: string }> = {
  CLP: { currency: 'CLP', locale: 'es-CL' },
  PEN: { currency: 'PEN', locale: 'es-PE' },
  MXN: { currency: 'MXN', locale: 'es-MX' },
  COP: { currency: 'COP', locale: 'es-CO' },
  ARS: { currency: 'ARS', locale: 'es-AR' },
  USD: { currency: 'USD', locale: 'es-CL' },
};

/** Precio en la moneda de la edición: «$24.900», «S/ 70», «US$ 5,99». */
export function formatMoney(value: number | null | undefined, code = 'CLP'): string {
  if (value == null || !Number.isFinite(Number(value))) return '—';
  const cfg = CURRENCY_BY_CODE[code] ?? CURRENCY_BY_CODE.CLP;
  const decimals = code === 'CLP' || code === 'COP' ? 0 : 2;
  return Number(value).toLocaleString(cfg.locale, {
    style: 'currency',
    currency: cfg.currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Convierte «2026-08-28» o un ISO completo en Date sin correr el día:
 * una fecha sin hora se lee como fecha local (no UTC).
 */
export function parseDataDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** «28 de agosto de 2026». */
export function formatDataDate(value: string | Date | null | undefined, locale = DEFAULT_LOCALE): string {
  const d = parseDataDate(value);
  if (!d) return '—';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

/** «28 ago 2026», para tablas y metadatos. */
export function formatShortDate(value: string | Date | null | undefined, locale = DEFAULT_LOCALE): string {
  const d = parseDataDate(value);
  if (!d) return '—';
  return d
    .toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
    .replace(/\./g, '');
}

/** Valor ISO para el atributo dateTime de <time>. */
export function isoDate(value: string | Date | null | undefined): string | undefined {
  const d = parseDataDate(value);
  if (!d) return undefined;
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${da}`;
}
