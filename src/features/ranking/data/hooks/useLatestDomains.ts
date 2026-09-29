import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LatestDomain {
  d: string;
  date: string;
}

/**
 * Últimos dominios inscritos, leídos de la base (función pública
 * get_public_domains). Fuente única: no se consulta ningún JSON externo.
 */
export const useLatestDomains = (limit = 200) => {
  const query = useQuery({
    queryKey: ['latest-domains', limit],
    queryFn: async (): Promise<LatestDomain[]> => {
      const { data, error } = await supabase
        .from('domains')
        .select('domain, timestamp')
        .order('timestamp', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map((row) => ({
        d: row.domain,
        date: row.timestamp,
      }));

    },
    staleTime: 1000 * 60 * 10,
  });

  return {
    domains: query.data ?? [],
    updatedAt: query.data?.[0]?.date ?? '',
    isLoading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
  };
};
