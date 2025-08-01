import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const host = req.headers.get('host') || req.headers.get('x-forwarded-host');
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    
    console.log(`Incoming request from host: ${host}`);
    
    // Target domain
    const targetDomain = 'eligetuhosting.cl';
    
    // Check if the request is not from the target domain
    if (host && !host.includes(targetDomain)) {
      // Build the redirect URL
      const pathname = url.searchParams.get('path') || '/';
      const search = url.searchParams.get('search') || '';
      const redirectUrl = `https://${targetDomain}${pathname}${search}`;
      
      console.log(`Redirecting from ${host} to ${redirectUrl}`);
      
      return Response.json({
        shouldRedirect: true,
        redirectUrl: redirectUrl,
        originalHost: host,
        targetDomain: targetDomain
      }, {
        headers: corsHeaders
      });
    }
    
    // No redirect needed
    return Response.json({
      shouldRedirect: false,
      currentHost: host,
      targetDomain: targetDomain
    }, {
      headers: corsHeaders
    });
    
  } catch (error) {
    console.error('Error in domain-redirect function:', error);
    return Response.json({
      error: 'Internal server error',
      message: error.message
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
});