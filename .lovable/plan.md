
# Plan: Página de Metodología, Autoría y Evidencias

## Contexto

Hoy existen tres páginas dispersas con información parcial:
- `/nuestro-metodo` (NuestroMetodo.tsx): proceso de 5 pasos + tabla de pesos.
- `/transparencia-hosting-chile` (TransparenciaHosting.tsx): info de transparencia.
- `/metodologia-benchmark` (MetodologiaBenchmark.tsx): metodología técnica del benchmark de velocidad.

Falta una página **canónica** que centralice metodología completa, autoría/responsables, evidencias verificables con enlaces directos, y un bloque "cómo se calculó el ranking" con la fórmula real y datos en vivo.

## Entregables

### 1. Nueva página `/metodologia` (`src/pages/Metodologia.tsx`)

Página tipo "documento vivo" con índice lateral pegajoso (TOC) y secciones ancla:

1. **Resumen ejecutivo** — qué medimos, cuándo, cómo y quién.
2. **Autoría y responsabilidad editorial**
   - Editor responsable, contacto público, fecha última revisión.
   - Declaración de independencia (no aceptamos pagos por posiciones).
   - Política de afiliados (cuándo aplica, cuándo no).
3. **Fuentes de datos y evidencias** — tabla con cada fuente:
   - Reclamos.cl → enlace al perfil consultado por proveedor.
   - Uptime pings (tabla `uptime_pings`) → link a endpoint público de exportación.
   - Benchmarks Lighthouse + TTFB (`benchmark_results`, `benchmark_runs`) → link a `/metodologia-benchmark` y descarga JSON.
   - Curaduría OSINT (panel admin interno, resumen público).
   - NIC Chile / WHOIS (para señales de antigüedad y dominio).
4. **Cómo se calcula el ranking (fórmula)**
   - Bloque visual con la fórmula:
     ```text
     score_final = 0.30·reputación + 0.25·uptime + 0.20·velocidad
                 + 0.15·soporte   + 0.10·precio
     ```
   - Por cada factor: cómo se normaliza (0–10), de qué tabla sale, frecuencia de actualización.
   - Reglas de exclusión: `is_verified=false`, `is_curated=false`, score < 7.0, monopolio detectado.
   - Ejemplo trabajado: tomar el #1 actual de la BD vía React Query y mostrar sus 5 sub-scores y el cálculo paso a paso.
5. **Frecuencia y versionado**
   - Uptime: cada hora (cron).
   - Benchmark profundo: mensual (día 1) + manual.
   - Curaduría: revisión trimestral.
   - Mostrar versión actual desde `benchmark_methodology` (campo `version`, `updated_at`).
6. **Cambios y changelog** — lista las últimas N filas de `benchmark_methodology` ordenadas por versión.
7. **Documentos descargables / enlaces**
   - Markdown de metodología vigente (render desde `benchmark_methodology.content_md`).
   - Botón "Exportar últimos resultados (JSON)" → llama edge function de solo lectura.
   - Enlace a `/metodologia-benchmark`, `/transparencia-hosting-chile`, `/nuestro-metodo` (mantenidos como sub-vistas).
8. **Limitaciones y conflictos de interés** — sección honesta sobre lo que no medimos.
9. **Contacto para correcciones** — link a `/contacto` con asunto pre-rellenado.

### 2. Hook de datos `src/hooks/useMethodology.ts`

- `useLatestMethodology()` → fila más reciente de `benchmark_methodology`.
- `useMethodologyChangelog()` → historial de versiones.
- `useTopProviderBreakdown()` → top 1 con sus sub-scores para el ejemplo trabajado (join `hosting_companies` + `benchmark_results` + último `uptime_pings` agregado).

### 3. Componente reutilizable `src/components/RankingFormulaBlock.tsx`

Bloque "cómo se calculó el ranking" que se embebe en:
- `/metodologia` (versión completa).
- `/ranking` arriba o como acordeón (versión compacta con link "ver metodología completa").
- `/` (homepage) como sección de confianza.

Props: `variant: 'full' | 'compact'`.

### 4. Edge function `export-methodology-data` (read-only, pública)

`supabase/functions/export-methodology-data/index.ts`
- GET → devuelve JSON con: últimos `benchmark_results` por proveedor curado, último `uptime_pings` agregado (uptime % 30d), versión de metodología.
- Sin auth, rate-limited por IP (reusar patrón existente).
- Configurar `verify_jwt = false` en `supabase/config.toml`.

### 5. Rutas y navegación

- Añadir `<Route path="/metodologia" element={<Metodologia />} />` en `src/App.tsx`.
- Redirección suave: mantener `/nuestro-metodo` y `/transparencia-hosting-chile` con banner "Esta página forma parte de nuestra Metodología completa →".
- Footer y Navbar: enlace principal "Metodología" apuntando a `/metodologia`.
- Sitemap: incluir nueva URL.

### 6. SEO / Schema

- `DynamicMetaTags` con title/description específicos.
- JSON-LD `TechArticle` + `Dataset` (apuntando al export JSON) + `Person` (autor).
- Breadcrumbs.

## Detalles técnicos

- **Pesos**: hoy hardcodeados en `NuestroMetodo.tsx`. Mantener mismos pesos (30/25/20/15/10) y centralizarlos en `src/lib/rankingWeights.ts` para que el bloque, el cálculo del ranking y la página los lean del mismo sitio.
- **Ejemplo trabajado**: si no hay datos de un sub-score para el top 1, mostrar "—" con tooltip "pendiente próximo benchmark" en vez de error.
- **Render Markdown**: usar `react-markdown` (ya presente si se usa en blog; verificar y agregar si falta).
- **Accesibilidad**: TOC con `aria-current`, anclas con `scroll-margin-top`, contraste AA, targets 44px.
- **Mobile**: TOC colapsa a `<details>` arriba del contenido.

## Fuera de alcance

- No se modifica el algoritmo real del ranking (solo se documenta el existente).
- No se crea editor admin de metodología (ya existe vía tabla `benchmark_methodology`; se puede añadir en otro ticket).
