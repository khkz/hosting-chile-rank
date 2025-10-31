
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsTicker from '@/components/StatsTicker';
import BeforeAfter from '@/components/BeforeAfter';
import HostingQuiz from '@/components/HostingQuiz';
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
import SEOFAQSchema from '@/components/SEO/SEOFAQSchema';
import SocialProofFeed from '@/components/SocialProofFeed';

import ScrollProgress from '@/components/ScrollProgress';
import TrustReport from '@/components/TrustReport';
import OpenDataBadge from '@/components/OpenDataBadge';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-white font-montserrat text-[#333] overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <ScrollProgress />
      
      {/* Limited Offer Banner */}
      
      
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
      
      {/* Schema Markup - FAQ */}
      <SEOFAQSchema faqs={[
        {
          question: "¿Cuál es el mejor hosting en Chile 2025?",
          answer: "Según nuestras pruebas independientes, los mejores hostings de Chile incluyen HostingPlus (9.9/10), Ecohosting (9.8/10) y 1Hosting (9.5/10), destacando en velocidad LiteSpeed, soporte 24/7 y precios competitivos desde $3.469/mes."
        },
        {
          question: "¿Cuánto cuesta un hosting en Chile?",
          answer: "Los precios de hosting en Chile varían entre $2.990 y $15.990 CLP mensuales. Los planes básicos cuestan $3.000-5.000/mes con 10-25GB SSD, planes profesionales $7.000-10.000/mes con 50-100GB, y planes empresariales $12.000-16.000/mes con recursos ilimitados."
        },
        {
          question: "¿Qué incluye un plan de hosting compartido?",
          answer: "Un plan de hosting compartido típico en Chile incluye: almacenamiento SSD (10-100GB), transferencia mensual ilimitada, certificado SSL gratis, instalador WordPress automático, cPanel en español, backups diarios automáticos, cuentas de email profesionales y soporte técnico 24/7 en español."
        },
        {
          question: "¿Es mejor elegir hosting chileno o internacional?",
          answer: "Para sitios web con audiencia principalmente chilena, recomendamos hosting local porque ofrece: mejor velocidad de carga (servidores en Santiago), soporte técnico en español y horario chileno, IP chilena que beneficia el SEO local, facturación en CLP sin cargos por conversión, y cumplimiento de normativas locales."
        },
        {
          question: "¿Cómo migrar mi sitio a un nuevo hosting?",
          answer: "La mayoría de hostings chilenos ofrecen migración gratuita. El proceso incluye: 1) Contratar nuevo plan de hosting, 2) Solicitar servicio de migración al soporte, 3) Proporcionar credenciales del hosting actual, 4) El equipo técnico migra archivos y base de datos, 5) Verificar funcionamiento en dominio temporal, 6) Cambiar DNS cuando todo esté listo. El proceso toma entre 24-48 horas."
        }
      ]} />
      
      <Navbar />
      <main className="relative">
        {/* section 1: Hero */}
        <Hero />
        
        {/* section 2: Stats ticker */}
        <StatsTicker />
        
        <div className="section-separator"></div>
        
        {/* section 3: Before/After comparison */}
        <BeforeAfter />
        
        <div className="section-separator"></div>
        
        {/* section 4: Interactive Quiz */}
        <HostingQuiz />
        
        <div className="section-separator"></div>
        
        {/* section 5: Ranking cards */}
        <HostingRanking />
        
        <div className="section-separator"></div>
        
        {/* section 5.5: Trust Report - Verification Section */}
        <TrustReport />
        
        <div className="section-separator"></div>
        
        {/* section 6: Transparency Notice */}
        <TransparencyNotice />
        
        <div className="section-separator"></div>
        
        {/* section 7: Benefits */}
        <Benefits />
        
        <div className="section-separator"></div>
        
        {/* section 8: Testimonials + Partners */}
        <Testimonial />
        
        <div className="section-separator"></div>
        
        {/* section 9: Last Searches */}
        <UltimasBusquedas />
        
        {/* section 10: Migration CTA */}
        <Migration />
        
        <div className="section-separator"></div>
        
        {/* section 11: Categories */}
        <Categories />
        
        {/* section 11.5: Open Data Badge */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <OpenDataBadge />
          </div>
        </section>
        
        {/* section 12: FAQ */}
        <FAQ />
        
        {/* section 13: Certifications Banner */}
        <CertificationsBanner />
        
        {/* section 14: Final CTA */}
        <FinalCTA />
        
        {/* Mini Nav sticky */}
        <MiniNav />
        
        {/* CTA sticky mobile */}
        <StickyCTA />
        
        {/* Exit Intent Modal */}
        <ExitModal />
        
        {/* Social Proof Feed */}
        <SocialProofFeed />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
