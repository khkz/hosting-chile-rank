
-- Plans enum
CREATE TYPE public.seo_audit_plan AS ENUM ('starter', 'pro', 'agency');
CREATE TYPE public.seo_audit_sub_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'paused');
CREATE TYPE public.seo_audit_status AS ENUM ('queued', 'running', 'completed', 'failed');
CREATE TYPE public.seo_issue_severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');
CREATE TYPE public.seo_issue_category AS ENUM ('technical', 'on_page', 'content', 'backlinks', 'ux', 'mobile', 'security', 'schema', 'international');

-- Subscriptions
CREATE TABLE public.seo_audit_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan public.seo_audit_plan NOT NULL DEFAULT 'starter',
  status public.seo_audit_sub_status NOT NULL DEFAULT 'trialing',
  domains_quota INTEGER NOT NULL DEFAULT 1,
  keywords_quota INTEGER NOT NULL DEFAULT 50,
  audit_frequency TEXT NOT NULL DEFAULT 'monthly',
  payment_provider TEXT,
  payment_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_seo_subs_user ON public.seo_audit_subscriptions(user_id);
ALTER TABLE public.seo_audit_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscriptions" ON public.seo_audit_subscriptions
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage subscriptions" ON public.seo_audit_subscriptions
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Domains monitored
CREATE TABLE public.seo_audit_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.seo_audit_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  domain TEXT NOT NULL,
  country_code TEXT DEFAULT 'cl',
  language_code TEXT DEFAULT 'es',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_audited_at TIMESTAMPTZ,
  current_score NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(subscription_id, domain)
);
CREATE INDEX idx_seo_domains_user ON public.seo_audit_domains(user_id);
ALTER TABLE public.seo_audit_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own domains" ON public.seo_audit_domains
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage all seo domains" ON public.seo_audit_domains
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Audits
CREATE TABLE public.seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID REFERENCES public.seo_audit_domains(id) ON DELETE CASCADE,
  user_id UUID,
  domain TEXT NOT NULL,
  status public.seo_audit_status NOT NULL DEFAULT 'queued',
  score_total NUMERIC(5,2),
  score_technical NUMERIC(5,2),
  score_content NUMERIC(5,2),
  score_backlinks NUMERIC(5,2),
  score_ux NUMERIC(5,2),
  score_serp NUMERIC(5,2),
  report_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_mini BOOLEAN NOT NULL DEFAULT false,
  cost_usd NUMERIC(8,4) DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_seo_audits_domain ON public.seo_audits(domain_id);
CREATE INDEX idx_seo_audits_user ON public.seo_audits(user_id);
CREATE INDEX idx_seo_audits_created ON public.seo_audits(created_at DESC);
ALTER TABLE public.seo_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own audits" ON public.seo_audits
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage audits" ON public.seo_audits
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Issues per audit
CREATE TABLE public.seo_audit_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES public.seo_audits(id) ON DELETE CASCADE,
  user_id UUID,
  category public.seo_issue_category NOT NULL,
  severity public.seo_issue_severity NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  recommendation TEXT,
  affected_url TEXT,
  impact_score INTEGER DEFAULT 0,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_seo_issues_audit ON public.seo_audit_issues(audit_id);
ALTER TABLE public.seo_audit_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own issues" ON public.seo_audit_issues
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage issues" ON public.seo_audit_issues
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Keywords tracking
CREATE TABLE public.seo_audit_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES public.seo_audit_domains(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  keyword TEXT NOT NULL,
  position INTEGER,
  previous_position INTEGER,
  search_volume INTEGER,
  cpc NUMERIC(8,2),
  difficulty INTEGER,
  url TEXT,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_seo_kw_domain ON public.seo_audit_keywords(domain_id, measured_at DESC);
ALTER TABLE public.seo_audit_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own keywords" ON public.seo_audit_keywords
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage keywords" ON public.seo_audit_keywords
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Leads from free mini-audit
CREATE TABLE public.seo_audit_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  email TEXT,
  name TEXT,
  phone TEXT,
  mini_audit_id UUID REFERENCES public.seo_audits(id) ON DELETE SET NULL,
  mini_score NUMERIC(5,2),
  source TEXT DEFAULT 'landing',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  contacted BOOLEAN DEFAULT false,
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_seo_leads_created ON public.seo_audit_leads(created_at DESC);
ALTER TABLE public.seo_audit_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit lead" ON public.seo_audit_leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view leads" ON public.seo_audit_leads
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage leads" ON public.seo_audit_leads
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Rate limiting (edge-function-only)
CREATE TABLE public.seo_audit_rate_limit (
  ip_hash TEXT NOT NULL,
  bucket_date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 1,
  last_request_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (ip_hash, bucket_date)
);
ALTER TABLE public.seo_audit_rate_limit ENABLE ROW LEVEL SECURITY;
-- No public policies: only service_role from edge functions writes here.
CREATE POLICY "Admins view rate limit" ON public.seo_audit_rate_limit
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- updated_at triggers
CREATE TRIGGER trg_seo_subs_updated BEFORE UPDATE ON public.seo_audit_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_seo_domains_updated BEFORE UPDATE ON public.seo_audit_domains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
