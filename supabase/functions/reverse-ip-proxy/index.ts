import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

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
    const { ip } = await req.json();
    
    if (!ip) {
      return new Response(
        JSON.stringify({ error: 'IP address is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching reverse IP data for: ${ip}`);

    // Try ViewDNS.info API first
    let domains = [];
    try {
      const viewdnsResponse = await fetch(`https://viewdns.info/reverseip/?host=${ip}&t=1&output=json`);
      
      if (viewdnsResponse.ok) {
        const viewdnsData = await viewdnsResponse.json();
        
        if (viewdnsData.query && viewdnsData.query.host_list) {
          domains = viewdnsData.query.host_list.map((host: any) => ({
            domain: host.name,
            ip: ip,
            type: 'website'
          }));
          console.log(`ViewDNS found ${domains.length} domains for ${ip}`);
        }
      } else {
        console.warn(`ViewDNS API error: ${viewdnsResponse.status}`);
      }
    } catch (error) {
      console.error('ViewDNS API failed:', error);
    }

    // Fallback to HackerTarget if ViewDNS failed
    if (domains.length === 0) {
      try {
        const hackerTargetResponse = await fetch(`https://api.hackertarget.com/reverseiplookup/?q=${ip}`);
        
        if (hackerTargetResponse.ok) {
          const hackerTargetData = await hackerTargetResponse.text();
          
          if (hackerTargetData && !hackerTargetData.includes('error')) {
            const hostList = hackerTargetData.split('\n').filter(host => host.trim() && !host.includes('API count'));
            domains = hostList.map(host => ({
              domain: host.trim(),
              ip: ip,
              type: 'website'
            }));
            console.log(`HackerTarget found ${domains.length} domains for ${ip}`);
          }
        }
      } catch (error) {
        console.error('HackerTarget API failed:', error);
      }
    }

    return new Response(
      JSON.stringify({ domains, count: domains.length }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in reverse-ip-proxy:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', domains: [], count: 0 }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});