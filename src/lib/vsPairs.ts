// All verified+curated catalog slugs (kept in sync with hosting_companies)
export const ALL_CATALOG_SLUGS = [
  'hostingplus','ecohosting','powerhost','hostgator','bluehost','cloudhosting',
  '1hosting-cl','fullhosting','prohosting','hn','hostingcl','fasthosting',
  'hosting24','planetahosting','inc-cl','webhosting','smarthost','godaddy','hostingchile'
] as const;

export const ANCHOR_HOSTINGPLUS = 'hostingplus';
export const ANCHOR_ECOHOSTING = 'ecohosting';
export const ANCHORS = [ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING] as const;

// Competitors targeted by /migrar-de/:slug landings
export const MIGRATION_COMPETITORS = [
  'hostgator','bluehost','godaddy','hostingcl','planetahosting','fasthosting','cloudhosting','webhosting'
] as const;

export interface VsPair {
  pair: string;          // url segment: "a-vs-b"
  a: string;             // first slug (URL order)
  b: string;             // second slug (URL order)
  involvesAnchor: boolean;
  anchor?: string;       // hostingplus|ecohosting if involved
  competitor?: string;   // the non-anchor side, when involvesAnchor
}

const isAnchor = (s: string) => s === ANCHOR_HOSTINGPLUS || s === ANCHOR_ECOHOSTING;

// Canonical url form:
//  - If one is an anchor → "competitor-vs-anchor"
//  - Otherwise → alphabetical "a-vs-b" where a < b
export function canonicalPair(x: string, y: string): string {
  if (x === y) return `${x}-vs-${y}`;
  if (isAnchor(x) && !isAnchor(y)) return `${y}-vs-${x}`;
  if (isAnchor(y) && !isAnchor(x)) return `${x}-vs-${y}`;
  if (isAnchor(x) && isAnchor(y)) {
    // anchor vs anchor: hostingplus first
    return x === ANCHOR_HOSTINGPLUS ? `${x}-vs-${y}` : `${y}-vs-${x}`;
  }
  return x < y ? `${x}-vs-${y}` : `${y}-vs-${x}`;
}

// All canonical pairs across the catalog (combinations, deduplicated).
// Order: vs HostingPlus first, vs EcoHosting second, then competitor↔competitor alphabetical.
export function getAllVsPairs(): VsPair[] {
  const slugs = [...ALL_CATALOG_SLUGS];
  const groupA: VsPair[] = []; // vs hostingplus
  const groupB: VsPair[] = []; // vs ecohosting
  const groupC: VsPair[] = []; // competitor vs competitor

  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const x = slugs[i], y = slugs[j];
      const pair = canonicalPair(x, y);
      const parsed = parsePair(pair)!;
      const a = parsed.a, b = parsed.b;
      const anchor = isAnchor(x) ? x : isAnchor(y) ? y : undefined;
      const competitor = anchor ? (anchor === x ? y : x) : undefined;
      const obj: VsPair = { pair, a, b, involvesAnchor, anchor, competitor };
      if (anchor === ANCHOR_HOSTINGPLUS) groupA.push(obj);
      else if (anchor === ANCHOR_ECOHOSTING) groupB.push(obj);
      else groupC.push(obj);
    }
  }
  groupA.sort((p, q) => (p.competitor || '').localeCompare(q.competitor || ''));
  groupB.sort((p, q) => (p.competitor || '').localeCompare(q.competitor || ''));
  groupC.sort((p, q) => p.pair.localeCompare(q.pair));
  return [...groupA, ...groupB, ...groupC];
}

// Group competitor↔competitor pairs by first company for the listing UX.
export function getCompetitorPairsGroupedByCompany(): Record<string, VsPair[]> {
  const grouped: Record<string, VsPair[]> = {};
  for (const p of getAllVsPairs()) {
    if (p.involvesAnchor) continue;
    if (!grouped[p.a]) grouped[p.a] = [];
    grouped[p.a].push(p);
  }
  return grouped;
}

// Parse "a-vs-b". Handles slugs that contain hyphens (e.g. "1hosting-cl"):
// we split on the LAST "-vs-" so that "1hosting-cl-vs-godaddy" works.
export function parsePair(pair: string): { a: string; b: string } | null {
  const idx = pair.lastIndexOf('-vs-');
  if (idx <= 0) return null;
  const a = pair.slice(0, idx);
  const b = pair.slice(idx + 4);
  if (!a || !b) return null;
  return { a, b };
}

export function isValidSlug(s: string): boolean {
  return (ALL_CATALOG_SLUGS as readonly string[]).includes(s);
}

export function isAnchorSlug(s: string): boolean {
  return s === ANCHOR_HOSTINGPLUS || s === ANCHOR_ECOHOSTING;
}
