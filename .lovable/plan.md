
## Plan: cerrar pendientes reales de la auditoría

Sólo lo que falta. El resto (fichas, hubs, comparativas, footer, RecommendedByData, sameAs, Organization) ya está en producción.

### 1. Enlaces dofollow al sitio oficial en menciones editoriales

Hoy HostingPlus y EcoHosting se nombran en estas páginas sin enlace directo (o con `/ir/` nofollow). Añadir enlaces directos `https://www.hostingplus.cl/` y `https://www.ecohosting.cl/` con `rel="noopener"` (sin nofollow) en contextos editoriales:

- `src/pages/EstudioHostingChile2026.tsx` — donde se cita a HostingPlus 9.9 y EcoHosting 9.6 como líderes del estudio, envolver el nombre en `<a href="https://www.hostingplus.cl/" rel="noopener" target="_blank">`.
- `src/pages/Certificaciones.tsx` — mismo tratamiento donde aparezcan ambas marcas.
- Verificar también `src/components/RecommendedByData.tsx`: hoy enlaza a fichas internas; añadir un enlace adicional "Sitio oficial →" dofollow al lado del enlace a la ficha (mantiene el flujo a la ficha y además transfiere autoridad al dominio).

Mantener `/ir/[slug]` con `nofollow` sólo en los CTAs comerciales (botones "Visitar sitio" con tracking). Los enlaces editoriales son la transferencia de PageRank; los comerciales son afiliado y deben quedar marcados.

### 2. Canonical + noindex en /directorio-hosting-chile

Ruta duplicada de `/catalogo`. Hoy hace redirect JS pero un crawler puede indexar el HTML inicial. Editar `src/pages/DirectorioHosting.tsx` (o el componente que monta la ruta) para inyectar vía Helmet:

```tsx
<link rel="canonical" href="https://eligetuhosting.cl/catalogo" />
<meta name="robots" content="noindex,follow" />
```

Mantener el redirect cliente; el canonical/noindex sirven mientras Google revisita.

### 3. Envío de sitemap a Google Search Console + priorizar fichas líderes

El usuario confirma que el build ya está publicado. Vía el conector `google_search_console`:

1. `PUT /webmasters/v3/sites/https%3A%2F%2Feligetuhosting.cl%2F` (asegurar que el sitio está en la lista; ya debería estarlo).
2. `PUT /webmasters/v3/sites/https%3A%2F%2Feligetuhosting.cl%2F/sitemaps/https%3A%2F%2Feligetuhosting.cl%2Fsitemap.xml` para reenviar el sitemap index.
3. Informar al usuario que la API de Search Console **no expone "Solicitar indexación"** (esa función vive sólo en la UI). Le doy la lista exacta de URLs prioritarias a pegar manualmente en "Inspección de URL" → "Solicitar indexación":
   - `/catalogo/hostingplus`
   - `/catalogo/ecohosting`
   - `/mejor-hosting-wordpress-chile`
   - `/mejor-hosting-ecommerce-chile`
   - `/mejor-hosting-pymes-chile`
   - `/mejor-vps-chile`

### Archivos a editar

- `src/pages/EstudioHostingChile2026.tsx`
- `src/pages/Certificaciones.tsx`
- `src/components/RecommendedByData.tsx`
- `src/pages/DirectorioHosting.tsx`

### Verificación

- `rg "hostingplus.cl|ecohosting.cl" src/pages/EstudioHostingChile2026.tsx src/pages/Certificaciones.tsx` confirma que los enlaces directos quedaron.
- Curl al gateway de Search Console para confirmar 200 al reenviar el sitemap.
- Visitar `/directorio-hosting-chile` en preview y verificar el `<link rel="canonical">` y `meta robots` en el `<head>`.

### Fuera de alcance (lo dejo claro)

- Reseñas reales, outreach del Estudio 2026 y monitoreo SEO continuo (Nivel 4): trabajo operativo, no de código.
- Publicar el build: el usuario indica que ya está publicado.
