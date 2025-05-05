
import React, { useState, useEffect, useCallback } from 'react';
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
  Clock,
  Info
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Definir interfaces para los datos
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

  // Función mejorada para cargar dominios
  const loadDomains = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && domains.length > 0) {
      return; // No recargar si ya tenemos datos y no estamos forzando la actualización
    }
    
    setIsLoading(true);
    setError(null);
    console.log("Cargando dominios...", forceRefresh ? "Forzando actualización" : "");
    
    try {
      // Añadir parámetro para evitar caché del navegador
      const cacheBuster = forceRefresh ? `?t=${Date.now()}` : '';
      const response = await fetch(`/data/latest.json${cacheBuster}`);
      
      if (!response.ok) {
        throw new Error(`No se pudieron cargar los dominios: ${response.status} ${response.statusText}`);
      }
      
      const data: DomainData = await response.json();
      console.log("Datos cargados:", data);
      setDomainData(data);
      
      // Verificar si tenemos el nuevo formato con metadatos
      if (data.meta) {
        setDomains(data.domains || []);
        setLastUpdateTime(data.meta.lastUpdate);
        
        // Verificar si los datos son antiguos (más de 6 horas)
        const lastUpdateDate = new Date(data.meta.lastUpdate);
        const now = new Date();
        const hoursSinceUpdate = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60);
        setIsDataStale(hoursSinceUpdate > 6 || data.meta.status !== 'success');
        
        if (hoursSinceUpdate > 6) {
          setError('Los datos tienen más de 6 horas de antigüedad. Considera actualizarlos.');
        }
        
        if (data.meta.source === 'fallback' || data.meta.source === 'hardcoded') {
          console.warn("Se están usando datos de respaldo:", data.meta.source);
          toast({
            title: "Datos de respaldo",
            description: "Se están mostrando datos de respaldo. Intenta actualizar desde NIC.cl.",
            variant: "default"
          });
        }
      } else {
        // Manejar formato antiguo (solo un array de dominios)
        setDomains(Array.isArray(data) ? data : []);
        setLastUpdateTime(null);
      }
      
      if (forceRefresh) {
        toast({
          title: "Datos recargados",
          description: "Los dominios se han actualizado correctamente.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error cargando dominios:', error);
      setDomains([]);
      setError('No se pudieron cargar los datos. Por favor, intenta de nuevo.');
      
      toast({
        title: "Error al cargar dominios",
        description: "No se pudieron obtener los dominios. Intenta de nuevo más tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [domains.length, toast]);

  // Función para forzar actualización desde NIC.cl
  const forceUpdate = async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      toast({
        title: "Actualizando dominios",
        description: "Solicitando nuevos datos desde NIC.cl...",
        variant: "default"
      });
      
      // En producción, esto llamaría a un endpoint de API real
      // Para desarrollo, simulamos una demora y una llamada a la API
      let updateSuccess = false;
      
      try {
        // Intentamos ejecutar workflow de GitHub Actions
        const response = await fetch("https://api.github.com/repos/tu-usuario/tu-repo/dispatches", {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'Authorization': `token ${process.env.GITHUB_TOKEN || ''}`
          },
          body: JSON.stringify({
            event_type: 'manual-update'
          })
        });
        
        updateSuccess = response.status === 204;
      } catch (apiError) {
        console.error('Error de API:', apiError);
        // En desarrollo, simulamos actualización exitosa
        if (process.env.NODE_ENV !== 'production') {
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateSuccess = true;
        } else {
          throw apiError;
        }
      }
      
      if (updateSuccess) {
        toast({
          title: "Actualización solicitada",
          description: "Los datos se actualizarán en los próximos minutos.",
          variant: "default"
        });
        
        // Esperar un poco y luego recargar los datos
        setTimeout(() => {
          loadDomains(true);
        }, 3000);
      } else {
        throw new Error("No se pudo iniciar la actualización");
      }
    } catch (error) {
      console.error('Error forzando actualización:', error);
      setError('No se pudo ejecutar la actualización. Por favor, intenta de nuevo más tarde.');
      
      toast({
        title: "Error de actualización",
        description: "No se pudo actualizar los datos desde NIC.cl.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDomains();
    
    // Añadir log para ayudar con la depuración
    console.log("💡 UltimosDominios: Intentando cargar dominios de /data/latest.json");
  }, [loadDomains]);

  // Filtrar dominios basado en término de búsqueda
  const filteredDomains = domains.filter(domain => 
    domain.d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastDomain = currentPage * domainsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
  const currentDomains = filteredDomains.slice(indexOfFirstDomain, indexOfLastDomain);
  const totalPages = Math.ceil(filteredDomains.length / domainsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Formatear fecha a locale español
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
  
  // Formatear fecha y hora a locale español
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

  // Limpiar la búsqueda
  const clearSearch = () => {
    setSearchTerm('');
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
            
            {/* Información de última actualización */}
            {lastUpdateTime && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>Última actualización: {formatDateTime(lastUpdateTime)}</span>
                {isDataStale && (
                  <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                    Datos antiguos
                  </Badge>
                )}
                
                {domainData?.meta?.source && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="ml-2 cursor-help">
                          <Info className="h-4 w-4 text-blue-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Fuente de datos: {domainData.meta.source}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-500">
                Mostrando {filteredDomains.length} dominios que contienen "{searchTerm}"
              </p>
            )}
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link 
                                    to={`/whois/${domain.d.replace(/\./g, '-')}/`}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <Search className="h-4 w-4" />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Analizar dominio</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a 
                                    href={`https://${domain.d}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Visitar sitio</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {totalPages > 1 && (
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
            )}
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
