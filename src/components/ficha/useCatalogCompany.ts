import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';

/**
 * Ficha de catálogo de un proveedor (hosting_companies + sus planes) por slug,
 * en la edición activa y solo si está verificada. Es la misma consulta que
 * tenía CatalogoDetalle, extraída para que la reseña lea exactamente los
 * mismos datos que la ficha.
 * Pendiente: moverla a src/features/ranking (regla de AGENTS.md).
 */
export const useCatalogCompany = (slug: string | null | undefined) =>
  useQuery({
    queryKey: ['hosting-company', slug],
    enabled: !!slug,
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(`*, hosting_plans(*)`)
        .eq('country', getActiveCountryCode())
        .eq('slug', slug)
        .eq('is_verified', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export type CatalogCompany = NonNullable<ReturnType<typeof useCatalogCompany>['data']>;
