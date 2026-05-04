-- 1. Snapshots históricos de reputación (Reclamos.cl)
CREATE TABLE public.reputation_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  measured_at timestamptz NOT NULL DEFAULT now(),
  sentiment_score numeric(3,1),
  severity text CHECK (severity IN ('Alta','Media','Baja')),
  main_complaints jsonb DEFAULT '[]'::jsonb,
  sources jsonb DEFAULT '[]'::jsonb,
  texts_extracted integer DEFAULT 0,
  methodology_version text NOT NULL DEFAULT 'v1.0',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reputation_snapshots_company ON public.reputation_snapshots(company_id, measured_at DESC);

ALTER TABLE public.reputation_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read reputation snapshots"
  ON public.reputation_snapshots FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage reputation snapshots"
  ON public.reputation_snapshots FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Bandera para excluir proveedores del refresco automático
ALTER TABLE public.hosting_companies
  ADD COLUMN IF NOT EXISTS reputation_sync_enabled boolean NOT NULL DEFAULT true;

-- 3. Función pública agregadora
CREATE OR REPLACE FUNCTION public.get_company_reputation(_company_id uuid)
RETURNS TABLE (
  company_id uuid,
  sentiment_score numeric,
  severity text,
  main_complaints jsonb,
  sources jsonb,
  last_synced_at timestamptz,
  internal_complaints_12m integer,
  internal_complaints_high integer,
  verified_reviews_count integer,
  verified_reviews_avg numeric
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH last_snap AS (
    SELECT *
    FROM public.reputation_snapshots
    WHERE company_id = _company_id
    ORDER BY measured_at DESC
    LIMIT 1
  ),
  complaints AS (
    SELECT
      COUNT(*) FILTER (WHERE created_at > now() - interval '12 months')::int AS total_12m,
      COUNT(*) FILTER (WHERE severity >= 4 AND created_at > now() - interval '12 months')::int AS high
    FROM public.public_complaints
    WHERE company_id = _company_id
      AND status IN ('verified','resolved')
  ),
  reviews AS (
    SELECT
      COUNT(*)::int AS cnt,
      ROUND(AVG(overall_rating)::numeric, 2) AS avg_rating
    FROM public.hosting_reviews
    WHERE company_id = _company_id
      AND status = 'approved'
      AND is_verified_customer = true
  )
  SELECT
    _company_id,
    ls.sentiment_score,
    ls.severity,
    COALESCE(ls.main_complaints, '[]'::jsonb),
    COALESCE(ls.sources, '[]'::jsonb),
    ls.measured_at,
    c.total_12m,
    c.high,
    r.cnt,
    r.avg_rating
  FROM complaints c
  CROSS JOIN reviews r
  LEFT JOIN last_snap ls ON true;
$$;

GRANT EXECUTE ON FUNCTION public.get_company_reputation(uuid) TO anon, authenticated;