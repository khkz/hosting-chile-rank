
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Search, RefreshCw, ExternalLink, AlertCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Fallback domains for when API is not available
const fallbackDomains = [
  { d: "ejemplo-dominio-cl.cl", date: "2025-05-05T12:00:00Z" },
  { d: "nuevodominio2025.cl", date: "2025-05-05T11:30:00Z" },
  { d: "tiendaonlinechile.cl", date: "2025-05-04T15:45:00Z" },
  { d: "desarrolloweb-cl.cl", date: "2025-05-04T14:20:00Z" },
  { d: "hostingchileno.cl", date: "2025-05-04T10:15:00Z" },
  { d: "nuevositioweb.cl", date: "2025-05-03T16:30:00Z" },
  { d: "misitiopersonal.cl", date: "2025-05-03T13:45:00Z" },
  { d: "tiendaonline-cl.cl", date: "2025-05-03T09:20:00Z" },
  { d: "consultoradigital.cl", date: "2025-05-02T18:10:00Z" },
  { d: "agenciamarketing.cl", date: "2025-05-02T14:30:00Z" },
  { d: "emprendimientochile.cl", date: "2025-05-01T17:00:00Z" },
  { d: "startupchilena.cl", date: "2025-05-01T12:45:00Z" },
  { d: "tecnologiaweb.cl", date: "2025-05-01T09:15:00Z" },
  { d: "serviciosempresa.cl", date: "2025-04-30T16:20:00Z" },
  { d: "productosdigitales.cl", date: "2025-04-30T11:30:00Z" },
];

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
  const [domainsPerPage] = useState(50); // Updated to show 50 domains per page
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { toast } = useToast();

  // Format date to DD-MM-YYYY HH:mm format
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

  // Format date to YYYY-MM-DD HH:mm format for table
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

  // Manual refresh function
  const runFetchScript = async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      // In production, this would call an API endpoint
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

  // Load domains from GitHub JSON with timestamp to avoid cache
  const loadDomains = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add timestamp to URL to avoid cache
      const timestamp = Date.now();
      const response = await fetch(`https://raw.githubusercontent.com/khkz/hosting-chile-rank/main/public/data/latest.json?ts=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`No se pudieron cargar los dominios: ${response.status} ${response.statusText}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.domains && Array.isArray(data.domains) && data.domains.length > 0) {
        setDomains(data.domains);
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
      console.error('Error loading domains:', error);
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

  return (
    <div className="min-h-screen bg-[#EDF2F4] font-montserrat text-[#2B2D42]">
      <Helmet>
        <title>Últimos dominios registrados en NIC.cl — eligetuhosting.cl</title>
        <meta 
          name="description" 
          content="Monitoreo en tiempo real de los dominios .cl más recientes registrados en NIC.cl. Consulta los últimos sitios web creados en Chile."
        />
        <meta 
          property="og:title" 
          content="Últimos dominios registrados en Chile — eligetuhosting.cl"
        />
        <meta 
          property="og:description" 
          content="Lista actualizada de los últimos dominios .cl registrados. Encuentra los sitios web más recientes de Chile."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eligetuhosting.cl/ultimos-dominios/" />
        <link rel="canonical" href="https://eligetuhosting.cl/ultimos-dominios/" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Últimos dominios registrados en NIC.cl</h1>
            <p className="text-gray-600 mb-4">
              Monitoreo en tiempo real de los registros más recientes de dominios .cl
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Datos actualizados: {formatDateString(lastUpdated)} (hora UTC)
              </p>
            )}
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
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualizando...' : 'Actualizar datos'}
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar dominios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : filteredDomains.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl font-medium">No se encontraron dominios</p>
            <p className="text-gray-500 mt-2">
              Intenta con otro término de búsqueda o actualiza la página.
            </p>
          </div>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Últimos dominios registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dominio</TableHead>
                      <TableHead>Fecha de registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentDomains.map((domain) => (
                      <TableRow key={domain.d} className="hover:bg-[#F8F9FA]">
                        <TableCell className="font-medium border-b border-[#E5E7EB]">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            {domain.d}
                          </div>
                        </TableCell>
                        <TableCell className="border-b border-[#E5E7EB]">{formatTableDate(domain.date)}</TableCell>
                        <TableCell className="text-right border-b border-[#E5E7EB]">
                          <div className="flex justify-end space-x-2">
                            <Link 
                              to={`/whois/${domain.d.replace(/\./g, '-')}/`}
                              className="text-blue-600 hover:text-blue-800"
                              title="Analizar dominio"
                            >
                              <Search className="h-4 w-4" />
                            </Link>
                            <a 
                              href={`https://${domain.d}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800"
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

            <Pagination className="mb-8">
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
        
        <div className="text-center mt-12 py-6 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 mb-2">
            ¿Quieres registrar tu propio dominio .cl?
          </p>
          <Button asChild>
            <a 
              href="https://www.hostingplus.cl/dominios" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2"
            >
              Registrar un dominio
            </a>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UltimosDominios;
