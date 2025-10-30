import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Award, ExternalLink, CheckCircle } from 'lucide-react';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';

export default function DirectorioHosting() {
  // Fetch empresas con certificaciones activas
  const { data: certifiedCompanies } = useQuery({
    queryKey: ['certified-companies-directory'],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_certifications')
        .select(`
          id,
          position,
          category_id,
          link_back_verified,
          hosting_companies (
            id,
            slug,
            name,
            logo_url,
            overall_rating,
            total_reviews,
            website,
            description
          ),
          certification_categories (
            name,
            icon
          )
        `)
        .eq('status', 'active')
        .order('position', { ascending: true });
      
      return data;
    }
  });

  // Agrupar por empresa
  const companiesBySlug = certifiedCompanies?.reduce((acc: any, cert: any) => {
    const company = cert.hosting_companies;
    if (!company) return acc;
    
    if (!acc[company.slug]) {
      acc[company.slug] = {
        ...company,
        certifications: []
      };
    }
    
    acc[company.slug].certifications.push({
      category: cert.certification_categories.name,
      icon: cert.certification_categories.icon,
      position: cert.position,
      linkBackVerified: cert.link_back_verified
    });
    
    return acc;
  }, {});

  const companiesArray = Object.values(companiesBySlug || {}) as any[];

  // Schema Markup - ItemList
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Directorio de Hosting Certificados en Chile",
    "description": "Listado oficial de proveedores de hosting certificados por EligeTuHosting.cl",
    "url": "https://eligetuhosting.cl/directorio-hosting-chile",
    "numberOfItems": companiesArray.length,
    "itemListElement": companiesArray.map((company, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": company.name,
        "url": `https://eligetuhosting.cl/catalogo/${company.slug}`,
        "image": `https://eligetuhosting.cl${company.logo_url}`,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": company.overall_rating?.toFixed(1) || "0",
          "reviewCount": company.total_reviews || 0,
          "bestRating": "10",
          "worstRating": "1"
        }
      }
    }))
  };

  return (
    <>
      <DynamicMetaTags 
        title="Directorio Hosting Chile 2025 | Proveedores Certificados"
        description="Directorio oficial de empresas de hosting certificadas en Chile. Encuentra el mejor proveedor según velocidad, soporte, seguridad y precio."
        canonical="https://eligetuhosting.cl/directorio-hosting-chile"
        keywords="hosting chile, directorio hosting, proveedores hosting chile, mejor hosting chile 2025"
      />

      {/* Schema Markup */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} 
      />

      <Navbar />
      
      <div className="container mx-auto px-4 pt-8">
        <SEOBreadcrumbs 
          items={[
            { name: 'Directorio Hosting Chile', href: '/directorio-hosting-chile' }
          ]}
        />
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-red via-brand-red-dark to-[#2B2D42] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Directorio Hosting Chile 2025
          </h1>
          <p className="text-xl md:text-2xl mb-6 opacity-90">
            Proveedores Certificados por EligeTuHosting.cl
          </p>
          <p className="text-lg max-w-3xl mx-auto opacity-80">
            Empresas verificadas que cumplen nuestros estándares de calidad en 
            velocidad, soporte, seguridad y precio.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-3xl font-bold">{companiesArray.length}</div>
              <div className="text-sm opacity-80">Empresas Certificadas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm opacity-80">Verificadas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-80">Soporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-12 bg-[#F7F9FC]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companiesArray.map((company) => (
              <Card key={company.slug} className="p-6 hover:shadow-xl transition-shadow">
                {/* Company Logo */}
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={company.logo_url} 
                    alt={`Logo ${company.name}`}
                    className="w-16 h-16 object-contain"
                    width="64"
                    height="64"
                    loading="lazy"
                  />
                  <div>
                    <h2 className="text-xl font-bold">
                      <Link to={`/catalogo/${company.slug}`} className="hover:text-brand-red">
                        {company.name}
                      </Link>
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{company.overall_rating?.toFixed(1) || 'N/A'}/10</span>
                      {company.total_reviews > 0 && (
                        <span className="text-gray-500">({company.total_reviews} reviews)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {company.description}
                </p>

                {/* Certifications */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {company.certifications.map((cert: any, idx: number) => (
                    <Badge 
                      key={idx} 
                      variant={cert.linkBackVerified ? "default" : "secondary"}
                      className="gap-1"
                    >
                      {cert.linkBackVerified && <CheckCircle className="w-3 h-3" />}
                      {cert.category} #{cert.position}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link 
                    to={`/catalogo/${company.slug}`}
                    className="flex-1 text-center bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-brand-red-dark transition-colors"
                  >
                    Ver Detalles
                  </Link>
                  {company.website && (
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA para proveedores */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Award className="w-16 h-16 text-brand-red mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            ¿Eres Proveedor de Hosting?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Certifica tu empresa con EligeTuHosting.cl y aparece destacado en este directorio.
            Aumenta tu visibilidad y genera confianza en potenciales clientes.
          </p>
          <Link 
            to="/certificaciones"
            className="inline-block bg-brand-red text-white px-8 py-3 rounded-lg hover:bg-brand-red-dark transition-colors font-semibold"
          >
            Solicitar Certificación
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
