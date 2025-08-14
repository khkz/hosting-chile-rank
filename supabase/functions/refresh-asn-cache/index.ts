import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔄 Starting ASN cache refresh...');

    // Chilean providers to refresh
    const chileanProviders = [
      'chile', 'claro', 'entel', 'movistar', 'vtr', 'gtd', 'mundo', 'tie', 'netline',
      'hosting.cl', 'netuno', 'rdc', 'redvoiss', 'solucionhost', 'hostingplus',
      'ecohosting', 'pluschile', 'webhost', 'gigas'
    ];

    // Refresh search cache for each provider
    let refreshedCount = 0;
    for (const provider of chileanProviders) {
      try {
        // Check if cache exists and is expiring soon (within 1 day)
        const { data: existingCache } = await supabase
          .from('asn_search_cache')
          .select('expires_at')
          .eq('search_term', provider.toLowerCase())
          .single();

        if (existingCache) {
          const expiresAt = new Date(existingCache.expires_at);
          const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
          
          if (expiresAt > oneDayFromNow) {
            console.log(`✅ Cache for ${provider} is still fresh, skipping`);
            continue;
          }
        }

        // Fetch fresh data from BGPView API
        console.log(`🔍 Refreshing cache for: ${provider}`);
        const response = await fetch(`https://api.bgpview.io/search?query_term=${encodeURIComponent(provider)}`);
        
        if (!response.ok) {
          console.warn(`❌ Failed to fetch data for ${provider}: ${response.status}`);
          continue;
        }

        const json = await response.json();
        const asns = json?.data?.asns || [];
        const results = asns.map((a: any) => ({
          asn: a.asn,
          name: a.name || a.description_short,
          description: a.description || a.description_long,
          country_code: a.country_code || a.country,
        }));

        // Update cache
        await supabase
          .from('asn_search_cache')
          .upsert({
            search_term: provider.toLowerCase(),
            results: results,
            cached_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });

        refreshedCount++;
        console.log(`✅ Refreshed cache for ${provider} (${results.length} ASNs)`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error refreshing cache for ${provider}:`, error);
      }
    }

    // Clean up expired cache entries
    const { error: cleanupError } = await supabase
      .from('asn_search_cache')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (cleanupError) {
      console.warn('⚠️ Error cleaning up expired cache:', cleanupError);
    } else {
      console.log('🧹 Cleaned up expired cache entries');
    }

    console.log(`🎉 ASN cache refresh completed. Refreshed ${refreshedCount} providers.`);

    return new Response(
      JSON.stringify({
        success: true,
        refreshed_providers: refreshedCount,
        message: 'ASN cache refresh completed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ ASN cache refresh failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});