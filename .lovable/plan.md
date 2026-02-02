

# Plan: Agregar Paginación a la Tabla de Oportunidades

## Resumen

Implementar paginación en la tabla de dominios para mejorar el rendimiento y usabilidad cuando hay cientos o miles de dominios en el radar.

---

## Implementación

### Estado de Paginación

Agregar estados para controlar la página actual y tamaño de página:

```typescript
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(25);
```

### Cálculo de Páginas

```typescript
const totalPages = Math.ceil(filteredOpportunities.length / pageSize);
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const paginatedOpportunities = filteredOpportunities.slice(startIndex, endIndex);
```

### Selector de Tamaño de Página

Agregar un selector para que el usuario elija cuántos dominios ver por página:
- Opciones: 10, 25, 50, 100

### Componente de Paginación

Usar los componentes existentes de `@/components/ui/pagination`:
- Botones Anterior/Siguiente
- Números de página con ellipsis para rangos grandes
- Indicador de rango actual ("Mostrando 1-25 de 340")

---

## Cambios en el Archivo

```
src/components/domain-sniper/OpportunitiesTable.tsx

1. Agregar imports:
   - Pagination, PaginationContent, PaginationItem, PaginationLink,
     PaginationNext, PaginationPrevious, PaginationEllipsis
   - Select, SelectContent, SelectItem, SelectTrigger, SelectValue

2. Agregar estados:
   - currentPage (número, default: 1)
   - pageSize (número, default: 25)

3. Agregar useMemo para paginación:
   - Calcular totalPages, startIndex, endIndex
   - Crear paginatedOpportunities

4. Resetear página cuando cambia el filtro:
   - Agregar useEffect que resetea currentPage a 1

5. Agregar UI de paginación debajo de la tabla:
   - Indicador: "Mostrando X-Y de Z dominios"
   - Selector de tamaño de página
   - Controles de navegación
```

---

## Estructura Visual

```text
┌─────────────────────────────────────────────────────────────┐
│  [Stats Cards]                                              │
│  [Quick Filters]                                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Dominio | Datos | PR | Edad | Score | Wayback | ...     ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ ejemplo1.cl | ... | 6.5 | 5a | 8.2 | 45 | ...          ││
│  │ ejemplo2.cl | ... | 3.2 | 2a | 6.1 | 12 | ...          ││
│  │ ... (25 filas por defecto)                              ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Mostrando 1-25 de 340    [10|25|50|100]                    │
│                                                             │
│  [← Anterior] [1] [2] [3] [...] [14] [Siguiente →]          │
└─────────────────────────────────────────────────────────────┘
```

---

## Lógica de Números de Página

Para evitar mostrar demasiados números cuando hay muchas páginas:

```typescript
const getVisiblePages = () => {
  const pages: (number | "ellipsis")[] = [];
  
  if (totalPages <= 7) {
    // Mostrar todas las páginas si son 7 o menos
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    // Siempre mostrar primera página
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push("ellipsis");
    }
    
    // Páginas alrededor de la actual
    for (let i = Math.max(2, currentPage - 1); 
         i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }
    
    // Siempre mostrar última página
    pages.push(totalPages);
  }
  
  return pages;
};
```

---

## UX

- Página 1 por defecto
- Al cambiar filtro, volver a página 1
- Al cambiar tamaño de página, volver a página 1
- Deshabilitar botón "Anterior" en página 1
- Deshabilitar botón "Siguiente" en última página
- Mantener scroll en la parte superior al cambiar página

---

## Archivo a Modificar

```
src/components/domain-sniper/OpportunitiesTable.tsx
```

