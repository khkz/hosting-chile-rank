
-- 1) editorial_summary en hosting_companies
ALTER TABLE public.hosting_companies
  ADD COLUMN IF NOT EXISTS editorial_summary text;

-- 2) latam_site_checks
CREATE TABLE IF NOT EXISTS public.latam_site_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.hosting_companies(id) ON DELETE CASCADE,
  checked_url text NOT NULL,
  resolved_ip text,
  asn text,
  asn_org text,
  ssl_issuer text,
  ssl_valid_from timestamptz,
  ssl_valid_to timestamptz,
  ttfb_ms integer,
  http_status integer,
  error text,
  checked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_latam_site_checks_company ON public.latam_site_checks(company_id, checked_at DESC);

GRANT SELECT ON public.latam_site_checks TO anon, authenticated;
GRANT ALL ON public.latam_site_checks TO service_role;

ALTER TABLE public.latam_site_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read latam site checks"
  ON public.latam_site_checks FOR SELECT
  USING (true);

CREATE POLICY "Service role manages latam site checks"
  ON public.latam_site_checks FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER trg_latam_site_checks_updated_at
  BEFORE UPDATE ON public.latam_site_checks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
