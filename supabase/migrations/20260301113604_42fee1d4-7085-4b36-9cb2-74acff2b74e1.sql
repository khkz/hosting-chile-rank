ALTER TABLE public.hosting_companies 
  ADD COLUMN IF NOT EXISTS is_curated boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS curation_notes text,
  ADD COLUMN IF NOT EXISTS curated_at timestamptz,
  ADD COLUMN IF NOT EXISTS website_status text DEFAULT 'unknown';