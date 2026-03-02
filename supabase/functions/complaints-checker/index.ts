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

// ── Delay helper ────────────────────────────────────────────────
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SYSTEM_PROMPT = (company: string) =>
  `Eres un analista de calidad. Lee estos reclamos sobre la empresa "${company}". Extrae la información y devuélvela ESTRICTAMENTE en este formato JSON:
{
  "sentiment_score": <Número del 1 al 10, donde 1 es pésimo y 10 excelente>,
  "main_complaints": ["Lista de máximo 3 quejas principales resumidas en 4 palabras"],
  "severity": "Alta" | "Media" | "Baja"
}
Si no hay reclamos relevantes, devuelve sentiment_score 8, main_complaints vacío y severity "Baja".`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // ── Auth gate ──
  const authError = validateAdminKey(req);
  if (authError) return authError;

  try {
    const { company_name } = await req.json();
    if (!company_name || typeof company_name !== 'string' || company_name.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'company_name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SERPER_API_KEY = Deno.env.get('SERPER_API_KEY');
    if (!SERPER_API_KEY) throw new Error('SERPER_API_KEY not configured');

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured');

    const searchTerm = company_name.trim();
    console.log(`🔍 [Step 1] Serper search for: site:reclamos.cl "${searchTerm}"`);

    // ── Step 1: Serper.dev Google Search ─────────────────────────
    const serperResponse = await safeFetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: `site:reclamos.cl "${searchTerm}"`,
        gl: 'cl',
        hl: 'es',
        num: 5,
      }),
      timeoutMs: 10000,
    });

    if (!serperResponse.ok) {
      const errText = await serperResponse.text();
      console.error('Serper error:', serperResponse.status, errText);
      throw new Error(`Serper API error: ${serperResponse.status}`);
    }

    const serperData = await serperResponse.json();
    const organicResults = serperData.organic || [];
    const topLinks: string[] = organicResults
      .slice(0, 3)
      .map((r: { link: string }) => r.link)
      .filter((l: string) => l.includes('reclamos.cl'));

    console.log(`📎 Found ${topLinks.length} reclamos.cl links:`, topLinks);

    if (topLinks.length === 0) {
      console.log('✅ No complaints found on reclamos.cl');
      return new Response(JSON.stringify({
        success: true,
        company_name: searchTerm,
        sentiment_score: 8,
        main_complaints: [],
        severity: 'Baja',
        sources: [],
        note: 'No se encontraron reclamos en reclamos.cl',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Step 2: Jina AI text extraction (with 1s delay) ─────────
    const extractedTexts: string[] = [];

    for (let i = 0; i < topLinks.length; i++) {
      if (i > 0) await delay(1000); // respectful delay

      const link = topLinks[i];
      console.log(`📄 [Step 2] Extracting text from: ${link}`);

      try {
        const jinaRes = await safeFetch(`https://r.jina.ai/${link}`, {
          headers: { 'Accept': 'application/json' },
          timeoutMs: 12000,
        });

        if (jinaRes.ok) {
          const jinaData = await jinaRes.json();
          const text = (jinaData.data?.content || jinaData.content || '').slice(0, 4000);
          if (text.length > 50) {
            extractedTexts.push(`=== FUENTE: ${link} ===\n${text}`);
            console.log(`✅ Extracted ${text.length} chars from ${link}`);
          } else {
            console.log(`⚠️ Too little text from ${link}`);
          }
        } else {
          await jinaRes.text();
          console.log(`⚠️ Jina HTTP ${jinaRes.status} for ${link}`);
        }
      } catch (e) {
        console.log(`⚠️ Jina timeout/error for ${link}`);
      }
    }

    if (extractedTexts.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        company_name: searchTerm,
        sentiment_score: 7,
        main_complaints: [],
        severity: 'Baja',
        sources: topLinks,
        note: 'Se encontraron links pero no se pudo extraer texto',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const combinedText = extractedTexts.join('\n\n').slice(0, 10000);
    console.log(`📊 [Step 3] Sending ${combinedText.length} chars to OpenAI`);

    // ── Step 3: OpenAI analysis ─────────────────────────────────
    const openaiResponse = await safeFetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT(searchTerm) },
          { role: 'user', content: combinedText },
        ],
        temperature: 0.2,
        max_tokens: 400,
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

    return new Response(JSON.stringify({
      success: true,
      company_name: searchTerm,
      sources: topLinks,
      texts_extracted: extractedTexts.length,
      ...result,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ complaints-checker error:', error);
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    return new Response(
      JSON.stringify({
        success: false,
        error: isTimeout
          ? 'External API timeout — try again later'
          : (error instanceof Error ? error.message : 'Unknown error'),
      }),
      { status: isTimeout ? 503 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
