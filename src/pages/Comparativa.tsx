
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
import { useIsMobile } from '../hooks/use-mobile';
import HostingProviderCard from '../components/HostingProviderCard';
import { Check, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    name: 'HostingPlus.cl',
    logo: '/lovable-uploads/528891ff-3b55-486e-a927-e4f6d373a3c5.png',
    velocidad: '9.9/10',
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
    name: 'EcoHosting.cl',
    logo: '/logo-ecohosting.png',
    velocidad: '9.6/10',
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
    id: 'hostgator',
    name: 'HostGator.cl',
    logo: 'https://logo.clearbit.com/hostgator.cl',
    velocidad: '9.2/10',
    seguridad: '9.0/10',
    backups: 'Diarios (RAID)',
    reclamos: '5 en 5 años',
    hasLiteSpeed: false,
    hasWAF: true,
    hasBackups: true,
    price: 3490,
    reseñaUrl: '/reseñas/hostgator'
  },
  {
    id: 'hostname',
    name: 'HN.cl',
    logo: '/logo-hostname.png',
    velocidad: '9.2/10',
    seguridad: '9.1/10',
    backups: 'Diarios',
    reclamos: '3 en 5 años',
    hasLiteSpeed: false,
    hasWAF: true,
    hasBackups: true,
    price: 4990,
    reseñaUrl: '/reseñas/hostname'
  },
  {
    id: 'donweb',
    name: 'DonWeb.cl',
    logo: 'https://logo.clearbit.com/donweb.cl',
    velocidad: '8.7/10',
    seguridad: '8.6/10',
    backups: 'Semanales',
    reclamos: '12 en 5 años',
    hasLiteSpeed: false,
    hasWAF: true,
    hasBackups: true,
    price: 4490,
    reseñaUrl: '/reseñas/donweb'
  },
  {
    id: 'godaddy',
    name: 'GoDaddy.cl',
    logo: '/logo-godaddy.svg',
    velocidad: '8.3/10',
    seguridad: '8.5/10',
    backups: 'Mensuales',
    reclamos: '15 en 5 años',
    hasLiteSpeed: false,
    hasWAF: false,
    hasBackups: true,
    price: 3990,
    reseñaUrl: '/reseñas/godaddy'
  }
];

const ComparativaPage = () => {
  const [filters, setFilters] = useState({
    liteSpeed: false,
    waf: false,
    backups: false,
    lowPrice: false,
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  const isMobile = useIsMobile();
  
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
  
  const resetFilters = () => {
    setFilters({
      liteSpeed: false,
      waf: false,
      backups: false,
      lowPrice: false,
    });
  };

  const anyFilterActive = Object.values(filters).some(Boolean);

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
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filtra por características</h2>
            <Button 
              variant="outline"
              size="sm"
              className={`md:hidden flex items-center gap-2 ${anyFilterActive ? 'bg-[#EDF2F4] border-[#EF233C] text-[#EF233C]' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} /> 
              {anyFilterActive ? `Filtros (${Object.values(filters).filter(Boolean).length})` : 'Filtros'}
            </Button>
          </div>
          
          <div className={`${isMobile && !showFilters ? 'hidden' : 'block'}`}>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="litespeed"
                  checked={filters.liteSpeed}
                  onCheckedChange={() => handleFilterChange('liteSpeed')}
                />
                <Label htmlFor="litespeed" className="cursor-pointer">LiteSpeed</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="waf"
                  checked={filters.waf}
                  onCheckedChange={() => handleFilterChange('waf')}
                />
                <Label htmlFor="waf" className="cursor-pointer">WAF (Firewall)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="backups"
                  checked={filters.backups}
                  onCheckedChange={() => handleFilterChange('backups')}
                />
                <Label htmlFor="backups" className="cursor-pointer">Backups diarios</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="price"
                  checked={filters.lowPrice}
                  onCheckedChange={() => handleFilterChange('lowPrice')}
                />
                <Label htmlFor="price" className="cursor-pointer">Precio menor a $4.000</Label>
              </div>
              
              {anyFilterActive && (
                <button 
                  onClick={resetFilters}
                  className="text-[#EF233C] underline text-sm hover:text-red-700"
                >
                  Quitar filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* section 3: Comparison Table/Cards */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {isMobile ? (
            // Mobile Card View
            <div>
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <HostingProviderCard 
                    key={provider.id}
                    provider={provider}
                    isHighlighted={provider.id === 'hostingplus'}
                  />
                ))
              ) : (
                <div className="text-center p-8 bg-[#F7F9FC] rounded-lg shadow-sm">
                  <p className="mb-4">No hay resultados que coincidan con los filtros seleccionados.</p>
                  <button 
                    onClick={resetFilters}
                    className="text-[#EF233C] underline hover:text-red-700"
                  >
                    Quitar todos los filtros
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Desktop Table View
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableCaption>Datos actualizados en Mayo 2025</TableCaption>
                <TableHeader className="bg-[#F7F9FC]">
                  <TableRow className="border-b-2 border-gray-300">
                    <TableHead className="w-[180px] font-semibold">Proveedor</TableHead>
                    <TableHead className="text-right font-semibold w-[100px]">Velocidad</TableHead>
                    <TableHead className="text-right font-semibold w-[100px]">Seguridad</TableHead>
                    <TableHead className="w-[150px] font-semibold">Backups</TableHead>
                    <TableHead className="w-[120px] font-semibold">Reclamos</TableHead>
                    <TableHead className="text-right font-semibold w-[100px]">Precio</TableHead>
                    <TableHead className="w-[120px] font-semibold">Tecnologías</TableHead>
                    <TableHead className="w-[100px] font-semibold text-center">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.length > 0 ? (
                    filteredProviders.map((provider, index) => (
                      <TableRow 
                        key={provider.id}
                        className={`
                          ${provider.id === 'hostingplus' ? 'bg-[#EDF2F4] hover:bg-[#EDF2F4]' : ''}
                          ${provider.id === 'hostingplus' ? 'border border-[#EF233C]' : ''}
                          ${index % 2 === 0 && provider.id !== 'hostingplus' ? 'bg-white' : ''}
                          ${index % 2 === 1 && provider.id !== 'hostingplus' ? 'bg-gray-50' : ''}
                        `}
                      >
                        <TableCell className="font-medium sticky left-0 z-10 bg-inherit">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-10 flex items-center justify-center bg-white rounded p-1 border">
                              <img 
                                src={provider.logo} 
                                alt={provider.name} 
                                className="max-h-full max-w-full object-contain" 
                                loading="lazy" 
                              />
                            </div>
                            <span>{provider.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{provider.velocidad}</TableCell>
                        <TableCell className="text-right font-medium">{provider.seguridad}</TableCell>
                        <TableCell>{provider.backups}</TableCell>
                        <TableCell>{provider.reclamos}</TableCell>
                        <TableCell className="text-right font-medium">${provider.price.toLocaleString()}/mes</TableCell>
                        <TableCell>
                          <div className="flex gap-3">
                            <div className="flex items-center gap-1">
                              {provider.hasLiteSpeed ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <X size={16} className="text-red-500" />
                              )}
                              <span className="text-xs">LiteSpeed</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {provider.hasWAF ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <X size={16} className="text-red-500" />
                              )}
                              <span className="text-xs">WAF</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <a 
                            href={provider.reseñaUrl} 
                            className="inline-block px-3 py-1 bg-white border border-[#EF233C] text-[#EF233C] rounded hover:bg-[#EF233C] hover:text-white transition-colors text-sm"
                          >
                            Ver reseña
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No hay resultados que coincidan con los filtros seleccionados.
                        <br />
                        <button 
                          onClick={resetFilters}
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
          )}
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
    </>
  );
};

export default ComparativaPage;
