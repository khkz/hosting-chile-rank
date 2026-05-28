## Objetivo

La página `/comparativa` muestra hoy un Top inconsistente con el estudio publicado en `/estudio-hosting-chile-2026`. Hay que reflejar el ranking real del estudio, con **PowerHost / IxMetro en el puesto 3**, y evitar cifras inventadas de velocidad/seguridad (regla de memoria: solo `benchmark_results` puede dar números de uptime/speed).

## Cambios en `src/pages/Comparativa.tsx`

### 1. Reemplazar el array `hostingProviders`

Nuevo Top, en el mismo orden del estudio:

1. HostingPlus
2. EcoHosting
3. **PowerHost / IxMetro** (nuevo)
4. Hostname.cl
5. Hosting.cl (nuevo)
6. BlueHosting (nuevo)

Se eliminan HostGator, DonWeb y GoDaddy de esta vista (no están en el Top chileno del estudio; DonWeb queda como caso "internacional" en la ficha del estudio).

### 2. Reestructurar columnas para no inventar cifras

Sustituir las columnas `Velocidad` y `Seguridad` (que hoy muestran "9.9/10" inventados) por:

- **ASN** (ej. `AS266879`, `AS263237`, "—" si no tiene)
- **Datacenter** (ej. "Propio Santiago", "4 DC propios", "Chile (Haulmer)")

Se mantienen: Backups, Reclamos (texto del estudio), Precio (CLP/año cuando exista, "Consultar" si el estudio dice "no publicado"), Tecnologías (LiteSpeed/WAF según ficha real), Acción (link a reseña o al estudio).

### 3. Datos por proveedor (transcritos del estudio)

| # | Proveedor | ASN | DC | Backups | Reclamos | Precio | LiteSpeed | WAF |
|---|---|---|---|---|---|---|---|---|
| 1 | HostingPlus | AS266879 | Propio Santiago | Diarios | 0 visibles | $49.900/año | sí | sí |
| 2 | EcoHosting | AS266855 | Propio Chile | RAID 10 SSD | 0 en reclamos.cl | $19.900/año | — | sí |
| 3 | PowerHost / IxMetro | AS263237 | 4 DC propios (SCL, NY, MOW, AMS) | Tier III | 1 no-técnico | Consultar | — | sí |
| 4 | Hostname.cl | AS262256 | HN DC Ñuñoa | sí | Perfil bajo | Consultar | — | sí |
| 5 | Hosting.cl | AS265839 | Propio Santiago | sí | Varios 2012-2025 | Consultar | sí | sí |
| 6 | BlueHosting | AS64111 | Haulmer Curicó | sí | Mixto | $43.900/año | — | sí |

### 4. Encabezado y meta

- `<TableCaption>`: "Datos del Estudio Hosting Chile 2026 (v3.0, 28-may-2026)".
- `<title>` y meta description actualizados a 2026.
- Banner arriba de la tabla: "Orden basado en el [Estudio Hosting Chile 2026](/estudio-hosting-chile-2026)".

### 5. Sección final

Reformular el bloque "¿Por qué HostingPlus es nuestra recomendación principal?" citando los criterios del estudio (ASN propio + RUT + 20+ años + 0 reclamos visibles) y linkeando al estudio completo, en lugar de afirmaciones sin fuente.

## Fuera de alcance

- No se toca `EstudioHostingChile2026.tsx`.
- No se modifica la home, `HostingRanking`, edge functions ni base de datos.
- No se crean páginas nuevas.

## Verificación

- Build automático.
- Revisión visual en `/comparativa`: orden 1-6 correcto con PowerHost 3°, sin "9.9/10" inventados, link al estudio funcionando.
