-- Create enums for domain statuses
CREATE TYPE public.domain_opportunity_status AS ENUM (
  'pending_analysis',
  'analyzed',
  'discarded',
  'queued_for_buy',
  'purchased',
  'failed'
);

CREATE TYPE public.domain_sale_status AS ENUM (
  'available',
  'negotiating',
  'sold',
  'not_for_sale'
);

CREATE TYPE public.inquiry_status AS ENUM (
  'new',
  'contacted',
  'negotiating',
  'closed',
  'rejected'
);

-- Table: domain_opportunities
CREATE TABLE public.domain_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_name TEXT NOT NULL,
  tld TEXT,
  source TEXT,
  source_url TEXT,
  expiration_date TIMESTAMP WITH TIME ZONE,
  status public.domain_opportunity_status DEFAULT 'pending_analysis',
  ai_score DECIMAL(3,1),
  ai_category TEXT,
  ai_rationale TEXT,
  estimated_value INTEGER,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  analyzed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT domain_opportunities_domain_unique UNIQUE (domain_name)
);

-- Table: my_domain_portfolio
CREATE TABLE public.my_domain_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_name TEXT NOT NULL,
  tld TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE,
  purchase_price INTEGER,
  purchase_source TEXT,
  purchase_reference TEXT,
  renewal_date TIMESTAMP WITH TIME ZONE,
  annual_cost INTEGER,
  listing_price INTEGER,
  is_for_sale BOOLEAN DEFAULT false,
  sale_status public.domain_sale_status DEFAULT 'not_for_sale',
  page_views INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT my_domain_portfolio_domain_unique UNIQUE (domain_name)
);

-- Table: domain_inquiries
CREATE TABLE public.domain_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES public.my_domain_portfolio(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  offer_amount INTEGER,
  message TEXT,
  status public.inquiry_status DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: domain_sniper_settings (single row for global settings)
CREATE TABLE public.domain_sniper_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auto_sniper_enabled BOOLEAN DEFAULT false,
  min_score_auto_buy DECIMAL(3,1) DEFAULT 9.0,
  daily_budget INTEGER DEFAULT 100000,
  max_domain_price INTEGER DEFAULT 50000,
  notify_email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_domain_opportunities_status ON public.domain_opportunities(status);
CREATE INDEX idx_domain_opportunities_ai_score ON public.domain_opportunities(ai_score DESC);
CREATE INDEX idx_my_domain_portfolio_is_for_sale ON public.my_domain_portfolio(is_for_sale);
CREATE INDEX idx_domain_inquiries_status ON public.domain_inquiries(status);
CREATE INDEX idx_domain_inquiries_domain_id ON public.domain_inquiries(domain_id);

-- Enable RLS on all tables
ALTER TABLE public.domain_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.my_domain_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_sniper_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for domain_opportunities (Admin only)
CREATE POLICY "Admins can manage domain opportunities"
  ON public.domain_opportunities
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for my_domain_portfolio
CREATE POLICY "Public can view domains for sale"
  ON public.my_domain_portfolio
  FOR SELECT
  USING (is_for_sale = true);

CREATE POLICY "Admins can manage all portfolio domains"
  ON public.my_domain_portfolio
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for domain_inquiries
CREATE POLICY "Anyone can submit inquiries"
  ON public.domain_inquiries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage inquiries"
  ON public.domain_inquiries
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for domain_sniper_settings (Admin only)
CREATE POLICY "Admins can manage sniper settings"
  ON public.domain_sniper_settings
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at on all tables
CREATE TRIGGER update_domain_opportunities_updated_at
  BEFORE UPDATE ON public.domain_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_my_domain_portfolio_updated_at
  BEFORE UPDATE ON public.my_domain_portfolio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_domain_inquiries_updated_at
  BEFORE UPDATE ON public.domain_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_domain_sniper_settings_updated_at
  BEFORE UPDATE ON public.domain_sniper_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings row
INSERT INTO public.domain_sniper_settings (
  auto_sniper_enabled,
  min_score_auto_buy,
  daily_budget,
  max_domain_price
) VALUES (
  false,
  9.0,
  100000,
  50000
);

-- Function to increment inquiry count when new inquiry is created
CREATE OR REPLACE FUNCTION public.increment_inquiry_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE my_domain_portfolio
  SET inquiries_count = inquiries_count + 1
  WHERE id = NEW.domain_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_inquiry_created
  AFTER INSERT ON public.domain_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_inquiry_count();