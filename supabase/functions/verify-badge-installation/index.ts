import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { certificationId } = await req.json();

    if (!certificationId) {
      return new Response(
        JSON.stringify({ error: 'Certification ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get certification with company details
    const { data: cert, error: certError } = await supabase
      .from('company_certifications')
      .select(`
        id,
        company_id,
        hosting_companies (website, name)
      `)
      .eq('id', certificationId)
      .single();

    if (certError || !cert) {
      console.error('Error fetching certification:', certError);
      return new Response(
        JSON.stringify({ error: 'Certification not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const companyWebsite = cert.hosting_companies.website;
    
    if (!companyWebsite) {
      return new Response(
        JSON.stringify({ error: 'Company website not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying badge installation for ${cert.hosting_companies.name} at ${companyWebsite}`);

    // Fetch company website
    let websiteHtml = '';
    try {
      const response = await fetch(companyWebsite, {
        headers: {
          'User-Agent': 'EligeTuHosting-Badge-Verifier/1.0',
        },
        redirect: 'follow',
      });

      if (!response.ok) {
        console.error(`Failed to fetch website: ${response.status}`);
        return new Response(
          JSON.stringify({ 
            verified: false, 
            message: `No se pudo acceder al sitio web (HTTP ${response.status})` 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      websiteHtml = await response.text();
    } catch (fetchError) {
      console.error('Error fetching website:', fetchError);
      return new Response(
        JSON.stringify({ 
          verified: false, 
          message: 'No se pudo acceder al sitio web' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for badge installation
    const badgeUrl = `badge-generator?id=${certificationId}`;
    const linkToSite = 'eligetuhosting.cl';
    
    const hasBadgeImage = websiteHtml.includes(badgeUrl);
    const hasLinkBack = websiteHtml.includes(linkToSite);
    
    const verified = hasBadgeImage && hasLinkBack;

    console.log(`Verification result: ${verified} (badge: ${hasBadgeImage}, link: ${hasLinkBack})`);

    if (verified) {
      // Update certification
      await supabase
        .from('company_certifications')
        .update({
          link_back_verified: true,
          link_back_verified_at: new Date().toISOString(),
        })
        .eq('id', certificationId);

      return new Response(
        JSON.stringify({ 
          verified: true, 
          message: '¡Badge verificado correctamente!' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        verified: false, 
        message: hasBadgeImage 
          ? 'Badge encontrado pero falta el enlace a eligetuhosting.cl' 
          : 'Badge no encontrado en el sitio web. Asegúrate de instalarlo correctamente.' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Badge verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
