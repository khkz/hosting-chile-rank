import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `Eres un bot auditor OSINT especializado en empresas de hosting chilenas. Lee el texto de una página web y extrae TODA la información empresarial disponible. Devuelve ESTRICTAMENTE un JSON válido con estos campos (usa null si no encuentras el dato):

{
  "mission_statement": "Resumen sobrio de máximo 30 palabras de su promesa corporativa",
  "description_seo": "Descripción profesional de 2-3 oraciones para SEO, mencionando servicios principales, ventajas y público objetivo",
  "cheapest_plan_clp": número entero del plan más barato en CLP mensual (sin IVA si es posible),
  "plans": [{"name": "Nombre", "price_clp": número, "storage": "10GB SSD", "bandwidth": "Ilimitada", "domains": 1}],
  "contact_phone": "teléfono principal",
  "contact_email": "email de contacto/ventas",
  "contact_address": "dirección física completa",
  "social_media": {"facebook": "url", "instagram": "url", "twitter": "url", "linkedin": "url"},
  "technologies": ["cPanel", "LiteSpeed", "CloudLinux", etc.],
  "datacenter_location": "ubicación del datacenter",
  "team_info": "información sobre equipo, fundadores o dueños mencionados",
  "rut_detected": "RUT si aparece en la web (ej: 76.xxx.xxx-x)",
  "years_experience": número de años de experiencia mencionados,
  "total_clients": número de clientes mencionados,
  "uptime_guarantee": "99.9%" o similar,
  "has_ssl_free": true/false,
  "has_migration_free": true/false,
  "payment_methods": ["Webpay", "PayPal", etc.]
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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

    // Determine pages to scrape based on mode
    const baseUrl = url.replace(/\/$/, '');
    const pagesToScrape = mode === 'full'
      ? [baseUrl, `${baseUrl}/nosotros`, `${baseUrl}/planes`, `${baseUrl}/contacto`]
      : [baseUrl];

    // Scrape all pages via Jina AI
    console.log(`📄 Scraping ${pagesToScrape.length} pages for:`, baseUrl);
    const pageTexts: string[] = [];

    for (const pageUrl of pagesToScrape) {
      try {
        const jinaResponse = await fetch(`https://r.jina.ai/${pageUrl}`, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(8000),
        });
        if (jinaResponse.ok) {
          const jinaData = await jinaResponse.json();
          const text = (jinaData.data?.content || jinaData.content || '').slice(0, 4000);
          if (text.length > 100) {
            pageTexts.push(`=== PÁGINA: ${pageUrl} ===\n${text}`);
            console.log(`✅ ${pageUrl}: ${text.length} chars`);
          }
        } else {
          await jinaResponse.text();
          console.log(`⚠️ ${pageUrl}: HTTP ${jinaResponse.status}`);
        }
      } catch (e) {
        console.log(`⚠️ ${pageUrl}: timeout/error`);
      }
    }

    if (pageTexts.length === 0) {
      throw new Error('No content extracted from any page');
    }

    const combinedText = pageTexts.join('\n\n').slice(0, 12000);
    console.log(`📊 Total combined: ${combinedText.length} chars from ${pageTexts.length} pages`);

    // Send to OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
        temperature: 0.2,
        max_tokens: 1500,
      }),
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      console.error('OpenAI error:', openaiResponse.status, errText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const aiData = await openaiResponse.json();
    const raw = aiData.choices[0].message.content;

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log('✅ Full AI extraction complete');

    return new Response(JSON.stringify({ success: true, url, pages_scraped: pageTexts.length, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ ai-web-scraper error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
