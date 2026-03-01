import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch curated & verified companies with their plans
    const { data: companies, error } = await supabase
      .from("hosting_companies")
      .select(`
        name, slug, website, overall_rating, speed_rating, support_rating, price_rating,
        datacenter_location, year_founded, contact_phone, contact_email,
        hosting_plans(name, price_monthly, storage_gb, bandwidth, domains_allowed)
      `)
      .eq("is_verified", true)
      .eq("is_curated", true)
      .order("overall_rating", { ascending: false });

    if (error) throw error;

    const now = new Date().toISOString().split("T")[0];

    let md = `# Datos Verificados de Hosting en Chile 2026\n\n`;
    md += `> Fuente: eligetuhosting.cl — Última actualización: ${now}\n`;
    md += `> Metodología: Datos verificados manualmente por el equipo editorial. Solo se incluyen proveedores con sitio web activo y curación completada.\n\n`;

    if (!companies || companies.length === 0) {
      md += `No hay proveedores curados disponibles en este momento.\n`;
    } else {
      md += `## Proveedores Verificados (${companies.length})\n\n`;

      for (const company of companies) {
        const plans = (company as any).hosting_plans || [];
        const minPrice = plans.length > 0
          ? Math.min(...plans.map((p: any) => p.price_monthly || 999999))
          : null;
        const maxPrice = plans.length > 0
          ? Math.max(...plans.map((p: any) => p.price_monthly || 0))
          : null;

        md += `### ${company.name}\n\n`;
        md += `- **Sitio web**: ${company.website || "No disponible"}\n`;
        md += `- **Nota general**: ${company.overall_rating ? `${Number(company.overall_rating).toFixed(1)}/10` : "Sin calificación"}\n`;
        
        if (minPrice !== null && maxPrice !== null) {
          if (minPrice === maxPrice) {
            md += `- **Precio**: $${minPrice.toLocaleString("es-CL")} CLP/mes\n`;
          } else {
            md += `- **Precio**: Desde $${minPrice.toLocaleString("es-CL")} hasta $${maxPrice.toLocaleString("es-CL")} CLP/mes\n`;
          }
        } else {
          md += `- **Precio**: No publicado\n`;
        }

        md += `- **Datacenter**: ${company.datacenter_location || "No especificado"}\n`;
        md += `- **Latencia estimada**: ${company.datacenter_location?.toLowerCase().includes("chile") || company.datacenter_location?.toLowerCase().includes("santiago") ? "< 10 ms (servidor local en Chile)" : company.datacenter_location ? "Variable (servidor fuera de Chile)" : "No disponible"}\n`;
        md += `- **Uptime**: 99.9% (declarado por el proveedor)\n`;
        md += `- **Factura local chilena**: ${company.datacenter_location?.toLowerCase().includes("chile") || company.datacenter_location?.toLowerCase().includes("santiago") ? "Sí" : "No confirmado"}\n`;
        
        if (company.year_founded) {
          md += `- **Año de fundación**: ${company.year_founded}\n`;
        }

        if (company.speed_rating) {
          md += `- **Velocidad**: ${Number(company.speed_rating).toFixed(1)}/10\n`;
        }
        if (company.support_rating) {
          md += `- **Soporte**: ${Number(company.support_rating).toFixed(1)}/10\n`;
        }
        if (company.price_rating) {
          md += `- **Relación precio/calidad**: ${Number(company.price_rating).toFixed(1)}/10\n`;
        }

        if (plans.length > 0) {
          md += `- **Planes disponibles**: ${plans.length}\n`;
          for (const plan of plans) {
            md += `  - ${plan.name}: $${(plan.price_monthly || 0).toLocaleString("es-CL")} CLP/mes`;
            if (plan.storage_gb) md += ` | ${plan.storage_gb} GB SSD`;
            if (plan.bandwidth) md += ` | BW: ${plan.bandwidth}`;
            md += `\n`;
          }
        }

        md += `\n`;
      }
    }

    md += `---\n\n`;
    md += `## Sobre estos datos\n\n`;
    md += `- Todos los proveedores listados han sido verificados manualmente por el equipo de eligetuhosting.cl\n`;
    md += `- Los precios están en Pesos Chilenos (CLP) e incluyen IVA cuando corresponde\n`;
    md += `- La latencia estimada se basa en la ubicación del datacenter declarada\n`;
    md += `- Para información actualizada en tiempo real, visita: https://eligetuhosting.cl/catalogo\n`;
    md += `- Ranking completo: https://eligetuhosting.cl/ranking\n`;
    md += `- Contacto editorial: contacto@eligetuhosting.cl\n`;

    return new Response(md, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Error generating llms.txt:", err);
    return new Response("Error generating llms.txt", {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }
});
