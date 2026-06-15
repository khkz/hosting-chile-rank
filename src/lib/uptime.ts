/**
 * Normaliza una garantía de uptime a formato chileno "99,9%".
 *
 * Regla editorial: ningún proveedor puede anunciar "100% uptime" — es
 * técnicamente imposible. Si el valor recibido es >=100 (o "100%"), lo
 * capamos al SLA realista del sector: 99,9%.
 *
 * Acepta entradas como 99.9, "99.9", "99,9%", "99.9 %", "100%", null.
 * Devuelve null si no hay valor utilizable.
 */
export function formatUptime(input: unknown): string | null {
  if (input === null || input === undefined || input === '') return null;
  const raw = String(input).trim().replace('%', '').replace(',', '.').trim();
  if (!raw) return null;
  const num = Number(raw);
  if (!Number.isFinite(num) || num <= 0) return null;
  const capped = num >= 100 ? 99.9 : num;
  // Formato chileno: coma decimal, máx 2 decimales sin ceros sobrantes
  const str = capped.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
  return `${str}%`;
}
