import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TCOCalculator from '@/components/TCOCalculator';

const TCOCalculatorPage = () => {
  return (
    <>
      <Helmet>
        <title>Calculadora TCO de Hosting Chile | Costo Total de Propiedad 2025</title>
        <meta 
          name="description" 
          content="Calcula el Costo Total de Propiedad (TCO) de tu hosting en Chile. Analiza costos a 1, 3 y 5 años, compara proveedores y descubre cuánto puedes ahorrar. Incluye extras y servicios adicionales." 
        />
        <meta name="keywords" content="TCO hosting Chile, calculadora costo hosting, total cost ownership hosting, comparar precios hosting, ahorro hosting" />
        <link rel="canonical" href="https://hostingchile.info/calculadora-tco" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hostingchile.info/calculadora-tco" />
        <meta property="og:title" content="Calculadora TCO de Hosting Chile | Costo Total de Propiedad 2025" />
        <meta property="og:description" content="Herramienta gratuita para calcular el costo total de propiedad de hosting en Chile. Analiza y compara costos reales a largo plazo." />
        <meta property="og:image" content="https://hostingchile.info/og-calculadora-tco.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hostingchile.info/calculadora-tco" />
        <meta property="twitter:title" content="Calculadora TCO de Hosting Chile | Costo Total de Propiedad 2025" />
        <meta property="twitter:description" content="Herramienta gratuita para calcular el costo total de propiedad de hosting en Chile. Analiza y compara costos reales a largo plazo." />
        <meta property="twitter:image" content="https://hostingchile.info/og-calculadora-tco.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Calculadora TCO de Hosting Chile",
            "description": "Herramienta para calcular el Costo Total de Propiedad (TCO) de servicios de hosting en Chile",
            "url": "https://hostingchile.info/calculadora-tco",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CLP",
              "availability": "https://schema.org/InStock"
            },
            "author": {
              "@type": "Organization",
              "name": "HostingChile.info",
              "url": "https://hostingchile.info"
            },
            "publisher": {
              "@type": "Organization",
              "name": "HostingChile.info",
              "url": "https://hostingchile.info",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hostingchile.info/logo.png"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <Navbar />
        <main className="pt-20">
          <TCOCalculator />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TCOCalculatorPage;