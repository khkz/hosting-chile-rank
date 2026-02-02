import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactInfo {
  first_name: string;
  last_name: string;
  company_name?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
}

interface PurchaseRequest {
  domain: string;
  extension: string;
  period?: number;
  contact_data?: {
    owner: ContactInfo;
    admin?: ContactInfo;
    tech?: ContactInfo;
    billing?: ContactInfo;
  };
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

    const { domain, extension, period = 1, contact_data }: PurchaseRequest = await req.json();

    if (!domain || !extension) {
      return new Response(
        JSON.stringify({ error: "domain and extension are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fullDomainName = `${domain}.${extension.replace(/^\./, "")}`;
    const tld = `.${extension.replace(/^\./, "")}`;

    // Get OpenProvider credentials
    const opUsername = Deno.env.get("OPENPROVIDER_USERNAME");
    const opPassword = Deno.env.get("OPENPROVIDER_PASSWORD");

    if (!opUsername || !opPassword) {
      // Mock purchase for testing
      console.log("OpenProvider credentials not configured, simulating purchase");
      
      const mockOrderId = `MOCK-${Date.now()}`;
      const mockPrice = 12500;

      // Insert into portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("my_domain_portfolio")
        .insert({
          domain_name: fullDomainName,
          tld,
          purchase_date: new Date().toISOString(),
          purchase_price: mockPrice,
          purchase_source: "mock",
          purchase_reference: mockOrderId,
          renewal_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          annual_cost: mockPrice,
          is_for_sale: false,
          sale_status: "not_for_sale",
        })
        .select()
        .single();

      if (portfolioError) {
        console.error("Portfolio insert error:", portfolioError);
        throw portfolioError;
      }

      // Update opportunity status
      await supabase
        .from("domain_opportunities")
        .update({ status: "purchased" })
        .eq("domain_name", fullDomainName);

      return new Response(
        JSON.stringify({
          success: true,
          mock: true,
          order_id: mockOrderId,
          domain_name: fullDomainName,
          price_paid: mockPrice,
          message: "OpenProvider credentials not configured - simulated purchase",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticate with OpenProvider
    console.log(`Authenticating with OpenProvider for purchase...`);
    const authResponse = await fetch("https://api.openprovider.eu/v1beta/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: opUsername,
        password: opPassword,
      }),
    });

    if (!authResponse.ok) {
      throw new Error("Failed to authenticate with OpenProvider");
    }

    const authData = await authResponse.json();
    const accessToken = authData.data?.token;

    if (!accessToken) {
      throw new Error("No access token received from OpenProvider");
    }

    // Default contact data if not provided
    const defaultContact: ContactInfo = {
      first_name: "Admin",
      last_name: "EligeTuHosting",
      company_name: "EligeTuHosting",
      email: "admin@eligetuhosting.cl",
      phone: "+56912345678",
      address: {
        street: "Av. Principal",
        number: "123",
        city: "Santiago",
        state: "RM",
        zipcode: "8320000",
        country: "CL",
      },
    };

    const ownerContact = contact_data?.owner || defaultContact;

    // Create domain order
    console.log(`Creating order for ${fullDomainName}`);
    const orderResponse = await fetch("https://api.openprovider.eu/v1beta/domains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        domain: {
          name: domain,
          extension: extension.replace(/^\./, ""),
        },
        period: period,
        owner_handle: ownerContact,
        admin_handle: contact_data?.admin || ownerContact,
        tech_handle: contact_data?.tech || ownerContact,
        billing_handle: contact_data?.billing || ownerContact,
        autorenew: "off",
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok || orderData.code !== 0) {
      console.error("OpenProvider order failed:", orderData);
      
      // Update opportunity status to failed
      await supabase
        .from("domain_opportunities")
        .update({ status: "failed" })
        .eq("domain_name", fullDomainName);

      return new Response(
        JSON.stringify({
          success: false,
          error: orderData.desc || "Domain registration failed",
          details: orderData,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orderId = orderData.data?.id || `OP-${Date.now()}`;
    const pricePaid = orderData.data?.price?.product?.price || 0;
    const currency = orderData.data?.price?.product?.currency || "EUR";
    const priceInCLP = currency === "EUR" ? Math.round(pricePaid * 1050) : 
                       currency === "USD" ? Math.round(pricePaid * 980) : 
                       Math.round(pricePaid);

    // Insert into portfolio
    const { error: portfolioError } = await supabase
      .from("my_domain_portfolio")
      .insert({
        domain_name: fullDomainName,
        tld,
        purchase_date: new Date().toISOString(),
        purchase_price: priceInCLP,
        purchase_source: "openprovider",
        purchase_reference: orderId.toString(),
        renewal_date: new Date(Date.now() + period * 365 * 24 * 60 * 60 * 1000).toISOString(),
        annual_cost: priceInCLP,
        is_for_sale: false,
        sale_status: "not_for_sale",
      });

    if (portfolioError) {
      console.error("Portfolio insert error:", portfolioError);
      // Don't throw - the purchase succeeded even if portfolio insert failed
    }

    // Update opportunity status
    await supabase
      .from("domain_opportunities")
      .update({ status: "purchased" })
      .eq("domain_name", fullDomainName);

    console.log(`Purchase complete for ${fullDomainName}: order_id=${orderId}`);

    return new Response(
      JSON.stringify({
        success: true,
        order_id: orderId,
        domain_name: fullDomainName,
        price_paid: priceInCLP,
        currency: "CLP",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("openprovider-domain-purchase error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
