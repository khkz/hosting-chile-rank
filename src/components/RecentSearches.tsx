import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { History, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fallback data for when the JSON file is not available
const fallbackDomains = ["hostingplus.cl", "ecohosting.cl", "fullhosting.cl", "webhosting.cl", "planetahosting.cl", "hostgator.cl", "hosting24.cl", "nethosting.cl", "ninjahosting.cl", "ziphosting.cl"];
const RecentSearches = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    toast
  } = useToast();
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
  return;
};
export default RecentSearches;