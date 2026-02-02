-- Add historical data columns to domain_opportunities
ALTER TABLE public.domain_opportunities 
ADD COLUMN IF NOT EXISTS wayback_snapshots INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS wayback_first_seen DATE,
ADD COLUMN IF NOT EXISTS wayback_last_seen DATE,
ADD COLUMN IF NOT EXISTS wayback_content_type TEXT,
ADD COLUMN IF NOT EXISTS had_website BOOLEAN DEFAULT FALSE;