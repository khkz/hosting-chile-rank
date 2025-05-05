import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { History, Search, Calendar } from 'lucide-react';
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
  const [domains, setDomains] = useState<Domain[]>([]);
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
          // Take the first 10 domain entries
          setDomains(data.slice(0, 10));
        } else {
          // If data is empty or not an array, fall back to example domains
          console.warn('Recent domains JSON was empty or invalid, using fallback data');
          setDomains(fallbackDomains.map(d => ({ d, date: new Date().toISOString() })));
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading recent domains:', error);
        
        // Use fallback domains when the actual file can't be loaded
        setDomains(fallbackDomains.map(d => ({ d, date: new Date().toISOString() })));
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
        <CardTitle className="text-sm font-medium flex items-center">
          <History className="h-4 w-4 mr-2 text-blue-600" />
          Dominios recientes
        </CardTitle>
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
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
