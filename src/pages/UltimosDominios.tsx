import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Search, RefreshCw, AlertCircle, Calendar, Server, Cpu, Shield, House, Clock, ExternalLink, Copy, Check, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import UltimasBusquedas from '@/components/UltimasBusquedas';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import DomainAnalysisSearch from '@/components/DomainAnalysisSearch';
import DomainListFilter from '@/components/DomainListFilter';

// Fallback domains for when API is not available
const fallbackDomains = [{
  d: "ejemplo-dominio-cl.cl",
  date: "2025-05-05T12:00:00Z"
}, {
  d: "nuevodominio2025.cl",
  date: "2025-05-05T11:30:00Z"
}, {
  d: "tiendaonlinechile.cl",
  date: "2025-05-04T15:45:00Z"
}];

interface Domain {
  d: string;
  date: string;
}

interface ApiResponse {
  updated: string;
  domains: Domain[];
}

const UltimosDominios = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [domainsPerPage] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if domain is "new" (registered in last hour)
  const isNewDomain = (dateString: string) => {
    const domainDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - domainDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours <= 1;
  };

  // Check if domain is "recent" (registered today)
  const isRecentDomain = (dateString: string) => {
    const domainDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - domainDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours <= 6 && diffHours > 1;
  };

  // Get time ago string
  const getTimeAgo = (dateString: string) => {
    const domainDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - domainDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMinutes < 60) return `hace ${diffMinutes}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    return `hace ${Math.floor(diffHours / 24)}d`;
  };

  const formatDateString = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (e) {
      return dateString;
    }
  };

  const formatTableDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
      return dateString;
    }
  };

  // Copy domain to clipboard
  const copyToClipboard = async (domain: string) => {
    try {
      await navigator.clipboard.writeText(domain);
      setCopiedDomain(domain);
      toast({
        title: "Copiado",
        description: `${domain} copiado al portapapeles`,
      });
      setTimeout(() => setCopiedDomain(null), 2000);
    } catch (err) {
      console.error('Error copying:', err);
    }
  };

  const generateSchemaData = () => {
    if (domains.length === 0 || isLoading) return null;
    const listItems = filteredDomains.slice(0, 50).map((domain, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "WebSite",
        "name": domain.d,
        "url": `https://${domain.d}`,
        "dateCreated": domain.date
      }
    }));
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": listItems,
      "numberOfItems": listItems.length,
      "itemListOrder": "https://schema.org/ItemListOrderDescending"
    });
  };

  const loadDomains = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/data/latest.json', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) {
        throw new Error(`No se pudieron cargar los dominios: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      if (data.domains && Array.isArray(data.domains) && data.domains.length > 0) {
        const sortedDomains = [...data.domains].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setDomains(sortedDomains);
        setLastUpdated(data.updated);
        toast({
          title: "Dominios actualizados",
          description: `Se han cargado ${data.domains.length} dominios recientes.`,
        });
      } else {
        throw new Error('Datos de dominios inválidos o vacíos');
      }
    } catch (error) {
      console.error('Error loading domains:', error);
      setDomains(fallbackDomains);
      setError('No pudimos cargar los últimos dominios en este momento.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDomains();
  }, []);

  const filteredDomains = domains.filter(domain => 
    domain.d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastDomain = currentPage * domainsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
  const currentDomains = filteredDomains.slice(indexOfFirstDomain, indexOfLastDomain);
  const totalPages = Math.ceil(filteredDomains.length / domainsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Count new domains (last hour)
  const newDomainsCount = domains.filter(d => isNewDomain(d.date)).length;

  const servicios = [
    { icon: House, title: "Hosting", path: "/guia-elegir-hosting", color: "from-blue-500 to-blue-600", description: "Alojamiento web" },
    { icon: Cpu, title: "VPS", path: "/guia-elegir-vps", color: "from-emerald-500 to-emerald-600", description: "Servidor virtual" },
    { icon: Server, title: "Dedicado", path: "/guia-elegir-servidor-dedicado", color: "from-orange-500 to-orange-600", description: "Máximo rendimiento" },
    { icon: Shield, title: "SSL", path: "/guia-elegir-ssl", color: "from-purple-500 to-purple-600", description: "Certificado seguro" }
  ];

  const breadcrumbItems: { name: string; href: string }[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 font-montserrat text-slate-900">
      <Helmet>
        <title>Últimos Dominios .CL | EligeTuHosting.cl</title>
        <meta name="description" content="Monitoreo en tiempo real de los dominios .cl más recientes registrados en NIC.cl. Consulta los últimos sitios web creados en Chile." />
        <meta property="og:title" content="Últimos dominios registrados en Chile — eligetuhosting.cl" />
        <meta property="og:description" content="Lista actualizada de los últimos dominios .cl registrados. Encuentra los sitios web más recientes de Chile." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eligetuhosting.cl/ultimos-dominios/" />
        <link rel="canonical" href="https://eligetuhosting.cl/ultimos-dominios/" />
        {!isLoading && domains.length > 0 && <script type="application/ld+json">{generateSchemaData()}</script>}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "Dominios .cl registrados en Chile",
            "description": "Dataset público de los últimos dominios .cl registrados en NIC Chile",
            "url": "https://eligetuhosting.cl/ultimos-dominios/",
            "license": "https://creativecommons.org/publicdomain/zero/1.0/",
            "creator": { "@type": "Organization", "name": "EligeTuHosting.cl" },
            "distribution": [
              { "@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": "https://eligetuhosting.cl/data/latest.json" },
              { "@type": "DataDownload", "encodingFormat": "application/xml", "contentUrl": "https://eligetuhosting.cl/feeds/latest-domains.xml" }
            ]
          })}
        </script>
        <link rel="alternate" type="application/rss+xml" title="Últimos dominios registrados en Chile" href="/feeds/latest-domains.xml" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <SEOBreadcrumbs items={breadcrumbItems} pageName="Últimos Dominios" />
        
        {/* Hero Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 md:p-12 mb-8">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%)', backgroundSize: '50px 50px' }} />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30">
                    <Zap className="w-3 h-3 mr-1" />
                    Actualización automática
                  </Badge>
                  {newDomainsCount > 0 && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse">
                      {newDomainsCount} nuevos esta hora
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Últimos dominios .CL
                </h1>
                <p className="text-slate-300 text-lg mb-4 max-w-2xl">
                  Monitorea en tiempo real los dominios registrados en NIC Chile. 
                  Analiza WHOIS, DNS y más información de cualquier dominio.
                </p>
                
                {lastUpdated && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Última actualización: {formatDateString(lastUpdated)}</span>
                  </div>
                )}
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/15 transition-colors">
                  <div className="text-2xl md:text-3xl font-bold text-white">{domains.length}</div>
                  <div className="text-xs text-slate-400">Dominios</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/15 transition-colors">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-400">24h</div>
                  <div className="text-xs text-slate-400">Período</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/15 transition-colors">
                  <div className="text-2xl md:text-3xl font-bold text-amber-400">
                    <TrendingUp className="h-6 w-6 md:h-8 md:w-8 mx-auto" />
                  </div>
                  <div className="text-xs text-slate-400">En vivo</div>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="mt-6">
              <Button 
                onClick={loadDomains} 
                disabled={refreshing || isLoading}
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Cargando...' : 'Actualizar ahora'}
              </Button>
            </div>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Domain Analysis Search */}
        <DomainAnalysisSearch />

        {/* Service Recommendations - Improved Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {servicios.map((servicio, index) => {
            const IconComponent = servicio.icon;
            return (
              <Link
                key={index}
                to={servicio.path}
                className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${servicio.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${servicio.color} text-white mb-3`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">{servicio.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{servicio.description}</p>
              </Link>
            );
          })}
        </div>
        
        <UltimasBusquedas />
        
        {/* Domain Filter */}
        {!isLoading && domains.length > 0 && (
          <DomainListFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalDomains={domains.length}
            filteredCount={filteredDomains.length}
          />
        )}
        
        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ) : filteredDomains.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Globe className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl font-medium text-slate-700">No se encontraron dominios</p>
            <p className="text-slate-500 mt-2">Intenta con otro término de búsqueda.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Card className="overflow-hidden border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-200">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Últimos dominios registrados
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableCaption className="text-xs text-slate-500 py-4">
                      Listado de últimos dominios .CL registrados en las últimas 24h
                    </TableCaption>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="w-16 font-semibold text-slate-700">N°</TableHead>
                        <TableHead className="font-semibold text-slate-700">Dominio</TableHead>
                        <TableHead className="font-semibold text-slate-700">Registrado</TableHead>
                        <TableHead className="w-32 text-right font-semibold text-slate-700">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentDomains.map((domain, index) => (
                        <TableRow 
                          key={domain.d} 
                          className="group hover:bg-blue-50/50 transition-colors cursor-pointer"
                        >
                          <TableCell className="font-medium text-slate-500">
                            {indexOfFirstDomain + index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <Globe className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                                    {domain.d}
                                  </span>
                                  {isNewDomain(domain.date) && (
                                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                                      Nuevo
                                    </Badge>
                                  )}
                                  {isRecentDomain(domain.date) && (
                                    <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                                      Reciente
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-slate-700">{formatTableDate(domain.date)}</span>
                              <span className="text-xs text-slate-400">{getTimeAgo(domain.date)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(domain.d)}
                                className="h-8 w-8 p-0"
                                title="Copiar dominio"
                              >
                                {copiedDomain === domain.d ? (
                                  <Check className="h-4 w-4 text-emerald-600" />
                                ) : (
                                  <Copy className="h-4 w-4 text-slate-500" />
                                )}
                              </Button>
                              <Link 
                                to={`/domain/${domain.d.replace(/\./g, '-')}/`}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-blue-100 text-blue-600"
                                title="Analizar dominio"
                              >
                                <Search className="h-4 w-4" />
                              </Link>
                              <a 
                                href={`https://${domain.d}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 text-slate-500"
                                title="Visitar sitio"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {currentDomains.map((domain, index) => (
                <div 
                  key={domain.d}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-800 truncate">
                            {domain.d}
                          </span>
                          {isNewDomain(domain.date) && (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs flex-shrink-0">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{getTimeAgo(domain.date)}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs">{formatTableDate(domain.date)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      #{indexOfFirstDomain + index + 1}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(domain.d)}
                      className="flex-1 h-9"
                    >
                      {copiedDomain === domain.d ? (
                        <Check className="h-4 w-4 mr-2 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 h-9"
                    >
                      <Link to={`/domain/${domain.d.replace(/\./g, '-')}/`}>
                        <Search className="h-4 w-4 mr-2" />
                        Analizar
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-9 w-9 p-0"
                    >
                      <a 
                        href={`https://${domain.d}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination className="my-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
                  </PaginationItem>
                )}
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = index + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        onClick={() => paginate(pageNumber)} 
                        isActive={currentPage === pageNumber}
                        className={currentPage === pageNumber ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => paginate(currentPage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </>
        )}
        
        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 md:p-12 mt-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%)', backgroundSize: '50px 50px' }} />
          </div>
          <div className="relative z-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Quieres registrar tu propio dominio .cl?
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Registra tu dominio con los mejores proveedores de hosting en Chile
            </p>
            <Button 
              size="lg" 
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <a 
                href="https://www.hostingplus.cl/dominios" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Globe className="h-5 w-5 mr-2" />
                Registrar un dominio
              </a>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UltimosDominios;
