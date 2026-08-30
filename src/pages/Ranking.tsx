import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Server, 
  Package, 
  ShoppingCart, 
  Layers, 
  Cloud, 
  Cpu, 
  Globe
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import HostingSectionsNav from '@/components/HostingSectionsNav';
import RankingPositions4to10 from '@/components/RankingPositions4to10';
import RankingAuthorityBlock from '@/components/RankingAuthorityBlock';
import TopProvidersPodium from '@/components/ranking/TopProvidersPodium';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';
import SEOFAQSchema from '@/components/SEO/SEOFAQSchema';
import { useLatestDomains } from '@/hooks/useLatestDomains';
import { RANKING_TESTIMONIALS as testimonials, RANKING_FAQ as faqItems } from '@/data/rankingContent';

// El Top 3 se construye desde `hosting_companies` (ver TopProvidersPodium):
// el orden lo determina el dato, no un array escrito a mano.


// Categories data
const categories = [
  {
    title: "Web Hosting SSD",
    icon: <Server className="h-8 w-8 text-blue-600" />,
    bgColor: "bg-blue-50",
    url: "https://clientes.hostingplus.cl/cart.php?gid=13"
  },
  {
    title: "WordPress Turbo",
    icon: <Package className="h-8 w-8 text-indigo-600" />,
    bgColor: "bg-indigo-50",
    url: "https://clientes.hostingplus.cl/cart.php?gid=14"
  },
  {
    title: "e-Commerce",
    icon: <ShoppingCart className="h-8 w-8 text-emerald-600" />,
    bgColor: "bg-emerald-50",
    url: "https://clientes.hostingplus.cl/cart.php?gid=15"
  },
  {
    title: "Reseller",
    icon: <Layers className="h-8 w-8 text-teal-600" />,
    bgColor: "bg-teal-50",
    url: "https://clientes.hostingplus.cl/cart.php?gid=16"
  },
  {
    title: "VPS Cloud",
    icon: <Cloud className="h-8 w-8 text-orange-600" />,
    bgColor: "bg-orange-50",
    url: "https://clientes.hostingplus.cl/cart.php?gid=17"
  },
  {
    title: "Servidor Dedicado",
    icon: <Cpu className="h-8 w-8 text-yellow-600" />,
    bgColor: "bg-yellow-50",
    url: "https://clientes.hostingplus.cl/cart.php?gid=18"
  },
  {
    title: "Dominios .CL/.COM",
    icon: <Globe className="h-8 w-8 text-pink-600" />,
    bgColor: "bg-pink-50",
    url: "https://clientes.hostingplus.cl/cart.php?a=add&domain=register"
  }
];

const Section = ({ children, id, className = "" }) => (
  <section id={id} className={`py-8 lg:py-12 max-w-6xl mx-auto px-4 ${className}`}>
    {children}
  </section>
);

const RankingPage = () => {
  const { domains: latestDomains, updatedAt: domainUpdateTime, isLoading: domainsLoading, error: domainsError } = useLatestDomains(200);
  const [currentPage, setCurrentPage] = useState(1);
  const domainsPerPage = 10;


  // Pagination logic
  const indexOfLastDomain = currentPage * domainsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
  const currentDomains = latestDomains.slice(indexOfFirstDomain, indexOfLastDomain);
  const totalPages = Math.ceil(latestDomains.length / domainsPerPage);

  // Render pagination controls
  const renderPagination = () => {
    const pageNumbers = [];
    
    // Only show 5 page numbers around current page
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i 
              ? 'bg-[#EF233C] text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-100 rounded mr-2 disabled:opacity-50"
        >
          &laquo;
        </button>
        
        {pageNumbers}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-100 rounded ml-2 disabled:opacity-50"
        >
          &raquo;
        </button>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Ranking Hosting Chile 2026 | EligeTuHosting.cl</title>
        <meta name="description" content="Comparativa actualizada de los mejores hosting en Chile. Evaluamos velocidad, soporte local y seguridad para tu sitio web." />
        <link rel="canonical" href="https://eligetuhosting.cl/ranking" />
        <link rel="alternate" hrefLang="es-cl" href="https://eligetuhosting.cl/ranking" />
        <meta property="og:url" content="https://eligetuhosting.cl/ranking" />
        <meta property="og:image" content="https://eligetuhosting.cl/images/ranking-comparison.png" />
        <link rel="alternate" type="application/rss+xml" href="/feed/latest-domains.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <style type="text/css">{`
          /* Critical CSS */
          .critical-css {
            display: block;
            content-visibility: auto;
          }
        `}</style>
      </Helmet>

      <Navbar />
      <HostingSectionsNav />

      {/* Hero Section */}
      <Section id="hero" className="flex flex-col items-center justify-center text-center min-h-[40vh] md:min-h-[60vh]">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-[#2B2D42] mb-4">
          Ranking Hosting Chile 2026
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-lg mx-auto mb-8">
          Analizamos los mejores proveedores de hosting en Chile según velocidad, 
          soporte técnico, seguridad y soberanía digital.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild 
            className="bg-[#EF233C] hover:bg-[#d01d34] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <a href="#ranking">Comparar ahora</a>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="border-2 border-[#2B2D42] text-[#2B2D42] hover:bg-[#2B2D42] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            <a href="#methodology">Metodología</a>
          </Button>
        </div>
      </Section>

      <div className="h-0.5 bg-gray-200 w-full my-8" />

      {/* Top 3 Ranking */}
      <Section id="ranking">
        <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-4">
          Top 3 proveedores de hosting
        </h2>
        <p className="text-center text-sm text-gray-600 max-w-3xl mx-auto mb-4">
          El orden se calcula por fórmula sobre datos verificables. El editor mantiene relación
          comercial con algunos proveedores listados.
        </p>
        <RankingAuthorityBlock className="mb-8" />
        <TopProvidersPodium />


        {/* Puestos 4-10 */}
        <RankingPositions4to10 />
      </Section>

      <div className="h-0.5 bg-gray-200 w-full my-8" />

      {/* Categories */}
      <Section id="categories">
        <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-8">
          Explora por tipo de servicio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <a 
              key={index} 
              href={category.url} 
              target="_blank" 
              rel="nofollow sponsored noopener noreferrer"
              className="block hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden transform hover:scale-105"
            >
              <Card className={`${category.bgColor} h-full flex flex-col items-center justify-center p-6 text-center hover:shadow-xl transition-all duration-300`}>
                <div className="mb-4">
                  {category.icon}
                </div>
                <h3 className="font-medium text-[#2B2D42]">{category.title}</h3>
              </Card>
            </a>
          ))}
        </div>
      </Section>

      <div className="h-0.5 bg-gray-200 w-full my-8" />

      {/* Testimonials */}
      <Section id="testimonials">
        <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-8">
          Lo que dicen nuestros usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-4 shadow-sm hover:shadow transition-shadow">
              <blockquote className="italic text-gray-600 mb-4">
                "{testimonial.quote}"
              </blockquote>
              <footer className="text-sm font-medium">— {testimonial.author}</footer>
            </Card>
          ))}
        </div>
      </Section>

      <div className="h-0.5 bg-gray-200 w-full my-8" />

      {/* Latest Domains */}
      <Section id="domains">
        <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-2">
          Últimos dominios .CL registrados
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Datos actualizados: {domainUpdateTime ? new Date(domainUpdateTime).toLocaleString() : 'Cargando...'} UTC
        </p>
        
        <Card className="max-w-5xl mx-auto overflow-x-auto p-4 shadow-sm">
          {domainsLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EF233C]"></div>
              <span className="ml-2">Cargando dominios...</span>
            </div>
          ) : domainsError ? (
            <div className="text-center p-8 text-red-500">
              <p>Error al cargar los dominios: {domainsError}</p>
              <p className="mt-2 text-sm">Por favor, intenta recargar la página</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">N°</TableHead>
                    <TableHead>Dominio</TableHead>
                    <TableHead className="text-right">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDomains.map((item, index) => (
                    <TableRow key={indexOfFirstDomain + index}>
                      <TableCell className="font-medium">{indexOfFirstDomain + index + 1}</TableCell>
                      <TableCell>{item.d}</TableCell>
                      <TableCell className="text-right">{new Date(item.date).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>
                  Listado de dominios .CL recientemente registrados
                </TableCaption>
              </Table>
              {renderPagination()}
            </>
          )}
        </Card>
      </Section>

      <div className="h-0.5 bg-gray-200 w-full my-8" />

      {/* FAQ Section */}
      <SEOFAQSchema faqs={faqItems} />
      <Section id="faq">
        <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-8">
          Preguntas frecuentes
        </h2>
        <div className="max-w-3xl mx-auto space-y-3">
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <div className="h-0.5 bg-gray-200 w-full my-8" />

      {/* Contact Section */}
      <Section id="contact" className="text-center">
        <h2 className="text-2xl font-bold text-[#2B2D42] mb-4">
          ¿Necesitas ayuda para elegir?
        </h2>
        <p className="mb-6 max-w-lg mx-auto">
          Nuestro equipo de expertos puede ayudarte a encontrar la solución perfecta para tu proyecto.
        </p>
        <Button 
          asChild 
          className="bg-[#EF233C] hover:bg-[#d01d34] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <a href="mailto:contacto@eligetuhosting.cl">Contáctanos</a>
        </Button>
      </Section>

      <Footer />
    </>
  );
};

export default RankingPage;
