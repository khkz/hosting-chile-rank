
INSERT INTO public.hosting_companies (slug, name, website, corporate_group, is_independent, is_verified, is_curated, description)
VALUES ('mejorhosting', 'MejorHosting.cl', 'https://www.mejorhosting.cl', 'Grupo Hostname', false, false, false, 'Marca de hosting del Grupo Hostname.')
ON CONFLICT (slug) DO UPDATE SET
  corporate_group = EXCLUDED.corporate_group,
  is_independent = EXCLUDED.is_independent,
  updated_at = now();
