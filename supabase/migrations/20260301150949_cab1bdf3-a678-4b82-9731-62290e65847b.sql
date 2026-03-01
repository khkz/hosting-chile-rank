
-- Create company_audit_log table
CREATE TABLE public.company_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.hosting_companies(id) ON DELETE CASCADE,
  scraped_data jsonb DEFAULT '{}'::jsonb,
  complaints_data jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can manage audit logs
CREATE POLICY "Admins can manage audit logs"
ON public.company_audit_log
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
