
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import HostingCompanyInfo from '@/components/HostingCompanyInfo';
import CertificationBadges from '@/components/CertificationBadges';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import { PublicReviewsList } from '@/components/reviews/PublicReviewsList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import HostingSectionsNav from '@/components/HostingSectionsNav';
import CompanyPresence from '@/components/CompanyPresence';
import { AlertTriangle } from 'lucide-react';

const CatalogoDetalle = () => {
  const { slug } = useParams<{slug: string}>();
  const navigate = useNavigate();

  const { data: company, isLoading } = useQuery({
    queryKey: ['hosting-company', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(`*, hosting_plans(*)`)
        .eq('slug', slug)
        .eq('is_verified', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
  
  useEffect(() => {
    if (!isLoading && !company && slug) navigate('/catalogo', { replace: true });
    if (company) document.title = `${company.name} - Información Detallada | eligetuhosting.cl`;
  }, [company, navigate, slug, isLoading]);

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

  if (!company) return null;

  const minPrice = company.hosting_plans?.length > 0
    ? Math.min(...company.hosting_plans.map((plan: any) => plan.price_monthly))
    : 0;

  const companyData = {
    id: company.slug,
    name: company.name,
    logo: company.logo_url || '',
    description: company.description || '',
    descriptionEditorial: (company as any).description_editorial || '',
    rating: company.overall_rating || 0,
    yearFounded: company.year_founded || 0,
    datacenterLocation: company.datacenter_location || '',
    website: company.website || '',
    contactInfo: {
      phone: company.contact_phone || '',
      email: company.contact_email || '',
      address: company.contact_address || '',
      hours: company.contact_hours || ''
    },
    plans: (company.hosting_plans || []).map((plan: any) => ({
      name: plan.name,
      price: plan.price_monthly,
      storage: plan.storage_gb ? `${plan.storage_gb} GB SSD` : 'Ilimitado',
      bandwidth: plan.bandwidth || 'Ilimitada',
      domains: plan.domains_allowed || 1,
      features: plan.features || []
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
      <DynamicMetaTags 
        title={`${company.name} ⭐ ${(company.overall_rating || 0).toFixed(1)}/10 - Review Completa 2026`}
        description={`${((company as any).description_editorial || company.description || '').slice(0, 140)}... Desde $${minPrice.toLocaleString('es-CL')}/mes. Hosting verificado en Chile.`}
        canonical={`https://eligetuhosting.cl/catalogo/${slug}`}
        ogImage={company.logo_url ? `https://eligetuhosting.cl${company.logo_url}` : undefined}
        keywords={`${company.name}, hosting ${company.name}, review ${company.name}, precio ${company.name}`}
      />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": `Hosting ${company.name}`,
          "description": (company as any).description_editorial || company.description,
          "brand": { "@type": "Brand", "name": company.name },
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": minPrice,
            "priceCurrency": "CLP",
            "offerCount": company.hosting_plans?.length || 0,
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": company.total_reviews ? {
            "@type": "AggregateRating",
            "ratingValue": company.overall_rating,
            "bestRating": 10,
            "reviewCount": company.total_reviews
          } : undefined
        })}
      </script>

      <Navbar />
      <HostingSectionsNav />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <SEOBreadcrumbs 
          items={[
            { name: 'Catálogo', href: '/catalogo' },
            { name: company.name, href: `/catalogo/${slug}` }
          ]}
        />

        {/* Fake Comparison Site Warning */}
        {(company as any).is_fake_comparison && (
          <div className="mb-6 p-4 bg-destructive/10 rounded-lg border border-destructive/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">⚠️ Sitio de Comparación No Independiente</p>
              <p className="text-xs text-muted-foreground">
                Este sitio se presenta como un comparador de hosting, pero pertenece al grupo empresarial <strong>{company.corporate_group}</strong>, 
                que opera sus propias marcas de hosting. Las recomendaciones pueden no ser imparciales.
              </p>
            </div>
          </div>
        )}

        {/* Corporate Group Transparency */}
        {company.corporate_group && !(company as any).is_fake_comparison && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Transparencia Corporativa</p>
              <p className="text-xs text-muted-foreground">
                {company.name} pertenece al grupo empresarial <strong>{company.corporate_group}</strong>. 
                Otras marcas del mismo grupo pueden compartir infraestructura y soporte técnico.
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
        
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Opiniones de Clientes</h2>
          <PublicReviewsList companyId={company.id} companyName={company.name} />
        </section>

        <section className="mt-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Comparte tu Experiencia</h2>
            <ReviewForm companyId={company.id} companyName={company.name} />
          </Card>
        </section>
      </main>
      
      <StickyCTA />
      <Footer />
    </>
  );
};

export default CatalogoDetalle;
