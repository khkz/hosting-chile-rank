
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsTicker from '@/components/StatsTicker';
import HostingRanking from '@/components/HostingRanking';
import Benefits from '@/components/Benefits';
import Testimonial from '@/components/Testimonial';
import Migration from '@/components/Migration';
import Categories from '@/components/Categories';
import FAQ from '@/components/FAQ';
import UltimasBusquedas from '@/components/UltimasBusquedas';
import TransparencyNotice from '@/components/TransparencyNotice';
import FinalCTA from '@/components/FinalCTA';
import CertificationsBanner from '@/components/CertificationsBanner';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import MiniNav from '@/components/MiniNav';
import ExitModal from '@/components/ExitModal';
import SEOReviewSchema from '@/components/SEO/SEOReviewSchema';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-white font-montserrat text-[#333] overflow-x-hidden">
      {/* SEO Meta Tags */}
      <DynamicMetaTags 
        title="Mejor Hosting Chile 2025"
        description="Compara los hostings más rápidos y seguros de Chile. Ranking independiente 2025 con ⭐ 4.8/5 (1,247 opiniones) y cotización gratis."
        canonical="https://eligetuhosting.cl"
        keywords="hosting chile, mejor hosting chile, hosting barato chile, hosting chile 2025"
      />
      
      {/* Schema Markup - Aggregate Rating */}
      <SEOReviewSchema 
        type="aggregate"
        aggregateData={{
          averageRating: 4.8,
          totalReviews: 1247,
          bestRating: 10,
          worstRating: 1
        }}
      />
      
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
        <FAQ />
        
        {/* section 11: Certifications Banner */}
        <CertificationsBanner />
        
        {/* section 12: Final CTA */}
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
