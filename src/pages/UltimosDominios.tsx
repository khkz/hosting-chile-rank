import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Search, RefreshCw, AlertCircle, Calendar, Server, Cpu, Shield, House } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
}, {
  d: "desarrolloweb-cl.cl",
  date: "2025-05-04T14:20:00Z"
}, {
  d: "hostingchileno.cl",
  date: "2025-05-04T10:15:00Z"
}, {
  d: "nuevositioweb.cl",
  date: "2025-05-03T16:30:00Z"
}, {
  d: "misitiopersonal.cl",
  date: "2025-05-03T13:45:00Z"
}, {
  d: "tiendaonline-cl.cl",
  date: "2025-05-03T09:20:00Z"
}, {
  d: "consultoradigital.cl",
  date: "2025-05-02T18:10:00Z"
}, {
  d: "agenciamarketing.cl",
  date: "2025-05-02T14:30:00Z"
}, {
  d: "emprendimientochile.cl",
  date: "2025-05-01T17:00:00Z"
}, {
  d: "startupchilena.cl",
  date: "2025-05-01T12:45:00Z"
}, {
  d: "tecnologiaweb.cl",
  date: "2025-05-01T09:15:00Z"
}, {
  d: "serviciosempresa.cl",
  date: "2025-04-30T16:20:00Z"
}, {
  d: "productosdigitales.cl",
  date: "2025-04-30T11:30:00Z"
}];

// Type definition for domain data
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
  const [domainsPerPage] = useState(50); // Show 50 domains per page
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const {
    toast
  } = useToast();

  // Format date helpers
  const formatDateString = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // No timezone adjustment to show the original time

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
      // No timezone adjustment to show the original time

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

  // Generate structured data for Schema.org
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
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": listItems,
      "numberOfItems": listItems.length,
      "itemListOrder": "https://schema.org/ItemListOrderDescending"
    };
    return JSON.stringify(schemaData);
  };

  // Manual refresh function
  const runFetchScript = async () => {
    setRefreshing(true);
    setError(null);
    try {
      toast({
        title: "Actualizando datos",
        description: "Intentando obtener los últimos dominios registrados.",
        variant: "default"
      });

      // Try to load the domains after the toast
      await loadDomains();
    } catch (error) {
      console.error('Error running fetch script:', error);
      setError('No se pudo ejecutar la actualización de dominios.');
    } finally {
      setRefreshing(false);
    }
  };

  // Load domains from GitHub raw content
  const loadDomains = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // GitHub raw URL for the latest.json file
      const githubRawUrl = "https://raw.githubusercontent.com/khkz/hosting-chile-rank/main/public/data/latest.json";
      // Add timestamp to URL to avoid cache
      const timestamp = Date.now();
      const response = await fetch(`${githubRawUrl}?ts=${timestamp}`);
      if (!response.ok) {
        throw new Error(`No se pudieron cargar los dominios desde GitHub: ${response.status} ${response.statusText}`);
      }
      const data: ApiResponse = await response.json();
      if (data.domains && Array.isArray(data.domains) && data.domains.length > 0) {
        // Sort domains by date in descending order
        const sortedDomains = [...data.domains].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setDomains(sortedDomains);
        setLastUpdated(data.updated);
        toast({
          title: "Dominios actualizados",
          description: `Se han cargado ${data.domains.length} dominios recientes.`,
          variant: "default"
        });
      } else {
        throw new Error('Datos de dominios inválidos o vacíos');
      }
    } catch (error) {
      console.error('Error loading domains from GitHub:', error);
      // Use fallback domains when the API is not available
      setDomains(fallbackDomains);
      setError('No pudimos cargar los últimos dominios en este momento. Intenta nuevamente en unos minutos.');
      toast({
        title: "Error al cargar dominios",
        description: "Usando datos de ejemplo porque no se pudieron cargar los datos reales.",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadDomains();

    // Add console log to help with debugging
    console.log("💡 UltimosDominios: Intentando cargar dominios desde GitHub");
  }, []);

  // Filter domains based on search term
  const filteredDomains = domains.filter(domain => 
    domain.d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastDomain = currentPage * domainsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
  const currentDomains = filteredDomains.slice(indexOfFirstDomain, indexOfLastDomain);
  const totalPages = Math.ceil(filteredDomains.length / domainsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Icons for recommendations
  const servicios = [{
    icon: <House className="h-5 w-5 text-blue-600" />,
    title: "Hosting",
    path: "/guia-elegir-hosting"
  }, {
    icon: <Cpu className="h-5 w-5 text-green-600" />,
    title: "VPS",
    path: "/guia-elegir-vps"
  }, {
    icon: <Server className="h-5 w-5 text-red-600" />,
    title: "Dedicado",
    path: "/guia-elegir-servidor-dedicado"
  }, {
    icon: <Shield className="h-5 w-5 text-purple-600" />,
    title: "SSL",
    path: "/guia-elegir-ssl"
  }];

  // Prepare breadcrumbs for this page
  const breadcrumbItems: { name: string; href: string }[] = [];
  return <div className="min-h-screen bg-[#EDF2F4] font-montserrat text-[#2B2D42]">
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
            "description": "Dataset público de los últimos dominios .cl registrados en NIC Chile, actualizado en tiempo real",
            "url": "https://eligetuhosting.cl/ultimos-dominios/",
            "license": "https://creativecommons.org/publicdomain/zero/1.0/",
            "creator": {
              "@type": "Organization",
              "name": "EligeTuHosting.cl"
            },
            "distribution": [{
              "@type": "DataDownload",
              "encodingFormat": "application/json",
              "contentUrl": "https://eligetuhosting.cl/data/latest.json"
            }, {
              "@type": "DataDownload", 
              "encodingFormat": "application/xml",
              "contentUrl": "https://eligetuhosting.cl/feeds/latest-domains.xml"
            }],
            "temporalCoverage": "2025/2025",
            "spatialCoverage": {
              "@type": "Place",
              "name": "Chile"
            },
            "keywords": ["dominios", "chile", "nic", "registros", "hosting"]
          })}
        </script>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Últimos dominios registrados en Chile — eligetuhosting.cl" />
        <meta name="twitter:description" content="Lista actualizada de los últimos dominios .cl registrados. Encuentra los sitios web más recientes de Chile." />
        <link rel="alternate" type="application/rss+xml" title="Últimos dominios registrados en Chile" href="/feeds/latest-domains.xml" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <SEOBreadcrumbs items={breadcrumbItems} pageName="Últimos Dominios" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Últimos dominios registrados en NIC.cl</h1>
            <p className="text-gray-600 mb-4">
              Analiza cualquier dominio o consulta los registros más recientes de dominios .cl
            </p>
            {lastUpdated && <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Datos actualizados: {formatDateString(lastUpdated)} (GMT-4)
              </p>}
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              onClick={loadDomains} 
              disabled={refreshing || isLoading} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Recargar
            </Button>
            
            <Button 
              onClick={runFetchScript} 
              disabled={refreshing} 
              className="flex items-center gap-2 text-zinc-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualizando...' : 'Actualizar datos'}
            </Button>
          </div>
        </div>
        
        {error && <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>}
        
        {/* New domain analysis search */}
        <DomainAnalysisSearch />

        {/* Recomendaciones de servicios */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Recomendaciones para tu nuevo dominio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {servicios.map((servicio, index) => (
                <Link
                  key={index}
                  to={servicio.path}
                  className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow w-[120px]"
                >
                  <div className="bg-gray-50 p-3 rounded-full">
                    {servicio.icon}
                  </div>
                  <span className="text-sm font-medium text-center">{servicio.title}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <UltimasBusquedas />

        {/* TL;DR Summary for domain data */}
        {!isLoading && domains.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                📊 Resumen de datos
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/60 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-900">{domains.length}</div>
                  <div className="text-sm text-green-700">Dominios registrados</div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-900">24h</div>
                  <div className="text-sm text-green-700">Período de datos</div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-900">100%</div>
                  <div className="text-sm text-green-700">Datos públicos</div>
                </div>
              </div>
              <div className="text-sm text-green-800">
                <strong>Fuentes:</strong> NIC Chile (registro oficial de dominios .cl), 
                <a href="https://www.nic.cl" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                  nic.cl
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Domain list filter */}
        {!isLoading && domains.length > 0 && (
          <DomainListFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalDomains={domains.length}
            filteredCount={filteredDomains.length}
          />
        )}
        
        {isLoading ? <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 gap-4">
              {Array.from({
            length: 10
          }).map((_, index) => <Skeleton key={index} className="h-16 w-full" />)}
            </div>
          </div> : filteredDomains.length === 0 ? <div className="text-center py-12">
            <p className="text-xl font-medium">No se encontraron dominios</p>
            <p className="text-gray-500 mt-2">
              Intenta con otro término de búsqueda o actualiza la página.
            </p>
          </div> : <>
            <Card className="mb-8 overflow-auto">
              <CardHeader>
                <CardTitle>Últimos dominios registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="w-full text-sm text-[#2B2D42]">
                  <TableCaption className="text-xs text-gray-500 mt-2">
                    Listado de últimos dominios .CL registrados en las últimas 24 h
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col" className="bg-white sticky top-0 shadow">N°</TableHead>
                      <TableHead scope="col" className="bg-white sticky top-0 shadow">Dominio</TableHead>
                      <TableHead scope="col" className="bg-white sticky top-0 shadow">Fecha de registro (GMT-4)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentDomains.map((domain, index) => <TableRow key={domain.d} className="hover:bg-[#F8F9FA]">
                        <TableCell className="font-medium border-b border-[#E5E7EB]">
                          {indexOfFirstDomain + index + 1}
                        </TableCell>
                        <TableCell className="border-b border-[#E5E7EB]">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            <span>{domain.d}</span>
                            <div className="flex ml-auto space-x-2">
                              <Link to={`/domain/${domain.d.replace(/\./g, '-')}/`} className="text-blue-600 hover:text-blue-800" title="Analizar dominio">
                                <Search className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="border-b border-[#E5E7EB]">
                          {formatTableDate(domain.date)}
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Pagination className="mb-8">
              <PaginationContent>
                {currentPage > 1 && <PaginationItem>
                    <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
                  </PaginationItem>}
                
                {Array.from({
              length: Math.min(5, totalPages)
            }).map((_, index) => {
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
              return <PaginationItem key={pageNumber}>
                      <PaginationLink onClick={() => paginate(pageNumber)} isActive={currentPage === pageNumber}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>;
            })}
                
                {currentPage < totalPages && <PaginationItem>
                    <PaginationNext onClick={() => paginate(currentPage + 1)} />
                  </PaginationItem>}
              </PaginationContent>
            </Pagination>
          </>}
        
        <div className="text-center mt-12 py-6 rounded-lg shadow-sm bg-zinc-50 mx-0">
          <p className="text-gray-600 mb-2">
            ¿Quieres registrar tu propio dominio .cl?
          </p>
          <Button asChild>
            <a 
              href="https://www.hostingplus.cl/dominios" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 mx-0 my-0 py-0 px-[37px] text-red-600"
            >
              Registrar un dominio
            </a>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default UltimosDominios;
