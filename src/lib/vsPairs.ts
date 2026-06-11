// All verified+curated catalog slugs (kept in sync with hosting_companies)
export const ALL_CATALOG_SLUGS = [
  'hostingplus','ecohosting','powerhost','hostgator','bluehost','cloudhosting',
  '1hosting-cl','fullhosting','prohosting','hn','hostingcl','fasthosting',
  'hosting24','planetahosting','inc-cl','webhosting','smarthost','godaddy','hostingchile'
] as const;

export const ANCHOR_HOSTINGPLUS = 'hostingplus';
export const ANCHOR_ECOHOSTING = 'ecohosting';

// Competitors that explicitly need a "vs EcoHosting" page (per editorial brief)
const VS_ECOHOSTING_COMPETITORS = ['hostgator','bluehost','hostingcl','godaddy','cloudhosting'];

export interface VsPair {
  pair: string;          // url segment: "competitor-vs-anchor"
  competitor: string;    // slug
  anchor: string;        // slug (hostingplus|ecohosting)
}

export function getAllVsPairs(): VsPair[] {
  const pairs: VsPair[] = [];
  for (const slug of ALL_CATALOG_SLUGS) {
    if (slug !== ANCHOR_HOSTINGPLUS) {
      pairs.push({ pair: `${slug}-vs-${ANCHOR_HOSTINGPLUS}`, competitor: slug, anchor: ANCHOR_HOSTINGPLUS });
    }
  }
  for (const slug of VS_ECOHOSTING_COMPETITORS) {
    pairs.push({ pair: `${slug}-vs-${ANCHOR_ECOHOSTING}`, competitor: slug, anchor: ANCHOR_ECOHOSTING });
  }
  return pairs;
}

// Parse "competitor-vs-anchor". Handles slugs that contain hyphens (e.g. "1hosting-cl").
export function parsePair(pair: string): { competitor: string; anchor: string } | null {
  const idx = pair.lastIndexOf('-vs-');
  if (idx <= 0) return null;
  const competitor = pair.slice(0, idx);
  const anchor = pair.slice(idx + 4);
  if (!competitor || !anchor) return null;
  return { competitor, anchor };
}
