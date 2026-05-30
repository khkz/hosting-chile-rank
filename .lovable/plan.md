## Objetivo

Resolver el hallazgo CRÍTICO #1 de la auditoría: la home se declara "100% independiente" pero canaliza el único CTA destacado a HostingPlus. Quitamos los CTAs externos a HostingPlus de la portada y dejamos solo las fichas del ranking (que enlazan a todos los proveedores por igual desde sus tarjetas).

## Cambios

**`src/pages/Index.tsx`**
- Quitar `<FinalCTA />` (botón "Ir al Nº 1 Ahora" → `https://www.hostingplus.cl/`) y su `React.lazy(...)` import.
- Quitar `<ExitModal />` (popup exit-intent con cupón EXIT20 → `clientes.hostingplus.cl`) y su `React.lazy(...)` import.
- Sustituir el bloque final por un CTA interno hacia `/catalogo` ("Ver catálogo completo de proveedores verificados") para no dejar la página huérfana de cierre.

## Lo que NO se toca

- `HostingRanking` / `HostingCard`: las tarjetas siguen enlazando a la web de cada proveedor (todos, no solo HostingPlus). Eso es una ficha legítima, no un embudo.
- Los componentes `FinalCTA` y `ExitModal` quedan en el repo porque otras páginas (Comparativa, CotizaHosting, etc.) los siguen usando — solo se quitan de la home.
- Las páginas internas que aún tienen CTAs a HostingPlus (Comparativa, SecurityRiskQuiz, wiki, etc.) quedan igual; si quieres, las atacamos en un segundo paso.

## Verificación

Tras el cambio, en `/` no debe aparecer ningún enlace `href="https://*hostingplus*"`. Lo confirmo con un `rg` sobre el HTML renderizado y revisando la preview.
