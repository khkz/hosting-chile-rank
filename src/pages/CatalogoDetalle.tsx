import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import { ProvenanceTag } from '@/components/data/Provenance';
import { Button } from '@/components/ui/button';
import HostingCompanyInfo, { type HostingCompanyData } from '@/components/HostingCompanyInfo';
import CertificationBadges from '@/components/CertificationBadges';
import CompanyPresence from '@/components/CompanyPresence';
import DatacenterBadge from '@/components/DatacenterBadge';
import { ApprovedReviewsList } from '@/components/reviews/ApprovedReviewsList';
import { PublicReviewForm } from '@/components/reviews/PublicReviewForm';
import { ReputationCard } from '@/components/reputation/ReputationCard';
import ScoreBreakdown from '@/components/ranking/ScoreBreakdown';
import BrandFAQ from '@/components/catalogo/BrandFAQ';
import { buildCatalogoSeo } from '@/components/catalogo/buildCatalogoSeo';
import VerifiedDataTable from '@/components/catalogo/VerifiedDataTable';
import SourcesConsulted from '@/components/catalogo/SourcesConsulted';
import Veredicto from '@/components/catalogo/Veredicto';
import CompareLinks from '@/components/catalogo/CompareLinks';
import ProviderEvidence from '@/components/ficha/ProviderEvidence';
import SiteLink from '@/components/ficha/SiteLink';
import { benchmarkRows, declaredRows } from '@/components/ficha/evidenceRows';
import { useCatalogCompany } from '@/components/ficha/useCatalogCompany';
import { useReviewStatsForSlug } from '@/hooks/useReviewStats';
import { useLatestBenchmarkForCompany } from '@/hooks/useProviderScore';
import { isHiddenProvider } from '@/lib/providerLinks';
import { formatDataDate, formatScore, isoDate } from '@/lib/format';

type PlanFeatures = HostingCompanyData['plans'][number]['features'];

/** Las características del plan llegan como JSON: texto suelto o { name, included }. */
const toFeatures = (raw: unknown): PlanFeatures =>
  (Array.isArray(raw) ? raw : []).flatMap((f): PlanFeatures => {
    if (typeof f === 'string' && f.trim()) return [{ name: f.trim(), included: true }];
    if (f && typeof f === 'object' && typeof (f as { name?: unknown }).name === 'string') {
      const o = f as { name: string; included?: unknown };
      return [{ name: o.name, included: o.included !== false }];
    }
    return [];
  });

const CatalogoDetalle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: company, isLoading } = useCatalogCompany(slug);
  const { data: userReviews } = useReviewStatsForSlug(slug || '');
  const { data: bench } = useLatestBenchmarkForCompany(company?.id);

  useEffect(() => {
    if (slug && isHiddenProvider(slug, null)) { navigate('/catalogo', { replace: true }); return; }
    if (!isLoading && !company && slug) navigate('/catalogo', { replace: true });
  }, [company, navigate, slug, isLoading]);

  // --- Memos y derivados (HOOKS ANTES de cualquier return condicional) ---
  const minPrice = useMemo(() => {
    if (!company?.hosting_plans?.length) return 0;
    return Math.min(...company.hosting_plans.map((p) => p.price_monthly).filter((n: number) => n > 0));
  }, [company]);

  const seoData = useMemo(
    () => buildCatalogoSeo({ company, slug, minPrice, userReviews }),
    [company, slug, minPrice, userReviews],
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="container py-16">
          <p className="t-body text-ink-2">Cargando la ficha del proveedor…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!company || !seoData) return null;

  const companyData: HostingCompanyData = {
    id: company.slug,
    name: company.name,
    logo: company.logo_url || '',
    description: company.description || '',
    descriptionEditorial: company.description_editorial || '',
    rating: company.overall_rating || 0,
    yearFounded: company.year_founded ?? null,
    datacenterLocation: company.datacenter_location || '',
    website: company.website || '',
    contactInfo: {
      phone: company.contact_phone || '',
      email: company.contact_email || '',
      address: company.contact_address || '',
      hours: company.contact_hours || '',
    },
    plans: (company.hosting_plans || []).map((plan) => ({
      name: plan.name,
      price: plan.price_monthly,
      storage: plan.storage_gb ? `${plan.storage_gb} GB SSD` : 'No declarado',
      bandwidth: plan.bandwidth && String(plan.bandwidth).trim() ? String(plan.bandwidth) : 'No declarado',
      domains: plan.domains_allowed ?? 'No declarado',
      features: toFeatures(plan.features),
    })),
    technologies: company.technologies || [],
    uptimeGuarantee: company.uptime_guarantee || undefined,
    hasSslFree: company.has_ssl_free ?? undefined,
    hasMigrationFree: company.has_migration_free ?? undefined,
    paymentMethods: company.payment_methods || undefined,
    pros: company.pros || undefined,
    cons: company.cons || undefined,
    uniqueSellingPoint: company.unique_selling_point || undefined,
    corporateGroup: company.corporate_group || undefined,
    lastScrapedAt: company.last_scraped_at || undefined,
  };

  const dataDate = company.updated_at;
  const evidenceRows = [
    ...declaredRows({
      datacenter: company.datacenter_location,
      yearFounded: company.year_founded,
      corporateGroup: company.corporate_group,
      date: dataDate,
    }),
    ...benchmarkRows(bench),
  ];

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

      <main>
        <PageHeader
          breadcrumbs={
            <SEOBreadcrumbs
              items={[
                { name: 'Catálogo', href: '/catalogo' },
                { name: company.name, href: `/catalogo/${slug}` },
              ]}
            />
          }
          title={`${company.name} — Review y Opiniones 2026`}
          lead={`Nuestra nota, lo que ${company.name} declara sobre su servicio y lo que hemos medido. Cada dato dice de dónde sale y de cuándo es.`}
          actions={
            <>
              <SiteLink slug={company.slug} website={company.website} name={company.name} location="ficha_cabecera" />
              <Button asChild variant="outline">
                <Link to="/comparativa">Comparar</Link>
              </Button>
            </>
          }
          meta={
            dataDate ? (
              <span>
                Datos actualizados el <time dateTime={isoDate(dataDate)}>{formatDataDate(dataDate)}</time>
              </span>
            ) : undefined
          }
          aside={
            <ProviderEvidence
              name={company.name}
              subtitle={company.legal_name || 'Hosting en Chile'}
              rating={company.overall_rating}
              rows={evidenceRows}
              footer={
                <a href="#subpuntajes" className="t-small font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                  Cómo se calcula la nota
                </a>
              }
            />
          }
        />

        <Section id="veredicto" density="tight" title="Veredicto">
          {company.is_fake_comparison && (
            <Callout tone="caution" title="Sitio de comparación no independiente" className="mt-0 mb-8 max-w-[72ch]">
              <p>
                Este sitio se presenta como comparador, pero pertenece al grupo empresarial <strong>{company.corporate_group}</strong>, que opera sus propias marcas de hosting.
              </p>
            </Callout>
          )}
          {company.corporate_group && !company.is_fake_comparison && (
            <Callout tone="note" title="Transparencia corporativa" className="mt-0 mb-8 max-w-[72ch]">
              <p>
                {company.name} pertenece al grupo empresarial <strong>{company.corporate_group}</strong>. Otras marcas del mismo grupo pueden compartir infraestructura y soporte técnico.
              </p>
            </Callout>
          )}
          <Veredicto
            name={company.name}
            editorial={company.description_editorial}
            pros={company.pros}
            cons={company.cons}
          />
        </Section>

        <Section
          id="datos-declarados"
          tone="paper"
          density="tight"
          className="border-t border-rule"
          title="Datos declarados por el proveedor"
          lead={`Lo que ${company.name} publica sobre su servicio. No lo hemos comprobado: por eso lleva la marca Declarado.`}
          action={<ProvenanceTag kind="declared" />}
        >
          <VerifiedDataTable
            name={company.name}
            yearFounded={company.year_founded}
            corporateGroup={company.corporate_group}
            datacenter={company.datacenter_location}
            minPrice={minPrice > 0 ? minPrice : null}
            technologies={company.technologies}
            uptimeGuarantee={company.uptime_guarantee}
            hasSslFree={company.has_ssl_free}
            hasMigrationFree={company.has_migration_free}
            officialWebsite={company.website}
            slug={company.slug}
            datacenterCertifications={company.datacenter_certifications}
            datacenterCertificationsSources={company.datacenter_certifications_sources}
            correctionNote={company.correction_note}
            correctionDate={company.correction_date}
          />
          <DatacenterBadge providerName={company.name} variant="row" className="mt-5" />
          <SourcesConsulted fuentes={company.fuentes} fechaVerificacion={company.fecha_verificacion} />
        </Section>

        <Section
          id="subpuntajes"
          density="tight"
          className="border-t border-rule"
          title={`Cómo se calcula la nota de ${company.name}`}
          lead="Cinco subcriterios con pesos publicados. Lo que todavía no medimos dice «sin medir»: nunca lo rellenamos."
        >
          <ScoreBreakdown
            companyId={company.id}
            companyName={company.name}
            supportRating={company.support_rating ?? null}
            priceRating={company.price_rating ?? null}
            publishedRating={company.overall_rating ?? null}
          />
        </Section>

        <Section id="reputacion" tone="paper" density="tight" className="border-t border-rule" title="Reputación">
          <ReputationCard companyId={company.id} companyName={company.name} showTitle={false} />
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="min-w-0">
              <h3 className="t-h3 text-ink">Opiniones de clientes de {company.name}</h3>
              <ReviewsSummary slug={slug!} />
            </div>
            <div className="min-w-0 rounded-xl border border-rule bg-white p-5 md:p-6">
              <h3 className="t-h3 text-ink">Comparte tu experiencia con {company.name}</h3>
              <div className="mt-4">
                <PublicReviewForm providerSlug={slug!} providerName={company.name} />
              </div>
            </div>
          </div>
        </Section>

        <HostingCompanyInfo company={companyData} />

        <Section id="preguntas" tone="paper" density="tight" className="border-t border-rule" title={`Preguntas frecuentes sobre ${company.name}`}>
          <BrandFAQ companyName={company.name} items={seoData.faqItems} />
        </Section>

        <Section id="sigue-comparando" density="tight" className="border-t border-rule" title="Sigue comparando">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <CompareLinks slug={company.slug} name={company.name} />
            <div className="min-w-0 space-y-8">
              <CompanyPresence
                companySlug={company.slug}
                companyName={company.name}
                rankingPosition={undefined}
                hasCertifications={true}
                inComparison={true}
              />
              <CertificationBadges companySlug={company.slug} />
            </div>
          </div>
        </Section>
      </main>

      <StickyCTA />
      <Footer />
    </>
  );
};

function ReviewsSummary({ slug }: { slug: string }) {
  const { data } = useReviewStatsForSlug(slug);
  return (
    <div className="mt-3">
      {data && data.count > 0 && (
        <p className="mb-4 flex items-center gap-2 t-small text-ink-2">
          <Star className="h-4 w-4 fill-ink text-ink" aria-hidden />
          <span className="tabular font-semibold text-ink">{formatScore(data.avg)} de 5</span>
          <span>
            en {data.count} reseña{data.count === 1 ? '' : 's'} de usuarios
          </span>
        </p>
      )}
      <ApprovedReviewsList providerSlug={slug} />
    </div>
  );
}

export default CatalogoDetalle;
