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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { company_id, batch } = await req.json();

    // If batch mode, verify all companies
    if (batch) {
      const { data: companies } = await supabase
        .from("hosting_companies")
        .select("id, website")
        .not("website", "is", null);

      const results = [];
      for (const company of companies || []) {
        const status = await checkWebsite(company.website);
        await supabase
          .from("hosting_companies")
          .update({ website_status: status })
          .eq("id", company.id);
        results.push({ id: company.id, website: company.website, status });
      }

      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Single company
    if (!company_id) {
      return new Response(JSON.stringify({ error: "company_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: company } = await supabase
      .from("hosting_companies")
      .select("id, website")
      .eq("id", company_id)
      .single();

    if (!company?.website) {
      await supabase
        .from("hosting_companies")
        .update({ website_status: "not_found" })
        .eq("id", company_id);
      return new Response(
        JSON.stringify({ status: "not_found", reason: "no website URL" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const status = await checkWebsite(company.website);
    await supabase
      .from("hosting_companies")
      .update({ website_status: status })
      .eq("id", company_id);

    return new Response(JSON.stringify({ status, website: company.website }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function checkWebsite(url: string): Promise<string> {
  try {
    let fullUrl = url;
    if (!fullUrl.startsWith("http")) fullUrl = "https://" + fullUrl;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(fullUrl, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (res.status === 404) return "not_found";
    if (res.ok) return "active";
    return "down";
  } catch {
    return "down";
  }
}
