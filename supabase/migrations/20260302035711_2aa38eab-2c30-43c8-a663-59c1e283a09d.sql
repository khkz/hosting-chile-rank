
-- Sprint 1: Add ranking-specific columns to hosting_companies
ALTER TABLE public.hosting_companies
  ADD COLUMN IF NOT EXISTS ranking_position integer,
  ADD COLUMN IF NOT EXISTS is_recommended boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ranking_features text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ranking_badges text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS cta_text text,
  ADD COLUMN IF NOT EXISTS cta_micro_copy text,
  ADD COLUMN IF NOT EXISTS button_color text,
  ADD COLUMN IF NOT EXISTS border_color text,
  ADD COLUMN IF NOT EXISTS display_name_first text,
  ADD COLUMN IF NOT EXISTS display_name_second text,
  ADD COLUMN IF NOT EXISTS display_name_first_color text,
  ADD COLUMN IF NOT EXISTS display_name_second_color text,
  ADD COLUMN IF NOT EXISTS promo_price integer,
  ADD COLUMN IF NOT EXISTS original_price integer,
  ADD COLUMN IF NOT EXISTS price_period text NOT NULL DEFAULT 'mensual';

-- Index for fast ranking queries
CREATE INDEX IF NOT EXISTS idx_hosting_companies_ranking
  ON public.hosting_companies (ranking_position)
  WHERE ranking_position IS NOT NULL;

-- Seed ranking data for HostingPlus (position 1)
UPDATE public.hosting_companies SET
  ranking_position = 1,
  is_recommended = true,
  ranking_features = ARRAY[
    'Carga más rápida en Chile (servidores en Santiago)',
    'Tu sitio protegido 24/7 (bloqueo automático de ataques)',
    'Recupera tu web con un clic (backups automáticos)',
    'Email que llega sin ir a spam (SPF, DKIM y DMARC)'
  ],
  ranking_badges = ARRAY['Más Popular', 'Hecho en Chile', '0 Reclamos'],
  cta_text = 'Probar 30 días gratis',
  cta_micro_copy = '✓ Sin tarjeta ✓ Cancela cuando quieras',
  button_color = 'bg-gradient-to-r from-[#EF233C] to-[#c41e3a]',
  border_color = 'border-[#EF233C]',
  display_name_first = 'Hosting',
  display_name_second = 'Plus',
  display_name_first_color = 'text-[#2B2D42]',
  display_name_second_color = 'text-[#EF233C]',
  promo_price = 3469,
  original_price = 19900,
  price_period = 'mensual',
  overall_rating = 9.9,
  speed_rating = 9.8,
  price_rating = 9.5
WHERE id = '686b3797-f991-4c6e-953b-cf916131612b';

-- Seed ranking data for EcoHosting (position 2)
UPDATE public.hosting_companies SET
  ranking_position = 2,
  is_recommended = false,
  ranking_features = ARRAY[
    'Servidores en Chile, energía 100% renovable',
    'MagicSpam y backups JetBackup incluidos',
    'Soporte local 24/7',
    'Dominio .CL gratis 1 año'
  ],
  ranking_badges = ARRAY['Eco-Friendly', 'Mejor Precio'],
  cta_text = 'Ver planes desde $1.658/mes',
  cta_micro_copy = '✓ Dominio .CL gratis',
  button_color = 'bg-gradient-to-r from-green-600 to-green-700',
  border_color = 'border-green-200',
  display_name_first = 'Eco',
  display_name_second = 'Hosting',
  display_name_first_color = 'text-green-600',
  display_name_second_color = 'text-[#2B2D42]',
  promo_price = 1658,
  original_price = 4990,
  price_period = 'mensual',
  overall_rating = 9.6,
  speed_rating = 9.6,
  price_rating = 9.7
WHERE id = 'e80631ea-8f21-4fca-b468-e0f1f010a54b';

-- Seed ranking data for HostGator (position 3)
UPDATE public.hosting_companies SET
  ranking_position = 3,
  is_recommended = false,
  ranking_features = ARRAY[
    '12 años de experiencia en Chile',
    'Panel de control personalizado',
    'Soporte técnico por chat y teléfono',
    'Garantía de uptime 99.9%'
  ],
  ranking_badges = ARRAY['Experiencia', 'Confiable'],
  cta_text = 'Migración gratis incluida',
  cta_micro_copy = '✓ 99.9% uptime garantizado',
  button_color = 'bg-gradient-to-r from-orange-500 to-orange-600',
  border_color = 'border-orange-200',
  display_name_first = 'Host',
  display_name_second = 'Gator',
  display_name_first_color = 'text-orange-500',
  display_name_second_color = 'text-[#2B2D42]',
  promo_price = 3490,
  original_price = NULL,
  price_period = 'mensual',
  overall_rating = 9.2,
  speed_rating = 8.9,
  price_rating = 9.4
WHERE id = 'b21e1acc-8073-4f24-9ed4-678921afad2c';
