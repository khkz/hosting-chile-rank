import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AnalysisRequest {
  domain_name: string;
  force_refresh?: boolean;
}

interface AIAnalysis {
  score: number;
  category: string;
  reason: string;
  estimated_value_clp: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify admin role
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    // Check admin role using RPC
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { domain_name, force_refresh = false }: AnalysisRequest = await req.json();

    if (!domain_name) {
      return new Response(
        JSON.stringify({ error: "domain_name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check cache if not forcing refresh
    if (!force_refresh) {
      const { data: existing } = await supabase
        .from("domain_opportunities")
        .select("*")
        .eq("domain_name", domain_name)
        .eq("status", "analyzed")
        .gte("analyzed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .single();

      if (existing) {
        console.log(`Returning cached analysis for ${domain_name}`);
        return new Response(
          JSON.stringify({
            success: true,
            cached: true,
            domain_name: existing.domain_name,
            score: existing.ai_score,
            category: existing.ai_category,
            rationale: existing.ai_rationale,
            estimated_value: existing.estimated_value,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Call Lovable AI Gateway for analysis
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Eres un experto en valuación de dominios web para el mercado chileno y latinoamericano.
Analiza dominios considerando:
- Longitud (menor es mejor, idealmente <10 caracteres)
- Facilidad de recordación y pronunciación
- Palabras clave comerciales relevantes
- Potencial de marca
- SEO friendliness
- Tendencias del mercado

Responde SOLO con un JSON válido sin markdown ni explicaciones adicionales.`;

    const userPrompt = `Evalúa el dominio "${domain_name}" para el mercado chileno/latino.

Devuelve EXACTAMENTE este formato JSON:
{
  "score": <número del 0 al 10 con un decimal>,
  "category": "<una de: comercial, tecnologia, servicios, entretenimiento, educacion, salud, finanzas, otro>",
  "reason": "<explicación de 2-3 oraciones>",
  "estimated_value_clp": <número entero en pesos chilenos>
}`;

    console.log(`Analyzing domain: ${domain_name}`);

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to workspace" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const content = aiResult.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the AI response
    let analysis: AIAnalysis;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI analysis response");
    }

    // Extract TLD from domain
    const parts = domain_name.split(".");
    const tld = parts.length > 1 ? `.${parts[parts.length - 1]}` : null;

    // Upsert the analysis result
    const { data: upsertData, error: upsertError } = await supabase
      .from("domain_opportunities")
      .upsert(
        {
          domain_name,
          tld,
          status: "analyzed",
          ai_score: analysis.score,
          ai_category: analysis.category,
          ai_rationale: analysis.reason,
          estimated_value: analysis.estimated_value_clp,
          analyzed_at: new Date().toISOString(),
        },
        { onConflict: "domain_name" }
      )
      .select()
      .single();

    if (upsertError) {
      console.error("Database upsert error:", upsertError);
      throw upsertError;
    }

    console.log(`Analysis complete for ${domain_name}: score=${analysis.score}`);

    return new Response(
      JSON.stringify({
        success: true,
        cached: false,
        domain_name,
        score: analysis.score,
        category: analysis.category,
        rationale: analysis.reason,
        estimated_value: analysis.estimated_value_clp,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-domain-potential error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
