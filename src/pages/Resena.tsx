import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import { Button } from '@/components/ui/button';
import Veredicto from '@/components/catalogo/Veredicto';
import ScoreBreakdown from '@/components/ranking/ScoreBreakdown';
import { ReputationCard } from '@/components/reputation/ReputationCard';
import FichaBreadcrumbs from '@/components/ficha/FichaBreadcrumbs';
import ProviderEvidence from '@/components/ficha/ProviderEvidence';
import SiteLink from '@/components/ficha/SiteLink';
import { benchmarkRows, declaredRows } from '@/components/ficha/evidenceRows';
import { useCatalogCompany } from '@/components/ficha/useCatalogCompany';
import { hostingData, RESENA_TO_CATALOG } from '@/components/ficha/resenaData';
import { useLatestBenchmarkForCompany } from '@/hooks/useProviderScore';
import { formatDataDate, isoDate } from '@/lib/format';

const linkClass = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const Resena = () => {
  const { slug } = useParams();
  const hosting = slug && hostingData[slug] ? hostingData[slug] : null;
  // Solo pares reseña-ficha comprobados; sin par seguro no se cuelga el desglose de otra empresa.
  const catalogSlug = slug ? RESENA_TO_CATALOG[slug] ?? null : null;
  const { data: company, isLoading } = useCatalogCompany(hosting ? catalogSlug : null);
  const { data: bench } = useLatestBenchmarkForCompany(company?.id);

  useEffect(() => {
    if (hosting) {
      document.title = `Reseña de ${hosting.name} | eligetuhosting.cl`;
    } else {
      document.title = "Reseña no encontrada | eligetuhosting.cl";
    }
  }, [hosting]);

  if (!hosting) {
    return (
      <>
        <Navbar />
        <main className="container py-16">
          <h1 className="t-h1 text-ink">Reseña no encontrada</h1>
          <p className="t-lead mt-4">Lo sentimos, la reseña que estás buscando no existe o ha sido movida.</p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/catalogo">Ver el catálogo de proveedores</Link>
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  const PUBLISHED = '2026-01-01';
  const MODIFIED = new Date().toISOString().slice(0, 10);
  const canonical = `https://eligetuhosting.cl/resenas/${slug}`;

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: `Reseña editorial de ${hosting.name}`,
    url: canonical,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    reviewBody: hosting.description,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: hosting.rating,
      bestRating: 10,
      worstRating: 0,
    },
    author: {
      '@type': 'Organization',
      name: 'EligeTuHosting',
      url: 'https://eligetuhosting.cl/sobre-nosotros',
    },
    publisher: {
      '@type': 'Organization',
      name: 'EligeTuHosting.cl',
      url: 'https://eligetuhosting.cl',
    },
    itemReviewed: {
      '@type': 'Organization',
      name: hosting.name,
      url: hosting.url,
      image: hosting.logo.startsWith('http') ? hosting.logo : `https://eligetuhosting.cl${hosting.logo}`,
    },
  };

  const fichaHref = company ? `/catalogo/${company.slug}` : null;
  const dataDate = company?.updated_at ?? null;
  const rows = [
    ...(company
      ? declaredRows({
          datacenter: company.datacenter_location,
          yearFounded: company.year_founded,
          corporateGroup: company.corporate_group,
          date: dataDate,
        })
      : []),
    ...benchmarkRows(bench),
  ];

  return (
    <>
      <Helmet>
        <title>{`Reseña ${hosting.name} | EligeTuHosting.cl`}</title>
        <meta
          name="description"
          content={`Análisis detallado y reseña de ${hosting.name}. Descubre sus ventajas, desventajas y si es la mejor opción para tu sitio web.`}
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={`Reseña ${hosting.name} | EligeTuHosting.cl`} />
        <script type="application/ld+json">{JSON.stringify(reviewSchema)}</script>
      </Helmet>
      <BreadcrumbSchema
        items={[
          { name: 'Reseñas', url: '/catalogo' },
          { name: hosting.name, url: `/resenas/${slug}` },
        ]}
      />

      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={
            <FichaBreadcrumbs
              items={[{ name: 'Inicio', href: '/' }, { name: 'Reseñas', href: '/catalogo' }, { name: hosting.name }]}
            />
          }
          title={hosting.name}
          lead={`Nuestra nota de ${hosting.name}, lo que declara sobre su servicio y lo que hemos medido. Cada dato dice de dónde sale y de cuándo es.`}
          actions={
            <>
              <SiteLink slug={slug} website={hosting.url} name={hosting.name} location="resena_cabecera" />
              {fichaHref && (
                <Button asChild variant="outline">
                  <Link to={fichaHref}>Ver ficha</Link>
                </Button>
              )}
            </>
          }
          meta={
            dataDate ? (
              <span>
                Datos de la ficha actualizados el <time dateTime={isoDate(dataDate)}>{formatDataDate(dataDate)}</time>
              </span>
            ) : undefined
          }
          aside={
            <ProviderEvidence
              name={hosting.name}
              subtitle="Reseña editorial"
              rating={hosting.rating}
              rows={rows}
              footer={
                <a href="#subpuntajes" className={`t-small ${linkClass}`}>
                  Cómo se calcula la nota
                </a>
              }
            />
          }
        />

        <Section id="veredicto" density="tight" title="Veredicto">
          <Veredicto name={hosting.name} editorial={hosting.description} pros={hosting.pros} cons={hosting.cons} />
        </Section>

        <Section
          id="subpuntajes"
          tone="paper"
          density="tight"
          className="border-t border-rule"
          title={`Cómo se calcula la nota de ${hosting.name}`}
          lead={
            company ? (
              <>
                Cinco subcriterios con pesos publicados, con los datos de la{' '}
                <Link to={fichaHref!} className={linkClass}>
                  ficha de {company.name}
                </Link>
                . Lo que todavía no medimos dice «sin medir»: nunca lo rellenamos.
              </>
            ) : undefined
          }
        >
          {company ? (
            <ScoreBreakdown
              companyId={company.id}
              companyName={company.name}
              supportRating={company.support_rating ?? null}
              priceRating={company.price_rating ?? null}
              publishedRating={null}
            />
          ) : (
            <Callout tone="note" title={isLoading ? 'Cargando el desglose…' : `Todavía no hay desglose de la nota de ${hosting.name}`} className="my-0 max-w-[62ch]">
              {!isLoading && (
                <p>
                  Este proveedor aún no tiene una ficha con mediciones en nuestro catálogo.{' '}
                  <Link to="/catalogo" className={linkClass}>
                    Ver el catálogo de proveedores
                  </Link>
                </p>
              )}
            </Callout>
          )}
        </Section>

        <Section
          id="reputacion"
          density="tight"
          className="border-t border-rule"
          title="Reputación"
          lead={
            <>
              Análisis automático de Reclamos.cl, reclamos de usuarios verificados por correo y reseñas de clientes confirmados.
              Los criterios están en nuestra{' '}
              <Link to="/metodologia#reputacion" className={linkClass}>
                metodología
              </Link>
              .
            </>
          }
        >
          {company ? (
            <ReputationCard companyId={company.id} companyName={company.name} showTitle={false} />
          ) : (
            !isLoading && (
              <p className="t-small text-ink-2">Todavía no tenemos datos de reputación de {hosting.name} en el catálogo.</p>
            )
          )}
        </Section>

        <Section id="sigue-comparando" tone="paper" density="tight" className="border-t border-rule" title="Sigue comparando">
          <div className="flex flex-wrap gap-3">
            {fichaHref && (
              <Button asChild variant="default">
                <Link to={fichaHref}>Ver ficha</Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to="/comparativa">Comparar</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/ranking">Ver el ranking</Link>
            </Button>
          </div>
        </Section>
      </main>

      <StickyCTA />
      <Footer />
    </>
  );
};

export default Resena;
