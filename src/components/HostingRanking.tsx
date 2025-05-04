
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
    name: "1Hosting.cl",
    logo: "/logo-1hosting.svg",
    rating: 9.2,
    features: [
      "12 años de experiencia, 30 000 sitios",
      "Almacenamiento NVMe y SSL gratis",
      "Backups RAID diarios",
      "Creador web fácil de usar"
    ],
    url: "https://www.1hosting.cl/"
  },
  {
    position: 4,
    name: "Hosting.cl",
    logo: "/logo-hostingcl.svg",
    rating: 9.0,
    features: [
      "Alojamiento web en Chile",
      "Certificado SSL gratis",
      "Panel de control intuitivo",
      "Asistencia técnica local"
    ],
    url: "https://www.hosting.cl/"
  },
  {
    position: 5,
    name: "PlanetaHosting.cl",
    logo: "/logo-planetahosting.svg",
    rating: 8.7,
    features: [
      "Soluciones de hosting en Chile",
      "Respaldos automáticos",
      "Soporte técnico 24/7",
      "Migración gratuita"
    ],
    url: "https://www.planetahosting.cl/"
  },
  {
    position: 6,
    name: "NinjaHosting.cl",
    logo: "/logo-ninjahosting.svg",
    rating: 8.3,
    features: [
      "Hosting optimizado para WordPress",
      "Protección anti-malware",
      "Servidor CDN incluido",
      "Configuración asistida"
    ],
    url: "https://www.ninjahosting.cl/"
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
    </section>
  );
};

export default HostingRanking;
