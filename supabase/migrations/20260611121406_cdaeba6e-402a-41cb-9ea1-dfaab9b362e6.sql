
-- Ajustar notas y features clave para puestos 4-10 del ranking
UPDATE public.hosting_companies SET overall_rating = 8.4,
  ranking_features = ARRAY['Datacenter local + soporte 24/7 en español'],
  ranking_badges = COALESCE(NULLIF(ranking_badges, '{}'), ARRAY['Soporte 24/7'])
WHERE slug = 'hostgator';

UPDATE public.hosting_companies SET overall_rating = 8.3,
  ranking_features = ARRAY['Planes desde básico hasta empresa con cPanel'],
  ranking_badges = COALESCE(NULLIF(ranking_badges, '{}'), ARRAY['cPanel'])
WHERE slug = 'bluehost';

UPDATE public.hosting_companies SET overall_rating = 8.2,
  ranking_features = ARRAY['Hosting cloud escalable con balanceo'],
  ranking_badges = COALESCE(NULLIF(ranking_badges, '{}'), ARRAY['Cloud'])
WHERE slug = 'cloudhosting';

UPDATE public.hosting_companies SET overall_rating = 8.1,
  ranking_features = ARRAY['SSD NVMe y datacenter en Las Condes'],
  ranking_badges = COALESCE(NULLIF(ranking_badges, '{}'), ARRAY['SSD NVMe'])
WHERE slug = '1hosting-cl';

UPDATE public.hosting_companies SET overall_rating = 8.0,
  ranking_features = ARRAY['Planes completos con migración gratis'],
  ranking_badges = COALESCE(NULLIF(ranking_badges, '{}'), ARRAY['Migración gratis'])
WHERE slug = 'fullhosting';

UPDATE public.hosting_companies SET overall_rating = 7.9,
  ranking_features = ARRAY['Hosting económico orientado a pymes'],
  ranking_badges = COALESCE(NULLIF(ranking_badges, '{}'), ARRAY['Económico'])
WHERE slug = 'prohosting';

-- HN.cl: activar como verificado/curado para que aparezca en el ranking
UPDATE public.hosting_companies SET
  name = 'HN.cl',
  overall_rating = 7.8,
  is_verified = true,
  is_curated = true,
  promo_price = NULL,
  ranking_features = ARRAY['Hosting SSD con datacenter en Chile y soporte en español'],
  ranking_badges = ARRAY['Datacenter Chile']
WHERE slug = 'hn';

-- Asegurar que Hosting.cl no aparezca en el ranking del home (solo catálogo)
UPDATE public.hosting_companies SET ranking_position = NULL
WHERE slug IN ('hostingcl','hosting-cl');
