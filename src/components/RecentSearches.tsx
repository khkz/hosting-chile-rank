
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Fallback data for when the JSON file is not available
const fallbackDomains = [
  "hostingplus.cl", 
  "ecohosting.cl", 
  "fullhosting.cl", 
  "webhosting.cl", 
  "planetahosting.cl"
];

const RecentSearches = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetch('/recent.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load recent searches');
        }
        
        // Check if the response is HTML (common error case)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('El archivo recent.json no existe o no está en formato JSON');
        }
        
        return response.json();
      })
      .then(data => {
        setDomains(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading recent searches:', error);
        
        // Use fallback domains when the actual file can't be loaded
        setDomains(fallbackDomains);
        setIsLoading(false);
        
        // Only show toast for non-development environments
        if (process.env.NODE_ENV !== 'development') {
          toast({
            title: "Usando datos de ejemplo",
            description: "Se están mostrando búsquedas recientes de ejemplo.",
            variant: "default"
          });
        }
      });
  }, [toast]);

  if (isLoading || domains.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-2">Búsquedas recientes:</h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {domains.slice(0, 15).map(domain => (
          <Link 
            key={domain} 
            to={`/whois/${domain.replace(/\./g, '-')}/`}
            className="text-xs hover:underline text-[#EDF2F4]/80 hover:text-[#EDF2F4]"
          >
            {domain}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
