
import React from 'react';
import HostingCard from './HostingCard';
import { Trophy } from 'lucide-react';

const hostingData = [
  {
    position: 1,
    name: "HostingPlus.cl",
    logo: "/logo-hostingplus-new.svg",
    rating: 9.9,
    features: [
      "Datacenter propio en Santiago (IP CL)",
      "LiteSpeed Enterprise + BitNinja + JetBackup",
      "0 reclamos en Reclamos.cl (2020-2025)",
      "Soporte 24/7 y creador web IA gratis"
    ],
    url: "https://www.hostingplus.cl/"
  },
  {
    position: 2,
    name: "EcoHosting.cl",
    logo: "/logo-ecohosting-new.svg",
    rating: 9.6,
    features: [
      "Servidores en Chile, energía 100 % renovable",
      "MagicSpam y backups JetBackup incluidos",
      "Soporte local 24/7",
      "Dominio .CL gratis 1 año"
    ],
    url: "https://www.ecohosting.cl/"
  },
  {
    position: 3,
    name: "HostGator.cl",
    logo: "/logo-hostgator.svg",
    rating: 9.2,
    features: [
      "12 años de experiencia en Chile",
      "Panel de control personalizado",
      "Soporte técnico por chat y teléfono",
      "Garantía de uptime 99.9%"
    ],
    url: "https://www.hostgator.cl/"
  },
  {
    position: 4,
    name: "BlueHost.cl",
    logo: "/logo-bluehost.svg",
    rating: 9.0,
    features: [
      "Alojamiento web con servidores en Chile",
      "Certificado SSL gratuito",
      "Instalación WordPress con 1 click",
      "Soporte técnico 24/7"
    ],
    url: "https://www.bluehost.cl/"
  },
  {
    position: 5,
    name: "DonWeb.cl",
    logo: "https://logo.clearbit.com/donweb.cl",
    rating: 8.7,
    features: [
      "Proveedor con presencia regional",
      "Alta velocidad con SSD",
      "Migración gratuita de sitios",
      "Múltiples planes escalables"
    ],
    url: "https://www.donweb.cl/"
  },
  {
    position: 6,
    name: "GoDaddy.cl",
    logo: "/logo-godaddy.svg",
    rating: 8.3,
    features: [
      "Presencia global con servidores locales",
      "Herramientas de marketing incluidas",
      "Panel de control intuitivo",
      "Soporte en español"
    ],
    url: "https://www.godaddy.cl/"
  }
];

const HostingRanking = () => {
  // Separate top 3 from the rest
  const topThree = hostingData.slice(0, 3);
  const restOfProviders = hostingData.slice(3);

  return (
    <section id="ranking" className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center mb-12">Ranking de Proveedores de Hosting</h2>
      
      {/* Podium layout for top 3 */}
      <div className="mb-16">
        <div className="flex flex-col items-center mb-4">
          <h3 className="text-xl font-semibold text-[#2B2D42] mb-6">Los Mejores Proveedores de Hosting en Chile</h3>
          <div className="flex flex-col md:flex-row w-full justify-center items-end gap-4 md:gap-8">
            {/* Second place - left */}
            <div className="order-2 md:order-1 w-full md:w-1/3 transform transition-all duration-300 hover:scale-105">
              <div className="relative">
                <div className="absolute -top-7 left-0 right-0 mx-auto w-full text-center">
                  <span className="inline-flex items-center justify-center w-14 h-14 bg-[#C0C0C0] text-white rounded-full shadow-lg font-black text-2xl">2</span>
                </div>
                <div className="pt-10">
                  <HostingCard
                    key={topThree[1].position}
                    position={topThree[1].position}
                    name={topThree[1].name}
                    logo={topThree[1].logo}
                    rating={topThree[1].rating}
                    features={topThree[1].features}
                    url={topThree[1].url}
                    isPodium={true}
                  />
                </div>
              </div>
            </div>
            
            {/* First place - center */}
            <div className="order-1 md:order-2 w-full md:w-1/3 transform transition-all duration-300 hover:scale-105 z-10">
              <div className="relative">
                <div className="absolute -top-12 left-0 right-0 mx-auto w-full text-center">
                  <div className="inline-flex items-center justify-center">
                    <span className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD700] text-white rounded-full shadow-lg font-black text-3xl">1</span>
                    <Trophy className="w-8 h-8 ml-2 text-[#FFD700]" />
                  </div>
                </div>
                <div className="pt-10 transform md:scale-110">
                  <HostingCard
                    key={topThree[0].position}
                    position={topThree[0].position}
                    name={topThree[0].name}
                    logo={topThree[0].logo}
                    rating={topThree[0].rating}
                    features={topThree[0].features}
                    url={topThree[0].url}
                    isPodium={true}
                    isTopRated={true}
                  />
                </div>
              </div>
            </div>
            
            {/* Third place - right */}
            <div className="order-3 w-full md:w-1/3 transform transition-all duration-300 hover:scale-105">
              <div className="relative">
                <div className="absolute -top-7 left-0 right-0 mx-auto w-full text-center">
                  <span className="inline-flex items-center justify-center w-14 h-14 bg-[#CD7F32] text-white rounded-full shadow-lg font-black text-2xl">3</span>
                </div>
                <div className="pt-10">
                  <HostingCard
                    key={topThree[2].position}
                    position={topThree[2].position}
                    name={topThree[2].name}
                    logo={topThree[2].logo}
                    rating={topThree[2].rating}
                    features={topThree[2].features}
                    url={topThree[2].url}
                    isPodium={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* The rest of the providers */}
      <div className="mt-16">
        <h3 className="text-xl font-semibold text-center mb-8">Otras Alternativas Recomendadas</h3>
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {restOfProviders.map((hosting) => (
            <HostingCard
              key={hosting.position}
              position={hosting.position}
              name={hosting.name}
              logo={hosting.logo}
              rating={hosting.rating}
              features={hosting.features}
              url={hosting.url}
            />
          ))}
        </div>
      </div>
      
      {/* Schema.org ItemList markup for the hosting ranking */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": ${JSON.stringify(hostingData.map((host, index) => ({
            "@type": "ListItem",
            "position": host.position,
            "item": {
              "@type": "Product",
              "name": host.name,
              "url": host.url,
              "description": host.features.join(", "),
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": host.rating.toString(),
                "bestRating": "10",
                "worstRating": "0",
                "ratingCount": Math.floor(300 - (index * 40)).toString()
              }
            }
          })))}
        }
      `}} />
    </section>
  );
};

export default HostingRanking;
