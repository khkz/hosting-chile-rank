
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oegvwjxrlmtwortyhsrv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjQ2MDg3MSwiZXhwIjoyMDYyMDM2ODcxfQ.XuiNhYIDgJ0hCBHGY6NAvbKKEO4KRr7_2k-t2mw7Jsg';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const generateSitemapXML = async (): Promise<string> => {
  console.log('🗺️ Generating sitemap.xml');
  
  // Get all domains that have been analyzed
  const { data: domains, error } = await supabase
    .from('whois_info')
    .select('domain_id, updated_at')
    .not('domain_id', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(50000); // Sitemap limit

  if (error) {
    console.error('❌ Error fetching domains for sitemap:', error);
    return generateBasicSitemap();
  }

  const baseUrls = [
    { url: 'https://eligetuhosting.cl/', changefreq: 'daily', priority: '1.0' },
    { url: 'https://eligetuhosting.cl/ranking/', changefreq: 'weekly', priority: '0.9' },
    { url: 'https://eligetuhosting.cl/ultimos-dominios/', changefreq: 'daily', priority: '0.8' },
    { url: 'https://eligetuhosting.cl/cotiza-hosting/', changefreq: 'monthly', priority: '0.8' },
    { url: 'https://eligetuhosting.cl/comparativa/', changefreq: 'weekly', priority: '0.7' },
  ];

  const whoisUrls = domains?.map(domain => ({
    url: `https://eligetuhosting.cl/whois/${domain.domain_id}`,
    lastmod: new Date(domain.updated_at).toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.6'
  })) || [];

  const allUrls = [...baseUrls, ...whoisUrls];

  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls.map(item => `  <url>
    <loc>${item.url}</loc>
    ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ''}
    <changefreq>${item.changefreq}</changefreq>
    ${item.priority ? `<priority>${item.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  console.log(`✅ Generated sitemap with ${allUrls.length} URLs`);
  return sitemapXML;
};

const generateBasicSitemap = (): string => {
  const baseUrls = [
    { url: 'https://eligetuhosting.cl/', changefreq: 'daily', priority: '1.0' },
    { url: 'https://eligetuhosting.cl/ranking/', changefreq: 'weekly', priority: '0.9' },
    { url: 'https://eligetuhosting.cl/ultimos-dominios/', changefreq: 'daily', priority: '0.8' },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${baseUrls.map(item => `  <url>
    <loc>${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/sitemap.xml') {
      try {
        const sitemapXML = await generateSitemapXML();
        
        return new Response(sitemapXML, {
          status: 200,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=86400', // 24 hours
          },
        });
      } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        
        const basicSitemap = generateBasicSitemap();
        return new Response(basicSitemap, {
          status: 200,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600', // 1 hour for errors
          },
        });
      }
    }
    
    return new Response('Not Found', { status: 404 });
  },
};
