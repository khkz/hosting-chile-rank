
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DNSLYTICS_API_KEY = Deno.env.get('DNSLYTICS_API_KEY') || '';
const DNSLYTICS_API_BASE = 'https://api.dnslytics.com/v1';

// CORS headers for our API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache to store API responses temporarily
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body for POST method
    let domain = '';
    let endpoint = '';
    
    if (req.method === 'POST') {
      const body = await req.json();
      domain = body.domain;
      endpoint = body.endpoint;
    } else {
      // Support for backwards compatibility with GET method
      const url = new URL(req.url);
      endpoint = url.pathname.split('/').pop() || '';
      domain = url.searchParams.get('domain') || '';
    }
    
    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create cache key from endpoint and domain
    const cacheKey = `${endpoint}:${domain}`;
    
    // Check if we have a cached response and if it's still valid
    const cachedData = cache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
      console.log(`Using cached data for ${cacheKey}`);
      return new Response(
        JSON.stringify(cachedData.data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine which DNSlytics API endpoint to call based on the requested endpoint
    let apiEndpoint = '';
    switch (endpoint) {
      case 'domain-info':
        apiEndpoint = `${DNSLYTICS_API_BASE}/domain/${domain}`;
        break;
      case 'domain-history':
        apiEndpoint = `${DNSLYTICS_API_BASE}/domain/${domain}/history`;
        break;
      case 'technologies':
        apiEndpoint = `${DNSLYTICS_API_BASE}/domain/${domain}/technologies`;
        break;
      case 'ssl':
        apiEndpoint = `${DNSLYTICS_API_BASE}/domain/${domain}/ssl`;
        break;
      case 'performance':
        apiEndpoint = `${DNSLYTICS_API_BASE}/domain/${domain}/performance`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
    
    // Make the request to DNSlytics API
    console.log(`Fetching data from DNSlytics for ${domain} (endpoint: ${endpoint})`);
    const response = await fetch(apiEndpoint, {
      headers: {
        'Authorization': `Bearer ${DNSLYTICS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      // Handle API errors
      const errorText = await response.text();
      console.error(`DNSlytics API error: ${response.status} ${errorText}`);
      
      // If the error is due to rate limiting, try to use cached data if available
      if (response.status === 429 && cachedData) {
        console.log(`Rate limited, using older cached data for ${cacheKey}`);
        return new Response(
          JSON.stringify(cachedData.data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `DNSlytics API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    
    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
