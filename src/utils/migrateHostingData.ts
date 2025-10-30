import { supabase } from '@/integrations/supabase/client';
import { getAllHostingCompanies } from '@/data/hostingCompanies';

/**
 * Migration script to transfer all hosting companies from static data
 * to Supabase database with their plans
 */

export async function migrateHostingCompanies() {
  console.log('🚀 Iniciando migración de datos de hosting desde hostingCompanies.ts...');
  
  const hostingCompaniesData = getAllHostingCompanies();
  let migratedCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const company of hostingCompaniesData) {
    try {
      // Check if company already exists
      const { data: existingCompany } = await supabase
        .from('hosting_companies')
        .select('id, slug')
        .eq('slug', company.id)
        .maybeSingle();

      if (existingCompany) {
        console.log(`⏭️  Empresa ya existe: ${company.name} (slug: ${company.id})`);
        skippedCount++;
        continue;
      }

      // 1. Insert company
      const { data: insertedCompany, error: companyError } = await supabase
        .from('hosting_companies')
        .insert({
          slug: company.id,
          name: company.name,
          logo_url: company.logo,
          description: company.description,
          year_founded: company.yearFounded,
          datacenter_location: company.datacenterLocation,
          website: company.website,
          contact_phone: company.contactInfo?.phone,
          contact_email: company.contactInfo?.email,
          contact_address: company.contactInfo?.address,
          contact_hours: company.contactInfo?.hours,
          overall_rating: company.rating,
          is_verified: true,
        })
        .select()
        .single();

      if (companyError) {
        console.error(`❌ Error insertando ${company.name}:`, companyError);
        errorCount++;
        continue;
      }

      console.log(`✅ Empresa migrada: ${company.name}`);

      // 2. Insert plans
      if (company.plans && company.plans.length > 0) {
        for (const plan of company.plans) {
          // Extract storage as number (remove "GB", "SSD", etc.)
          const storageMatch = plan.storage.match(/(\d+)/);
          const storageGb = storageMatch ? parseInt(storageMatch[1]) : null;

          const { error: planError } = await supabase.from('hosting_plans').insert({
            company_id: insertedCompany.id,
            name: plan.name,
            price_monthly: plan.price,
            storage_gb: storageGb,
            bandwidth: plan.bandwidth,
            domains_allowed: plan.domains,
            features: plan.features.map(f => ({
              name: f.name,
              included: f.included
            })),
          });

          if (planError) {
            console.error(`❌ Error insertando plan ${plan.name}:`, planError);
          } else {
            console.log(`  ✅ Plan migrado: ${plan.name}`);
          }
        }
      }

      migratedCount++;
    } catch (error) {
      console.error(`❌ Error procesando ${company.name}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Resumen de migración:');
  console.log(`✅ Empresas migradas: ${migratedCount}`);
  console.log(`⏭️  Empresas omitidas (ya existían): ${skippedCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📦 Total procesadas: ${hostingCompaniesData.length}`);
  console.log('🎉 Migración completada!');

  return {
    success: migratedCount,
    skipped: skippedCount,
    errors: errorCount,
    total: hostingCompaniesData.length
  };
}
