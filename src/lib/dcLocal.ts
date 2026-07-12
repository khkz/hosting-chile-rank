// TS mirror of scripts/lib/dc-local.mjs (negation-aware regex).
// Keep both files in sync when adding new phrases.

export type LatamDcSlug = 'pe' | 'mx' | 'co' | 'ar' | 'cl';

const COUNTRY_RE: Record<LatamDcSlug, RegExp> = {
  pe: /per[uú]/i,
  mx: /m[eé]xico/i,
  co: /colombia/i,
  ar: /argentina/i,
  cl: /chile/i,
};

const NEGATION_RE =
  /sin\s+datacenter[^,.;]*|sin\s+dc[^,.;]*|fuera\s+de[^,.;]*|revende(?:\s+infraestructura)?[^,.;]*|opera\s+de\s+forma\s+remota[^,.;]*/gi;

export function hasLocalDatacenter(
  slug: LatamDcSlug,
  datacenterLocation: string | null | undefined
): boolean {
  if (!datacenterLocation) return false;
  const cleaned = String(datacenterLocation).replace(NEGATION_RE, ' ');
  return COUNTRY_RE[slug].test(cleaned);
}

export function has247Support(contactHours: string | null | undefined): boolean {
  if (!contactHours) return false;
  const s = contactHours.toLowerCase();
  return /24\s*[\/x]\s*7|24\s*horas|24h|24\s*hrs|siempre\s+disponible|permanente/i.test(s);
}
