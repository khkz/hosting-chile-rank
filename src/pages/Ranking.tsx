import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  Server, 
  Package, 
  ShoppingCart, 
  Layers, 
  Cloud, 
  Cpu, 
  Globe,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';
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
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';

// Host provider data
const hostProviders = [
  {
    id: 1,
    name: "HostingPlus",
    logo: "/lovable-uploads/528891ff-3b55-486e-a927-e4f6d373a3c5.png",
    rating: 9.9,
    price: "Desde $3.990/mes",
    speed: "9.9/10",
    uptime: "99.98%",
    features: [
      "LiteSpeed Enterprise",
      "Datacenter en Santiago",
      "IP chilena",
      "Soporte 24/7 local"
    ],
    url: "https://clientes.hostingplus.cl/cart.php?gid=13"
  },
  {
    id: 2,
    name: "EcoHosting",
    logo: "/logo-ecohosting.png",
    rating: 9.6,
    price: "Desde $4.990/mes",
    speed: "9.7/10",
    uptime: "99.96%",
    features: [
      "Apache Optimizado",
      "Datacenter en Providencia",
      "IP chilena",
      "Energía 100% renovable"
    ],
    url: "https://www.ecohosting.cl/"
  },
  {
    id: 3,
    name: "1Hosting",
    logo: "/logo-1hosting.svg",
    rating: 9.2,
    price: "Desde $3.490/mes",
    speed: "9.5/10",
    uptime: "99.93%",
    features: [
      "SSD NVMe",
      "Datacenter en Las Condes",
      "IP chilena",
      "Backups diarios"
    ],
    url: "https://1hosting.cl/"
  }
];

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

// Testimonials data
const testimonials = [
  {
    quote: "Migré mi tienda desde GoDaddy y la velocidad mejoró un 300%. El soporte es increíblemente rápido y eficiente.",
    author: "Carolina Pérez, Tienda Online"
  },
  {
    quote: "La diferencia de tener mi sitio en un servidor con IP chilena es notable. Mi posicionamiento en Google mejoró notablemente.",
    author: "Sebastián Muñoz, Blog de Viajes"
  },
  {
    quote: "Llevo 3 años con ellos y nunca he tenido caídas. El panel de control es intuitivo y el soporte siempre responde en minutos.",
    author: "Andrea Soto, Agencia Marketing"
  },
  {
    quote: "La migración fue gratuita y sin complicaciones. Me sorprendió lo fácil que fue el proceso completo.",
    author: "Rodrigo Vega, Desarrollador"
  }
];

// FAQ data
const faqItems = [
  {
    question: "¿Cómo se elabora el ranking?",
    answer: "Nuestro equipo realiza pruebas de rendimiento utilizando herramientas como GTmetrix, Pingdom y LoadImpact. Evaluamos tiempo de carga, TTFB, estabilidad, seguridad y soporte técnico. Cada servidor es sometido a las mismas pruebas bajo idénticas condiciones."
  },
  {
    question: "¿Qué ventaja tiene un hosting con IP chilena?",
    answer: "Un hosting con IP chilena ofrece menor latencia para visitantes locales, mejor posicionamiento SEO en búsquedas geográficas de Chile, y mayor protección legal al estar bajo jurisdicción chilena (Ley 19.628)."
  },
  {
    question: "¿Incluyen migración gratuita?",
    answer: "Sí, los tres proveedores del Top 3 ofrecen migración gratuita desde cualquier otro hosting. El proceso es realizado por sus técnicos y generalmente toma menos de 24 horas sin interrupciones de servicio."
  },
  {
    question: "¿Por qué HostingPlus lidera el ranking?",
    answer: "HostingPlus combina la mejor velocidad (LiteSpeed Enterprise), estabilidad superior (99.98% uptime), seguridad avanzada (BitNinja), y un soporte técnico excepcional con tiempos de respuesta promedio de 5 minutos."
  }
];

const Section = ({ children, id, className = "" }) => (
  <section id={id} className={`py-8 lg:py-12 max-w-6xl mx-auto px-4 ${className}`}>
    {children}
  </section>
);

const RankingPage = () => {
  const [latestDomains, setLatestDomains] = useState([]);
  const [domainUpdateTime, setDomainUpdateTime] = useState('');
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [domainsError, setDomainsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const domainsPerPage = 10;

  useEffect(() => {
    const fetchLatestDomains = async () => {
      setDomainsLoading(true);
      try {
        // GitHub raw URL for the latest.json file
        const githubRawUrl = "https://raw.githubusercontent.com/khkz/hosting-chile-rank/main/public/data/latest.json";
        // Add timestamp to URL to avoid cache
        const timestamp = Date.now();
        const response = await fetch(`${githubRawUrl}?ts=${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`No se pudieron cargar los dominios desde GitHub: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.domains && Array.isArray(data.domains)) {
          setLatestDomains(data.domains);
          setDomainUpdateTime(data.updated || new Date().toISOString());
        } else {
          throw new Error('Formato de datos no válido');
        }
      } catch (error) {
        console.error('Error fetching domains from GitHub:', error);
        setDomainsError(error.message);
      } finally {
        setDomainsLoading(false);
      }
    };

    fetchLatestDomains();
  }, []);

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
        <title>Ranking de Hosting Chile 2025 | Comparativa Oficial</title>
        <meta name="description" content="Comparativa actualizada de los mejores hosting en Chile. Evaluamos velocidad, soporte local y seguridad para tu sitio web." />
        <link rel="canonical" href="https://eligetuhosting.cl/ranking" />
        <link rel="alternate" hrefLang="es-cl" href="https://eligetuhosting.cl/ranking" />
        <meta property="og:url" content="https://eligetuhosting.cl/ranking" />
        <meta property="og:image" content="https://eligetuhosting.cl/lovable-uploads/4b9ad72f-ec68-4414-8b9f-5debe4d14d9f.png" />
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

      {/* Hero Section */}
      <Section id="hero" className="flex flex-col items-center justify-center text-center min-h-[60vh]">
        <h1 className="text-3xl lg:text-5xl font-bold text-[#2B2D42] mb-4">
          Ranking Hosting Chile 2025
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
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
        <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-8">
          Top 3 proveedores de hosting
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {hostProviders.map((provider, index) => (
            <div key={provider.id} className={`
              bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300
              ${index === 0 
                ? 'ring-2 ring-[#EF233C] transform md:scale-105' 
                : 'hover:scale-105'}
            `}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold mr-3 ${
                      index === 0 
                        ? 'bg-[#EF233C] text-white' 
                        : 'bg-gray-100 text-[#2B2D42]'
                    }`}>
                      {provider.id}
                    </span>
                    <img src={provider.logo} alt={provider.name} className="h-8" loading="lazy" />
                  </div>
                  <div className={`text-xl font-bold ${index === 0 ? 'text-[#EF233C]' : 'text-[#2B2D42]'}`}>
                    {provider.rating}/10
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-slate-100 rounded-full px-3 text-xs">
                    {provider.price}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-100 rounded-full px-3 text-xs">
                    Velocidad: {provider.speed}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-100 rounded-full px-3 text-xs">
                    Uptime: {provider.uptime}
                  </Badge>
                </div>
                
                <ul className="mb-6 text-sm space-y-2">
                  {provider.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-1.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className={`w-full font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                    index === 0 
                      ? 'bg-[#EF233C] hover:bg-[#d01d34] text-white' 
                      : 'bg-[#2B2D42] hover:bg-[#1a1c2e] text-white'
                  }`}
                >
                  <a href={provider.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="flex items-center justify-center">
                    Visitar sitio
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="h-0.5 bg-gray-200 w-full my-8" />

      {/* Categories */}
      <Section id="categories">
        <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-8">
          Explora por tipo de servicio
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
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
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6">
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
