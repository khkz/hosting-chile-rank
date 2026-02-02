
# Plan: Modulo Domain Sniper & Marketplace

## Resumen Ejecutivo

Tu prompt esta excelente y muy bien estructurado. Ya verifique el proyecto y confirmo que:
- La autenticacion basada en roles ya existe y funciona correctamente (user_roles table)
- El patron de edge functions esta establecido
- Los secrets OPENAI_API_KEY y LOVABLE_API_KEY estan configurados
- Solo falta agregar los secrets de OpenProvider

---

## 1. Esquema de Base de Datos

### Tabla `domain_opportunities`

```text
+------------------------+-------------------+----------------------------------+
| Campo                  | Tipo              | Descripcion                      |
+------------------------+-------------------+----------------------------------+
| id                     | uuid PK           | Identificador unico              |
| domain_name            | text NOT NULL     | Nombre del dominio               |
| tld                    | text              | Extension (.cl, .com, etc)       |
| source                 | text              | Origen (expiring, deleted, manual)|
| source_url             | text              | URL donde se detecto             |
| expiration_date        | timestamptz       | Fecha de expiracion              |
| status                 | enum              | Estado del dominio               |
| ai_score               | decimal(3,1)      | Puntuacion IA (0-10)             |
| ai_category            | text              | Categoria detectada              |
| ai_rationale           | text              | Explicacion de la IA             |
| estimated_value        | integer           | Valor estimado en CLP            |
| detected_at            | timestamptz       | Cuando se detecto                |
| analyzed_at            | timestamptz       | Cuando se analizo                |
| created_at             | timestamptz       | Fecha creacion                   |
| updated_at             | timestamptz       | Ultima actualizacion             |
+------------------------+-------------------+----------------------------------+

Enum domain_opportunity_status:
- pending_analysis
- analyzed
- discarded
- queued_for_buy
- purchased
- failed
```

### Tabla `my_domain_portfolio`

```text
+------------------------+-------------------+----------------------------------+
| Campo                  | Tipo              | Descripcion                      |
+------------------------+-------------------+----------------------------------+
| id                     | uuid PK           | Identificador unico              |
| domain_name            | text NOT NULL     | Nombre completo del dominio      |
| tld                    | text              | Extension                        |
| purchase_date          | timestamptz       | Fecha de compra                  |
| purchase_price         | integer           | Precio pagado (CLP)              |
| purchase_source        | text              | Donde se compro                  |
| purchase_reference     | text              | ID de la transaccion             |
| renewal_date           | timestamptz       | Proxima renovacion               |
| annual_cost            | integer           | Costo anual (CLP)                |
| listing_price          | integer           | Precio de venta (CLP)            |
| is_for_sale            | boolean           | Disponible para venta            |
| sale_status            | enum              | Estado de venta                  |
| page_views             | integer           | Visitas a la pagina              |
| inquiries_count        | integer           | Numero de consultas              |
| notes                  | text              | Notas internas                   |
| created_at             | timestamptz       | Fecha creacion                   |
| updated_at             | timestamptz       | Ultima actualizacion             |
+------------------------+-------------------+----------------------------------+

Enum domain_sale_status:
- available
- negotiating
- sold
- not_for_sale
```

### Tabla `domain_inquiries`

```text
+------------------------+-------------------+----------------------------------+
| Campo                  | Tipo              | Descripcion                      |
+------------------------+-------------------+----------------------------------+
| id                     | uuid PK           | Identificador unico              |
| domain_id              | uuid FK           | Referencia a my_domain_portfolio |
| name                   | text              | Nombre del interesado            |
| email                  | text              | Email de contacto                |
| phone                  | text              | Telefono (opcional)              |
| offer_amount           | integer           | Monto ofrecido (CLP)             |
| message                | text              | Mensaje del interesado           |
| status                 | enum              | Estado de la consulta            |
| created_at             | timestamptz       | Fecha de consulta                |
| updated_at             | timestamptz       | Ultima actualizacion             |
+------------------------+-------------------+----------------------------------+

Enum inquiry_status:
- new
- contacted
- negotiating
- closed
- rejected
```

### Tabla `domain_sniper_settings`

```text
+------------------------+-------------------+----------------------------------+
| Campo                  | Tipo              | Descripcion                      |
+------------------------+-------------------+----------------------------------+
| id                     | uuid PK           | Identificador unico              |
| auto_sniper_enabled    | boolean           | Modo automatico activado         |
| min_score_auto_buy     | decimal           | Score minimo para auto-compra    |
| daily_budget           | integer           | Presupuesto diario (CLP)         |
| max_domain_price       | integer           | Precio maximo por dominio        |
| notify_email           | text              | Email para notificaciones        |
| updated_at             | timestamptz       | Ultima actualizacion             |
+------------------------+-------------------+----------------------------------+
```

### Politicas RLS

```text
domain_opportunities:
- SELECT: Solo admin (has_role(auth.uid(), 'admin'))
- ALL: Solo admin

my_domain_portfolio:
- SELECT para is_for_sale=true: Publico (sin auth)
- SELECT completo: Solo admin
- INSERT/UPDATE/DELETE: Solo admin

domain_inquiries:
- INSERT: Publico (para formularios de contacto)
- SELECT/UPDATE: Solo admin

domain_sniper_settings:
- ALL: Solo admin
```

---

## 2. Edge Functions

### 2.1 `analyze-domain-potential`

```text
Endpoint: POST /functions/v1/analyze-domain-potential
Auth: Solo admin (via JWT)

Request:
{
  "domain_name": "ejemplo.cl",
  "force_refresh": false
}

Proceso:
1. Verificar cache (si ya fue analizado en ultimos 7 dias)
2. Llamar a Lovable AI Gateway con prompt especializado
3. Guardar resultado en domain_opportunities
4. Retornar analisis

Response:
{
  "success": true,
  "domain_name": "ejemplo.cl",
  "score": 8.5,
  "category": "comercial",
  "rationale": "Dominio corto, facil de recordar...",
  "estimated_value": 150000
}

Prompt para IA:
"Evalua el dominio '{domain}' para el mercado chileno/latino.
Considera: longitud (menor es mejor), recordacion, 
palabras clave comerciales, potencial de marca, 
SEO friendliness, y tendencias del mercado.
Devuelve JSON: { score: 0-10, category: string, reason: string, 
estimated_value_clp: number }"
```

### 2.2 `openprovider-domain-check`

```text
Endpoint: POST /functions/v1/openprovider-domain-check
Auth: Solo admin

Request:
{
  "domain": "ejemplo",
  "extension": "cl"
}

Proceso:
1. Autenticarse con OpenProvider API
2. Consultar disponibilidad
3. Obtener precio actual

Response:
{
  "available": true,
  "price": 12500,
  "currency": "CLP",
  "premium": false
}
```

### 2.3 `openprovider-domain-purchase`

```text
Endpoint: POST /functions/v1/openprovider-domain-purchase
Auth: Solo admin

Request:
{
  "domain": "ejemplo",
  "extension": "cl",
  "contact_data": {
    "owner": {...},
    "admin": {...}
  }
}

Proceso:
1. Autenticarse con OpenProvider
2. Verificar disponibilidad final
3. Ejecutar compra
4. Insertar en my_domain_portfolio
5. Actualizar domain_opportunities.status = 'purchased'
6. Enviar notificacion (opcional)

Response:
{
  "success": true,
  "order_id": "OP-12345",
  "domain_name": "ejemplo.cl",
  "price_paid": 12500
}
```

---

## 3. UI Administrativa

### Ruta: `/admin/domain-sniper`

```text
Estructura de la pagina:

+----------------------------------------------------------+
|  Navbar                                                   |
+----------------------------------------------------------+
|                                                           |
|  [Radar] [Tabs]  [Mi Cartera]  [Consultas]  [Config]     |
|                                                           |
|  +-----------------------------------------------------+  |
|  |  SECCION ACTIVA                                     |  |
|  |                                                     |  |
|  |  Tab "Radar de Oportunidades":                      |  |
|  |  - Stats cards (Total, Pendientes, Score>8, etc)    |  |
|  |  - Toggle "Auto-Sniper Mode" con confirmacion       |  |
|  |  - DataTable con dominios                           |  |
|  |    Columnas: Dominio, TLD, Score(color), Status,    |  |
|  |              Valor Est., Acciones                   |  |
|  |  - Acciones: Analizar, Ver, Comprar, Descartar      |  |
|  |                                                     |  |
|  |  Tab "Mi Cartera":                                  |  |
|  |  - Lista de dominios comprados                      |  |
|  |  - Edicion inline de listing_price                  |  |
|  |  - Toggle is_for_sale                               |  |
|  |  - Stats de views e inquiries                       |  |
|  |                                                     |  |
|  |  Tab "Consultas":                                   |  |
|  |  - Lista de domain_inquiries                        |  |
|  |  - Filtros por status                               |  |
|  |  - Acciones: Contactar, Cerrar, Rechazar            |  |
|  |                                                     |  |
|  |  Tab "Configuracion":                               |  |
|  |  - Auto-Sniper settings                             |  |
|  |  - Limites de presupuesto                           |  |
|  |  - Notificaciones                                   |  |
|  +-----------------------------------------------------+  |
|                                                           |
+----------------------------------------------------------+
|  Footer                                                   |
+----------------------------------------------------------+
```

### Componentes a crear:

```text
src/pages/admin/DomainSniper.tsx          - Pagina principal con tabs
src/components/domain-sniper/
  ├── OpportunitiesTable.tsx              - DataTable de oportunidades
  ├── OpportunityCard.tsx                 - Card para mobile
  ├── PortfolioList.tsx                   - Lista de mi cartera
  ├── PortfolioDomainCard.tsx             - Card editable
  ├── InquiriesList.tsx                   - Lista de consultas
  ├── SniperSettings.tsx                  - Configuracion
  ├── AnalyzeButton.tsx                   - Boton con loading
  ├── PurchaseDialog.tsx                  - Modal de confirmacion compra
  ├── ScoreBadge.tsx                      - Badge con color segun score
  └── AutoSniperToggle.tsx                - Switch con confirmacion
```

### Logica de colores para AI Score:

```text
Score 0-4.9:   Rojo     (bg-red-100 text-red-800)
Score 5-7.9:   Amarillo (bg-yellow-100 text-yellow-800)
Score 8-10:    Verde    (bg-green-100 text-green-800)
```

---

## 4. Marketplace Publico

### Ruta: `/dominios-premium`

```text
+----------------------------------------------------------+
|  Navbar                                                   |
+----------------------------------------------------------+
|                                                           |
|  HERO SECTION                                             |
|  "Dominios Premium para tu Negocio"                       |
|  "Encuentra el nombre perfecto para tu marca"             |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|  FILTROS                                                  |
|  [TLD: Todos | .cl | .com]  [Precio: $-$$$]  [Buscar]    |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|  GRID DE DOMINIOS                                         |
|  +------------+  +------------+  +------------+           |
|  | ejemplo.cl |  | tienda.cl  |  | marca.com  |           |
|  | $150.000   |  | $280.000   |  | $95.000    |           |
|  | [Ofertar]  |  | [Ofertar]  |  | [Ofertar]  |           |
|  +------------+  +------------+  +------------+           |
|                                                           |
|  +------------+  +------------+  +------------+           |
|  | negocio.cl |  | app.cl     |  | web.com    |           |
|  | $180.000   |  | $320.000   |  | $75.000    |           |
|  | [Ofertar]  |  | [Ofertar]  |  | [Ofertar]  |           |
|  +------------+  +------------+  +------------+           |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|  FAQ                                                      |
|  - Como comprar un dominio?                               |
|  - Que incluye la compra?                                 |
|  - Como se transfiere?                                    |
|                                                           |
+----------------------------------------------------------+
|  Footer                                                   |
+----------------------------------------------------------+
```

### Componentes a crear:

```text
src/pages/DominiosPremium.tsx             - Pagina publica
src/components/domain-marketplace/
  ├── DomainHero.tsx                      - Hero section
  ├── DomainFilters.tsx                   - Filtros
  ├── DomainGrid.tsx                      - Grid de tarjetas
  ├── DomainCard.tsx                      - Tarjeta de dominio
  ├── InquiryDialog.tsx                   - Modal de contacto/oferta
  └── MarketplaceFAQ.tsx                  - FAQ section
```

---

## 5. Integracion con Rutas Existentes

### Actualizaciones a App.tsx:

```text
Nuevas rutas a agregar:

/admin/domain-sniper   → DomainSniper (ProtectedRoute: admin)
/dominios-premium      → DominiosPremium (Publica)
```

### Actualizaciones al Admin Dashboard:

```text
Agregar nueva card:
- Icono: Crosshair o Radar
- Titulo: "Domain Sniper"
- Stats: Dominios en radar, Comprados, Pendientes
- Boton: "Ver Panel"
```

---

## 6. Secretos Requeridos

Tu ya tienes configurados:
- OPENAI_API_KEY (existe)
- LOVABLE_API_KEY (existe, lo usaremos para el analisis)

Necesitas agregar manualmente en Supabase:
- OPENPROVIDER_USERNAME
- OPENPROVIDER_PASSWORD

---

## 7. Flujo de Implementacion

### Fase 1: Base de Datos
- Crear migration con las 4 tablas
- Configurar enums
- Establecer politicas RLS
- Agregar indices para busquedas

### Fase 2: Edge Functions
- Crear analyze-domain-potential (usando Lovable AI)
- Crear openprovider-domain-check
- Crear openprovider-domain-purchase
- Actualizar config.toml

### Fase 3: UI Admin
- Crear pagina DomainSniper con tabs
- Implementar tabla de oportunidades
- Implementar gestion de cartera
- Implementar gestion de consultas
- Agregar al dashboard admin

### Fase 4: Marketplace Publico
- Crear pagina DominiosPremium
- Implementar grid de dominios
- Crear formulario de contacto/oferta
- SEO y meta tags

### Fase 5: Integracion Final
- Agregar rutas a App.tsx
- Testing end-to-end
- Ajustes de UI/UX

---

## 8. Archivos a Crear/Modificar

```text
CREAR:
├── supabase/migrations/XXXXX_domain_sniper_tables.sql
├── supabase/functions/analyze-domain-potential/index.ts
├── supabase/functions/openprovider-domain-check/index.ts
├── supabase/functions/openprovider-domain-purchase/index.ts
├── src/pages/admin/DomainSniper.tsx
├── src/pages/DominiosPremium.tsx
├── src/components/domain-sniper/OpportunitiesTable.tsx
├── src/components/domain-sniper/PortfolioList.tsx
├── src/components/domain-sniper/InquiriesList.tsx
├── src/components/domain-sniper/SniperSettings.tsx
├── src/components/domain-sniper/ScoreBadge.tsx
├── src/components/domain-sniper/AutoSniperToggle.tsx
├── src/components/domain-sniper/AnalyzeButton.tsx
├── src/components/domain-sniper/PurchaseDialog.tsx
├── src/components/domain-marketplace/DomainCard.tsx
├── src/components/domain-marketplace/DomainGrid.tsx
├── src/components/domain-marketplace/InquiryDialog.tsx
├── src/components/domain-marketplace/MarketplaceFAQ.tsx

MODIFICAR:
├── supabase/config.toml (agregar nuevas functions)
├── src/App.tsx (agregar rutas)
├── src/pages/admin/Dashboard.tsx (agregar card Domain Sniper)
├── src/integrations/supabase/types.ts (se actualiza automaticamente)
```

---

## Consideraciones de Seguridad

1. **Auto-Sniper Mode**: Implementare doble confirmacion con modal que requiere escribir "CONFIRMAR" para activar
2. **Limites de Gasto**: Validacion tanto en frontend como en edge function
3. **RLS estricto**: Solo admin puede ver/modificar datos sensibles
4. **Rate Limiting**: Implementar en edge functions para evitar abusos de API
5. **Auditoria**: Registrar todas las compras y cambios de configuracion

---

## Proximos Pasos Manuales (Post-Implementacion)

1. **Agregar Secrets de OpenProvider** en Supabase Dashboard
2. **Configurar Cron Job** para scraping automatico (opcional)
3. **Poblar datos iniciales** de dominios a monitorear
