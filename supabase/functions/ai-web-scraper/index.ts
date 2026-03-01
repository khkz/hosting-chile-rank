import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
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

    // Step 1: Fetch clean text via Jina AI Reader
    console.log('📄 Fetching content via Jina AI for:', url);
    const jinaResponse = await fetch(`https://r.jina.ai/${url}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!jinaResponse.ok) {
      const errText = await jinaResponse.text();
      console.error('Jina error:', jinaResponse.status, errText);
      throw new Error(`Jina AI fetch failed: ${jinaResponse.status}`);
    }

    const jinaData = await jinaResponse.json();
    const pageText = (jinaData.data?.content || jinaData.content || '').slice(0, 6000);

    if (!pageText) {
      throw new Error('No content extracted from URL');
    }

    console.log(`✅ Extracted ${pageText.length} chars from Jina`);

    // Step 2: Send to OpenAI for structured extraction
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'Eres un bot auditor OSINT. Lee este texto de una web de hosting. Devuelve ESTRICTAMENTE un JSON válido con: mission_statement (Resumen sobrio de 15 palabras de su promesa corporativa) y cheapest_plan_clp (El precio mensual más barato en números enteros).',
          },
          { role: 'user', content: pageText },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      console.error('OpenAI error:', openaiResponse.status, errText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const aiData = await openaiResponse.json();
    const raw = aiData.choices[0].message.content;

    // Parse JSON from potential markdown code blocks
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log('✅ AI extraction complete:', result);

    return new Response(JSON.stringify({ success: true, url, ...result }), {
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
