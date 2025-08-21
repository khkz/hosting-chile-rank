-- Crear una función que respete RLS en lugar de una vista
-- Usando comillas para manejar la palabra reservada "timestamp"
CREATE OR REPLACE FUNCTION public.get_public_domains()
RETURNS TABLE (
    domain text,
    "timestamp" timestamp with time zone,
    source text,
    is_active boolean,
    business_type text,
    analyzed_at timestamp with time zone,
    cms_detected text,
    framework_detected text,
    hosting_provider text,
    country_location text
)
LANGUAGE sql
SECURITY INVOKER
STABLE
AS $$
    SELECT 
        d.domain,
        d."timestamp",
        d.source,
        da.is_active,
        da.business_type,
        da.analyzed_at,
        ts.cms_detected,
        ts.framework_detected,
        ts.hosting_provider,
        ts.country_location
    FROM domains d
    LEFT JOIN domain_analysis da ON (d.id = da.domain_id)
    LEFT JOIN tech_stack ts ON (d.id = ts.domain_id);
$$;