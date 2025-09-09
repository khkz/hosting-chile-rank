import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RightRailOffer from '@/components/RightRailOffer';
import StickyCTA from '@/components/StickyCTA';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import CodeBlock from '@/components/CodeBlock';
import HostingPlusCTA from '@/components/HostingPlusCTA';
import TLDRSummary from '@/components/TLDRSummary';
import SimpleFAQ from '@/components/SimpleFAQ';
import { wikiTerms, getRelatedTerms, wikiCategories } from '@/data/wiki/terms';
import { Calendar, Tag, Server, ChevronRight, Clock, ListOrdered, ExternalLink } from 'lucide-react';

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
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "headline": term.title,
                "description": term.shortDefinition,
                "url": `https://eligetuhosting.cl/wiki/${term.slug}`,
                "datePublished": term.lastUpdated || "2025-01-01",
                "dateModified": term.lastUpdated || "2025-01-01",
                "author": {
                  "@type": "Organization",
                  "name": "EligeTuHosting.cl"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "EligeTuHosting.cl",
                  "url": "https://eligetuhosting.cl"
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `https://eligetuhosting.cl/wiki/${term.slug}`
                },
                "keywords": term.tags.join(', ')
              },
              {
                "@type": "DefinedTerm",
                "name": term.title,
                "description": term.shortDefinition,
                "url": `https://eligetuhosting.cl/wiki/${term.slug}`,
                "inDefinedTermSet": {
                  "@type": "DefinedTermSet",
                  "name": "Wiki de Hosting Chile",
                  "url": "https://eligetuhosting.cl/wiki"
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Inicio",
                    "item": "https://eligetuhosting.cl"
                  },
                  {
                    "@type": "ListItem", 
                    "position": 2,
                    "name": "Wiki",
                    "item": "https://eligetuhosting.cl/wiki"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": term.title,
                    "item": `https://eligetuhosting.cl/wiki/${term.slug}`
                  }
                ]
              }
            ]
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

            {/* Official Links */}
            {term.links && term.links.length > 0 && (
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <ExternalLink className="h-5 w-5" />
                    Enlaces Oficiales y Descargas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {term.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-background/60 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                      >
                        <ExternalLink className="h-4 w-4 text-primary group-hover:text-primary/80" />
                        <span className="text-sm font-medium text-foreground group-hover:text-primary">
                          {link.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TL;DR Enhanced */}
            {term.tldr && (
              <TLDRSummary data={term.tldr} />
            )}

            {/* Table of Contents */}
            {term.toc && term.toc.length > 0 && (
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ListOrdered className="h-5 w-5" />
                    Tabla de Contenidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {term.toc.map((item, index) => (
                      <li key={index} className="text-sm">
                        <a 
                          href={`#${item.anchor}`}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          {index + 1}. {item.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Contenido principal */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">¿Qué es {term.title}?</h2>
              
              {term.longDefinition ? (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({children, ...props}) => {
                        const text = String(children);
                        // Extraer ID de la sintaxis {#id} al final del texto
                        const idMatch = text.match(/\{#([^}]+)\}$/);
                        const id = idMatch ? idMatch[1] : text.toLowerCase().replace(/[^a-z0-9\s]+/g, '').replace(/\s+/g, '-');
                        const cleanText = text.replace(/\s*\{#[^}]+\}\s*$/g, '').trim();
                        // No renderizar si el texto está vacío después de limpiar
                        if (!cleanText) return null;
                        return <h3 id={id} className="text-xl font-bold mt-8 mb-4 scroll-mt-20" {...props}>{cleanText}</h3>;
                      },
                      h3: ({children, ...props}) => {
                        const text = String(children);
                        // Extraer ID de la sintaxis {#id} al final del texto
                        const idMatch = text.match(/\{#([^}]+)\}$/);
                        const id = idMatch ? idMatch[1] : text.toLowerCase().replace(/[^a-z0-9\s]+/g, '').replace(/\s+/g, '-');
                        const cleanText = text.replace(/\s*\{#[^}]+\}\s*$/g, '').trim();
                        // No renderizar si el texto está vacío después de limpiar
                        if (!cleanText) return null;
                        return <h4 id={id} className="text-lg font-semibold mt-6 mb-3 scroll-mt-20" {...props}>{cleanText}</h4>;
                      },
                      p: ({children}) => <p className="text-base leading-relaxed mb-4">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>,
                      li: ({children}) => <li className="text-base leading-relaxed">{children}</li>,
                      strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic bg-muted/50 p-4 rounded-r-lg my-4">{children}</blockquote>,
                      img: () => null, // Hide all images
                      em: ({children}) => <em className="italic">{children}</em>,
                      code: ({className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        return isInline ? (
                          <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                            {children}
                          </code>
                        ) : (
                          <CodeBlock language={match[1]} className="my-4">
                            {String(children).replace(/\n$/, '')}
                          </CodeBlock>
                        );
                      },
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

            {/* FAQ Section */}
            {term.faq && term.faq.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Preguntas Frecuentes</h2>
                <SimpleFAQ 
                  faqs={term.faq}
                  termSlug={term.slug}
                  termTitle={term.title}
                />
              </section>
            )}

            {/* Common Errors Section */}
            {term.commonErrors && term.commonErrors.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">❌ Errores Comunes</h2>
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {term.commonErrors.map((error, idx) => (
                        <li key={idx} className="flex gap-3">
                          <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0 mt-2"></div>
                          <div>
                            <strong className="text-destructive">{error.error}</strong>
                            <p className="text-sm text-muted-foreground mt-1">{error.solution}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* CTA Principal - Recomendado HostingPlus */}
            <HostingPlusCTA
              termSlug={term.slug}
              termTitle={term.title}
              plan={term.cta.plan}
              copy={term.cta.copy}
              url={term.cta.url}
              proofPoints={term.proofPoints}
            />

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