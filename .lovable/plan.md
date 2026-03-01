

## Problema

El batch audit del OSINT **sobreescribe directamente** los datos de `hosting_companies` sin paso de revisión. No hay forma de ver qué extrajo el scraper ni aprobar/rechazar antes de que se guarde. Además, el panel de Curación (`/admin/company-curation`) solo muestra campos básicos (descripción, website status) pero no los datos enriquecidos (teléfono, email, tecnologías, redes sociales, etc.).

## Plan

### 1. Agregar tabla `company_audit_log` para almacenar resultados sin aplicar

Crear una tabla que guarde los resultados crudos del batch OSINT como "pendientes de aprobación":

- `id`, `company_id` (FK), `scraped_data` (jsonb con todo lo extraído), `complaints_data` (jsonb), `status` (pending/approved/rejected), `reviewed_by`, `reviewed_at`, `created_at`
- RLS: solo admins pueden leer/escribir

### 2. Modificar `runBatchAudit` en OSINTScanner para NO escribir directo

En vez de hacer `update` a `hosting_companies`, insertar en `company_audit_log` con status `pending`. Así el batch solo recolecta datos sin modificar nada.

### 3. Crear panel de revisión de auditorías en CompanyCuration

Agregar una nueva pestaña o sección en `/admin/company-curation` que:

- Liste todos los registros `pending` de `company_audit_log` con el nombre de la empresa
- Muestre lado a lado: **datos actuales** vs **datos scrapeados** (descripción, teléfono, email, dirección, datacenter, tecnologías, redes sociales)
- Botón **"Aprobar"**: aplica los cambios a `hosting_companies` y marca el log como `approved`
- Botón **"Rechazar"**: marca como `rejected` sin cambiar nada
- Botón **"Aprobar parcial"**: permite seleccionar qué campos aplicar (checkboxes por campo)

### 4. Archivos a modificar/crear

- **Migración SQL**: crear tabla `company_audit_log`
- **`src/components/domain-sniper/OSINTScanner.tsx`**: cambiar `runBatchAudit` para insertar en `company_audit_log` en vez de actualizar `hosting_companies`
- **`src/pages/admin/CompanyCuration.tsx`**: agregar sección de revisión con vista diff y botones aprobar/rechazar
- **`src/integrations/supabase/types.ts`**: se actualiza automáticamente

### Detalle técnico

La tabla `company_audit_log` almacena el JSON completo del scraper (`scraped_data`) y del checker de quejas (`complaints_data`), lo que permite inspeccionar exactamente qué extrajo la IA antes de decidir. El flujo queda:

```text
Batch OSINT → company_audit_log (pending)
                    ↓
        Admin revisa en Curación
                    ↓
        Aprobar → UPDATE hosting_companies
        Rechazar → marcar rejected (sin cambios)
```

