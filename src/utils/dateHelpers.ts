/**
 * Utilidades centralizadas para fechas y año del ranking
 * Actualizar CURRENT_YEAR cada año nuevo
 */

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
  const now = new Date();
  const month = MONTHS_ES[now.getMonth()];
  return `Actualizado ${month} ${CURRENT_YEAR}`;
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
  return new Date().toISOString().slice(0, 10);
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
