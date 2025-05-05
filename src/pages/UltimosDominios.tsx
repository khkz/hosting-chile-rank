
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

// Fallback domains for when API is not available
const fallbackDomains = [
  { dominio: "example-domain-1.cl", fecha: "2025-05-05" },
  { dominio: "ejemplo-dominio-2.cl", fecha: "2025-05-05" },
  { dominio: "dominio-ejemplo-3.cl", fecha: "2025-05-04" },
  { dominio: "test-domain-4.cl", fecha: "2025-05-04" },
  { dominio: "dominio-test-5.cl", fecha: "2025-05-04" },
  { dominio: "nuevo-sitio-6.cl", fecha: "2025-05-03" },
  { dominio: "misitio-7.cl", fecha: "2025-05-03" },
  { dominio: "tienda-online-8.cl", fecha: "2025-05-03" },
  { dominio: "consultora-9.cl", fecha: "2025-05-02" },
  { dominio: "agencia-10.cl", fecha: "2025-05-02" },
  { dominio: "emprendimiento-11.cl", fecha: "2025-05-01" },
  { dominio: "startup-12.cl", fecha: "2025-05-01" },
  { dominio: "tecnologia-13.cl", fecha: "2025-05-01" },
  { dominio: "servicios-14.cl", fecha: "2025-04-30" },
  { dominio: "productos-15.cl", fecha: "2025-04-30" },
];

const UltimosDominios = () => {
  const [domains, setDomains] = useState<{ dominio: string, fecha: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Load domains from API
  const loadDomains = async () => {
    setRefreshing(true);
    try {
      // In a real implementation, this would be a call to the NIC.cl API or our own API
      // that scans or provides recent domains
      const response = await fetch('/api/latest-domains');
      
      if (!response.ok) {
        throw new Error('No se pudieron cargar los dominios recientes');
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setDomains(data);
        toast({
          title: "Dominios actualizados",
          description: `Se han cargado ${data.length} dominios recientes.`,
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
    domain.dominio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group domains by date
  const groupedDomains = filteredDomains.reduce((groups, domain) => {
    const date = domain.fecha;
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

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-montserrat text-[#333]">
      <Helmet>
        <title>Últimos 1000 dominios registrados en NIC.cl — eligetuhosting.cl</title>
        <meta 
          name="description" 
          content="Monitoreo de los dominios .cl más recientes registrados en NIC.cl. Consulta los últimos sitios web creados en Chile."
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
            <h1 className="text-3xl font-bold mb-2">Últimos dominios registrados</h1>
            <p className="text-gray-600 mb-4">
              Monitoreo de los registros más recientes de dominios .cl en NIC.cl
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, index) => (
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
          <div className="space-y-8">
            {dates.map(date => (
              <div key={date}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">📅</span>
                  {new Date(date).toLocaleDateString('es-CL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedDomains[date].map(domain => (
                    <Card key={domain.dominio} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Globe className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <p className="font-medium">{domain.dominio}</p>
                              <p className="text-xs text-gray-500">
                                Registrado: {new Date(domain.fecha).toLocaleDateString('es-CL')}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Link 
                              to={`/whois/${domain.dominio.replace(/\./g, '-')}/`}
                              className="text-blue-600 hover:text-blue-800"
                              title="Analizar dominio"
                            >
                              <Search className="h-4 w-4" />
                            </Link>
                            <a 
                              href={`https://${domain.dominio}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800"
                              title="Visitar sitio"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
