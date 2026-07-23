-- a) RLS on (idempotent)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- b) Reemplazar la política INSERT existente por la versión canónica con el nombre estándar
DROP POLICY IF EXISTS "Users can insert their own non-admin role" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_self_limited" ON public.user_roles;
CREATE POLICY "user_roles_insert_self_limited" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND role IN ('user','hosting_provider'));

-- c) UPDATE: no existe ninguna política UPDATE para authenticated/anon (solo la ALL de admins vía has_role). No se elimina nada.

-- d) Unicidad: Paso 1 no devolvió duplicados → seguro crear el índice único
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_id_key ON public.user_roles(user_id);