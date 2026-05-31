UPDATE public.hosting_companies SET logo_url = '/logo-bluehost.svg' WHERE slug = 'bluehost';
UPDATE public.hosting_companies SET logo_url = '/logo-1hosting.svg' WHERE slug = '1hosting-cl';
UPDATE public.hosting_companies SET logo_url = NULL WHERE slug IN ('powerhost','inc-cl');