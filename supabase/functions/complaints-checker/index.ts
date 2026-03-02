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
  const { timeoutMs = 15000, ...fetchOpts } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...fetchOpts, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const SYSTEM_PROMPT = `Eres un bot auditor OSINT que analiza reclamos de consumidores chilenos. 
Lee el texto extraído de una búsqueda de reclamos y devuelve ESTRICTAMENTE un JSON válido con:

{
  "has_complaints": true/false,
  "complaint_count": número estimado de reclamos encontrados (0 si no hay),
  "severity": "none" | "low" | "medium" | "high" | "critical",
  "summary": "Resumen de 2 oraciones de los problemas más mencionados",
  "main_issues": ["problema 1", "problema 2", "problema 3"],
  "sentiment_score": número de 1 a 10 (1=muy negativo, 10=excelente reputación),
  "recent_complaints": true/false si hay reclamos del último año,
  "response_rate": "buena" | "regular" | "mala" | "sin datos" (si la empresa responde los reclamos)
}

Si no hay información de reclamos, devuelve has_complaints: false y severity: "none".`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // ── Auth gate ──
  const authError = validateAdminKey(req);
  if (authError) return authError;

  try {
    const { company_name, domain } = await req.json();
    if (!company_name && !domain) {
      return new Response(JSON.stringify({ error: 'company_name or domain is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const searchTerm = company_name || domain?.replace(/\./g, ' ');
    console.log(`🔍 Checking complaints for: ${searchTerm}`);

    const sources = [
      `https://www.reclamos.cl/buscar?q=${encodeURIComponent(searchTerm)}`,
      `https://www.reclamos.cl/empresa/${encodeURIComponent(searchTerm.toLowerCase().replace(/\s+/g, '-'))}`,
    ];

    const allTexts: string[] = [];

    for (const sourceUrl of sources) {
      try {
        console.log(`📄 Fetching: ${sourceUrl}`);
        const jinaResponse = await safeFetch(`https://r.jina.ai/${sourceUrl}`, {
          headers: { 'Accept': 'application/json' },
          timeoutMs: 10000,
        });
        if (jinaResponse.ok) {
          const jinaData = await jinaResponse.json();
          const text = (jinaData.data?.content || jinaData.content || '').slice(0, 5000);
          if (text.length > 50) {
            allTexts.push(`=== FUENTE: ${sourceUrl} ===\n${text}`);
            console.log(`✅ Got ${text.length} chars from ${sourceUrl}`);
          }
        } else {
          await jinaResponse.text();
          console.log(`⚠️ ${sourceUrl}: HTTP ${jinaResponse.status}`);
        }
      } catch (e) {
        console.log(`⚠️ ${sourceUrl}: timeout/error`);
      }
    }

    // SERNAC search
    try {
      const sernacUrl = `https://r.jina.ai/https://www.google.cl/search?q=${encodeURIComponent(searchTerm + ' reclamos hosting chile sernac')}`;
      const sernacRes = await safeFetch(sernacUrl, {
        headers: { 'Accept': 'application/json' },
        timeoutMs: 8000,
      });
      if (sernacRes.ok) {
        const data = await sernacRes.json();
        const text = (data.data?.content || data.content || '').slice(0, 3000);
        if (text.length > 50) {
          allTexts.push(`=== GOOGLE RECLAMOS ===\n${text}`);
        }
      } else {
        await sernacRes.text();
      }
    } catch (_) { /* ignore */ }

    const combinedText = allTexts.length > 0
      ? allTexts.join('\n\n').slice(0, 10000)
      : `No se encontraron resultados de reclamos para "${searchTerm}". La empresa posiblemente no tiene reclamos registrados o no fue encontrada en las plataformas de reclamos.`;

    console.log(`📊 Combined complaint data: ${combinedText.length} chars`);

    // ── OpenAI with defensive timeout ──
    const openaiResponse = await safeFetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Empresa: "${searchTerm}"\nDominio: ${domain || 'N/A'}\n\n${combinedText}` },
        ],
        temperature: 0.2,
        max_tokens: 500,
      }),
      timeoutMs: 25000,
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      console.error('OpenAI error:', openaiResponse.status, errText);
      if (openaiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'OpenAI rate limit exceeded. Try again later.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const aiData = await openaiResponse.json();
    const raw = aiData.choices[0].message.content;

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log('✅ Complaint analysis complete:', result);

    return new Response(JSON.stringify({ success: true, company_name: searchTerm, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ complaints-checker error:', error);
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    return new Response(
      JSON.stringify({ success: false, error: isTimeout ? 'External API timeout — try again later' : (error instanceof Error ? error.message : 'Unknown error') }),
      { status: isTimeout ? 503 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
