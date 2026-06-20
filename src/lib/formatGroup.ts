/**
 * Formatea el nombre de un grupo corporativo evitando duplicar el prefijo "Grupo".
 * Si el valor ya comienza con "Grupo " (case-insensitive), lo devuelve tal cual.
 */
export function formatCorporateGroup(group?: string | null): string {
  if (!group) return '';
  const trimmed = group.trim();
  if (/^grupo\s/i.test(trimmed)) return trimmed;
  return `Grupo ${trimmed}`;
}
