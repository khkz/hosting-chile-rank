import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { token } = await req.json();
    if (!token || typeof token !== 'string') {
      return new Response(JSON.stringify({ error: 'Token requerido' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: verification, error } = await supabase
      .from('complaint_verifications')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (error || !verification) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (verification.used_at) {
      return new Response(JSON.stringify({ error: 'Token ya utilizado' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (new Date(verification.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'Token expirado' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Mark complaint as verified (still pending admin moderation)
    await supabase
      .from('public_complaints')
      .update({ email_verified: true, verified_at: new Date().toISOString(), status: 'verified' })
      .eq('id', verification.complaint_id);

    await supabase
      .from('complaint_verifications')
      .update({ used_at: new Date().toISOString() })
      .eq('id', verification.id);

    return new Response(JSON.stringify({ success: true, complaint_id: verification.complaint_id }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
