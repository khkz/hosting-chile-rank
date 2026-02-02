import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authentication
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

    // Verify user is admin
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await userClient.auth.getUser(token);
    
    if (claimsError || !claims.user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", claims.user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("📡 Fetching deleted domains from NIC.cl...");

    // Fetch the deleted domains page
    const response = await fetch("https://www.nic.cl/registry/Eliminados.do", {
      headers: {
        "User-Agent": "EligetuBot/1.0 (+https://eligetuhosting.cl)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "es-CL,es;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch NIC.cl: ${response.status}`);
    }

    const html = await response.text();
    console.log(`📄 Received ${html.length} bytes of HTML`);

    // Parse domains from HTML
    // The pattern matches domains in the table format
    const domains: string[] = [];
    
    // Multiple regex patterns to catch different formats
    const patterns = [
      /([a-z0-9áéíóúñü-]+\.cl)\s*<br>/gi,
      />([a-z0-9áéíóúñü-]+\.cl)</gi,
      /Whois\.do\?d=([a-z0-9-]+\.cl)/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const domain = match[1].toLowerCase();
        if (!domains.includes(domain) && domain.length > 3) {
          domains.push(domain);
        }
      }
    }

    console.log(`📊 Found ${domains.length} deleted domains`);

    if (domains.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          found: 0,
          inserted: 0,
          skipped: 0,
          message: "No domains found in NIC.cl response",
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get existing domains to avoid duplicates
    const { data: existingDomains } = await supabase
      .from("domain_opportunities")
      .select("domain_name")
      .in("domain_name", domains);

    const existingSet = new Set(
      (existingDomains || []).map((d) => d.domain_name)
    );

    // Filter new domains
    const newDomains = domains.filter((d) => !existingSet.has(d));
    const skipped = domains.length - newDomains.length;

    console.log(`✨ ${newDomains.length} new domains to insert, ${skipped} already exist`);

    // Insert new domains
    let inserted = 0;
    if (newDomains.length > 0) {
      const records = newDomains.map((domain) => ({
        domain_name: domain,
        tld: ".cl",
        source: "deleted",
        source_url: "https://www.nic.cl/registry/Eliminados.do",
        status: "pending_analysis",
        detected_at: new Date().toISOString(),
      }));

      // Insert in batches of 50
      const batchSize = 50;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const { error: insertError, data: insertedData } = await supabase
          .from("domain_opportunities")
          .insert(batch)
          .select();

        if (insertError) {
          console.error("Insert error:", insertError);
        } else {
          inserted += insertedData?.length || 0;
        }
      }
    }

    console.log(`✅ Sync complete: ${inserted} inserted, ${skipped} skipped`);

    return new Response(
      JSON.stringify({
        success: true,
        found: domains.length,
        inserted,
        skipped,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
