
# Plan: Agregar ordenamiento por columnas a la tabla de oportunidades

## Resumen

Permitir que el usuario haga clic en los encabezados de columna para ordenar la tabla de dominios por diferentes criterios (PageRank, Edad, Score, Wayback, Valor Estimado, etc.).

---

## Implementación

### Estado de ordenamiento

Agregar un estado para controlar la columna activa y dirección:

```typescript
type SortField = "domain" | "page_rank" | "age" | "ai_score" | "wayback" | "estimated_value" | "status";
type SortDirection = "asc" | "desc";

const [sortField, setSortField] = useState<SortField>("ai_score");
const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
```

### Encabezados clickeables

Crear un componente o función para encabezados ordenables:

```typescript
const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
  <TableHead 
    className="cursor-pointer hover:bg-muted/50 select-none"
    onClick={() => handleSort(field)}
  >
    <div className="flex items-center gap-1">
      {label}
      {sortField === field && (
        sortDirection === "desc" 
          ? <ArrowDown className="w-3 h-3" />
          : <ArrowUp className="w-3 h-3" />
      )}
    </div>
  </TableHead>
);
```

### Función de ordenamiento

```typescript
const handleSort = (field: SortField) => {
  if (sortField === field) {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  } else {
    setSortField(field);
    setSortDirection("desc");
  }
};
```

### Lógica de sorting en useMemo

Modificar `filteredOpportunities` para aplicar el orden seleccionado:

```typescript
const sortedOpportunities = useMemo(() => {
  const sorted = [...filtered].sort((a, b) => {
    let aVal, bVal;
    
    switch (sortField) {
      case "domain":
        aVal = a.domain_name;
        bVal = b.domain_name;
        break;
      case "page_rank":
        aVal = a.page_rank ?? -1;
        bVal = b.page_rank ?? -1;
        break;
      case "age":
        aVal = a.wayback_first_seen ? new Date(a.wayback_first_seen).getTime() : 0;
        bVal = b.wayback_first_seen ? new Date(b.wayback_first_seen).getTime() : 0;
        break;
      case "ai_score":
        aVal = a.ai_score ?? -1;
        bVal = b.ai_score ?? -1;
        break;
      case "wayback":
        aVal = a.wayback_snapshots ?? 0;
        bVal = b.wayback_snapshots ?? 0;
        break;
      case "estimated_value":
        aVal = a.estimated_value ?? 0;
        bVal = b.estimated_value ?? 0;
        break;
      default:
        return 0;
    }
    
    if (typeof aVal === "string") {
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }
    
    return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
  });
  
  return sorted;
}, [filtered, sortField, sortDirection]);
```

---

## Columnas ordenables

| Columna | Campo | Ordenamiento |
|---------|-------|--------------|
| Dominio | `domain_name` | Alfabético A-Z / Z-A |
| PR | `page_rank` | Mayor a menor / Menor a mayor |
| Edad | `wayback_first_seen` | Más antiguo / Más reciente |
| Score | `ai_score` | Mayor a menor / Menor a mayor |
| Wayback | `wayback_snapshots` | Más snapshots / Menos |
| Valor Est. | `estimated_value` | Mayor valor / Menor valor |

---

## Visual

- Icono de flecha (↑/↓) junto al encabezado activo
- Hover effect en encabezados ordenables
- Cursor pointer para indicar interactividad
- Importar `ArrowUp` y `ArrowDown` de lucide-react

---

## Archivo a modificar

```
src/components/domain-sniper/OpportunitiesTable.tsx
- Agregar estados sortField y sortDirection
- Crear componente SortableHeader
- Modificar TableHeader con encabezados clickeables
- Actualizar useMemo para aplicar ordenamiento
- Importar iconos ArrowUp/ArrowDown
```

---

## UX

- Por defecto: ordenar por Score descendente (comportamiento actual)
- Click en columna activa: invierte dirección
- Click en nueva columna: ordena descendente por esa columna
- Valores null/undefined van al final
