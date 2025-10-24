import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain } = await req.json();
    console.log('🔍 Starting SEO analysis for:', domain);

    if (!domain) {
      throw new Error('Domain is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Fetch basic domain info
    const domainInfo = await fetchDomainInfo(domain);
    console.log('📊 Domain info fetched');

    // Generate SEO analysis with OpenAI
    const prompt = `Analiza el siguiente sitio web desde una perspectiva SEO profesional para el mercado chileno de hosting:

Dominio: ${domain}
Información técnica: ${JSON.stringify(domainInfo, null, 2)}

Por favor proporciona un análisis SEO completo en español que incluya:

1. **Análisis de estructura técnica**: 
   - Evaluación de velocidad y rendimiento
   - Optimización móvil
   - Estructura de URLs
   - HTTPS y seguridad

2. **Análisis de contenido**:
   - Calidad y relevancia del contenido
   - Palabras clave potenciales
   - Oportunidades de contenido

3. **Backlinks y autoridad**:
   - Estimación de autoridad de dominio
   - Oportunidades de enlaces
   - Estrategias de link building

4. **Optimizaciones recomendadas**:
   - Mejoras técnicas prioritarias
   - Mejoras de contenido
   - Estrategias de marketing digital

5. **Score SEO estimado** (0-100) y justificación

Formato: Markdown estructurado con emojis relevantes.`;

    console.log('🤖 Calling OpenAI for SEO analysis...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'Eres un experto en SEO especializado en el mercado chileno de hosting y servicios web. Proporciona análisis detallados, accionables y en español.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ OpenAI error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log('✅ SEO analysis completed');

    return new Response(
      JSON.stringify({
        success: true,
        domain,
        analysis,
        domainInfo,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in SEO analysis:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function fetchDomainInfo(domain: string) {
  try {
    // Try to fetch basic info about the domain
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Check if domain is accessible
    const response = await fetch(`https://${cleanDomain}`, {
      method: 'HEAD',
      redirect: 'follow',
    }).catch(() => null);

    return {
      accessible: !!response,
      status: response?.status || null,
      hasHttps: true,
      domain: cleanDomain,
    };
  } catch (error) {
    console.error('Error fetching domain info:', error);
    return {
      accessible: false,
      status: null,
      hasHttps: false,
      domain,
    };
  }
}
