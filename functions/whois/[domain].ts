
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://oegvwjxrlmtwortyhsrv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjQ2MDg3MSwiZXhwIjoyMDYyMDM2ODcxfQ.XuiNhYIDgJ0hCBHGY6NAvbKKEO4KRr7_2k-t2mw7Jsg';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface WhoisData {
  registrar: string;
  created_date: string;
  expires_date: string;
  owner_name: string;
  organization: string;
  status: string;
  dnssec_status: string;
}

// Domain validation regex
const isDomainValid = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.(cl|com|net|org|info|biz)$/i;
  return domainRegex.test(domain);
};

// Fetch WHOIS data from cache or API
const getWhoisData = async (domain: string): Promise<WhoisData> => {
  console.log(`🔍 Fetching WHOIS data for: ${domain}`);
  
  try {
    // Check cache first
    const { data: cachedData, error: cacheError } = await supabase
      .from('whois_info')
      .select('*')
      .eq('domain_id', domain)
      .gte('cached_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (!cacheError && cachedData) {
      console.log(`✅ Using cached WHOIS data for: ${domain}`);
      return {
        registrar: cachedData.registrar || 'NIC Chile',
        created_date: cachedData.created_date || 'No disponible',
        expires_date: cachedData.expires_date || 'No disponible',
        owner_name: cachedData.owner_name || 'Información privada',
        organization: cachedData.organization || 'Información privada',
        status: cachedData.status || 'Activo',
        dnssec_status: cachedData.dnssec_status || 'No configurado'
      };
    }

    // Call existing whois-lookup function
    console.log(`🔄 Calling whois-lookup function for: ${domain}`);
    const { data: whoisResponse, error: whoisError } = await supabase.functions.invoke('whois-lookup', {
      body: { domain }
    });

    if (whoisError) {
      console.error('❌ WHOIS lookup error:', whoisError);
      throw new Error('WHOIS lookup failed');
    }

    const whoisData: WhoisData = {
      registrar: whoisResponse.registrar || 'NIC Chile',
      created_date: whoisResponse.created_date || 'No disponible',
      expires_date: whoisResponse.expires_date || 'No disponible',
      owner_name: whoisResponse.owner_name || 'Información privada',
      organization: whoisResponse.organization || 'Información privada',
      status: whoisResponse.status || 'Activo',
      dnssec_status: whoisResponse.dnssec_status || 'No configurado'
    };

    // Save to cache
    const { error: saveError } = await supabase
      .from('whois_info')
      .upsert({
        domain_id: domain,
        ...whoisData,
        cached_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (saveError) {
      console.error('❌ Error saving WHOIS data:', saveError);
    } else {
      console.log(`✅ WHOIS data cached for: ${domain}`);
    }

    return whoisData;

  } catch (error) {
    console.error(`❌ Error fetching WHOIS for ${domain}:`, error);
    // Return fallback data
    return {
      registrar: 'NIC Chile',
      created_date: 'No disponible',
      expires_date: 'No disponible',
      owner_name: 'Información privada',
      organization: 'Información privada',
      status: 'No disponible',
      dnssec_status: 'No configurado'
    };
  }
};

// Generate SEO-optimized HTML
const generateWhoisHTML = (domain: string, whoisData: WhoisData): string => {
  const capitalizedDomain = domain.charAt(0).toUpperCase() + domain.slice(1);
  const isRegistered = whoisData.created_date !== 'No disponible';
  const statusText = isRegistered ? 'registrado' : 'no registrado';
  
  const title = `${capitalizedDomain} - Análisis completo de dominio — eligetuhosting.cl`;
  const description = `Análisis WHOIS de ${domain}: ${statusText} ${whoisData.created_date !== 'No disponible' ? `el ${whoisData.created_date}` : ''}. DNS, SSL, tecnología y más información técnica.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": `Análisis WHOIS de ${domain}`,
    "url": `https://eligetuhosting.cl/whois/${domain}`,
    "description": description,
    "mainEntity": {
      "@type": "TechArticle",
      "headline": title,
      "about": {
        "@type": "WebSite",
        "name": domain,
        "url": `https://${domain}`
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": "https://eligetuhosting.cl/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Dominios",
          "item": "https://eligetuhosting.cl/ultimos-dominios/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": capitalizedDomain
        }
      ]
    }
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://eligetuhosting.cl/whois/${domain}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://eligetuhosting.cl/whois/${domain}">
  <meta property="og:site_name" content="eligetuhosting.cl">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  
  <!-- Structured Data -->
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  
  <!-- Critical CSS -->
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f7f9fc; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { background: #fff; padding: 20px 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #1f2937; }
    .main-title { font-size: 32px; font-weight: bold; margin-bottom: 10px; color: #1f2937; }
    .subtitle { color: #6b7280; margin-bottom: 30px; }
    .whois-card { background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 30px; }
    .whois-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .whois-item { padding: 15px 0; border-bottom: 1px solid #f3f4f6; }
    .whois-label { font-weight: 600; color: #374151; margin-bottom: 5px; }
    .whois-value { color: #6b7280; }
    .cta-card { background: linear-gradient(135deg, #ef233c, #d90429); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-top: 30px; }
    .cta-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .cta-text { margin-bottom: 20px; opacity: 0.9; }
    .cta-button { background: #fff; color: #ef233c; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; transition: transform 0.2s; }
    .cta-button:hover { transform: translateY(-2px); }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; }
    .status-active { background: #dcfce7; color: #166534; }
    .status-inactive { background: #fef2f2; color: #991b1b; }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="logo">eligetuhosting.cl</div>
    </div>
  </header>
  
  <main class="container">
    <h1 class="main-title">${capitalizedDomain} - Análisis WHOIS</h1>
    <p class="subtitle">Información completa sobre el dominio ${domain}</p>
    
    <div class="whois-card">
      <h2 style="margin-top: 0; color: #1f2937; margin-bottom: 20px;">Información WHOIS</h2>
      <div class="whois-grid">
        <div class="whois-item">
          <div class="whois-label">Estado del dominio</div>
          <div class="whois-value">
            <span class="status-badge ${isRegistered ? 'status-active' : 'status-inactive'}">
              ${isRegistered ? 'Registrado' : 'No registrado'}
            </span>
          </div>
        </div>
        <div class="whois-item">
          <div class="whois-label">Registrador</div>
          <div class="whois-value">${whoisData.registrar}</div>
        </div>
        <div class="whois-item">
          <div class="whois-label">Fecha de registro</div>
          <div class="whois-value">${whoisData.created_date}</div>
        </div>
        <div class="whois-item">
          <div class="whois-label">Fecha de expiración</div>
          <div class="whois-value">${whoisData.expires_date}</div>
        </div>
        <div class="whois-item">
          <div class="whois-label">Propietario</div>
          <div class="whois-value">${whoisData.owner_name}</div>
        </div>
        <div class="whois-item">
          <div class="whois-label">Organización</div>
          <div class="whois-value">${whoisData.organization}</div>
        </div>
        <div class="whois-item">
          <div class="whois-label">Estado</div>
          <div class="whois-value">${whoisData.status}</div>
        </div>
        <div class="whois-item">
          <div class="whois-label">DNSSEC</div>
          <div class="whois-value">${whoisData.dnssec_status}</div>
        </div>
      </div>
    </div>
    
    <div class="cta-card">
      <div class="cta-title">¿Necesitas hosting para tu dominio?</div>
      <div class="cta-text">¡Contrata tu hosting desde $3.469/mes con soporte 24/7!</div>
      <a href="/cotiza-hosting" class="cta-button">Cotizar Hosting</a>
    </div>
  </main>
  
  <!-- Minimal JavaScript for enhanced functionality -->
  <script>
    // Enhanced functionality can be added here
    console.log('WHOIS SSR page loaded for: ${domain}');
  </script>
</body>
</html>`;
};

// Main handler
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    
    // Extract domain from path: /whois/ejemplo.cl -> ejemplo.cl
    if (pathParts.length < 3 || pathParts[1] !== 'whois') {
      return new Response('Not Found', { status: 404 });
    }
    
    const domain = pathParts[2];
    
    // Validate domain format
    if (!isDomainValid(domain)) {
      const html = generateWhoisHTML(domain, {
        registrar: 'Dominio inválido',
        created_date: 'No disponible',
        expires_date: 'No disponible',
        owner_name: 'Formato de dominio inválido',
        organization: 'N/A',
        status: 'Inválido',
        dnssec_status: 'N/A'
      });
      
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600', // 1 hour cache for invalid domains
        },
      });
    }
    
    try {
      console.log(`🚀 Processing WHOIS request for: ${domain}`);
      const startTime = Date.now();
      
      // Get WHOIS data
      const whoisData = await getWhoisData(domain);
      
      // Generate HTML
      const html = generateWhoisHTML(domain, whoisData);
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ WHOIS SSR completed for ${domain} in ${processingTime}ms`);
      
      // Set appropriate cache headers
      const cacheControl = processingTime < 1000 ? 
        'public, max-age=86400' : // 24 hours for fast responses
        'public, max-age=43200';  // 12 hours for slower responses
      
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': cacheControl,
          'X-Processing-Time': `${processingTime}ms`,
        },
      });
      
    } catch (error) {
      console.error(`❌ Error processing WHOIS for ${domain}:`, error);
      
      // Return error page but still with HTTP 200 for SEO
      const errorHtml = generateWhoisHTML(domain, {
        registrar: 'Error en consulta',
        created_date: 'No disponible',
        expires_date: 'No disponible',
        owner_name: 'Error al obtener información',
        organization: 'N/A',
        status: 'Error',
        dnssec_status: 'N/A'
      });
      
      return new Response(errorHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300', // 5 minutes cache for errors
        },
      });
    }
  },
};
