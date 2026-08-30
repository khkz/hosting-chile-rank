import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import HostingCompanyInfo from '@/components/HostingCompanyInfo';
import CertificationBadges from '@/components/CertificationBadges';
import { ApprovedReviewsList } from '@/components/reviews/ApprovedReviewsList';
import { PublicReviewForm } from '@/components/reviews/PublicReviewForm';
import { useReviewStatsForSlug } from '@/hooks/useReviewStats';
import { Star } from 'lucide-react';
import { ReputationCard } from '@/components/reputation/ReputationCard';
import { Card } from '@/components/ui/card';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import HostingSectionsNav from '@/components/HostingSectionsNav';
import CompanyPresence from '@/components/CompanyPresence';
import { AlertTriangle } from 'lucide-react';
import BrandFAQ from '@/components/catalogo/BrandFAQ';
import { buildCatalogoSeo } from '@/components/catalogo/buildCatalogoSeo';
import VerifiedDataTable from '@/components/catalogo/VerifiedDataTable';
import SourcesConsulted from '@/components/catalogo/SourcesConsulted';
import Veredicto from '@/components/catalogo/Veredicto';
import DatacenterBadge from '@/components/DatacenterBadge';
import { isHiddenProvider } from '@/lib/providerLinks';

const SITE = 'https://eligetuhosting.cl';

const CatalogoDetalle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: company, isLoading } = useQuery({
    queryKey: ['hosting-company', slug],
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
    enabled: !!slug,
  });

  const { data: userReviews } = useReviewStatsForSlug(slug || '');

  useEffect(() => {
    if (slug && isHiddenProvider(slug, null)) { navigate('/catalogo', { replace: true }); return; }
    if (!isLoading && !company && slug) navigate('/catalogo', { replace: true });
  }, [company, navigate, slug, isLoading]);

  // --- Memos y derivados (HOOKS ANTES de cualquier return condicional) ---
  const minPrice = useMemo(() => {
    if (!company?.hosting_plans?.length) return 0;
    return Math.min(...company.hosting_plans.map((p: any) => p.price_monthly).filter((n: number) => n > 0));
  }, [company]);

  const seoData = useMemo(
    () => buildCatalogoSeo({ company, slug, minPrice, userReviews }),
    [company, slug, minPrice, userReviews],
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Cargando información...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!company || !seoData) return null;

  const companyData = {
    id: company.slug,
    name: company.name,
    logo: company.logo_url || '',
    description: company.description || '',
    descriptionEditorial: (company as any).description_editorial || '',
    rating: company.overall_rating || 0,
    yearFounded: company.year_founded ?? null,
    datacenterLocation: company.datacenter_location || '',
    website: company.website || '',
    contactInfo: {
      phone: company.contact_phone || '',
      email: company.contact_email || '',
      address: company.contact_address || '',
      hours: company.contact_hours || '',
    },
    plans: (company.hosting_plans || []).map((plan: any) => ({
      name: plan.name,
      price: plan.price_monthly,
      storage: plan.storage_gb ? `${plan.storage_gb} GB SSD` : 'No declarado',
      bandwidth: plan.bandwidth && String(plan.bandwidth).trim() ? plan.bandwidth : 'No declarado',
      domains: plan.domains_allowed ?? 'No declarado',
      features: plan.features || [],
    })),
    technologies: company.technologies || [],
    uptimeGuarantee: (company as any).uptime_guarantee || undefined,
    hasSslFree: (company as any).has_ssl_free ?? undefined,
    hasMigrationFree: (company as any).has_migration_free ?? undefined,
    paymentMethods: (company as any).payment_methods || undefined,
    pros: (company as any).pros || undefined,
    cons: (company as any).cons || undefined,
    uniqueSellingPoint: (company as any).unique_selling_point || undefined,
    corporateGroup: company.corporate_group || undefined,
    lastScrapedAt: (company as any).last_scraped_at || undefined,
  };

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={`${company.name}, ${company.name} opiniones, ${company.name} review, ${company.name} precios, es bueno ${company.name}, hosting ${company.name}`} />
        <link rel="canonical" href={seoData.canonical} />
        <link rel="alternate" hrefLang="es-CL" href={seoData.canonical} />
        <link rel="alternate" hrefLang="es" href={seoData.canonical} />
        <link rel="alternate" hrefLang="x-default" href={seoData.canonical} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:site_name" content="EligeTuHosting.cl" />
        <meta property="og:locale" content="es_CL" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.ogImage} />

        <script type="application/ld+json">{JSON.stringify(seoData.productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(seoData.editorialReview)}</script>
        <script type="application/ld+json">{JSON.stringify(seoData.breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(seoData.faqSchema)}</script>
        {seoData.orgSchema && (
          <script type="application/ld+json">{JSON.stringify(seoData.orgSchema)}</script>
        )}
      </Helmet>

      <Navbar />
      <HostingSectionsNav />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <SEOBreadcrumbs
          items={[
            { name: 'Catálogo', href: '/catalogo' },
            { name: company.name, href: `/catalogo/${slug}` },
          ]}
        />

        {/* H1 SEO de marca */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {company.name} — Review y Opiniones 2026
          </h1>
          <p className="text-muted-foreground mt-2">
            Nota editorial <strong>{seoData.rating.toFixed(1)}/10</strong>
            {company.year_founded ? ` · Opera desde ${company.year_founded}` : ''}
            {company.corporate_group ? ` · ${company.corporate_group}` : ''}
          </p>
          {(company as any).updated_at && (
            <p className="text-xs text-muted-foreground mt-1">
              Última actualización de datos: {new Date((company as any).updated_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          )}
        </header>


        {(company as any).is_fake_comparison && (
          <div className="mb-6 p-4 bg-destructive/10 rounded-lg border border-destructive/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">⚠️ Sitio de comparación no independiente</p>
              <p className="text-xs text-muted-foreground">
                Este sitio se presenta como comparador, pero pertenece al grupo empresarial <strong>{company.corporate_group}</strong>, que opera sus propias marcas de hosting.
              </p>
            </div>
          </div>
        )}

        {company.corporate_group && !(company as any).is_fake_comparison && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Transparencia corporativa</p>
              <p className="text-xs text-muted-foreground">
                {company.name} pertenece al grupo empresarial <strong>{company.corporate_group}</strong>. Otras marcas del mismo grupo pueden compartir infraestructura y soporte técnico.
              </p>
            </div>
          </div>
        )}

        <CertificationBadges companySlug={slug || ''} variant="horizontal" size="medium" />

        <div className="my-8">
          <CompanyPresence
            companySlug={slug || ''}
            companyName={company.name}
            rankingPosition={undefined}
            hasCertifications={true}
            inComparison={true}
          />
        </div>

        <HostingCompanyInfo company={companyData} />

        <DatacenterBadge providerName={company.name} variant="row" className="my-4" />

        <VerifiedDataTable
          yearFounded={company.year_founded}
          corporateGroup={company.corporate_group}
          datacenter={company.datacenter_location}
          minPrice={minPrice > 0 ? minPrice : null}
          technologies={company.technologies}
          uptimeGuarantee={(company as any).uptime_guarantee}
          hasSslFree={(company as any).has_ssl_free}
          hasMigrationFree={(company as any).has_migration_free}
          officialWebsite={company.website}
          slug={company.slug}
        />

        <SourcesConsulted
          fuentes={(company as any).fuentes}
          fechaVerificacion={(company as any).fecha_verificacion}
        />

        <ScoreBreakdown companyId={company.id} companyName={company.name} />




        <Veredicto
          name={company.name}
          rating={seoData.rating}
          editorial={(company as any).description_editorial}
          pros={(company as any).pros}
          cons={(company as any).cons}
        />

        <BrandFAQ companyName={company.name} items={seoData.faqItems} />

        {slug && slug !== 'hostingplus' && slug !== 'ecohosting' && (
          <section className="mt-12 space-y-4">
            <a
              href={`/comparativa/${slug}-vs-hostingplus`}
              className="block p-5 rounded-xl border-2 border-[#EF233C] bg-gradient-to-r from-[#EF233C]/5 to-white hover:from-[#EF233C]/10 transition"
            >
              <span className="text-sm uppercase tracking-wide text-[#EF233C] font-semibold">Comparativa</span>
              <p className="text-lg md:text-xl font-bold text-[#2B2D42] mt-1">
                Compáralo con el #1: {company.name} vs HostingPlus.cl →
              </p>
              <p className="text-sm text-gray-600 mt-1">Tabla lado a lado con nota, precio, datacenter y reseñas verificadas.</p>
            </a>
            <div className="grid sm:grid-cols-2 gap-3">
              <a href={`/alternativas-a/${slug}`} className="block p-4 rounded-xl border bg-white hover:border-[#EF233C] transition">
                <span className="text-xs uppercase text-gray-500 font-semibold">Alternativas</span>
                <p className="font-semibold text-[#2B2D42] mt-1">Mejores alternativas a {company.name} →</p>
              </a>
              {(['hostgator','bluehost','godaddy','hostingcl','planetahosting','fasthosting','webhosting'] as const).includes(slug as any) && (
                <a href={`/migrar-de/${slug}`} className="block p-4 rounded-xl border bg-white hover:border-[#EF233C] transition">
                  <span className="text-xs uppercase text-gray-500 font-semibold">Migración gratuita</span>
                  <p className="font-semibold text-[#2B2D42] mt-1">Migrar de {company.name} sin downtime →</p>
                </a>
              )}
            </div>
          </section>
        )}


        <section className="mt-12">
          <ReputationCard companyId={company.id} companyName={company.name} />
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Opiniones de clientes de {company.name}</h2>
          <ReviewsSection slug={slug!} />
        </section>

        <section className="mt-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Comparte tu experiencia con {company.name}</h2>
            <PublicReviewForm providerSlug={slug!} providerName={company.name} />
          </Card>
        </section>
      </main>

      <StickyCTA />
      <Footer />
    </>
  );
};

function ReviewsSection({ slug }: { slug: string }) {
  const { data } = useReviewStatsForSlug(slug);
  return (
    <div>
      {data && data.count > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{data.avg.toFixed(1)}</span>
          <span className="text-muted-foreground">· {data.count} reseña{data.count === 1 ? '' : 's'} de usuarios</span>
        </div>
      )}
      <ApprovedReviewsList providerSlug={slug} />
    </div>
  );
}

export default CatalogoDetalle;
