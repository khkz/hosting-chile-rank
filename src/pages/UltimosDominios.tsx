import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Search, RefreshCw, ExternalLink } from 'lucide-react';
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

// Fallback domains for when API is not available
const fallbackDomains = [
  { d: "example-domain-1.cl", date: "2025-05-05" },
  { d: "ejemplo-dominio-2.cl", date: "2025-05-05" },
  { d: "dominio-ejemplo-3.cl", date: "2025-05-04" },
  { d: "test-domain-4.cl", date: "2025-05-04" },
  { d: "dominio-test-5.cl", date: "2025-05-04" },
  { d: "nuevo-sitio-6.cl", date: "2025-05-03" },
  { d: "misitio-7.cl", date: "2025-05-03" },
  { d: "tienda-online-8.cl", date: "2025-05-03" },
  { d: "consultora-9.cl", date: "2025-05-02" },
  { d: "agencia-10.cl", date: "2025-05-02" },
  { d: "emprendimiento-11.cl", date: "2025-05-01" },
  { d: "startup-12.cl", date: "2025-05-01" },
  { d: "tecnologia-13.cl", date: "2025-05-01" },
  { d: "servicios-14.cl", date: "2025-04-30" },
  { d: "productos-15.cl", date: "2025-04-30" },
];

const UltimosDominios = () => {
  const [domains, setDomains] = useState<{ d: string, date: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [domainsPerPage] = useState(30);
  const { toast } = useToast();

  // Load domains from NIC.cl JSON
  const loadDomains = async () => {
    setRefreshing(true);
    setIsLoading(true);
    
    try {
      const response = await fetch('/data/latest.json');
      
      if (!response.ok) {
        throw new Error('No se pudieron cargar los dominios recientes');
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        // Transform data to match our expected format
        const formattedData = data.map(item => ({
          d: item.d,
          date: item.date
        }));
        
        setDomains(formattedData);
        
        toast({
          title: "Dominios actualizados",
          description: `Se han cargado ${formattedData.length} dominios recientes.`,
          variant: "default"
        });
      } else {
        throw new Error('Datos de dominios inválidos');
      }
    } catch (error) {
      console.error('Error loading domains:', error);
      // Use fallback domains when the API is not available
      setDomains(fallbackDomains);
      toast({
        title: "Usando datos de ejemplo",
        description: "No se pudieron obtener datos reales. Mostrando ejemplos.",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDomains();
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
  }, {} as Record<string, typeof domains>);

  // Get dates sorted by newest first
  const dates = Object.keys(groupedDomains).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
          </div>
          
          <Button 
            onClick={loadDomains}
            disabled={refreshing}
            className="flex items-center gap-2 mt-4 md:mt-0"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar datos'}
          </Button>
        </div>
        
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
                      <TableRow key={domain.d}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            {domain.d}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(domain.date).toLocaleDateString('es-CL')}</TableCell>
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
