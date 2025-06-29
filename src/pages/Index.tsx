
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsTicker from '@/components/StatsTicker';
import HostingRanking from '@/components/HostingRanking';
import Benefits from '@/components/Benefits';
import Testimonial from '@/components/Testimonial';
import Migration from '@/components/Migration';
import Categories from '@/components/Categories';
import SimpleFAQ from '@/components/SimpleFAQ';
import UltimasBusquedas from '@/components/UltimasBusquedas';
import TransparencyNotice from '@/components/TransparencyNotice';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import MiniNav from '@/components/MiniNav';
import ExitModal from '@/components/ExitModal';

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
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-white font-montserrat text-[#333] overflow-x-hidden">
      <Navbar />
      <main className="relative">
        {/* section 1: Hero */}
        <Hero />
        
        {/* section 2: Stats ticker */}
        <StatsTicker />
        
        {/* section 3: Ranking cards */}
        <HostingRanking />
        
        {/* section 4: Transparency Notice */}
        <TransparencyNotice />
        
        {/* section 5: Benefits */}
        <Benefits />
        
        {/* section 6: Testimonials + Partners */}
        <Testimonial />
        
        {/* section 7: Last Searches */}
        <UltimasBusquedas />
        
        {/* section 8: Migration CTA */}
        <Migration />
        
        {/* section 9: Categories */}
        <Categories />
        
        {/* section 10: FAQ */}
        <SimpleFAQ />
        
        {/* section 11: Final CTA */}
        <FinalCTA />
        
        {/* Mini Nav sticky */}
        <MiniNav />
        
        {/* CTA sticky mobile */}
        <StickyCTA />
        
        {/* Exit Intent Modal */}
        <ExitModal />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
