# Plan de mejora — Auditoría EligeTuHosting.cl

Auditoría sobre 20+ URLs en producción. Hallazgos agrupados por severidad y ordenados por impacto SEO/UX.

---

## 🔴 Críticos (bloqueo SEO)

### 1. Canonical y `og:url` apuntan SIEMPRE a la home
Cada página (`/comparativa`, `/catalogo/powerhost`, `/blog`, etc.) sirve en el HTML:
```html
<link rel="canonical" href="https://eligetuhosting.cl">
<meta property="og:url" content="https://eligetuhosting.cl">
```
Google está tratando todo como duplicado de la home. **Causa probable**: `DynamicMetaTags` no se aplica en todas las rutas y/o el fallback en `index.html` sobreescribe vía Helmet con valor fijo.

**Acción**:
- Auditar `DynamicMetaTags` y forzarlo en TODAS las páginas (Index, Catalogo, CatalogoDetalle, Blog, BlogPost, Comparativa, Metodologia, Transparencia, Guías, Wiki, etc.).
- Construir canonical/og:url desde `useLocation().pathname` con base `https://eligetuhosting.cl`.
- Quitar el `<link rel=canonical>` estático de `index.html` (o dejarlo solo como fallback de home).

### 2. `/contacto` es soft-404
Devuelve 200 pero renderiza el componente NotFound. Está enlazado desde `/metodologia` ("Contacto editorial").
**Acción**: crear `Contacto.tsx` real (ya existe el archivo — verificar por qué no resuelve la ruta en `App.tsx`) o reemplazar el enlace por `/sobre-nosotros#contacto`.

### 3. Logos de Clearbit caídos
`logo.clearbit.com/powerhost.cl` y `/hosting.cl` devuelven connection-refused. Se ven rotos en `/comparativa` y fichas.
**Acción**: 
- Script para descargar todos los logos hotlinked y guardarlos en `public/logos/<slug>.png`.
- Helper `getProviderLogo(slug)` con fallback a iniciales SVG generadas.
- Reemplazar todos los `logo.clearbit.com`, `gstatic.com`, `1hosting.cl` en el código.

---

## 🟠 Altos

### 4. Imágenes destacadas del blog = `placeholder.svg`
Todos los posts comparten el mismo placeholder gris. Mata el CTR social.
**Acción**: generar (o asignar) imagen real por post; mientras tanto, generar OG dinámica con el título sobre fondo de marca.

### 5. `<title>` estático en HTML pre-render
Todas las URLs sirven `Mejor Hosting Chile 2026 | EligeTuHosting.cl` en el HTML inicial. Helmet lo cambia client-side pero los crawlers ven el shell.
**Acción**: ejecutar el `scripts/prerender.mjs` ya existente en build (ver `docs/SEO-INFRA.md`) o, si Lovable no soporta Chromium en build, generar HTML estático mínimo por ruta con title/description/canonical inyectados en CI externo.

### 6. `/domain/<x>` y `/whois/<x>` con slug "intuitivo" → 404
`/domain/example.com` falla (requiere `example-com`). robots.txt los expone como herramientas.
**Acción**: en el componente, normalizar el slug recibido (replace `.` → `-`) y redirigir 301 al formato canónico.

---

## 🟡 Medios

### 7. Breadcrumb duplicado en `/sobre-nosotros`
Renderiza `Inicio › Inicio › Sobre nosotros`. Bug en el componente Breadcrumb.

### 8. `og:image` único para todas las páginas
Siempre `/images/ranking-comparison.png`. Generar OG por sección (home, ficha proveedor, blog post, guía).

### 9. `robots.txt` con `Crawl-delay` duplicado y `Sitemap:` repetidos
Limpiar: 1 sola directiva `Crawl-delay`, listar solo `sitemap.xml` (índice) — los sub-sitemaps ya van dentro.

---

## 🔵 Bajos

### 10. `sitemap-main.xml` con `<lastmod>` estático
Todos los URLs comparten `2026-04-25`. Ajustar el generador para usar `updated_at` real o fecha de build.

### 11. Enlaces con `ñ` sin codificar en `/comparativa`
`/reseñas/hostingplus` — usar percent-encoding consistente o slugs ASCII.

---

## Orden de ejecución propuesto

1. **Fix canonical/og:url por ruta** (afecta a TODO el SEO) — auditar `DynamicMetaTags` + migrar páginas restantes
2. **Arreglar `/contacto`** (soft-404 visible)
3. **Descargar logos Clearbit a local** + helper con fallback
4. **Fix breadcrumb duplicado** en `/sobre-nosotros`
5. **Normalizar slugs** en `/domain` y `/whois` (redirect 301 interno)
6. **Limpiar robots.txt** (crawl-delay, sitemaps)
7. **Sitemap lastmod dinámico**
8. **OG images por sección** (post/proveedor/guía)
9. **Imágenes reales para blog** (asignar o generar)

## Notas técnicas

- No tocar lógica de negocio (rankings, reputación, benchmark) — solo presentación/SEO.
- No re-añadir CTAs externos a HostingPlus desde home (decisión previa).
- El prerender en build (#5 alto) requiere CI externo si Lovable no levanta Chromium — documentar pero no romper el build actual.
- Cambios de DB: ninguno. Sólo edits en `src/components/SEO/*`, páginas, `public/robots.txt`, `public/logos/*`, y scripts.

¿Procedo con el bloque 1–4 (críticos + breadcrumb) en la primera tanda?
