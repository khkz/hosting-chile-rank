
-- Update existing companies to Grupo Casamayor
UPDATE public.hosting_companies
SET corporate_group = 'Grupo Casamayor',
    is_independent = false,
    updated_at = now()
WHERE slug IN ('hostingcl', 'planetahosting');

-- Insert missing brands
INSERT INTO public.hosting_companies (slug, name, website, corporate_group, is_independent, is_verified, is_curated, description)
VALUES
  ('ninjahosting', 'NinjaHosting', 'https://www.ninjahosting.cl', 'Grupo Casamayor', false, false, false, 'Marca de hosting del Grupo Casamayor (AS265839).'),
  ('comparahosting', 'ComparaHosting', 'https://www.comparahosting.cl', 'Grupo Casamayor', false, false, false, 'Marca de hosting del Grupo Casamayor (AS265839).'),
  ('ihost', 'iHost', 'https://www.ihost.cl', 'Grupo Casamayor', false, false, false, 'Marca de hosting del Grupo Casamayor (AS265839).'),
  ('todohosting', 'TodoHosting', 'https://www.todohosting.cl', 'Grupo Casamayor', false, false, false, 'Marca de hosting del Grupo Casamayor (AS265839).')
ON CONFLICT (slug) DO UPDATE SET
  corporate_group = EXCLUDED.corporate_group,
  is_independent = EXCLUDED.is_independent,
  updated_at = now();
