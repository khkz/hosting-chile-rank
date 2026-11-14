import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Dominios a la venta (my_domain_portfolio). La página no consulta Supabase:
 * usa este hook, que distingue error (isError) de lista vacía.
 */
export function useMarketplaceDomains() {
  return useQuery({
    queryKey: ['marketplace-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('my_domain_portfolio')
        .select('id,domain_name,tld,listing_price,is_for_sale,sale_status,page_views,inquiries_count,created_at')
        .eq('is_for_sale', true)
        .order('listing_price', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}
