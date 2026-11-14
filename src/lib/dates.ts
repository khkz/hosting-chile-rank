/** "2026-08-28" si la fecha es válida; null si falta o no se puede leer (nunca lanza). */
export const isoDay = (value?: string | null): string | null => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};
