

# Plan: Corregir Timeout en Análisis Masivo

## Problema Identificado

El análisis batch se "pega" por un **timeout de la Edge Function**:

```
Error del servidor: "Http: connection closed before message completed"
Error del cliente: "TypeError: Failed to fetch"
```

**Causa**: Cada batch de 10 dominios toma ~40-70 segundos, pero las Edge Functions tienen timeout de ~26 segundos.

| Operación | Tiempo estimado |
|-----------|-----------------|
| Wayback Machine API | 1-3 segundos |
| IA Analysis (Gemini) | 2-4 segundos |
| Delay entre requests | 2 segundos |
| **Total por dominio** | **5-9 segundos** |
| **Total batch (10)** | **50-90 segundos** |
| **Timeout Edge Function** | **~26 segundos** ❌ |

---

## Solución: Reducir Batch Size a 3

La solución más simple y efectiva es reducir el batch size para completar dentro del timeout:

```
3 dominios × ~8s = ~24 segundos (dentro del límite)
```

### Cambios en BatchAnalyzePanel.tsx

```typescript
// Antes
const BATCH_SIZE = 10;

// Después  
const BATCH_SIZE = 3;  // Completar dentro de timeout de 26s
```

### Cambios en batch-analyze-domains/index.ts

```typescript
// Agregar timeout más agresivo para Wayback
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s max

const cdxResponse = await fetch(cdxUrl, {
  headers: { "User-Agent": "EligeTuHosting/1.0" },
  signal: controller.signal,
});
```

---

## Flujo Mejorado

```
┌─────────────────────────────────────────────────────────┐
│                   Cliente (Browser)                     │
├─────────────────────────────────────────────────────────┤
│  1. Iniciar análisis (143 dominios pendientes)          │
│  2. Enviar batch de 3 → Esperar ~20s → Recibir          │
│  3. Actualizar UI (3/143, 2%)                           │
│  4. Enviar siguiente batch → Esperar ~20s → ...         │
│  5. Repetir hasta completar (~48 batches = ~16 min)     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 Edge Function (Server)                  │
├─────────────────────────────────────────────────────────┤
│  ✅ Dominio 1: Wayback (3s) + IA (4s) + delay (2s)      │
│  ✅ Dominio 2: Wayback (2s) + IA (5s) + delay (2s)      │
│  ✅ Dominio 3: Wayback (2s) + IA (3s)                   │
│  ✅ Total: ~23 segundos (dentro de timeout)             │
│  → Responder JSON con 3 resultados                      │
└─────────────────────────────────────────────────────────┘
```

---

## Mejoras Adicionales

### 1. Manejo de errores con retry

```typescript
// En BatchAnalyzePanel - retry automático en caso de error de red
if (remaining === -1) {
  // Esperar 3 segundos y reintentar
  await new Promise(r => setTimeout(r, 3000));
  remaining = await runBatch();
  if (remaining === -1) break; // Si falla 2 veces, detener
}
```

### 2. Timeout client-side con AbortController

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 25000);

const response = await fetch(url, {
  signal: controller.signal,
  // ...
});
clearTimeout(timeoutId);
```

### 3. Actualizar ETA con batch size real

```typescript
// Antes: asumía 2.5 min/dominio con batch de 10
// Después: ~8s/dominio con batch de 3
const eta = Math.ceil((remaining * 8) / 60); // minutos
```

---

## Archivos a Modificar

```
MODIFICAR:
├── src/components/domain-sniper/BatchAnalyzePanel.tsx
│   - BATCH_SIZE = 3 (antes 10)
│   - Agregar AbortController con timeout 25s
│   - Retry automático en caso de error de red
│   - Actualizar cálculo de ETA
│
└── supabase/functions/batch-analyze-domains/index.ts
    - Agregar timeout de 5s para Wayback API
    - Batch size por defecto = 3
```

---

## Resultado Esperado

| Métrica | Antes | Después |
|---------|-------|---------|
| Batch size | 10 | 3 |
| Tiempo por batch | 50-90s ❌ | 20-25s ✅ |
| Timeouts | Frecuentes | Ninguno |
| ETA para 143 dominios | N/A (se pegaba) | ~16 minutos |

El análisis continuará de forma estable con progreso visible en la UI.

