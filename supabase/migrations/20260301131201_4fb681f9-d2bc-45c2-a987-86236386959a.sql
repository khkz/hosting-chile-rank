
-- Curar los 3 proveedores del ranking principal
UPDATE public.hosting_companies SET is_curated = true, curated_at = now(), curation_notes = 'Curación Fase 4: proveedor verificado en ranking principal' WHERE slug IN ('hostingplus', 'ecohosting', 'hostgator');

-- También curar otros proveedores verificados con datos completos
UPDATE public.hosting_companies SET is_curated = true, curated_at = now(), curation_notes = 'Curación Fase 4: proveedor verificado con datos anti-monopolio' WHERE slug IN ('hostingcl', 'planetahosting', 'godaddy', 'bluehost', '1hosting-cl', 'inc-cl');
