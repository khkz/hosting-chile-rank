# Plan: Price Monitor (accuracy-first, revisión humana)

Misma arquitectura que `uptime-monitor`: edge function Deno + cron semanal + tabla de registros + panel admin. **Nunca** publica precios automáticamente.

## 1. Migración SQL (un solo `supabase--migration`)

**ALTER `hosting_companies`** — añadir columnas (todas nullable):
- `precio_url text`
- `precio_regular_clp integer`
- `precio_promo_clp integer`
- `precio_periodo text` — check in ('mensual','anual')
- `precio_regex text`
- `precio_verificado_at timestamptz`
- `precio_fuente text`

**CREATE TABLE `public.price_checks`**:
- `id uuid pk default gen_random_uuid()`
- `provider_id uuid not null references hosting_companies(id) on delete cascade`
- `fetched_at timestamptz not null default now()`
- `source_url text not null`
- `raw_snippet text` (máx ~500 chars del contexto del match)
- `precio_detectado_clp integer` (nullable)
- `status text not null` — check in ('ok','sin_cambios','cambio_detectado','extraccion_fallida')
- `delta_pct numeric` (nullable)
- `needs_review boolean not null default false`

GRANTs estándar: `authenticated` SELECT/INSERT/UPDATE/DELETE, `service_role` ALL. Sin `anon`.
RLS: lectura/escritura solo para `has_role(auth.uid(),'admin')`; edge function escribe con service_role (bypass).
Índice: `(provider_id, fetched_at desc)` y `(needs_review) where needs_review`.

## 2. Edge function `supabase/functions/price-monitor/index.ts`

Calcado de `uptime-monitor`:
- Lee proveedores con `precio_url is not null` y (opcional) `is_curated=true`.
- Por cada uno: `fetch(precio_url, { headers: { 'User-Agent': 'EligeTuHosting-PriceMonitor/1.0' }})` con timeout 15s.
- Extrae precio: si `precio_regex` está definido lo usa; si no, regex genérico CLP: `/\$\s?(\d{1,3}(?:[.\s]\d{3})+|\d{4,6})(?!\d)/`. Toma el **primer** match; normaliza quitando puntos/espacios → integer CLP.
- Guarda `raw_snippet` = ±80 chars alrededor del match (o primeros 300 chars del body si no hay match).
- Lógica de status:
  - sin match → `extraccion_fallida`, `needs_review=true`.
  - match + sin `precio_regular_clp` previo → `ok`, `needs_review=true` (primera vez).
  - match + delta ≤5% → `sin_cambios`.
  - match + delta >5% → `cambio_detectado`, `needs_review=true`.
- Inserta fila en `price_checks`. **No** toca `hosting_companies`.
- Errores de red/timeout → `extraccion_fallida` con snippet vacío y mensaje en `raw_snippet`.

`supabase/config.toml`: añadir `[functions.price-monitor] verify_jwt = false` (igual que uptime-monitor).

## 3. Cron semanal

Migración separada (datos, vía `supabase--insert` con `cron.schedule`) — mismo patrón que uptime:
```
select cron.schedule('price-monitor-weekly', '0 9 * * 1', $$
  select net.http_post(
    url:='https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/price-monitor',
    headers:='{"Content-Type":"application/json","apikey":"<ANON>"}'::jsonb,
    body:='{}'::jsonb
  );
$$);
```
Lunes 09:00 UTC. (La crearé tras aprobar el plan; requiere `pg_cron`+`pg_net` ya activos — los confirmo).

## 4. Panel admin `/admin/precios`

- Nueva ruta protegida `<ProtectedRoute allowedRoles={['admin']}>` en `App.tsx`.
- Nueva página `src/pages/admin/Precios.tsx`:
  - Query: último `price_checks` por proveedor (`distinct on (provider_id) ... order by provider_id, fetched_at desc`) + join a `hosting_companies` (name, precio_regular_clp, precio_verificado_at, precio_url).
  - Tabla columnas: Proveedor · Precio actual (CLP) · Último detectado · Δ% · Status (badge) · Fecha · Acción.
  - Filas con `needs_review` resaltadas (borde/bg accent).
  - Botón **Aprobar y actualizar** → `update hosting_companies set precio_regular_clp = detectado, precio_verificado_at = now(), precio_fuente = source_url where id = ...` + marca el check como revisado (`needs_review=false`).
  - Botón **Descartar** → solo limpia `needs_review`.
  - Link al snippet en un dialog para auditoría manual.

Sin cambios de diseño global; usa componentes shadcn ya presentes (Table, Badge, Button, Dialog).

## 5. Archivos a crear/editar

Crear:
- `supabase/functions/price-monitor/index.ts`
- `src/pages/admin/Precios.tsx`

Editar:
- `supabase/config.toml` (entrada función)
- `src/App.tsx` (ruta `/admin/precios`)
- `src/pages/admin/Dashboard.tsx` (link al panel, si existe nav admin — verificaré)

Migraciones:
- 1× schema (columnas + tabla + RLS + GRANTs + índices)
- 1× cron (`supabase--insert`, tras aprobar)

## Confirmaciones que necesito antes de codear
1. ¿OK lunes 09:00 UTC semanal, o prefieres otro día/hora?
2. ¿Aplicar a **todos** los proveedores con `precio_url` o solo `is_curated=true`?
3. ¿Umbral 5% está bien o prefieres otro (ej. 3%)?
