
# Replicar Corrección de Badges a Tarjetas 2do y 3er Lugar

## Problema Actual

Las tarjetas del 2do y 3er lugar todavía tienen `overflow-hidden` que oculta los badges cuando se posicionan fuera del contenedor. Necesitan el mismo tratamiento que la tarjeta ganadora.

## Cambios a Realizar

### Archivo: `src/components/HostingRanking.tsx`

#### Tarjeta 2do Lugar (EcoHosting) - Línea 221

**Antes:**
```tsx
<div className="relative bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-xl...">
  {/* Badges */}
  <div className="absolute top-3 md:top-4 left-3 md:left-4 flex flex-wrap gap-1.5 md:gap-2 z-10">
```

**Después:**
```tsx
<div className="relative bg-white border-2 border-gray-200 rounded-3xl shadow-xl...">
  {/* Badges - positioned outside the card */}
  <div className="absolute -top-3 left-3 md:left-4 flex flex-wrap gap-1.5 md:gap-2 z-20">
```

#### Tarjeta 3er Lugar (HostGator) - Línea 417

**Antes:**
```tsx
<div className="relative bg-white border-2 border-amber-200 rounded-3xl overflow-hidden shadow-xl...">
  {/* Badges */}
  <div className="absolute top-3 md:top-4 left-3 md:left-4 flex flex-wrap gap-1.5 md:gap-2 z-10">
```

**Después:**
```tsx
<div className="relative bg-white border-2 border-amber-200 rounded-3xl shadow-xl...">
  {/* Badges - positioned outside the card */}
  <div className="absolute -top-3 left-3 md:left-4 flex flex-wrap gap-1.5 md:gap-2 z-20">
```

## Resumen de Cambios

| Tarjeta | Línea | Cambio |
|---------|-------|--------|
| 2do lugar | 221 | Eliminar `overflow-hidden` |
| 2do lugar | 223 | Cambiar `top-3 md:top-4` a `-top-3`, `z-10` a `z-20` |
| 3er lugar | 417 | Eliminar `overflow-hidden` |
| 3er lugar | 419 | Cambiar `top-3 md:top-4` a `-top-3`, `z-10` a `z-20` |

## Resultado Esperado

Los badges de las tres tarjetas del podio se mostrarán por encima del borde superior de cada tarjeta, sin ser recortados por el contenedor.
