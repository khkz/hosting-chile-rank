import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-api-key',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const adminKey = req.headers.get('x-admin-api-key');
  const expectedKey = Deno.env.get('ADMIN_SECRET_KEY');
  if (!expectedKey || adminKey !== expectedKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { company_id, all } = body as { company_id?: string; all?: boolean };

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    let query = supabase
      .from('hosting_companies')
      .select('id, name')
      .eq('is_verified', true)
      .eq('is_curated', true)
      .eq('reputation_sync_enabled', true);

    if (company_id && !all) query = query.eq('id', company_id);

    const { data: companies, error } = await query;
    if (error) throw error;
    if (!companies || companies.length === 0) {
      return new Response(JSON.stringify({ success: true, processed: 0, results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results: Array<{ company: string; ok: boolean; error?: string }> = [];

    for (const c of companies) {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/complaints-checker`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceKey}`,
            'x-admin-api-key': expectedKey,
          },
          body: JSON.stringify({ company_name: c.name, company_id: c.id }),
        });
        const json = await res.json();
        results.push({ company: c.name, ok: !!json.success, error: json.error });
        // gentle delay to avoid hammering Serper / OpenAI
        await new Promise((r) => setTimeout(r, 1500));
      } catch (e) {
        results.push({ company: c.name, ok: false, error: e instanceof Error ? e.message : 'unknown' });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      results,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('refresh-reputation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
