import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';

/**
 * Fuente única de las cifras del sitio (dominios analizados y proveedores del
 * directorio). Se cuenta contra la base para que ninguna vista publique
 * números escritos a mano.
 */
export const useSiteStats = () => {
  const { data: domainCount } = useQuery({
    queryKey: ['stats-domain-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('domains')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
    staleTime: 1000 * 60 * 30,
  });

  const { data: companyCount } = useQuery({
    queryKey: ['stats-company-count', getActiveCountryCode()],
    queryFn: async () => {
      const { count } = await supabase
        .from('hosting_companies')
        .select('*', { count: 'exact', head: true })
        .eq('country', getActiveCountryCode());
      return count ?? 0;
    },
    staleTime: 1000 * 60 * 30,
  });

  return { domainCount, companyCount };
};

export const formatStatNumber = (n: number) => {
  if (n >= 1000) {
    const rounded = Math.floor(n / 100) * 100;
    return `${rounded.toLocaleString('es-CL')}+`;
  }
  return n.toString();
};
