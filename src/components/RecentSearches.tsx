
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { History, Search, Calendar, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Fallback data for when the JSON file is not available
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
    // Don't reload data if we already have it and not forcing refresh
    if (!forceRefresh && domains.length > 0) {
      return;
    }
    
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    // Fetch from the latest.json file that contains NIC.cl domain data
    try {
      // Add cache busting parameter for forced refresh
      const cacheBuster = forceRefresh ? `?t=${Date.now()}` : '';
      const response = await fetch(`/data/latest.json${cacheBuster}`);
      
      if (!response.ok) {
        throw new Error('Failed to load recent domains');
      }
      
      // Check if the response is HTML (common error case)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('El archivo latest.json no existe o no está en formato JSON');
      }
      
      const data: DomainData = await response.json();
      setDomainData(data);
      
      // Check if we have the new format with metadata
      if (data.meta) {
        // Take the first 10 domain entries
        setDomains(data.domains.slice(0, 10) || []);
        setLastUpdateTime(data.meta.lastUpdate);
        
        // Check if data is stale (older than 6 hours)
        const lastUpdateDate = new Date(data.meta.lastUpdate);
        const now = new Date();
        const hoursSinceUpdate = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60);
        setIsDataStale(hoursSinceUpdate > 6 || data.meta.status !== 'success');
      } else if (Array.isArray(data)) {
        // Handle old format (array of domains)
        setDomains(data.slice(0, 10));
        setLastUpdateTime(null);
      } else if (Array.isArray(data.domains)) {
        // Handle another possible format
        setDomains(data.domains.slice(0, 10));
        setLastUpdateTime(null);
      } else {
        throw new Error('Format of latest.json is not recognized');
      }
      
      if (forceRefresh) {
        toast({
          title: "Datos actualizados",
          description: "Se han cargado los dominios más recientes.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error loading recent domains:', error);
      
      // Use fallback domains when the actual file can't be loaded
      setDomains(fallbackDomains.map(d => ({ d, date: new Date().toISOString() })));
      setIsDataStale(true);
      
      // Only show toast for non-development environments or forced refresh
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
  }, [toast]);

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

  // Helper function to format registration date
  const formatRegistrationDate = (isoDate: string): string => {
    if (!isoDate) return '';
    
    try {
      const date = new Date(isoDate);
      
      // If today, show "Hoy"
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return 'Hoy';
      }
      
      // If yesterday, show "Ayer"
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Ayer';
      }
      
      // Otherwise, show date in format "5 may"
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
            <Link 
              key={domain.d} 
              to={`/whois/${domain.d.replace(/\./g, '-')}/`}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors flex items-center"
              title={`Registrado: ${new Date(domain.date).toLocaleDateString('es-CL')}`}
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
          ))}
        </div>
        
        <div className="mt-2 text-center">
          <Link 
            to="/ultimos-dominios" 
            className="text-xs text-blue-600 hover:underline"
          >
            Ver todos los dominios recientes
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
