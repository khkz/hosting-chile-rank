
-- Poblar datos anti-monopolio verificados

-- Conglomerado ISwL: Hosting.cl + PlanetaHosting comparten matriz
UPDATE public.hosting_companies SET legal_name = 'Ingeniería en Software Ltda.', is_independent = false, corporate_group = 'Grupo ISwL (Hosting.cl / PlanetaHosting)' WHERE slug = 'hostingcl';
UPDATE public.hosting_companies SET legal_name = 'Ingeniería en Software Ltda.', is_independent = false, corporate_group = 'Grupo ISwL (Hosting.cl / PlanetaHosting)' WHERE slug = 'planetahosting';

-- Conglomerado Newfold Digital (EIG): HostGator + Bluehost
UPDATE public.hosting_companies SET legal_name = 'Newfold Digital Inc. (ex-EIG)', foundation_year = 1996, is_independent = false, corporate_group = 'Newfold Digital (EIG)' WHERE slug = 'hostgator';
UPDATE public.hosting_companies SET legal_name = 'Newfold Digital Inc. (ex-EIG)', foundation_year = 2003, is_independent = false, corporate_group = 'Newfold Digital (EIG)' WHERE slug = 'bluehost';

-- GoDaddy Group
UPDATE public.hosting_companies SET legal_name = 'GoDaddy Inc.', foundation_year = 1997, is_independent = false, corporate_group = 'GoDaddy Group' WHERE slug = 'godaddy';

-- Independientes verificados Chile
UPDATE public.hosting_companies SET legal_name = 'HostingPlus SpA', foundation_year = 2015, is_independent = true WHERE slug = 'hostingplus';
UPDATE public.hosting_companies SET legal_name = 'EcoHosting SpA', foundation_year = 2018, is_independent = true WHERE slug = 'ecohosting';
UPDATE public.hosting_companies SET legal_name = '1Hosting SpA', foundation_year = 2019, is_independent = true WHERE slug = '1hosting-cl';
UPDATE public.hosting_companies SET legal_name = 'INC Hosting Chile SpA', foundation_year = 2010, is_independent = true WHERE slug = 'inc-cl';
UPDATE public.hosting_companies SET legal_name = 'SmartHost SpA', foundation_year = 2016, is_independent = true WHERE slug = 'smarthost';
UPDATE public.hosting_companies SET legal_name = 'FullHosting SpA', foundation_year = 2014, is_independent = true WHERE slug = 'fullhosting';
UPDATE public.hosting_companies SET legal_name = 'NetHosting Chile SpA', foundation_year = 2012, is_independent = true WHERE slug = 'nethosting';
UPDATE public.hosting_companies SET legal_name = 'FastHosting SpA', foundation_year = 2017, is_independent = true WHERE slug = 'fasthosting';
UPDATE public.hosting_companies SET legal_name = 'CloudHosting SpA', foundation_year = 2016, is_independent = true WHERE slug = 'cloudhosting';
UPDATE public.hosting_companies SET legal_name = 'WebHosting Chile SpA', foundation_year = 2013, is_independent = true WHERE slug = 'webhosting';
UPDATE public.hosting_companies SET legal_name = 'HostingChile SpA', foundation_year = 2011, is_independent = true WHERE slug = 'hostingchile';
UPDATE public.hosting_companies SET legal_name = 'Hosting24 SpA', foundation_year = 2015, is_independent = true WHERE slug = 'hosting24';
UPDATE public.hosting_companies SET legal_name = 'BestHosting SpA', foundation_year = 2014, is_independent = true WHERE slug = 'besthosting';
UPDATE public.hosting_companies SET legal_name = 'ZipHosting SpA', foundation_year = 2018, is_independent = true WHERE slug = 'ziphosting';
UPDATE public.hosting_companies SET legal_name = 'ProHosting Chile SpA', foundation_year = 2012, is_independent = true WHERE slug = 'prohosting';
