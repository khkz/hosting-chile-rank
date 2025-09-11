import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TermCard from '@/components/TermCard';
import RightRailOffer from '@/components/RightRailOffer';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { wikiTerms, wikiCategories } from '@/data/wiki/terms';
import { ArrowLeft, BookOpen } from 'lucide-react';

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

  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Wiki', href: '/wiki' }
  ];

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto px-4 py-8">
        <SEOBreadcrumbs items={breadcrumbItems} pageName={category.name} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* Contenido principal */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header de categoría */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/wiki">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver a Wiki
                  </Link>
                </Button>
              </div>
              
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <BookOpen className="h-4 w-4" />
                  Categoría de Wiki
                </div>
                
                <div className="space-y-2">
                  <div className="text-6xl">{category.icon}</div>
                  <h1 className="text-4xl md:text-5xl font-bold">{category.name}</h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {category.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    {categoryTerms.length} término{categoryTerms.length !== 1 ? 's' : ''} disponible{categoryTerms.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Estadísticas de la categoría */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{categoryTerms.length}</div>
                    <div className="text-sm text-muted-foreground">Términos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {categoryTerms.filter(t => t.level === 'basico').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Nivel Básico</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {categoryTerms.filter(t => t.level === 'avanzado').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Nivel Avanzado</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Términos de la categoría */}
            {categoryTerms.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="space-y-3">
                    <div className="text-4xl">📝</div>
                    <h3 className="text-lg font-semibold">No hay términos disponibles</h3>
                    <p className="text-muted-foreground">
                      Esta categoría aún no tiene términos disponibles. ¡Vuelve pronto para más contenido!
                    </p>
                    <Button asChild>
                      <Link to="/wiki">Explorar otras categorías</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold">
                  Todos los términos de {category.name}
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {categoryTerms.map(term => (
                    <TermCard key={term.id} term={term} />
                  ))}
                </div>
              </section>
            )}

            {/* Otras categorías relacionadas */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Explorar otras categorías</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {wikiCategories
                  .filter(c => c.id !== categoryId)
                  .slice(0, 6)
                  .map(otherCategory => (
                    <Card 
                      key={otherCategory.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => window.location.href = `/wiki/categoria/${otherCategory.id}`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{otherCategory.icon}</div>
                        <h3 className="font-semibold mb-1 text-sm">{otherCategory.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {wikiTerms.filter(t => t.category === otherCategory.id).length} términos
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
              <div className="text-center">
                <Button variant="outline" asChild>
                  <Link to="/wiki">Ver todas las categorías</Link>
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar derecho */}
          <div className="lg:col-span-1">
            <RightRailOffer termSlug={`category-${categoryId}`} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WikiCategory;