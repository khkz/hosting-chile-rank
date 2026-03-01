-- Fix BlueHosting.cl corporate group
UPDATE hosting_companies 
SET corporate_group = 'Haulmer', 
    is_independent = false,
    curation_notes = 'Grupo Haulmer. Datos pendientes de verificación manual.'
WHERE slug = 'bluehost';

-- Insert Haulmer brands
INSERT INTO hosting_companies (name, slug, website, corporate_group, is_independent, is_curated, curation_notes)
VALUES 
  ('Hosty.cl', 'hosty', 'https://www.hosty.cl', 'Haulmer', false, false, 'Marca de Haulmer. Pendiente scraping OSINT.'),
  ('SolutionHost.cl', 'solutionhost', 'https://www.solutionhost.cl', 'Haulmer', false, false, 'Marca de Haulmer. Pendiente scraping OSINT.'),
  ('LiveHost.cl', 'livehost', 'https://www.livehost.cl', 'Haulmer', false, false, 'Marca de Haulmer. Pendiente scraping OSINT.'),
  ('BoxHosting.cl', 'boxhosting', 'https://www.boxhosting.cl', 'Haulmer', false, false, 'Marca de Haulmer. Pendiente scraping OSINT.')
ON CONFLICT (slug) DO NOTHING;