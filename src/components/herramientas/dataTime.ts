/**
 * Fechas y horas de datos de las herramientas, en hora de Chile.
 * Solo formatean marcas que vienen del dato (lectura de NIC Chile,
 * respuesta de una consulta, fecha de un archivo). Nunca inventan la fecha.
 */
import { parseDataDate } from '@/lib/format';

const TZ = 'America/Santiago';

/** «13 nov 2026». */
export function formatToolDate(value: string | null | undefined): string {
  const d = parseDataDate(value ?? null);
  if (!d) return 'sin fecha';
  return d
    .toLocaleDateString('es-CL', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' })
    .replace(/\./g, '');
}

/** «09:47» (24 h). */
export function formatToolTime(value: string | null | undefined): string {
  const d = parseDataDate(value ?? null);
  if (!d) return '';
  return d.toLocaleTimeString('es-CL', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false });
}

/** «13 nov 2026, 09:47». */
export function formatToolDateTime(value: string | null | undefined): string {
  const d = parseDataDate(value ?? null);
  if (!d) return 'sin fecha';
  return `${formatToolDate(value)}, ${formatToolTime(value)}`;
}

/** Valor para el atributo dateTime de <time>. */
export function isoDateTime(value: string | null | undefined): string | undefined {
  const d = parseDataDate(value ?? null);
  return d ? d.toISOString() : undefined;
}

/** Nombre del país en español a partir del código ISO-2 («US» → «Estados Unidos»). */
export function countryName(code: string | null | undefined): string {
  if (!code) return 'sin dato';
  try {
    return new Intl.DisplayNames(['es'], { type: 'region' }).of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}
