
import React, { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsTicker from '@/components/StatsTicker';
import HostingRanking from '@/components/HostingRanking';

// Lazy load non-critical components
const Benefits = lazy(() => import('@/components/Benefits'));
const Testimonial = lazy(() => import('@/components/Testimonial'));
const Migration = lazy(() => import('@/components/Migration'));
const Categories = lazy(() => import('@/components/Categories'));
const SimpleFAQ = lazy(() => import('@/components/SimpleFAQ'));
const UltimasBusquedas = lazy(() => import('@/components/UltimasBusquedas'));
const TransparencyNotice = lazy(() => import('@/components/TransparencyNotice'));
const FinalCTA = lazy(() => import('@/components/FinalCTA'));
const Footer = lazy(() => import('@/components/Footer'));
const StickyCTA = lazy(() => import('@/components/StickyCTA'));
const MiniNav = lazy(() => import('@/components/MiniNav'));
const ExitModal = lazy(() => import('@/components/ExitModal'));

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

  React.useEffect(() => {
    // Add RSS alternate link
    let rss = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
    if (!rss) {
      rss = document.createElement('link');
      rss.setAttribute('rel', 'alternate');
      rss.setAttribute('type', 'application/rss+xml');
      rss.setAttribute('href', '/feed/latest-domains.xml');
      document.head.appendChild(rss);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-white font-montserrat text-[#333] overflow-x-hidden">
      <Navbar />
      <main className="relative">
        {/* section 1: Hero - Above the fold, load immediately */}
        <Hero />
        
        {/* section 2: Stats ticker - Above the fold */}
        <StatsTicker />
        
        {/* section 3: Ranking cards - Critical content */}
        <HostingRanking />
        
        {/* Lazy loaded sections below the fold */}
        <Suspense fallback={<div className="h-20 bg-gray-50 animate-pulse" />}>
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
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
