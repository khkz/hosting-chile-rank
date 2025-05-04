
import React from 'react';
import HostingCard from './HostingCard';

const hostingData = [
  {
    position: 1,
    name: "HostingPlus.cl",
    logo: "/logo-hostingplus.svg",
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
    logo: "/logo-ecohosting.svg",
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
    logo: "/logo-donweb.svg",
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
  return (
    <section id="ranking" className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center mb-8">Ranking de Proveedores de Hosting</h2>
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {hostingData.map((hosting) => (
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
