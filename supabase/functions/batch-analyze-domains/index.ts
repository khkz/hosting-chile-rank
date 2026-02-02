import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BatchRequest {
  batch_size?: number;
  delay_ms?: number;
  enrich_first?: boolean;
}

interface AnalysisResult {
  domain: string;
  score: number | null;
  status: "success" | "error" | "skipped";
  error?: string;
}

serve(async (req) => {
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
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin role
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await userClient.auth.getUser(token);

    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { batch_size = 3, delay_ms = 2000, enrich_first = true }: BatchRequest = await req.json();

    console.log(`🚀 Starting batch analysis: batch_size=${batch_size}, delay_ms=${delay_ms}, enrich_first=${enrich_first}`);

    // Get pending domains
    const { data: pendingDomains, error: fetchError } = await supabase
      .from("domain_opportunities")
      .select("id, domain_name, wayback_snapshots, wayback_first_seen, wayback_last_seen, wayback_content_type, had_website, wayback_checked")
      .eq("status", "pending_analysis")
      .order("created_at", { ascending: true })
      .limit(batch_size);

    if (fetchError) {
      throw fetchError;
    }

    if (!pendingDomains || pendingDomains.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          processed: 0,
          failed: 0,
          remaining: 0,
          results: [],
          message: "No pending domains to analyze",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Count total remaining
    const { count: totalRemaining } = await supabase
      .from("domain_opportunities")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_analysis");

    const results: AnalysisResult[] = [];
    let processed = 0;
    let failed = 0;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    for (const domain of pendingDomains) {
      try {
        console.log(`📝 Analyzing: ${domain.domain_name}`);

        // Step 1: Enrich with Wayback data if not already done
        let waybackData = {
          snapshots: domain.wayback_snapshots || 0,
          first_seen: domain.wayback_first_seen,
          last_seen: domain.wayback_last_seen,
          content_type: domain.wayback_content_type,
          had_website: domain.had_website || false,
          checked: domain.wayback_checked || false,
        };

        // Fix: Check if Wayback was never consulted (wayback_checked = false)
        // Previously this only checked for null, but DEFAULT 0 meant it was never null
        const needsEnrichment = !waybackData.checked && !waybackData.had_website;

        if (enrich_first && needsEnrichment) {
          try {
            const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(domain.domain_name)}&output=json&fl=timestamp,statuscode,mimetype&filter=statuscode:200&collapse=timestamp:6`;
            
            console.log(`📡 Fetching Wayback for ${domain.domain_name}`);
            
            // AbortController with 5s timeout for Wayback API
            const waybackController = new AbortController();
            const waybackTimeout = setTimeout(() => waybackController.abort(), 5000);
            
            const cdxResponse = await fetch(cdxUrl, {
              headers: { "User-Agent": "EligeTuHosting/1.0 (Domain Research)" },
              signal: waybackController.signal,
            });
            
            clearTimeout(waybackTimeout);

            // Mark as checked regardless of result
            waybackData.checked = true;

            if (cdxResponse.ok) {
              const cdxData = await cdxResponse.json();
              if (cdxData && cdxData.length > 1) {
                const snapshots = cdxData.slice(1);
                waybackData.snapshots = snapshots.length;
                waybackData.had_website = true;

                if (snapshots.length > 0) {
                  const firstTimestamp = snapshots[0][0];
                  const lastTimestamp = snapshots[snapshots.length - 1][0];
                  waybackData.first_seen = `${firstTimestamp.slice(0, 4)}-${firstTimestamp.slice(4, 6)}-${firstTimestamp.slice(6, 8)}`;
                  waybackData.last_seen = `${lastTimestamp.slice(0, 4)}-${lastTimestamp.slice(4, 6)}-${lastTimestamp.slice(6, 8)}`;
                }
                console.log(`✅ Wayback found ${snapshots.length} snapshots for ${domain.domain_name}`);
              } else {
                console.log(`⚪ No Wayback history for ${domain.domain_name}`);
              }
            }
          } catch (waybackError) {
            console.error(`Wayback error for ${domain.domain_name}:`, waybackError);
            waybackData.checked = true; // Still mark as checked to avoid retry loops
          }
        }

        // Step 2: AI Analysis with enriched context
        const systemPrompt = `Eres un experto en valuación de dominios web para el mercado chileno y latinoamericano.
Analiza dominios considerando:
- Longitud (menor es mejor, idealmente <10 caracteres)
- Facilidad de recordación y pronunciación
- Palabras clave comerciales relevantes
- Potencial de marca
- SEO friendliness
- Tendencias del mercado
- IMPORTANTE: Si el dominio tuvo historial en Wayback Machine, esto aumenta significativamente su valor

Responde SOLO con un JSON válido sin markdown ni explicaciones adicionales.`;

        let userPrompt = `Evalúa el dominio "${domain.domain_name}" para el mercado chileno/latino.`;

        // Add historical context if available
        if (waybackData.had_website && waybackData.snapshots > 0) {
          userPrompt += `

DATOS HISTÓRICOS VERIFICADOS:
- Wayback Machine: ${waybackData.snapshots} snapshots archivados
- Primera captura: ${waybackData.first_seen || "desconocida"}
- Última captura: ${waybackData.last_seen || "desconocida"}
- Tipo de contenido detectado: ${waybackData.content_type || "desconocido"}

Este dominio TUVO un sitio web activo. Considera esto al evaluar su valor (dominios con historial comprobado valen más).`;
        } else {
          userPrompt += `

Este dominio NO tiene historial en Wayback Machine (nunca tuvo sitio web público o fue muy reciente).`;
        }

        userPrompt += `

Devuelve EXACTAMENTE este formato JSON:
{
  "score": <número del 0 al 10 con un decimal>,
  "category": "<una de: comercial, tecnologia, servicios, entretenimiento, educacion, salud, finanzas, otro>",
  "reason": "<explicación de 2-3 oraciones>",
  "estimated_value_clp": <número entero en pesos chilenos>
}`;

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
            console.log("Rate limited, stopping batch");
            results.push({ domain: domain.domain_name, score: null, status: "error", error: "Rate limited" });
            failed++;
            break; // Stop the batch on rate limit
          }
          throw new Error(`AI Gateway error: ${aiResponse.status}`);
        }

        const aiResult = await aiResponse.json();
        const content = aiResult.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error("No content in AI response");
        }

        // Parse AI response
        const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const analysis = JSON.parse(cleanContent);

        // Extract TLD
        const parts = domain.domain_name.split(".");
        const tld = parts.length > 1 ? `.${parts[parts.length - 1]}` : null;

        // Update domain with all data
        await supabase
          .from("domain_opportunities")
          .update({
            status: "analyzed",
            ai_score: analysis.score,
            ai_category: analysis.category,
            ai_rationale: analysis.reason,
            estimated_value: analysis.estimated_value_clp,
            wayback_snapshots: waybackData.snapshots,
            wayback_first_seen: waybackData.first_seen,
            wayback_last_seen: waybackData.last_seen,
            wayback_content_type: waybackData.content_type,
            had_website: waybackData.had_website,
            wayback_checked: waybackData.checked,
            tld,
            analyzed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", domain.id);

        results.push({ domain: domain.domain_name, score: analysis.score, status: "success" });
        processed++;

        console.log(`✅ ${domain.domain_name}: score=${analysis.score}, wayback=${waybackData.snapshots}`);

        // Delay between requests to respect rate limits
        if (delay_ms > 0 && domain !== pendingDomains[pendingDomains.length - 1]) {
          await new Promise((resolve) => setTimeout(resolve, delay_ms));
        }
      } catch (domainError) {
        console.error(`❌ Error analyzing ${domain.domain_name}:`, domainError);
        results.push({
          domain: domain.domain_name,
          score: null,
          status: "error",
          error: domainError instanceof Error ? domainError.message : "Unknown error",
        });
        failed++;
      }
    }

    const remaining = (totalRemaining || 0) - processed;

    console.log(`📊 Batch complete: processed=${processed}, failed=${failed}, remaining=${remaining}`);

    return new Response(
      JSON.stringify({
        success: true,
        processed,
        failed,
        remaining: Math.max(0, remaining),
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("batch-analyze-domains error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
