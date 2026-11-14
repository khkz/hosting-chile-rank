import { wikiTerms, type WikiTerm } from '@/data/wiki/terms';

/**
 * Deja una sola entrada por slug (la primera, que es la que abre /wiki/:slug).
 * terms.ts trae 3 slugs repetidos (lazy-loading, core-web-vitals, cpanel): sin
 * esto, las grillas mostraban la misma tarjeta dos veces y los conteos sumaban de más.
 */
export function uniqueBySlug(list: WikiTerm[]): WikiTerm[] {
  const seen = new Set<string>();
  return list.filter((t) => (seen.has(t.slug) ? false : (seen.add(t.slug), true)));
}

/** Términos que se muestran y se cuentan en la wiki. */
export const WIKI_TERMS: WikiTerm[] = uniqueBySlug(wikiTerms);

export const termsInCategory = (categoryId: string): WikiTerm[] =>
  WIKI_TERMS.filter((t) => t.category === categoryId);
