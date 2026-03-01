

## Sprint 3-5: Arquitectura, Credibilidad y Limpieza

### Sprint 3: Extraer datos de ranking a archivo centralizado

**1. Crear `src/data/rankingProviders.ts`**
- Mover el array `hostingData` (lines 10-108) de `HostingRanking.tsx` a un nuevo archivo
- Exportar como `export const rankingProviders = [...]` con una interfaz `RankingProvider` tipada

**2. Actualizar `src/components/HostingRanking.tsx`**
- Reemplazar la definición inline de `hostingData` por `import { rankingProviders } from '@/data/rankingProviders'`
- Cambiar todas las referencias de `hostingData` a `rankingProviders`

### Sprint 4: Refactorizar Navbar para eliminar duplicacion

**3. Refactorizar `src/components/Navbar.tsx`**
- Crear arrays de configuracion de nav items al inicio del componente:
  - `mainNavItems`: array con `{ to, label, icon }` para los 6 links principales (Inicio, Ranking, Comparativa, Wiki, Certificaciones, Directorio)
  - `toolsItems`: array con `{ to, label, icon }` para Herramientas (Cotiza hosting, Ultimos dominios)
  - `guidesItems`: array con `{ to, label, icon? }` para las 9 guias
- Renderizar desktop y mobile desde los mismos arrays usando `.map()`
- Corregir el link mobile de "Mejor Hosting Chile 2025" a "2026" (bug detectado en linea 471/477)
- Cambiar CTA "Contratar ahora" (que apunta a HostingPlus) por "Compara ahora" apuntando a `/ranking`

### Sprint 5a: Eliminar fake social proof

**4. Eliminar `DynamicActivityCounter` de `src/components/Hero.tsx`**
- Remover la definicion completa del componente (lineas 6-41) y el import de `useState, useEffect` (ya no necesarios)
- El componente nunca se usa en el render, solo se define — limpieza de codigo muerto

**5. Eliminar `src/components/SocialProofFeed.tsx`**
- Borrar el archivo completo

**6. Actualizar `src/pages/Index.tsx`**
- Remover la linea `const SocialProofFeed = React.lazy(...)` (linea 27)
- Remover `<SocialProofFeed />` del render (linea 123)

### Sprint 5b: Limpieza de scripts

**7. Eliminar `package-scripts.json`** (archivo raiz)
- Los scripts ya estan definidos en `package.json`; este archivo es redundante y no se usa por npm

---

### Archivos modificados
- `src/data/rankingProviders.ts` (nuevo)
- `src/components/HostingRanking.tsx` (import de datos externos)
- `src/components/Navbar.tsx` (refactor con arrays de nav items + fix CTA + fix 2025→2026)
- `src/components/Hero.tsx` (remover DynamicActivityCounter muerto)
- `src/components/SocialProofFeed.tsx` (eliminar)
- `src/pages/Index.tsx` (remover SocialProofFeed)
- `package-scripts.json` (eliminar)

