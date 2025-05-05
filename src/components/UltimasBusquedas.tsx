
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UltimasBusquedas = () => {
  const [searches, setSearches] = useState<string[]>([]);
  
  useEffect(() => {
    // Retrieve searches from localStorage
    const KEY = 'busquedasDominios';
    const loadSearches = () => {
      try {
        const data = JSON.parse(localStorage.getItem(KEY) || '[]');
        setSearches(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (error) {
        console.error('Error loading searches:', error);
        setSearches([]);
      }
    };
    
    // Initial load
    loadSearches();
    
    // Listen for the custom event that will be dispatched when a new search is made
    const handleSearchUpdate = () => loadSearches();
    window.addEventListener('domainSearched', handleSearchUpdate);
    
    return () => {
      window.removeEventListener('domainSearched', handleSearchUpdate);
    };
  }, []);
  
  if (searches.length === 0) {
    return null;
  }
  
  return (
    <section className="container mx-auto py-8 px-4">
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-xl font-semibold flex items-center">
            <History className="h-5 w-5 mr-2 text-[#EF233C]" />
            Últimas búsquedas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {searches.map((domain, index) => (
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
    </section>
  );
};

export default UltimasBusquedas;
