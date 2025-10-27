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
    const url = new URL(req.url);
    const certificationId = url.searchParams.get('id');
    const size = url.searchParams.get('size') || 'medium';

    if (!certificationId) {
      return new Response('Certification ID is required', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch certification data
    const { data: cert, error } = await supabase
      .from('company_certifications')
      .select(`
        *,
        hosting_companies (name),
        certification_categories (name, icon)
      `)
      .eq('id', certificationId)
      .eq('status', 'active')
      .single();

    if (error || !cert) {
      console.error('Error fetching certification:', error);
      return new Response('Certification not found', { 
        status: 404,
        headers: corsHeaders 
      });
    }

    // Determine badge dimensions based on size
    const dimensions = size === 'small' ? { width: 150, height: 40, fontSize: 10, titleSize: 8 } :
                       size === 'large' ? { width: 300, height: 80, fontSize: 18, titleSize: 14 } :
                       { width: 200, height: 60, fontSize: 14, titleSize: 10 };

    // Generate SVG badge
    const svg = `
      <svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#EF233C;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#D90429;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${dimensions.width}" height="${dimensions.height}" fill="url(#grad1)" rx="8"/>
        <text x="${dimensions.width / 2}" y="${dimensions.height * 0.4}" 
              text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="${dimensions.fontSize}" 
              font-weight="bold">
          #${cert.position} ${cert.certification_categories.name.toUpperCase()}
        </text>
        <text x="${dimensions.width / 2}" y="${dimensions.height * 0.7}" 
              text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="${dimensions.titleSize}">
          Chile 2025 - ${cert.hosting_companies.name}
        </text>
      </svg>
    `;

    console.log(`Badge generated for certification ${certificationId}, size: ${size}`);

    return new Response(svg, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
      },
    });

  } catch (error) {
    console.error('Badge generation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
