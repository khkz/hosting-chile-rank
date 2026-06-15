
-- Price monitoring schema
ALTER TABLE public.hosting_companies
  ADD COLUMN IF NOT EXISTS precio_url text,
  ADD COLUMN IF NOT EXISTS precio_regular_clp integer,
  ADD COLUMN IF NOT EXISTS precio_promo_clp integer,
  ADD COLUMN IF NOT EXISTS precio_periodo text,
  ADD COLUMN IF NOT EXISTS precio_regex text,
  ADD COLUMN IF NOT EXISTS precio_verificado_at timestamptz,
  ADD COLUMN IF NOT EXISTS precio_fuente text;

ALTER TABLE public.hosting_companies
  DROP CONSTRAINT IF EXISTS hosting_companies_precio_periodo_check;
ALTER TABLE public.hosting_companies
  ADD CONSTRAINT hosting_companies_precio_periodo_check
  CHECK (precio_periodo IS NULL OR precio_periodo IN ('mensual','anual'));

CREATE TABLE IF NOT EXISTS public.price_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.hosting_companies(id) ON DELETE CASCADE,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  source_url text NOT NULL,
  raw_snippet text,
  precio_detectado_clp integer,
  status text NOT NULL CHECK (status IN ('ok','sin_cambios','cambio_detectado','extraccion_fallida')),
  delta_pct numeric,
  needs_review boolean NOT NULL DEFAULT false
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.price_checks TO authenticated;
GRANT ALL ON public.price_checks TO service_role;

ALTER TABLE public.price_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read price_checks" ON public.price_checks;
CREATE POLICY "Admins read price_checks" ON public.price_checks
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update price_checks" ON public.price_checks;
CREATE POLICY "Admins update price_checks" ON public.price_checks
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS price_checks_provider_fetched_idx
  ON public.price_checks (provider_id, fetched_at DESC);
CREATE INDEX IF NOT EXISTS price_checks_needs_review_idx
  ON public.price_checks (needs_review) WHERE needs_review;
