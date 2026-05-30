
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
import HostingSectionsNav from '../components/HostingSectionsNav';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '../hooks/use-mobile';
import HostingProviderCard from '../components/HostingProviderCard';
import { Check, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HostingProvider {
  id: string;
  name: string;
  logo: string;
  asn: string;
  datacenter: string;
  backups: string;
  reclamos: string;
  hasLiteSpeed: boolean;
  hasWAF: boolean;
  hasBackups: boolean;
  priceLabel: string;
  priceCLP: number | null; // anual CLP, null si "Consultar"
  reseñaUrl: string;
}

// Orden y datos tomados del Estudio Hosting Chile 2026 (v3.0, 28-may-2026)
const hostingProviders: HostingProvider[] = [
  {
    id: 'hostingplus',
    name: 'HostingPlus.cl',
    logo: '/logo-hostingplus-official.png',
    asn: 'AS266879',
    datacenter: 'Propio · Santiago',
    backups: 'Diarios (JetBackup)',
    reclamos: '0 visibles',
    hasLiteSpeed: true,
    hasWAF: true,
    hasBackups: true,
    priceLabel: '$49.900/año',
    priceCLP: 49900,
    reseñaUrl: '/reseñas/hostingplus',
  },
  {
    id: 'ecohosting',
    name: 'EcoHosting.cl',
    logo: '/logo-ecohosting.png',
    asn: 'AS266855',
    datacenter: 'Propio · Chile',
    backups: 'RAID 10 SSD',
    reclamos: '0 en reclamos.cl',
    hasLiteSpeed: false,
    hasWAF: true,
    hasBackups: true,
    priceLabel: '$19.900/año',
    priceCLP: 19900,
    reseñaUrl: '/reseñas/ecohosting',
  },
  {
    id: 'powerhost',
    name: 'PowerHost / IxMetro',
    logo: 'https://logo.clearbit.com/powerhost.cl',
    asn: 'AS263237',
    datacenter: '4 DC propios (SCL, NY, MOW, AMS)',
    backups: 'Tier III',
    reclamos: '1 no-técnico',
    hasLiteSpeed: false,
    hasWAF: true,
    hasBackups: true,
    priceLabel: 'Consultar',
    priceCLP: null,
    reseñaUrl: '/estudio-hosting-chile-2026#powerhost',
  },
  {
    id: 'hostname',
    name: 'Hostname.cl',
    logo: '/logo-hostname.png',
    asn: 'AS262256',
    datacenter: 'HN DC · Ñuñoa',
    backups: 'Sí',
    reclamos: 'Perfil bajo',
    hasLiteSpeed: false,
    hasWAF: true,
    hasBackups: true,
    priceLabel: 'Consultar',
    priceCLP: null,
    reseñaUrl: '/reseñas/hostname',
  },
  {
    id: 'hostingcl',
    name: 'Hosting.cl',
    logo: 'https://logo.clearbit.com/hosting.cl',
    asn: 'AS265839',
    datacenter: 'Propio · Santiago',
    backups: 'Sí',
    reclamos: 'Varios 2012-2025',
    hasLiteSpeed: true,
    hasWAF: true,
    hasBackups: true,
    priceLabel: 'Consultar',
    priceCLP: null,
    reseñaUrl: '/estudio-hosting-chile-2026#hostingcl',
  },
  {
    id: 'bluehosting',
    name: 'BlueHosting.cl',
    logo: 'https://logo.clearbit.com/bluehosting.cl',
    asn: 'AS64111',
    datacenter: 'Haulmer · Curicó',
    backups: 'Sí',
    reclamos: 'Mixto',
    hasLiteSpeed: false,
    hasWAF: true,
    hasBackups: true,
    priceLabel: '$43.900/año',
    priceCLP: 43900,
    reseñaUrl: '/estudio-hosting-chile-2026#bluehosting',
  },
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
    if (filters.lowPrice && (provider.priceCLP === null || provider.priceCLP > 30000)) return false;
    return true;
  });

  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const resetFilters = () => {
    setFilters({ liteSpeed: false, waf: false, backups: false, lowPrice: false });
  };

  const anyFilterActive = Object.values(filters).some(Boolean);

  return (
    <>
      <DynamicMetaTags
        title="Comparativa Hosting Chile 2026"
        description="Comparativa de hosting en Chile basada en el Estudio Hosting Chile 2026: ASN, datacenter, backups, reclamos y tecnologías verificables."
      />
      <Helmet>
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
      <HostingSectionsNav />

      {/* Hero */}
      <section className="bg-[#F7F9FC] py-8 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2B2D42]">
            Comparativa Hosting Chile 2026
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#555] max-w-2xl mx-auto">
            Orden y datos basados en el{' '}
            <a href="/estudio-hosting-chile-2026" className="text-[#EF233C] underline">
              Estudio Hosting Chile 2026
            </a>
            . Solo información verificable: ASN, datacenter, reclamos públicos y tecnologías.
          </p>
        </div>
      </section>

      {/* Filters */}
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
                <Checkbox id="litespeed" checked={filters.liteSpeed} onCheckedChange={() => handleFilterChange('liteSpeed')} />
                <Label htmlFor="litespeed" className="cursor-pointer">LiteSpeed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="waf" checked={filters.waf} onCheckedChange={() => handleFilterChange('waf')} />
                <Label htmlFor="waf" className="cursor-pointer">WAF (Firewall)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="backups" checked={filters.backups} onCheckedChange={() => handleFilterChange('backups')} />
                <Label htmlFor="backups" className="cursor-pointer">Backups diarios</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="price" checked={filters.lowPrice} onCheckedChange={() => handleFilterChange('lowPrice')} />
                <Label htmlFor="price" className="cursor-pointer">Precio menor a $30.000/año</Label>
              </div>
              {anyFilterActive && (
                <button onClick={resetFilters} className="text-[#EF233C] underline text-sm hover:text-red-700">
                  Quitar filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Table / Cards */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {isMobile ? (
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
                  <button onClick={resetFilters} className="text-[#EF233C] underline hover:text-red-700">
                    Quitar todos los filtros
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableCaption>
                  Datos del Estudio Hosting Chile 2026 (v3.0, 28-may-2026).
                </TableCaption>
                <TableHeader className="bg-[#F7F9FC]">
                  <TableRow className="border-b-2 border-gray-300">
                    <TableHead className="w-[200px] font-semibold">Proveedor</TableHead>
                    <TableHead className="w-[110px] font-semibold">ASN</TableHead>
                    <TableHead className="w-[200px] font-semibold">Datacenter</TableHead>
                    <TableHead className="w-[140px] font-semibold">Backups</TableHead>
                    <TableHead className="w-[150px] font-semibold">Reclamos</TableHead>
                    <TableHead className="text-right font-semibold w-[120px]">Precio</TableHead>
                    <TableHead className="w-[140px] font-semibold">Tecnologías</TableHead>
                    <TableHead className="w-[110px] font-semibold text-center">Acción</TableHead>
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
                                onError={(e) => {
                                  // Fallback cuando Clearbit u otro CDN externo falla.
                                  const img = e.currentTarget;
                                  if (img.dataset.fallback) return;
                                  img.dataset.fallback = '1';
                                  img.src =
                                    'data:image/svg+xml;utf8,' +
                                    encodeURIComponent(
                                      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="6" fill="#e5e7eb"/><text x="50%" y="55%" font-family="sans-serif" font-size="14" font-weight="700" fill="#374151" text-anchor="middle">${(provider.name || '?').slice(0, 2).toUpperCase()}</text></svg>`
                                    );
                                }}
                              />
                            </div>
                            <span>
                              <span className="text-gray-400 mr-1">#{index + 1}</span>
                              {provider.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{provider.asn}</TableCell>
                        <TableCell className="text-sm">{provider.datacenter}</TableCell>
                        <TableCell>{provider.backups}</TableCell>
                        <TableCell>{provider.reclamos}</TableCell>
                        <TableCell className="text-right font-medium">{provider.priceLabel}</TableCell>
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
                            Ver ficha
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No hay resultados que coincidan con los filtros seleccionados.
                        <br />
                        <button onClick={resetFilters} className="mt-2 text-[#EF233C] underline">
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

      {/* Recommendation */}
      <section className="py-12 bg-[#F7F9FC]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Por qué HostingPlus encabeza el ranking?</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Según el Estudio Hosting Chile 2026, HostingPlus cumple los cuatro criterios
            duros: ASN propio (AS266879), RUT vigente, más de 20 años de operación continua
            y cero reclamos visibles en fuentes públicas. Por eso ocupa la primera posición
            en la comparativa.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/estudio-hosting-chile-2026"
              className="inline-block bg-white border border-[#EF233C] text-[#EF233C] px-6 py-3 rounded-lg hover:bg-[#EF233C] hover:text-white transition-colors"
            >
              Ver el estudio completo
            </a>
            <a
              href="https://www.hostingplus.cl/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#EF233C] text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Visitar HostingPlus
            </a>
          </div>
        </div>
      </section>

      <StickyCTA />
      <Footer />
    </>
  );
};

export default ComparativaPage;
