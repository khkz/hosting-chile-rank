import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const [methodology, companies, latestRun] = await Promise.all([
      supabase
        .from("benchmark_methodology")
        .select("version,published_at,markdown")
        .eq("is_current", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("hosting_companies")
        .select("id,name,slug,overall_rating")
        .eq("is_verified", true)
        .eq("is_curated", true),
      supabase
        .from("benchmark_runs")
        .select("id,run_date,methodology_version,total_providers,status")
        .order("run_date", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const companyIds = (companies.data ?? []).map((c) => c.id);

    const { data: results } = await supabase
      .from("benchmark_results")
      .select(
        "company_id,measured_at,ttfb_median_ms,ttfb_p95_ms,uptime_30d_pct,lighthouse_perf,lighthouse_seo,lighthouse_a11y,composite_score"
      )
      .in("company_id", companyIds)
      .order("measured_at", { ascending: false });

    // Latest result per company
    const latestByCompany: Record<string, unknown> = {};
    for (const r of results ?? []) {
      if (!latestByCompany[r.company_id]) latestByCompany[r.company_id] = r;
    }

    const payload = {
      generated_at: new Date().toISOString(),
      methodology: methodology.data,
      latest_run: latestRun.data,
      providers: (companies.data ?? []).map((c) => ({
        ...c,
        latest_benchmark: latestByCompany[c.id] ?? null,
      })),
      attribution: "Elige Tu Hosting · https://eligetuhosting.cl/metodologia",
      license: "CC BY 4.0",
    };

    return new Response(JSON.stringify(payload, null, 2), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=900",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
