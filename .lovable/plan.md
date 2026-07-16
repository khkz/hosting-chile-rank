## Problema

La foto real de Ascenty ya está en `public/img/datacenter-real.jpg` y el código apunta ahí, pero:

- **Preview**: el navegador cachea `/img/datacenter-real.jpg` desde antes (cuando había un PNG viejo o el asset CDN roto).
- **Producción**: aún no publicamos desde el fix, así que el `.cl` sirve el HTML/bundle anterior.

## Plan

1. **Cache-bust determinista** en `src/components/DatacenterEducation.tsx` y en `index.html` (fallback estático): cambiar `src="/img/datacenter-real.jpg"` → `src="/img/datacenter-real.jpg?v=ascenty2"`. Mismo tratamiento para `datacenter-propio.png` → `?v=2` para forzar refetch en usuarios que ya cargaron la versión vieja.
2. **Build** con `bun run build` para verificar que compila.
3. **Security scan** (requisito antes de publicar) y, si queda limpio, **publish** para que producción (eligetuhosting.cl / .com) reciba el fix.
4. Confirmar cuando el deploy quede "Up to date".

## Detalles técnicos

- Solo cambian 4 atributos `src` (2 en el componente React, 2 en el shell `index.html`). Nada de lógica, estilos, head, canonical ni JSON-LD.
- El query string `?v=ascenty2` es ignorado por el servidor de estáticos pero fuerza a los navegadores/CDNs a tratarla como una URL distinta y descargarla de nuevo.
- No se toca `src/data/datacenters.ts`, ni fichas, ni ranking, ni prerender masivo.
- Chile visible: solo cambia la imagen dentro de la tarjeta "Datacenter real" (pasa de ilustración vieja a foto real de Ascenty). Todo lo demás igual.
