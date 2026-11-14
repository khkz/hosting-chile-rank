import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HostingRanking from '@/components/HostingRanking';
import ScrollProgress from '@/components/ScrollProgress';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOFAQSchema from '@/components/SEO/SEOFAQSchema';
import DatasetSchema from '@/components/SEO/DatasetSchema';
import DatacenterEducation from '@/components/DatacenterEducation';

const HostingQuiz = React.lazy(() => import('@/components/HostingQuiz'));
const StoryBrandGuide = React.lazy(() => import('@/components/home/StoryBrandGuide'));
const BuyerJourneys = React.lazy(() => import('@/components/home/BuyerJourneys'));
const Objections = React.lazy(() => import('@/components/home/Objections'));
const Testimonial = React.lazy(() => import('@/components/Testimonial'));
const Categories = React.lazy(() => import('@/components/Categories'));
const FAQ = React.lazy(() => import('@/components/FAQ'));
const Footer = React.lazy(() => import('@/components/Footer'));
const StickyCTA = React.lazy(() => import('@/components/StickyCTA'));
const LatamEditions = React.lazy(() => import('@/components/home/LatamEditions'));

const Index = () => {
  // overflow-x-clip donde se admite: hidden crea un contenedor de scroll y anula la cabecera sticky.
  // Safari < 16 no admite clip y se queda con hidden (recorte sin sticky).
  return (
    <div className="min-h-screen bg-white text-ink overflow-x-hidden supports-[overflow:clip]:overflow-x-clip">
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
        <DatacenterEducation />

        <Suspense fallback={null}>
          {/* StoryBrand: la pyme protagonista, nosotros la guía */}
          <StoryBrandGuide />

          {/* Buyer journeys: blog / pyme / tienda */}
          <BuyerJourneys />

          {/* ¿Qué tipo de proyecto tienes? */}
          <HostingQuiz />

          {/* Objeciones frecuentes con respuestas verificables */}
          <Objections />

          {/* Opiniones */}
          <Testimonial />

          {/* Explora por tipo de servicio */}
          <Categories />

          {/* FAQ */}
          <FAQ />

          {/* Ediciones del .com: enlaces con cifras desde la base */}
          <LatamEditions />

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
