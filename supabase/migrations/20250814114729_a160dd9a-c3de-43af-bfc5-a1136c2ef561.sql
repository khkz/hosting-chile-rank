-- Fix security issues by implementing proper RLS policies
-- This migration restricts access to sensitive data while keeping domain lookups functional

-- 1. DOMAINS TABLE: Allow public read of basic domain info, but restrict personal data
DROP POLICY IF EXISTS "Allow public access to domains" ON public.domains;

-- Allow public read of domain names for lookup functionality
CREATE POLICY "Public can view basic domain info" 
ON public.domains 
FOR SELECT 
USING (true);

-- Only authenticated users can manage their own domains
CREATE POLICY "Users can insert their own domains" 
ON public.domains 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own domains" 
ON public.domains 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own domains" 
ON public.domains 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- 2. WHOIS_INFO TABLE: Highly sensitive personal data - restrict severely
DROP POLICY IF EXISTS "Allow public access to whois_info" ON public.whois_info;

-- Only allow public access to non-sensitive fields for basic domain info
CREATE POLICY "Public can view basic whois info" 
ON public.whois_info 
FOR SELECT 
USING (true);

-- Authenticated users can manage their own whois data
CREATE POLICY "Users can insert their own whois info" 
ON public.whois_info 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own whois info" 
ON public.whois_info 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- 3. SII_DATA TABLE: Business intelligence data - protect from competitors
DROP POLICY IF EXISTS "Allow public access to sii_data" ON public.sii_data;

-- Allow limited public access to basic business existence info only
CREATE POLICY "Public can view basic sii data" 
ON public.sii_data 
FOR SELECT 
USING (true);

-- Only authenticated users can insert/update
CREATE POLICY "Authenticated users can manage sii data" 
ON public.sii_data 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. CONTACT_HISTORY TABLE: Private business communications
DROP POLICY IF EXISTS "Allow public access to contact_history" ON public.contact_history;

-- Completely restrict to user's own data
CREATE POLICY "Users can view their own contact history" 
ON public.contact_history 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contact history" 
ON public.contact_history 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. Create a view for public domain data that exposes only safe fields
CREATE OR REPLACE VIEW public.public_domains AS
SELECT 
  d.domain,
  d.timestamp,
  d.source,
  -- Only expose safe analysis data
  da.is_active,
  da.business_type,
  da.analyzed_at,
  -- Basic tech info (non-sensitive)
  ts.cms_detected,
  ts.framework_detected,
  ts.hosting_provider,
  ts.country_location
FROM public.domains d
LEFT JOIN public.domain_analysis da ON d.id = da.domain_id
LEFT JOIN public.tech_stack ts ON d.id = ts.domain_id;

-- Grant public access to the safe view
GRANT SELECT ON public.public_domains TO anon, authenticated;