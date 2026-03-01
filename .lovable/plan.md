

## Sistema para Pulir Empresas del Directorio

### Problema actual
Las 20 empresas en `hosting_companies` fueron migradas automáticamente desde datos estáticos. Muchas probablemente no son reales (ej: "CloudHosting.cl", "ZipHosting.cl", "SmartHost.cl" con logos SVG genéricos). El directorio actualmente solo muestra las 15 con certificaciones activas, pero no hay forma de validar si los sitios web existen, si los logos son reales, o de marcar empresas como "curadas".

### Plan

**1. Agregar columna `is_curated` y `curation_notes` a `hosting_companies`**
- Migración SQL: `ALTER TABLE hosting_companies ADD COLUMN is_curated boolean DEFAULT false, ADD COLUMN curation_notes text, ADD COLUMN curated_at timestamptz, ADD COLUMN website_status text DEFAULT 'unknown'`
- `is_curated`: marca que un admin revisó manualmente la empresa
- `website_status`: 'active' | 'down' | 'unknown' | 'not_found'

**2. Crear panel de curación en admin (`src/pages/admin/CompanyCuration.tsx`)**
- Lista todas las empresas con indicadores visuales:
  - Logo carga correctamente (via `onError` en `<img>`)
  - Website status badge (unknown/active/down)
  - Tiene descripción, contacto, etc.
  - Estado curado vs pendiente
- Acciones por empresa:
  - "Verificar website" — hace fetch al website y marca status
  - "Marcar como curada" — con campo de notas
  - "Desverificar" — quita `is_verified` para que no aparezca en el directorio público
  - "Editar rápido" — modal para corregir nombre, website, logo_url, descripción
- Filtros: Todas | Solo curadas | Pendientes | Website caído
- Ordenar por: rating, nombre, estado de curación

**3. Edge function `verify-company-website` para verificar websites**
- Recibe `company_id`, hace HEAD request al `website` de la empresa
- Actualiza `website_status` en la DB ('active' si 2xx, 'down' si error/timeout, 'not_found' si 404)
- Opción de "verificar todas" en batch

**4. Actualizar `DirectorioHosting.tsx`**
- Cambiar query del directorio para mostrar solo empresas verificadas Y curadas (`is_verified = true AND is_curated = true`), o como fallback, solo `is_verified = true` si ninguna está curada aún
- Añadir enlace externo con `rel="nofollow noopener"` para no perder SEO
- Actualizar año 2025 → 2026

**5. Agregar ruta admin**
- Añadir `/admin/company-curation` en `App.tsx`
- Añadir link en el dashboard admin

### Archivos
- Migración SQL (nueva columna)
- `supabase/functions/verify-company-website/index.ts` (nuevo)
- `src/pages/admin/CompanyCuration.tsx` (nuevo)
- `src/pages/DirectorioHosting.tsx` (filtro curadas + fix año)
- `src/App.tsx` (nueva ruta)
- `src/pages/admin/Dashboard.tsx` (link al panel)

### Detalle técnico
- La verificación de websites se hace via edge function porque el browser no puede hacer requests cross-origin directamente
- El panel muestra un "completeness score" por empresa (tiene logo + descripción + website activo + contacto = 100%)
- Las empresas no curadas siguen visibles en admin pero no en el directorio público

