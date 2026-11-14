/**
 * Formatea el nombre de un grupo corporativo evitando duplicar el prefijo.
 * Si el valor ya dice «Grupo» o «Group» en cualquier posición («Grupo Hostname»,
 * «GoDaddy Group», «Group ZGH SpA»), lo devuelve tal cual; si no, antepone «Grupo».
 */
export function formatCorporateGroup(group?: string | null): string {
  if (!group) return '';
  const trimmed = group.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';
  if (/(^|[^\p{L}])(grupo|group)([^\p{L}]|$)/iu.test(trimmed)) return trimmed;
  return `Grupo ${trimmed}`;
}
