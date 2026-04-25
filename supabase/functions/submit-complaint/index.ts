import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubmitBody {
  company_id: string;
  reporter_email: string;
  reporter_name?: string;
  title: string;
  description: string;
  category: string;
  severity: number;
  evidence_url?: string;
  incident_date?: string;
}

const VALID_CATEGORIES = ['service_quality', 'support', 'billing', 'downtime', 'cancellation', 'misleading_advertising', 'other'];

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''));
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json() as SubmitBody;

    // Validation
    if (!body.company_id || !body.reporter_email || !body.title || !body.description) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.reporter_email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (body.title.length < 10 || body.title.length > 200) {
      return new Response(JSON.stringify({ error: 'Título debe tener entre 10 y 200 caracteres' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (body.description.length < 50 || body.description.length > 5000) {
      return new Response(JSON.stringify({ error: 'Descripción debe tener entre 50 y 5000 caracteres' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!VALID_CATEGORIES.includes(body.category)) {
      return new Response(JSON.stringify({ error: 'Categoría inválida' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (body.severity < 1 || body.severity > 5) {
      return new Response(JSON.stringify({ error: 'Severidad inválida' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    const ip_hash = await hashIp(ip);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check duplicates by ip_hash + company in last 24h (anti-spam)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('public_complaints')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', body.company_id)
      .eq('ip_hash', ip_hash)
      .gte('created_at', since);

    if ((count ?? 0) >= 3) {
      return new Response(JSON.stringify({ error: 'Has enviado demasiados reclamos sobre esta empresa recientemente' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Insert complaint
    const { data: complaint, error: insertError } = await supabase
      .from('public_complaints')
      .insert({
        company_id: body.company_id,
        reporter_email: body.reporter_email.toLowerCase().trim(),
        reporter_name: body.reporter_name?.trim() ?? null,
        title: body.title.trim(),
        description: body.description.trim(),
        category: body.category,
        severity: body.severity,
        evidence_url: body.evidence_url?.trim() ?? null,
        incident_date: body.incident_date ?? null,
        ip_hash,
        status: 'pending_verification',
        email_verified: false,
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    // Generate verification token
    const token = generateToken();
    await supabase.from('complaint_verifications').insert({
      complaint_id: complaint.id,
      token,
      email: body.reporter_email.toLowerCase().trim(),
    });

    const verifyUrl = `https://eligetuhosting.cl/verificar-reclamo?token=${token}`;

    // TODO: send actual email when RESEND_API_KEY is configured
    console.log('[submit-complaint] Verification URL:', verifyUrl);

    return new Response(JSON.stringify({
      success: true,
      message: 'Reclamo recibido. Revisa tu email para verificarlo.',
      complaint_id: complaint.id,
      // dev only — remove in production
      verify_url_dev: verifyUrl,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error desconocido';
    console.error('[submit-complaint]', msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
