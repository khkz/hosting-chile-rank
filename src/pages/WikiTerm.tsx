import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import RightRailOffer from '@/components/RightRailOffer';
import StickyCTA from '@/components/StickyCTA';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import HostingPlusCTA from '@/components/HostingPlusCTA';
import TLDRSummary from '@/components/TLDRSummary';
import SimpleFAQ from '@/components/SimpleFAQ';
import TermCard from '@/components/TermCard';
import ReadingLayout, { type TocItem } from '@/components/reading/ReadingLayout';
import Callout from '@/components/system/Callout';
import { CmsTag, LevelTag, WikiCategoryIcon } from '@/components/lectura/wiki';
import { WIKI_MD_COMPONENTS } from '@/components/lectura/wikiMarkdown';
import { markdownToc } from '@/components/lectura/headings';
import TocInline from '@/components/lectura/TocInline';
import { wikiTerms, getRelatedTerms, wikiCategories } from '@/data/wiki/terms';
import { formatDataDate, isoDate } from '@/lib/format';

const WikiTerm: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/wiki" replace />;
  }

  const term = wikiTerms.find(t => t.slug === slug);

  if (!term) {
    return <Navigate to="/wiki" replace />;
  }

  const relatedTerms = getRelatedTerms(term.slug);
  const category = wikiCategories.find(c => c.id === term.category);
  const reqs = term.hostingRequirements ?? [];
  const faqs = term.faq ?? [];
  const errors = term.commonErrors ?? [];
  const links = term.links ?? [];

  // Índice desde los encabezados que de verdad se dibujan (mismas anclas).
  const toc: TocItem[] = [
    { id: 'que-es-termino', label: `¿Qué es ${term.title}?` },
    ...markdownToc(term.longDefinition),
    ...(reqs.length > 0 ? [{ id: 'requisitos-hosting', label: 'Requisitos de hosting' }] : []),
    ...(faqs.length > 0 ? [{ id: 'preguntas-frecuentes', label: 'Preguntas frecuentes' }] : []),
    ...(errors.length > 0 ? [{ id: 'errores-comunes', label: 'Errores comunes' }] : []),
    ...(links.length > 0 ? [{ id: 'enlaces-oficiales', label: 'Enlaces oficiales' }] : []),
  ];

  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Wiki', href: '/wiki' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{term.title} - Wiki | EligeTuHosting.cl</title>
        <meta name="description" content={`${term.shortDefinition} Descubre requisitos de hosting, cuándo usar ${term.title} y recomendaciones de HostingPlus.`} />
        <meta name="keywords" content={`${term.title}, ${term.tags.join(', ')}, hosting, ${term.cms}, chile`} />
        <link rel="canonical" href={`https://eligetuhosting.cl/wiki/${term.slug}`} />

        {/* OpenGraph */}
        <meta property="og:title" content={`${term.title} - Guía Completa de Hosting`} />
        <meta property="og:description" content={term.shortDefinition} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://eligetuhosting.cl/wiki/${term.slug}`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${term.title} - Guía Completa de Hosting`} />
        <meta name="twitter:description" content={term.shortDefinition} />

        {/* Enhanced Schema.org with Article + FAQPage + BreadcrumbList */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "headline": term.title,
                "description": term.shortDefinition,
                "url": `https://eligetuhosting.cl/wiki/${term.slug}`,
                "datePublished": term.lastUpdated || "2026-01-01",
                "dateModified": term.lastUpdated || "2026-01-01",
                "author": { "@type": "Organization", "name": "EligeTuHosting.cl" },
                "publisher": { "@type": "Organization", "name": "EligeTuHosting.cl", "url": "https://eligetuhosting.cl" },
                "mainEntityOfPage": { "@type": "WebPage", "@id": `https://eligetuhosting.cl/wiki/${term.slug}` },
                "keywords": term.tags.join(', ')
              },
              {
                "@type": "DefinedTerm",
                "name": term.title,
                "description": term.shortDefinition,
                "url": `https://eligetuhosting.cl/wiki/${term.slug}`,
                "inDefinedTermSet": { "@type": "DefinedTermSet", "name": "Wiki de Hosting Chile", "url": "https://eligetuhosting.cl/wiki" }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://eligetuhosting.cl" },
                  { "@type": "ListItem", "position": 2, "name": "Wiki", "item": "https://eligetuhosting.cl/wiki" },
                  { "@type": "ListItem", "position": 3, "name": term.title, "item": `https://eligetuhosting.cl/wiki/${term.slug}` }
                ]
              }
            ]
          }) }} />
      </Helmet>

      <Navbar />

      <main>
        <ReadingLayout
          breadcrumbs={<SEOBreadcrumbs items={breadcrumbItems} pageName={term.title} />}
          title={term.title}
          lead={term.shortDefinition}
          meta={
            <>
              {category && (
                <Link
                  to={`/wiki/categoria/${category.id}`}
                  className="inline-flex items-center gap-1.5 text-ink-2 underline decoration-ink/20 underline-offset-[3px] hover:text-ink hover:decoration-ink"
                >
                  <WikiCategoryIcon name={category.icon} className="h-4 w-4 text-ink-3" />
                  {category.name}
                </Link>
              )}
              <CmsTag cms={term.cms} />
              <LevelTag level={term.level} />
              {term.lastUpdated && (
                <span>
                  Actualizado el <time dateTime={isoDate(term.lastUpdated)}>{formatDataDate(term.lastUpdated)}</time>
                </span>
              )}
            </>
          }
          aside={
            // La oferta ocupa la columna fija (como antes, solo en escritorio); el índice va plegable en el cuerpo
            // para que índice y oferta no compitan por el alto de la pantalla.
            <div className="hidden lg:block">
              <RightRailOffer termSlug={term.slug} />
            </div>
          }
          footer={
            <div className="space-y-12">
              {relatedTerms.length > 0 && (
                <section aria-labelledby="relacionados">
                  <h2 id="relacionados" className="t-h3 mb-4 text-ink">
                    Términos relacionados
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {relatedTerms.map((rt, i) => (
                      <TermCard key={`${rt.id}-${i}`} term={rt} variant="compact" />
                    ))}
                  </div>
                </section>
              )}
              <RecommendedByData />
              <div className="t-meta flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  to="/wiki"
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Volver a la wiki
                </Link>
                {term.tags.length > 0 && <span>Etiquetas: {term.tags.join(', ')}</span>}
              </div>
            </div>
          }
        >
          {term.tldr && (
            <div className="not-prose mb-10">
              <TLDRSummary data={term.tldr} />
            </div>
          )}

          <TocInline items={toc} />

          <h2 id="que-es-termino" className="scroll-mt-24">¿Qué es {term.title}?</h2>
          {term.longDefinition ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={WIKI_MD_COMPONENTS}>
              {term.longDefinition}
            </ReactMarkdown>
          ) : (
            <p>{term.shortDefinition}</p>
          )}

          {term.whenToUse && (
            <div className="not-prose">
              <Callout tone="tip" title={`Cuándo usar ${term.title}`}>
                <p>{term.whenToUse}</p>
              </Callout>
            </div>
          )}

          {reqs.length > 0 && (
            <>
              <h2 id="requisitos-hosting" className="scroll-mt-24">Requisitos de hosting</h2>
              <ul>
                {reqs.map((req, i) => (
                  <li key={`${i}-${req}`}>{req}</li>
                ))}
              </ul>
            </>
          )}

          {faqs.length > 0 && (
            <>
              <h2 id="preguntas-frecuentes" className="scroll-mt-24">Preguntas frecuentes</h2>
              <div className="not-prose">
                <SimpleFAQ faqs={faqs} termSlug={term.slug} termTitle={term.title} />
              </div>
            </>
          )}

          {errors.length > 0 && (
            <>
              <h2 id="errores-comunes" className="scroll-mt-24">Errores comunes</h2>
              <ul>
                {errors.map((e, i) => (
                  <li key={`${i}-${e.error}`}>
                    <strong>{e.error}</strong> {e.solution}
                  </li>
                ))}
              </ul>
            </>
          )}

          {links.length > 0 && (
            <>
              <h2 id="enlaces-oficiales" className="scroll-mt-24">Enlaces oficiales y descargas</h2>
              <ul>
                {links.map((link, i) => (
                  <li key={`${i}-${link.url}`}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                      {link.title}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="not-prose mt-12">
            <HostingPlusCTA
              termSlug={term.slug}
              termTitle={term.title}
              plan={term.cta.plan}
              copy={term.cta.copy}
              url={term.cta.url}
              proofPoints={term.proofPoints}
            />
          </div>
        </ReadingLayout>
      </main>

      {/* Barra fija móvil */}
      <StickyCTA />
      <Footer />
    </div>
  );
};

export default WikiTerm;
