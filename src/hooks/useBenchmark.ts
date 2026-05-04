import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BenchmarkRow {
  id: string;
  company_id: string;
  measured_at: string;
  ttfb_median_ms: number | null;
  ttfb_p95_ms: number | null;
  ttfb_samples: unknown;
  lighthouse_perf: number | null;
  lighthouse_seo: number | null;
  lighthouse_a11y: number | null;
  lcp_ms: number | null;
  fcp_ms: number | null;
  cls: number | null;
  uptime_30d_pct: number | null;
  server_software: string | null;
  has_brotli: boolean | null;
  composite_score: number | null;
  raw_json: unknown;
  hosting_companies: {
    id: string;
    slug: string;
    name: string;
    logo_url: string | null;
    benchmark_target_url: string | null;
  } | null;
}

export interface BenchmarkRun {
  id: string;
  run_date: string;
  methodology_version: string;
  status: string;
  total_providers: number;
}

export const useLatestBenchmark = () => {
  return useQuery({
    queryKey: ["benchmark-latest"],
    queryFn: async (): Promise<{ run: BenchmarkRun | null; results: BenchmarkRow[] }> => {
      const { data: runs } = await supabase
        .from("benchmark_runs")
        .select("*")
        .eq("status", "completed")
        .order("run_date", { ascending: false })
        .limit(1);
      const run = (runs?.[0] as BenchmarkRun | undefined) ?? null;
      if (!run) return { run: null, results: [] };

      const { data: results } = await supabase
        .from("benchmark_results")
        .select(
          `*, hosting_companies ( id, slug, name, logo_url, benchmark_target_url )`,
        )
        .eq("run_id", run.id)
        .order("composite_score", { ascending: false, nullsFirst: false });

      return { run, results: (results as unknown as BenchmarkRow[]) ?? [] };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompanyHistory = (companyId: string | undefined) => {
  return useQuery({
    queryKey: ["benchmark-history", companyId],
    enabled: !!companyId,
    queryFn: async (): Promise<BenchmarkRow[]> => {
      if (!companyId) return [];
      const { data } = await supabase
        .from("benchmark_results")
        .select("*")
        .eq("company_id", companyId)
        .order("measured_at", { ascending: true })
        .limit(24);
      return (data as unknown as BenchmarkRow[]) ?? [];
    },
  });
};

export const useCurrentMethodology = () => {
  return useQuery({
    queryKey: ["benchmark-methodology-current"],
    queryFn: async () => {
      const { data } = await supabase
        .from("benchmark_methodology")
        .select("*")
        .eq("is_current", true)
        .limit(1)
        .maybeSingle();
      return data;
    },
  });
};
