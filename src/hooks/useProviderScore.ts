import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { buildScoreBreakdown, type ScoreBreakdownResult } from '@/lib/rankingScore';
import { useCompanyReputation } from '@/hooks/useCompanyReputation';

export interface LatestBenchmarkRow {
  measured_at: string;
  ttfb_median_ms: number | null;
  ttfb_p95_ms: number | null;
  uptime_30d_pct: number | null;
  lighthouse_perf: number | null;
  composite_score: number | null;
}

/** Última medición de benchmark de un proveedor (o null si nunca se midió). */
export const useLatestBenchmarkForCompany = (companyId: string | undefined) =>
  useQuery({
    queryKey: ['benchmark-latest-company', companyId],
    enabled: !!companyId,
    staleTime: 30 * 60 * 1000,
    queryFn: async (): Promise<LatestBenchmarkRow | null> => {
      if (!companyId) return null;
      const { data, error } = await supabase
        .from('benchmark_results')
        .select('measured_at, ttfb_median_ms, ttfb_p95_ms, uptime_30d_pct, lighthouse_perf, composite_score')
        .eq('company_id', companyId)
        .order('measured_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      return (data?.[0] as LatestBenchmarkRow | undefined) ?? null;
    },
  });

export interface ProviderScore extends ScoreBreakdownResult {
  measuredAt: string | null;
  isLoading: boolean;
}

/**
 * Subpuntajes de un proveedor calculados con la fórmula publicada.
 * Los subcriterios sin dato quedan en null → la UI los muestra "sin medir".
 */
export const useProviderScore = (params: {
  companyId: string | undefined;
  supportRating: number | null;
  priceRating: number | null;
}): ProviderScore => {
  const bench = useLatestBenchmarkForCompany(params.companyId);
  const reputation = useCompanyReputation(params.companyId);

  const breakdown = buildScoreBreakdown({
    uptime30dPct: bench.data?.uptime_30d_pct ?? null,
    ttfbMedianMs: bench.data?.ttfb_median_ms ?? null,
    lighthousePerf: bench.data?.lighthouse_perf ?? null,
    supportRating: params.supportRating,
    priceRating: params.priceRating,
    verifiedReviewsAvg: reputation.data?.verified_reviews_avg ?? null,
    verifiedReviewsCount: reputation.data?.verified_reviews_count ?? null,
  });

  return {
    ...breakdown,
    measuredAt: bench.data?.measured_at ?? null,
    isLoading: bench.isLoading || reputation.isLoading,
  };
};
