/**
 * Utilidades centralizadas para fechas y año del ranking
 * Actualizar CURRENT_YEAR cada año nuevo
 */

import { VERIFICATION_DATE_ISO } from '@/data/verified2026';

export const CURRENT_YEAR = 2026;

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Obtiene el texto de "Actualizado Mes Año" para badges visuales
 * Ejemplo: "Actualizado Enero 2026"
 */
export function getLastUpdatedText(): string {
  // Mes de la última verificación de los datos, nunca el mes en curso del visitante.
  const d = new Date(`${VERIFICATION_DATE_ISO}T12:00:00Z`);
  return `Actualizado en ${MONTHS_ES[d.getUTCMonth()].toLowerCase()} de ${d.getUTCFullYear()}`;
}

/**
 * Obtiene el año actual para uso en contenido
 */
export function getCurrentYear(): number {
  return CURRENT_YEAR;
}

/**
 * Obtiene la fecha ISO para schemas JSON-LD (dateModified)
 * Ejemplo: "2026-01-07"
 */
export function getLastUpdatedDate(): string {
  return VERIFICATION_DATE_ISO;
}

/**
 * Obtiene el texto del mes actual en español
 * Ejemplo: "Enero"
 */
export function getCurrentMonthName(): string {
  const now = new Date();
  return MONTHS_ES[now.getMonth()];
}

/**
 * Obtiene la fecha de publicación del año actual (1 de enero)
 * Ejemplo: "2026-01-01"
 */
export function getYearStartDate(): string {
  return `${CURRENT_YEAR}-01-01`;
}
