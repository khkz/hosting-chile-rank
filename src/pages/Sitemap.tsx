
import React, { useEffect } from 'react';

const Sitemap = () => {
  useEffect(() => {
    // Set proper content type header for XML
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

    // Instead of modifying document properties, we'll render the XML as text
    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap;">${sitemapContent}</pre>`;
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      Loading sitemap...
    </div>
  );
};

export default Sitemap;
