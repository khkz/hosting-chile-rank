# Pasar formularios de simulación a producción

## Resumen del audit de simulaciones

| Lugar | Estado actual | Acción |
|---|---|---|
| `/vota-hosting` (form reseñas) | `setTimeout(1500)` + arreglo local en memoria | ✅ Conectar a BD + email admin |
| `/contacto` (form contacto) | `setTimeout(1500)` sin persistencia ni envío | ✅ Crear tabla + emails |
| `Blog.tsx` / `BlogPost.tsx` | 6 posts hardcodeados (curados) | ⏭️ Mantener (decisión usuario) |
| `MethodologySection.tsx` "Simulamos TCP…" | Texto explicativo de metodología | ⏭️ No cambiar (es copy real) |
| `VsComparison.tsx` "whyFake" | Texto descriptivo de comparadores falsos | ⏭️ No cambiar (es contenido) |
| `BatchAnalyzePanel` (admin) | Funcional real, solo el nombre confunde | ⏭️ Sin acción |

## 1. Email: integración con Resend

Para enviar emails a **khkzulox@gmail.com** desde edge functions, usaremos el connector **Resend** (vía connector-gateway de Lovable). Necesitaremos que conectes tu cuenta Resend y verifiques un dominio remitente (o usaremos `onboarding@resend.dev` para empezar a probar).

- Secret requerido: `RESEND_API_KEY` (lo pides en Resend → API Keys)
- From inicial: `Elige Tu Hosting <onboarding@resend.dev>` (cambia a `noreply@eligetuhosting.cl` cuando verifiques el dominio en Resend)

## 2. Vota Hosting → producción

### Backend
- **Tabla**: ya existe `hosting_reviews` con `status = 'pending'` por defecto y RLS correcta.
- Migración menor: relajar el constraint `user_id NOT NULL` → permitir reseñas anónimas con email de verificación, o exigir login. **Decisión técnica**: mantener `user_id NOT NULL` y exigir sesión (redirigir a `/auth` si no hay sesión) — es la forma más segura y ya hay AuthProvider.
- **Edge function** `submit-review`:
  1. Valida payload con Zod
  2. Inserta en `hosting_reviews` con `status='pending'`, `is_verified_customer=false`
  3. Envía email a `khkzulox@gmail.com` vía Resend con link a `/admin/review-moderation`

### Frontend (`VotaHosting.tsx`)
- Reemplazar `setTimeout` por `supabase.functions.invoke('submit-review', ...)`
- Si no hay sesión → mostrar CTA "Inicia sesión para dejar tu reseña" → `/auth`
- Quitar la simulación de "agregar reseña a la lista local" (las aprobadas vendrán de BD vía `PublicReviewsList`)
- Mostrar mensaje: "Tu reseña fue enviada y será revisada antes de publicarse"

## 3. Contacto → producción

### Backend
- **Nueva tabla** `contact_submissions`:
  - `id, name, email, subject, message, status (new|read|replied), ip_hash, created_at, updated_at`
  - RLS: solo admins SELECT/UPDATE; INSERT público (con rate-limit en la edge function)
  - GRANT: `INSERT` a anon, `ALL` a service_role, `SELECT/UPDATE` a authenticated (verificado por policy admin)
- **Edge function** `submit-contact`:
  1. Valida con Zod (name 1-100, email válido, message 10-2000)
  2. Hash IP para rate-limit (3 envíos/hora)
  3. Inserta en `contact_submissions`
  4. Envía **2 emails** vía Resend:
     - A `khkzulox@gmail.com`: "Nuevo mensaje de contacto" con datos
     - Al usuario: auto-respuesta "Recibimos tu mensaje, te responderemos en 24-48h"

### Frontend (`Contacto.tsx`)
- Reemplazar `setTimeout` por `supabase.functions.invoke('submit-contact', ...)`
- Mantener toast de éxito

## 4. Panel admin para mensajes de contacto (opcional rápido)

Pequeña página `/admin/contact-messages` para listar `contact_submissions` y marcar como leídos. Si prefieres revisar solo por email, lo dejamos para después.

## Detalles técnicos

```text
Archivos nuevos:
  supabase/functions/submit-review/index.ts
  supabase/functions/submit-contact/index.ts
  src/pages/admin/ContactMessages.tsx (opcional)

Archivos editados:
  src/pages/VotaHosting.tsx          (quitar setTimeout, invoke edge function, gating auth)
  src/pages/Contacto.tsx             (quitar setTimeout, invoke edge function)
  supabase/config.toml                (verify_jwt = false en ambas funciones)
  src/App.tsx                         (ruta admin/contact-messages si lo incluimos)

Migraciones:
  - CREATE TABLE contact_submissions + RLS + GRANTs
```

## Lo que necesito de ti antes de implementar

1. **Cuenta Resend**: ¿tienes una? Si no, créala gratis en resend.com (3000 emails/mes free). Luego me das el `RESEND_API_KEY` cuando te lo pida el formulario seguro.
2. **¿Incluyo el panel `/admin/contact-messages`?** (sí/no — si no, los verás solo por email)
3. **¿Gating de auth en /vota-hosting?** Mi recomendación: SÍ (evita spam y permite trazabilidad). Alternativa: dejar anónimo con verificación por email (más complejo, +1 edge function).

Una vez confirmes estos 3 puntos, implemento todo de una sola pasada.