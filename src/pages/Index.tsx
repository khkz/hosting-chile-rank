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
import DatacenterEducation from '@/components/DatacenterEducation';



const HostingQuiz = React.lazy(() => import('@/components/HostingQuiz'));
const StoryBrandGuide = React.lazy(() => import('@/components/home/StoryBrandGuide'));
const BuyerJourneys = React.lazy(() => import('@/components/home/BuyerJourneys'));
const Objections = React.lazy(() => import('@/components/home/Objections'));
const WhyTrustUs = React.lazy(() => import('@/components/WhyTrustUs'));
const Testimonial = React.lazy(() => import('@/components/Testimonial'));
const Categories = React.lazy(() => import('@/components/Categories'));
const FAQ = React.lazy(() => import('@/components/FAQ'));
const Footer = React.lazy(() => import('@/components/Footer'));
const StickyCTA = React.lazy(() => import('@/components/StickyCTA'));
const MiniNav = React.lazy(() => import('@/components/MiniNav'));
const LatamEditions = React.lazy(() => import('@/components/home/LatamEditions'));

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-ink overflow-x-hidden">
      <ScrollProgress />

      <DynamicMetaTags
        title="Mejor Hosting Chile 2026"
        description="Compara hosting en Chile con datos declarados por cada proveedor y verificación en curso. Ranking editorial 2026 con metodología publicada."
        canonical="https://eligetuhosting.cl/"
        keywords="hosting chile, mejor hosting chile, hosting barato chile, hosting chile 2026"
        includeHreflang
      />

      <DatasetSchema />

      <SEOFAQSchema faqs={[
        {
          question: "¿Cuál es el mejor hosting en Chile 2026?",
          answer: "Según nuestra evaluación editorial con metodología y pesos publicados, el Top 3 lo encabezan HostingPlus, EcoHosting y Hostname (HN.cl), por infraestructura en Chile, soporte local y reputación pública sin reclamos abiertos. Divulgación: el editor de este sitio mantiene relación comercial con algunos de los proveedores listados."
        },
        {
          question: "¿Cuánto cuesta un hosting en Chile?",
          answer: "Los precios de hosting en Chile varían según proveedor, plan y periodo de contratación. La mayoría se cobra de forma anual y con IVA aparte. Consulta el precio vigente en el sitio de cada proveedor."
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

        {/* Educación sobre datacenters (Chile) */}
        <section className="py-8 px-4">
          <DatacenterEducation />
        </section>


        {/* Veredicto breve */}
        <TLDRVerdict />

        {/* Stats */}
        <StatsTicker />

        <Suspense fallback={null}>
          {/* StoryBrand: la pyme protagonista, nosotros la guía */}
          <StoryBrandGuide />

          {/* Buyer journeys: blog / pyme / tienda */}
          <BuyerJourneys />

          {/* ¿Qué tipo de proyecto tienes? */}
          <HostingQuiz />

          {/* Objeciones frecuentes con respuestas verificables */}
          <Objections />

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

          {/* Ediciones del .com: enlaces con cifras desde la base */}
          <LatamEditions />


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
