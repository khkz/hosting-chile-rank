-- Enums
CREATE TYPE public.complaint_status AS ENUM ('pending_verification', 'verified', 'resolved', 'rejected', 'flagged');
CREATE TYPE public.complaint_category AS ENUM ('service_quality', 'support', 'billing', 'downtime', 'cancellation', 'misleading_advertising', 'other');

-- Tabla principal de reclamos
CREATE TABLE public.public_complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.hosting_companies(id) ON DELETE CASCADE,
  reporter_email TEXT NOT NULL,
  reporter_name TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.complaint_category NOT NULL DEFAULT 'other',
  severity INTEGER NOT NULL DEFAULT 3 CHECK (severity BETWEEN 1 AND 5),
  status public.complaint_status NOT NULL DEFAULT 'pending_verification',
  evidence_url TEXT,
  incident_date DATE,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  provider_response TEXT,
  provider_responded_at TIMESTAMP WITH TIME ZONE,
  provider_responded_by UUID,
  admin_notes TEXT,
  votes_count INTEGER NOT NULL DEFAULT 0,
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_public_complaints_company ON public.public_complaints(company_id);
CREATE INDEX idx_public_complaints_status ON public.public_complaints(status);
CREATE INDEX idx_public_complaints_created ON public.public_complaints(created_at DESC);

ALTER TABLE public.public_complaints ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver reclamos ya verificados (públicos)
CREATE POLICY "Anyone can view verified complaints"
ON public.public_complaints FOR SELECT
USING (status IN ('verified', 'resolved'));

-- Cualquiera puede crear (queda pendiente hasta verificar)
CREATE POLICY "Anyone can submit complaints"
ON public.public_complaints FOR INSERT
WITH CHECK (status = 'pending_verification' AND email_verified = false);

-- Admins gestionan todo
CREATE POLICY "Admins can manage complaints"
ON public.public_complaints FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Proveedores pueden ver y responder a reclamos sobre su empresa
CREATE POLICY "Providers can view their complaints"
ON public.public_complaints FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.hosting_companies hc
  WHERE hc.id = public_complaints.company_id AND hc.claimed_by = auth.uid()
));

CREATE POLICY "Providers can respond to their complaints"
ON public.public_complaints FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.hosting_companies hc
  WHERE hc.id = public_complaints.company_id AND hc.claimed_by = auth.uid()
));

-- Tabla de tokens de verificación por email
CREATE TABLE public.complaint_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id UUID NOT NULL REFERENCES public.public_complaints(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '48 hours'),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_complaint_verifications_token ON public.complaint_verifications(token);

ALTER TABLE public.complaint_verifications ENABLE ROW LEVEL SECURITY;

-- Solo admins ven los tokens; el edge function usa service role
CREATE POLICY "Admins can view verifications"
ON public.complaint_verifications FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de votos "me pasó lo mismo"
CREATE TABLE public.complaint_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id UUID NOT NULL REFERENCES public.public_complaints(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(complaint_id, ip_hash)
);

CREATE INDEX idx_complaint_votes_complaint ON public.complaint_votes(complaint_id);

ALTER TABLE public.complaint_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes"
ON public.complaint_votes FOR SELECT
USING (true);

CREATE POLICY "Anyone can vote"
ON public.complaint_votes FOR INSERT
WITH CHECK (true);

-- Trigger para actualizar votes_count
CREATE OR REPLACE FUNCTION public.increment_complaint_votes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.public_complaints
  SET votes_count = votes_count + 1
  WHERE id = NEW.complaint_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_increment_complaint_votes
AFTER INSERT ON public.complaint_votes
FOR EACH ROW
EXECUTE FUNCTION public.increment_complaint_votes();

-- Trigger updated_at
CREATE TRIGGER trg_public_complaints_updated_at
BEFORE UPDATE ON public.public_complaints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();