
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { History, Search, Calendar, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Datos de respaldo para cuando el archivo JSON no está disponible
const fallbackDomains = [
  "hostingplus.cl", 
  "ecohosting.cl", 
  "fullhosting.cl", 
  "webhosting.cl", 
  "planetahosting.cl",
  "hostgator.cl",
  "hosting24.cl",
  "nethosting.cl",
  "ninjahosting.cl",
  "ziphosting.cl"
];

interface Domain {
  d: string;
  date: string;
}

interface DomainData {
  meta?: {
    lastUpdate: string;
    count: number;
    status: string;
    source?: string;
  };
  domains: Domain[];
}

const RecentSearches = () => {
  const [domainData, setDomainData] = useState<DomainData | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataStale, setIsDataStale] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const loadDomains = async (forceRefresh = false) => {
    // No recargar datos si ya los tenemos y no estamos forzando la actualización
    if (!forceRefresh && domains.length > 0) {
      return;
    }
    
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    // Obtener datos del archivo latest.json que contiene datos de dominios de NIC.cl
    try {
      // Añadir parámetro para evitar caché en caso de actualización forzada
      const cacheBuster = forceRefresh ? `?t=${Date.now()}` : '';
      const response = await fetch(`/data/latest.json${cacheBuster}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar dominios recientes');
      }
      
      // Verificar si la respuesta es HTML (caso de error común)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('El archivo latest.json no existe o no está en formato JSON');
      }
      
      const data: DomainData = await response.json();
      setDomainData(data);
      
      // Verificar si tenemos el nuevo formato con metadatos
      if (data.meta) {
        // Tomar las primeras 10 entradas de dominios
        setDomains(data.domains.slice(0, 10) || []);
        setLastUpdateTime(data.meta.lastUpdate);
        
        // Verificar si los datos son antiguos (más de 6 horas)
        const lastUpdateDate = new Date(data.meta.lastUpdate);
        const now = new Date();
        const hoursSinceUpdate = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60);
        setIsDataStale(hoursSinceUpdate > 6 || data.meta.status !== 'success');
      } else if (Array.isArray(data)) {
        // Manejar formato antiguo (array de dominios)
        setDomains(data.slice(0, 10));
        setLastUpdateTime(null);
      } else if (Array.isArray(data.domains)) {
        // Manejar otro posible formato
        setDomains(data.domains.slice(0, 10));
        setLastUpdateTime(null);
      } else {
        throw new Error('El formato de latest.json no es reconocido');
      }
      
      if (forceRefresh) {
        toast({
          title: "Datos actualizados",
          description: "Se han cargado los dominios más recientes.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error cargando dominios recientes:', error);
      
      // Usar dominios de respaldo cuando no se puede cargar el archivo real
      setDomains(fallbackDomains.map(d => ({ d, date: new Date().toISOString() })));
      setIsDataStale(true);
      
      // Solo mostrar toast para entornos que no sean desarrollo o actualización forzada
      if (process.env.NODE_ENV !== 'development' || forceRefresh) {
        toast({
          title: "Usando datos de ejemplo",
          description: "Se están mostrando dominios recientes de ejemplo.",
          variant: "default"
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDomains();
    
    // Log para depuración
    console.log("Cargando dominios recientes para RecentSearches");
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-medium flex items-center">
            <History className="h-4 w-4 mr-2 text-blue-600" />
            Dominios recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-6 w-24 bg-gray-100 rounded-full animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (domains.length === 0) {
    return null;
  }

  // Función auxiliar para formatear fecha de registro
  const formatRegistrationDate = (isoDate: string): string => {
    if (!isoDate) return '';
    
    try {
      const date = new Date(isoDate);
      
      // Si es hoy, mostrar "Hoy"
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return 'Hoy';
      }
      
      // Si es ayer, mostrar "Ayer"
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Ayer';
      }
      
      // En otro caso, mostrar fecha en formato "5 may"
      return date.toLocaleDateString('es-CL', { 
        day: 'numeric', 
        month: 'short'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center">
            <History className="h-4 w-4 mr-2 text-blue-600" />
            Dominios recientes
          </CardTitle>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={() => loadDomains(true)}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refrescar</span>
          </Button>
        </div>
        
        {lastUpdateTime && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>Actualizado: {formatRegistrationDate(lastUpdateTime)}</span>
            {isDataStale && (
              <span className="ml-2">
                <Badge variant="outline" className="py-0 px-1 h-4 text-[10px] bg-yellow-50 text-yellow-800 border-yellow-200">
                  Antiguo
                </Badge>
              </span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {domains.map(domain => (
            <TooltipProvider key={domain.d}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to={`/whois/${domain.d.replace(/\./g, '-')}/`}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors flex items-center"
                  >
                    <Search className="h-3 w-3 mr-1 text-gray-500" />
                    {domain.d}
                    {domain.date && (
                      <span className="ml-1 text-xs text-gray-500 flex items-center">
                        <Calendar className="h-2 w-2 mr-1" />
                        {formatRegistrationDate(domain.date)}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver información WHOIS de {domain.d}</p>
                  <p className="text-xs text-gray-500">Registrado: {new Date(domain.date).toLocaleDateString('es-CL')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <Link 
            to="/ultimos-dominios" 
            className="text-xs text-blue-600 hover:underline"
          >
            Ver todos los dominios recientes
          </Link>
          
          <div className="flex space-x-1">
            {domains.map((domain, index) => index < 3 && (
              <TooltipProvider key={domain.d}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={`https://${domain.d}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs p-1 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Visitar {domain.d}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
