## Redirección anónima para botones "Ver Oferta"

Hoy los CTAs abren directo `provider.website` con `rel="noopener noreferrer"`. El referrer ya viaja vacío en navegadores modernos, pero igual aparece el dominio visible (link inspeccionable) y, si el usuario lo pega o lo abre desde algunos clientes, el proveedor puede saber que llegó desde `eligetuhosting.cl`. Además, si `website` está vacío el botón rompe.

### Solución: ruta interna `/ir/:slug` como puente anónimo

1. **Nueva página `src/pages/OutboundRedirect.tsx`**
   - Lee `:slug` de la URL.
   - Consulta `hosting_companies` por `slug` → obtiene `website` y `name`.
   - Muestra interstitial sobrio ("Te llevamos a {name}…", spinner, marca EligeTuHosting).
   - Inyecta `<meta name="referrer" content="no-referrer">` vía Helmet y `<meta http-equiv="refresh" content="0;url=...">` como fallback.
   - Tras 600 ms hace `window.location.replace(website)` con `rel=noreferrer` implícito (replace no agrega historial).
   - Si no hay `website` válido → muestra mensaje y botón "Volver al ranking".
   - `noindex, nofollow` para no indexar la ruta.

2. **Registrar la ruta en `src/App.tsx`**: `<Route path="/ir/:slug" element={<OutboundRedirect />} />`.

3. **`src/components/HostingRanking.tsx`**
   - Cambiar el `<a href={provider.website}>` por `<a href={\`/ir/${provider.slug}\`} target="_blank" rel="noopener noreferrer nofollow" referrerPolicy="no-referrer">`.
   - Si `!provider.website && !provider.slug` ocultar el botón (no más `href="#"`).

4. **Mismo patrón para otras tarjetas que abran al proveedor** (acotado a esta vista por ahora): solo `HostingRanking`. Otros lugares se pueden migrar después si lo pides.

### Por qué es anónimo
- `rel="noreferrer"` + `<meta name="referrer" content="no-referrer">` + `window.location.replace` ⇒ el proveedor recibe la visita sin header `Referer` ni entrada de history que revele el origen.
- El usuario solo ve `eligetuhosting.cl/ir/...` un instante; nunca el `href` del proveedor en el hover del botón.

Sin cambios de BD ni de RLS.
