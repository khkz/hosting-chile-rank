-- Fase 3: Sistema de Certificaciones

-- Enum para status de certificación
CREATE TYPE certification_status AS ENUM ('pending', 'active', 'expired', 'revoked');

-- Enum para tier de certificación
CREATE TYPE certification_tier AS ENUM ('free', 'premium');

-- Tabla de categorías de certificación
CREATE TABLE public.certification_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text, -- emoji
  criteria jsonb, -- {min_reviews: 10, min_rating: 9.0}
  badge_image_url text,
  
  -- Pricing
  free_tier_features jsonb,
  premium_price_clp integer,
  premium_features jsonb,
  
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_cert_categories_slug ON public.certification_categories(slug);

ALTER TABLE public.certification_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON public.certification_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON public.certification_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de certificaciones de empresas
CREATE TABLE public.company_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.hosting_companies(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES public.certification_categories(id) ON DELETE CASCADE NOT NULL,
  
  tier certification_tier DEFAULT 'free',
  status certification_status DEFAULT 'pending',
  position integer CHECK (position >= 1 AND position <= 3),
  
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamp,
  expires_at timestamp,
  
  -- Pago (premium)
  payment_status text,
  payment_amount integer,
  payment_reference text,
  payment_date timestamp,
  
  -- Widget tracking
  requires_link_back boolean DEFAULT true,
  link_back_verified boolean DEFAULT false,
  link_back_verified_at timestamp,
  
  display_order integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  
  UNIQUE(company_id, category_id)
);

CREATE INDEX idx_company_certs_company_id ON public.company_certifications(company_id);
CREATE INDEX idx_company_certs_category_id ON public.company_certifications(category_id);
CREATE INDEX idx_company_certs_status ON public.company_certifications(status);

ALTER TABLE public.company_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active certifications"
  ON public.company_certifications FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can manage certifications"
  ON public.company_certifications FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can view their certifications"
  ON public.company_certifications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.hosting_companies hc
    WHERE hc.id = company_id AND hc.claimed_by = auth.uid()
  ));

-- Trigger para updated_at en certification_categories
CREATE TRIGGER update_certification_categories_updated_at
  BEFORE UPDATE ON public.certification_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at en company_certifications
CREATE TRIGGER update_company_certifications_updated_at
  BEFORE UPDATE ON public.company_certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar categorías iniciales
INSERT INTO public.certification_categories (slug, name, description, icon, criteria, premium_price_clp, display_order) VALUES
('mejor-wordpress', 'Mejor Hosting WordPress', 'Optimizado para WordPress con instalación en 1-click y soporte especializado', '🔷', '{"min_reviews": 10, "min_rating": 8.5}', 50000, 1),
('mas-rapido', 'Hosting Más Rápido', 'Velocidad de carga superior y tiempos de respuesta óptimos', '⚡', '{"min_reviews": 8, "min_rating": 8.0, "min_speed_score": 90}', 50000, 2),
('mejor-soporte', 'Mejor Soporte 24/7', 'Atención al cliente destacada disponible las 24 horas', '🎧', '{"min_reviews": 12, "min_rating": 8.5, "min_support_rating": 9.0}', 50000, 3),
('mejor-precio', 'Mejor Precio/Calidad', 'Relación precio-calidad excepcional en servicios de hosting', '💎', '{"min_reviews": 10, "min_rating": 8.0, "min_price_rating": 8.5}', 50000, 4),
('hosting-ecologico', 'Hosting Ecológico', 'Comprometido con energías renovables y prácticas sustentables', '🌱', '{"min_reviews": 5, "datacenter_green": true}', 50000, 5);