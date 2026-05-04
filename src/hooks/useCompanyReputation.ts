import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CompanyReputation {
  company_id: string;
  sentiment_score: number | null;
  severity: 'Alta' | 'Media' | 'Baja' | null;
  main_complaints: string[];
  sources: string[];
  last_synced_at: string | null;
  internal_complaints_12m: number;
  internal_complaints_high: number;
  verified_reviews_count: number;
  verified_reviews_avg: number | null;
}

export function useCompanyReputation(companyId: string | undefined) {
  return useQuery<CompanyReputation | null>({
    queryKey: ['company-reputation', companyId],
    enabled: !!companyId,
    staleTime: 30 * 60 * 1000,
    queryFn: async () => {
      if (!companyId) return null;
      const { data, error } = await supabase.rpc('get_company_reputation' as never, {
        _company_id: companyId,
      } as never);
      if (error) throw error;
      const row = data && Array.isArray(data) ? (data[0] as Record<string, unknown> | undefined) : null;
      if (!row) return null;
      return {
        company_id: companyId,
        sentiment_score: row.sentiment_score as number | null,
        severity: (row.severity as CompanyReputation['severity']) ?? null,
        main_complaints: Array.isArray(row.main_complaints) ? (row.main_complaints as string[]) : [],
        sources: Array.isArray(row.sources) ? (row.sources as string[]) : [],
        last_synced_at: (row.last_synced_at as string | null) ?? null,
        internal_complaints_12m: Number(row.internal_complaints_12m ?? 0),
        internal_complaints_high: Number(row.internal_complaints_high ?? 0),
        verified_reviews_count: Number(row.verified_reviews_count ?? 0),
        verified_reviews_avg: (row.verified_reviews_avg as number | null) ?? null,
      };
    },
  });
}
