
import React, { useEffect } from 'react';

const Sitemap = () => {
  useEffect(() => {
    // Redirect to serve the sitemap XML content
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://eligetuhosting.cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/ranking</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/comparativa</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/cotiza-hosting</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/ultimos-dominios</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/contacto</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/faq</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/comparativa/hostingplus</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/comparativa/ecohosting</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/reseñas/hostingplus</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/reseñas/ecohosting</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/domain/amirahtech-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://eligetuhosting.cl/domain/centrolongevidad-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
    
    // Set the response headers and content
    document.documentElement.innerHTML = sitemapContent;
    document.contentType = 'application/xml';
  }, []);

  return null;
};

export default Sitemap;
