
-- 1. Extender hosting_companies
ALTER TABLE public.hosting_companies
  ADD COLUMN IF NOT EXISTS benchmark_target_url text,
  ADD COLUMN IF NOT EXISTS benchmark_enabled boolean NOT NULL DEFAULT false;

-- 2. uptime_pings
CREATE TABLE IF NOT EXISTS public.uptime_pings (
  id bigserial PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.hosting_companies(id) ON DELETE CASCADE,
  measured_at timestamptz NOT NULL DEFAULT now(),
  status_code int,
  ttfb_ms int,
  total_ms int,
  ok boolean NOT NULL DEFAULT false,
  error text,
  region text DEFAULT 'edge'
);
CREATE INDEX IF NOT EXISTS idx_uptime_pings_company_time
  ON public.uptime_pings(company_id, measured_at DESC);

ALTER TABLE public.uptime_pings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read uptime pings"
  ON public.uptime_pings FOR SELECT USING (true);
CREATE POLICY "Admins can manage uptime pings"
  ON public.uptime_pings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. benchmark_runs
CREATE TABLE IF NOT EXISTS public.benchmark_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_date timestamptz NOT NULL DEFAULT now(),
  methodology_version text NOT NULL DEFAULT 'v1.0',
  status text NOT NULL DEFAULT 'running',
  total_providers int NOT NULL DEFAULT 0,
  notes text
);
CREATE INDEX IF NOT EXISTS idx_benchmark_runs_date
  ON public.benchmark_runs(run_date DESC);

ALTER TABLE public.benchmark_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read benchmark runs"
  ON public.benchmark_runs FOR SELECT USING (true);
CREATE POLICY "Admins can manage benchmark runs"
  ON public.benchmark_runs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. benchmark_results
CREATE TABLE IF NOT EXISTS public.benchmark_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.benchmark_runs(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.hosting_companies(id) ON DELETE CASCADE,
  measured_at timestamptz NOT NULL DEFAULT now(),
  ttfb_median_ms int,
  ttfb_p95_ms int,
  ttfb_samples jsonb,
  lighthouse_perf int,
  lighthouse_seo int,
  lighthouse_a11y int,
  lcp_ms int,
  cls numeric,
  fcp_ms int,
  uptime_30d_pct numeric,
  server_software text,
  http_version text,
  has_brotli boolean,
  composite_score numeric,
  raw_json jsonb,
  error text
);
CREATE INDEX IF NOT EXISTS idx_results_company
  ON public.benchmark_results(company_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_run
  ON public.benchmark_results(run_id);

ALTER TABLE public.benchmark_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read benchmark results"
  ON public.benchmark_results FOR SELECT USING (true);
CREATE POLICY "Admins can manage benchmark results"
  ON public.benchmark_results FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. benchmark_methodology
CREATE TABLE IF NOT EXISTS public.benchmark_methodology (
  version text PRIMARY KEY,
  markdown text NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  is_current boolean NOT NULL DEFAULT false
);
ALTER TABLE public.benchmark_methodology ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read methodology"
  ON public.benchmark_methodology FOR SELECT USING (true);
CREATE POLICY "Admins can manage methodology"
  ON public.benchmark_methodology FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 6. Seed metodología v1.0
INSERT INTO public.benchmark_methodology (version, markdown, is_current)
VALUES (
  'v1.0',
$md$# Metodología de Benchmark v1.0

## Qué medimos

Para cada proveedor de hosting curado y verificado, medimos cinco dimensiones técnicas con fuentes reproducibles:

1. **TTFB (Time To First Byte)** — 5 mediciones secuenciales con `fetch GET` desde Supabase Edge (región us-east). Reportamos **mediana** y **p95**.
2. **Lighthouse Mobile** — Vía Google PageSpeed Insights API (estrategia `mobile`). Categorías: Performance, SEO, Accessibility.
3. **Core Web Vitals** — LCP, FCP, CLS extraídos del informe Lighthouse.
4. **Uptime 30 días** — Pings horarios desde edge function. Porcentaje de respuestas OK (status 2xx/3xx) en los últimos 30 días.
5. **Tecnología** — Header `Server`, soporte de Brotli (`Content-Encoding`), versión HTTP.

## URL medida

La URL pública configurada en `benchmark_target_url` (normalmente la home comercial del proveedor). Esta URL es visible en cada resultado y puede ser auditada por cualquier persona.

## Score compuesto

```
composite_score =
  0.35 × lighthouse_perf
+ 0.25 × ttfb_score
+ 0.25 × uptime_score
+ 0.15 × lighthouse_seo

ttfb_score   = max(0, 100 − ttfb_median_ms / 10)
uptime_score = uptime_30d_pct
```

Pesos elegidos para premiar velocidad real percibida (TTFB + Lighthouse) y disponibilidad por sobre métricas cosméticas.

## Frecuencia

- **Pings de uptime**: cada hora.
- **Benchmark completo**: día 1 de cada mes a las 03:00 CLT, más ejecuciones manuales auditables.

## Reproducibilidad

Cada `benchmark_result` guarda el JSON crudo de PageSpeed (`raw_json`) y las 5 muestras individuales de TTFB (`ttfb_samples`). Cualquier persona puede repetir las mediciones con las mismas URLs y herramientas.

## Limitaciones honestas

- TTFB se mide desde un único origen (us-east). No representa latencia desde Chile específicamente.
- Lighthouse usa la red simulada de PageSpeed, no una red chilena real.
- Estamos trabajando en agregar mediciones desde Santiago (CLT) en próximas versiones.
$md$,
  true
)
ON CONFLICT (version) DO NOTHING;

-- 7. Habilitar benchmark para empresas verificadas + curadas, copiando website
UPDATE public.hosting_companies
SET benchmark_target_url = website,
    benchmark_enabled = true
WHERE is_verified = true
  AND is_curated = true
  AND website IS NOT NULL
  AND website <> ''
  AND (benchmark_target_url IS NULL OR benchmark_target_url = '');
