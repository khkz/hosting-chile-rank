-- Create cache table for reverse IP lookups
CREATE TABLE public.reverse_ip_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_prefix TEXT NOT NULL UNIQUE,
  domains JSONB NOT NULL DEFAULT '[]'::jsonb,
  domain_count INTEGER DEFAULT 0,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reverse_ip_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read reverse IP cache" 
ON public.reverse_ip_cache 
FOR SELECT 
USING (true);

-- Service role can manage the cache
CREATE POLICY "Service role can manage reverse IP cache" 
ON public.reverse_ip_cache 
FOR ALL 
USING (true);

-- Create index for better performance
CREATE INDEX idx_reverse_ip_cache_prefix ON public.reverse_ip_cache(ip_prefix);
CREATE INDEX idx_reverse_ip_cache_expires ON public.reverse_ip_cache(expires_at);