

## Sprint 1: Unificar Fuente de Verdad — Plan de Implementacion

### Problema
`HostingRanking.tsx` y `TLDRVerdict.tsx` leen de `rankingProviders.ts` (datos estaticos). La DB tiene las empresas pero le faltan campos especificos del ranking (posicion, features del ranking, colores de UI, CTA, precio promocional).

### Paso 1: Migracion de DB — Agregar campos de ranking a `hosting_companies`

Nuevas columnas en `hosting_companies`:

| Columna | Tipo | Proposito |
|---|---|---|
| `ranking_position` | integer (nullable) | Posicion manual en homepage (NULL = no aparece en ranking) |
| `is_recommended` | boolean default false | Badge "Mas Recomendado" |
| `ranking_features` | text[] default '{}' | Features visibles en tarjeta ranking (distintas a `pros`) |
| `ranking_badges` | text[] default '{}' | Badges tipo "Mas Popular", "Eco-Friendly" |
| `cta_text` | text | Texto del boton CTA |
| `cta_micro_copy` | text | Microcopy debajo del CTA |
| `button_color` | text | Clase Tailwind del boton |
| `border_color` | text | Clase Tailwind del borde |
| `display_name_first` | text | Primera parte del nombre partido |
| `display_name_second` | text | Segunda parte |
| `display_name_first_color` | text | Clase de color Tailwind |
| `display_name_second_color` | text | Clase de color Tailwind |
| `promo_price` | integer | Precio promocional actual (CLP) |
| `original_price` | integer | Precio tachado original (CLP, nullable) |
| `price_period` | text default 'mensual' | Periodo del precio |

La migracion tambien hace UPDATE para poblar los datos de los 3 proveedores actuales del ranking (HostingPlus, EcoHosting, HostGator) usando los valores que hoy estan hardcodeados.

### Paso 2: Refactorizar `HostingRanking.tsx`

- Eliminar import de `rankingProviders` y `RankingProvider`
- Definir interfaz `RankingCompany` mapeada a los campos de Supabase
- Usar `useQuery` con `supabase.from('hosting_companies').select('*, hosting_plans(price_monthly)').eq('is_verified', true).eq('is_curated', true).not('ranking_position', 'is', null).order('ranking_position')`
- Mapear los datos de DB al formato que espera `RankingCard`
- Mostrar skeleton/loading state mientras carga
- `IndependenceBadge` ya recibe `isIndependent`, `corporateGroup`, `legalName` — ahora vienen de la DB en vivo

### Paso 3: Refactorizar `TLDRVerdict.tsx`

- Reemplazar import estatico por `useQuery` al mismo dataset
- Derivar `best` y `cheapest` de los datos en vivo

### Paso 4: Eliminar `src/data/rankingProviders.ts`

El archivo se borra completamente. Ya no tiene consumidores.

### Nota sobre `src/data/hostingCompanies.ts`

Este archivo **NO se borra todavia** porque tiene 3 consumidores activos:
- `src/pages/admin/Setup.tsx` (migracion inicial)
- `src/services/hostingASNService.ts` (mappings ASN)
- `src/components/TCOCalculator.tsx` (datos de planes)
- `src/utils/migrateHostingData.ts` (script de migracion)

Eliminar estos requiere refactorizar cada uno para leer de Supabase, lo cual es un sprint separado. El impacto de Riesgo 3 se reduce significativamente con solo migrar el ranking de la homepage (la pieza mas visible).

### Impacto

- La homepage refleja datos en vivo de Supabase
- Cambiar un rating, precio o badge en el admin se refleja instantaneamente
- Los badges de transparencia (`is_independent`, `corporate_group`, `is_fake_comparison`) son 100% dinamicos
- Zero datos hardcodeados en el ranking principal

