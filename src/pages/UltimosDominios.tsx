
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Globe, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  AlertTriangle, 
  Calendar,
  Clock
} from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";

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

// Type definitions
interface Domain {
  d: string;
  date: string;
}

interface DomainData {
  meta?: {
    lastUpdate: string;
    lastAttempt?: string;
    count: number;
    status: string;
    source?: string;
    message?: string;
  };
  domains: Domain[];
}

const UltimosDominios = () => {
  const [domainData, setDomainData] = useState<DomainData | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [domainsPerPage] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [isDataStale, setIsDataStale] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to force update from NIC.cl - in production would call an API endpoint
  const forceUpdate = async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      // In production, this would call an actual API endpoint
      // For demonstration, we'll simulate a delay and an API call
      const updateEndpoint = process.env.NODE_ENV === 'production' 
        ? 'https://oegvwjxrlmtwortyhsrv.functions.supabase.co/update-domains'
        : '/api/update-domains';
        
      toast({
        title: "Actualizando dominios",
        description: "Solicitando nuevos datos desde NIC.cl...",
        variant: "default"
      });
      
      try {
        // Try to reach the update endpoint
        const response = await fetch(updateEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ force: true })
        });
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            toast({
              title: "Actualización en progreso",
              description: "Los datos se actualizarán en breve.",
              variant: "default"
            });
            
            // Wait a bit and then reload the data
            setTimeout(() => {
              loadDomains(true);
            }, 3000);
          } else {
            throw new Error(result.message || "Error desconocido durante la actualización");
          }
        } else {
          throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        
        // Simulate successful update for development
        if (process.env.NODE_ENV !== 'production') {
          // Simulate a delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          toast({
            title: "Simulando actualización (desarrollo)",
            description: "En producción, esto ejecutaría el script de actualización real.",
            variant: "default"
          });
          
          // In development, we'll just reload the current data
          await loadDomains(true);
        } else {
          throw apiError;
        }
      }
    } catch (error) {
      console.error('Error forcing update:', error);
      setError('No se pudo ejecutar la actualización. Por favor, inténtalo de nuevo más tarde.');
      
      toast({
        title: "Error de actualización",
        description: "No se pudo actualizar los datos desde NIC.cl.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Load domains from NIC.cl JSON
  const loadDomains = async (forceRefresh = false) => {
    if (!forceRefresh && domains.length > 0) {
      return; // Don't reload if we already have data and not forcing refresh
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Add cache busting parameter to avoid browser caching
      const cacheBuster = forceRefresh ? `?t=${Date.now()}` : '';
      const response = await fetch(`/data/latest.json${cacheBuster}`);
      
      if (!response.ok) {
        throw new Error(`No se pudieron cargar los dominios: ${response.status} ${response.statusText}`);
      }
      
      const data: DomainData = await response.json();
      setDomainData(data);
      
      // Check if we have the new format with metadata
      if (data.meta) {
        setDomains(data.domains || []);
        setLastUpdateTime(data.meta.lastUpdate);
        
        // Check if data is stale (older than 6 hours)
        const lastUpdateDate = new Date(data.meta.lastUpdate);
        const now = new Date();
        const hoursSinceUpdate = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60);
        setIsDataStale(hoursSinceUpdate > 6 || data.meta.status !== 'success');
        
        if (hoursSinceUpdate > 6) {
          setError('Los datos tienen más de 6 horas de antigüedad. Considera actualizarlos.');
        }
      } else {
        // Handle old format (just an array of domains)
        setDomains(Array.isArray(data) ? data : []);
        setLastUpdateTime(null);
      }
    } catch (error) {
      console.error('Error loading domains:', error);
      // Use fallback domains when the API is not available
      setDomains(fallbackDomains);
      setError('Usando datos de ejemplo porque no se pudieron cargar los datos reales.');
      setIsDataStale(true);
      
      toast({
        title: "Usando datos de ejemplo",
        description: "No se pudieron obtener datos reales. Mostrando ejemplos.",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDomains();
    
    // Add console log to help with debugging
    console.log("💡 UltimosDominios: Intentando cargar dominios de /data/latest.json");
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

  // Group domains by date
  const groupedDomains = currentDomains.reduce((groups, domain) => {
    const date = new Date(domain.date).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(domain);
    return groups;
  }, {} as Record<string, Domain[]>);

  // Get dates sorted by newest first
  const dates = Object.keys(groupedDomains).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date to Spanish locale
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Format datetime to Spanish locale with time
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Desconocido";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-montserrat text-[#333]">
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
            
            {/* Last update info */}
            {lastUpdateTime && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>Última actualización: {formatDateTime(lastUpdateTime)}</span>
                {isDataStale && (
                  <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                    Datos antiguos
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              onClick={() => loadDomains(true)}
              disabled={refreshing || isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Recargar
            </Button>
            
            <Button 
              onClick={forceUpdate}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualizando...' : 'Actualizar desde NIC.cl'}
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert variant="default" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Nota</AlertTitle>
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
                {domainData?.meta && (
                  <CardDescription>
                    {domainData.meta.count} dominios encontrados
                  </CardDescription>
                )}
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
                      <TableRow key={domain.d}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            {domain.d}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(domain.date)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
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
