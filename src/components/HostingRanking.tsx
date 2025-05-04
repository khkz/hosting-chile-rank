
import React from 'react';
import HostingCard, { HostingInfo } from './HostingCard';

const hostingProviders: HostingInfo[] = [
  {
    position: 1,
    name: "HostingPlus",
    domain: "hostingplus.cl",
    slug: "hostingplus",
    rating: 9.9,
    features: [
      "Datacenter propio en Santiago (IP CL)",
      "LiteSpeed Enterprise + BitNinja + JetBackup",
      "0 reclamos en Reclamos.cl (2020-2025)",
      "Soporte 24/7 y creador web IA gratis"
    ]
  },
  {
    position: 2,
    name: "EcoHosting",
    domain: "ecohosting.cl",
    slug: "ecohosting",
    rating: 9.6,
    features: [
      "Servidores en Chile, energía 100% renovable",
      "MagicSpam y backups JetBackup incluidos",
      "Soporte local 24/7",
      "Dominio .CL gratis 1 año"
    ]
  },
  {
    position: 3,
    name: "1Hosting",
    domain: "1hosting.cl",
    slug: "1hosting",
    rating: 9.2,
    features: [
      "12 años de experiencia, 30.000 sitios",
      "Almacenamiento NVMe y SSL gratis",
      "Backups RAID diarios",
      "Creador web fácil de usar"
    ]
  },
  {
    position: 4,
    name: "Hosting.cl",
    domain: "hosting.cl",
    slug: "hostingcl",
    rating: 9.0,
    features: [
      "Servidores en Chile",
      "Panel de control intuitivo",
      "Soporte técnico por teléfono",
      "SSL gratis en todos los planes"
    ]
  },
  {
    position: 5,
    name: "PlanetaHosting",
    domain: "planetahosting.cl",
    slug: "planetahosting",
    rating: 8.7,
    features: [
      "25 años de experiencia en el mercado",
      "Data centers en Santiago y USA",
      "Planes específicos para WordPress",
      "Respaldo diario de datos"
    ]
  },
  {
    position: 6,
    name: "NinjaHosting",
    domain: "ninjahosting.cl",
    slug: "ninjahosting",
    rating: 8.3,
    features: [
      "Planes económicos para emprendedores",
      "Optimizado para WordPress y WooCommerce",
      "Migración gratuita de sitios web",
      "Certificado SSL incluido"
    ]
  }
];

const HostingRanking = () => {
  return (
    <section className="py-12 bg-white" id="ranking">
      {/* <!-- section 2: Ranking Cards --> */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-primary">
          Ranking de Hosting en Chile (2025)
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {hostingProviders.map(provider => (
            <HostingCard key={provider.slug} hosting={provider} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostingRanking;
