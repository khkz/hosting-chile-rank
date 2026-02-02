

# Plan: Sistema de Analisis Enriquecido con Datos Historicos

## El Problema

Actualmente el analisis de dominios solo evalua el **nombre** del dominio con IA. No sabemos:
- Si el dominio tuvo un sitio web activo antes
- Si tenia backlinks y autoridad SEO
- Cuanto trafico estimado tenia
- Que tipo de contenido mostraba

## Solucion: Analisis Multi-Fuente

Combinar **APIs gratuitas** + **IA mejorada** para obtener datos reales de cada dominio.

---

## Fuentes de Datos Disponibles (Gratuitas)

| Fuente | Datos que Proporciona | Costo |
|--------|----------------------|-------|
| **Wayback Machine API** | Historial de snapshots, fechas activo, URLs archivadas | Gratis |
| **CommonCrawl** | Paginas indexadas historicamente | Gratis |
| **Google DNS** | Si el dominio tuvo registros DNS | Gratis |
| **IA Lovable** | Analisis del nombre + contexto historico | Ya configurado |

### APIs de Pago (Opcionales para futuro)

| Servicio | Datos | Precio Aprox |
|----------|-------|--------------|
| Ahrefs API | Backlinks, Domain Rating | $99+/mes |
| Moz API | Domain Authority, Links | $99+/mes |
| SEMrush API | Trafico, Keywords | $120+/mes |
| Majestic API | Trust Flow, Citation Flow | $50+/mes |

---

## Arquitectura del Sistema Enriquecido

```text
┌─────────────────────────────────────────────────────────────┐
│                    Dominio a Analizar                       │
│                      ejemplo.cl                              │
└─────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
           ▼                  ▼                  ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │  Wayback     │   │  CommonCrawl │   │   Google     │
   │  Machine API │   │     API      │   │   DNS API    │
   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
          │                  │                  │
          ▼                  ▼                  ▼
   ┌──────────────────────────────────────────────────────┐
   │           Datos Historicos Recopilados               │
   │  - Snapshots: 45 entre 2018-2024                     │
   │  - Ultimo activo: 2024-08-15                         │
   │  - Tipo contenido: E-commerce (tienda ropa)          │
   │  - Paginas indexadas: 234                             │
   └──────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌──────────────────────────────────────────────────────┐
   │              Lovable AI Gateway                       │
   │                                                       │
   │  Prompt enriquecido:                                  │
   │  "Evalua ejemplo.cl considerando:                     │
   │   - 45 snapshots en Wayback (2018-2024)              │
   │   - Era tienda de ropa online                         │
   │   - 234 paginas indexadas                             │
   │   - Ultimo activo hace 5 meses"                       │
   └──────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌──────────────────────────────────────────────────────┐
   │              Resultado Enriquecido                    │
   │                                                       │
   │  Score: 8.5/10                                        │
   │  Categoria: comercial                                 │
   │  Valor: $2.500.000 CLP                               │
   │  Razon: "Dominio con historial comprobado de         │
   │         e-commerce activo por 6 años. 45 snapshots   │
   │         indican sitio establecido. Alto potencial    │
   │         para reventa a tiendas online."               │
   └──────────────────────────────────────────────────────┘
```

---

## Cambios en Base de Datos

Agregar columnas a `domain_opportunities` para guardar datos historicos:

```sql
ALTER TABLE domain_opportunities ADD COLUMN IF NOT EXISTS
  wayback_snapshots INTEGER DEFAULT 0,
  wayback_first_seen DATE,
  wayback_last_seen DATE,
  wayback_content_type TEXT,
  historical_pages_count INTEGER DEFAULT 0,
  had_website BOOLEAN DEFAULT FALSE;
```

---

## Nueva Edge Function: `enrich-domain-data`

Esta funcion obtiene datos historicos antes del analisis con IA:

```text
Endpoint: POST /functions/v1/enrich-domain-data
Body: { "domain_name": "ejemplo.cl" }

Proceso:
1. Consultar Wayback Machine API
   GET https://archive.org/wayback/available?url=ejemplo.cl
   
2. Consultar CDX API para historial completo
   GET https://web.archive.org/cdx/search/cdx?url=ejemplo.cl&output=json
   
3. Parsear resultados:
   - Contar snapshots totales
   - Obtener fecha primera captura
   - Obtener fecha ultima captura
   - Analizar ultimo snapshot para detectar tipo de contenido

4. Actualizar domain_opportunities con datos historicos

Response:
{
  "success": true,
  "domain": "ejemplo.cl",
  "wayback": {
    "snapshots": 45,
    "first_seen": "2018-03-15",
    "last_seen": "2024-08-20",
    "content_type": "e-commerce"
  }
}
```

---

## Modificar Edge Function: `analyze-domain-potential`

Actualizar el prompt de IA para incluir datos historicos:

```text
ANTES:
"Evalua el dominio ejemplo.cl para el mercado chileno"

DESPUES:
"Evalua el dominio ejemplo.cl para el mercado chileno.

DATOS HISTORICOS:
- Wayback Machine: 45 snapshots entre 2018-2024
- Ultimo contenido capturado: Tienda de ropa online
- Paginas indexadas historicamente: 234
- Tiempo activo estimado: 6 años

Considera estos datos al calcular el score y valor estimado."
```

---

## Modificar Edge Function: `batch-analyze-domains`

El flujo de analisis masivo seria:

```text
Para cada dominio:
1. Llamar enrich-domain-data (obtener historial)
2. Llamar analyze-domain-potential (con datos enriquecidos)
3. Actualizar BD con resultado completo
4. Esperar delay para rate limits
```

---

## UI Actualizada: OpportunitiesTable

Mostrar datos historicos en la tabla:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Dominio        │ Score │ Wayback │ Ultimo Activo │ Tipo      │ Valor Est. │
├────────────────────────────────────────────────────────────────────────────┤
│ tienda.cl      │  8.5  │ 45 📸   │ Ago 2024      │ E-commerce│ $2.5M      │
│ startup.cl     │  7.2  │ 12 📸   │ Mar 2023      │ Tech      │ $800K      │
│ random123.cl   │  3.1  │  0 📸   │ Nunca         │ -         │ $50K       │
│ delivery.cl    │  9.1  │ 89 📸   │ Ene 2025      │ Servicios │ $5M        │
└────────────────────────────────────────────────────────────────────────────┘

Leyenda: 📸 = Capturas en Wayback Machine
```

---

## Archivos a Crear/Modificar

```text
CREAR:
├── supabase/functions/enrich-domain-data/index.ts    # Obtener datos Wayback
├── supabase/functions/batch-analyze-domains/index.ts # Analisis masivo

MODIFICAR:
├── supabase/functions/analyze-domain-potential/index.ts  # Prompt enriquecido
├── supabase/config.toml                                   # Nuevas functions
├── src/components/domain-sniper/OpportunitiesTable.tsx   # Mostrar historial
└── Migracion SQL para nuevas columnas
```

---

## Detalle de Wayback Machine API

### 1. Availability API (Verificar si existe)

```javascript
const response = await fetch(
  `https://archive.org/wayback/available?url=${domain}`
);
// Response:
{
  "archived_snapshots": {
    "closest": {
      "available": true,
      "url": "http://web.archive.org/web/20240815/http://ejemplo.cl",
      "timestamp": "20240815123456"
    }
  }
}
```

### 2. CDX API (Historial completo)

```javascript
const response = await fetch(
  `https://web.archive.org/cdx/search/cdx?url=${domain}&output=json&fl=timestamp,statuscode,mimetype`
);
// Response: Array de capturas
[
  ["timestamp", "statuscode", "mimetype"],
  ["20180315123456", "200", "text/html"],
  ["20180520143022", "200", "text/html"],
  ...
]
```

### 3. Obtener Contenido de Snapshot

```javascript
// Obtener HTML del ultimo snapshot
const snapshotUrl = `https://web.archive.org/web/${timestamp}id_/${domain}`;
const html = await fetch(snapshotUrl);
// Analizar HTML para detectar tipo de contenido
```

---

## Flujo Completo del Sistema Enriquecido

```text
┌─────────────────────────────────────────────────────────────────┐
│  1. Sincronizar NIC.cl                                          │
│     → 220 dominios eliminados detectados                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Enriquecer con Wayback Machine                              │
│     → Para cada dominio: obtener historial                      │
│     → Marcar cuales tuvieron sitio activo                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Analizar con IA (prompt enriquecido)                        │
│     → Incluir datos de Wayback en el prompt                     │
│     → Score mas preciso basado en historial real                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Priorizar por Score + Historial                             │
│     → Dominios con historial = mayor prioridad                  │
│     → Filtrar: Score >= 7 AND wayback_snapshots > 0             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Comprar automaticamente los mejores                         │
│     → Auto-sniper activa para Score >= 9                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Estimacion de Trabajo

| Componente | Complejidad | Archivos |
|------------|-------------|----------|
| Migracion SQL nuevas columnas | Baja | 1 |
| Edge Function enrich-domain-data | Media | 1 |
| Edge Function batch-analyze-domains | Media | 1 |
| Modificar analyze-domain-potential | Baja | 1 |
| Actualizar OpportunitiesTable UI | Media | 1 |
| Actualizar config.toml | Baja | 1 |
| **Total** | **Media-Alta** | **~6 archivos** |

---

## Beneficios del Sistema Enriquecido

1. **Datos reales**: No solo el nombre, sino historial comprobable
2. **Mejor valoracion**: Dominios con historial valen mas
3. **Filtrado inteligente**: Priorizar los que tuvieron trafico
4. **Decisiones informadas**: Saber que tipo de sitio era
5. **Ventaja competitiva**: Ver datos que otros no ven
6. **100% gratuito**: Wayback Machine API no tiene costo

