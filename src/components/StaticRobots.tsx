
import React, { useEffect, useState } from 'react';

const StaticRobots: React.FC = () => {
  const [robotsContent, setRobotsContent] = useState<string>('');

  useEffect(() => {
    // Fetch robots.txt content from the public directory
    fetch('/robots.txt')
      .then(response => response.text())
      .then(content => setRobotsContent(content))
      .catch(() => {
        // Fallback robots.txt if fetch fails
        const fallbackRobots = `# eligetuhosting.cl robots.txt

User-agent: Googlebot
Allow: /
Crawl-delay: 0.5
Allow: /ultimos-dominios/
Allow: /domain/
Allow: /ranking/

User-agent: *
Allow: /
Crawl-delay: 1

Sitemap: https://eligetuhosting.cl/sitemap.xml
Sitemap: https://eligetuhosting.cl/feed/latest-domains.xml`;
        setRobotsContent(fallbackRobots);
      });

    // Set appropriate headers for plain text content
    const setHeaders = () => {
      if (typeof window !== 'undefined') {
        document.querySelector('meta[http-equiv="Content-Type"]')?.remove();
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Type';
        meta.content = 'text/plain; charset=utf-8';
        document.head.appendChild(meta);
      }
    };

    setHeaders();
  }, []);

  // Return the plain text content
  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap', 
      margin: 0, 
      padding: 0,
      fontSize: '12px'
    }}>
      {robotsContent}
    </pre>
  );
};

export default StaticRobots;
