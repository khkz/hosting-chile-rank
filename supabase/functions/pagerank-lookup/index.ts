import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PageRankResponse {
  status_code: number;
  response: Array<{
    status_code: number;
    page_rank_integer: number;
    page_rank_decimal: number;
    rank: string;
    domain: string;
  }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const domain = url.searchParams.get('domain');
    const updateDb = url.searchParams.get('updateDb') === 'true';

    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('OPENPAGERANK_API_KEY');
    if (!apiKey) {
      console.error('OPENPAGERANK_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'PageRank API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean domain (remove protocol and path)
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();

    console.log(`Fetching PageRank for: ${cleanDomain}`);

    // Query Open PageRank API
    const apiUrl = `https://openpagerank.com/api/v1.0/getPageRank?domains[]=${encodeURIComponent(cleanDomain)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'API-OPR': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`PageRank API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ 
          error: 'PageRank API request failed',
          status: response.status,
          details: errorText
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: PageRankResponse = await response.json();
    console.log('PageRank response:', JSON.stringify(data));

    if (!data.response || data.response.length === 0) {
      return new Response(
        JSON.stringify({ 
          domain: cleanDomain,
          page_rank: null,
          rank: null,
          success: false,
          message: 'No PageRank data found'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = data.response[0];
    const pageRank = result.page_rank_decimal;
    const rank = result.rank;

    // Update database if requested
    if (updateDb) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: updateError } = await supabase
        .from('domain_opportunities')
        .update({
          page_rank: pageRank,
          page_rank_updated_at: new Date().toISOString(),
        })
        .eq('domain_name', cleanDomain);

      if (updateError) {
        console.error('Error updating database:', updateError);
      } else {
        console.log(`Updated PageRank for ${cleanDomain} in database`);
      }
    }

    return new Response(
      JSON.stringify({
        domain: cleanDomain,
        page_rank: pageRank,
        page_rank_integer: result.page_rank_integer,
        rank: rank,
        success: true,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PageRank lookup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
