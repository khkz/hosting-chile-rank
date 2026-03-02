import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ── Admin API Key Guard ─────────────────────────────────────────
function validateAdminKey(req: Request): Response | null {
  const adminKey = req.headers.get('x-admin-api-key');
  const expectedKey = Deno.env.get('ADMIN_SECRET_KEY');
  if (!expectedKey || adminKey !== expectedKey) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized — invalid or missing x-admin-api-key' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
  return null;
}

// ── Timeout-safe fetch wrapper ──────────────────────────────────
async function safeFetch(url: string, options: RequestInit & { timeoutMs?: number } = {}): Promise<Response> {
  const { timeoutMs = 30000, ...fetchOpts } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...fetchOpts, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // ── Auth gate ──
  const authError = validateAdminKey(req);
  if (authError) return authError;

  try {
    const { asn, asnName, description } = await req.json();
    console.log('🔍 Starting content generation for ASN:', asn, asnName);

    if (!asn) {
      throw new Error('ASN is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const prompt = `Genera contenido profesional y detallado en español sobre la siguiente red/ISP chilena:

ASN: ${asn}
Nombre: ${asnName || 'No disponible'}
Descripción técnica: ${description || 'No disponible'}

Por favor crea un artículo informativo que incluya:

1. **Información General**: Descripción de la organización, historia y presencia en Chile, servicios principales
2. **Infraestructura de Red**: Detalles técnicos del ASN, alcance geográfico, capacidad y tecnología
3. **Servicios de Hosting**: Tipos de hosting (si aplica), ventajas para clientes chilenos, casos de uso
4. **Rendimiento y Confiabilidad**: Uptime, velocidad y latencia en Chile, soporte técnico
5. **Comparación con otros proveedores**: Posicionamiento, fortalezas/debilidades, precio vs valor
6. **Recomendaciones**: Para qué tipo de clientes es ideal, consideraciones, alternativas

Escribe en tono profesional pero accesible, pensando en usuarios chilenos que buscan hosting.
Usa emojis relevantes. Formato: Markdown bien estructurado.`;

    console.log('🤖 Calling OpenAI for content generation...');

    const response = await safeFetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en infraestructura de internet y servicios de hosting en Chile. Generas contenido técnico pero accesible, enfocado en ayudar a usuarios chilenos a entender y elegir proveedores de hosting.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 3000,
      }),
      timeoutMs: 30000,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ OpenAI error:', error);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'OpenAI rate limit exceeded. Try again later.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Generate SEO metadata
    let metadata = null;
    try {
      const metadataResponse = await safeFetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Eres un experto en SEO. Genera metadatos optimizados en formato JSON.' },
            { role: 'user', content: `Basándote en contenido sobre ${asnName || asn}, genera: 1. Título SEO (max 60 chars) 2. Meta descripción (max 160 chars) 3. 5 palabras clave 4. URL slug. Formato JSON.` }
          ],
          temperature: 0.5,
          max_tokens: 300,
        }),
        timeoutMs: 15000,
      });

      if (metadataResponse.ok) {
        const metadataData = await metadataResponse.json();
        const metadataText = metadataData.choices[0].message.content;
        const jsonMatch = metadataText.match(/\{[\s\S]*\}/);
        if (jsonMatch) metadata = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('Could not generate metadata:', e);
    }

    console.log('✅ Content generation completed');

    return new Response(
      JSON.stringify({ success: true, asn, asnName, content, metadata, timestamp: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error in content generation:', error);
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    return new Response(
      JSON.stringify({ success: false, error: isTimeout ? 'External API timeout — try again later' : (error instanceof Error ? error.message : 'Unknown error') }),
      { status: isTimeout ? 503 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
