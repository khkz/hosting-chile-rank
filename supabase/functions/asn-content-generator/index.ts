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
    const { asn, asnName, description } = await req.json();
    console.log('🔍 Starting content generation for ASN:', asn, asnName);

    if (!asn) {
      throw new Error('ASN is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Search for information about the ASN
    const searchQuery = `${asnName || asn} Chile hosting ISP network information`;
    console.log('🌐 Searching web for:', searchQuery);

    // Note: In production, you might want to use a search API
    // For now, we'll generate content based on ASN data
    const prompt = `Genera contenido profesional y detallado en español sobre la siguiente red/ISP chilena:

ASN: ${asn}
Nombre: ${asnName || 'No disponible'}
Descripción técnica: ${description || 'No disponible'}

Por favor crea un artículo informativo que incluya:

1. **Información General**:
   - Descripción de la organización
   - Historia y presencia en Chile
   - Servicios principales que ofrecen

2. **Infraestructura de Red**:
   - Detalles técnicos del ASN
   - Alcance geográfico en Chile
   - Capacidad y tecnología

3. **Servicios de Hosting**:
   - Tipos de hosting que ofrecen (si aplica)
   - Ventajas para clientes chilenos
   - Casos de uso recomendados

4. **Rendimiento y Confiabilidad**:
   - Uptime y disponibilidad
   - Velocidad y latencia en Chile
   - Soporte técnico

5. **Comparación con otros proveedores**:
   - Posicionamiento en el mercado chileno
   - Fortalezas y debilidades
   - Precio vs valor

6. **Recomendaciones**:
   - Para qué tipo de clientes es ideal
   - Consideraciones importantes
   - Alternativas a considerar

Escribe en tono profesional pero accesible, pensando en usuarios chilenos que buscan hosting.
Usa emojis relevantes para hacer el contenido más atractivo.
Formato: Markdown bien estructurado.`;

    console.log('🤖 Calling OpenAI for content generation...');

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
            content: 'Eres un experto en infraestructura de internet y servicios de hosting en Chile. Generas contenido técnico pero accesible, enfocado en ayudar a usuarios chilenos a entender y elegir proveedores de hosting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ OpenAI error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Generate SEO metadata
    const metadataPrompt = `Basándote en el siguiente contenido sobre ${asnName || asn}, genera metadatos SEO óptimos en español:

Contenido: ${content.substring(0, 500)}...

Genera:
1. Título SEO (máximo 60 caracteres)
2. Meta descripción (máximo 160 caracteres)
3. 5 palabras clave relevantes
4. URL slug (formato: asn-nombre-empresa)

Formato JSON.`;

    const metadataResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'Eres un experto en SEO. Genera metadatos optimizados en formato JSON.'
          },
          {
            role: 'user',
            content: metadataPrompt
          }
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    let metadata = null;
    if (metadataResponse.ok) {
      const metadataData = await metadataResponse.json();
      try {
        const metadataText = metadataData.choices[0].message.content;
        // Extract JSON from potential markdown code blocks
        const jsonMatch = metadataText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          metadata = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.warn('Could not parse metadata JSON:', e);
      }
    }

    console.log('✅ Content generation completed');

    return new Response(
      JSON.stringify({
        success: true,
        asn,
        asnName,
        content,
        metadata,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in content generation:', error);
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
