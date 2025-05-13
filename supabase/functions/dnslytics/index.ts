
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DNSLYTICS_API_KEY = Deno.env.get('DNSLYTICS_API_KEY') || '';
const DNSLYTICS_API_BASE = 'https://api.dnslytics.net/v1';

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

    // Verify if API key is available
    if (!DNSLYTICS_API_KEY) {
      console.error('DNSLYTICS_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'API key configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        apiEndpoint = `${DNSLYTICS_API_BASE}/domain?apikey=${DNSLYTICS_API_KEY}&domain=${domain}`;
        break;
      case 'domain-history':
        apiEndpoint = `${DNSLYTICS_API_BASE}/domainhistory?apikey=${DNSLYTICS_API_KEY}&domain=${domain}`;
        break;
      case 'technologies':
        apiEndpoint = `${DNSLYTICS_API_BASE}/technologies?apikey=${DNSLYTICS_API_KEY}&domain=${domain}`;
        break;
      case 'ssl':
        apiEndpoint = `${DNSLYTICS_API_BASE}/ssl?apikey=${DNSLYTICS_API_KEY}&domain=${domain}`;
        break;
      case 'performance':
        apiEndpoint = `${DNSLYTICS_API_BASE}/performance?apikey=${DNSLYTICS_API_KEY}&domain=${domain}`;
        break;
      case 'account-info':
        apiEndpoint = `${DNSLYTICS_API_BASE}/accountinfo?apikey=${DNSLYTICS_API_KEY}`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
    
    // Make the request to DNSlytics API
    console.log(`Fetching data from DNSlytics for ${domain} (endpoint: ${endpoint})`);
    
    // Implement retry logic
    const maxRetries = 3;
    let retries = 0;
    let response = null;
    
    while (retries < maxRetries) {
      try {
        response = await fetch(apiEndpoint, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) break;
        
        console.log(`Retry ${retries + 1}/${maxRetries}: API returned status ${response.status}`);
        retries++;
        
        // Simple exponential backoff
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        }
      } catch (fetchError) {
        console.error(`Fetch error on retry ${retries + 1}/${maxRetries}:`, fetchError);
        retries++;
        
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        } else {
          throw fetchError; // Re-throw the last error if all retries fail
        }
      }
    }
    
    if (!response || !response.ok) {
      // Handle API errors
      const errorText = response ? await response.text() : 'No response received';
      console.error(`DNSlytics API error: ${response?.status || 'No response'} ${errorText}`);
      
      // If the error is due to rate limiting, try to use cached data if available
      if (response?.status === 429 && cachedData) {
        console.log(`Rate limited, using older cached data for ${cacheKey}`);
        return new Response(
          JSON.stringify(cachedData.data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: `DNSlytics API error: ${response?.status || 'Connection failed'}`, 
          details: errorText,
          endpoint: apiEndpoint.replace(DNSLYTICS_API_KEY, 'REDACTED') // Log the URL but hide the API key
        }),
        { status: response?.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
