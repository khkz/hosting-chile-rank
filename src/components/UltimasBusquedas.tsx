
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Search, House, Cpu, Server, Shield, Info, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Fallback domains for when the GitHub API request fails
const fallbackDomains = ["ejemplo-dominio-cl.cl", "nuevodominio2025.cl", "tiendaonlinechile.cl", "desarrolloweb-cl.cl", "hostingchileno.cl", "nuevositioweb.cl", "misitiopersonal.cl", "tiendaonline-cl.cl", "consultoradigital.cl", "agenciamarketing.cl", "emprendimientochile.cl", "startupchilena.cl", "tecnologiaweb.cl", "serviciosempresa.cl", "productosdigitales.cl", "dominiocl.cl", "webagency.cl", "chilehosting.cl", "marketingdigital.cl", "construyetuwebcl.cl"];

const UltimasBusquedas = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    // Load the domains from GitHub raw content
    const loadDomains = async () => {
      try {
        setIsLoading(true);
        // GitHub raw URL for the latest.json file
        const githubRawUrl = "https://raw.githubusercontent.com/khkz/hosting-chile-rank/main/public/data/latest.json";
        // Add timestamp to URL to avoid cache
        const timestamp = Date.now();
        const response = await fetch(`${githubRawUrl}?ts=${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`No se pudieron cargar los dominios desde GitHub: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (data.domains && Array.isArray(data.domains) && data.domains.length > 0) {
          // Sort domains by date in descending order and take first 20
          const sortedDomains = [...data.domains]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 20)
            .map(item => item.d);
          
          setDomains(sortedDomains);
          setLastUpdated(data.updated || new Date().toISOString());
        } else {
          throw new Error('Datos de dominios inválidos o vacíos en GitHub');
        }
      } catch (error) {
        console.error('Error loading domains from GitHub:', error);
        // Use fallback domains when the GitHub API request fails
        setDomains(fallbackDomains);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDomains();
  }, []);

  // Define servicios with Lucide icons 
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

  if (isLoading || domains.length === 0) {
    return null;
  }

  return <section className="mb-8">
      {/* Recent searches/domains card */}
      <Card className="bg-white shadow-sm mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <History className="h-5 w-5 mr-2" />
            Últimos dominios registrados
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-2 text-gray-400 hover:text-gray-600">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Datos actualizados automáticamente cada hora desde GitHub
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <div className="flex items-center">
            {lastUpdated && (
              <span className="text-xs text-gray-500 mr-2">
                Actualizado: {formatDateString(lastUpdated)}
              </span>
            )}
            <Link to="/ultimos-dominios" className="text-blue-600 text-sm flex items-center">
              Ver todos <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {domains.slice(0, 10).map((domain, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="truncate flex-1">{domain}</span>
                <Link 
                  to={`/whois/${domain.replace(/\./g, '-')}/`} 
                  className="text-blue-600 hover:text-blue-800"
                  title="Analizar dominio"
                >
                  <Search className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recommendation section */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Servicios recomendados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {servicios.map((servicio, index) => (
              <Link 
                key={index} 
                to={servicio.path} 
                className="flex flex-col items-center gap-1 bg-white p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow w-[100px]"
              >
                <div className="bg-gray-50 p-2 rounded-full">
                  {servicio.icon}
                </div>
                <span className="text-xs font-medium text-center">{servicio.title}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>;
};

export default UltimasBusquedas;
