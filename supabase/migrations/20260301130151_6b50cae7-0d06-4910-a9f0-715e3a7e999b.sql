
-- Fase 1: Campos anti-monopolio para hosting_companies
ALTER TABLE public.hosting_companies
  ADD COLUMN IF NOT EXISTS legal_name text,
  ADD COLUMN IF NOT EXISTS foundation_year integer,
  ADD COLUMN IF NOT EXISTS is_independent boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS corporate_group text;

-- Comentarios para documentación
COMMENT ON COLUMN public.hosting_companies.legal_name IS 'Razón social registrada en SII/NIC Chile';
COMMENT ON COLUMN public.hosting_companies.foundation_year IS 'Año de fundación según NIC Chile';
COMMENT ON COLUMN public.hosting_companies.is_independent IS 'true = infraestructura propia, false = marca de conglomerado';
COMMENT ON COLUMN public.hosting_companies.corporate_group IS 'Nombre del grupo corporativo si is_independent=false';
