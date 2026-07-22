-- Endurecer public.user_roles: evitar auto-elevación a admin y garantizar 1 rol por usuario.

-- Elimina política INSERT previa si existiese con el mismo nombre (idempotente)
DROP POLICY IF EXISTS "Users can insert their own non-admin role" ON public.user_roles;

-- Política INSERT restrictiva: solo el propio usuario, y solo user/hosting_provider
CREATE POLICY "Users can insert their own non-admin role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role IN ('user'::public.app_role, 'hosting_provider'::public.app_role)
);

-- Índice único por user_id (no hay duplicados)
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_id_unique ON public.user_roles(user_id);