
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Read the sitemap.xml file from the public directory
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
    <loc>https://eligetuhosting.cl/comparativa/1hosting</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/comparativa/hostgator</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/comparativa/bluehost</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/comparativa/donweb</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/comparativa/godaddy</loc>
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
    <loc>https://eligetuhosting.cl/reseñas/1hosting</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/reseñas/hostgator</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/reseñas/bluehost</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/reseñas/donweb</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/reseñas/godaddy</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/canepaclick-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/dialogouniversitario-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/salazargeo-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/christiansalazar-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/axiocon-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/fotografiademascotas-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/mkcoach-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/mifuegolento-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/buenostiempos-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/panoramas-chile-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/hmfchile-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/polarbear-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/farmaciamiramar-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/casaflorencia-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/legacompliance-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/kossi-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/invierteoro-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/climain-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/gonzocorona-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://eligetuhosting.cl/domain/antagency-cl/</loc>
    <lastmod>2025-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

    return new Response(sitemapContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return new Response('Error serving sitemap', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});
