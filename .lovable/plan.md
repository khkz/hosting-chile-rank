

# Plan: Integrar Dominios Eliminados de NIC.cl al Domain Sniper

## Situacion Actual

Tu scraper actual (`scripts/nic-to-json.mjs`) solo captura dominios **registrados** desde:
- `https://www.nic.cl/registry/Ultimos.do?t=1d`

Pero **no** captura dominios **eliminados/expirados** que estan disponibles para registrar inmediatamente desde:
- `https://www.nic.cl/registry/Eliminados.do` (221 dominios libres ahora mismo)

## Solucion Propuesta

Crear un nuevo scraper que capture dominios eliminados y los inserte automaticamente en la tabla `domain_opportunities` del Domain Sniper.

---

## 1. Nuevo Script: `scripts/nic-deleted-to-db.mjs`

Este script hara:

```text
1. Scrapear https://www.nic.cl/registry/Eliminados.do
2. Extraer lista de dominios eliminados (regex sobre HTML)
3. Para cada dominio:
   - Verificar si ya existe en domain_opportunities
   - Si no existe, insertarlo con:
     - source: "deleted"
     - status: "pending_analysis"
     - detected_at: timestamp actual
4. Guardar tambien en public/data/deleted-domains.json (para referencia)
```

### Ejemplo de salida del scraper:

```text
📡 Conectando a NIC.cl/Eliminados.do...
📊 Encontrados 221 dominios eliminados
✅ 45 nuevos dominios agregados a domain_opportunities
⏭️ 176 dominios ya existentes (ignorados)
💾 Lista guardada en public/data/deleted-domains.json
```

---

## 2. Edge Function: `sync-deleted-domains`

Una Edge Function que puede ser llamada:
- Manualmente desde el panel admin (boton "Sincronizar NIC.cl")
- Via Cron Job diario (configurado en Supabase)

```text
Endpoint: POST /functions/v1/sync-deleted-domains
Auth: Solo admin

Proceso:
1. Fetch HTML de NIC.cl/Eliminados.do
2. Parsear lista de dominios con regex
3. Insertar en domain_opportunities (upsert)
4. Retornar estadisticas

Response:
{
  "success": true,
  "found": 221,
  "inserted": 45,
  "skipped": 176,
  "timestamp": "2026-02-02T..."
}
```

---

## 3. Actualizar UI del Domain Sniper

Agregar al panel `/admin/domain-sniper`:

```text
+----------------------------------------------------------+
|  Header con boton "Sincronizar NIC.cl"                    |
+----------------------------------------------------------+
|  [Crosshair] Domain Sniper                                |
|                                                           |
|  [Sincronizar NIC.cl] ← Nuevo boton                       |
|  Ultima sync: hace 2 horas | 221 dominios disponibles     |
+----------------------------------------------------------+
```

### Nuevo componente: `SyncNicButton.tsx`

- Boton que llama a la Edge Function
- Muestra loading mientras sincroniza
- Muestra toast con resultados
- Refresca automaticamente la tabla de oportunidades

---

## 4. Actualizar GitHub Actions (Opcional)

Agregar paso adicional al workflow `nic-crawl.yml`:

```yaml
- name: Ejecutar scraper dominios eliminados
  run: node scripts/nic-deleted-to-db.mjs
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

Esto sincronizaria automaticamente cada hora.

---

## 5. Archivos a Crear/Modificar

```text
CREAR:
├── scripts/nic-deleted-to-db.mjs          # Scraper local para dominios eliminados
├── supabase/functions/sync-deleted-domains/index.ts  # Edge function para sync
├── src/components/domain-sniper/SyncNicButton.tsx    # Boton de sincronizacion

MODIFICAR:
├── src/pages/admin/DomainSniper.tsx       # Agregar boton de sync
├── supabase/config.toml                   # Agregar nueva function
├── .github/workflows/nic-crawl.yml        # (Opcional) Agregar paso de sync
```

---

## Flujo Completo del Sistema

```text
                    ┌─────────────────────┐
                    │   NIC.cl/Eliminados │
                    │   (221 dominios)    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
    ┌─────────────────┐  ┌──────────┐  ┌──────────────┐
    │ GitHub Actions  │  │  Manual  │  │  Cron Job    │
    │  (cada hora)    │  │  (Admin) │  │  (Supabase)  │
    └────────┬────────┘  └────┬─────┘  └──────┬───────┘
             │                │               │
             └────────────────┼───────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ sync-deleted-domains│
                    │   Edge Function     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ domain_opportunities│
                    │   (Supabase DB)     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Admin Dashboard   │
                    │   /domain-sniper    │
                    │   (Ver y Analizar)  │
                    └─────────────────────┘
```

---

## Regex para Parsear Eliminados.do

Basado en el HTML que vi, el patron es:

```javascript
// Patron para extraer dominios de la tabla
const regex = /([a-z0-9áéíóúñü-]+\.cl)\s*<br>/gi;

// Ejemplo de matches:
// - "10deseos.cl"
// - "69millones.cl"
// - "badass.cl"
// - "boxingday.cl"
// etc.
```

---

## Beneficios de Esta Integracion

1. **Automatizacion completa**: Detecta dominios libres sin intervencion manual
2. **Ventaja competitiva**: Puedes ver dominios eliminados antes que la competencia
3. **Analisis con IA**: Cada dominio detectado puede ser analizado automaticamente
4. **Auto-Sniper**: Si un dominio tiene score > 9, se puede comprar automaticamente
5. **Datos historicos**: Guardas registro de todos los dominios que pasaron por el sistema

---

## Estimacion de Trabajo

| Componente | Complejidad | Tiempo Est. |
|------------|-------------|-------------|
| Edge Function sync-deleted-domains | Media | 1 archivo |
| SyncNicButton component | Baja | 1 archivo |
| Actualizar DomainSniper.tsx | Baja | Modificacion menor |
| Script local (opcional) | Media | 1 archivo |
| GitHub Actions (opcional) | Baja | Modificacion menor |
| **Total** | **Media** | **~4 archivos** |

