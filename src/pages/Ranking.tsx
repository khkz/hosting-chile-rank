import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  ShieldCheck, 
  Headphones, 
  Check, 
  X 
} from 'lucide-react';
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
import { FinalCTA } from '@/components/FinalCTA';
import BenefitCard from '@/components/BenefitCard';

// Datos de los proveedores de hosting
const hostingProviders = [
  {
    position: 1,
    name: 'HostingPlus',
    rating: 9.9,
    chileanIp: true,
    ipLocation: 'IP Santiago',
    security: 'LiteSpeed+BitNinja+JetBackup',
    support: '24/7 local',
    url: 'https://www.hostingplus.cl/',
    logo: '/logo-hostingplus-new.svg'
  },
  {
    position: 2,
    name: 'EcoHosting',
    rating: 9.6,
    chileanIp: true,
    ipLocation: 'IP Providencia',
    security: 'LiteSpeed+MagicSpam+JetBackup',
    support: '24/7 local',
    url: 'https://www.ecohosting.cl/',
    logo: '/logo-ecohosting-new.svg'
  },
  {
    position: 3,
    name: '1Hosting.cl',
    rating: 9.2,
    chileanIp: true,
    ipLocation: 'IP Las Condes',
    security: 'Backups RAID+SSL',
    support: 'Soporte Chile',
    url: 'https://1hosting.cl/',
    logo: '/logo-1hosting.svg'
  },
  {
    position: 4,
    name: 'HostGator',
    rating: 9.0,
    chileanIp: false,
    ipLocation: 'USA',
    security: 'CodeGuard (pago)',
    support: '24/7 EN/ES',
    url: 'https://www.hostgator.com/',
    logo: '/logo-hostgator.svg'
  },
  {
    position: 5,
    name: 'BlueHost',
    rating: 8.9,
    chileanIp: false,
    ipLocation: 'USA',
    security: 'SiteLock (pago)',
    support: '24/7 EN',
    url: 'https://www.bluehost.com/',
    logo: '/logo-bluehost.svg'
  },
  {
    position: 6,
    name: 'DonWeb',
    rating: 8.7,
    chileanIp: false,
    ipLocation: 'Argentina',
    security: 'CloudLinux+Backups diarios',
    support: 'Soporte LATAM',
    url: 'https://www.donweb.com/',
    logo: '/placeholder.svg'
  },
  {
    position: 7,
    name: 'GoDaddy',
    rating: 8.5,
    chileanIp: false,
    ipLocation: 'USA/EU',
    security: 'SiteBackup (pago)',
    support: '24/7 global',
    url: 'https://www.godaddy.com/',
    logo: '/logo-godaddy.svg'
  },
  {
    position: 8,
    name: 'SolucionHost',
    rating: 8.4,
    chileanIp: true,
    ipLocation: 'IP Santiago',
    security: 'SSL+Backups autom.',
    support: 'Soporte local',
    url: 'https://www.solucionhost.cl/',
    logo: '/placeholder.svg'
  },
  {
    position: 9,
    name: 'Hostinger',
    rating: 8.3,
    chileanIp: false,
    ipLocation: 'LT/USA',
    security: 'hPanel+LiteSpeed cache',
    support: '24/7 global',
    url: 'https://www.hostinger.com/',
    logo: '/placeholder.svg'
  }
];

const Ranking: React.FC = () => {
  const [showOnlyChileanIp, setShowOnlyChileanIp] = useState(false);
  
  // Filtrar los proveedores según la selección
  const filteredProviders = showOnlyChileanIp 
    ? hostingProviders.filter(provider => provider.chileanIp) 
    : hostingProviders;
  
  return (
    <>
      <Helmet>
        <title>Ranking hosting Chile 2025 — Soberanía digital e IP chilena</title>
        <meta 
          name="description" 
          content="Consulta el ranking completo de hosting con IP chilena y conoce por qué la soberanía digital favorece tu velocidad y seguridad." 
        />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": [
                ${hostingProviders.map((provider, index) => `
                  {
                    "@type": "ListItem",
                    "position": ${provider.position},
                    "item": {
                      "@type": "Product",
                      "name": "${provider.name}",
                      "url": "${provider.url}",
                      "sameAs": "${provider.url}",
                      "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "${provider.rating}",
                        "bestRating": "10",
                        "worstRating": "1",
                        "ratingCount": "1"
                      }
                    }
                  }${index < hostingProviders.length - 1 ? ',' : ''}
                `).join('')}
              ]
            }
          `}
        </script>
      </Helmet>

      {/* <!-- section Hero --> */}
      <section className="bg-[#2B2D42] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Ranking completo de hosting en Chile 2025</h1>
          <p className="text-xl mb-8">Comparamos velocidad, soporte, seguridad y soberanía digital</p>
          <Button 
            asChild
            className="bg-[#EF233C] hover:bg-[#b3001b] px-8 py-6 text-lg rounded-lg font-medium"
          >
            <Link to="/cotiza-tu-hosting">Cotiza tu hosting</Link>
          </Button>
        </div>
      </section>

      {/* <!-- section Tabla Ranking --> */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold mb-4 md:mb-0">Ranking 2025: Los mejores proveedores</h2>
            <div className="flex items-center">
              <label htmlFor="filter" className="mr-3 text-sm font-medium">Filtrar por:</label>
              <select 
                id="filter"
                className="border rounded-md p-2 bg-white"
                value={showOnlyChileanIp ? "chilean" : "all"}
                onChange={(e) => setShowOnlyChileanIp(e.target.value === "chilean")}
              >
                <option value="all">Todos los proveedores</option>
                <option value="chilean">Solo IP Chilena</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="table-auto w-full text-sm">
              <TableCaption>Actualizado: Mayo 2025</TableCaption>
              <TableHeader>
                <TableRow className="bg-[#F7F9FC]">
                  <TableHead className="w-12">Puesto</TableHead>
                  <TableHead className="w-36">Proveedor</TableHead>
                  <TableHead className="w-24">Puntaje</TableHead>
                  <TableHead className="w-28">
                    <div className="flex items-center">
                      <Globe className="mr-1 h-4 w-4" /> IP chilena
                    </div>
                  </TableHead>
                  <TableHead className="w-48">
                    <div className="flex items-center">
                      <ShieldCheck className="mr-1 h-4 w-4" /> Seguridad/Backups
                    </div>
                  </TableHead>
                  <TableHead className="w-28">
                    <div className="flex items-center">
                      <Headphones className="mr-1 h-4 w-4" /> Soporte
                    </div>
                  </TableHead>
                  <TableHead className="w-28 text-right">Visitar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.position} className="border-b hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${provider.position <= 3 ? 'bg-[#EF233C] text-white' : 'bg-gray-100'}`}>
                        {provider.position}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      <div className="flex items-center">
                        <img 
                          src={provider.logo} 
                          alt={provider.name}
                          className="h-6 mr-2"
                        />
                        {provider.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold">{provider.rating}</span> ★
                    </TableCell>
                    <TableCell>
                      {provider.chileanIp ? (
                        <span className="text-[#16a34a] font-semibold flex items-center">
                          <Check size={16} className="mr-1" /> Sí ({provider.ipLocation})
                        </span>
                      ) : (
                        <span className="text-[#dc2626] font-semibold flex items-center">
                          <X size={16} className="mr-1" /> No ({provider.ipLocation})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{provider.security}</TableCell>
                    <TableCell>{provider.support}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="border-[#2B2D42] hover:bg-[#2B2D42] hover:text-white"
                      >
                        <a href={provider.url} target="_blank" rel="noopener noreferrer">
                          Visitar sitio
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* <!-- section Soberanía Digital --> */}
      <section className="bg-[#F7F9FC] py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 text-center">¿Qué es la soberanía digital y por qué importa?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <BenefitCard 
              icon={Globe}
              title="SEO Local Mejorado" 
              description="Alojar en servidores chilenos mejora tu posicionamiento en búsquedas locales de Google.cl"
            />
            <BenefitCard 
              icon={ShieldCheck}
              title="Protección Legal" 
              description="Tus datos quedan protegidos bajo la Ley 19.628, fuera del alcance del CLOUD Act extranjero"
            />
            <BenefitCard 
              icon={Headphones}
              title="Baja Latencia" 
              description="Reduce la latencia a 5-8 ms, ofreciendo una experiencia más rápida a usuarios chilenos"
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm leading-relaxed">
              Alojar tu sitio en un datacenter chileno con IP geolocalizada mejora el SEO local, 
              reduce la latencia a 5-8 ms y mantiene tus datos bajo la Ley 19.628, fuera de legislaciones 
              extranjeras como el <em>CLOUD Act</em>. Los tres primeros proveedores de nuestro ranking 
              cumplen con esta exigencia, ofreciendo verdadera soberanía digital para tus proyectos web.
            </p>
          </div>
        </div>
      </section>

      {/* <!-- section FAQ --> */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Preguntas frecuentes</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                ¿Cómo verificamos la IP chilena?
              </AccordionTrigger>
              <AccordionContent>
                Para nuestro análisis utilizamos las bases de datos de geolocalización MaxMind GeoIP2 y realizamos 
                pruebas de traceroute desde Santiago para verificar la ruta y latencia. Adicionalmente, 
                confirmamos la ubicación física de los datacenters con cada proveedor.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                ¿Puedo migrar si mi hosting actual es extranjero?
              </AccordionTrigger>
              <AccordionContent>
                Sí, HostingPlus y EcoHosting ofrecen migración gratuita en menos de 24 horas. 
                El proceso es sencillo: contrata el nuevo plan, proporciona los accesos a tu hosting actual, 
                y ellos se encargan de todo el proceso de migración sin interrupciones ni pérdida de datos.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* <!-- section CTA Final --> */}
      <section className="bg-[#F7F9FC] py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-4">¿Listo para disfrutar de IP chilena y soporte local?</h3>
          <p className="mb-6">Migra gratis hoy mismo y mejora tu presencia digital.</p>
          <Button 
            asChild
            className="bg-[#EF233C] hover:bg-[#b3001b] px-8 py-3 rounded-lg font-medium"
          >
            <Link to="/cotiza-tu-hosting">Solicitar migración</Link>
          </Button>
        </div>
      </section>

      {/* <!-- analytics here --> */}
    </>
  );
};

export default Ranking;
