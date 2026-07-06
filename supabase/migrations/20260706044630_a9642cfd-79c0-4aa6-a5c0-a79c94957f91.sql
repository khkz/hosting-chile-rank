
-- Habilitar benchmarks (uptime hourly) para proveedores LATAM
UPDATE public.hosting_companies
SET benchmark_target_url = COALESCE(benchmark_target_url, website),
    benchmark_enabled = true
WHERE country IN ('PE','MX','CO','AR')
  AND website IS NOT NULL
  AND website <> ''
  AND is_verified = true;
