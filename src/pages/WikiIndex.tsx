import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlossarySearch from '@/components/GlossarySearch';
import TermCard from '@/components/TermCard';
import RightRailOffer from '@/components/RightRailOffer';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { wikiTerms, wikiCategories, WikiTerm } from '@/data/wiki/terms';
import { BookOpen, TrendingUp, Zap } from 'lucide-react';

const WikiIndex: React.FC = () => {
  const [searchResults, setSearchResults] = useState<WikiTerm[]>(wikiTerms);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [featuredTerms] = useState<WikiTerm[]>(
    wikiTerms.filter(term => 
      ['wordpress', 'elementor', 'woocommerce', 'litespeed-cache', 'moodle', 'ai-wordpress', 'http3-quic'].includes(term.slug)
    ).slice(0, 6)
  );

  const handleSearchResults = (results: WikiTerm[]) => {
    setSearchResults(results);
    setSelectedCategory(null); // Clear category when searching
  };

  const handleCategoryClick = (categoryId: string) => {
    const categoryResults = wikiTerms.filter(t => t.category === categoryId);
    setSearchResults(categoryResults);
    setSelectedCategory(categoryId);
    // Scroll to results section
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchResults(wikiTerms);
    setSelectedCategory(null);
  };

  const trendingTerms = wikiTerms.filter(term => term.category === 'trends-2025').slice(0, 4);
  const performanceTerms = wikiTerms.filter(term => term.category === 'performance').slice(0, 4);

  const breadcrumbItems = [
    { name: 'Inicio', href: '/' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Wiki de Hosting - Glosario Completo de WordPress, Moodle, Joomla y Tendencias 2025 | HostingChile</title>
        <meta 
          name="description" 
          content="Glosario completo de hosting, WordPress, Moodle, Joomla, Elementor, WooCommerce y tendencias 2025. Guías técnicas para elegir el mejor hosting en Chile." 
        />
        <meta name="keywords" content="wiki hosting, wordpress, moodle, joomla, elementor, woocommerce, litespeed, cache, seguridad, hosting chile" />
        <link rel="canonical" href="https://hostingchile.net/wiki" />
        
        {/* Schema.org DefinedTermSet */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            "name": "Wiki de Hosting Chile",
            "description": "Glosario completo de términos de hosting, WordPress, CMS y tecnologías web",
            "url": "https://hostingchile.net/wiki",
            "publisher": {
              "@type": "Organization",
              "name": "HostingChile",
              "url": "https://hostingchile.net"
            },
            "hasDefinedTerm": wikiTerms.map(term => ({
              "@type": "DefinedTerm",
              "name": term.title,
              "description": term.shortDefinition,
              "url": `https://hostingchile.net/wiki/${term.slug}`,
              "inDefinedTermSet": "https://hostingchile.net/wiki"
            }))
          })}
        </script>
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <SEOBreadcrumbs items={breadcrumbItems} pageName="Wiki de Hosting" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* Contenido principal */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <BookOpen className="h-4 w-4" />
                Wiki de Hosting Chile
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Glosario Completo de Hosting
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Todo sobre WordPress, Moodle, Joomla, Elementor, WooCommerce y las últimas tendencias tecnológicas 2025. 
                Encuentra el hosting perfecto para cada tecnología.
              </p>
            </div>

            {/* Búsqueda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Buscar en la Wiki
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GlossarySearch onResults={handleSearchResults} />
              </CardContent>
            </Card>

            {/* Términos destacados (si no hay búsqueda activa) */}
            {searchResults.length === wikiTerms.length && !selectedCategory && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Términos Destacados</h2>
                  <Badge variant="secondary">{featuredTerms.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredTerms.map(term => (
                    <TermCard key={term.id} term={term} variant="compact" />
                  ))}
                </div>
              </section>
            )}

            {/* Categorías populares (si no hay búsqueda activa) */}
            {searchResults.length === wikiTerms.length && !selectedCategory && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold">Explorar por Categorías</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wikiCategories.map(category => (
                    <Link key={category.id} to={`/wiki/categoria/${category.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">{category.icon}</div>
                          <h3 className="font-semibold mb-1">{category.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {wikiTerms.filter(t => t.category === category.id).length} términos
                          </Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Tendencias 2025 (si no hay búsqueda activa) */}
            {searchResults.length === wikiTerms.length && !selectedCategory && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <h2 className="text-2xl font-bold">Tendencias 2025</h2>
                  <Badge variant="default">Nuevo</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendingTerms.map(term => (
                    <TermCard key={term.id} term={term} variant="compact" />
                  ))}
                </div>
              </section>
            )}

            {/* Resultados de búsqueda */}
            <section id="search-results" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {selectedCategory 
                      ? `${wikiCategories.find(c => c.id === selectedCategory)?.name || 'Categoría'}` 
                      : searchResults.length === wikiTerms.length 
                        ? 'Todos los Términos' 
                        : 'Resultados de Búsqueda'}
                  </h2>
                  {selectedCategory && (
                    <Badge variant="secondary" className="text-xs">
                      {wikiCategories.find(c => c.id === selectedCategory)?.icon} Categoría
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {searchResults.length} término{searchResults.length !== 1 ? 's' : ''}
                  </Badge>
                  {(selectedCategory || searchResults.length !== wikiTerms.length) && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Ver todos
                    </Button>
                  )}
                </div>
              </div>

              {searchResults.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="space-y-3">
                      <div className="text-4xl">🔍</div>
                      <h3 className="text-lg font-semibold">No se encontraron resultados</h3>
                      <p className="text-muted-foreground">
                        Intenta con otros términos o explora las categorías disponibles.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {searchResults.map(term => (
                    <TermCard key={term.id} term={term} />
                  ))}
                </div>
              )}
            </section>

            {/* CTA Final */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">¿Necesitas ayuda eligiendo hosting?</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Nuestro equipo especializado te ayuda a encontrar el plan perfecto según tu tecnología y requerimientos.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild>
                      <Link to="/cotiza-hosting">Cotizar mi proyecto</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/ranking">Ver ranking completo</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar derecho */}
          <div className="lg:col-span-1">
            <RightRailOffer termSlug="wiki-index" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WikiIndex;