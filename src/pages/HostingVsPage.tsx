
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Check, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { hostingCompanies, getHostingCompanyBySlug } from '@/data/hostingCompanies';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// FAQs for the accordion
const faqs = [
  {
    question: "¿Ofrece HostingPlus migración gratuita?",
    answer: "Sí, HostingPlus ofrece migración gratuita de tu sitio web desde cualquier otro proveedor. Su equipo técnico se encarga de todo el proceso sin costos adicionales, garantizando que tu sitio se transfiera correctamente y sin tiempo de inactividad."
  },
  {
    question: "¿Qué ventajas ofrece la tecnología LiteSpeed de HostingPlus?",
    answer: "LiteSpeed Enterprise es un servidor web de alto rendimiento que ofrece velocidades hasta 6 veces superiores a Apache. Incluye caché avanzado, mejor manejo de conexiones concurrentes y optimización para WordPress, lo que resulta en tiempos de carga significativamente más rápidos."
  },
  {
    question: "¿Incluye HostingPlus dominio .CL gratuito?",
    answer: "Sí, todos los planes de HostingPlus incluyen un dominio .CL gratuito por un año. Después del primer año, puedes renovarlo a tarifas competitivas o transferirlo si lo deseas."
  }
];

// Pros and cons for HostingPlus
const hostingPlusPros = [
  "Servidor LiteSpeed Enterprise para máxima velocidad",
  "Datacenter en Chile para menor latencia",
  "Soporte técnico 24/7 en español",
  "Panel de control intuitivo",
  "Migración gratuita desde otro hosting",
  "Dominio .CL gratuito por un año",
  "Certificado SSL gratis"
];

// Dynamic pros and cons generator for competitor based on metrics
const getCompetitorStats = (competitor: any) => {
  const pros: string[] = [];
  const cons: string[] = [];
  
  // Generate based on data
  if (competitor.plans && competitor.plans[0] && competitor.plans[0].price < 5000) {
    pros.push("Precio económico");
  } else {
    cons.push("Precio superior al promedio del mercado");
  }
  
  if (competitor.contactInfo && competitor.contactInfo.address && competitor.contactInfo.address.includes("Santiago")) {
    pros.push("Oficina en Santiago");
  }
  
  if (competitor.datacenterLocation && competitor.datacenterLocation.includes("Chile")) {
    pros.push("Datacenter en Chile");
  } else {
    cons.push("Datacenter fuera de Chile (mayor latencia)");
  }
  
  if (competitor.yearFounded && (2025 - competitor.yearFounded) > 5) {
    pros.push(`${2025 - competitor.yearFounded} años de experiencia en el mercado`);
  } else {
    cons.push("Empresa relativamente nueva en el mercado");
  }
  
  // Always add some generic ones to have enough content
  if (pros.length < 3) {
    pros.push("Planes personalizables");
  }
  
  if (cons.length < 3) {
    cons.push("Sin migración gratuita garantizada");
    cons.push("Sin tecnología LiteSpeed Enterprise");
  }
  
  return { pros, cons };
};

const HostingVsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Get HostingPlus data
  const hostingPlus = getHostingCompanyBySlug('hostingplus');
  
  // Get competitor data
  const competitor = slug ? getHostingCompanyBySlug(slug) : null;
  
  // Return 404 if competitor not found or if slug is hostingplus
  if (!competitor || slug === 'hostingplus') {
    return <Navigate to="/404" />;
  }
  
  // Get competitor stats
  const { pros: competitorPros, cons: competitorCons } = getCompetitorStats(competitor);
  
  // Format price with locale
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
  };
  
  return (
    <>
      <Helmet>
        <title>HostingPlus vs {competitor.name}: ¿Cuál te conviene en 2025?</title>
        <meta name="description" content={`Comparativa 2025 entre HostingPlus y ${competitor.name}. Analizamos precios, rendimiento, soporte y más para ayudarte a elegir el mejor hosting en Chile.`} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "HostingPlus vs ${competitor.name}",
              "description": "Comparativa 2025 de alojamiento web en Chile",
              "brand": { "@type": "Brand", "name": "HostingPlus.cl" },
              "review": {
                "@type": "Review",
                "author": { "@type": "Organization", "name": "EligeTuHosting.cl" },
                "reviewRating": { "@type": "Rating", "ratingValue": 9.9, "bestRating": 10 }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": 9.9,
                "reviewCount": 815
              }
            }
          `}
        </script>
      </Helmet>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#F7F9FC] py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
            HostingPlus vs {competitor.name}: ¿Cuál te conviene en 2025?
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-[#555]">
            Comparamos en detalle los servicios de HostingPlus y {competitor.name} para ayudarte 
            a elegir el mejor hosting para tu sitio web en Chile.
          </p>
        </div>
      </section>
      
      {/* Comparison Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* HostingPlus Card */}
          <Card className="border-2 border-[#EF233C] shadow-xl p-6 min-h-[460px]">
            <div className="flex items-center justify-center h-24 mb-6">
              <img 
                src={hostingPlus?.logo} 
                alt="HostingPlus logo" 
                className="h-full object-contain"
                loading="lazy"
              />
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-center">HostingPlus</h2>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={2} className="text-center">Métricas clave</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Precio anual</TableCell>
                  <TableCell>
                    {formatPrice(hostingPlus?.plans?.[0]?.price || 3990)}
                    <div className="text-sm text-green-700">Incluye dominio .CL y creador web IA</div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Velocidad (GTmetrix)</TableCell>
                  <TableCell className="flex items-center">
                    9.9/10
                    <span className="ml-2 bg-green-100 text-green-700 px-2 rounded text-xs">✓ Superior</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Uptime</TableCell>
                  <TableCell className="flex items-center">
                    99.98%
                    <span className="ml-2 bg-green-100 text-green-700 px-2 rounded text-xs">✓ Superior</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Reclamos.cl</TableCell>
                  <TableCell className="flex items-center">
                    0
                    <span className="ml-2 bg-green-100 text-green-700 px-2 rounded text-xs">✓ Superior</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Soporte</TableCell>
                  <TableCell>24/7 en español</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Garantía</TableCell>
                  <TableCell>30 días</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
          
          {/* Competitor Card */}
          <Card className="border border-gray-200 p-6 min-h-[460px]">
            <div className="flex items-center justify-center h-24 mb-6">
              <img 
                src={competitor.logo} 
                alt={`${competitor.name} logo`} 
                className="h-full object-contain"
                loading="lazy"
              />
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-center">{competitor.name}</h2>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={2} className="text-center">Métricas clave</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Precio anual</TableCell>
                  <TableCell>
                    {formatPrice(competitor.plans?.[0]?.price || 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Velocidad (GTmetrix)</TableCell>
                  <TableCell>{competitor.rating ? (competitor.rating / 10).toFixed(1) : "8.0"}/10</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Uptime</TableCell>
                  <TableCell>99.9%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Reclamos.cl</TableCell>
                  <TableCell>
                    N/A
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Soporte</TableCell>
                  <TableCell>Horario laboral</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Garantía</TableCell>
                  <TableCell>15 días</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>
      
      {/* Pros & Contras */}
      <section className="container mx-auto px-4 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8 text-center">Pros y Contras</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* HostingPlus pros & cons */}
          <div>
            <h3 className="text-xl font-semibold mb-4">HostingPlus</h3>
            
            <h4 className="font-medium text-green-700 mb-2">Ventajas:</h4>
            <ul className="space-y-2 mb-6">
              {hostingPlusPros.map((pro, index) => (
                <li key={index} className="flex items-start">
                  <Check className="text-green-600 mr-2 shrink-0 mt-1" size={16} />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
            
            <h4 className="font-medium text-red-700 mb-2">Desventajas:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Minus className="text-red-600 mr-2 shrink-0 mt-1" size={16} />
                <span>Precio ligeramente superior a algunos competidores</span>
              </li>
            </ul>
          </div>
          
          {/* Competitor pros & cons */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{competitor.name}</h3>
            
            <h4 className="font-medium text-green-700 mb-2">Ventajas:</h4>
            <ul className="space-y-2 mb-6">
              {competitorPros.map((pro, index) => (
                <li key={index} className="flex items-start">
                  <Check className="text-green-600 mr-2 shrink-0 mt-1" size={16} />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
            
            <h4 className="font-medium text-red-700 mb-2">Desventajas:</h4>
            <ul className="space-y-2">
              {competitorCons.map((con, index) => (
                <li key={index} className="flex items-start">
                  <Minus className="text-red-600 mr-2 shrink-0 mt-1" size={16} />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      
      {/* CTA strip */}
      <section className="bg-[#EF233C] text-white py-12 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">¿Listo para el mejor hosting en Chile?</h2>
          <p className="mb-8 max-w-3xl mx-auto">
            Disfruta de la mejor velocidad, soporte técnico 24/7 y tecnología de última generación con HostingPlus.
            Además, obtén un dominio .CL gratis durante el primer año.
          </p>
          <Button 
            asChild
            className="bg-white text-[#EF233C] hover:bg-gray-100 px-8 py-6 text-lg font-medium"
          >
            <a 
              href={`https://www.hostingplus.cl/?utm_source=eligetuhosting&utm_medium=vs-page&utm_campaign=${slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Ver planes de HostingPlus
            </a>
          </Button>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Preguntas frecuentes</h2>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border p-4 rounded-lg">
                <AccordionTrigger className="text-lg font-medium text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-[#555]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default HostingVsPage;
