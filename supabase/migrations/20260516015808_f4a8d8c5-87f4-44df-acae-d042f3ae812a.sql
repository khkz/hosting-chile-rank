
-- 1. hosting_reviews: hide verification_email from public
REVOKE SELECT (verification_email) ON public.hosting_reviews FROM anon, authenticated;

-- 2. whois_info: hide PII from anonymous visitors
REVOKE SELECT (owner_name, email, phone, address) ON public.whois_info FROM anon;

-- 3. my_domain_portfolio: hide financial/internal columns from anonymous visitors
REVOKE SELECT (purchase_price, purchase_source, purchase_reference, annual_cost, notes) ON public.my_domain_portfolio FROM anon;

-- 4. sii_data: replace permissive policy with admin-only management
DROP POLICY IF EXISTS "Authenticated users can manage sii data" ON public.sii_data;
CREATE POLICY "Admins can manage sii data"
  ON public.sii_data
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. complaint_votes: restrict raw SELECT to admins (inserts unchanged)
DROP POLICY IF EXISTS "Anyone can view votes" ON public.complaint_votes;
CREATE POLICY "Admins can view votes"
  ON public.complaint_votes
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 6. review_helpful_votes: restrict raw SELECT to admins (inserts unchanged)
DROP POLICY IF EXISTS "Anyone can view helpful votes" ON public.review_helpful_votes;
CREATE POLICY "Admins can view helpful votes"
  ON public.review_helpful_votes
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
