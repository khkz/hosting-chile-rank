-- 1) Escritura solo backend (service_role) en tablas de datos técnicos/caché
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'asn_data_cache','asn_search_cache','reverse_ip_cache','dns_info','ssl_info',
    'tech_stack','domain_analysis','domain_categories','domain_trends',
    'job_boards_data','performance_metrics'
  ]
  LOOP
    EXECUTE format('REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

-- 2) news_articles: lectura pública, escritura solo admin (o backend con service_role)
DROP POLICY IF EXISTS "Service role can manage news articles" ON public.news_articles;

CREATE POLICY "Admins can manage news articles"
ON public.news_articles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.news_articles FROM anon;
GRANT SELECT ON public.news_articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_articles TO authenticated;
GRANT ALL ON public.news_articles TO service_role;
