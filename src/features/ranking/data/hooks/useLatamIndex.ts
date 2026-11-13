import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  PUBLISHED_EDITIONS,
  editionHref,
  type CountryCode,
  type Edition,
} from '@/lib/countries';
import { declaresDatacenterIn } from '@/lib/dcLocal';
import { rankProvidersByDcTier } from '@/lib/dcTier';
import { isHiddenProvider } from '@/lib/providerLinks';

export type RankingOrder = 'editorial' | 'infraestructura';

export interface LatamTopProvider {
  id: string;
  slug: string;
  name: string;
  href: string;
  /** Nota editorial (solo Chile publica notas). */
  score: number | null;
}

export interface LatamIndexRow {
  edition: Edition;
  total: number;
  /** Proveedores que declaran datacenter dentro del país. */
  localDc: number;
  /** Proveedores con mediciones propias (benchmark o chequeo de sitio). null si no se pudo leer. */
  measured: number | null;
  updatedAt: string | null;
  order: RankingOrder;
  top: LatamTopProvider[];
}

export interface LatamIndex {
  rows: LatamIndexRow[];
  totals: { providers: number; countries: number; measured: number | null };
}

interface CompanyRow {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  country: string;
  datacenter_location: string | null;
  legal_name: string | null;
  year_founded: number | null;
  ranking_position: number | null;
  overall_rating: number | null;
  updated_at: string | null;
}

const PUBLISHED_CODES = PUBLISHED_EDITIONS.map((e) => e.code);

/** IDs de proveedores con alguna medición propia. Si una tabla no responde, se ignora. */
const fetchMeasuredIds = async (): Promise<Set<string> | null> => {
  const [bench, checks] = await Promise.all([
    supabase.from('benchmark_results').select('company_id').not('composite_score', 'is', null).limit(5000),
    supabase.from('latam_site_checks').select('company_id').not('ttfb_ms', 'is', null).limit(5000),
  ]);
  if (bench.error && checks.error) return null;
  const ids = new Set<string>();
  (bench.data ?? []).forEach((r) => ids.add(r.company_id));
  (checks.data ?? []).forEach((r) => ids.add(r.company_id));
  return ids;
};

const topFor = (edition: Edition, list: CompanyRow[]): { order: RankingOrder; top: LatamTopProvider[] } => {
  if (edition.code === 'CL') {
    const ranked = list
      .filter((c) => c.ranking_position != null)
      .sort((a, b) => {
        const ap = a.ranking_position ?? 9999;
        const bp = b.ranking_position ?? 9999;
        if (ap !== bp) return ap - bp;
        return (b.overall_rating ?? 0) - (a.overall_rating ?? 0);
      })
      .slice(0, 3);
    return {
      order: 'editorial',
      top: ranked.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        href: editionHref('CL', `/catalogo/${c.slug}`),
        score: c.overall_rating != null ? Number(c.overall_rating) : null,
      })),
    };
  }
  const ranked = rankProvidersByDcTier(list, edition.slug as 'pe' | 'mx' | 'co' | 'ar').slice(0, 3);
  return {
    order: 'infraestructura',
    top: ranked.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      href: editionHref(edition.code, `/${edition.slug}/${c.slug}`),
      score: null,
    })),
  };
};

/**
 * Índice regional: una fila por país publicado con cifras leídas de la base.
 * Ninguna cifra se escribe a mano.
 */
export const useLatamIndex = () =>
  useQuery({
    queryKey: ['latam-index'],
    staleTime: 15 * 60 * 1000,
    queryFn: async (): Promise<LatamIndex> => {
      const [{ data, error }, measuredIds] = await Promise.all([
        supabase
          .from('hosting_companies')
          .select('id, slug, name, website, country, datacenter_location, legal_name, year_founded, ranking_position, overall_rating, updated_at')
          .eq('is_verified', true)
          .in('country', PUBLISHED_CODES)
          .range(0, 1999),
        fetchMeasuredIds(),
      ]);
      if (error) throw error;

      const companies = ((data ?? []) as CompanyRow[]).filter((c) => !isHiddenProvider(c.slug, c.website));

      const rows: LatamIndexRow[] = PUBLISHED_EDITIONS.map((edition) => {
        const list = companies.filter((c) => c.country === (edition.code as CountryCode));
        const updatedAt = list.reduce<string | null>(
          (max, c) => (c.updated_at && (!max || c.updated_at > max) ? c.updated_at : max),
          null
        );
        const { order, top } = topFor(edition, list);
        return {
          edition,
          total: list.length,
          localDc: list.filter((c) => declaresDatacenterIn(edition.dcPattern, c.datacenter_location)).length,
          measured: measuredIds ? list.filter((c) => measuredIds.has(c.id)).length : null,
          updatedAt,
          order,
          top,
        };
      });

      return {
        rows,
        totals: {
          providers: rows.reduce((n, r) => n + r.total, 0),
          countries: rows.filter((r) => r.total > 0).length,
          measured: measuredIds ? rows.reduce((n, r) => n + (r.measured ?? 0), 0) : null,
        },
      };
    },
  });
