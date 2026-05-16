# SEO Audit Report — Sistema completo

Vamos a montar el producto en **3 entregas** para que cada parte se pueda probar antes de pasar a la siguiente. Esta es la entrega completa propuesta.

---

## Entrega 1 — Landing de venta + base de datos + mini-audit gratis

Objetivo: tener una página que venda, capture interés y demuestre valor real con un análisis instantáneo gratis (gancho).

### Página `/seo-audit`

- **Hero**: "Auditoría SEO Profesional con datos reales de Google" + barra para ingresar un dominio (genera un mini-audit gratis al vuelo).
- **Mini-audit en vivo** (gratis, sin login): velocidad PageSpeed real, SSL, meta tags, indexabilidad, 5 keywords top con datos de DataForSEO. Sirve como demo del producto.
- **Sección "Qué incluye el informe completo"**: 40+ checks (técnico, on-page, backlinks, keywords, competidores, SERP, contenido, mobile, Core Web Vitals, schema, internacionalización).
- **Ejemplo de informe** (preview con blur / 3 páginas de muestra descargables).
- **Planes de suscripción**:
  - **Starter** $19.990/mes — 1 dominio, audit mensual, 50 keywords trackeadas.
  - **Pro** $49.990/mes — 5 dominios, audit semanal, 500 keywords, monitoreo competidores.
  - **Agency** $149.990/mes — 25 dominios, audit diario, 5.000 keywords, white-label PDF, API.
- **Garantía 14 días**, FAQ, testimonios, comparativa "Hazlo tú vs Contrátanos".
- **Schema.org** Product + Offer + FAQPage + AggregateRating para Rich Results.

### Base de datos (Supabase)

```text
seo_audit_subscriptions  → plan, status, dominios contratados, paddle/stripe_id
seo_audit_domains        → dominios bajo monitoreo por suscripción
seo_audits               → cada informe generado (status, scores, JSON con todo)
seo_audit_keywords       → ranking histórico por keyword/dominio
seo_audit_backlinks      → snapshot de backlinks
seo_audit_competitors    → competidores detectados y comparativa
seo_audit_issues         → errores detectados, severidad, recomendación
```

Todas con RLS: usuario solo ve sus dominios; admin ve todo.

---

## Entrega 2 — Generación automática con DataForSEO

### Cómo se sacan los datos de las SERPs

DataForSEO ofrece estos endpoints (todos los usaremos vía edge function):

| Dato | Endpoint DataForSEO | Costo aprox |
|---|---|---|
| SERP de Google | `serp/google/organic/live/advanced` | $0.002 / query |
| Volumen de keywords + dificultad | `keywords_data/google/search_volume/live` | $0.05 / 1000 kw |
| Keywords por las que rankea un dominio | `dataforseo_labs/google/ranked_keywords/live` | $0.01 / consulta |
| Backlinks | `backlinks/summary/live` + `backlinks/backlinks/live` | $0.02 / dominio |
| Competidores | `dataforseo_labs/google/competitors_domain/live` | $0.02 |
| On-page (crawl técnico) | `on_page/task_post` + `on_page/summary` | $0.0006 / página |
| Core Web Vitals reales | `on_page/lighthouse/live` | $0.003 / página |

**Costo por informe completo Pro estimado: ~$0.50 USD**. Vendido a ~$49.990/mes = margen >95%.

### Edge functions a crear

1. **`seo-audit-mini`** (pública, rate-limited 10/IP/día) — corre PageSpeed + scraping HEAD + DataForSEO `ranked_keywords` con limit 5. Devuelve JSON para la landing.
2. **`seo-audit-full`** (autenticada) — orquesta llamadas a DataForSEO en paralelo, guarda en `seo_audits`, calcula score 0-100, genera lista de issues priorizados.
3. **`seo-audit-pdf`** — genera PDF con branding Elige Tu Hosting usando `@react-pdf/renderer` server-side.
4. **`seo-audit-cron`** — cron diario/semanal/mensual que re-corre audits según plan del usuario.
5. **`seo-audit-webhook-paddle`** — recibe eventos de suscripción y activa/desactiva acceso.

### Algoritmo de scoring (transparente, publicado)

```text
Score Total = 0.30·Técnico + 0.25·Contenido + 0.20·Backlinks + 0.15·UX + 0.10·SERP
```

Cada subscore tiene su rúbrica documentada en `/seo-audit/metodologia` (E-E-A-T).

---

## Entrega 3 — Dashboard privado + Pagos

### `/dashboard/seo` (requiere login)

- Lista de dominios monitoreados con score actual y tendencia.
- Detalle por dominio: tabs **Resumen / Issues / Keywords / Backlinks / Competidores / Histórico / PDF**.
- Filtros, exportación CSV/PDF.
- Alertas por email cuando baja un ranking importante o aparece un issue crítico.

### Admin `/admin/seo-audits`

- Ver todas las suscripciones, forzar re-audit, ver costo DataForSEO consumido, white-label settings.

### Pagos

Suscripción mensual recurrente. Recomiendo **Paddle** (merchant of record, maneja IVA chileno y boletas automáticamente) — pero corremos `recommend_payment_provider` para confirmar.

---

## Detalles técnicos

- **DataForSEO**: requiere `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` (Basic Auth). Endpoint base `https://api.dataforseo.com/v3/`. Hay que crear cuenta en dataforseo.com y cargar saldo (mínimo $50).
- **PDF**: `npm:@react-pdf/renderer` corre en Deno con shim, o usamos servicio puppeteer headless. Definimos en entrega 2.
- **Rate limiting** del mini-audit: tabla `seo_audit_rate_limit` por IP hash.
- **Auth ya existe** en el proyecto (Supabase Auth + tabla `profiles`).
- **Roles**: usamos la tabla `user_roles` ya existente; añadimos rol `seo_subscriber` y verificación vía `has_role()`.
- **Seguridad**: claves de DataForSEO solo en edge functions, nunca en frontend. RLS estricta. Sin SQL dinámico.

---

## ¿Por dónde arrancamos?

Propongo empezar por **Entrega 1** completa (landing + DB + mini-audit funcionando con DataForSEO real). Eso ya te permite empezar a captar leads esta semana. Las entregas 2 y 3 las hacemos a continuación.

Para arrancar necesito:
1. Que confirmes el plan.
2. Crear cuenta en **dataforseo.com**, cargar saldo, y darme `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` cuando te los pida (los guardo como secretos, nunca van al frontend).
3. Confirmar precios finales de los 3 planes (o usar los que propongo).

¿Avanzamos con Entrega 1?
