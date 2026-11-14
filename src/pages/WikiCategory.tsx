import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TermCard from '@/components/TermCard';
import RightRailOffer from '@/components/RightRailOffer';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import PageHeader from '@/components/system/PageHeader';
import { WikiCategoryIcon } from '@/components/lectura/wiki';
import { wikiTerms, wikiCategories } from '@/data/wiki/terms';
import { formatInteger } from '@/lib/format';

const WikiCategory: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  if (!categoryId) {
    return <Navigate to="/wiki" replace />;
  }

  const category = wikiCategories.find(c => c.id === categoryId);

  if (!category) {
    return <Navigate to="/wiki" replace />;
  }

  const categoryTerms = wikiTerms.filter(term => term.category === categoryId);
  const basic = categoryTerms.filter((t) => t.level === 'basico').length;
  const advanced = categoryTerms.filter((t) => t.level === 'avanzado').length;
  const others = wikiCategories.filter((c) => c.id !== categoryId).slice(0, 6);

  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Wiki', href: '/wiki' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{category.name} - Wiki | EligeTuHosting.cl</title>
        <meta
          name="description"
          content={`${category.description}. Encuentra todos los términos relacionados con ${category.name} y las mejores recomendaciones de hosting.`}
        />
        <meta name="keywords" content={`${category.name.toLowerCase()}, hosting, ${categoryTerms.map(t => t.title.toLowerCase()).join(', ')}`} />
        <link rel="canonical" href={`https://hostingchile.net/wiki/categoria/${categoryId}`} />

        {/* Schema.org CollectionPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${category.name} - Wiki de Hosting`,
            "description": category.description,
            "url": `https://hostingchile.net/wiki/categoria/${categoryId}`,
            "publisher": {
              "@type": "Organization",
              "name": "HostingChile",
              "url": "https://hostingchile.net"
            },
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": categoryTerms.length,
              "itemListElement": categoryTerms.map((term, index) => ({
                "@type": "DefinedTerm",
                "position": index + 1,
                "name": term.title,
                "description": term.shortDefinition,
                "url": `https://hostingchile.net/wiki/${term.slug}`
              }))
            }
          })}
        </script>
      </Helmet>

      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={<SEOBreadcrumbs items={breadcrumbItems} pageName={category.name} />}
          title={category.name}
          lead={`${category.description}. Los términos explican qué es cada cosa, cuándo te sirve y qué pedirle a tu hosting.`}
          meta={
            <>
              <span className="inline-flex items-center gap-1.5">
                <WikiCategoryIcon name={category.icon} className="h-4 w-4 text-ink-3" />
                {formatInteger(categoryTerms.length)} {categoryTerms.length === 1 ? 'término' : 'términos'}
              </span>
              <span>{formatInteger(basic)} de nivel básico</span>
              <span>{formatInteger(advanced)} de nivel avanzado</span>
            </>
          }
        />

        <div className="container py-10 md:py-14">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
            <div className="min-w-0 space-y-14">
              {categoryTerms.length === 0 ? (
                <div className="rounded-xl border border-rule bg-paper p-6 md:p-8">
                  <h2 className="t-h3 text-ink">Esta categoría todavía no tiene términos</h2>
                  <p className="t-body mt-2 text-ink-2">Mientras la completamos, revisa las otras categorías de la wiki.</p>
                  <Button asChild variant="outline" className="mt-5">
                    <Link to="/wiki">Explorar otras categorías</Link>
                  </Button>
                </div>
              ) : (
                <section aria-labelledby="terminos">
                  <h2 id="terminos" className="t-h2 mb-6 text-ink">
                    Todos los términos de {category.name}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {categoryTerms.map((term, i) => (
                      <TermCard key={`${term.id}-${i}`} term={term} />
                    ))}
                  </div>
                </section>
              )}

              <section aria-labelledby="otras">
                <h2 id="otras" className="t-h2 mb-6 text-ink">
                  Explorar otras categorías
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {others.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/wiki/categoria/${c.id}`}
                        className="flex h-full items-start gap-3 rounded-xl border border-rule p-4 transition-colors hover:border-ink/40"
                      >
                        <WikiCategoryIcon name={c.icon} className="mt-0.5" />
                        <span className="min-w-0">
                          <span className="block font-semibold text-ink">{c.name}</span>
                          <span className="t-meta mt-1 block tabular">
                            {formatInteger(wikiTerms.filter((t) => t.category === c.id).length)} términos
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" asChild className="mt-6">
                  <Link to="/wiki">
                    <ArrowLeft aria-hidden />
                    Ver todas las categorías
                  </Link>
                </Button>
              </section>
            </div>

            <div className="min-w-0">
              <div className="lg:sticky lg:top-24">
                <RightRailOffer termSlug={`category-${categoryId}`} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WikiCategory;
