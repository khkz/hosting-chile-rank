
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import HostingCompanyInfo from '@/components/HostingCompanyInfo';
import CertificationBadges from '@/components/CertificationBadges';
import { getHostingCompanyBySlug } from '@/data/hostingCompanies';
import SEOReviewSchema from '@/components/SEO/SEOReviewSchema';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import { PublicReviewsList } from '@/components/reviews/PublicReviewsList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Card } from '@/components/ui/card';

const CatalogoDetalle = () => {
  const { slug } = useParams<{slug: string}>();
  const navigate = useNavigate();
  const company = slug ? getHostingCompanyBySlug(slug) : null;
  
  useEffect(() => {
    if (!company && slug) {
      navigate('/catalogo', { replace: true });
    }
    
    if (company) {
      document.title = `${company.name} - Información Detallada | eligetuhosting.cl`;
    }
  }, [company, navigate, slug]);

  if (!company) {
    return null; // Will navigate away in useEffect
  }

  const minPrice = Math.min(...company.plans.map(plan => plan.price));

  return (
    <>
      {/* SEO Meta Tags */}
      <DynamicMetaTags 
        title={`${company.name} ⭐ ${company.rating}/10 - Review Completa 2025`}
        description={`${company.description.slice(0, 140)}... Desde $${minPrice.toLocaleString()}/mes. Soporte 24/7, SSL gratis, cPanel. Opiniones verificadas.`}
        canonical={`https://eligetuhosting.cl/catalogo/${slug}`}
        ogImage={`https://eligetuhosting.cl${company.logo}`}
        keywords={`${company.name}, hosting ${company.name}, review ${company.name}, precio ${company.name}, opiniones ${company.name}`}
      />

      {/* Schema Markup - LocalBusiness with Reviews */}
      <SEOReviewSchema 
        type="company"
        company={{
          id: company.id,
          name: company.name,
          slug: slug || '',
          logo: company.logo,
          website: company.website,
          rating: company.rating,
          reviewCount: 0 // Will be updated when reviews are implemented
        }}
        reviews={[]}
      />

      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <CertificationBadges companySlug={slug || ''} variant="horizontal" size="medium" />
        <HostingCompanyInfo company={company} />
        
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
