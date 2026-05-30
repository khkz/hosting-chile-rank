# Configuración de infraestructura SEO/LLM

Este documento cubre los pasos **fuera del código** necesarios para que las mejoras de SEO/GEO (auditoría de 2026-05-30) funcionen completamente.

## 1. Redirect 301 `www` → no-www

El sitio canonical es `https://eligetuhosting.cl` (sin `www`).

- En el panel del proveedor de DNS o en Cloudflare → Rules → Redirect Rules:
  - **If**: `Hostname equals www.eligetuhosting.cl`
  - **Then**: `Static redirect` → `https://eligetuhosting.cl${path}${query}` con código **301**.

Mientras se configura, el componente `<DomainRedirect />` hace un `window.location.replace` client-side (mitigación, no reemplaza al 301).

## 2. Prerender para bots (LLMs, redes sociales)

El sitio es un SPA Vite/React. Crawlers que no ejecutan JS (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `facebookexternalhit`, `Twitterbot`, `LinkedInBot`, `Slackbot`, `bingbot` parcial) ven una cáscara vacía.

### Paso A — Generar HTML estático en CI

El repo incluye `scripts/prerender.mjs`, que abre cada ruta en Chromium headless tras `vite build` y guarda `dist/<ruta>/index.html`. Para correrlo en GitHub Actions, asegúrate de que el workflow:

```yaml
- run: bun install
- run: sudo apt-get install -y chromium-browser
- run: PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser bun run build
- uses: actions/upload-artifact@v4
  with:
    name: dist
    path: dist/
```

### Paso B — Servir el HTML prerenderizado a bots

En **Cloudflare → Workers** (o el CDN que uses) crea un worker que:

1. Detecte user-agent de bot (regex sobre `GPTBot|ClaudeBot|PerplexityBot|facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|bingbot`).
2. Para esos UAs, sirva `https://<bucket>/_prerendered/<ruta>/index.html` (publica `dist/` a Cloudflare Pages o R2).
3. Para el resto, sirva el SPA normalmente.

Sin este paso, el prerender solo te sirve si publicas el sitio directamente como estático con fallback a las páginas concretas (Cloudflare Pages, Netlify, Vercel) — no funciona con el hosting actual de Lovable, que reescribe todas las rutas a `index.html`.

## 3. Cabeceras de seguridad

En Cloudflare → Rules → Transform Rules → Modify Response Header, añade:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- `Content-Security-Policy`: empieza por `Content-Security-Policy-Report-Only` para no romper nada; iterar hasta convertirlo en enforced.

Verifica en https://securityheaders.com/ y https://observatory.mozilla.org/.

## 4. TTFB

El TTFB ~2.2s viene del origen Lovable. Soluciones:

- Habilitar **Cloudflare Cache Everything** para HTML estático (TTL corto: 5 min) cuando ya tengas el prerender.
- Tener `Cache-Control: public, max-age=300, stale-while-revalidate=3600` en la respuesta.

## 5. Optimización de imágenes

`scripts/optimize-images.mjs` genera AVIF + WebP de todos los PNG/JPG >80 KB en `public/images/`. Se ejecuta automáticamente en `prebuild`. Los componentes deben usar `<picture>` con AVIF → WebP → fallback (ver `src/components/Hero.tsx`).

Hero antes: 6 MB en dos PNGs. Después: 170 KB total (AVIF) / 400 KB (WebP).
