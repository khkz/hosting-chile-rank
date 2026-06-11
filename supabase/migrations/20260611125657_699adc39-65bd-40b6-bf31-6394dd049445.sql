
-- 1) HN.cl: completar datos faltantes con tono neutro
UPDATE public.hosting_companies
SET
  datacenter_location = 'Chile',
  year_founded = COALESCE(year_founded, 2010),
  corporate_group = COALESCE(corporate_group, 'Grupo Hostname'),
  description = 'HN.cl es una marca de hosting del Grupo Hostname enfocada en planes básicos para sitios personales y pequeños proyectos. Opera desde infraestructura local en Chile. Los planes y precios se consultan directamente con el proveedor.',
  description_editorial = 'Marca económica del Grupo Hostname con presencia en Chile. Cierra el Top 10 del ranking 2026 con datos limitados de transparencia técnica; recomendada para proyectos personales muy pequeños o para quienes ya operan dentro del ecosistema Hostname.'
WHERE slug = 'hn';

-- 2) Hosting.cl: descripción neutra (eliminar "líder")
UPDATE public.hosting_companies
SET
  description = 'Hosting.cl es una empresa de hosting fundada en 2000, perteneciente al Grupo Casamayor (mismo grupo que opera comparahosting.cl y otras marcas). Ofrece planes de hosting compartido, dominios y soluciones empresariales con datacenter en Chile.',
  description_editorial = 'Marca veterana del mercado chileno y parte del Grupo Casamayor, conglomerado que también opera el comparador comparahosting.cl. Catálogo amplio de planes, aunque la pertenencia al mismo grupo que un comparador "independiente" exige leer con cautela las recomendaciones cruzadas.'
WHERE slug = 'hostingcl';

-- 3) PlanetaHosting: descripción neutra (eliminar "líder")
UPDATE public.hosting_companies
SET
  description = 'PlanetaHosting.cl es un proveedor de hosting chileno fundado en 2008, perteneciente al Grupo Casamayor. Ofrece planes de hosting compartido, servidores VPS y dominios con infraestructura en Chile.',
  description_editorial = 'Proveedor con más de 15 años en el mercado, integrado al Grupo Casamayor (mismo grupo de Hosting.cl y comparahosting.cl). Catálogo estándar de hosting compartido y VPS; conviene contrastar reseñas externas dada la concentración corporativa del grupo.'
WHERE slug = 'planetahosting';

-- 4) Ajuste de notas para empresas FUERA del Top 10
UPDATE public.hosting_companies SET overall_rating = 7.7 WHERE slug = 'hostingcl';
UPDATE public.hosting_companies SET overall_rating = 7.6 WHERE slug = 'fasthosting';
UPDATE public.hosting_companies SET overall_rating = 7.5 WHERE slug = 'hosting24';
UPDATE public.hosting_companies SET overall_rating = 7.4 WHERE slug = 'planetahosting';
UPDATE public.hosting_companies SET overall_rating = 7.4 WHERE slug = 'inc-cl';
UPDATE public.hosting_companies SET overall_rating = 7.3 WHERE slug = 'webhosting';
UPDATE public.hosting_companies SET overall_rating = 7.2 WHERE slug = 'smarthost';
UPDATE public.hosting_companies SET overall_rating = 7.1 WHERE slug = 'godaddy';
UPDATE public.hosting_companies SET overall_rating = 7.0 WHERE slug = 'hostingchile';
