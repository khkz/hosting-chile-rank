-- Fase 2: Sistema de Reviews
-- Enum para estados de review
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');

-- Tabla de reviews de hosting
CREATE TABLE public.hosting_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.hosting_companies(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Ratings (1-10)
  overall_rating integer CHECK (overall_rating >= 1 AND overall_rating <= 10) NOT NULL,
  speed_rating integer CHECK (speed_rating >= 1 AND speed_rating <= 10),
  support_rating integer CHECK (support_rating >= 1 AND support_rating <= 10),
  price_rating integer CHECK (price_rating >= 1 AND price_rating <= 10),
  
  -- Contenido
  title text,
  comment text NOT NULL,
  pros text[] DEFAULT array[]::text[],
  cons text[] DEFAULT array[]::text[],
  
  -- Verificación
  is_verified_customer boolean DEFAULT false,
  verification_method text,
  verification_proof_url text,
  
  -- Moderación
  status review_status DEFAULT 'pending',
  moderation_notes text,
  moderated_by uuid REFERENCES auth.users(id),
  moderated_at timestamp with time zone,
  
  -- Engagement
  helpful_count integer DEFAULT 0,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  UNIQUE(company_id, user_id)
);

CREATE INDEX idx_reviews_company_id ON public.hosting_reviews(company_id);
CREATE INDEX idx_reviews_user_id ON public.hosting_reviews(user_id);
CREATE INDEX idx_reviews_status ON public.hosting_reviews(status);
CREATE INDEX idx_reviews_created_at ON public.hosting_reviews(created_at DESC);

-- RLS Policies para reviews
ALTER TABLE public.hosting_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews"
  ON public.hosting_reviews FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can view their own reviews"
  ON public.hosting_reviews FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create reviews"
  ON public.hosting_reviews FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their pending reviews"
  ON public.hosting_reviews FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all reviews"
  ON public.hosting_reviews FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de respuestas de empresas a reviews
CREATE TABLE public.review_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES public.hosting_reviews(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_id uuid REFERENCES public.hosting_companies(id) ON DELETE CASCADE NOT NULL,
  responded_by uuid REFERENCES auth.users(id) NOT NULL,
  response_text text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_review_responses_review_id ON public.review_responses(review_id);

ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view responses"
  ON public.review_responses FOR SELECT
  USING (true);

CREATE POLICY "Providers can create responses for their company"
  ON public.review_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hosting_companies hc
      WHERE hc.id = company_id AND hc.claimed_by = auth.uid()
    )
  );

-- Trigger para actualizar ratings de empresa automáticamente
CREATE OR REPLACE FUNCTION update_company_ratings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.hosting_companies
  SET 
    overall_rating = (
      SELECT ROUND(AVG(overall_rating)::numeric, 2)
      FROM public.hosting_reviews
      WHERE company_id = NEW.company_id AND status = 'approved'
    ),
    speed_rating = (
      SELECT ROUND(AVG(speed_rating)::numeric, 2)
      FROM public.hosting_reviews
      WHERE company_id = NEW.company_id AND status = 'approved' AND speed_rating IS NOT NULL
    ),
    support_rating = (
      SELECT ROUND(AVG(support_rating)::numeric, 2)
      FROM public.hosting_reviews
      WHERE company_id = NEW.company_id AND status = 'approved' AND support_rating IS NOT NULL
    ),
    price_rating = (
      SELECT ROUND(AVG(price_rating)::numeric, 2)
      FROM public.hosting_reviews
      WHERE company_id = NEW.company_id AND status = 'approved' AND price_rating IS NOT NULL
    ),
    total_reviews = (
      SELECT COUNT(*) FROM public.hosting_reviews
      WHERE company_id = NEW.company_id AND status = 'approved'
    ),
    verified_reviews = (
      SELECT COUNT(*) FROM public.hosting_reviews
      WHERE company_id = NEW.company_id AND status = 'approved' AND is_verified_customer = true
    )
  WHERE id = NEW.company_id;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_ratings_after_review_change
  AFTER INSERT OR UPDATE ON public.hosting_reviews
  FOR EACH ROW
  WHEN (NEW.status = 'approved')
  EXECUTE FUNCTION update_company_ratings();

-- Trigger para updated_at en reviews
CREATE TRIGGER update_hosting_reviews_updated_at
  BEFORE UPDATE ON public.hosting_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at en review_responses
CREATE TRIGGER update_review_responses_updated_at
  BEFORE UPDATE ON public.review_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();