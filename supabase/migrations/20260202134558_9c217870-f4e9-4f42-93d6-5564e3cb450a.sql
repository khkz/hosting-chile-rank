-- Add PageRank columns to domain_opportunities
ALTER TABLE public.domain_opportunities
ADD COLUMN IF NOT EXISTS page_rank numeric,
ADD COLUMN IF NOT EXISTS page_rank_updated_at timestamp with time zone;