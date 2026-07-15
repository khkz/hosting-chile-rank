import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import HostingCompanyInfo from '@/components/HostingCompanyInfo';
import CertificationBadges from '@/components/CertificationBadges';
import { ApprovedReviewsList } from '@/components/reviews/ApprovedReviewsList';
import { PublicReviewForm } from '@/components/reviews/PublicReviewForm';
import { useReviewStatsForSlug } from '@/hooks/useReviewStats';
import { Star } from 'lucide-react';
import { ReputationCard } from '@/components/reputation/ReputationCard';
import { Card } from '@/components/ui/card';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import HostingSectionsNav from '@/components/HostingSectionsNav';
import CompanyPresence from '@/components/CompanyPresence';
import { AlertTriangle } from 'lucide-react';
import BrandFAQ, { buildBrandFAQ } from '@/components/catalogo/BrandFAQ';
import VerifiedDataTable from '@/components/catalogo/VerifiedDataTable';
import Veredicto from '@/components/catalogo/Veredicto';
import DatacenterBadge from '@/components/DatacenterBadge';
import { isHiddenProvider } from '@/lib/providerLinks';

const SITE = 'https://eligetuhosting.cl';

const CatalogoDetalle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: company, isLoading } = useQuery({
    queryKey: ['hosting-company', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(`*, hosting_plans(*)`)
        .eq('country', getActiveCountryCode())
        .eq('slug', slug)
        .eq('is_verified', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: userReviews } = useReviewStatsForSlug(slug || '');

  useEffect(() => {
    if (slug && isHiddenProvider(slug, null)) { navigate('/catalogo', { replace: true }); return; }
    if (!isLoading && !company && slug) navigate('/catalogo', { replace: true });
  }, [company, navigate, slug, isLoading]);

  // --- Memos y derivados (HOOKS ANTES de cualquier return condicional) ---
  const minPrice = useMemo(() => {
    if (!company?.hosting_plans?.length) return 0;
    return Math.min(...company.hosting_plans.map((p: any) => p.price_monthly).filter((n: number) => n > 0));
  }, [company]);

  const seoData = useMemo(() => {
    if (!company) return null;
    const name: string = company.name;
    const rating: number = company.overall_rating || 0;
    const dc: string = company.datacenter_location || '';
    const year: number | null = company.year_founded || null;
    const group: string | null = company.corporate_group || null;
    const priceTxt = minPrice > 0 ? `desde $${minPrice.toLocaleString('es-CL')}/mes` : 'planes a consultar';
    const dcShort = dc ? `, datacenter ${dc.split(',')[0]}` : '';
    const yrShort = year ? `, opera desde ${year}` : '';
    const grpShort = group ? `, ${group}` : '';

    const title = `${name}: Opiniones, Precios y Review 2026 ⭐ ${rating.toFixed(1)}/10 | EligeTuHosting.cl`;
    const description = `Review independiente de ${name} para Chile 2026: nota ${rating.toFixed(1)}/10, ${priceTxt}${dcShort}${yrShort}${grpShort}. Opiniones reales, pros, contras y datos verificados.`.slice(0, 158);

    const canonical = `${SITE}/catalogo/${slug}`;
    const ogImage = company.logo_url ? (company.logo_url.startsWith('http') ? company.logo_url : `${SITE}${company.logo_url}`) : `${SITE}/images/ranking-comparison.png`;

    // --- JSON-LD ---
    const productSchema: any = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `Hosting ${name}`,
      description: (company as any).description_editorial || company.description || `Servicios de hosting de ${name} en Chile.`,
      brand: { '@type': 'Brand', name },
      url: canonical,
      datePublished: (company as any).created_at || '2026-01-01',
      dateModified: (company as any).updated_at || new Date().toISOString(),
    };
    if (company.website) productSchema.sameAs = [company.website];
    if (company.logo_url) productSchema.image = ogImage;

    // Organization / LocalBusiness schema para TODAS las fichas — refuerza brand SEO
    // y permite a buscadores y LLMs vincular nombre + sitio + contacto + dirección.
    const hasLocalSignals = !!(company.contact_address || company.contact_phone || dc);
    const orgSchema: any = {
      '@context': 'https://schema.org',
      '@type': hasLocalSignals ? 'LocalBusiness' : 'Organization',
      name,
      url: company.website || canonical,
      areaServed: { '@type': 'Country', name: 'Chile' },
    };
    if (company.logo_url) orgSchema.logo = ogImage;
    if (company.website) orgSchema.sameAs = [company.website];
    if (company.contact_phone) orgSchema.telephone = company.contact_phone;
    if (company.contact_email) orgSchema.email = company.contact_email;
    if (company.contact_address) {
      orgSchema.address = {
        '@type': 'PostalAddress',
        streetAddress: company.contact_address,
        addressCountry: 'CL',
      };
    }
    if (year) orgSchema.foundingDate = String(year);
    if (group) {
      const g = String(group).trim();
      orgSchema.parentOrganization = {
        '@type': 'Organization',
        name: /^grupo\s/i.test(g) ? g : `Grupo ${g}`,
      };
    }

    if (minPrice > 0) {
      productSchema.offers = {
        '@type': 'AggregateOffer',
        lowPrice: minPrice,
        priceCurrency: 'CLP',
        offerCount: company.hosting_plans?.length || 1,
        availability: 'https://schema.org/InStock',
      };
    }

    // AggregateRating: combina nota editorial + reseñas aprobadas si existen
    const userCount = userReviews?.count || 0;
    const userAvg = userReviews?.avg || 0;
    const totalCount = 1 + userCount; // 1 = review editorial
    const weightedAvg = ((rating / 2) + (userAvg * userCount)) / totalCount; // rating /10 → /5 para AggregateRating estándar
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(weightedAvg.toFixed(2)),
      bestRating: 5,
      worstRating: 1,
      ratingCount: totalCount,
      reviewCount: totalCount,
    };

    const editorialReview = {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: { '@type': 'Product', name: `Hosting ${name}` },
      author: { '@type': 'Organization', name: 'EligeTuHosting.cl' },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: Number((rating / 2).toFixed(2)),
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: (company as any).description_editorial || company.description || `Review editorial de ${name}.`,
      datePublished: (company as any).updated_at || new Date().toISOString().split('T')[0],
    };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${SITE}/catalogo` },
        { '@type': 'ListItem', position: 3, name, item: canonical },
      ],
    };

    const faqItems = buildBrandFAQ({
      name,
      rating,
      minPrice: minPrice > 0 ? minPrice : null,
      datacenter: dc,
      yearFounded: year,
      corporateGroup: group,
      uptimeGuarantee: (company as any).uptime_guarantee || null,
    });

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    };

    return { title, description, canonical, ogImage, productSchema, orgSchema, editorialReview, breadcrumb, faqSchema, faqItems, name, rating };
  }, [company, slug, minPrice, userReviews]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Cargando información...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!company || !seoData) return null;

  const companyData = {
    id: company.slug,
    name: company.name,
    logo: company.logo_url || '',
    description: company.description || '',
    descriptionEditorial: (company as any).description_editorial || '',
    rating: company.overall_rating || 0,
    yearFounded: company.year_founded || 0,
    datacenterLocation: company.datacenter_location || '',
    website: company.website || '',
    contactInfo: {
      phone: company.contact_phone || '',
      email: company.contact_email || '',
      address: company.contact_address || '',
      hours: company.contact_hours || '',
    },
    plans: (company.hosting_plans || []).map((plan: any) => ({
      name: plan.name,
      price: plan.price_monthly,
      storage: plan.storage_gb ? `${plan.storage_gb} GB SSD` : 'Ilimitado',
      bandwidth: plan.bandwidth || 'Ilimitada',
      domains: plan.domains_allowed || 1,
      features: plan.features || [],
    })),
    technologies: company.technologies || [],
    uptimeGuarantee: (company as any).uptime_guarantee || undefined,
    hasSslFree: (company as any).has_ssl_free ?? undefined,
    hasMigrationFree: (company as any).has_migration_free ?? undefined,
    paymentMethods: (company as any).payment_methods || undefined,
    pros: (company as any).pros || undefined,
    cons: (company as any).cons || undefined,
    uniqueSellingPoint: (company as any).unique_selling_point || undefined,
    corporateGroup: company.corporate_group || undefined,
    lastScrapedAt: (company as any).last_scraped_at || undefined,
  };

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={`${company.name}, ${company.name} opiniones, ${company.name} review, ${company.name} precios, es bueno ${company.name}, hosting ${company.name}`} />
        <link rel="canonical" href={seoData.canonical} />
        <link rel="alternate" hrefLang="es-CL" href={seoData.canonical} />
        <link rel="alternate" hrefLang="es" href={seoData.canonical} />
        <link rel="alternate" hrefLang="x-default" href={seoData.canonical} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:site_name" content="EligeTuHosting.cl" />
        <meta property="og:locale" content="es_CL" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.ogImage} />

        <script type="application/ld+json">{JSON.stringify(seoData.productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(seoData.editorialReview)}</script>
        <script type="application/ld+json">{JSON.stringify(seoData.breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(seoData.faqSchema)}</script>
        {seoData.orgSchema && (
          <script type="application/ld+json">{JSON.stringify(seoData.orgSchema)}</script>
        )}
      </Helmet>

      <Navbar />
      <HostingSectionsNav />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <SEOBreadcrumbs
          items={[
            { name: 'Catálogo', href: '/catalogo' },
            { name: company.name, href: `/catalogo/${slug}` },
          ]}
        />

        {/* H1 SEO de marca */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {company.name} — Review y Opiniones 2026
          </h1>
          <p className="text-muted-foreground mt-2">
            Nota editorial <strong>{seoData.rating.toFixed(1)}/10</strong>
            {company.year_founded ? ` · Opera desde ${company.year_founded}` : ''}
            {company.corporate_group ? ` · ${company.corporate_group}` : ''}
          </p>
          {(company as any).updated_at && (
            <p className="text-xs text-muted-foreground mt-1">
              ✓ Datos verificados al {new Date((company as any).updated_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          )}
        </header>


        {(company as any).is_fake_comparison && (
          <div className="mb-6 p-4 bg-destructive/10 rounded-lg border border-destructive/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">⚠️ Sitio de comparación no independiente</p>
              <p className="text-xs text-muted-foreground">
                Este sitio se presenta como comparador, pero pertenece al grupo empresarial <strong>{company.corporate_group}</strong>, que opera sus propias marcas de hosting.
              </p>
            </div>
          </div>
        )}

        {company.corporate_group && !(company as any).is_fake_comparison && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Transparencia corporativa</p>
              <p className="text-xs text-muted-foreground">
                {company.name} pertenece al grupo empresarial <strong>{company.corporate_group}</strong>. Otras marcas del mismo grupo pueden compartir infraestructura y soporte técnico.
              </p>
            </div>
          </div>
        )}

        <CertificationBadges companySlug={slug || ''} variant="horizontal" size="medium" />

        <div className="my-8">
          <CompanyPresence
            companySlug={slug || ''}
            companyName={company.name}
            rankingPosition={undefined}
            hasCertifications={true}
            inComparison={true}
          />
        </div>

        <HostingCompanyInfo company={companyData} />

        <VerifiedDataTable
          yearFounded={company.year_founded}
          corporateGroup={company.corporate_group}
          datacenter={company.datacenter_location}
          minPrice={minPrice > 0 ? minPrice : null}
          technologies={company.technologies}
          uptimeGuarantee={(company as any).uptime_guarantee}
          hasSslFree={(company as any).has_ssl_free}
          hasMigrationFree={(company as any).has_migration_free}
          officialWebsite={company.website}
          slug={company.slug}
        />

        <p className="text-xs text-muted-foreground mt-3">
          Precios referenciales verificados a julio 2026; pueden variar — confirma en el sitio del proveedor.
        </p>

        <Veredicto
          name={company.name}
          rating={seoData.rating}
          editorial={(company as any).description_editorial}
          pros={(company as any).pros}
          cons={(company as any).cons}
        />

        <BrandFAQ companyName={company.name} items={seoData.faqItems} />

        {slug && slug !== 'hostingplus' && slug !== 'ecohosting' && (
          <section className="mt-12 space-y-4">
            <a
              href={`/comparativa/${slug}-vs-hostingplus`}
              className="block p-5 rounded-xl border-2 border-[#EF233C] bg-gradient-to-r from-[#EF233C]/5 to-white hover:from-[#EF233C]/10 transition"
            >
              <span className="text-sm uppercase tracking-wide text-[#EF233C] font-semibold">Comparativa</span>
              <p className="text-lg md:text-xl font-bold text-[#2B2D42] mt-1">
                Compáralo con el #1: {company.name} vs HostingPlus.cl →
              </p>
              <p className="text-sm text-gray-600 mt-1">Tabla lado a lado con nota, precio, datacenter y reseñas verificadas.</p>
            </a>
            <div className="grid sm:grid-cols-2 gap-3">
              <a href={`/alternativas-a/${slug}`} className="block p-4 rounded-xl border bg-white hover:border-[#EF233C] transition">
                <span className="text-xs uppercase text-gray-500 font-semibold">Alternativas</span>
                <p className="font-semibold text-[#2B2D42] mt-1">Mejores alternativas a {company.name} →</p>
              </a>
              {(['hostgator','bluehost','godaddy','hostingcl','planetahosting','fasthosting','cloudhosting','webhosting'] as const).includes(slug as any) && (
                <a href={`/migrar-de/${slug}`} className="block p-4 rounded-xl border bg-white hover:border-[#EF233C] transition">
                  <span className="text-xs uppercase text-gray-500 font-semibold">Migración gratuita</span>
                  <p className="font-semibold text-[#2B2D42] mt-1">Migrar de {company.name} sin downtime →</p>
                </a>
              )}
            </div>
          </section>
        )}


        <section className="mt-12">
          <ReputationCard companyId={company.id} companyName={company.name} />
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Opiniones de clientes de {company.name}</h2>
          <ReviewsSection slug={slug!} />
        </section>

        <section className="mt-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Comparte tu experiencia con {company.name}</h2>
            <PublicReviewForm providerSlug={slug!} providerName={company.name} />
          </Card>
        </section>
      </main>

      <StickyCTA />
      <Footer />
    </>
  );
};

function ReviewsSection({ slug }: { slug: string }) {
  const { data } = useReviewStatsForSlug(slug);
  return (
    <div>
      {data && data.count > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{data.avg.toFixed(1)}</span>
          <span className="text-muted-foreground">· {data.count} reseña{data.count === 1 ? '' : 's'} de usuarios</span>
        </div>
      )}
      <ApprovedReviewsList providerSlug={slug} />
    </div>
  );
}

export default CatalogoDetalle;
