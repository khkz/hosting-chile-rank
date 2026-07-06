
-- hosting_reviews: revocar columnas sensibles también a authenticated (y a public por defecto)
REVOKE SELECT (verification_email, moderation_notes, verification_proof_url) ON public.hosting_reviews FROM authenticated, anon, PUBLIC;

-- public_complaints: revocar reporter_email/reporter_name a authenticated
REVOKE SELECT (reporter_email, reporter_name, ip_hash) ON public.public_complaints FROM authenticated, anon, PUBLIC;

-- my_domain_portfolio: revocar campos financieros a authenticated
REVOKE SELECT (purchase_price, purchase_source, purchase_reference, annual_cost, notes, purchase_date) ON public.my_domain_portfolio FROM authenticated, anon, PUBLIC;

-- whois_info: eliminar el fallback user_id IS NULL que dejaba PII abierta
DROP POLICY IF EXISTS "Los usuarios pueden ver su propia información WHOIS" ON public.whois_info;
CREATE POLICY "Users can view their own whois info"
ON public.whois_info FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
