

# Plan: Dashboard de Estado de Enriquecimiento y Filtros de Valor

## Problema Actual

- 220 dominios sincronizados, pero **ninguno tiene datos de Wayback**
- Solo 2 dominios analizados con IA
- No hay forma de ver rápidamente cuáles valen la pena
- No hay filtros para priorizar dominios con historial web

## Solución Propuesta

Agregar un panel de resumen y filtros para ver el estado de cada dominio y priorizar los que tienen valor comercial.

---

## 1. Panel de Resumen (Stats Cards)

Mostrar estadísticas rápidas arriba de la tabla:

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   TOTAL     │ │ ENRIQUECIDOS│ │ ANALIZADOS  │ │ CON WEB     │
│    220      │ │    0/220    │ │   2/220     │ │    0/220    │
│             │ │   (0%)      │ │   (1%)      │ │   (0%)      │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

## 2. Columna de Estado de Datos

Nueva columna que muestra visualmente qué datos tiene cada dominio:

```
┌──────────────────────────────────────────────────────────────────┐
│ Dominio         │ Datos          │ Score │ Wayback │ Valor Est. │
├──────────────────────────────────────────────────────────────────┤
│ tienda.cl       │ ✅IA ✅Web     │  8.5  │ 45 📸   │ $2.5M      │
│ startup.cl      │ ✅IA ⏳Web     │  7.2  │ -       │ $800K      │
│ random123.cl    │ ⏳IA ⏳Web     │   -   │ -       │ -          │
└──────────────────────────────────────────────────────────────────┘

Leyenda:
✅ = Datos completos
⏳ = Pendiente de obtener
❌ = Sin datos disponibles
```

## 3. Filtros Rápidos

Botones para filtrar la tabla:

```
Filtrar: [Todos] [Con Web ✅] [Score 7+] [Pendientes] [Descartados]
```

## 4. Ordenamiento Inteligente

Priorizar automáticamente dominios con mayor valor:
1. Score alto + historial web = arriba
2. Solo score alto = medio  
3. Solo historial web = medio
4. Sin datos = abajo

---

## Archivos a Modificar

```
MODIFICAR:
├── src/components/domain-sniper/OpportunitiesTable.tsx
│   - Agregar stats cards arriba
│   - Nueva columna "Datos" con indicadores visuales
│   - Agregar filtros rápidos
│   - Mejorar ordenamiento
│
└── src/pages/admin/DomainSniper.tsx
    - Posible reestructuración del layout
```

---

## Nuevo Componente: DataStatusBadge

Indicador visual del estado de datos de cada dominio:

```jsx
// Estados posibles
const dataStatus = {
  complete: { label: "Completo", icon: "✅✅", color: "green" },    // IA + Wayback
  ai_only: { label: "Solo IA", icon: "✅⏳", color: "yellow" },     // IA sin Wayback
  wayback_only: { label: "Solo Web", icon: "⏳✅", color: "yellow" }, // Wayback sin IA
  pending: { label: "Pendiente", icon: "⏳⏳", color: "gray" },     // Ninguno
};
```

---

## Flujo de Uso

1. Admin ve el panel de stats: "0 enriquecidos de 220"
2. Presiona "Iniciar Enriquecimiento Masivo" (BatchAnalyzePanel)
3. Sistema enriquece dominios con Wayback Machine
4. Stats se actualizan: "45 con historial web de 220"
5. Admin filtra por "Con Web ✅"
6. Ve solo los 45 dominios que tuvieron página activa
7. Ejecuta análisis con IA solo para esos 45
8. Ordena por Score y decide cuáles comprar

---

## Indicadores de Valor de Negocio

Para cada dominio mostrar iconos que indiquen potencial:

| Indicador | Significado | Importancia |
|-----------|-------------|-------------|
| 🌐 | Tuvo sitio web activo | Alta |
| 📸 | Tiene snapshots en Wayback | Alta |
| 📈 | Score IA >= 7 | Alta |
| 🏪 | Tipo: e-commerce/comercial | Media |
| ⏰ | Activo recientemente (< 1 año) | Media |

---

## Resultado Esperado

Después de implementar, podrás:
1. Ver de un vistazo cuántos dominios tienen cada tipo de dato
2. Filtrar para ver solo los que tuvieron página web
3. Priorizar los que tienen historial + buen score
4. Tomar decisiones informadas de compra basadas en datos reales

