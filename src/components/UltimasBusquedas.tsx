import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Search, House, Cpu, Server, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fallback domains for when the JSON file is not available
const fallbackDomains = ["ejemplo-dominio-cl.cl", "nuevodominio2025.cl", "tiendaonlinechile.cl", "desarrolloweb-cl.cl", "hostingchileno.cl", "nuevositioweb.cl", "misitiopersonal.cl", "tiendaonline-cl.cl", "consultoradigital.cl", "agenciamarketing.cl", "emprendimientochile.cl", "startupchilena.cl", "tecnologiaweb.cl", "serviciosempresa.cl", "productosdigitales.cl", "dominiocl.cl", "webagency.cl", "chilehosting.cl", "marketingdigital.cl", "construyetuwebcl.cl"];
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
          const sortedDomains = [...data.domains].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20).map(item => item.d);
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
  if (isLoading || domains.length === 0) {
    return null;
  }
  return <section className="mb-8">
      {/* Recent searches/domains card */}
      <Card className="bg-white shadow-sm mb-4">
        
        
      </Card>
      
      {/* Recommendation section */}
      
    </section>;
};
export default UltimasBusquedas;