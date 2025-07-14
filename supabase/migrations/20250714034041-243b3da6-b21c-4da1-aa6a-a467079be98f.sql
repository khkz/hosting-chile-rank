-- Add missing unique constraints for ON CONFLICT clauses

-- Add unique constraint for whois_info (domain_id)
ALTER TABLE public.whois_info ADD CONSTRAINT whois_info_domain_id_unique UNIQUE (domain_id);

-- Add unique constraint for dns_info (domain_id) 
ALTER TABLE public.dns_info ADD CONSTRAINT dns_info_domain_id_unique UNIQUE (domain_id);

-- Add unique constraint for tech_stack (domain_id)
ALTER TABLE public.tech_stack ADD CONSTRAINT tech_stack_domain_id_unique UNIQUE (domain_id);

-- Add unique constraint for ssl_info (domain_id)
ALTER TABLE public.ssl_info ADD CONSTRAINT ssl_info_domain_id_unique UNIQUE (domain_id);

-- Add unique constraint for performance_metrics (domain_id)
ALTER TABLE public.performance_metrics ADD CONSTRAINT performance_metrics_domain_id_unique UNIQUE (domain_id);