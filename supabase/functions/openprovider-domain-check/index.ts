import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DomainCheckRequest {
  domain: string;
  extension: string;
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

    const { domain, extension }: DomainCheckRequest = await req.json();

    if (!domain || !extension) {
      return new Response(
        JSON.stringify({ error: "domain and extension are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get OpenProvider credentials
    const opUsername = Deno.env.get("OPENPROVIDER_USERNAME");
    const opPassword = Deno.env.get("OPENPROVIDER_PASSWORD");

    if (!opUsername || !opPassword) {
      // Return mock data if credentials not configured
      console.log("OpenProvider credentials not configured, returning mock data");
      return new Response(
        JSON.stringify({
          available: true,
          price: 12500,
          currency: "CLP",
          premium: false,
          mock: true,
          message: "OpenProvider credentials not configured - using mock data",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticate with OpenProvider
    console.log(`Authenticating with OpenProvider...`);
    const authResponse = await fetch("https://api.openprovider.eu/v1beta/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: opUsername,
        password: opPassword,
      }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error("OpenProvider auth failed:", errorText);
      throw new Error("Failed to authenticate with OpenProvider");
    }

    const authData = await authResponse.json();
    const accessToken = authData.data?.token;

    if (!accessToken) {
      throw new Error("No access token received from OpenProvider");
    }

    // Check domain availability
    console.log(`Checking availability for ${domain}.${extension}`);
    const checkResponse = await fetch("https://api.openprovider.eu/v1beta/domains/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        domains: [
          {
            name: domain,
            extension: extension.replace(/^\./, ""), // Remove leading dot if present
          },
        ],
        with_price: true,
      }),
    });

    if (!checkResponse.ok) {
      const errorText = await checkResponse.text();
      console.error("OpenProvider check failed:", errorText);
      throw new Error("Failed to check domain availability");
    }

    const checkData = await checkResponse.json();
    const result = checkData.data?.results?.[0];

    if (!result) {
      throw new Error("No result from OpenProvider check");
    }

    const isAvailable = result.status === "free";
    const price = result.price?.product?.price || 0;
    const currency = result.price?.product?.currency || "EUR";
    const isPremium = result.is_premium || false;

    // Convert to CLP (approximate)
    const priceInCLP = currency === "EUR" ? Math.round(price * 1050) : 
                       currency === "USD" ? Math.round(price * 980) : 
                       Math.round(price);

    return new Response(
      JSON.stringify({
        available: isAvailable,
        price: priceInCLP,
        currency: "CLP",
        premium: isPremium,
        original_price: price,
        original_currency: currency,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("openprovider-domain-check error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
