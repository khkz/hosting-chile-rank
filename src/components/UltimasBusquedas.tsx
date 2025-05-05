
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Search, House, Cpu, Server, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fallback domains for when the JSON file is not available
const fallbackDomains = [
  "ejemplo-dominio-cl.cl", 
  "nuevodominio2025.cl", 
  "tiendaonlinechile.cl", 
  "desarrolloweb-cl.cl", 
  "hostingchileno.cl",
  "nuevositioweb.cl",
  "misitiopersonal.cl",
  "tiendaonline-cl.cl",
  "consultoradigital.cl",
  "agenciamarketing.cl",
  "emprendimientochile.cl",
  "startupchilena.cl",
  "tecnologiaweb.cl",
  "serviciosempresa.cl",
  "productosdigitales.cl",
  "dominiocl.cl",
  "webagency.cl",
  "chilehosting.cl",
  "marketingdigital.cl",
  "construyetuwebcl.cl"
];

const UltimasBusquedas = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Try to load the domains from latest.json for recently registered domains
    const loadDomains = async () => {
      try {
        // Add timestamp to URL to avoid cache
        const timestamp = Date.now();
        const response = await fetch(`/data/latest.json?ts=${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`No se pudieron cargar los dominios: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.domains && Array.isArray(data.domains) && data.domains.length > 0) {
          // Sort domains by date in descending order and take first 20
          const sortedDomains = [...data.domains]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 20)
            .map(item => item.d);
          
          setDomains(sortedDomains);
        } else {
          throw new Error('Datos de dominios inválidos o vacíos');
        }
      } catch (error) {
        console.error('Error loading domains:', error);
        // Use fallback domains when the API is not available
        setDomains(fallbackDomains);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDomains();
  }, []);
  
  // Define servicios with Lucide icons 
  const servicios = [
    { 
      icon: <House className="h-5 w-5 text-blue-600" />, 
      title: "Hosting", 
      path: "/guia-elegir-hosting" 
    },
    { 
      icon: <Cpu className="h-5 w-5 text-green-600" />, 
      title: "VPS", 
      path: "/guia-elegir-vps" 
    },
    { 
      icon: <Server className="h-5 w-5 text-red-600" />, 
      title: "Dedicado", 
      path: "/guia-elegir-servidor-dedicado" 
    },
    { 
      icon: <Shield className="h-5 w-5 text-purple-600" />, 
      title: "SSL", 
      path: "/guia-elegir-ssl" 
    }
  ];
  
  if (isLoading || domains.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-8">
      {/* Recent searches/domains card */}
      <Card className="bg-white shadow-sm mb-4">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-xl font-semibold flex items-center">
            <History className="h-5 w-5 mr-2 text-[#EF233C]" />
            Búsquedas recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {domains.map((domain, index) => (
              <Link 
                key={index} 
                to={`/whois/${domain.replace(/\./g, '-')}/`}
                className="text-sm px-3 py-1 bg-[#EDF2F4] hover:bg-gray-200 rounded-full text-[#2B2D42] transition-colors flex items-center"
              >
                <Search className="h-4 w-4 mr-1 text-gray-500" />
                {domain}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recommendation section */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-xl font-semibold">
            Recomendaciones para tu dominio
          </CardTitle>
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
    </section>
  );
};

export default UltimasBusquedas;
