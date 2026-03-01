
import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsTicker from '@/components/StatsTicker';
import ScrollProgress from '@/components/ScrollProgress';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOFAQSchema from '@/components/SEO/SEOFAQSchema';

const BeforeAfter = React.lazy(() => import('@/components/BeforeAfter'));
const HostingQuiz = React.lazy(() => import('@/components/HostingQuiz'));
const HostingRanking = React.lazy(() => import('@/components/HostingRanking'));
const Benefits = React.lazy(() => import('@/components/Benefits'));
const Testimonial = React.lazy(() => import('@/components/Testimonial'));
const Migration = React.lazy(() => import('@/components/Migration'));
const Categories = React.lazy(() => import('@/components/Categories'));
const FAQ = React.lazy(() => import('@/components/FAQ'));
const UltimasBusquedas = React.lazy(() => import('@/components/UltimasBusquedas'));
const TransparencyNotice = React.lazy(() => import('@/components/TransparencyNotice'));
const FinalCTA = React.lazy(() => import('@/components/FinalCTA'));
const CertificationsBanner = React.lazy(() => import('@/components/CertificationsBanner'));
const Footer = React.lazy(() => import('@/components/Footer'));
const StickyCTA = React.lazy(() => import('@/components/StickyCTA'));
const MiniNav = React.lazy(() => import('@/components/MiniNav'));
const ExitModal = React.lazy(() => import('@/components/ExitModal'));
const TrustReport = React.lazy(() => import('@/components/TrustReport'));
const OpenDataBadge = React.lazy(() => import('@/components/OpenDataBadge'));

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-white font-montserrat text-[#333] overflow-x-hidden">
      <ScrollProgress />
      
      <DynamicMetaTags
        title="Mejor Hosting Chile 2026"
        description="Compara los hostings más rápidos y seguros de Chile. Ranking independiente 2026 con +5.700 dominios analizados y 20 proveedores verificados."
        canonical="https://eligetuhosting.cl"
        keywords="hosting chile, mejor hosting chile, hosting barato chile, hosting chile 2026"
      />
      
      <SEOFAQSchema faqs={[
        {
          question: "¿Cuál es el mejor hosting en Chile 2026?",
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
        <Hero />
        <StatsTicker />
        
        <Suspense fallback={null}>
          <div className="section-separator"></div>
          <BeforeAfter />
          
          <div className="section-separator"></div>
          <HostingQuiz />
          
          <div className="section-separator"></div>
          <HostingRanking />
          
          <div className="section-separator"></div>
          <TrustReport />
          
          <div className="section-separator"></div>
          <TransparencyNotice />
          
          <div className="section-separator"></div>
          <Benefits />
          
          <div className="section-separator"></div>
          <Testimonial />
          
          <div className="section-separator"></div>
          <UltimasBusquedas />
          
          <Migration />
          
          <div className="section-separator"></div>
          <Categories />
          
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
              <OpenDataBadge />
            </div>
          </section>
          
          <FAQ />
          <CertificationsBanner />
          <FinalCTA />
          <MiniNav />
          <StickyCTA />
          <ExitModal />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
