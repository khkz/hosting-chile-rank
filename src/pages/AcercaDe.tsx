import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';

const AcercaDe: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Acerca de Nosotros | EligeTuHosting.cl</title>
        <meta name="description" content="Quiénes somos, nuestra metodología y principios de transparencia para recomendar el mejor hosting en Chile." />
        <link rel="canonical" href="https://eligetuhosting.cl/acerca-de" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
              "@type": "Organization",
              "name": "EligeTuHosting",
              "description": "Evaluamos proveedores de hosting en Chile desde 2020 con pruebas técnicas y políticas de transparencia",
              "foundingDate": "2020",
              "areaServed": "Chile"
            }
          })}
        </script>
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Acerca de EligeTuHosting</h1>
        <p className="text-gray-700 mb-6">
          Somos un equipo independiente que evalúa proveedores de hosting en Chile desde 2020. Nuestras recomendaciones
          se basan en pruebas técnicas, datos públicos y políticas de transparencia.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Transparencia</h2>
        <p className="text-gray-700 mb-6">
          Algunos enlaces pueden ser afiliados. Esto no afecta nuestras evaluaciones ni posiciones en el ranking. Priorizamos
          rendimiento, estabilidad, seguridad y soporte objetivo verificado.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Contacto</h2>
        <p className="text-gray-700">Escríbenos a contacto@eligetuhosting.cl</p>
      </main>
      <Footer />
    </>
  );
};

export default AcercaDe;
