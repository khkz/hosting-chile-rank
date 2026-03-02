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
  return null; // key is valid
}

// ── Timeout-safe fetch wrapper ──────────────────────────────────
async function safeFetch(url: string, options: RequestInit & { timeoutMs?: number } = {}): Promise<Response> {
  const { timeoutMs = 15000, ...fetchOpts } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...fetchOpts, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

const SYSTEM_PROMPT = `Eres un bot auditor OSINT especializado en empresas de hosting chilenas. Lee el texto de una página web y extrae TODA la información empresarial disponible. Devuelve ESTRICTAMENTE un JSON válido.

REGLAS CRÍTICAS:
- NUNCA inventes datos. Si no encuentras un dato, devuelve null.
- NO uses frases genéricas como "ofrece servicios confiables y rápidos" o "soluciones de hosting de calidad".
- Cada dato debe provenir TEXTUALMENTE del contenido de la web analizada.

Devuelve este JSON:

{
  "mission_statement": "Resumen sobrio de máximo 30 palabras de su promesa corporativa, o null si no aparece",
  "description_seo": "Descripción profesional de 2-3 oraciones para SEO, mencionando servicios principales, ventajas y público objetivo",
  "description_editorial": "Párrafo de 4-5 oraciones en tercera persona, tono periodístico sobrio. Menciona SOLO hechos concretos encontrados en la web (año de fundación, tecnologías reales, ubicación del datacenter, número de clientes si se menciona). NO uses frases genéricas. Si no hay suficientes datos concretos, haz el párrafo más corto pero mantén la honestidad.",
  "pros": ["3 ventajas concretas basadas en lo que SE VE en la web, ej: 'Usa servidores LiteSpeed Enterprise', 'Datacenter propio en Santiago', 'Publica precios sin IVA claramente'"],
  "cons": ["3 desventajas o carencias OBSERVADAS, ej: 'No publica dirección física en la web', 'Sin información de RUT o razón social', 'No menciona política de reembolso'"],
  "unique_selling_point": "Una frase concreta que los diferencia, basada en hechos reales de la web. null si no hay diferenciador claro.",
  "cheapest_plan_clp": null,
  "plans": [{"name": "Nombre", "price_clp": null, "storage": "10GB SSD", "bandwidth": "Ilimitada", "domains": 1}],
  "contact_phone": null,
  "contact_email": null,
  "contact_address": null,
  "social_media": {"facebook": null, "instagram": null, "twitter": null, "linkedin": null},
  "technologies": ["Solo tecnologías que aparezcan EXPLÍCITAMENTE en la web"],
  "datacenter_location": null,
  "team_info": null,
  "rut_detected": null,
  "years_experience": null,
  "total_clients": null,
  "uptime_guarantee": null,
  "has_ssl_free": null,
  "has_migration_free": null,
  "payment_methods": [],
  "confidence": {
    "contact_phone": "verified|inferred|not_found",
    "contact_email": "verified|inferred|not_found",
    "contact_address": "verified|inferred|not_found",
    "datacenter_location": "verified|inferred|not_found",
    "technologies": "verified|inferred|not_found",
    "uptime_guarantee": "verified|inferred|not_found",
    "has_ssl_free": "verified|inferred|not_found",
    "has_migration_free": "verified|inferred|not_found",
    "payment_methods": "verified|inferred|not_found",
    "rut_detected": "verified|not_found",
    "plans": "verified|inferred|not_found",
    "social_media": "verified|inferred|not_found"
  }
}

Para "confidence":
- "verified": el dato aparece textualmente en la página
- "inferred": deducido del contexto (ej: ves un ícono de Webpay pero no texto)
- "not_found": no hay evidencia del dato en la web`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // ── Auth gate ──
  const authError = validateAdminKey(req);
  if (authError) return authError;

  try {
    const { url, mode } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: 'url is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const baseUrl = url.replace(/\/$/, '');
    const pagesToScrape = mode === 'full'
      ? [baseUrl, `${baseUrl}/nosotros`, `${baseUrl}/planes`, `${baseUrl}/contacto`]
      : [baseUrl];

    console.log(`📄 Scraping ${pagesToScrape.length} pages for:`, baseUrl);
    const pageTexts: string[] = [];

    for (const pageUrl of pagesToScrape) {
      try {
        const jinaResponse = await safeFetch(`https://r.jina.ai/${pageUrl}`, {
          headers: { 'Accept': 'application/json' },
          timeoutMs: 15000,
        });
        if (jinaResponse.ok) {
          const jinaData = await jinaResponse.json();
          const text = (jinaData.data?.content || jinaData.content || '').slice(0, 4000);
          if (text.length > 100) {
            pageTexts.push(`=== PÁGINA: ${pageUrl} ===\n${text}`);
            console.log(`✅ Jina ${pageUrl}: ${text.length} chars`);
            continue;
          }
        } else {
          await jinaResponse.text();
          console.log(`⚠️ Jina ${pageUrl}: HTTP ${jinaResponse.status}`);
        }
      } catch (e) {
        console.log(`⚠️ Jina ${pageUrl}: timeout/error`);
      }

      try {
        const directResponse = await safeFetch(pageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MejorHostingBot/1.0)',
            'Accept': 'text/html',
          },
          timeoutMs: 10000,
          redirect: 'follow',
        });
        if (directResponse.ok) {
          const html = await directResponse.text();
          const text = html
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 4000);
          if (text.length > 100) {
            pageTexts.push(`=== PÁGINA: ${pageUrl} ===\n${text}`);
            console.log(`✅ Direct ${pageUrl}: ${text.length} chars`);
          }
        }
      } catch (e2) {
        console.log(`⚠️ Direct ${pageUrl}: fallback also failed`);
      }
    }

    if (pageTexts.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No content extracted - site may block automated access',
        url,
        pages_scraped: 0 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const combinedText = pageTexts.join('\n\n').slice(0, 12000);
    console.log(`📊 Total combined: ${combinedText.length} chars from ${pageTexts.length} pages`);

    // ── OpenAI call with defensive timeout ──
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
          { role: 'user', content: combinedText },
        ],
        temperature: 0.15,
        max_tokens: 2000,
      }),
      timeoutMs: 30000,
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
    console.log('✅ Full AI extraction complete with confidence scoring');

    return new Response(JSON.stringify({ success: true, url, pages_scraped: pageTexts.length, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ ai-web-scraper error:', error);
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    return new Response(
      JSON.stringify({ success: false, error: isTimeout ? 'External API timeout — try again later' : (error instanceof Error ? error.message : 'Unknown error') }),
      { status: isTimeout ? 503 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
