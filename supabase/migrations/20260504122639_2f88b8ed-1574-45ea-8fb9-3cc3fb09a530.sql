
-- ============================================================
-- 1) public_complaints: hide PII columns from non-service roles
-- ============================================================
REVOKE SELECT (reporter_email, reporter_name) ON public.public_complaints FROM anon, authenticated;

-- ============================================================
-- 2) Replace permissive ALL "USING (true)" policies with
--    granular SELECT/INSERT/UPDATE policies (no public DELETE)
-- ============================================================

-- asn_data_cache
DROP POLICY IF EXISTS "Service role can manage ASN data cache" ON public.asn_data_cache;
CREATE POLICY "Anyone can insert ASN data cache" ON public.asn_data_cache FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update ASN data cache" ON public.asn_data_cache FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete ASN data cache" ON public.asn_data_cache FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- asn_search_cache
DROP POLICY IF EXISTS "Service role can manage ASN search cache" ON public.asn_search_cache;
CREATE POLICY "Anyone can insert ASN search cache" ON public.asn_search_cache FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update ASN search cache" ON public.asn_search_cache FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete ASN search cache" ON public.asn_search_cache FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- reverse_ip_cache
DROP POLICY IF EXISTS "Service role can manage reverse IP cache" ON public.reverse_ip_cache;
CREATE POLICY "Anyone can insert reverse IP cache" ON public.reverse_ip_cache FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update reverse IP cache" ON public.reverse_ip_cache FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete reverse IP cache" ON public.reverse_ip_cache FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- dns_info
DROP POLICY IF EXISTS "Allow public access to dns_info" ON public.dns_info;
CREATE POLICY "Public can read dns_info" ON public.dns_info FOR SELECT USING (true);
CREATE POLICY "Public can insert dns_info" ON public.dns_info FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update dns_info" ON public.dns_info FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete dns_info" ON public.dns_info FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ssl_info
DROP POLICY IF EXISTS "Allow public access to ssl_info" ON public.ssl_info;
CREATE POLICY "Public can read ssl_info" ON public.ssl_info FOR SELECT USING (true);
CREATE POLICY "Public can insert ssl_info" ON public.ssl_info FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update ssl_info" ON public.ssl_info FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete ssl_info" ON public.ssl_info FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- tech_stack
DROP POLICY IF EXISTS "Allow public access to tech_stack" ON public.tech_stack;
CREATE POLICY "Public can read tech_stack" ON public.tech_stack FOR SELECT USING (true);
CREATE POLICY "Public can insert tech_stack" ON public.tech_stack FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update tech_stack" ON public.tech_stack FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete tech_stack" ON public.tech_stack FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- domain_analysis
DROP POLICY IF EXISTS "Allow public access to domain_analysis" ON public.domain_analysis;
CREATE POLICY "Public can read domain_analysis" ON public.domain_analysis FOR SELECT USING (true);
CREATE POLICY "Public can insert domain_analysis" ON public.domain_analysis FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update domain_analysis" ON public.domain_analysis FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete domain_analysis" ON public.domain_analysis FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- domain_categories
DROP POLICY IF EXISTS "Allow public access to domain_categories" ON public.domain_categories;
CREATE POLICY "Public can read domain_categories" ON public.domain_categories FOR SELECT USING (true);
CREATE POLICY "Public can insert domain_categories" ON public.domain_categories FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update domain_categories" ON public.domain_categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete domain_categories" ON public.domain_categories FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- domain_trends
DROP POLICY IF EXISTS "Allow public access to domain_trends" ON public.domain_trends;
CREATE POLICY "Public can read domain_trends" ON public.domain_trends FOR SELECT USING (true);
CREATE POLICY "Public can insert domain_trends" ON public.domain_trends FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update domain_trends" ON public.domain_trends FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete domain_trends" ON public.domain_trends FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- job_boards_data
DROP POLICY IF EXISTS "Allow public access to job_boards_data" ON public.job_boards_data;
CREATE POLICY "Public can read job_boards_data" ON public.job_boards_data FOR SELECT USING (true);
CREATE POLICY "Public can insert job_boards_data" ON public.job_boards_data FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update job_boards_data" ON public.job_boards_data FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete job_boards_data" ON public.job_boards_data FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- performance_metrics
DROP POLICY IF EXISTS "Allow public access to performance_metrics" ON public.performance_metrics;
CREATE POLICY "Public can read performance_metrics" ON public.performance_metrics FOR SELECT USING (true);
CREATE POLICY "Public can insert performance_metrics" ON public.performance_metrics FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update performance_metrics" ON public.performance_metrics FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete performance_metrics" ON public.performance_metrics FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 3) Restrict SECURITY DEFINER helper from anon/authenticated
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.get_public_domains() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_domains() TO service_role;
