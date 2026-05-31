UPDATE public.hosting_companies
SET 
  description = 'PowerHost / IxMetro opera como datacenter con ASN propio AS263237. Actualmente su oferta para usuarios está enfocada en VPS SSD; el resto son servicios de infraestructura para empresas (housing, cross connect, IXP). No vende hosting compartido tradicional.',
  ranking_features = ARRAY['Solo vende VPS SSD (no hosting compartido)', 'ASN propio AS263237', 'Datacenter propio en Santiago', 'Más de 20 años operando en Chile'],
  ranking_badges = ARRAY['Solo VPS', 'ASN propio'],
  overall_rating = 8.5
WHERE slug = 'powerhost';