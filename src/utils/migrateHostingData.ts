import { supabase } from '@/integrations/supabase/client';

// Datos de ejemplo de hostingCompanies (adaptar según tu estructura real)
const hostingCompaniesData = [
  {
    id: 'hostingplus',
    name: 'HostingPlus',
    logo: '/logo-hostingplus.svg',
    description: 'Hosting premium con servidores en Chile',
    rating: 9.5,
    yearFounded: 2010,
    datacenterLocation: 'Santiago, Chile',
    website: 'https://hostingplus.cl',
    contactInfo: {
      phone: '+56 2 2345 6789',
      email: 'contacto@hostingplus.cl',
      address: 'Av. Providencia 123, Santiago',
      hours: 'Lun-Vie 9:00-18:00'
    },
    plans: [
      {
        name: 'Plan Básico',
        price: 2990,
        storage: '5GB',
        bandwidth: 'Ilimitado',
        domains: 1,
        features: ['SSL Gratis', 'Soporte 24/7', 'cPanel']
      },
      {
        name: 'Plan Pro',
        price: 5990,
        storage: '20GB',
        bandwidth: 'Ilimitado',
        domains: 5,
        features: ['SSL Gratis', 'Soporte 24/7', 'cPanel', 'Backup Diario']
      }
    ]
  },
  {
    id: 'hostname',
    name: 'HostName',
    logo: '/logo-hostname.svg',
    description: 'Soluciones de hosting confiables',
    rating: 9.0,
    yearFounded: 2012,
    datacenterLocation: 'Santiago, Chile',
    website: 'https://hostname.cl',
    contactInfo: {
      phone: '+56 2 3456 7890',
      email: 'info@hostname.cl',
      address: 'Las Condes, Santiago',
      hours: '24/7'
    },
    plans: [
      {
        name: 'Starter',
        price: 1990,
        storage: '3GB',
        bandwidth: '50GB',
        domains: 1,
        features: ['SSL Gratis', 'Email Ilimitado']
      }
    ]
  }
];

export async function migrateHostingCompanies() {
  console.log('🚀 Iniciando migración de datos de hosting...');
  
  let migratedCount = 0;
  let errorCount = 0;

  for (const company of hostingCompaniesData) {
    try {
      // 1. Insertar empresa
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

      // 2. Insertar planes
      if (company.plans && company.plans.length > 0) {
        for (const plan of company.plans) {
          const { error: planError } = await supabase.from('hosting_plans').insert({
            company_id: insertedCompany.id,
            name: plan.name,
            price_monthly: plan.price,
            storage_gb: parseInt(plan.storage) || null,
            bandwidth: plan.bandwidth,
            domains_allowed: plan.domains,
            features: plan.features,
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
  console.log(`❌ Errores: ${errorCount}`);
  console.log('🎉 Migración completada!');

  return {
    success: migratedCount,
    errors: errorCount
  };
}
