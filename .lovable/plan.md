
## Objetivo

La página `/benchmark` ya existe con infraestructura real (`run-benchmark`, `uptime-monitor`, tablas `benchmark_runs`/`benchmark_results`/`uptime_pings`). Falta: (a) reforzar la transparencia con fuentes citadas y poner datos verificables visibles, y (b) **eliminar los uptimes/ratings inventados** que aún viven en componentes y páginas (`Ranking.tsx`, `TrustReport.tsx`, `Benefits.tsx`, `BeforeAfter.tsx`, `CertificationsBanner.tsx`, `HostingQuiz.tsx`, `Resena.tsx`, `GuiaElegirVPS.tsx`).

## Parte 1 — Reforzar `/benchmark` con fuentes verificables

### 1.1 Bloque "Fuentes y herramientas" (nuevo componente)

En `src/pages/Benchmark.tsx`, agregar una sección visible "De dónde vienen estos datos" que cite:

- **TTFB / Headers**: medición propia desde Supabase Edge (`run-benchmark`, código abierto en repo). Link al archivo en GitHub si existe `GH_PAT`, o al pie con SHA del último deploy.
- **Lighthouse (Performance / SEO / A11y / LCP / CLS)**: Google PageSpeed Insights API v5, `strategy=mobile`. Link público a `https://pagespeed.web.dev/analysis?url=<target>` por proveedor para que el usuario reproduzca.
- **Uptime 30d**: pings horarios HEAD/GET a `benchmark_target_url` (`uptime-monitor` cada hora vía cron, tabla `uptime_pings`). Mostrar `n` muestras tomadas en el período.
- **Compuesto**: fórmula explícita visible (35% Lighthouse perf + 25% TTFB + 25% uptime + 15% SEO) con link a `/metodologia-benchmark`.

### 1.2 Por proveedor, mostrar reproducibilidad

En `BenchmarkRowItem`, ampliar tooltips/expand con:

- URL exacta medida (`benchmark_target_url`) ya está, añadir botón "Reproducir en PageSpeed →".
- Cantidad de muestras de uptime (`COUNT(uptime_pings) WHERE company_id = ... AND measured_at > now()-30d`).
- Fecha de inicio del monitoreo (primer ping).
- Badge "Sin datos suficientes" cuando `n < 24` pings (menos de un día).

### 1.3 Disparar primer run real

Añadir al panel admin existente o ejecutar en deploy:

- Botón en `/admin` (o página nueva `/admin/benchmark`) que llame a `run-benchmark` con `x-admin-api-key` y muestre el run en curso.
- Mostrar histórico de runs (`benchmark_runs`) con estado y notas.

### 1.4 SEO/GEO

Mantener `Dataset` JSON-LD ya presente. Añadir `dateCreated` (fecha del primer run), `temporalCoverage`, `variableMeasured` con cada métrica + unidad.

## Parte 2 — Eliminar valores inventados

Política: **si no viene del benchmark real o de un campo poblado por admin con confianza explícita, no se muestra como número específico**. Reemplazar por:

- Datos reales del último `benchmark_results` cuando exista.
- Texto cualitativo ("uptime alto verificado por nuestro monitoreo continuo") con link a `/benchmark`.
- O eliminar del todo si el contexto no lo requiere.

### 2.1 `src/pages/Ranking.tsx`
Quitar `uptime: "99.98%"` / `"99.96%"` / `"99.93%"` y `speed: "9.9/10"` etc. del array hardcodeado. Dejar features cualitativas y un link "Ver mediciones reales →" a `/benchmark#<slug>`.

### 2.2 `src/components/TrustReport.tsx`
Eliminar `defaultProviders` con `uptimeVerified: 99.98` etc. Si el componente se sigue usando, reemplazar por hook que lea `benchmark_results` join `hosting_companies` (top 3 por `composite_score`). Si no hay datos, mostrar estado vacío honesto: "Aún publicaremos métricas verificadas tras el primer run mensual".

### 2.3 `src/components/Benefits.tsx`
Quitar el bloque "99.9% / <200ms / 24/7" con cifras inventadas. Reemplazar por enlaces: "Uptime real medido →" `/benchmark`, "Velocidad real medida →" `/benchmark`, dejando solo "Soporte 24/7" como atributo cualitativo (verificable). También quitar "Más de 22,000 sitios confían…" si no es comprobable.

### 2.4 `src/components/BeforeAfter.tsx`
Cambiar "99.98% uptime verificado" por "Uptime monitoreado continuamente — ver `/benchmark`".

### 2.5 `src/components/CertificationsBanner.tsx`
Reformular "Uptime superior al 99.9%" como criterio de elegibilidad ("Proveedores con uptime ≥ 99.9% según nuestro monitoreo de 30 días") con link a `/benchmark`.

### 2.6 `src/components/HostingQuiz.tsx`
Reemplazar `'Uptime 99.98%'` en features por algo cualitativo o eliminarlo.

### 2.7 `src/pages/Resena.tsx` y `src/pages/GuiaElegirVPS.tsx`
Quitar números específicos inventados ("99.97% hace 14 meses", "Buen uptime (99.9%)"). Reemplazar por frases como "uptime alto según nuestro monitoreo (ver `/benchmark`)".

### 2.8 Glosario / Guías genéricas
**Mantener** las menciones a "99.9%" en `TechnicalGlossary.tsx`, `GuiaCompletaElegirHosting.tsx`, `GuiaElegirHosting.tsx`, `GuiaElegirServidorDedicado.tsx` y `Setup.tsx` (criterios de admin) — son explicaciones genéricas o criterios de evaluación, no afirmaciones sobre proveedores específicos.

## Parte 3 — Componentes nuevos

- `src/components/benchmark/SourcesCard.tsx`: lista de fuentes con iconos y enlaces.
- `src/components/benchmark/ReproduceButton.tsx`: link directo a `pagespeed.web.dev` por URL.
- `src/hooks/useBenchmarkTopProviders.ts`: top N por `composite_score` para reemplazar mocks de `TrustReport`.
- `src/pages/admin/BenchmarkRuns.tsx` (opcional): UI para disparar y ver runs.

## Archivos a editar/crear

**Crear:**
- `src/components/benchmark/SourcesCard.tsx`
- `src/components/benchmark/ReproduceButton.tsx`
- `src/hooks/useBenchmarkTopProviders.ts`
- `src/pages/admin/BenchmarkRuns.tsx`
- Ruta en `App.tsx` para `/admin/benchmark`

**Editar:**
- `src/pages/Benchmark.tsx` (añadir SourcesCard + ReproduceButton + variableMeasured en JSON-LD)
- `src/pages/Ranking.tsx` (quitar uptime/speed inventados)
- `src/components/TrustReport.tsx` (usar hook real o estado vacío)
- `src/components/Benefits.tsx` (quitar bloque "99.9% / <200ms / 22.000 sitios")
- `src/components/BeforeAfter.tsx` (reformular)
- `src/components/CertificationsBanner.tsx` (reformular)
- `src/components/HostingQuiz.tsx` (quitar "Uptime 99.98%")
- `src/pages/Resena.tsx` (quitar uptimes específicos por proveedor)
- `src/pages/GuiaElegirVPS.tsx` (quitar uptimes específicos)

**Memoria:**
- Actualizar `mem://business-rules/hosting-monopolies` o crear `mem://features/benchmark` con la regla: "Uptime/velocidad por proveedor solo provienen de `benchmark_results` / `uptime_pings`. Prohibido inventar cifras."

## Out of scope

- Cambiar la fórmula del score compuesto (ya está documentada).
- Migrar la tabla `uptime_pings` (ya existe).
- Añadir más fuentes externas (BuiltWith, Cloudflare Radar) — se puede iterar después.
