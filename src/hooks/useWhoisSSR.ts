
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface WhoisSSRData {
  registrar: string;
  created_date: string;
  expires_date: string;
  owner_name: string;
  organization: string;
  status: string;
  dnssec_status: string;
  isFromSSR?: boolean;
}

export const useWhoisSSR = (domain: string) => {
  return useQuery({
    queryKey: ['whois-ssr', domain],
    queryFn: async (): Promise<WhoisSSRData> => {
      console.log(`🔍 Fetching WHOIS data for hydration: ${domain}`);
      
      // First try to get cached data from Supabase
      const { data: cachedData, error } = await supabase
        .from('whois_info')
        .select('*')
        .eq('domain_id', domain)
        .gte('cached_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .single();

      if (!error && cachedData) {
        console.log(`✅ Using cached WHOIS data for hydration: ${domain}`);
        return {
          registrar: cachedData.registrar || 'NIC Chile',
          created_date: cachedData.created_date || 'No disponible',
          expires_date: cachedData.expires_date || 'No disponible',
          owner_name: cachedData.owner_name || 'Información privada',
          organization: cachedData.organization || 'Información privada',
          status: cachedData.status || 'Activo',
          dnssec_status: cachedData.dnssec_status || 'No configurado',
          isFromSSR: false
        };
      }

      // If no cache, call the whois-lookup function
      console.log(`🔄 Calling whois-lookup for hydration: ${domain}`);
      const { data: whoisResponse, error: whoisError } = await supabase.functions.invoke('whois-lookup', {
        body: { domain }
      });

      if (whoisError) {
        console.error('❌ WHOIS lookup error during hydration:', whoisError);
        throw new Error('WHOIS lookup failed');
      }

      return {
        registrar: whoisResponse.registrar || 'NIC Chile',
        created_date: whoisResponse.created_date || 'No disponible',
        expires_date: whoisResponse.expires_date || 'No disponible',
        owner_name: whoisResponse.owner_name || 'Información privada',
        organization: whoisResponse.organization || 'Información privada',
        status: whoisResponse.status || 'Activo',
        dnssec_status: whoisResponse.dnssec_status || 'No configurado',
        isFromSSR: false
      };
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 1,
    enabled: !!domain && domain.length > 0,
  });
};

// Helper to detect if we're running with SSR data
export const detectSSRData = (): WhoisSSRData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try to extract data from SSR HTML if available
    const titleElement = document.querySelector('title');
    const descriptionElement = document.querySelector('meta[name="description"]');
    
    if (titleElement && descriptionElement) {
      const title = titleElement.textContent || '';
      const description = descriptionElement.getAttribute('content') || '';
      
      // Extract domain from title
      const domainMatch = title.match(/^([^-]+)/);
      const domain = domainMatch ? domainMatch[1].trim() : '';
      
      if (domain) {
        console.log(`🔍 Detected SSR data for domain: ${domain}`);
        return {
          registrar: 'Datos SSR',
          created_date: 'Cargando...',
          expires_date: 'Cargando...',
          owner_name: 'Cargando...',
          organization: 'Cargando...',
          status: 'Cargando...',
          dnssec_status: 'Cargando...',
          isFromSSR: true
        };
      }
    }
  } catch (error) {
    console.log('No SSR data detected');
  }
  
  return null;
};
