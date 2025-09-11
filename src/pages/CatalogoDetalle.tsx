
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import HostingCompanyInfo from '@/components/HostingCompanyInfo';
import { getHostingCompanyBySlug } from '@/data/hostingCompanies';
import { Helmet } from 'react-helmet';

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

  return (
    <>
      <Helmet>
        <title>{company.name} | EligeTuHosting.cl</title>
        <meta 
          name="description" 
          content={`Información detallada sobre ${company.name}: planes, precios, características técnicas, datos de contacto y más.`} 
        />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "${company.name}",
              "url": "${company.website}",
              "logo": "https://eligetuhosting.cl${company.logo}",
              "description": "${company.description}",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Santiago",
                "addressRegion": "RM",
                "addressCountry": "CL"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "${company.contactInfo.phone}",
                "contactType": "customer service",
                "email": "${company.contactInfo.email}"
              }
            }
          `}
        </script>
      </Helmet>

      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <HostingCompanyInfo company={company} />
      </main>
      
      <StickyCTA />
      <Footer />
    </>
  );
};

export default CatalogoDetalle;
