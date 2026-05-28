
-- Insertar PowerHost/IxMetro como 3° del ranking y sacar a HostGator del Top
INSERT INTO public.hosting_companies (
  slug, name, website, legal_name, foundation_year, year_founded,
  is_verified, is_curated, is_independent, corporate_group,
  ranking_position, is_recommended,
  ranking_features, ranking_badges,
  cta_text, cta_micro_copy, button_color, border_color,
  display_name_first, display_name_second,
  promo_price, original_price, price_period,
  description, description_editorial,
  datacenter_location, technologies,
  has_ssl_free, has_migration_free, uptime_guarantee,
  site_type, logo_url
) VALUES (
  'powerhost',
  'PowerHost / IxMetro',
  'https://www.powerhost.cl/',
  'PowerHost SpA',
  2001,
  2001,
  true, true, true, NULL,
  3, false,
  ARRAY[
    'ASN propio AS263237',
    '4 datacenters propios (SCL, NY, MOW, AMS)',
    'Tier III',
    'Más de 20 años operando en Chile'
  ]::text[],
  ARRAY['ASN propio', 'Tier III']::text[],
  'Visitar PowerHost',
  'Sitio oficial',
  'bg-[#2B2D42]',
  'border-[#2B2D42]',
  'PowerHost', 'IxMetro',
  NULL, NULL, 'mensual',
  'PowerHost / IxMetro es un proveedor chileno con infraestructura propia (AS263237) y datacenters en Santiago, Nueva York, Moscú y Ámsterdam.',
  'Operador con red propia (AS263237) y cuatro datacenters Tier III. Más de 20 años en el mercado chileno con un único reclamo público no técnico documentado en el Estudio Hosting Chile 2026.',
  '4 DC propios (SCL, NY, MOW, AMS)',
  ARRAY['cPanel', 'DirectAdmin', 'Plesk', 'WAF']::text[],
  true, true, '99.9%',
  'hosting',
  'https://logo.clearbit.com/powerhost.cl'
);

-- Quitar HostGator del Top del home (no se elimina la ficha)
UPDATE public.hosting_companies
SET ranking_position = NULL,
    is_recommended = false
WHERE slug = 'hostgator';
