
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhoisData {
  registrar: string;
  created_date: string;
  expires_date: string;
  status: string;
  owner_name: string;
  organization: string;
  email: string;
  dnssec_status: string;
}

// Parse WHOIS response for .cl domains
const parseWhoisResponse = (whoisText: string): WhoisData => {
  const lines = whoisText.split('\n');
  const data: WhoisData = {
    registrar: 'No disponible',
    created_date: 'No disponible',
    expires_date: 'No disponible',
    status: 'No disponible',
    owner_name: 'No disponible',
    organization: 'No disponible',
    email: 'No disponible',
    dnssec_status: 'No disponible'
  };

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.includes('Registrar:') || trimmed.includes('Registrar Name:')) {
      data.registrar = trimmed.split(':')[1]?.trim() || data.registrar;
    }
    
    if (trimmed.includes('Creation Date:') || trimmed.includes('Fecha de creación:')) {
      const dateStr = trimmed.split(':').slice(1).join(':').trim();
      data.created_date = dateStr || data.created_date;
    }
    
    if (trimmed.includes('Expiration Date:') || trimmed.includes('Registry Expiry Date:')) {
      const dateStr = trimmed.split(':').slice(1).join(':').trim();
      data.expires_date = dateStr || data.expires_date;
    }
    
    if (trimmed.includes('Domain Status:') || trimmed.includes('Status:')) {
      data.status = trimmed.split(':')[1]?.trim() || data.status;
    }
    
    if (trimmed.includes('Registrant Name:') || trimmed.includes('Titular:')) {
      data.owner_name = trimmed.split(':')[1]?.trim() || data.owner_name;
    }
    
    if (trimmed.includes('Registrant Organization:') || trimmed.includes('Organización:')) {
      data.organization = trimmed.split(':')[1]?.trim() || data.organization;
    }
    
    if (trimmed.includes('Registrant Email:') || trimmed.includes('Email:')) {
      data.email = trimmed.split(':')[1]?.trim() || data.email;
    }
    
    if (trimmed.includes('DNSSEC:')) {
      data.dnssec_status = trimmed.split(':')[1]?.trim() || data.dnssec_status;
    }
  }

  return data;
};

// Fetch WHOIS data using multiple sources
const fetchWhoisData = async (domain: string): Promise<WhoisData> => {
  console.log(`Fetching WHOIS data for: ${domain}`);
  
  try {
    // Try whois-json API first
    const whoisJsonResponse = await fetch(`https://whois-json.whoisjsonapi.com/v1/${domain}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; WhoisBot/1.0)'
      }
    });

    if (whoisJsonResponse.ok) {
      const whoisData = await whoisJsonResponse.json();
      console.log('WHOIS JSON API response:', whoisData);
      
      if (whoisData && whoisData.raw) {
        return parseWhoisResponse(whoisData.raw);
      }
    }
  } catch (error) {
    console.error('Error with whois-json API:', error);
  }

  try {
    // Fallback to a simple whois service
    const simpleWhoisResponse = await fetch(`https://api.whois.ai/v1/whois/${domain}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; WhoisBot/1.0)'
      }
    });

    if (simpleWhoisResponse.ok) {
      const whoisData = await simpleWhoisResponse.json();
      console.log('Simple WHOIS API response:', whoisData);
      
      if (whoisData && whoisData.raw_whois) {
        return parseWhoisResponse(whoisData.raw_whois);
      }
    }
  } catch (error) {
    console.error('Error with simple whois API:', error);
  }

  // If both APIs fail, return default values
  console.log('All WHOIS APIs failed, returning default values');
  return {
    registrar: 'No disponible',
    created_date: 'No disponible',
    expires_date: 'No disponible',
    status: 'No disponible',
    owner_name: 'Información privada',
    organization: 'Información privada',
    email: 'Información privada',
    dnssec_status: 'No configurado'
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain } = await req.json();
    
    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const whoisData = await fetchWhoisData(domain);
    
    return new Response(
      JSON.stringify(whoisData),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in whois-lookup function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch WHOIS data',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
