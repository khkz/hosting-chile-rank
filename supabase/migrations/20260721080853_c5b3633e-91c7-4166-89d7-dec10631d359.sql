UPDATE public.hosting_companies
SET
  datacenter_location = 'GTD Lima, Perú — Tier III certificado (hosting web). Dedicados opcionales: Hivelocity, Tampa, FL (EE.UU.). Respaldo regional del grupo: Ascenty Santiago (Tier III). Google Cloud Partner con instancias en São Paulo.',
  technologies = ARRAY['cPanel','LiteSpeed Enterprise','NVMe RAID 10','VPS','Servidores Dedicados','Anti-DDoS']::text[],
  contact_phone = '(01) 640 9409',
  updated_at = now()
WHERE slug = 'hostingplus-pe';