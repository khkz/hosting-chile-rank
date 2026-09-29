ALTER TABLE public.hosting_companies
  ADD COLUMN IF NOT EXISTS datacenter_certifications text,
  ADD COLUMN IF NOT EXISTS datacenter_certifications_sources text[],
  ADD COLUMN IF NOT EXISTS correction_note text,
  ADD COLUMN IF NOT EXISTS correction_date date;