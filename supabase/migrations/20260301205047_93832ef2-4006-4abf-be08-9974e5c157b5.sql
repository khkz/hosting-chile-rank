
-- Update existing inc-cl to Grupo Hostname
UPDATE public.hosting_companies
SET corporate_group = 'Grupo Hostname',
    is_independent = false,
    updated_at = now()
WHERE slug = 'inc-cl';

-- Insert missing brands
INSERT INTO public.hosting_companies (slug, name, website, corporate_group, is_independent, is_verified, is_curated, description)
VALUES
  ('hostname', 'Hostname.cl', 'https://www.hostname.cl', 'Grupo Hostname', false, false, false, 'Marca de hosting del Grupo Hostname.'),
  ('hn', 'HN.cl', 'https://www.hn.cl', 'Grupo Hostname', false, false, false, 'Marca de hosting del Grupo Hostname.'),
  ('host', 'Host.cl', 'https://www.host.cl', 'Grupo Hostname', false, false, false, 'Marca de hosting del Grupo Hostname.')
ON CONFLICT (slug) DO UPDATE SET
  corporate_group = EXCLUDED.corporate_group,
  is_independent = EXCLUDED.is_independent,
  updated_at = now();
