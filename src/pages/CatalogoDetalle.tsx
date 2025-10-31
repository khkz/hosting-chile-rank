
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import HostingCompanyInfo from '@/components/HostingCompanyInfo';
import CertificationBadges from '@/components/CertificationBadges';
import SEOReviewSchema from '@/components/SEO/SEOReviewSchema';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import { PublicReviewsList } from '@/components/reviews/PublicReviewsList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Card } from '@/components/ui/card';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import HostingSectionsNav from '@/components/HostingSectionsNav';
import CompanyPresence from '@/components/CompanyPresence';

const CatalogoDetalle = () => {
  const { slug } = useParams<{slug: string}>();
  const navigate = useNavigate();

  // Fetch company data from Supabase
  const { data: company, isLoading } = useQuery({
    queryKey: ['hosting-company', slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from('hosting_companies')
        .select(`
          *,
          hosting_plans(*)
        `)
        .eq('slug', slug)
        .eq('is_verified', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
  
  useEffect(() => {
    if (!isLoading && !company && slug) {
      navigate('/catalogo', { replace: true });
    }
    
    if (company) {
      document.title = `${company.name} - Información Detallada | eligetuhosting.cl`;
    }
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

  if (!company) {
    return null; // Will navigate away in useEffect
  }

  const minPrice = company.hosting_plans && company.hosting_plans.length > 0
    ? Math.min(...company.hosting_plans.map((plan: any) => plan.price_monthly))
    : 0;

  // Transform company data to match HostingCompanyInfo interface
  const companyData = {
    id: company.slug,
    name: company.name,
    logo: company.logo_url || '',
    description: company.description || '',
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
    }))
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <DynamicMetaTags 
        title={`${company.name} ⭐ ${(company.overall_rating || 0).toFixed(1)}/10 - Review Completa 2025`}
        description={`${(company.description || '').slice(0, 140)}... Desde $${minPrice.toLocaleString('es-CL')}/mes. Hosting verificado en Chile. Opiniones reales y actualizadas.`}
        canonical={`https://eligetuhosting.cl/catalogo/${slug}`}
        ogImage={company.logo_url ? `https://eligetuhosting.cl${company.logo_url}` : undefined}
        keywords={`${company.name}, hosting ${company.name}, review ${company.name}, precio ${company.name}, opiniones ${company.name}, ${company.datacenter_location}`}
      />

      {/* Schema Markup - Product with Offers */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": `Hosting ${company.name}`,
          "description": company.description,
          "brand": {
            "@type": "Brand",
            "name": company.name
          },
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": minPrice,
            "priceCurrency": "CLP",
            "offerCount": company.hosting_plans?.length || 0,
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": company.overall_rating,
            "bestRating": 10,
            "reviewCount": company.total_reviews || 0
          }
        })}
      </script>

      {/* LocalBusiness Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": company.name,
          "image": company.logo_url,
          "url": company.website,
          "telephone": company.contact_phone,
          "email": company.contact_email,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": company.datacenter_location,
            "addressCountry": "CL"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "addressCountry": "CL"
          },
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": company.overall_rating,
            "bestRating": 10,
            "reviewCount": company.total_reviews || 0
          }
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
        
        <CertificationBadges companySlug={slug || ''} variant="horizontal" size="medium" />
        
        {/* Company Presence in Other Sections */}
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
        
        {/* Public Reviews List */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Opiniones de Clientes</h2>
          <PublicReviewsList 
            companyId={company.id}
            companyName={company.name}
          />
        </section>

        {/* Review Form */}
        <section className="mt-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Comparte tu Experiencia</h2>
            <ReviewForm 
              companyId={company.id}
              companyName={company.name}
            />
          </Card>
        </section>
      </main>
      
      <StickyCTA />
      <Footer />
    </>
  );
};

export default CatalogoDetalle;
