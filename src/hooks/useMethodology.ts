import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLatestMethodology() {
  return useQuery({
    queryKey: ["methodology", "current"],
    queryFn: async () => {
      const { data } = await supabase
        .from("benchmark_methodology")
        .select("*")
        .eq("is_current", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });
}

export function useMethodologyChangelog() {
  return useQuery({
    queryKey: ["methodology", "changelog"],
    queryFn: async () => {
      const { data } = await supabase
        .from("benchmark_methodology")
        .select("version,published_at,is_current")
        .order("published_at", { ascending: false });
      return data ?? [];
    },
  });
}

export function useTopProviderBreakdown() {
  return useQuery({
    queryKey: ["methodology", "top-breakdown"],
    queryFn: async () => {
      const { data: companies } = await supabase
        .from("hosting_companies")
        .select(
          "id,name,slug,overall_rating,speed_rating,support_rating,price_rating,logo_url"
        )
        .eq("is_verified", true)
        .eq("is_curated", true)
        .order("overall_rating", { ascending: false })
        .limit(1);

      const top = companies?.[0];
      if (!top) return null;

      const { data: bench } = await supabase
        .from("benchmark_results")
        .select(
          "ttfb_median_ms,uptime_30d_pct,lighthouse_perf,composite_score,measured_at"
        )
        .eq("company_id", top.id)
        .order("measured_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return { company: top, benchmark: bench };
    },
  });
}
