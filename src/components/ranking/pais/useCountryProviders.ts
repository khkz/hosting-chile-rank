import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isHiddenProvider } from '@/lib/providerLinks';
import type { CountryCode } from '@/lib/countries';

/**
 * Proveedores verificados de un país para su ranking (sin los ocultos).
 * Un error de lectura queda en `isError`: nunca se confunde con un país vacío.
 * Pendiente: mover a src/features/ranking (sesión principal) junto a los demás hooks.
 */
export const useCountryProviders = (slug: string, code: CountryCode, enabled = true) =>
  useQuery({
    queryKey: ['country-best-hosting', slug],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, website, legal_name, corporate_group, datacenter_location, year_founded, technologies, is_curated, updated_at')
        .eq('country', code)
        .eq('is_verified', true)
        .range(0, 999);
      if (error) throw error;
      return (data ?? []).filter((c) => !isHiddenProvider(c.slug, c.website));
    },
  });
