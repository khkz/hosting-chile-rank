
-- 1) hosting_reviews: revocar verification_email a anon + vista pública
REVOKE SELECT ON public.hosting_reviews FROM anon;
GRANT SELECT (id,company_id,user_id,overall_rating,speed_rating,support_rating,price_rating,title,comment,pros,cons,is_verified_customer,verification_method,verification_proof_url,status,moderation_notes,moderated_by,moderated_at,helpful_count,created_at,updated_at,customer_duration,would_recommend)
ON public.hosting_reviews TO anon;

CREATE OR REPLACE VIEW public.hosting_reviews_public
WITH (security_invoker=on) AS
SELECT id,company_id,user_id,overall_rating,speed_rating,support_rating,price_rating,
       title,comment,pros,cons,is_verified_customer,verification_method,verification_proof_url,
       status,moderation_notes,moderated_by,moderated_at,helpful_count,created_at,updated_at,
       customer_duration,would_recommend
FROM public.hosting_reviews;
GRANT SELECT ON public.hosting_reviews_public TO anon, authenticated;

-- 2) public_complaints: revocar reporter_email/reporter_name a anon + vista pública
REVOKE SELECT ON public.public_complaints FROM anon;
GRANT SELECT (id,company_id,title,description,category,severity,status,evidence_url,incident_date,email_verified,verified_at,provider_response,provider_responded_at,provider_responded_by,votes_count,admin_notes,created_at,updated_at)
ON public.public_complaints TO anon;

CREATE OR REPLACE VIEW public.public_complaints_public
WITH (security_invoker=on) AS
SELECT id,company_id,title,description,category,severity,status,evidence_url,incident_date,
       email_verified,verified_at,provider_response,provider_responded_at,provider_responded_by,
       votes_count,created_at,updated_at
FROM public.public_complaints;
GRANT SELECT ON public.public_complaints_public TO anon, authenticated;

-- 3) whois_info: eliminar policy pública USING(true) y revocar anon
DROP POLICY IF EXISTS "Public can view basic whois info" ON public.whois_info;
REVOKE SELECT ON public.whois_info FROM anon;

-- 4) sii_data: eliminar policy pública USING(true) y revocar anon
DROP POLICY IF EXISTS "Public can view basic sii data" ON public.sii_data;
REVOKE SELECT ON public.sii_data FROM anon;

-- 5) my_domain_portfolio: revocar campos financieros a anon
REVOKE SELECT ON public.my_domain_portfolio FROM anon;
GRANT SELECT (id,domain_name,tld,listing_price,is_for_sale,sale_status,page_views,inquiries_count,renewal_date,created_at,updated_at)
ON public.my_domain_portfolio TO anon;
