import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WaybackData {
  snapshots: number;
  first_seen: string | null;
  last_seen: string | null;
  content_type: string | null;
  had_website: boolean;
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

    const { domain_name } = await req.json();

    if (!domain_name) {
      return new Response(
        JSON.stringify({ error: "domain_name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🔍 Enriching domain: ${domain_name}`);

    // Fetch Wayback Machine CDX API for historical data
    let waybackData: WaybackData = {
      snapshots: 0,
      first_seen: null,
      last_seen: null,
      content_type: null,
      had_website: false,
    };

    try {
      const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(domain_name)}&output=json&fl=timestamp,statuscode,mimetype&filter=statuscode:200&collapse=timestamp:6`;
      
      console.log(`📡 Fetching CDX: ${cdxUrl}`);
      
      const cdxResponse = await fetch(cdxUrl, {
        headers: {
          "User-Agent": "EligeTuHosting/1.0 (Domain Research)",
        },
      });

      if (cdxResponse.ok) {
        const cdxData = await cdxResponse.json();
        
        // First row is headers, rest are data
        if (cdxData && cdxData.length > 1) {
          const snapshots = cdxData.slice(1); // Remove header row
          waybackData.snapshots = snapshots.length;
          waybackData.had_website = true;

          // Parse first and last timestamps
          if (snapshots.length > 0) {
            const firstTimestamp = snapshots[0][0];
            const lastTimestamp = snapshots[snapshots.length - 1][0];

            // Convert YYYYMMDDHHMMSS to YYYY-MM-DD
            waybackData.first_seen = `${firstTimestamp.slice(0, 4)}-${firstTimestamp.slice(4, 6)}-${firstTimestamp.slice(6, 8)}`;
            waybackData.last_seen = `${lastTimestamp.slice(0, 4)}-${lastTimestamp.slice(4, 6)}-${lastTimestamp.slice(6, 8)}`;

            // Try to detect content type from the most recent snapshot
            const lastMimetype = snapshots[snapshots.length - 1][2];
            if (lastMimetype?.includes("html")) {
              // Fetch a sample of the last snapshot to detect content type
              waybackData.content_type = await detectContentType(domain_name, lastTimestamp);
            }
          }
        }
      } else {
        console.log(`⚠️ CDX response not ok: ${cdxResponse.status}`);
      }
    } catch (waybackError) {
      console.error("Wayback API error:", waybackError);
      // Continue without Wayback data
    }

    console.log(`📊 Wayback data for ${domain_name}:`, waybackData);

    // Update domain_opportunities with enrichment data
    const { error: updateError } = await supabase
      .from("domain_opportunities")
      .update({
        wayback_snapshots: waybackData.snapshots,
        wayback_first_seen: waybackData.first_seen,
        wayback_last_seen: waybackData.last_seen,
        wayback_content_type: waybackData.content_type,
        had_website: waybackData.had_website,
        updated_at: new Date().toISOString(),
      })
      .eq("domain_name", domain_name);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        domain: domain_name,
        wayback: waybackData,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("enrich-domain-data error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function detectContentType(domain: string, timestamp: string): Promise<string | null> {
  try {
    const snapshotUrl = `https://web.archive.org/web/${timestamp}id_/${domain}`;
    const response = await fetch(snapshotUrl, {
      headers: { "User-Agent": "EligeTuHosting/1.0 (Domain Research)" },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const htmlLower = html.toLowerCase();

    // Detect e-commerce
    if (
      htmlLower.includes("carrito") ||
      htmlLower.includes("cart") ||
      htmlLower.includes("checkout") ||
      htmlLower.includes("tienda") ||
      htmlLower.includes("woocommerce") ||
      htmlLower.includes("shopify") ||
      htmlLower.includes("producto") ||
      htmlLower.includes("price")
    ) {
      return "e-commerce";
    }

    // Detect blog
    if (
      htmlLower.includes("blog") ||
      htmlLower.includes("wordpress") ||
      htmlLower.includes("artículo") ||
      htmlLower.includes("article") ||
      htmlLower.includes("publicado")
    ) {
      return "blog";
    }

    // Detect corporate
    if (
      htmlLower.includes("nosotros") ||
      htmlLower.includes("about us") ||
      htmlLower.includes("empresa") ||
      htmlLower.includes("servicios") ||
      htmlLower.includes("services") ||
      htmlLower.includes("contacto")
    ) {
      return "corporativo";
    }

    // Detect landing page
    if (
      htmlLower.includes("landing") ||
      htmlLower.includes("subscribe") ||
      htmlLower.includes("suscribir") ||
      htmlLower.includes("newsletter")
    ) {
      return "landing";
    }

    return "general";
  } catch {
    return null;
  }
}
