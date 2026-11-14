import { supabase } from '@/integrations/supabase/client';
import { lookupASN, type ASNInfo } from './asnLookup';
import type { ComplaintInfo } from './hostingComplaints';

/**
 * Estado de cada consulta del análisis. `answered` es false cuando la consulta
 * falló o no hubo respuesta: la ficha no debe leer los valores por defecto
 * (listas vacías, ssl_enabled=false…) como si fueran hallazgos.
 * `checked_at` es el momento en que respondió la consulta en vivo o, si viene
 * de la caché, la fecha guardada en la base.
 */
export interface ProbeStatus {
  answered: boolean;
  checked_at: string | null;
}

export type ProbeKey = 'dns' | 'whois' | 'ssl' | 'ip' | 'site';

/**
 * País del alojamiento. Solo se afirma cuando la consulta de la IP (ipinfo.io)
 * respondió con un código de país; si no, queda en 'unknown'.
 */
export interface HostingCountry {
  status: 'chile' | 'foreign' | 'unknown';
  country_code: string | null;
  checked_at: string | null;
}

/** Métricas de rendimiento. Esta herramienta no las mide: hoy siempre es null. */
export interface DomainPerformance {
  load_time_ms: number;
  page_size_kb: number;
  pagespeed_score: number;
  first_contentful_paint_ms: number;
  largest_contentful_paint_ms: number;
  cumulative_layout_shift: number;
}

export interface DomainAnalysisResult {
  basic: {
    domain: string;
    ip: string;
    ip_chile: boolean;
    provider: string;
    asn: string;
    nameservers: string[];
    location?: string;
    isp?: string;
    complaintInfo?: ComplaintInfo | null;
    detectedProvider?: string | null;
    hosting_country?: HostingCountry;
  };
  dns: {
    a_records: string[];
    aaaa_records: string[];
    mx_records: Array<{ priority: number; exchange: string }>;
    txt_records: string[];
    cname_records: Array<{ name: string; value: string }>;
    ns_records: string[];
  };
  whois: {
    registrar: string;
    created_date: string;
    expires_date: string;
    status: string;
    owner_name: string;
    organization: string;
    email: string;
    dnssec_status: string;
  };
  ssl: {
    ssl_enabled: boolean;
    ssl_issuer: string;
    ssl_expires_date: string;
    ssl_grade: string;
    https_redirect: boolean;
    security_headers: Record<string, any>;
  };
  /** null: la herramienta no mide el rendimiento (antes eran cifras al azar). */
  performance: DomainPerformance | null;
  /** Qué consultas respondieron y cuándo. */
  probes?: Record<ProbeKey, ProbeStatus>;
  tech_stack: {
    server_software: string;
    cms_detected: string;
    framework_detected: string;
    cdn_provider: string;
    analytics_tools: string[];
    programming_language: string;
    database_type: string;
    hosting_provider: string;
    country_location: string;
  };
}

// Helper functions for type conversion
const ensureArray = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string');
  }
  return [];
};

const ensureMxRecords = (value: any): Array<{ priority: number; exchange: string }> => {
  if (Array.isArray(value)) {
    return value.filter(item => 
      item && typeof item === 'object' && 
      typeof item.priority === 'number' && 
      typeof item.exchange === 'string'
    );
  }
  return [];
};

const ensureCnameRecords = (value: any): Array<{ name: string; value: string }> => {
  if (Array.isArray(value)) {
    return value.filter(item => 
      item && typeof item === 'object' && 
      typeof item.name === 'string' && 
      typeof item.value === 'string'
    );
  }
  return [];
};

const ensureSecurityHeaders = (value: any): Record<string, any> => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, any>;
  }
  return {};
};

/** Marca de tiempo de una consulta en vivo: el momento en que respondió. */
const probeStamp = (): string => new Date().toISOString();

const UNKNOWN_IP_INFO: ASNInfo = {
  asn: 'Desconocido',
  isp: 'Desconocido',
  country: 'Desconocido',
  city: 'Desconocido',
  isChilean: false,
  complaintInfo: null,
  detectedProvider: null,
};

/**
 * La consulta de la IP respondió solo si trae un código de país ISO-2
 * (ipinfo.io). Los respaldos de lookupASN devuelven 'Chile' o 'Desconocido'
 * a partir de listas fijas de prefijos: eso no es una medición.
 */
const ipLookupAnswered = (info: ASNInfo): boolean => /^[A-Z]{2}$/.test(info.country || '');

const hostingCountryFrom = (info: ASNInfo, answered: boolean, checkedAt: string | null): HostingCountry =>
  answered
    ? { status: info.country === 'CL' ? 'chile' : 'foreign', country_code: info.country, checked_at: checkedAt }
    : { status: 'unknown', country_code: null, checked_at: null };

// Enhanced WHOIS data fetching with comprehensive retry logic
const fetchWhoisData = async (domain: string, retries = 3) => {
  console.log(`=== STARTING WHOIS FETCH FOR: ${domain} ===`);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`WHOIS attempt ${attempt}/${retries} for: ${domain}`);
      
      const { data, error } = await supabase.functions.invoke('whois-lookup', {
        body: { domain }
      });

      if (error) {
        console.error(`WHOIS error (attempt ${attempt}):`, error);
        if (attempt === retries) {
          console.log(`All WHOIS attempts failed for: ${domain}`);
          return null;
        }
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        continue;
      }

      console.log(`WHOIS raw response (attempt ${attempt}):`, JSON.stringify(data, null, 2));
      
      // Enhanced validation for meaningful data
      if (data && typeof data === 'object') {
        const hasRealData = (
          (data.created_date && data.created_date !== 'No disponible' && data.created_date.trim() !== '') ||
          (data.owner_name && data.owner_name !== 'No disponible' && data.owner_name !== 'Información privada' && data.owner_name.trim() !== '') ||
          (data.registrar && data.registrar !== 'No disponible' && data.registrar !== 'NIC Chile' && data.registrar.trim() !== '') ||
          (data.expires_date && data.expires_date !== 'No disponible' && data.expires_date.trim() !== '')
        );
        
        if (hasRealData) {
          console.log(`VALID WHOIS data found for ${domain}:`, {
            registrar: data.registrar,
            created_date: data.created_date,
            expires_date: data.expires_date,
            owner_name: data.owner_name
          });
          return data;
        } else {
          console.log(`WHOIS data is default/empty for ${domain}, retrying...`);
        }
      } else {
        console.log(`Invalid WHOIS response structure for ${domain}:`, data);
      }
      
      if (attempt < retries) {
        console.log(`⏳ Waiting before retry ${attempt + 1}...`);
        await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
      }
    } catch (error) {
      console.error(`WHOIS function call error (attempt ${attempt}):`, error);
      if (attempt === retries) {
        console.log(`All WHOIS attempts failed with errors for: ${domain}`);
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
  
  console.log(`No valid WHOIS data found after ${retries} attempts for: ${domain}`);
  return null;
};

interface DnsAnswer {
  type?: number;
  data: string;
}

// Consulta un tipo de registro en dns.google. null si la consulta no respondió.
const queryDns = async (domain: string, type: 'A' | 'MX' | 'TXT' | 'NS', typeCode: number): Promise<DnsAnswer[] | null> => {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (typeof json?.Status !== 'number') return null;
    const answer: unknown[] = Array.isArray(json.Answer) ? json.Answer : [];
    // Solo registros del tipo pedido (una consulta A puede traer CNAME intermedios).
    return answer.filter((r): r is DnsAnswer => {
      const rec = r as Partial<DnsAnswer> | null;
      return !!rec && typeof rec.data === 'string' && (rec.type == null || rec.type === typeCode);
    });
  } catch (error) {
    console.error(`Error fetching DNS ${type} records:`, error);
    return null;
  }
};

// Fetch comprehensive DNS records
const fetchDNSRecords = async (domain: string): Promise<{ records: DomainAnalysisResult['dns']; probe: ProbeStatus }> => {
  const records: DomainAnalysisResult['dns'] = {
    a_records: [],
    aaaa_records: [],
    mx_records: [],
    txt_records: [],
    cname_records: [],
    ns_records: []
  };

  const [a, mx, txt, ns] = await Promise.all([
    queryDns(domain, 'A', 1),
    queryDns(domain, 'MX', 15),
    queryDns(domain, 'TXT', 16),
    queryDns(domain, 'NS', 2),
  ]);

  if (a) records.a_records = a.map((record) => record.data);
  if (mx) {
    records.mx_records = mx.map((record) => {
      const parts = record.data.split(' ');
      return { priority: parseInt(parts[0]), exchange: parts[1] };
    });
  }
  if (txt) records.txt_records = txt.map((record) => record.data.replace(/"/g, ''));
  if (ns) records.ns_records = ns.map((record) => record.data);

  const answered = [a, mx, txt, ns].some((r) => r !== null);
  return { records, probe: { answered, checked_at: answered ? probeStamp() : null } };
};

// Enhanced technology detection with real analysis and improved hosting provider detection
const detectTechStack = async (
  domain: string,
  asnInfo: ASNInfo,
  nameservers: string[],
): Promise<{ techStack: DomainAnalysisResult['tech_stack']; siteRead: boolean }> => {
  let siteRead = false;
  console.log(`Starting technology detection for: ${domain}`);
  
  const techStack = {
    server_software: 'No detectado',
    cms_detected: 'No detectado',
    framework_detected: 'No detectado',
    cdn_provider: 'No detectado',
    analytics_tools: [],
    programming_language: 'No detectado',
    database_type: 'No detectado',
    hosting_provider: asnInfo.detectedProvider || asnInfo.isp || 'No detectado',
    country_location: 'No detectado'
  };

  try {
    // Try HTTPS first, then HTTP if needed
    const protocols = ['https', 'http'];
    let response = null;
    let htmlContent = '';
    
    for (const protocol of protocols) {
      try {
        console.log(`Trying ${protocol}://${domain}`);
        response = await fetch(`${protocol}://${domain}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; DomainAnalyzer/1.0)'
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
          redirect: 'follow'
        });
        
        if (response.ok) {
          htmlContent = await response.text();
          console.log(`Successfully fetched content via ${protocol}`);
          break;
        }
      } catch (error) {
        console.log(`Failed to fetch via ${protocol}:`, error.message);
        continue;
      }
    }

    if (!response || !response.ok) {
      console.log(`Could not fetch content for ${domain}`);
      throw new Error('site-not-readable');
    }
    siteRead = true;

    // Analyze HTTP headers
    console.log('Analyzing HTTP headers...');
    const headers = response.headers;
    
    // Server detection
    const server = headers.get('server');
    if (server) {
      console.log(`Server header found: ${server}`);
      if (server.toLowerCase().includes('nginx')) {
        techStack.server_software = 'Nginx';
      } else if (server.toLowerCase().includes('apache')) {
        techStack.server_software = 'Apache';
      } else if (server.toLowerCase().includes('iis')) {
        techStack.server_software = 'Microsoft IIS';
      } else if (server.toLowerCase().includes('cloudflare')) {
        techStack.server_software = 'Cloudflare';
        techStack.cdn_provider = 'Cloudflare';
      } else {
        techStack.server_software = server;
      }
    }

    // X-Powered-By detection
    const poweredBy = headers.get('x-powered-by');
    if (poweredBy) {
      console.log(`X-Powered-By header found: ${poweredBy}`);
      if (poweredBy.toLowerCase().includes('php')) {
        techStack.programming_language = 'PHP';
      } else if (poweredBy.toLowerCase().includes('asp.net')) {
        techStack.programming_language = 'ASP.NET';
        techStack.framework_detected = 'ASP.NET';
      }
    }

    // CDN detection from headers
    const cfRay = headers.get('cf-ray');
    if (cfRay) {
      techStack.cdn_provider = 'Cloudflare';
    }

    // Analyze HTML content
    console.log('Analyzing HTML content...');
    const htmlLower = htmlContent.toLowerCase();
    
    // WordPress detection
    if (htmlLower.includes('wp-content') || 
        htmlLower.includes('wp-includes') || 
        htmlLower.includes('wordpress') ||
        htmlContent.includes('wp-json')) {
      techStack.cms_detected = 'WordPress';
      techStack.programming_language = 'PHP';
      console.log('WordPress detected');
    }
    
    // Joomla detection
    if (htmlLower.includes('joomla') || 
        htmlLower.includes('/components/com_') ||
        htmlLower.includes('joomla.css')) {
      techStack.cms_detected = 'Joomla';
      techStack.programming_language = 'PHP';
      console.log('Joomla detected');
    }
    
    // Drupal detection
    if (htmlLower.includes('drupal') || 
        htmlLower.includes('sites/default/files') ||
        htmlLower.includes('drupal.js')) {
      techStack.cms_detected = 'Drupal';
      techStack.programming_language = 'PHP';
      console.log('Drupal detected');
    }

    // React detection
    if (htmlLower.includes('react') || 
        htmlLower.includes('__react') ||
        htmlLower.includes('react-dom')) {
      techStack.framework_detected = 'React';
      techStack.programming_language = 'JavaScript';
      console.log('React detected');
    }
    
    // Vue.js detection
    if (htmlLower.includes('vue.js') || 
        htmlLower.includes('vue.min.js') ||
        htmlLower.includes('__vue__')) {
      techStack.framework_detected = 'Vue.js';
      techStack.programming_language = 'JavaScript';
      console.log('Vue.js detected');
    }
    
    // Angular detection
    if (htmlLower.includes('angular') || 
        htmlLower.includes('ng-app') ||
        htmlLower.includes('angular.js')) {
      techStack.framework_detected = 'Angular';
      techStack.programming_language = 'JavaScript';
      console.log('Angular detected');
    }

    // Analytics detection
    const analyticsTools = [];
    if (htmlLower.includes('google-analytics') || htmlLower.includes('gtag') || htmlLower.includes('ga(')) {
      analyticsTools.push('Google Analytics');
      console.log('Google Analytics detected');
    }
    if (htmlLower.includes('facebook.net') || htmlLower.includes('fbevents.js')) {
      analyticsTools.push('Facebook Pixel');
      console.log('Facebook Pixel detected');
    }
    if (htmlLower.includes('hotjar')) {
      analyticsTools.push('Hotjar');
      console.log('Hotjar detected');
    }
    techStack.analytics_tools = analyticsTools;

    // Bootstrap detection
    if (htmlLower.includes('bootstrap') || htmlLower.includes('bootstrap.css')) {
      if (techStack.framework_detected === 'No detectado') {
        techStack.framework_detected = 'Bootstrap';
      }
      console.log('Bootstrap detected');
    }

    // jQuery detection
    if (htmlLower.includes('jquery') || htmlLower.includes('jquery.js')) {
      if (techStack.framework_detected === 'No detectado') {
        techStack.framework_detected = 'jQuery';
      }
      console.log('jQuery detected');
    }

  } catch (error) {
    console.error(`Error in technology detection for ${domain}:`, error);
  }

  // Enhanced provider detection based on nameservers and ASN info
  try {
    
    console.log(`Analyzing nameservers for hosting provider:`, nameservers);
    
    // First priority: Use ASN-detected provider if it's reliable
    if (asnInfo.detectedProvider) {
      techStack.hosting_provider = asnInfo.detectedProvider;
      console.log(`Using ASN-detected hosting provider: ${asnInfo.detectedProvider}`);
    } else if (asnInfo.isp && asnInfo.isp !== 'Desconocido') {
      techStack.hosting_provider = asnInfo.isp;
      console.log(`Using ASN-detected ISP: ${asnInfo.isp}`);
    }
    
    // Override with nameserver-specific detection if available
    if (nameservers.some(ns => ns.includes('hostingplus'))) {
      techStack.hosting_provider = 'HostingPlus';
    } else if (nameservers.some(ns => ns.includes('planetahosting'))) {
      techStack.hosting_provider = 'Planeta Hosting';
    } else if (nameservers.some(ns => ns.includes('cloudflare'))) {
      techStack.hosting_provider = 'Cloudflare';
      techStack.cdn_provider = 'Cloudflare';
    } else if (nameservers.some(ns => ns.includes('netlify'))) {
      techStack.hosting_provider = 'Netlify';
    } else if (nameservers.some(ns => ns.includes('godaddy'))) {
      techStack.hosting_provider = 'GoDaddy';
    } else if (nameservers.some(ns => ns.includes('bluehost'))) {
      techStack.hosting_provider = 'Bluehost';
    } else if (nameservers.some(ns => ns.includes('hostgator'))) {
      techStack.hosting_provider = 'HostGator';
    }

    // Set location based on ASN info
    // Solo con una consulta de IP que respondió (ver ipLookupAnswered).
    if (asnInfo.city && asnInfo.city !== 'Desconocido' && ipLookupAnswered(asnInfo)) {
      techStack.country_location = `${asnInfo.city}, ${asnInfo.country}`;
    }

  } catch (error) {
    console.error('Error analyzing nameservers:', error);
  }

  console.log(`Technology detection completed for ${domain}:`, techStack);
  return { techStack, siteRead };
};

// Enhanced SSL status checking with multiple validation methods
const checkSSLStatus = async (domain: string): Promise<{ sslInfo: DomainAnalysisResult['ssl']; probe: ProbeStatus }> => {
  let answered = false;
  console.log(`Starting comprehensive SSL analysis for: ${domain}`);
  
  const sslInfo = {
    ssl_enabled: false,
    ssl_issuer: 'Desconocido',
    ssl_expires_date: '',
    ssl_grade: 'Desconocido',
    https_redirect: false,
    security_headers: {}
  };

  // Method 1: Direct HTTPS test with comprehensive checks
  try {
    console.log(`Method 1: Testing direct HTTPS connection for ${domain}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`https://${domain}`, { 
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    clearTimeout(timeoutId);
    answered = true;
    
    if (response.ok || response.status === 301 || response.status === 302) {
      console.log(`HTTPS connection successful for ${domain}`);
      sslInfo.ssl_enabled = true;
      
      // Check for HTTPS redirect if we got a redirect response
      if (response.status === 301 || response.status === 302) {
        const location = response.headers.get('location');
        if (location && location.startsWith('https://')) {
          sslInfo.https_redirect = true;
        }
      }
      
      // Extract security headers
      const securityHeaders = ['strict-transport-security', 'x-frame-options', 'x-content-type-options', 'content-security-policy'];
      securityHeaders.forEach(header => {
        const value = response.headers.get(header);
        if (value) {
          sslInfo.security_headers[header] = value;
        }
      });
      
    } else {
      console.log(`HTTPS connection returned status ${response.status} for ${domain}`);
    }
    
  } catch (error) {
    console.log(`Method 1 failed for ${domain}:`, error.message);
  }

  // Method 2: Test HTTP to HTTPS redirect if SSL wasn't detected
  if (!sslInfo.ssl_enabled) {
    try {
      console.log(`Method 2: Testing HTTP to HTTPS redirect for ${domain}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const httpResponse = await fetch(`http://${domain}`, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'manual'
      });
      
      clearTimeout(timeoutId);
      answered = true;
      
      if (httpResponse.status === 301 || httpResponse.status === 302) {
        const location = httpResponse.headers.get('location');
        if (location && location.startsWith('https://')) {
          console.log(`HTTP to HTTPS redirect detected for ${domain}`);
          sslInfo.ssl_enabled = true;
          sslInfo.https_redirect = true;
        }
      }
      
    } catch (error) {
      console.log(`Method 2 failed for ${domain}:`, error.message);
    }
  }

  // Method 3: Try alternative HTTPS test with different approach
  if (!sslInfo.ssl_enabled) {
    try {
      console.log(`Method 3: Alternative HTTPS test for ${domain}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      
      // Try to fetch a simple resource
      const response = await fetch(`https://${domain}/favicon.ico`, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow'
      });
      
      clearTimeout(timeoutId);
      answered = true;
      
      // Even if favicon doesn't exist, if we get a response, SSL is working
      if (response.status < 500) {
        console.log(`Alternative HTTPS test successful for ${domain} (status: ${response.status})`);
        sslInfo.ssl_enabled = true;
      }
      
    } catch (error) {
      console.log(`Method 3 failed for ${domain}:`, error.message);
    }
  }

  // Method 4: Use SSL Labs API for additional verification (optional, for critical cases)
  if (!sslInfo.ssl_enabled && domain.includes('hostingplus')) {
    try {
      console.log(`Method 4: SSL Labs verification for critical domain ${domain}`);
      
      const sslLabsResponse = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${domain}&publish=off&all=done`, {
        signal: AbortSignal.timeout(15000)
      });
      
      if (sslLabsResponse.ok) {
        const sslData = await sslLabsResponse.json();
        if (sslData.status === 'READY' && sslData.endpoints && sslData.endpoints.length > 0) {
          const endpoint = sslData.endpoints[0];
          if (endpoint.grade) {
            answered = true;
            console.log(`SSL Labs confirms SSL for ${domain} with grade ${endpoint.grade}`);
            sslInfo.ssl_enabled = true;
            sslInfo.ssl_grade = endpoint.grade;
          }
        }
      }
      
    } catch (error) {
      console.log(`Method 4 (SSL Labs) failed for ${domain}:`, error.message);
    }
  }

  console.log(`SSL analysis completed for ${domain}:`, {
    ssl_enabled: sslInfo.ssl_enabled,
    https_redirect: sslInfo.https_redirect,
    security_headers_count: Object.keys(sslInfo.security_headers).length
  });

  return { sslInfo, probe: { answered, checked_at: answered ? probeStamp() : null } };
};

// Enhanced save function with detailed logging and error handling
const saveDomainData = async (domain: string, analysisResult: DomainAnalysisResult) => {
  try {
    console.log(`STARTING database save for: ${domain}`);
    console.log(`WHOIS data to save:`, JSON.stringify(analysisResult.whois, null, 2));
    
    // First, find or create the domain record
    let { data: domainRecord, error: domainError } = await supabase
      .from('domains')
      .select('id')
      .eq('domain', domain)
      .maybeSingle();

    if (domainError) {
      console.error('Error fetching domain:', domainError);
      throw domainError;
    }

    if (!domainRecord) {
      console.log('Creating new domain record');
      const { data: newDomain, error: insertError } = await supabase
        .from('domains')
        .insert([{ domain }])
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating domain:', insertError);
        throw insertError;
      }
      domainRecord = newDomain;
      console.log('Domain record created with ID:', domainRecord.id);
    } else {
      console.log('Found existing domain record with ID:', domainRecord.id);
    }

    const domainId = domainRecord.id;

    // Save WHOIS info with enhanced error handling and logging
    console.log(`Saving WHOIS data for domain ID: ${domainId}`);
    
    const whoisDataToSave = {
      domain_id: domainId,
      registrar: analysisResult.whois.registrar || 'No disponible',
      created_date: analysisResult.whois.created_date || 'No disponible',
      expires_date: analysisResult.whois.expires_date || 'No disponible',
      status: analysisResult.whois.status || 'No disponible',
      owner_name: analysisResult.whois.owner_name || 'No disponible',
      organization: analysisResult.whois.organization || 'No disponible',
      email: analysisResult.whois.email || 'No disponible',
      dnssec_status: analysisResult.whois.dnssec_status || 'No disponible',
      updated_at: new Date().toISOString(),
      cached_at: new Date().toISOString()
    };
    
    console.log(`WHOIS data prepared for save:`, JSON.stringify(whoisDataToSave, null, 2));
    
    const { data: whoisData, error: whoisError } = await supabase
      .from('whois_info')
      .upsert(whoisDataToSave, { onConflict: 'domain_id' })
      .select();

    if (whoisError) {
      console.error('Error saving WHOIS info:', whoisError);
      console.error('Failed data structure:', whoisDataToSave);
    } else {
      console.log('WHOIS info saved successfully:', whoisData);
    }

    // Save DNS info with improved error handling
    console.log('Saving DNS data...');
    const { error: dnsError } = await supabase
      .from('dns_info')
      .upsert({
        domain_id: domainId,
        ip: analysisResult.basic.ip,
        ns: analysisResult.dns.ns_records,
        mx_records: analysisResult.dns.mx_records,
        txt_records: analysisResult.dns.txt_records,
        cname_records: analysisResult.dns.cname_records,
        aaaa_records: analysisResult.dns.aaaa_records,
        updated_at: new Date().toISOString()
      }, { onConflict: 'domain_id' });

    if (dnsError) {
      console.error('Error saving DNS info:', dnsError);
    } else {
      console.log('DNS info saved successfully');
    }

    // Save SSL info
    await supabase
      .from('ssl_info')
      .upsert({
        domain_id: domainId,
        ssl_enabled: analysisResult.ssl.ssl_enabled,
        ssl_issuer: analysisResult.ssl.ssl_issuer,
        ssl_grade: analysisResult.ssl.ssl_grade,
        https_redirect: analysisResult.ssl.https_redirect,
        security_headers: analysisResult.ssl.security_headers,
        updated_at: new Date().toISOString()
      }, { onConflict: 'domain_id' });

    // Save tech stack info
    console.log('Saving tech stack data...');
    const { error: techError } = await supabase
      .from('tech_stack')
      .upsert({
        domain_id: domainId,
        server_software: analysisResult.tech_stack.server_software,
        cms_detected: analysisResult.tech_stack.cms_detected,
        framework_detected: analysisResult.tech_stack.framework_detected,
        cdn_provider: analysisResult.tech_stack.cdn_provider,
        analytics_tools: analysisResult.tech_stack.analytics_tools,
        programming_language: analysisResult.tech_stack.programming_language,
        database_type: analysisResult.tech_stack.database_type,
        hosting_provider: analysisResult.tech_stack.hosting_provider,
        country_location: analysisResult.tech_stack.country_location,
        detected_at: new Date().toISOString()
      }, { onConflict: 'domain_id' });

    if (techError) {
      console.error('Error saving tech stack info:', techError);
    } else {
      console.log('Tech stack info saved successfully');
    }

    console.log(`All data saved successfully for: ${domain}`);

  } catch (error) {
    console.error('Critical error saving domain data:', error);
    throw error;
  }
};

// Main analysis function with enhanced ASN lookup and complaint information
export const analyzeDomain = async (domain: string): Promise<DomainAnalysisResult> => {
  console.log(`STARTING comprehensive analysis for: ${domain}`);

  // Fetch DNS records first as they're needed for other analyses
  console.log('Fetching DNS records...');
  const { records: dnsRecords, probe: dnsProbe } = await fetchDNSRecords(domain);
  const primaryIP = dnsRecords.a_records[0] || '–';
  console.log(`Primary IP found: ${primaryIP}`);

  // Perform ASN lookup for real IP information with complaint data
  console.log('Performing ASN lookup with complaint detection...');
  const rawIpInfo = await lookupASN(primaryIP);
  const ipAnswered = ipLookupAnswered(rawIpInfo);
  const ipCheckedAt = ipAnswered ? probeStamp() : null;
  // Si la consulta de la IP no respondió, nada derivado de ella se usa (ASN, ISP, ciudad, reclamos).
  const asnInfo = ipAnswered ? rawIpInfo : UNKNOWN_IP_INFO;
  console.log(`ASN Info (answered: ${ipAnswered}):`, asnInfo);

  // Run parallel analyses with enhanced information
  console.log('Starting parallel analyses...');
  const [sslResult, techResult, whoisInfo] = await Promise.all([
    checkSSLStatus(domain),
    detectTechStack(domain, asnInfo, dnsRecords.ns_records),
    fetchWhoisData(domain, 3) // Increased to 3 retries
  ]);
  const { sslInfo, probe: sslProbe } = sslResult;
  const { techStack, siteRead } = techResult;
  const whoisCheckedAt = whoisInfo ? probeStamp() : null;
  const hostingCountry = hostingCountryFrom(asnInfo, ipAnswered, ipCheckedAt);

  console.log('Analysis results summary:');
  console.log('  - SSL Info:', sslInfo?.ssl_enabled ? 'SSL Enabled' : 'No SSL');
  console.log('  - Tech Stack:', techStack?.hosting_provider || 'Unknown provider');
  console.log('  - WHOIS Info:', whoisInfo ? 'Real data found' : 'Using fallback data');
  console.log('  - ASN Info:', `${asnInfo.asn} (${asnInfo.isp})`);
  console.log('  - Complaint Info:', asnInfo.complaintInfo ? `${asnInfo.complaintInfo.level} (${asnInfo.complaintInfo.count} reclamos)` : 'None');

  // Create the comprehensive result with real ASN and complaint information
  const analysisResult: DomainAnalysisResult = {
    basic: {
      domain,
      ip: primaryIP,
      ip_chile: hostingCountry.status === 'chile',
      provider: asnInfo.detectedProvider || techStack.hosting_provider,
      asn: asnInfo.asn !== 'Desconocido' ? `${asnInfo.asn} (${asnInfo.isp})` : 'ASN no disponible',
      nameservers: dnsRecords.ns_records,
      location: asnInfo.city !== 'Desconocido' ? `${asnInfo.city}, ${asnInfo.country}` : undefined,
      isp: asnInfo.isp !== 'Desconocido' ? asnInfo.isp : undefined,
      complaintInfo: asnInfo.complaintInfo,
      detectedProvider: asnInfo.detectedProvider,
      hosting_country: hostingCountry
    },
    dns: dnsRecords,
    whois: whoisInfo || {
      registrar: 'NIC Chile',
      created_date: 'No disponible',
      expires_date: 'No disponible',
      status: 'No disponible',
      owner_name: 'Información privada (NIC Chile)',
      organization: 'Información privada (NIC Chile)',
      email: 'Información privada (NIC Chile)',
      dnssec_status: 'No configurado'
    },
    ssl: sslInfo,
    performance: null,
    probes: {
      dns: dnsProbe,
      whois: { answered: !!whoisInfo, checked_at: whoisCheckedAt },
      ssl: sslProbe,
      ip: { answered: ipAnswered, checked_at: ipCheckedAt },
      site: { answered: siteRead, checked_at: siteRead ? probeStamp() : null }
    },
    tech_stack: techStack
  };

  console.log(`Final analysis result for ${domain}:`, {
    whois_has_real_data: whoisInfo ? 'YES' : 'NO',
    whois_registrar: analysisResult.whois.registrar,
    whois_created: analysisResult.whois.created_date,
    whois_owner: analysisResult.whois.owner_name,
    asn_info: analysisResult.basic.asn,
    hosting_provider: analysisResult.basic.provider,
    location: analysisResult.basic.location,
    complaint_level: analysisResult.basic.complaintInfo?.level || 'none',
    complaint_count: analysisResult.basic.complaintInfo?.count || 0
  });

  // Save to database for caching with enhanced error handling
  try {
    await saveDomainData(domain, analysisResult);
    console.log(`Domain data saved successfully for: ${domain}`);
  } catch (error) {
    console.error(`Failed to save domain data for ${domain}:`, error);
    // Continue even if saving fails, but log the error
  }

  console.log(`Analysis completed for: ${domain}`);
  return analysisResult;
};

// Enhanced cache loading with improved data validation and complaint info
export const loadCachedAnalysis = async (domain: string): Promise<DomainAnalysisResult | null> => {
  try {
    console.log(`Loading cached analysis for: ${domain}`);
    
    const { data: domainData, error } = await supabase
      .from('domains')
      .select(`
        id,
        dns_info(*),
        ssl_info(*),
        tech_stack(*),
        whois_info(*)
      `)
      .eq('domain', domain)
      .single();

    if (error || !domainData) {
      console.log(`No cached data found for: ${domain}`);
      return null;
    }

    const whoisInfo = domainData.whois_info?.[0];
    const dnsInfo = domainData.dns_info?.[0];
    const sslInfo = domainData.ssl_info?.[0];
    const techInfo = domainData.tech_stack?.[0];

    if (!dnsInfo || !whoisInfo) {
      console.log(`Incomplete cached data for: ${domain}`);
      return null;
    }

    // Check if cached WHOIS data is meaningful (not just defaults)
    const hasRealWhoisData = (
      whoisInfo.created_date && whoisInfo.created_date !== 'No disponible' &&
      whoisInfo.owner_name && whoisInfo.owner_name !== 'No disponible' && whoisInfo.owner_name.indexOf('Información privada') === -1
    );

    // Check cache age (prefer fresh data if cache is old)
    const cacheAge = whoisInfo.cached_at ? Date.now() - new Date(whoisInfo.cached_at).getTime() : Infinity;
    const isCacheOld = cacheAge > (24 * 60 * 60 * 1000); // 24 hours

    if (!hasRealWhoisData || isCacheOld) {
      console.log(`Cached data is old or incomplete for ${domain}, will fetch fresh data`);
      return null;
    }

    console.log(`Using valid cached analysis for: ${domain}`);
    console.log(`Cached WHOIS data:`, {
      registrar: whoisInfo.registrar,
      created_date: whoisInfo.created_date,
      owner_name: whoisInfo.owner_name
    });

    // For cached data, we'll perform a quick ASN lookup to get current complaint info
    const rawIpInfo = await lookupASN(dnsInfo.ip || '');
    const ipAnswered = ipLookupAnswered(rawIpInfo);
    const ipCheckedAt = ipAnswered ? probeStamp() : null;
    const asnInfo = ipAnswered ? rawIpInfo : UNKNOWN_IP_INFO;
    const hostingCountry = hostingCountryFrom(asnInfo, ipAnswered, ipCheckedAt);
    const cachedNs = ensureArray(dnsInfo.ns);
    const cachedIp = dnsInfo.ip || '';
    // En caché no se guardó si cada consulta respondió: solo se confía en hallazgos positivos.
    const dnsAnswered = cachedNs.length > 0 || /^\d{1,3}(\.\d{1,3}){3}$/.test(cachedIp);
    const sslAnswered = !!sslInfo?.ssl_enabled;
    const siteRead = !!techInfo && ['server_software', 'cms_detected', 'framework_detected']
      .some((k) => techInfo[k] && !['No detectado', 'Desconocido'].includes(techInfo[k]));

    return {
      basic: {
        domain,
        ip: dnsInfo.ip || '–',
        ip_chile: hostingCountry.status === 'chile',
        provider: asnInfo.detectedProvider || techInfo?.hosting_provider || asnInfo.isp || 'Desconocido',
        asn: asnInfo.asn !== 'Desconocido' ? `${asnInfo.asn} (${asnInfo.isp})` : 'ASN no disponible',
        nameservers: ensureArray(dnsInfo.ns),
        location: asnInfo.city !== 'Desconocido' ? `${asnInfo.city}, ${asnInfo.country}` : undefined,
        isp: asnInfo.isp !== 'Desconocido' ? asnInfo.isp : undefined,
        complaintInfo: asnInfo.complaintInfo,
        detectedProvider: asnInfo.detectedProvider,
        hosting_country: hostingCountry
      },
      dns: {
        a_records: [dnsInfo.ip || ''],
        aaaa_records: ensureArray(dnsInfo.aaaa_records),
        mx_records: ensureMxRecords(dnsInfo.mx_records),
        txt_records: ensureArray(dnsInfo.txt_records),
        cname_records: ensureCnameRecords(dnsInfo.cname_records),
        ns_records: ensureArray(dnsInfo.ns)
      },
      whois: {
        registrar: whoisInfo?.registrar || 'No disponible',
        created_date: whoisInfo?.created_date || 'No disponible',
        expires_date: whoisInfo?.expires_date || 'No disponible',
        status: whoisInfo?.status || 'No disponible',
        owner_name: whoisInfo?.owner_name || 'Información privada',
        organization: whoisInfo?.organization || 'Información privada',
        email: whoisInfo?.email || 'Información privada',
        dnssec_status: whoisInfo?.dnssec_status || 'No configurado'
      },
      ssl: {
        ssl_enabled: sslInfo?.ssl_enabled || false,
        ssl_issuer: sslInfo?.ssl_issuer || 'Desconocido',
        ssl_expires_date: sslInfo?.ssl_expires_date || '',
        ssl_grade: sslInfo?.ssl_grade || 'Desconocido',
        https_redirect: sslInfo?.https_redirect || false,
        security_headers: ensureSecurityHeaders(sslInfo?.security_headers)
      },
      performance: null,
      probes: {
        dns: { answered: dnsAnswered, checked_at: dnsAnswered ? (dnsInfo.updated_at || whoisInfo.cached_at || null) : null },
        whois: { answered: true, checked_at: whoisInfo.cached_at || whoisInfo.updated_at || null },
        ssl: { answered: sslAnswered, checked_at: sslAnswered ? (sslInfo?.updated_at || null) : null },
        ip: { answered: ipAnswered, checked_at: ipCheckedAt },
        site: { answered: siteRead, checked_at: siteRead ? (techInfo?.detected_at || null) : null }
      },
      tech_stack: {
        server_software: techInfo?.server_software || 'Desconocido',
        cms_detected: techInfo?.cms_detected || 'Desconocido',
        framework_detected: techInfo?.framework_detected || 'Desconocido',
        cdn_provider: techInfo?.cdn_provider || 'Ninguno',
        analytics_tools: ensureArray(techInfo?.analytics_tools),
        programming_language: techInfo?.programming_language || 'Desconocido',
        database_type: techInfo?.database_type || 'Desconocido',
        hosting_provider: asnInfo.detectedProvider || techInfo?.hosting_provider || asnInfo.isp || 'Desconocido',
        country_location: asnInfo.city !== 'Desconocido' ? `${asnInfo.city}, ${asnInfo.country}` : 'Desconocido'
      }
    };

  } catch (error) {
    console.error(`Error loading cached analysis for ${domain}:`, error);
    return null;
  }
};
