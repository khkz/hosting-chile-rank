
-- Add fake comparison site flag
ALTER TABLE public.hosting_companies
ADD COLUMN IF NOT EXISTS is_fake_comparison boolean DEFAULT false;

-- Add site_type for categorization (hosting, comparison, reseller, etc.)
ALTER TABLE public.hosting_companies
ADD COLUMN IF NOT EXISTS site_type text DEFAULT 'hosting';

-- Insert Grupo HostingNet brands
INSERT INTO public.hosting_companies (slug, name, website, corporate_group, is_independent, is_verified, is_curated, is_fake_comparison, site_type, description)
VALUES
  ('rankinghosting', 'RankingHosting.cl', 'https://www.rankinghosting.cl', 'Grupo HostingNet', false, false, false, true, 'fake_comparison', 'Sitio de comparación no independiente del Grupo HostingNet.'),
  ('hostingnet', 'HostingNet.cl', 'https://www.hostingnet.cl', 'Grupo HostingNet', false, false, false, false, 'hosting', 'Marca de hosting del Grupo HostingNet.'),
  ('unhosting', 'UnHosting.cl', 'https://www.unhosting.cl', 'Grupo HostingNet', false, false, false, false, 'hosting', 'Marca de hosting del Grupo HostingNet.')
ON CONFLICT (slug) DO UPDATE SET
  corporate_group = EXCLUDED.corporate_group,
  is_independent = EXCLUDED.is_independent,
  is_fake_comparison = EXCLUDED.is_fake_comparison,
  site_type = EXCLUDED.site_type,
  updated_at = now();

-- Mark existing fake comparison sites
UPDATE public.hosting_companies SET is_fake_comparison = true, site_type = 'fake_comparison' WHERE slug = 'comparahosting';
UPDATE public.hosting_companies SET is_fake_comparison = true, site_type = 'fake_comparison' WHERE slug = 'mejorhosting';
