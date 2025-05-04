
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HostingRanking from '@/components/HostingRanking';
import Methodology from '@/components/Methodology';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const Index = () => {
  // Add page-specific SEO metadata
  React.useEffect(() => {
    document.title = "Mejor Hosting Chileno 2025: Ranking Independiente | eligetuhosting.cl";
    
    // Create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 
      'Ranking 2025 de los mejores servicios de hosting en Chile. Comparamos velocidad, uptime, soporte y precio para ayudarte a elegir el mejor proveedor.'
    );
    
    // Add hreflang
    let hreflang = document.querySelector('link[rel="alternate"][hreflang="es-cl"]');
    if (!hreflang) {
      hreflang = document.createElement('link');
      hreflang.setAttribute('rel', 'alternate');
      hreflang.setAttribute('hreflang', 'es-cl');
      document.head.appendChild(hreflang);
    }
    hreflang.setAttribute('href', window.location.href);
    
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-montserrat text-[#333]">
      <Navbar />
      <main>
        <Hero />
        <HostingRanking />
        <Methodology />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      
      {/* Schema.org ItemList markup for the hosting ranking */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "Product",
                "name": "HostingPlus.cl",
                "url": "https://www.hostingplus.cl/",
                "description": "Datacenter propio en Santiago con IP chilena, tecnología LiteSpeed Enterprise y soporte 24/7.",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "9.9",
                  "bestRating": "10",
                  "worstRating": "0",
                  "ratingCount": "326"
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "Product",
                "name": "EcoHosting.cl",
                "url": "https://www.ecohosting.cl/",
                "description": "Hosting ecológico con servidores en Chile, energía 100% renovable y soporte local 24/7.",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "9.6",
                  "bestRating": "10",
                  "worstRating": "0",
                  "ratingCount": "245"
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 3,
              "item": {
                "@type": "Product",
                "name": "1Hosting.cl",
                "url": "https://www.1hosting.cl/",
                "description": "12 años de experiencia, almacenamiento NVMe, SSL gratis y backups RAID diarios.",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "9.2",
                  "bestRating": "10",
                  "worstRating": "0",
                  "ratingCount": "189"
                }
              }
            }
          ]
        }
      `}} />
    </div>
  );
};

export default Index;
