
# Mediciones automáticas de velocidad con historial y metodología pública

## Objetivo
Reemplazar los datos hardcodeados de `/benchmark` con mediciones reales, recurrentes y reproducibles por proveedor, mostrando fecha, fuente y metodología visible.

## 1. Esquema de base de datos (3 tablas nuevas)

```sql
-- Configuración de qué medir por empresa
ALTER TABLE hosting_companies 
  ADD COLUMN benchmark_target_url text,  -- URL pública a medir (sitio comercial o landing)
  ADD COLUMN benchmark_enabled boolean DEFAULT true;

-- Pings frecuentes (cada hora) → uptime + TTFB rolling
CREATE TABLE uptime_pings (
  id bigserial PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES hosting_companies(id) ON DELETE CASCADE,
  measured_at timestamptz NOT NULL DEFAULT now(),
  status_code int,
  ttfb_ms int,                  -- time to first byte
  total_ms int,                 -- request completo
  ok boolean NOT NULL,
  error text,
  region text DEFAULT 'edge'    -- región del worker (Deno Deploy ubicación)
);
CREATE INDEX idx_uptime_pings_company_time ON uptime_pings(company_id, measured_at DESC);

-- Snapshot mensual reproducible (Lighthouse + agregados)
CREATE TABLE benchmark_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_date timestamptz NOT NULL DEFAULT now(),
  methodology_version text NOT NULL DEFAULT 'v1.0',
  status text NOT NULL DEFAULT 'running',  -- running|completed|failed
  total_providers int DEFAULT 0
);

CREATE TABLE benchmark_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES benchmark_runs(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES hosting_companies(id),
  measured_at timestamptz NOT NULL DEFAULT now(),
  -- TTFB agregado (5 muestras, mediana)
  ttfb_median_ms int,
  ttfb_p95_ms int,
  ttfb_samples jsonb,          -- las 5 mediciones crudas
  -- Lighthouse / PageSpeed (mobile)
  lighthouse_perf int,         -- 0-100
  lighthouse_seo int,
  lighthouse_a11y int,
  lcp_ms int,
  cls numeric,
  fcp_ms int,
  -- Uptime calculado (últimos 30 días al momento del run)
  uptime_30d_pct numeric,
  -- Tecnología detectada
  server_software text,        -- header Server
  http_version text,           -- HTTP/1.1, HTTP/2, HTTP/3
  has_brotli boolean,
  -- Score compuesto (fórmula pública)
  composite_score numeric,
  raw_json jsonb               -- evidencia cruda de PageSpeed
);
CREATE INDEX idx_results_company ON benchmark_results(company_id, measured_at DESC);

-- Metodología versionada y pública
CREATE TABLE benchmark_methodology (
  version text PRIMARY KEY,
  markdown text NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  is_current boolean DEFAULT false
);
```

RLS: lectura pública en las 4 tablas; escritura solo service role.

## 2. Edge functions

### `uptime-monitor` (cron horario)
- Lee `hosting_companies` con `benchmark_enabled=true` y `benchmark_target_url` no nulo.
- Para cada una: `fetch(HEAD)` con timing, mide TTFB y total, status, timeout 10s.
- Inserta una fila por empresa en `uptime_pings`.
- Sin secretos externos.

### `run-benchmark` (cron mensual día 1, 03:00 CLT — disparable manual desde admin)
Por cada empresa habilitada:
1. **TTFB**: 5 fetch GET secuenciales con 2s de espera entre cada uno → mediana + p95 + array crudo.
2. **PageSpeed Insights API** (`GOOGLE_PAGESPEED_API_KEY` ya existe):  
   `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=...&strategy=mobile&category=performance&category=seo&category=accessibility`
3. **Headers**: extraer `Server`, detectar `br` en `Content-Encoding`, ALPN/HTTP version del response.
4. **Uptime 30d**: query a `uptime_pings` (% ok últimos 30 días).
5. **Composite score** (fórmula pública):  
   `0.35*lighthouse_perf + 0.25*ttfb_score + 0.25*uptime_score + 0.15*seo_score`  
   (donde `ttfb_score = max(0, 100 - ttfb_median_ms/10)` etc.)
6. Insertar en `benchmark_results`, marcar run `completed`.

### `trigger-benchmark` (POST manual, requiere `x-admin-api-key`)
- Crea nuevo `benchmark_runs` y dispara `run-benchmark` en background.

## 3. Cron jobs (pg_cron + pg_net)
```sql
-- Hourly uptime
select cron.schedule('uptime-monitor-hourly', '0 * * * *', $$
  select net.http_post(
    url:='https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/uptime-monitor',
    headers:='{"Content-Type":"application/json","apikey":"<ANON_KEY>"}'::jsonb,
    body:='{}'::jsonb
  );
$$);

-- Monthly full benchmark (día 1, 06:00 UTC = 03:00 CLT)
select cron.schedule('benchmark-monthly', '0 6 1 * *', $$
  select net.http_post(
    url:='https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/run-benchmark',
    headers:='{"Content-Type":"application/json","apikey":"<ANON_KEY>"}'::jsonb,
    body:='{}'::jsonb
  );
$$);
```

## 4. Frontend — reescribir `/benchmark`

Reemplazo total de `src/pages/Benchmark.tsx` (eliminar `benchmarkData` hardcodeado).

Estructura:
1. **Hero** con fecha del último run + versión metodología + botón "Descargar JSON crudo".
2. **Bloque metodología** (colapsable) leído de `benchmark_methodology` actual, render markdown.
3. **Tabla principal ordenable** (shadcn Table) con columnas: Proveedor · Score · TTFB · Lighthouse · Uptime 30d · Server · Última medición.
4. **4 charts** (recharts) con datos reales del último run: TTFB mediana, Lighthouse perf, Uptime 30d, distribución de scores.
5. **Histórico por proveedor**: dropdown + line chart de TTFB últimos 6 meses (`benchmark_results` filtrado).
6. **Tooltip por celda**: "Medido el {date} desde Supabase Edge ({region}). 5 muestras, mediana." + link al raw_json.
7. **Schema.org** `Dataset` + `Table` con datos reales y `dateModified`.

Hooks nuevos: `useLatestBenchmark()`, `useCompanyHistory(slug)` con React Query.

## 5. Panel admin
Nueva página `src/pages/admin/Benchmark.tsx`:
- Lista de empresas con `benchmark_target_url` editable inline + toggle `benchmark_enabled`.
- Botón "Ejecutar benchmark ahora" → llama `trigger-benchmark`.
- Tabla de runs históricos con status y conteo.
- Editor markdown de metodología (crear nueva versión).

## 6. Página `/metodologia-benchmark`
Nueva ruta pública que lee `benchmark_methodology` actual + lista versiones anteriores. Linkeada desde `/benchmark` y desde el footer.

## 7. Datos iniciales (seed)
- Insertar metodología v1.0 con la fórmula del score y las fuentes.
- UPDATE `hosting_companies` curadas: copiar `website` a `benchmark_target_url` para las 17 verificadas.
- Trigger manual del primer run desde admin para tener datos visibles inmediatamente.

## 8. Detalles técnicos clave
- **Rate limit PageSpeed**: 25k req/día gratis. Con 17-30 empresas mensuales, sobrado.
- **Concurrencia en `run-benchmark`**: serial con 3s entre llamadas para no saturar.
- **Timezone**: todos los timestamps `timestamptz`, render en frontend con `date-fns` en `es-CL`.
- **Composite score**: documentado en metodología, fórmula visible al usuario, sin pesos ocultos.
- **No tocar**: tablas/funciones existentes, layout general del sitio, navbar/footer.

## 9. Validación de éxito
- Tras desplegar y trigger manual: `/benchmark` muestra datos reales con fecha actual.
- Tras 24h: `uptime_pings` tiene 24 filas por empresa habilitada.
- Tooltip de cada métrica enlaza a `raw_json` descargable.
- Cero números hardcodeados en `Benchmark.tsx`.

## Confirmaciones antes de ejecutar
1. ¿Apruebas crear las 4 tablas + ALTER en `hosting_companies`?
2. ¿Empezamos midiendo solo las **17 empresas curadas** o las 33?
3. ¿Lanzamos el primer benchmark manual al terminar la implementación (sí recomendado)?
