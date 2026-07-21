
## Diagnóstico verificado

Leí `src/pages/Latam.tsx`, `src/pages/LatamHub.tsx`, `src/components/HomeDispatcher.tsx`, `src/components/Footer.tsx`, `src/components/Navbar.tsx`, `src/App.tsx` y `public/latam/index.html`. Encontré tres problemas concretos:

**1. Duplicación de hubs LATAM (contenido casi idéntico, canonicals distintos)**
- `eligetuhosting.com/` → `LatamHub.tsx` con `canonical=https://eligetuhosting.com/`
- `eligetuhosting.com/latam` → `Latam.tsx` con `canonical=https://eligetuhosting.com/latam`
- Ambos: mismo H1 conceptual, mismas 5 tarjetas país, misma metodología. Google los verá como thin/duplicate.

**2. `/pe/mejor-hosting-peru-2026` no aparece enlazado desde `/latam` en el runtime SPA**
- El estático `public/latam/index.html` sí lista los sub-rankings por país (mejor-hosting, datacenter-local, benchmark).
- Pero al hidratar, `Latam.tsx` (línea 124) sólo emite un enlace por país a `https://eligetuhosting.com/{slug}` — pierde los sub-rankings. Idéntico problema en `LatamHub.tsx` (línea 87).
- Resultado: entrar desde `.cl` al hub y no ver "Mejor hosting Perú 2026" — lo que reporta el usuario.

**3. Autoridad `.cl → .com` débil**
- El footer del `.cl` no tiene una sección LATAM (la sección LATAM del `Footer.tsx` sólo se renderiza cuando la ruta ya es `/pe|/mx|/co|/ar`).
- El único puente `.cl → .com` es el `CountrySwitcher` del Navbar. Sin enlaces contextuales ni anchor text por país.

## Cambios propuestos (sólo frontend + estático, sin tocar datos)

### A. Resolver duplicación (Opción A ya mencionada)
- `LatamHub.tsx`: cambiar `canonical` de `https://eligetuhosting.com/` a `https://eligetuhosting.com/latam` (consolidar autoridad en `/latam`).
- Ajustar `og:url` para que también apunte a `/latam`.
- Diferenciar el copy del H1 de `/` (ej. "Elige tu hosting en Latinoamérica") para que sea claramente la landing selector, mientras que `/latam` queda como el hub-directorio canonical.
- Alternativa si prefiere Opción B/C: dímelo antes de implementar.

### B. Enlazar rankings por país desde ambos hubs
En `Latam.tsx` y `LatamHub.tsx`, cada tarjeta de país LATAM (PE/MX/CO/AR) debe listar 3 sub-enlaces bajo el CTA principal:
- `Mejor hosting {país} 2026` → `/{slug}/mejor-hosting-{país}-2026`
- `Datacenter local` → `/{slug}/hosting-con-datacenter-local`
- `Benchmark` → `/{slug}/benchmark`

Chile mantiene su enlace único al `.cl`.

### C. Reforzar autoridad `.cl → .com`
- En `Footer.tsx`, agregar una sección "Hosting en Latinoamérica" visible en TODAS las rutas del `.cl` (no sólo LATAM), con enlaces absolutos a:
  - `https://eligetuhosting.com/latam` (hub)
  - `https://eligetuhosting.com/pe/mejor-hosting-peru-2026` (con anchor text descriptivo)
  - Y equivalentes para MX/CO/AR.
- En el home del `.cl` (`src/pages/Index.tsx`) agregar un bloque compacto "¿Buscas hosting en otro país de LATAM?" con enlaces absolutos a los 4 rankings país (rel=external, no nofollow). Esto pasa autoridad temática desde la home más fuerte del cluster.

### D. Regeneración estática
- Re-ejecutar los generadores estáticos afectados: `/latam`, `/` (`.com`), y el home `.cl` (splice del footer nuevo en `index.html` fuente). Sin puppeteer, sólo build vite + generadores.

## Fuera de alcance / respeto explícito
- No cambio orden de rankings ni datos verificables.
- No toco fichas ni sitemaps (ya listan `/pe/mejor-hosting-peru-2026`).
- No publico. Al terminar aviso.

## Decisión que necesito de ti
¿Confirmas **Opción A** (canonical de `/` en `.com` → `/latam`) para consolidar? Si prefieres B (invertir) o C (mantener ambos con copy diferenciado sin cambiar canonical), dímelo antes.
