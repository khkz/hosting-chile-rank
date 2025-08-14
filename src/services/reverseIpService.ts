import { supabase } from "@/integrations/supabase/client";

interface ReverseIpResult {
  domain: string;
  ip: string;
  type?: string;
}

interface CachedReverseIp {
  domains: ReverseIpResult[];
  domain_count: number;
  cached_at: string;
}

// Get first IP from a CIDR prefix for lookup
function getFirstIpFromPrefix(prefix: string): string {
  const [network, mask] = prefix.split('/');
  return network;
}

// Check if prefix is worth looking up (avoid carrier-grade NAT, very large blocks)
function isPrefixWorthLookup(prefix: string): boolean {
  const [, mask] = prefix.split('/');
  const maskNum = parseInt(mask);
  
  // Only lookup smaller prefixes that likely have websites
  // /24 = 256 IPs, /25 = 128 IPs, /26 = 64 IPs, etc.
  return maskNum >= 24 && maskNum <= 30;
}

// Fetch reverse IP data using Supabase Edge Function proxy
async function fetchReverseIpFromAPI(ip: string): Promise<ReverseIpResult[]> {
  try {
    const { data, error } = await supabase.functions.invoke('reverse-ip-proxy', {
      body: { ip }
    });

    if (error) {
      console.error('Edge function error:', error);
      return [];
    }

    if (data && data.domains) {
      console.log(`Found ${data.domains.length} domains for IP ${ip}`);
      return data.domains;
    }
    
    return [];
  } catch (error) {
    console.error('Error calling reverse IP proxy:', error);
    return [];
  }
}

// Get reverse IP data with caching
export async function getReverseIpData(prefix: string): Promise<CachedReverseIp | null> {
  // Check if prefix is worth looking up
  if (!isPrefixWorthLookup(prefix)) {
    return null;
  }

  try {
    // Check cache first
    const { data: cached, error: cacheError } = await supabase
      .from('reverse_ip_cache')
      .select('*')
      .eq('ip_prefix', prefix)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (cacheError) {
      console.error('Error checking reverse IP cache:', cacheError);
    }

    // Return cached data if available and not expired
    if (cached) {
      return {
        domains: (cached.domains as any) || [],
        domain_count: cached.domain_count || 0,
        cached_at: cached.cached_at
      };
    }

    // Fetch fresh data
    const firstIp = getFirstIpFromPrefix(prefix);
    const domains = await fetchReverseIpFromAPI(firstIp);
    
    // Cache the results
    const cacheData = {
      ip_prefix: prefix,
      domains: domains as any,
      domain_count: domains.length,
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    const { error: insertError } = await supabase
      .from('reverse_ip_cache')
      .upsert(cacheData, { onConflict: 'ip_prefix' });

    if (insertError) {
      console.error('Error caching reverse IP data:', insertError);
    }

    return {
      domains,
      domain_count: domains.length,
      cached_at: cacheData.cached_at
    };

  } catch (error) {
    console.error('Error in getReverseIpData:', error);
    return null;
  }
}

// Classify domain types based on domain name
export function classifyDomain(domain: string): string {
  const domainLower = domain.toLowerCase();
  
  if (domainLower.includes('shop') || domainLower.includes('tienda') || domainLower.includes('store')) {
    return 'E-commerce';
  }
  if (domainLower.includes('blog') || domainLower.includes('noticias') || domainLower.includes('news')) {
    return 'Blog/Noticias';
  }
  if (domainLower.includes('empresa') || domainLower.includes('company') || domainLower.includes('corp')) {
    return 'Corporativo';
  }
  if (domainLower.includes('edu') || domainLower.includes('universidad') || domainLower.includes('colegio')) {
    return 'Educación';
  }
  if (domainLower.includes('gob') || domainLower.includes('gov') || domainLower.includes('municipio')) {
    return 'Gobierno';
  }
  
  return 'Sitio Web';
}