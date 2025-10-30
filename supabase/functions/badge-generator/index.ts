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

    // Get medal color based on position
    const getMedalColor = (position: number) => {
      switch (position) {
        case 1: return { main: '#FFD700', shadow: '#FFA500' }; // Gold
        case 2: return { main: '#C0C0C0', shadow: '#808080' }; // Silver
        case 3: return { main: '#CD7F32', shadow: '#8B4513' }; // Bronze
        default: return { main: '#3B82F6', shadow: '#1E40AF' }; // Blue
      }
    };

    const colors = getMedalColor(cert.position);
    
    // Determine badge dimensions based on size
    const dimensions = size === 'small' ? { width: 150, height: 150 } :
                       size === 'large' ? { width: 300, height: 300 } :
                       { width: 200, height: 200 };

    const fontSize = {
      position: dimensions.width * 0.2,
      category: dimensions.width * 0.15,
      year: dimensions.width * 0.1
    };

    // Generate SVG badge with medal design
    const svg = `
      <svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="medalGradient" cx="40%" cy="40%">
            <stop offset="0%" style="stop-color:${colors.main};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.shadow};stop-opacity:1" />
          </radialGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Medal circle -->
        <circle cx="${dimensions.width / 2}" cy="${dimensions.height / 2}" 
                r="${dimensions.width * 0.42}" 
                fill="url(#medalGradient)" 
                filter="url(#shadow)"/>
        
        <!-- Border -->
        <circle cx="${dimensions.width / 2}" cy="${dimensions.height / 2}" 
                r="${dimensions.width * 0.42}" 
                fill="none" 
                stroke="${colors.main}" 
                stroke-width="${dimensions.width * 0.03}"/>
        
        <!-- Position number -->
        <text x="${dimensions.width / 2}" y="${dimensions.height * 0.38}" 
              text-anchor="middle" 
              fill="white" 
              font-family="Arial, sans-serif" 
              font-size="${fontSize.position}" 
              font-weight="900"
              style="text-shadow: 0 2px 4px rgba(0,0,0,0.8)">
          #${cert.position}
        </text>
        
        <!-- Category icon -->
        <text x="${dimensions.width / 2}" y="${dimensions.height * 0.56}" 
              text-anchor="middle" 
              font-size="${fontSize.category}"
              style="text-shadow: 0 1px 3px rgba(0,0,0,0.8)">
          ${cert.certification_categories.icon}
        </text>
        
        <!-- Year text -->
        <text x="${dimensions.width / 2}" y="${dimensions.height * 0.7}" 
              text-anchor="middle" 
              fill="white" 
              font-family="Arial, sans-serif" 
              font-size="${fontSize.year}" 
              font-weight="bold"
              style="text-shadow: 0 1px 3px rgba(0,0,0,0.8)">
          CHILE 2025
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
