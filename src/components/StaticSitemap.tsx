
import React, { useEffect, useState } from 'react';

const StaticSitemap: React.FC = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');

  useEffect(() => {
    // Fetch sitemap content from the public directory
    fetch('/sitemap.xml')
      .then(response => response.text())
      .then(content => setSitemapContent(content))
      .catch(() => {
        // Fallback sitemap if fetch fails
        const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://eligetuhosting.cl/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/ranking</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/ultimos-dominios</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
        setSitemapContent(fallbackSitemap);
      });

    // Set appropriate headers for XML content
    const setHeaders = () => {
      if (typeof window !== 'undefined') {
        document.querySelector('meta[http-equiv="Content-Type"]')?.remove();
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Type';
        meta.content = 'application/xml; charset=utf-8';
        document.head.appendChild(meta);
      }
    };

    setHeaders();
  }, []);

  // Return the XML content as plain text
  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap', 
      margin: 0, 
      padding: 0,
      fontSize: '12px'
    }}>
      {sitemapContent}
    </pre>
  );
};

export default StaticSitemap;
