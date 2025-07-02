
import React, { useEffect, useState } from 'react';

const Sitemap = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const response = await fetch('/sitemap.xml');
        const xmlContent = await response.text();
        setSitemapContent(xmlContent);
        
        // Clear the body and set the sitemap content as plain text
        document.body.innerHTML = '';
        document.body.style.fontFamily = 'monospace';
        document.body.style.whiteSpace = 'pre';
        document.body.style.padding = '20px';
        document.body.style.backgroundColor = '#f8f9fa';
        document.body.textContent = xmlContent;
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sitemap:', error);
        setIsLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  if (isLoading) {
    return (
      <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px', backgroundColor: '#f8f9fa' }}>
        Loading sitemap...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px', backgroundColor: '#f8f9fa' }}>
      {sitemapContent}
    </div>
  );
};

export default Sitemap;
