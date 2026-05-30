CREATE TABLE public.hosting_review_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL,
  reviewer_name text NOT NULL,
  reviewer_email text NOT NULL,
  rating_overall integer NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_support integer CHECK (rating_support BETWEEN 1 AND 5),
  rating_speed integer CHECK (rating_speed BETWEEN 1 AND 5),
  rating_price integer CHECK (rating_price BETWEEN 1 AND 5),
  comment text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  moderation_notes text,
  moderated_by uuid,
  moderated_at timestamptz,
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.hosting_review_submissions TO anon, authenticated;
GRANT SELECT, UPDATE ON public.hosting_review_submissions TO authenticated;
GRANT ALL ON public.hosting_review_submissions TO service_role;

ALTER TABLE public.hosting_review_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit reviews"
  ON public.hosting_review_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view submissions"
  ON public.hosting_review_submissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update submissions"
  ON public.hosting_review_submissions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_hosting_review_submissions_updated_at
  BEFORE UPDATE ON public.hosting_review_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_hosting_review_submissions_status
  ON public.hosting_review_submissions(status, created_at DESC);