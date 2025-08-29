
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
  console.log('Index component starting to render');
  
  // Add page-specific SEO metadata
  React.useEffect(() => {
    console.log('Index component useEffect running');
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

  console.log('Index component rendering JSX');
  console.log('About to render Navbar and Hero');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-white font-montserrat text-[#333] overflow-x-hidden">
      <div style={{padding: '20px', backgroundColor: '#fff', margin: '20px', border: '2px solid red'}}>
        <h1>Debug: Page is loading</h1>
        <p>If you can see this, React is working</p>
      </div>
      <Navbar />
      <main className="relative">
        {/* section 1: Hero - Above the fold, load immediately */}
        <Hero />
        
        {/* section 2: Stats ticker - Above the fold */}
        <StatsTicker />
        
        {/* section 3: Ranking cards - Critical content */}
        <HostingRanking />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
