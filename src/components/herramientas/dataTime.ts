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

/**
 * NIC Chile publica la hora local de Chile y el scraper (scripts/nic-to-json.mjs)
 * la guarda con «Z» sin convertirla: «2026-11-13T09:44:39Z» son las 09:44 en Chile.
 * Devuelve el instante real en UTC. Las fechas del respaldo XML ya vienen en UTC
 * (toISOString, con milisegundos) y se dejan igual.
 */
export function nicInstant(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) return value;
  const wall = new Date(value);
  if (Number.isNaN(wall.getTime())) return value;
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(wall);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const shown = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  // Diferencia de Chile con UTC en ese momento (p. ej. -3 h en verano).
  const offset = shown - wall.getTime();
  return new Date(wall.getTime() - offset).toISOString();
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
