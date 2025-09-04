import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RightRailOffer from '@/components/RightRailOffer';
import StickyCTA from '@/components/StickyCTA';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { wikiTerms, getRelatedTerms, wikiCategories } from '@/data/wiki/terms';
import { buildHostingPlusURL, trackCTAClick } from '@/utils/cta';
import { ExternalLink, Calendar, Tag, Server, ChevronRight } from 'lucide-react';

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

  const handleCTAClick = (type: 'primary' | 'secondary' = 'primary') => {
    trackCTAClick(term.slug, type);
  };

  const primaryCTAUrl = buildHostingPlusURL(term.cta.url, {
    content: term.slug,
    term: term.title.toLowerCase()
  });

  const secondaryCTAUrl = buildHostingPlusURL(
    'https://clientes.hostingplus.cl/submitticket.php?step=2&deptid=4',
    { content: `${term.slug}-secondary` }
  );

  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Wiki', href: '/wiki' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{term.title} - Guía Completa de Hosting | Wiki HostingChile</title>
        <meta name="description" content={`${term.shortDefinition} Descubre requisitos de hosting, cuándo usar ${term.title} y recomendaciones de HostingPlus.`} />
        <meta name="keywords" content={`${term.title}, ${term.tags.join(', ')}, hosting, ${term.cms}, chile`} />
        <link rel="canonical" href={`https://hostingchile.net/wiki/${term.slug}`} />
        
        {/* Schema.org DefinedTerm */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            "name": term.title,
            "description": term.shortDefinition,
            "url": `https://hostingchile.net/wiki/${term.slug}`,
            "inDefinedTermSet": {
              "@type": "DefinedTermSet",
              "name": "Wiki de Hosting Chile",
              "url": "https://hostingchile.net/wiki"
            },
            "publisher": {
              "@type": "Organization",
              "name": "HostingChile",
              "url": "https://hostingchile.net"
            },
            "dateModified": term.lastUpdated || "2025-01-01"
          })}
        </script>
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <SEOBreadcrumbs items={breadcrumbItems} pageName={term.title} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* Contenido principal */}
          <article className="lg:col-span-3 space-y-8">
            {/* Header del término */}
            <header className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {category && (
                  <>
                    <span className="flex items-center gap-1">
                      {category.icon} {category.name}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
                <Badge variant="secondary" className="capitalize">
                  {term.cms}
                </Badge>
                <Badge 
                  variant={term.level === 'basico' ? 'default' : term.level === 'medio' ? 'secondary' : 'destructive'}
                  className="capitalize"
                >
                  {term.level}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold">{term.title}</h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {term.shortDefinition}
              </p>

              {term.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {term.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            {/* TL;DR */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  ⚡ TL;DR (Resumen ejecutivo)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{term.shortDefinition}</p>
                {term.whenToUse && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    <strong>Cuándo usar:</strong> {term.whenToUse}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Contenido principal */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">¿Qué es {term.title}?</h2>
              
              {term.longDefinition ? (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({children}) => <h3 className="text-xl font-bold mt-8 mb-4">{children}</h3>,
                      h3: ({children}) => <h4 className="text-lg font-semibold mt-6 mb-3">{children}</h4>,
                      p: ({children}) => <p className="text-base leading-relaxed mb-4">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>,
                      li: ({children}) => <li className="text-base leading-relaxed">{children}</li>,
                      strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic bg-muted/50 p-4 rounded-r-lg my-4">{children}</blockquote>,
                      img: () => null, // Hide all images
                      em: ({children}) => <em className="italic">{children}</em>,
                    }}
                  >
                    {term.longDefinition}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-lg leading-relaxed">{term.shortDefinition}</p>
              )}

              {term.whenToUse && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">💡 Cuándo usar {term.title}</h3>
                  <p>{term.whenToUse}</p>
                </div>
              )}
            </section>

            {/* Requisitos de hosting */}
            {term.hostingRequirements && term.hostingRequirements.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Server className="h-6 w-6" />
                  Requisitos de Hosting
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {term.hostingRequirements.map((req, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* CTA Principal - Recomendado HostingPlus */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
                      ⭐ Recomendado: HostingPlus
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      Hosting Optimizado para {term.title}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {term.cta.copy}
                    </p>
                  </div>

                  {term.proofPoints.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {term.proofPoints.map((point, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      size="lg"
                      onClick={() => {
                        handleCTAClick('primary');
                        window.open(primaryCTAUrl, '_blank');
                      }}
                    >
                      Contratar {term.cta.plan}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => {
                        handleCTAClick('secondary');
                        window.open(secondaryCTAUrl, '_blank');
                      }}
                    >
                      Cotizar mi proyecto
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    ⭐ 4.8/5 en Google Reviews • +10,000 clientes • Soporte 24/7
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Términos relacionados */}
            {relatedTerms.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold">Términos Relacionados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedTerms.map(relatedTerm => (
                    <Card key={relatedTerm.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Link 
                            to={`/wiki/${relatedTerm.slug}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {relatedTerm.title}
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {relatedTerm.shortDefinition}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs capitalize">
                              {relatedTerm.cms}
                            </Badge>
                            <Link 
                              to={`/wiki/${relatedTerm.slug}`}
                              className="text-xs text-primary hover:text-primary/80"
                            >
                              Leer más →
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Metadata */}
            <footer className="text-sm text-muted-foreground border-t pt-4">
              <div className="flex items-center gap-4">
                {term.lastUpdated && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Actualizado: {term.lastUpdated}</span>
                  </div>
                )}
                <Separator orientation="vertical" className="h-4" />
                <Link to="/wiki" className="hover:text-foreground transition-colors">
                  ← Volver a la Wiki
                </Link>
              </div>
            </footer>
          </article>

          {/* Sidebar derecho - Solo desktop */}
          <aside className="lg:col-span-1 hidden lg:block">
            <RightRailOffer termSlug={term.slug} />
          </aside>
        </div>
      </main>

      {/* Sticky CTA móvil */}
      <StickyCTA />

      <Footer />
    </div>
  );
};

export default WikiTerm;