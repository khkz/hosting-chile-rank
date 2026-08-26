import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';

/**
 * Primer proveedor del ranking editorial (misma consulta que HostingRanking).
 * Devuelve null si la base no entrega resultados.
 */
export const useTopRankedProvider = () => {
  return useQuery({
    queryKey: ['top-ranked-provider', getActiveCountryCode()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('id, name, slug, overall_rating, ranking_position')
        .eq('country', getActiveCountryCode())
        .eq('is_verified', true)
        .not('ranking_position', 'is', null)
        .order('ranking_position')
        .limit(1);
      if (error) throw error;
      return data?.[0] ?? null;
    },
    staleTime: 1000 * 60 * 30,
  });
};
