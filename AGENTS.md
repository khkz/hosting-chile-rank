# Reglas técnicas del proyecto

- Las edge functions administrativas reutilizan `supabase/functions/_shared/security.ts`: validan JWT y rol `admin` con `service_role`, y solo los procesos internos pueden usar `x-service-secret` contra `ADMIN_SECRET_KEY`.
- Las edge functions públicas con consumo externo reutilizan el rate limit por IP de `_shared/security.ts`, para evitar controles divergentes.
- Los tokens de verificación de reclamos solo se entregan por correo y nunca aparecen en respuestas JSON.
- El ranking expone sus consultas React Query desde `src/features/ranking/index.ts`; páginas y componentes no acceden directamente a Supabase.