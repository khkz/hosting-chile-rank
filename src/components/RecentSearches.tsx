
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RecentSearches = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('/recent.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load recent searches');
        }
        return response.json();
      })
      .then(data => {
        setDomains(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading recent searches:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || domains.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-2">Búsquedas recientes:</h3>
      <div className="flex flex-wrap gap-3">
        {domains.slice(0, 15).map(domain => (
          <Link 
            key={domain} 
            to={`/whois/${domain.replace(/\./g, '-')}`}
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
