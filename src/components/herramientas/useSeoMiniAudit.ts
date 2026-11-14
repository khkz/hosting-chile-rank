import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { functionErrorText } from '@/lib/functionError';

export interface MiniAuditKeyword {
  keyword: string;
  position: number;
  search_volume?: number | null;
  cpc?: number | null;
  difficulty?: number | null;
}

export interface MiniAuditResult {
  domain: string;
  audit_id?: string;
  scores: { total: number; technical: number; content: number; backlinks: number; ux: number; serp: number };
  performance?: { performance: number; lcp_ms: number; cls: number; seo: number } | null;
  keywords?: { top?: MiniAuditKeyword[]; total_keywords?: number } | null;
  issues: Array<{ severity: string; category: string; title: string; recommendation: string }>;
  data_sources: { pagespeed: boolean; dataforseo: boolean };
}

/**
 * Mini-auditoría SEO (función seo-audit-mini). Separa la consulta de la página
 * y devuelve el error en español con la causa real (functionErrorText).
 * `checkedAt` es el momento en que respondió la auditoría: se mide en ese instante.
 */
export function useSeoMiniAudit() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MiniAuditResult | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (rawDomain: string) => {
    const domain = rawDomain.trim();
    // El campo vacío lo valida el formulario; aquí solo se evita la llamada.
    if (!domain) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('seo-audit-mini', { body: { domain } });
      if (fnError) throw fnError;
      if (!data?.success) {
        setError(data?.error || data?.message || 'No pudimos analizar ese dominio. Revisa que esté bien escrito y vuelve a intentarlo.');
        return;
      }
      setResult(data as MiniAuditResult);
      setCheckedAt(new Date().toISOString());
      // Registro del interesado (silencioso, igual que antes).
      supabase
        .from('seo_audit_leads')
        .insert({ domain: data.domain, mini_audit_id: data.audit_id, mini_score: data.scores.total, source: 'landing' })
        .then(() => null);
    } catch (err) {
      setError(await functionErrorText(err));
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, checkedAt, error, run };
}
