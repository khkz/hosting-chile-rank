
# Plan: Implementar Open PageRank API + Verificación de Disponibilidad NIC.cl

## Resumen

Agregar dos nuevas funcionalidades al Domain Sniper:
1. **Open PageRank API** - Obtener métricas de autoridad de dominio (PageRank 0-10)
2. **Botón verificar disponibilidad** - Consultar si el dominio está libre en NIC.cl vía WHOIS

---

## 1. Open PageRank API

### API Gratuita

- **URL**: `https://openpagerank.com/api/v1.0/getPageRank?domains[]=example.com`
- **Límite gratuito**: 100 consultas/día
- **Response**:
```json
{
  "status_code": 200,
  "response": [
    {
      "status_code": 200,
      "page_rank_integer": 7,
      "page_rank_decimal": 6.85,
      "rank": "1500",
      "domain": "example.com"
    }
  ]
}
```

### Cambios en Base de Datos

Agregar columnas a `domain_opportunities`:
- `page_rank` (numeric) - PageRank decimal (0.0-10.0)
- `page_rank_updated_at` (timestamp) - Última consulta

### Nueva Edge Function: `pagerank-lookup`

```typescript
// Consultar PageRank para un dominio
// Requiere API Key de Open PageRank (gratis)
GET /pagerank-lookup?domain=ejemplo.cl

Response: {
  page_rank: 6.5,
  rank: "1500",
  success: true
}
```

---

## 2. Verificar Disponibilidad NIC.cl

### Método

Usar la función WHOIS existente (`whois-lookup`) que ya conecta directamente a `whois.nic.cl:43`.

Si el dominio está **libre**, el WHOIS retorna un mensaje como:
```
% whois.nic.cl
% No match for "dominio-libre.cl"
```

Si está **registrado**, retorna datos del titular.

### Nueva Edge Function: `check-domain-availability`

```typescript
// Verificar si dominio está libre en NIC.cl
POST /check-domain-availability
Body: { domain: "ejemplo.cl" }

Response: {
  available: true,
  domain: "ejemplo.cl",
  registrar: null,
  expires_date: null
}

// o si está registrado:
{
  available: false,
  domain: "ejemplo.cl",
  registrar: "NIC Chile",
  expires_date: "2026-06-28"
}
```

---

## 3. Cambios en UI

### Nuevas columnas en OpportunitiesTable

| Dominio | PR | Score | Wayback | Disponible | Acciones |
|---------|-----|-------|---------|------------|----------|
| ejemplo.cl | 6.5 | 8.2 | 45 | ✅ Libre | [Verificar] [Analizar] |

### Botones de Acción

1. **Verificar Disponibilidad** - Icono de check, consulta WHOIS y muestra badge verde/rojo
2. **Obtener PageRank** - Icono de barra, consulta Open PageRank API

---

## Archivos a Crear/Modificar

```
CREAR:
├── supabase/functions/pagerank-lookup/index.ts
│   - Consultar Open PageRank API
│   - Requiere secret: OPENPAGERANK_API_KEY
│
└── supabase/functions/check-domain-availability/index.ts
    - Reutilizar lógica de whois-lookup
    - Determinar si dominio está libre

MODIFICAR:
├── src/components/domain-sniper/OpportunitiesTable.tsx
│   - Agregar columna "PR" (PageRank)
│   - Agregar columna "Disponible"
│   - Agregar botón "Verificar"
│
├── src/components/domain-sniper/CheckAvailabilityButton.tsx (NUEVO)
│   - Botón que consulta disponibilidad
│   - Muestra badge verde/rojo
│
├── src/components/domain-sniper/PageRankBadge.tsx (NUEVO)
│   - Badge con color según PageRank (0-3 gris, 4-6 amarillo, 7-10 verde)
│
└── supabase/migrations/xxx_add_pagerank_availability.sql
    - ALTER TABLE domain_opportunities
    - ADD COLUMN page_rank numeric
    - ADD COLUMN page_rank_updated_at timestamp
    - ADD COLUMN is_available boolean
    - ADD COLUMN availability_checked_at timestamp
```

---

## Flujo de Usuario

```
1. Usuario ve lista de dominios en el radar
2. Hace clic en botón "Verificar" → Consulta WHOIS NIC.cl
3. Se muestra badge: ✅ Libre o ❌ Registrado
4. Si está libre y tiene buen score, puede comprarlo

Alternativo:
1. Batch "Verificar todos" → Consulta disponibilidad de todos los pendientes
2. Se actualiza la columna "Disponible" en cada fila
```

---

## Secret Requerido

Se necesita agregar el API key de Open PageRank:
- **Nombre**: `OPENPAGERANK_API_KEY`
- **Obtener gratis**: https://www.domcop.com/openpagerank/

---

## Integración con Análisis Batch (Opcional)

Agregar PageRank al flujo de análisis masivo:
- Después de Wayback Machine, consultar PageRank
- Incluir PageRank en el contexto para la IA
- Dominios con PageRank alto = mayor valor estimado
