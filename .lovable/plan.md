

# Plan: Corregir Bug en Enriquecimiento de Wayback Machine

## Problema Identificado

La API de Wayback Machine **SÍ funciona** - verifiqué que:
- `digitalglobe.cl` → 1 snapshot (2018)
- `vinoszamora.cl` → 2 snapshots (2023-2024)

Pero estos dominios aparecen con `wayback_snapshots: 0` en la BD.

## Causa Raíz

En `batch-analyze-domains` línea 129:

```javascript
// Bug: esta condición nunca es true
if (enrich_first && !domain.had_website && domain.wayback_snapshots === null) {
```

La migración creó las columnas con `DEFAULT 0`, entonces `wayback_snapshots` nunca es `null` - siempre es `0`. La función asume que si es `0` ya fue consultado, pero en realidad **nunca consultó Wayback**.

## Solución

Cambiar la condición para que también consulte cuando `wayback_snapshots === 0` y el dominio no fue marcado como enriquecido previamente.

### Cambio en batch-analyze-domains/index.ts

**Antes:**
```javascript
if (enrich_first && !domain.had_website && domain.wayback_snapshots === null) {
```

**Después:**
```javascript
// Enriquecer si: aún no tiene datos OR tiene 0 snapshots y no fue marcado como "sin web"
const needsEnrichment = !domain.had_website && 
                        (domain.wayback_snapshots === null || domain.wayback_snapshots === 0);

if (enrich_first && needsEnrichment) {
```

### Marcar dominios sin historial correctamente

Cuando Wayback devuelve 0 resultados, no hay forma de saber si "no tiene historial" o "nunca fue consultado". Solución: agregar un flag `wayback_checked`:

```sql
-- Agregar columna para saber si ya fue consultado
ALTER TABLE domain_opportunities 
ADD COLUMN IF NOT EXISTS wayback_checked BOOLEAN DEFAULT FALSE;
```

Y en el código:

```javascript
// Después de consultar Wayback (tenga o no resultados)
waybackData.checked = true;

// Update incluye este flag
await supabase.from("domain_opportunities").update({
  wayback_checked: true,
  // ... otros campos
});
```

## Archivos a Modificar

```
MODIFICAR:
├── supabase/functions/batch-analyze-domains/index.ts
│   - Línea 129: Cambiar condición de enriquecimiento
│   - Agregar flag wayback_checked en updates
│
├── supabase/functions/enrich-domain-data/index.ts  
│   - Agregar flag wayback_checked
│
└── Migración SQL
    - Agregar columna wayback_checked
```

## Re-analizar Dominios Ya Procesados

Después del fix, necesitamos re-procesar los dominios que ya fueron "analizados" pero sin datos de Wayback reales:

```sql
-- Marcar para re-análisis los que tienen score pero sin wayback verificado
UPDATE domain_opportunities 
SET status = 'pending_analysis', wayback_checked = false
WHERE status = 'analyzed' 
  AND wayback_snapshots = 0 
  AND (wayback_checked IS NULL OR wayback_checked = false);
```

Esto marcará ~108 dominios para ser re-analizados con Wayback correctamente.

## Resultado Esperado

Después del fix:
1. Cada dominio será consultado en Wayback Machine
2. Los que tienen historial mostrarán sus snapshots
3. Los que no tienen historial quedarán marcados como `wayback_checked: true`
4. Podrás filtrar por "Con Web" para ver solo los que tuvieron sitio activo

