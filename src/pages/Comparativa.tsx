
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StickyCTA from '../components/StickyCTA';
import { Helmet } from 'react-helmet';

interface HostingProvider {
  id: string;
  name: string;
  logo: string;
  velocidad: string;
  seguridad: string;
  backups: string;
  reclamos: string;
  hasLiteSpeed: boolean;
  hasWAF: boolean;
  hasBackups: boolean;
  price: number;
  reseñaUrl: string;
}

const hostingProviders: HostingProvider[] = [
  {
    id: 'hostingplus',
    name: 'HostingPlus',
    logo: '/logo-hostingplus.svg',
    velocidad: '9.8/10',
    seguridad: '9.9/10',
    backups: 'Diarios (JetBackup)',
    reclamos: '0 en 5 años',
    hasLiteSpeed: true,
    hasWAF: true,
    hasBackups: true,
    price: 3990,
    reseñaUrl: '/reseñas/hostingplus'
  },
  {
    id: 'ecohosting',
    name: 'EcoHosting',
    logo: '/logo-ecohosting.svg',
    velocidad: '9.5/10',
    seguridad: '9.7/10',
    backups: 'Diarios (JetBackup)',
    reclamos: '2 en 5 años',
    hasLiteSpeed: true,
    hasWAF: true,
    hasBackups: true,
    price: 4990,
    reseñaUrl: '/reseñas/ecohosting'
  },
  {
    id: '1hosting',
    name: '1Hosting',
    logo: '/logo-1hosting.svg',
    velocidad: '9.0/10',
    seguridad: '8.8/10',
    backups: 'Diarios (RAID)',
    reclamos: '5 en 5 años',
    hasLiteSpeed: false,
    hasWAF: true,
    hasBackups: true,
    price: 3490,
    reseñaUrl: '/reseñas/1hosting'
  },
  {
    id: 'hostingcl',
    name: 'Hosting.cl',
    logo: '/logo-hostingcl.svg',
    velocidad: '8.7/10',
    seguridad: '8.9/10',
    backups: 'Semanales',
    reclamos: '8 en 5 años',
    hasLiteSpeed: false,
    hasWAF: true,
    hasBackups: true,
    price: 5990,
    reseñaUrl: '/reseñas/hostingcl'
  },
  {
    id: 'planetahosting',
    name: 'PlanetaHosting',
    logo: '/logo-planetahosting.svg',
    velocidad: '8.5/10',
    seguridad: '8.6/10',
    backups: 'Semanales',
    reclamos: '12 en 5 años',
    hasLiteSpeed: false,
    hasWAF: true,
    hasBackups: true,
    price: 4490,
    reseñaUrl: '/reseñas/planetahosting'
  },
  {
    id: 'ninjahosting',
    name: 'NinjaHosting',
    logo: '/logo-ninjahosting.svg',
    velocidad: '8.3/10',
    seguridad: '8.5/10',
    backups: 'Mensuales',
    reclamos: '7 en 5 años',
    hasLiteSpeed: false,
    hasWAF: false,
    hasBackups: true,
    price: 3990,
    reseñaUrl: '/reseñas/ninjahosting'
  }
];

const ComparativaPage = () => {
  const [filters, setFilters] = useState({
    liteSpeed: false,
    waf: false,
    backups: false,
    lowPrice: false,
  });
  
  const filteredProviders = hostingProviders.filter((provider) => {
    if (filters.liteSpeed && !provider.hasLiteSpeed) return false;
    if (filters.waf && !provider.hasWAF) return false;
    if (filters.backups && !provider.hasBackups) return false;
    if (filters.lowPrice && provider.price > 4000) return false;
    return true;
  });

  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  return (
    <>
      <Helmet>
        <title>Comparativa Hosting Chile 2025 | eligetuhosting.cl</title>
        <meta 
          name="description" 
          content="Compara lado a lado los mejores servicios de hosting en Chile: velocidad, seguridad, backups y servicio al cliente. Datos actualizados 2025." 
        />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": [
                ${hostingProviders.map((provider, index) => `{
                  "@type": "ListItem",
                  "position": ${index + 1},
                  "name": "${provider.name}",
                  "url": "https://eligetuhosting.cl${provider.reseñaUrl}"
                }`).join(',')}
              ]
            }
          `}
        </script>
      </Helmet>
    
      <Navbar />
      
      {/* section 1: Hero */}
      <section className="bg-[#F7F9FC] py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42]">Comparativa Hosting Chile 2025</h1>
          <p className="mt-4 text-lg text-[#555] max-w-2xl mx-auto">
            Analiza y compara lado a lado los mejores proveedores de hosting en Chile.
            Filtra por características y encuentra el ideal para tu sitio web.
          </p>
        </div>
      </section>
      
      {/* section 2: Filters */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Filtra por características</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="litespeed"
                checked={filters.liteSpeed}
                onCheckedChange={() => handleFilterChange('liteSpeed')}
              />
              <Label htmlFor="litespeed">LiteSpeed</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="waf"
                checked={filters.waf}
                onCheckedChange={() => handleFilterChange('waf')}
              />
              <Label htmlFor="waf">WAF (Firewall)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="backups"
                checked={filters.backups}
                onCheckedChange={() => handleFilterChange('backups')}
              />
              <Label htmlFor="backups">Backups diarios</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="price"
                checked={filters.lowPrice}
                onCheckedChange={() => handleFilterChange('lowPrice')}
              />
              <Label htmlFor="price">Precio menor a $4.000</Label>
            </div>
          </div>
        </div>
      </section>
      
      {/* section 3: Comparison Table */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 overflow-x-auto">
          <Table>
            <TableCaption>Datos actualizados en Mayo 2025</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Proveedor</TableHead>
                <TableHead>Velocidad</TableHead>
                <TableHead>Seguridad</TableHead>
                <TableHead>Backups</TableHead>
                <TableHead>Reclamos</TableHead>
                <TableHead>Reseña</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <TableRow 
                    key={provider.id}
                    className={provider.id === 'hostingplus' ? 'bg-[#EDF2F4] border border-[#EF233C]' : ''}
                  >
                    <TableCell className="font-medium sticky left-0 bg-white z-10">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={provider.logo} 
                          alt={provider.name} 
                          className="h-8" 
                          loading="lazy" 
                        />
                        <span>{provider.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{provider.velocidad}</TableCell>
                    <TableCell>{provider.seguridad}</TableCell>
                    <TableCell>{provider.backups}</TableCell>
                    <TableCell>{provider.reclamos}</TableCell>
                    <TableCell>
                      <a 
                        href={provider.reseñaUrl} 
                        className="text-[#EF233C] underline hover:text-red-700"
                      >
                        Ver reseña
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No hay resultados que coincidan con los filtros seleccionados.
                    <br />
                    <button 
                      onClick={() => setFilters({liteSpeed: false, waf: false, backups: false, lowPrice: false})}
                      className="mt-2 text-[#EF233C] underline"
                    >
                      Quitar todos los filtros
                    </button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* section 4: Recommendation */}
      <section className="py-12 bg-[#F7F9FC]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Por qué HostingPlus es nuestra recomendación principal?</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Al combinar velocidad superior con seguridad de primer nivel y un soporte técnico excepcional,
            HostingPlus ofrece la mejor experiencia general de hosting para sitios web chilenos.
            Su datacenter local en Santiago garantiza la mejor latencia posible.
          </p>
          <a 
            href="https://www.hostingplus.cl/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-[#EF233C] text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Visitar HostingPlus
          </a>
        </div>
      </section>

      <StickyCTA />
      <Footer />

      {/* GA4 placeholder */}
      {/* GA4 aquí */}
    </>
  );
};

export default ComparativaPage;
