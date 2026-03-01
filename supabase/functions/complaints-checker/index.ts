import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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

    // Try multiple complaint sources via Jina AI
    const sources = [
      `https://www.reclamos.cl/buscar?q=${encodeURIComponent(searchTerm)}`,
      `https://www.reclamos.cl/empresa/${encodeURIComponent(searchTerm.toLowerCase().replace(/\s+/g, '-'))}`,
    ];

    const allTexts: string[] = [];

    for (const sourceUrl of sources) {
      try {
        console.log(`📄 Fetching: ${sourceUrl}`);
        const jinaResponse = await fetch(`https://r.jina.ai/${sourceUrl}`, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(10000),
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

    // Also try SERNAC-style search
    try {
      const sernacUrl = `https://r.jina.ai/https://www.google.cl/search?q=${encodeURIComponent(searchTerm + ' reclamos hosting chile sernac')}`;
      const sernacRes = await fetch(sernacUrl, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000),
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

    // Send to OpenAI for analysis
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
          { role: 'user', content: `Empresa: "${searchTerm}"\nDominio: ${domain || 'N/A'}\n\n${combinedText}` },
        ],
        temperature: 0.2,
        max_tokens: 500,
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
    console.log('✅ Complaint analysis complete:', result);

    return new Response(JSON.stringify({ success: true, company_name: searchTerm, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ complaints-checker error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
