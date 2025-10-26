-- Fase 1: Sistema de Roles y Hosting Companies

-- 1. Crear enum para roles de usuario
CREATE TYPE public.app_role AS ENUM ('admin', 'hosting_provider', 'user');

-- 2. Tabla de roles de usuario
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Función de seguridad para verificar roles (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS en user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Tabla principal de empresas de hosting
CREATE TABLE public.hosting_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text,
  description text,
  year_founded integer,
  datacenter_location text,
  website text,
  
  -- Contacto
  contact_phone text,
  contact_email text,
  contact_address text,
  contact_hours text,
  
  -- Ratings (calculados automáticamente desde reviews)
  overall_rating numeric(3,2) DEFAULT 0.00 CHECK (overall_rating >= 0 AND overall_rating <= 10),
  speed_rating numeric(3,2) DEFAULT 0.00 CHECK (speed_rating >= 0 AND speed_rating <= 10),
  support_rating numeric(3,2) DEFAULT 0.00 CHECK (support_rating >= 0 AND support_rating <= 10),
  price_rating numeric(3,2) DEFAULT 0.00 CHECK (price_rating >= 0 AND price_rating <= 10),
  
  -- Estadísticas de reviews
  total_reviews integer DEFAULT 0,
  verified_reviews integer DEFAULT 0,
  
  -- Status
  is_verified boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  claimed_at timestamp with time zone,
  claimed_by uuid REFERENCES auth.users(id),
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 6. Índices para hosting_companies
CREATE INDEX idx_hosting_companies_slug ON public.hosting_companies(slug);
CREATE INDEX idx_hosting_companies_rating ON public.hosting_companies(overall_rating DESC);
CREATE INDEX idx_hosting_companies_claimed_by ON public.hosting_companies(claimed_by);

-- 7. RLS en hosting_companies
ALTER TABLE public.hosting_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified companies"
  ON public.hosting_companies FOR SELECT
  USING (is_verified = true);

CREATE POLICY "Admins can manage all companies"
  ON public.hosting_companies FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can update their own company"
  ON public.hosting_companies FOR UPDATE
  USING (claimed_by = auth.uid());

-- 8. Trigger para updated_at en hosting_companies
CREATE TRIGGER update_hosting_companies_updated_at
  BEFORE UPDATE ON public.hosting_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Tabla de planes de hosting
CREATE TABLE public.hosting_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.hosting_companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  price_monthly integer, -- Precio en CLP
  storage_gb integer,
  bandwidth text,
  domains_allowed integer,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 10. Índices para hosting_plans
CREATE INDEX idx_hosting_plans_company_id ON public.hosting_plans(company_id);

-- 11. RLS en hosting_plans
ALTER TABLE public.hosting_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans"
  ON public.hosting_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all plans"
  ON public.hosting_plans FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can manage their own plans"
  ON public.hosting_plans FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.hosting_companies hc
    WHERE hc.id = company_id AND hc.claimed_by = auth.uid()
  ));

-- 12. Trigger para updated_at en hosting_plans
CREATE TRIGGER update_hosting_plans_updated_at
  BEFORE UPDATE ON public.hosting_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();