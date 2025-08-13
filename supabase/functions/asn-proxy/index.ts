import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BGPVIEW_BASE = 'https://api.bgpview.io';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint } = await req.json();
    if (typeof endpoint !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid endpoint' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const allowed = /^\/(asn\/\d+(?:\/(?:peers|prefixes))?|search\?query_term=[^\s]{1,256})$/i;
    if (!allowed.test(endpoint)) {
      return new Response(JSON.stringify({ error: 'Not allowed' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const res = await fetch(`${BGPVIEW_BASE}${endpoint}`);
    const body = await res.json();

    return new Response(JSON.stringify(body), {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('asn-proxy error:', error?.message || error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
