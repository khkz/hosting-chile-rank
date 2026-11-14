import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode, type CountryCode } from '@/lib/country';
import type { Tables } from '@/integrations/supabase/types';

/**
 * Consultas del catálogo, el directorio, las fichas y las reseñas, reunidas en
 * un solo módulo de hooks para que ninguna página ni componente consulte
 * Supabase directo. Son las mismas consultas y claves de caché que tenían las
 * páginas; no cambia qué datos se piden.
 * Pendiente (fuera de las carpetas de c6): mover este archivo a
 * src/features/ranking/data/hooks y exportarlo desde src/features/ranking/index.ts.
 */

/** Ficha de catálogo por slug: edición activa, solo verificada, con sus planes. */
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

/** Catálogo de la edición activa: proveedores verificados, de mayor a menor nota. */
export const useCatalogCompanies = () =>
  useQuery({
    queryKey: ['hosting-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(`*, hosting_plans(*)`)
        .eq('country', getActiveCountryCode())
        .eq('is_verified', true)
        .order('overall_rating', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export type DirectoryCompany = Pick<
  Tables<'hosting_companies'>,
  | 'id'
  | 'slug'
  | 'name'
  | 'website'
  | 'overall_rating'
  | 'is_curated'
  | 'is_verified'
  | 'contact_phone'
  | 'contact_address'
  | 'contact_hours'
  | 'datacenter_location'
  | 'corporate_group'
  | 'legal_name'
  | 'technologies'
  | 'year_founded'
>;

/** Directorio completo de la edición activa (también los que no tienen nota). */
export const useDirectoryCompanies = () =>
  useQuery({
    queryKey: ['directorio-completo-all'],
    queryFn: async (): Promise<DirectoryCompany[]> => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(
          'id, slug, name, website, overall_rating, is_curated, is_verified, contact_phone, contact_address, contact_hours, datacenter_location, corporate_group, legal_name, technologies, year_founded',
        )
        .eq('country', getActiveCountryCode())
        .range(0, 999);
      if (error) throw error;
      return data || [];
    },
  });

/** Ficha de un proveedor en una edición por país (/pe/:slug, /mx/:slug…). */
export const useCountryCompany = (code: CountryCode | undefined, slug: string | undefined) =>
  useQuery({
    queryKey: ['country-provider-detail', code, slug],
    enabled: !!code && !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('*')
        .eq('country', code!)
        .eq('slug', slug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export type SiteCheck = Tables<'latam_site_checks'>;

/** Última verificación técnica medida del sitio oficial (latam_site_checks). */
export const useLatamSiteCheck = (companyId: string | undefined) =>
  useQuery({
    queryKey: ['latam-site-check', companyId],
    enabled: !!companyId,
    queryFn: async (): Promise<SiteCheck | null> => {
      const { data } = await supabase
        .from('latam_site_checks')
        .select('*')
        .eq('company_id', companyId!)
        .order('checked_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

/** Otros proveedores verificados del mismo país (para «Alternativas»). */
export const useCountryAlternatives = (code: CountryCode | undefined, slug: string | undefined) =>
  useQuery({
    queryKey: ['country-alternatives', code, slug],
    enabled: !!code && !!slug,
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('slug, name, datacenter_location, corporate_group')
        .eq('country', code!)
        .eq('is_verified', true)
        .neq('slug', slug!)
        .limit(20);
      return data ?? [];
    },
  });

/**
 * Reclamos verificados o resueltos sobre un proveedor. Si la consulta falla,
 * no hay dato (la página dice «sin dato»): nunca se muestra un 0 de relleno.
 */
export const useCompanyComplaintsCount = (companyId: string | undefined) =>
  useQuery({
    queryKey: ['company-complaints-count', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('public_complaints_public')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId!)
        .in('status', ['verified', 'resolved']);
      if (error) throw error;
      return { count: count ?? null };
    },
  });

export interface CertificationRow {
  id: string;
  position: number;
  tier: string | null;
  certification_categories: { name: string; icon: string | null; slug: string } | null;
}

/** Certificaciones vigentes que EligeTuHosting otorgó al proveedor. */
export const useCompanyCertifications = (companySlug: string) =>
  useQuery({
    queryKey: ['company-certifications', companySlug],
    queryFn: async (): Promise<CertificationRow[]> => {
      // Primero la empresa por slug
      const { data: company } = await supabase.from('hosting_companies').select('id').eq('slug', companySlug).single();
      if (!company) return [];
      // Luego sus certificaciones vigentes
      const { data } = await supabase
        .from('company_certifications')
        .select(`
          id,
          position,
          tier,
          certification_categories (name, icon, slug)
        `)
        .eq('company_id', company.id)
        .eq('status', 'active')
        .order('position');
      return (data || []) as unknown as CertificationRow[];
    },
  });

/** Reseñas de usuarios ya aprobadas (las 50 más recientes). */
export const useApprovedReviews = (providerSlug: string) =>
  useQuery({
    queryKey: ['public-reviews-v2', providerSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, author_name, rating, comment, created_at')
        .eq('provider_slug', providerSlug)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

/** Guarda una reseña de usuario como pendiente de moderación. */
export const insertPublicReview = (row: {
  provider_slug: string;
  author_name: string;
  author_email: string;
  rating: number;
  comment: string;
}) => supabase.from('reviews').insert({ ...row, status: 'pending' });

/** Proveedores verificados para elegir a quién reseñar (modal «Deja tu reseña»). */
export const useReviewableCompanies = (enabled: boolean) =>
  useQuery({
    queryKey: ['companies-for-review-modal'],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('slug, name, ranking_position, overall_rating')
        .eq('is_verified', true)
        .order('ranking_position', { ascending: true, nullsFirst: false })
        .order('overall_rating', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
