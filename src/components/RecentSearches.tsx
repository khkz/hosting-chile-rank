
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fallback data for when the JSON file is not available
const fallbackDomains = ["hostingplus.cl", "ecohosting.cl", "fullhosting.cl", "webhosting.cl", "planetahosting.cl", "hostgator.cl", "hosting24.cl", "nethosting.cl", "ninjahosting.cl", "ziphosting.cl"];

const RecentSearches = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load the domains from latest.json (same as UltimasBusquedas)
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
            .slice(0, 10)  // Show only 10 domains for this component (smaller than UltimasBusquedas)
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

  if (isLoading || domains.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white shadow-sm mt-4">
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
  );
};

export default RecentSearches;
