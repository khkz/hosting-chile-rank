
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsTicker from '@/components/StatsTicker';
import HostingRanking from '@/components/HostingRanking';
import Methodology from '@/components/Methodology';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';

const Index = () => {
  // Add page-specific SEO metadata
  React.useEffect(() => {
    document.title = "Elige tu Hosting — Mejor Hosting Chile 2025";
    
    // Create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 
      'Compara los hostings más rápidos y seguros de Chile. Ranking independiente 2025 y cotización gratis.'
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
        {/* <!-- section 1: Hero --> */}
        <Hero />
        
        {/* <!-- section 2: Stats ticker --> */}
        <StatsTicker />
        
        {/* <!-- section 3: Ranking cards --> */}
        <HostingRanking />
        
        {/* <!-- section 4: Methodology --> */}
        <Methodology />
        
        {/* <!-- section 5: FAQ --> */}
        <FAQ />
        
        {/* <!-- section 6: Final CTA --> */}
        <FinalCTA />
        
        {/* <!-- section 5: CTA sticky mobile --> */}
        <StickyCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
