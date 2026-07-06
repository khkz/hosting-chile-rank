// Logic for the "datacenter_local" boolean, shared across generators.
// Bug fixed: the previous regex just tested for country name in the string,
// so "sin datacenter en Perú" produced a false positive.
//
// Rules:
//   - true  → the string declares a datacenter INSIDE the country
//             (city or country name, without a negation right next to it).
//   - false → the string contains "sin datacenter", "fuera de",
//             "revende", "opera de forma remota", or only foreign locations.
//   - null  → no datacenter declared (null/empty source string).

export const LATAM_REGEX = {
  pe: /per[uú]/i,
  mx: /m[eé]xico/i,
  co: /colombia/i,
  ar: /argentina/i,
};

// Phrases that flip a country mention into a "NO local DC" statement.
// We strip them from the string before testing for the country name.
const NEGATION_RE = /sin\s+datacenter[^,.;]*|sin\s+dc[^,.;]*|fuera\s+de[^,.;]*|revende(?:\s+infraestructura)?[^,.;]*|opera\s+de\s+forma\s+remota[^,.;]*/gi;

export function hasLocalDatacenter(slug, datacenterLocation) {
  if (!datacenterLocation) return false;
  const cleaned = String(datacenterLocation).replace(NEGATION_RE, ' ');
  return LATAM_REGEX[slug].test(cleaned);
}

// Tri-state variant for JSON payloads: true / false / null (no declara).
export function datacenterLocalStatus(slug, datacenterLocation) {
  if (!datacenterLocation) return null;
  return hasLocalDatacenter(slug, datacenterLocation);
}
