

# Fix: Re-analizar Dominios Sin Datos de Wayback

## Estado Actual

El sistema **YA FUNCIONA** correctamente:
- `69millones.cl` → 4 snapshots encontrados (2018-2025) ✅
- Los nuevos análisis consultan Wayback correctamente

## El Problema

Durante la transición (entre versiones del código), **16 dominios** fueron analizados SIN consultar Wayback:
- Tienen `status: analyzed` pero `wayback_checked: false`
- 5 de ellos tienen score ≥7 (potencialmente valiosos)

## Solución

Ejecutar un UPDATE para resetear esos 16 dominios a `pending_analysis`:

```sql
UPDATE domain_opportunities 
SET status = 'pending_analysis'
WHERE status = 'analyzed' 
  AND wayback_checked = false;
```

Esto permitirá que se re-analicen con el código corregido.

## Después del Fix

| Dominio | Estado Actual | Después |
|---------|---------------|---------|
| cirugiacolumna.cl (score 8.5) | ❌ Sin Wayback | ✅ Re-análisis |
| cybercompra.cl (score 7.5) | ❌ Sin Wayback | ✅ Re-análisis |
| contratosweb.cl (score 7.5) | ❌ Sin Wayback | ✅ Re-análisis |
| ... (13 más) | ❌ Sin Wayback | ✅ Re-análisis |

## Cambios

Ejecutar migración SQL para resetear los 16 dominios afectados y que se vuelvan a analizar con datos de Wayback completos.

