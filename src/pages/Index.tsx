
import React from 'react';
import Hero from '@/components/Hero';
import HostingRanking from '@/components/HostingRanking';
import Methodology from '@/components/Methodology';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-montserrat">
      <Hero />
      <HostingRanking />
      <Methodology />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
