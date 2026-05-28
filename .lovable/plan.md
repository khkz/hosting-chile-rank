## Problema

El ranking del home (`HostingRanking.tsx`) se llena desde `hosting_companies.ranking_position` y hoy muestra:

1. HostingPlus.cl
2. EcoHosting.cl
3. **HostGator.cl** ← inconsistente con el Estudio Hosting Chile 2026

El estudio (y la nueva `/comparativa`) marca **PowerHost / IxMetro** como 3°. Además, HostGator no aparece en el Top chileno del estudio.

## Cambios (solo base de datos vía migración)

1. **Insertar PowerHost / IxMetro** en `hosting_companies` con los datos del estudio:
   - `name`: "PowerHost / IxMetro"
   - `slug`: "powerhost"
   - `website`: `https://www.powerhost.cl/`
   - `legal_name` / RUT si se conoce del estudio, `foundation_year` 2001
   - `is_verified = true`, `is_curated = true` (cumple la regla de memoria para aparecer en ranking)
   - `is_independent = true`, `corporate_group = null`
   - `ranking_position = 3`, `is_recommended = false`
   - `ranking_features`: ["ASN propio AS263237", "4 datacenters propios (SCL, NY, MOW, AMS)", "Tier III", "20+ años en Chile"]
   - `ranking_badges`: ["ASN propio", "Tier III"]
   - `cta_text`: "Visitar PowerHost", `button_color`: clase tailwind acorde
   - `overall_rating` / `speed_rating` / `price_rating`: dejar `null` o el promedio editorial que ya usa el resto (no inventar uptime/ms — regla de memoria de benchmark)
   - precios `promo_price` / `original_price`: `null` (el estudio dice "Consultar")

2. **Quitar HostGator del ranking del home**: `update hosting_companies set ranking_position = null, is_recommended = false where slug = 'hostgator';` (no se elimina la ficha, solo deja de salir en el Top 3 del home).

3. Verificar que el orden final del home queda: 1 HostingPlus, 2 EcoHosting, 3 PowerHost/IxMetro.

## Fuera de alcance

- No se toca `HostingRanking.tsx`, `Comparativa.tsx`, `EstudioHostingChile2026.tsx` ni ningún componente. Solo migración SQL.
- No se eliminan filas existentes.
- No se inventan cifras de velocidad/uptime (regla `benchmark`).

## Verificación

- Consulta `select ranking_position, name from hosting_companies where ranking_position is not null order by ranking_position;` debe devolver HostingPlus, EcoHosting, PowerHost.
- Recargar `/` y confirmar que el 3° es PowerHost / IxMetro.
