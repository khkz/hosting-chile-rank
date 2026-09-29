import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import { isHiddenProvider } from '@/lib/providerLinks';

export interface RankingProvider {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  overall_rating: number | null;
  ranking_position: number | null;
  ranking_features: string[];
}

/**
 * Ranking construido desde la tabla `hosting_companies`.
 * El orden lo determina el dato: primero `ranking_position`, luego la nota
 * (`overall_rating`) descendente. Un proveedor sin nota NO entra al podio:
 * queda al final de la lista devuelta.
 */
export const useRankingProviders = (limit = 3) =>
  useQuery({
    queryKey: ['ranking-providers', getActiveCountryCode(), limit],
    staleTime: 15 * 60 * 1000,
    queryFn: async (): Promise<RankingProvider[]> => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, logo_url, website, overall_rating, ranking_position, ranking_features')
        .eq('country', getActiveCountryCode())
        .eq('is_verified', true)
        .order('ranking_position', { ascending: true, nullsFirst: false })
        .order('overall_rating', { ascending: false, nullsFirst: false })
        .limit(40);
      if (error) throw error;

      const rows = (data ?? [])
        .filter((r) => !isHiddenProvider(r.slug, r.website))
        .map((r) => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          logo_url: r.logo_url,
          website: r.website,
          overall_rating: r.overall_rating != null ? Number(r.overall_rating) : null,
          ranking_position: r.ranking_position,
          ranking_features: Array.isArray(r.ranking_features) ? (r.ranking_features as string[]) : [],
        }));

      // Sin nota → fuera del podio (al final).
      const withScore = rows.filter((r) => r.overall_rating != null);
      const withoutScore = rows.filter((r) => r.overall_rating == null);
      return [...withScore, ...withoutScore].slice(0, limit);
    },
  });
