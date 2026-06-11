
# Plan: SEO de marca por ficha de empresa

Objetivo: que cada `/catalogo/[slug]` rankee por su propia keyword de marca ("hostingplus opiniones", "ecohosting review", etc.), con HTML inicial completo, canonical único, JSON-LD válido y contenido único.

## 1. Canonical único por ruta (CRÍTICO)

Estado actual: `index.html` ya no incluye `<link rel="canonical">`. `CatalogoDetalle` ya emite canonical correcto vía `DynamicMetaTags`. El problema real es que el HTML sin JS no trae nada → se resuelve con el punto 2 (prerender).

Acción complementaria: auditar páginas que falten `DynamicMetaTags` (algunas guías y `/catalogo` index) y asegurarse de que TODAS emitan canonical absoluto a su propia URL.

## 2. Prerender de fichas de catálogo (CRÍTICO)

Hoy `scripts/prerender.mjs` solo prerendera 30 rutas estáticas. Se extiende para:

- Consultar Supabase REST por `hosting_companies` verificadas (mismo patrón que `generate-sitemap.mjs`) y añadir cada `/catalogo/{slug}` a la lista.
- Aumentar timeout/concurrencia ya existentes están OK; añadir un await extra a `networkidle0` para que Helmet inyecte tags.
- Resultado: tras `npm run build`, `dist/catalogo/<slug>/index.html` contiene title, meta, canonical, og:* y JSON-LD ya renderizados.

(Plataforma Lovable sirve `dist/`, así que esto funciona en producción.)

## 3. Patrón SEO por ficha en `CatalogoDetalle.tsx`

Reescribir bloque SEO:

- `<title>`: `{name}: Opiniones, Precios y Review 2026 ⭐ {rating}/10 | EligeTuHosting.cl`
- `<meta description>`: usar precio desde, datacenter, año fundación, grupo corporativo en una frase corta.
- `<h1>`: `{name} — Review y Opiniones 2026` (ajustar en `HostingCompanyInfo` o título arriba de la ficha).
- Mantener `<link rel="canonical">` absoluto.

## 4. JSON-LD por ficha (en el HTML inicial vía Helmet → prerender)

Agregar en `CatalogoDetalle.tsx` (todo dentro de `<Helmet>` o `<script type="application/ld+json">` que Helmet capture):

- **Product** + `AggregateRating` (combinando nota editorial + reseñas aprobadas cuando `count > 0`).
- **Review** editorial (rating = `overall_rating`, author = "EligeTuHosting.cl Editorial").
- **BreadcrumbList**: Inicio → Catálogo → {Empresa}.
- **FAQPage** con 4 preguntas dinámicas (¿Es bueno X?, ¿Cuánto cuesta X?, ¿Dónde están los servidores de X?, ¿Es confiable X?).

Renderizar también esas 4 preguntas como acordeón visible en la ficha (componente nuevo `BrandFAQ.tsx`).

**Limpieza FAQ global**: hoy `src/components/FAQ.tsx` se renderiza en home + otras páginas; verificar que el JSON-LD `FAQPage` global SOLO se emita en `Index.tsx`. Mover el schema fuera del componente compartido y declararlo solo en el home.

## 5. Contenido único por ficha

Nuevo componente `VerifiedDataTable.tsx` (o agregar dentro de `HostingCompanyInfo`) con tabla "Datos verificados":
- Fundado en, Grupo corporativo, Datacenter, Precio desde, Tecnologías, Dominios .CL alojados (si el dato existe).

Nuevo bloque "Veredicto" — usa `description_editorial` o `unique_selling_point` ya presentes en DB; si faltan, fallback a una frase generada con datos.

Pros/contras: ya existen `pros`/`cons` en DB; el componente actual los muestra. Asegurar que la versión catálogo enseñe 3 pros / 2 contras mínimos.

## 6. Sitemap

Estado real: `public/sitemap.xml` es un `sitemapindex` que apunta a `sitemap-main.xml` (que SÍ tiene las 18 fichas), `sitemap-wiki.xml`, `sitemap-asn.xml`, `sitemap-domains.xml`. No está "vacío".

Pero el generador tiene un bug: el `SUPABASE_URL` por defecto (`hpqhylsvojzazmmaviek`) es de otro proyecto. En CI sin env var, fallaría. Fix: hardcodear el ref correcto `oegvwjxrlmtwortyhsrv` como fallback y leer también `VITE_SUPABASE_URL`.

Asegurar que `lastmod` use `updated_at` real por empresa (ya disponible en query, solo faltaría pasarlo al `urlTag`).

## 7. Limpieza de datos (migration / inserts)

Una sola operación SQL `UPDATE` sobre `hosting_companies`:

a) **HN.cl** (slug `hn` o similar): setear `corporate_group='Hostname'`, `datacenter_location='Chile'`, `description` neutra de 2-3 frases, `description_editorial` ídem. Año de fundación si se confirma.

b) **INC Web Hosting Chile / PowerHost IxMetro**: revisar campo `name` — probablemente concatenado dos veces. Normalizar a "INC Web Hosting" y "PowerHost (IxMetro)".

c) **Hosting.cl / PlanetaHosting**: reescribir `description` y `description_editorial` en tono neutro, eliminar la frase "líder en hosting en Chile". Sustituir por descripción factual basada en datos (grupo Casamayor, año, datacenter).

d) **Notas de proveedores fuera del Top 10**: bajar `overall_rating` a < 7.8 para FastHosting, Hosting24, PlanetaHosting, INC, WebHosting, SmartHost, GoDaddy, Hosting.cl, HostingChile. Distribuir entre 7.0 y 7.7 manteniendo orden relativo aproximado.

NO tocar: HostingPlus (9.9), Ecohosting, NetHosting, HostGator, BlueHosting, CloudHosting, 1Hosting, FullHosting, ProHosting, HN.cl (los del ranking).

## Archivos a tocar

- `src/pages/CatalogoDetalle.tsx` — title/desc patrón, JSON-LD Product+Review+Breadcrumb+FAQ, render BrandFAQ y VerifiedDataTable.
- Nuevo `src/components/catalogo/BrandFAQ.tsx`.
- Nuevo `src/components/catalogo/VerifiedDataTable.tsx`.
- `src/components/FAQ.tsx` — quitar JSON-LD si lo tuviera; emitir schema sólo desde `src/pages/Index.tsx`.
- `scripts/prerender.mjs` — añadir slugs `/catalogo/*` desde Supabase.
- `scripts/generate-sitemap.mjs` — fix SUPABASE_URL fallback + lastmod real.
- Migración SQL — limpieza de datos descrita en sección 7.

## Detalles técnicos

- Reutilizar `helmet-async` ya integrado.
- JSON-LD inline en `<Helmet>` con `<script type="application/ld+json">{JSON.stringify(...)}</script>` — Helmet lo serializa al `document.head`, y el prerender con Puppeteer lo captura.
- FAQ dinámica: respuestas plantilla con interpolación de `name`, `datacenter_location`, `year_founded`, `corporate_group`, precio mínimo. Si falta un dato → frase neutra.
- Pros/contras: si `pros`/`cons` están vacíos, generar 3/2 puntos a partir de `technologies`, `uptime_guarantee`, `has_ssl_free`, `has_migration_free`.

## Lo que NO se hace

- No se migra a SSR (Next.js, etc.) — sigue siendo SPA + prerender estático.
- No se tocan rankings ni puestos del Top 10.
- No se rediseña el layout de las fichas.
