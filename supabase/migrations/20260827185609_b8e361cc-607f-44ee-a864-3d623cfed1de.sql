ALTER TABLE public.hosting_companies
  ADD COLUMN IF NOT EXISTS fuentes text,
  ADD COLUMN IF NOT EXISTS fecha_verificacion date;