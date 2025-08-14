-- Create tables for ASN caching system
CREATE TABLE asn_search_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_term text NOT NULL UNIQUE,
  results jsonb NOT NULL,
  cached_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '7 days'),
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX idx_asn_search_cache_term ON asn_search_cache(search_term);
CREATE INDEX idx_asn_search_cache_expires ON asn_search_cache(expires_at);

-- Table for caching specific ASN data
CREATE TABLE asn_data_cache (
  asn integer PRIMARY KEY,
  name text,
  description text,
  country_code text,
  prefixes_count integer,
  peers_count integer,
  rir_allocation text,
  website text,
  ipv4_prefixes jsonb,
  ipv6_prefixes jsonb,
  peers jsonb,
  cached_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '30 days'),
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for fast ASN lookups
CREATE INDEX idx_asn_data_cache_expires ON asn_data_cache(expires_at);
CREATE INDEX idx_asn_data_cache_country ON asn_data_cache(country_code);

-- Enable RLS
ALTER TABLE asn_search_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE asn_data_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read ASN search cache" 
ON asn_search_cache FOR SELECT 
USING (true);

CREATE POLICY "Public can read ASN data cache" 
ON asn_data_cache FOR SELECT 
USING (true);

-- Allow service role to manage cache
CREATE POLICY "Service role can manage ASN search cache" 
ON asn_search_cache FOR ALL 
USING (true);

CREATE POLICY "Service role can manage ASN data cache" 
ON asn_data_cache FOR ALL 
USING (true);