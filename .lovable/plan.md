# Fix: Últimos Dominios congelados — typo en URL del repo

## Diagnóstico (confirmado)

`src/services/domainsService.ts` línea 38 hace `fetch` a:

```
https://raw.githubusercontent.com/khkzulox/hosting-chile-rank/main/public/data/latest.json
```

Ese repo **no existe (HTTP 404)**. El correcto es `khkz/hosting-chile-rank` y está perfectamente actualizado: probé recién y devuelve `updated: 2026-05-01T22:42:57Z` con 452 dominios frescos (ej. `tikinazo.cl` de hace minutos).

Como el `try` falla, cae al `catch` que lee `/data/latest.json` local — ese archivo sólo se regenera cuando se hace deploy/build, por eso la página se ve "pegada" hace ~9 horas (último build) o más.

El workflow `.github/workflows/nic-crawl.yml` está corriendo bien cada hora en el repo correcto. **No hay nada roto en el scraper ni en el cron** — sólo el typo en el cliente.

## Cambios

### 1. Corregir URL en `src/services/domainsService.ts` (línea 38)

```diff
- const githubUrl = 'https://raw.githubusercontent.com/khkzulox/hosting-chile-rank/main/public/data/latest.json';
+ const githubUrl = 'https://raw.githubusercontent.com/khkz/hosting-chile-rank/main/public/data/latest.json';
```

### 2. Mejoras menores (mientras estoy ahí)

- Reducir cache de 5 min a **2 min** para frescura mayor (el cron escribe cada hora, pero a veces queremos ver cambios al instante).
- Agregar `?t=${Date.now()}` al fetch para evitar cache agresivo del CDN de GitHub Raw.
- Loguear claramente cuál fuente se usó (GitHub vs local) para debug futuro.

## Resultado

Apenas se desplegue el fix:
- `/ultimos-dominios` mostrará dominios actualizados cada ~hora directamente desde el repo.
- Sin necesidad de redeploy de la web para refrescar datos.
- Sin migrar nada a Supabase (no es necesario, el flujo actual funciona, sólo tenía un typo).

## ¿Sigue en pie el plan grande?

Lo que te presenté antes (mover scraping a Supabase + Indexing API + scrape de competencia + reclamos con schema) sigue siendo el roadmap correcto para volver la web la comparativa #1 de Chile. Pero **esto del typo es un fix de 1 línea**, lo arreglo ya y después seguimos con las fases mayores en el orden que prefieras.

¿Apruebo y aplico el fix ahora?