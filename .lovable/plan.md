
# Plan: Reputación verificable con Reclamos.cl + reseñas reales

## Objetivo

Conectar la analítica de reclamos (que ya existe vía edge function `complaints-checker` pero solo se usa ad-hoc en el OSINT Scanner) con la ficha pública de cada proveedor, persistir un historial de "snapshots de reputación" y mostrarlos junto a las reseñas verificadas (`hosting_reviews`) en una tarjeta unificada con criterios claros y enlaces a la fuente original.

## Lo que ya existe (reutilizar)

- **Edge function `complaints-checker`**: busca en `reclamos.cl` vía Serper, extrae texto con Jina y resume con OpenAI. Devuelve `sentiment_score`, `main_complaints`, `severity`, `sources[]`. Hoy requiere `x-admin-api-key` y no persiste resultados.
- **Tabla `public_complaints`**: reclamos enviados por usuarios verificados por email (status `verified`/`resolved`).
- **Tabla `hosting_reviews`**: reseñas con sub-ratings (speed/support/price) y `is_verified_customer`.
- **`PublicReviewsList`**: ya muestra reseñas con distribución de estrellas; solo se monta en `CatalogoDetalle`.
- **`Resena.tsx`**: textos hardcoded sobre Reclamos.cl (a reemplazar por datos reales).
- **`rankingWeights.ts`**: declara que la reputación pesa 30 % con fuente "Reclamos.cl + reseñas verificadas".

## Cambios de base de datos

Nueva tabla **`reputation_snapshots`** para guardar el histórico del análisis de Reclamos.cl por proveedor:

- `company_id` (FK lógica a `hosting_companies`)
- `measured_at`
- `sentiment_score` (1–10)
- `severity` (`Alta`/`Media`/`Baja`)
- `main_complaints` (jsonb)
- `sources` (jsonb — URLs de reclamos.cl)
- `texts_extracted` (int)
- `methodology_version` (default `v1.0`)
- RLS: lectura pública, escritura solo admin / service role.

Nueva vista pública **`company_reputation_summary`** (security_invoker) que consolida por `company_id`:

- último `sentiment_score` y `severity` desde `reputation_snapshots`
- conteo de `public_complaints` con status `verified`/`resolved` últimos 12 meses, agrupado por `severity`
- conteo y promedio de `hosting_reviews` con status `approved` y % `is_verified_customer`
- `last_synced_at`

(Si la vista no permite las agregaciones que necesito de forma simple, se implementa como función SQL `get_company_reputation(company_id uuid)` con `SECURITY INVOKER`.)

## Edge functions

1. **Ampliar `complaints-checker`**:
   - Aceptar header `x-admin-api-key` *o* invocación interna desde otra edge function (service role) para mantener el guard.
   - Después de calcular el resultado, insertar una fila en `reputation_snapshots` con `service_role`.
   - Mantener compat con el OSINT Scanner.

2. **Nueva `refresh-reputation`** (admin):
   - Recibe `{ company_id }` o `{ all: true }` (rate limit 1/min por proveedor).
   - Llama a `complaints-checker` por cada `hosting_companies` con `is_verified && is_curated && benchmark_enabled`.
   - Devuelve resumen con OK/errores por proveedor.

3. **Cron mensual** (`pg_cron` en migración): dispara `refresh-reputation` el día 1 de cada mes a las 04:00.

## Frontend

### Nuevo componente `ReputationCard`
Bloque visible en la ficha pública (`Resena.tsx` y `CatalogoDetalle.tsx`) que muestra:

1. **Score reputacional** (0–10) con badge de color según `severity`.
2. **Origen de los datos** (chips):
   - "Reclamos verificados internos" → cuenta de `public_complaints` aprobados
   - "Reclamos.cl" → cuenta + último snapshot + enlace directo
   - "Reseñas verificadas" → cuenta de `hosting_reviews` con `is_verified_customer = true`
3. **Quejas principales** (lista corta) provenientes de `main_complaints` del último snapshot.
4. **Última actualización** + link a `/metodologia#reputacion`.
5. **Enlaces a fuentes**: cada URL de `sources` se muestra como link externo `rel="nofollow noopener"`.

Si no hay datos aún, muestra estado "Pendiente de auditoría" con CTA a la metodología (sin inventar números — regla brand).

### Nuevo hook `useCompanyReputation(companyId)`
Wrapper React Query sobre `company_reputation_summary`/función RPC, con cache 30 min.

### Cambios en páginas
- **`src/pages/Resena.tsx`**: eliminar los párrafos hardcoded sobre reclamos.cl y reemplazar por `<ReputationCard companyId={...} />`. Mantener pros/cons editoriales.
- **`src/pages/CatalogoDetalle.tsx`**: insertar `<ReputationCard>` arriba de `<PublicReviewsList>` para que las reseñas y la reputación externa convivan.
- **`src/pages/Reclamos.tsx`**: añadir un panel "Reputación agregada por proveedor" usando la nueva vista, con tabla ordenable (proveedor / score / # reclamos verificados / # reclamos.cl / fuente).

### Nuevo panel admin `ReputationSyncPanel`
En `src/pages/admin/Dashboard.tsx` o un nuevo `/admin/reputation`:
- Botón "Refrescar todo" (llama `refresh-reputation` con `all: true`).
- Tabla por proveedor: último `sentiment_score`, `last_synced_at`, botón "Refrescar".
- Bandera para excluir un proveedor (campo nuevo `reputation_sync_enabled` en `hosting_companies`, default true).

## Criterios de verificación visibles al usuario

En `ReputationCard` y en `/metodologia` se documentan los criterios:

- **Reseña verificada**: usuario autenticado + email confirmado + `is_verified_customer = true` (factura, captura de panel o dominio activo).
- **Reclamo verificado interno**: status = `verified` en `public_complaints` (email confirmado vía token de 48 h).
- **Reclamo externo**: aparece en resultados Google `site:reclamos.cl` y se cita la URL exacta.
- **Score**: derivado del último snapshot ponderado con la cuenta de reclamos verificados internos. Fórmula y pesos quedan en `rankingWeights.ts` y se renderizan en la metodología.

## SEO y schema

- Inyectar `Review` y `AggregateRating` JSON-LD en `Resena` y `CatalogoDetalle` con datos reales del summary (ya existe `SEOReviewSchema` — solo conectar al hook).
- Microcopy "Datos verificados" + enlaces a fuentes (mejora E-E-A-T y GEO).

## Reglas y restricciones del proyecto

- Mostrar la `ReputationCard` solo para proveedores con `is_verified && is_curated`.
- Sin afirmaciones falsas: si no hay snapshot, decirlo explícitamente.
- Quitar el badge "Open Data" de la página de Reclamos (regla brand).
- El campo `reporter_email`/`reporter_name` sigue oculto a no admins (fix de seguridad reciente).
- WCAG AA: cards con contraste, badges con texto + ícono (no solo color), targets ≥44 px.

## Fuera de alcance

- No se conecta a APIs pagadas (Trustpilot, Google Reviews) — solo Reclamos.cl + datos internos.
- No se cambia la fórmula del ranking ahora; sólo se asegura que el campo "reputación" tenga datos reales para alimentarla más adelante.
- No se permite a proveedores responder reseñas en este alcance (ya existe parcialmente vía `review_responses`).
