import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import { filterVisibleProviders, isHiddenProvider } from '@/lib/providerLinks';

/**
 * Datos de las páginas de comparación (A vs B, alternativas, migrar y /vs).
 * Todas las consultas de esta área viven aquí y las páginas solo importan hooks.
 * PENDIENTE (AGENTS.md): mover este archivo a src/features/ranking y exportarlo
 * desde su index.ts. Antes estaban repartidas dentro de cada página.
 */

export interface CompareCompany {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  overall_rating: number | null;
  updated_at: string | null;
  fecha_verificacion: string | null;
  datacenter_location: string | null;
  foundation_year: number | null;
  year_founded: number | null;
  corporate_group: string | null;
  total_reviews: number | null;
  verified_reviews: number | null;
  pros: string[] | null;
  cons: string[] | null;
  uptime_guarantee: string | null;
  has_ssl_free: boolean | null;
  has_migration_free: boolean | null;
  support_rating: number | null;
  price_rating: number | null;
  promo_price: number | null;
}

const FIELDS =
  'id,slug,name,website,logo_url,overall_rating,updated_at,fecha_verificacion,datacenter_location,foundation_year,year_founded,corporate_group,total_reviews,verified_reviews,pros,cons,uptime_guarantee,has_ssl_free,has_migration_free,support_rating,price_rating,promo_price';

const toCompany = (r: Record<string, unknown>): CompareCompany => ({
  id: String(r.id),
  slug: String(r.slug),
  name: String(r.name),
  website: (r.website as string | null) ?? null,
  logo_url: (r.logo_url as string | null) ?? null,
  overall_rating: r.overall_rating != null ? Number(r.overall_rating) : null,
  updated_at: (r.updated_at as string | null) ?? null,
  fecha_verificacion: (r.fecha_verificacion as string | null) ?? null,
  datacenter_location: (r.datacenter_location as string | null) ?? null,
  foundation_year: (r.foundation_year as number | null) ?? null,
  year_founded: (r.year_founded as number | null) ?? null,
  corporate_group: (r.corporate_group as string | null) ?? null,
  total_reviews: (r.total_reviews as number | null) ?? null,
  verified_reviews: (r.verified_reviews as number | null) ?? null,
  pros: Array.isArray(r.pros) ? (r.pros as string[]).filter(Boolean) : null,
  cons: Array.isArray(r.cons) ? (r.cons as string[]).filter(Boolean) : null,
  uptime_guarantee: (r.uptime_guarantee as string | null) ?? null,
  has_ssl_free: (r.has_ssl_free as boolean | null) ?? null,
  has_migration_free: (r.has_migration_free as boolean | null) ?? null,
  support_rating: r.support_rating != null ? Number(r.support_rating) : null,
  price_rating: r.price_rating != null ? Number(r.price_rating) : null,
  promo_price: r.promo_price != null ? Number(r.promo_price) : null,
});

/** Proveedores de la edición activa por slug (misma consulta que tenían las páginas). */
export const useCompaniesBySlug = (slugs: string[], enabled = true) => {
  const key = [...slugs].sort().join(',');
  return useQuery({
    queryKey: ['compare-companies', getActiveCountryCode(), key],
    enabled: enabled && slugs.length > 0,
    staleTime: 15 * 60 * 1000,
    queryFn: async (): Promise<CompareCompany[]> => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(FIELDS)
        .eq('country', getActiveCountryCode())
        .in('slug', slugs);
      if (error) throw error;
      return ((data ?? []) as unknown as Record<string, unknown>[]).map(toCompany);
    },
  });
};

/** Líderes curados para «alternativas a X» (verificados y curados, por nota, máx. 6). */
export const useCuratedLeaders = (enabled = true) =>
  useQuery({
    queryKey: ['compare-curated-leaders', getActiveCountryCode()],
    enabled,
    staleTime: 15 * 60 * 1000,
    queryFn: async (): Promise<CompareCompany[]> => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(FIELDS)
        .eq('country', getActiveCountryCode())
        .eq('is_verified', true)
        .eq('is_curated', true)
        .order('overall_rating', { ascending: false })
        .limit(6);
      if (error) throw error;
      return filterVisibleProviders(((data ?? []) as unknown as Record<string, unknown>[]).map(toCompany));
    },
  });

/**
 * ¿El slug tiene ficha en /catalogo/:slug? Mismos filtros que CatalogoDetalle:
 * edición activa, slug exacto, verificado y no oculto.
 */
export const useProviderHasFicha = (slug: string | null) =>
  useQuery({
    queryKey: ['compare-has-ficha', getActiveCountryCode(), slug],
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
    queryFn: async (): Promise<boolean> => {
      if (!slug || isHiddenProvider(slug, null)) return false;
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('slug')
        .eq('country', getActiveCountryCode())
        .eq('slug', slug)
        .eq('is_verified', true)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
