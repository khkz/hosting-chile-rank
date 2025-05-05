
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { History, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const RecentSearches = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch from the latest.json file that contains NIC.cl domain data
    fetch('/data/latest.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load recent domains');
        }
        
        // Check if the response is HTML (common error case)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('El archivo latest.json no existe o no está en formato JSON');
        }
        
        return response.json();
      })
      .then((data: Domain[]) => {
        // If data is valid and not empty, extract domain names
        if (Array.isArray(data) && data.length > 0) {
          // Extract just the domain names from the domain objects
          const domainNames = data.slice(0, 10).map(item => item.d);
          setDomains(domainNames);
        } else {
          // If data is empty or not an array, fall back to example domains
          console.warn('Recent domains JSON was empty or invalid, using fallback data');
          setDomains(fallbackDomains);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading recent domains:', error);
        
        // Use fallback domains when the actual file can't be loaded
        setDomains(fallbackDomains);
        setIsLoading(false);
        
        // Only show toast for non-development environments
        if (process.env.NODE_ENV !== 'development') {
          toast({
            title: "Usando datos de ejemplo",
            description: "Se están mostrando dominios recientes de ejemplo.",
            variant: "default"
          });
        }
      });
  }, [toast]);

  if (isLoading || domains.length === 0) {
    return null;
  }

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
          {domains.map(domain => (
            <Link 
              key={domain} 
              to={`/whois/${domain.replace(/\./g, '-')}/`}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors flex items-center"
            >
              <Search className="h-3 w-3 mr-1 text-gray-500" />
              {domain}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
