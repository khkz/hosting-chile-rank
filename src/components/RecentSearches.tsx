
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
    // First try to fetch from the JSON file
    fetch('/recent.json').then(response => {
      if (!response.ok) {
        throw new Error('Failed to load recent searches');
      }

      // Check if the response is HTML (common error case)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('El archivo recent.json no existe o no está en formato JSON');
      }
      return response.json();
    }).then(data => {
      // If data is valid and not empty, use it
      if (Array.isArray(data) && data.length > 0) {
        setDomains(data);
      } else {
        // If data is empty or not an array, fall back to example domains
        console.warn('Recent searches JSON was empty or invalid, using fallback data');
        setDomains(fallbackDomains);
      }
      setIsLoading(false);
    }).catch(error => {
      console.error('Error loading recent searches:', error);

      // Use fallback domains when the actual file can't be loaded
      setDomains(fallbackDomains);
      setIsLoading(false);
      
      // Removed toast notification to prevent the "Usando datos de ejemplo" message
    });
  }, []);

  if (isLoading || domains.length === 0) {
    return null;
  }

  // Add proper return statement with JSX content
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
