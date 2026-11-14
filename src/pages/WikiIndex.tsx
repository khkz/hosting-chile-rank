import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlossarySearch from '@/components/GlossarySearch';
import TermCard from '@/components/TermCard';
import RightRailOffer from '@/components/RightRailOffer';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import PageHeader from '@/components/system/PageHeader';
import { WikiCategoryIcon } from '@/components/lectura/wiki';
import { wikiTerms, wikiCategories, WikiTerm } from '@/data/wiki/terms';
import { formatInteger } from '@/lib/format';

const FEATURED = ['wordpress', 'elementor', 'woocommerce', 'litespeed-cache', 'moodle', 'ai-wordpress', 'http3-quic'];

const countIn = (categoryId: string) => wikiTerms.filter((t) => t.category === categoryId).length;

const WikiIndex: React.FC = () => {
  const [searchResults, setSearchResults] = useState<WikiTerm[]>(wikiTerms);
  const handleSearchResults = useCallback((results: WikiTerm[]) => setSearchResults(results), []);

  const featuredTerms = wikiTerms.filter((term) => FEATURED.includes(term.slug)).slice(0, 6);
  const trendingTerms = wikiTerms.filter((term) => term.category === 'trends-2026').slice(0, 4);
  const filtering = searchResults.length !== wikiTerms.length;

  const breadcrumbItems = [{ name: 'Inicio', href: '/' }];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Wiki Hosting 2026 | EligeTuHosting.cl</title>
        <meta
          name="description"
          content="Glosario completo de hosting, WordPress, Moodle, Joomla, Elementor, WooCommerce y tendencias 2026. Guías técnicas para elegir el mejor hosting en Chile."
        />
        <meta name="keywords" content="wiki hosting, wordpress, moodle, joomla, elementor, woocommerce, litespeed, cache, seguridad, hosting chile" />
        <link rel="canonical" href="https://eligetuhosting.cl/wiki" />

        {/* Open Graph */}
        <meta property="og:title" content="Wiki Hosting 2026 | EligeTuHosting.cl" />
        <meta property="og:description" content="Glosario completo de hosting, WordPress, Moodle, Joomla, Elementor, WooCommerce y tendencias 2026. Guías técnicas para elegir el mejor hosting en Chile." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eligetuhosting.cl/wiki" />
        <meta property="og:image" content="https://eligetuhosting.cl/images/ranking-comparison.png" />
        <meta property="og:site_name" content="EligeTuHosting.cl" />
        <meta property="og:locale" content="es_CL" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wiki Hosting 2026 | EligeTuHosting.cl" />
        <meta name="twitter:description" content="Glosario completo de hosting, WordPress, Moodle, Joomla, Elementor, WooCommerce y tendencias 2026." />
        <meta name="twitter:image" content="https://eligetuhosting.cl/images/ranking-comparison.png" />

        {/* Schema.org DefinedTermSet */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            "name": "Wiki de Hosting Chile",
            "description": "Glosario completo de términos de hosting, WordPress, CMS y tecnologías web",
            "url": "https://eligetuhosting.cl/wiki",
            "publisher": {
              "@type": "Organization",
              "name": "EligeTuHosting.cl",
              "url": "https://eligetuhosting.cl"
            },
            "hasDefinedTerm": wikiTerms.map(term => ({
              "@type": "DefinedTerm",
              "name": term.title,
              "description": term.shortDefinition,
              "url": `https://eligetuhosting.cl/wiki/${term.slug}`,
              "inDefinedTermSet": "https://eligetuhosting.cl/wiki"
            }))
          })}
        </script>
      </Helmet>

      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={<SEOBreadcrumbs items={breadcrumbItems} pageName="Wiki de Hosting" />}
          title="Glosario Completo de Hosting"
          lead="Términos de hosting, WordPress, Moodle, Joomla, Elementor y WooCommerce explicados en simple: qué son, cuándo te sirven y qué pedirle a tu hosting."
          meta={
            <span>
              {formatInteger(wikiTerms.length)} términos en {formatInteger(wikiCategories.length)} categorías
            </span>
          }
        />

        <div className="container py-10 md:py-14">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
            <div className="min-w-0 space-y-14">
              <section aria-labelledby="buscar" className="rounded-xl border border-rule bg-paper p-5 md:p-6">
                <h2 id="buscar" className="t-h3 mb-4 text-ink">
                  Buscar en la wiki
                </h2>
                <GlossarySearch onResults={handleSearchResults} />
              </section>

              {!filtering && (
                <section aria-labelledby="destacados">
                  <h2 id="destacados" className="t-h2 mb-6 text-ink">
                    Términos destacados
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {featuredTerms.map((term, i) => (
                      <TermCard key={`${term.id}-${i}`} term={term} variant="compact" />
                    ))}
                  </div>
                </section>
              )}

              {!filtering && (
                <section aria-labelledby="categorias">
                  <h2 id="categorias" className="t-h2 mb-6 text-ink">
                    Explorar por categorías
                  </h2>
                  <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {wikiCategories.map((category) => (
                      <li key={category.id}>
                        <Link
                          to={`/wiki/categoria/${category.id}`}
                          className="flex h-full gap-3 rounded-xl border border-rule p-4 transition-colors hover:border-ink/40"
                        >
                          <WikiCategoryIcon name={category.icon} className="mt-0.5" />
                          <span className="min-w-0">
                            <span className="block font-semibold text-ink">{category.name}</span>
                            <span className="t-small mt-0.5 block text-ink-2">{category.description}</span>
                            <span className="t-meta mt-2 block tabular">{formatInteger(countIn(category.id))} términos</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {!filtering && trendingTerms.length > 0 && (
                <section aria-labelledby="tendencias">
                  <h2 id="tendencias" className="t-h2 mb-6 text-ink">
                    Tendencias 2026
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {trendingTerms.map((term, i) => (
                      <TermCard key={`${term.id}-${i}`} term={term} variant="compact" />
                    ))}
                  </div>
                </section>
              )}

              <section id="search-results" aria-labelledby="resultados" className="scroll-mt-24">
                <h2 id="resultados" className="t-h2 mb-6 text-ink">
                  {filtering ? 'Resultados de búsqueda' : 'Todos los términos'}
                </h2>
                {searchResults.length === 0 ? (
                  <div className="rounded-xl border border-rule bg-paper p-6 md:p-8">
                    <p className="t-h3 text-ink">No encontramos términos con esa búsqueda</p>
                    <p className="t-body mt-2 max-w-[62ch] text-ink-2">
                      Prueba con otra palabra, revisa la ortografía o usa «Limpiar filtros» para volver a ver los{' '}
                      {formatInteger(wikiTerms.length)} términos.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {searchResults.map((term, i) => (
                      <TermCard key={`${term.id}-${i}`} term={term} />
                    ))}
                  </div>
                )}
              </section>

              <section aria-labelledby="ayuda" className="rounded-xl border border-rule bg-paper p-6 md:p-8">
                <h2 id="ayuda" className="t-h3 text-ink">
                  ¿Necesitas ayuda eligiendo hosting?
                </h2>
                <p className="t-body mt-2 max-w-[62ch] text-ink-2">
                  Nuestro equipo especializado te ayuda a encontrar el plan perfecto según tu tecnología y requerimientos.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild variant="brand">
                    <Link to="/cotiza-hosting">Cotizar hosting</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/ranking">Ver el ranking</Link>
                  </Button>
                </div>
              </section>
            </div>

            <div className="min-w-0">
              <div className="lg:sticky lg:top-24">
                <RightRailOffer termSlug="wiki-index" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WikiIndex;
