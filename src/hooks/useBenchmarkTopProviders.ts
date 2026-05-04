import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TopProvider {
  company_id: string;
  name: string;
  slug: string;
  composite_score: number | null;
  ttfb_median_ms: number | null;
  uptime_30d_pct: number | null;
  lighthouse_perf: number | null;
  measured_at: string;
}

export const useBenchmarkTopProviders = (limit = 3) => {
  return useQuery({
    queryKey: ["benchmark-top", limit],
    queryFn: async (): Promise<TopProvider[]> => {
      const { data: runs } = await supabase
        .from("benchmark_runs")
        .select("id")
        .eq("status", "completed")
        .order("run_date", { ascending: false })
        .limit(1);
      const runId = runs?.[0]?.id;
      if (!runId) return [];

      const { data } = await supabase
        .from("benchmark_results")
        .select(
          `company_id, composite_score, ttfb_median_ms, uptime_30d_pct, lighthouse_perf, measured_at,
           hosting_companies ( name, slug )`
        )
        .eq("run_id", runId)
        .order("composite_score", { ascending: false, nullsFirst: false })
        .limit(limit);

      return (data ?? []).map((r: any) => ({
        company_id: r.company_id,
        name: r.hosting_companies?.name ?? "—",
        slug: r.hosting_companies?.slug ?? "",
        composite_score: r.composite_score,
        ttfb_median_ms: r.ttfb_median_ms,
        uptime_30d_pct: r.uptime_30d_pct,
        lighthouse_perf: r.lighthouse_perf,
        measured_at: r.measured_at,
      }));
    },
    staleTime: 10 * 60 * 1000,
  });
};
