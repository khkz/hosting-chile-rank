## Auditoría externa — plan de remediación

Foco: arreglar lo crítico/alto (canonical + www, SSR/prerender efectivo, og:url duplicado, peso de imágenes hero) y dejar el resto priorizado.

---

### 1. Canonical absoluto + redirect www → no-www  *(Crítico)*

Hoy el `<link rel="canonical">` solo existe en runtime (vía `react-helmet-async`). Como los bots de LLMs y el HTML "crudo" no ejecutan JS, ven cero canonical. Además Google indexa `www.eligetuhosting.cl` y `eligetuhosting.cl` por separado.

Acciones:
- Añadir en `index.html` un canonical "neutro" por defecto (`https://eligetuhosting.cl/`) para que el HTML crudo nunca quede sin canonical. `DynamicMetaTags` lo sobreescribe por ruta en cliente (Helmet dedupea por `rel`+`href`; ajustaremos para evitar duplicados con un id consistente).
- Forzar canonical absoluto a dominio **no-www** en `DynamicMetaTags` (ya lo hace, OK).
- Redirect 301 `www.eligetuhosting.cl` → `eligetuhosting.cl`: como el sitio se sirve desde Lovable/Cloud, el redirect debe configurarse a nivel de DNS/proveedor del dominio. Documentar el paso en un README y, además, añadir en `DomainRedirect.tsx` la regla para hacer `window.location.replace` cuando el host empiece por `www.` (mitigación client-side mientras se configura el 301 real).

### 2. Prerender funcionando de verdad  *(Alto)*

Ya existe `scripts/prerender.mjs`, pero el auditor sigue viendo HTML vacío en producción. Causas probables:
- El build de Lovable no ejecuta el postbuild de Puppeteer (Chromium no disponible en el entorno).
- Aunque corra, sirve `dist/index.html` SPA para todas las rutas; necesita que el host respete `/<ruta>/index.html`.

Acciones:
- Cambiar la estrategia a **prerender en GitHub Actions** (ya existe `.github/workflows/nic-crawl.yml`, añadiré `prerender.yml`):
  1. Hace `bun run build`
  2. Instala Chromium
  3. Corre `node scripts/prerender.mjs`
  4. Commitea los `dist/<ruta>/index.html` resultantes a `public/_prerendered/<ruta>.html`
- En tiempo de runtime, añadir un **Edge Function de Supabase** (`bot-html`) que detecta user-agents de bots (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `facebookexternalhit`, `Twitterbot`, `Slackbot`, `LinkedInBot`, `bingbot`) y devuelve el HTML prerenderizado correspondiente desde Storage o desde un fetch a `/_prerendered/...`. Si no hay prerender para esa ruta, devuelve el SPA normal.
- Esto **no toca a usuarios normales** ni a Googlebot (que sí ejecuta JS) salvo que quieras servirles también el prerender.

> Nota: si prefieres una vía más simple sin Edge Function, alternativa B = solo generar las páginas estáticas paralelas y dejar que llms.txt apunte a ellas (lo descartamos antes pero sigue disponible).

### 3. `og:url` único por página  *(Alto)*

Mismo origen: el `og:url` "fijo a la home" que ve el auditor viene de `index.html`. Como Helmet dedupea por `property`, en runtime sí se sobreescribe — pero los scrapers sociales no ejecutan JS y ven el de `index.html`. Se arregla automáticamente con la pieza (2) (Edge Function devuelve HTML con `og:url` correcto por ruta).

Acciones complementarias:
- Auditar que todas las páginas con `<Helmet>` directo (Benchmark, MejorHostingChile2026, Wiki*, Resena, etc. — son ~30) emitan también `og:url` y `canonical` absolutos. Hoy varias no lo hacen. Refactor: que TODAS pasen por `DynamicMetaTags` y eliminar los `<Helmet>` sueltos, o crear un mini helper compartido.

### 4. Optimizar imágenes hero  *(Alto, quick-win)*

`public/images/hero-person.png` y `hero-people.png` pesan 3 MB cada uno.

Acciones:
- Generar versiones `.webp` (≤150 KB) y `.avif` (≤120 KB) durante el build con `sharp` (`scripts/optimize-images.mjs`) — se ejecuta en `prebuild`.
- Actualizar `<Hero>` y los `<link rel="preload">` de `index.html` para usar `<picture>` con AVIF → WebP → PNG fallback.
- Aplicar el mismo script al resto de PNGs grandes en `public/images/`.

### 5. Logos hotlinkeados (Medio)

Auditar componentes que usan `logo.clearbit.com`, `gstatic.com` o `1hosting.cl`:
- Reemplazar por SVGs locales ya existentes en `public/` (`logo-*.svg`) cuando los haya.
- Para los que falten, descargar a `public/logos/<slug>.png` mediante un script one-off.
- Cambiar `Comparativa.tsx` y `Resena.tsx` para usar los locales.

### 6. Lo demás (no en este plan, dejo notas)

- **TTFB 2,2 s**: depende del hosting del SPA (Lovable). Se mitiga con cache edge cuando se publique en dominio propio con Cloudflare delante. No requiere cambios de código aquí.
- **Canibalización `/comparativa` vs `/resena` vs `/catalogo`**: decisión de contenido; no la tocamos sin tu visto bueno.
- **Páginas finas `/domain/`, `/whois/`, `/asn/`**: añadir `<meta name="robots" content="noindex,follow">` en las páginas individuales de bajo valor (puedo hacerlo en otra iteración).
- **Cabeceras de seguridad (HSTS, CSP, X-Frame-Options)**: configurar en Cloudflare/host.
- **Patrones de urgencia ("expira en 24h")**: decisión de marca, te aviso pero no toco.
- **Bug "hostingpara" sin espacio en `<h1>`**: lo arreglo de paso si me confirmas dónde aparece (probablemente `Hero.tsx`).

---

### Sección técnica

Archivos a crear/editar:

```
index.html                                  → canonical neutro + preload <picture>
src/components/DomainRedirect.tsx           → redirect www→no-www client-side
src/components/SEO/DynamicMetaTags.tsx      → asegurar IDs únicos en Helmet
src/pages/*.tsx (los con <Helmet> suelto)   → migrar a DynamicMetaTags
src/components/Hero.tsx                     → <picture> AVIF/WebP/PNG
scripts/optimize-images.mjs                 → nuevo, usa sharp
scripts/prerender.mjs                       → ya existe (revisar)
.github/workflows/prerender.yml             → nuevo
supabase/functions/bot-html/index.ts        → nuevo, sirve HTML prerenderizado a bots
supabase/config.toml                        → registrar bot-html (verify_jwt=false)
package.json                                → añadir sharp, prebuild script
```

Migración de BD: ninguna.
