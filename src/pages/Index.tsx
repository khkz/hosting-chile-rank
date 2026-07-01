import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HostingRanking from '@/components/HostingRanking';
import TLDRVerdict from '@/components/TLDRVerdict';
import StatsTicker from '@/components/StatsTicker';
import ScrollProgress from '@/components/ScrollProgress';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOFAQSchema from '@/components/SEO/SEOFAQSchema';
import DatasetSchema from '@/components/SEO/DatasetSchema';
import HreflangCluster from '@/components/SEO/HreflangCluster';

const HostingQuiz = React.lazy(() => import('@/components/HostingQuiz'));
const WhyTrustUs = React.lazy(() => import('@/components/WhyTrustUs'));
const Testimonial = React.lazy(() => import('@/components/Testimonial'));
const Categories = React.lazy(() => import('@/components/Categories'));
const FAQ = React.lazy(() => import('@/components/FAQ'));
const Footer = React.lazy(() => import('@/components/Footer'));
const StickyCTA = React.lazy(() => import('@/components/StickyCTA'));
const MiniNav = React.lazy(() => import('@/components/MiniNav'));

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-white font-montserrat text-[#333] overflow-x-hidden">
      <ScrollProgress />

      <DynamicMetaTags
        title="Mejor Hosting Chile 2026"
        description="Compara los hostings más rápidos y seguros de Chile. Ranking independiente 2026 con +5.700 dominios analizados y 20 proveedores verificados."
        canonical="https://eligetuhosting.cl/"
        keywords="hosting chile, mejor hosting chile, hosting barato chile, hosting chile 2026"
      />

      <HreflangCluster />

      <DatasetSchema />

      <SEOFAQSchema faqs={[
        {
          question: "¿Cuál es el mejor hosting en Chile 2026?",
          answer: "Según nuestras pruebas independientes, los mejores hostings de Chile incluyen HostingPlus (9.9/10), EcoHosting (9.6/10) y HN.cl (9.2/10), destacando en velocidad LiteSpeed, datacenter en Chile, soporte 24/7 y 0 reclamos verificados en los últimos 12 meses."
        },
        {
          question: "¿Cuánto cuesta un hosting en Chile?",
          answer: "Los precios de hosting en Chile varían entre $2.990 y $15.990 CLP mensuales. Los planes básicos cuestan $3.000-5.000/mes con 10-25GB SSD."
        },
        {
          question: "¿Qué incluye un plan de hosting compartido?",
          answer: "Almacenamiento SSD, transferencia mensual ilimitada, certificado SSL gratis, instalador WordPress, cPanel en español, backups diarios, cuentas de email y soporte 24/7."
        },
        {
          question: "¿Es mejor elegir hosting chileno o internacional?",
          answer: "Para audiencia chilena, mejor hosting local: menor latencia, soporte en español y horario chileno, IP chilena que beneficia el SEO local y facturación en CLP."
        },
        {
          question: "¿Cómo migrar mi sitio a un nuevo hosting?",
          answer: "La mayoría de hostings chilenos ofrecen migración gratuita. El proceso típico toma 24-48 horas y lo hace el soporte técnico."
        }
      ]} />

      <Navbar />
      <main className="relative">
        <Hero />

        {/* Ranking arriba (Top 3 + puestos 4-10) */}
        <HostingRanking />

        {/* Veredicto breve */}
        <TLDRVerdict />

        {/* Stats */}
        <StatsTicker />

        <Suspense fallback={null}>
          {/* ¿Qué tipo de proyecto tienes? */}
          <HostingQuiz />

          {/* Sección compacta de confianza (fusión) */}
          <WhyTrustUs />

          {/* Opiniones */}
          <Testimonial />

          {/* Explora por tipo de servicio */}
          <Categories />

          {/* FAQ */}
          <FAQ />

          <section className="py-12 px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold mb-3">Explora todos los proveedores verificados</h2>
              <p className="text-muted-foreground mb-5 text-sm md:text-base">
                Revisa el catálogo completo con fichas, reputación y precios.
              </p>
              <Link
                to="/catalogo"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
              >
                Ver catálogo completo
              </Link>
            </div>
          </section>

          <MiniNav />
          <StickyCTA />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
