
import { useEffect } from 'react';

const SitemapXML = () => {
  useEffect(() => {
    // Fetch the sitemap.xml content and serve it with proper headers
    fetch('/sitemap.xml')
      .then(response => response.text())
      .then(xmlContent => {
        // Set the content type to XML
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        // Replace current page content with XML
        document.open();
        document.write(xmlContent);
        document.close();
        
        // Set proper content type header
        if (document.head) {
          const meta = document.createElement('meta');
          meta.setAttribute('http-equiv', 'Content-Type');
          meta.setAttribute('content', 'application/xml; charset=utf-8');
          document.head.appendChild(meta);
        }
      })
      .catch(() => {
        // Fallback: generate sitemap dynamically if static file fails
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://eligetuhosting.cl/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/ranking</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
        
        document.open();
        document.write(sitemapContent);
        document.close();
      });
  }, []);

  return null;
};

export default SitemapXML;
