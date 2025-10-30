import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Shield, Zap, Server, Database, TrendingUp, FileText, Calculator } from 'lucide-react';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';

const RecursosHosting = () => {
  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Recursos', href: '/recursos-hosting-chile' }
  ];

  const guias = [
    {
      title: 'Guía Completa para Elegir Hosting',
      description: 'Todo lo que necesitas saber para tomar la mejor decisión',
      icon: BookOpen,
      path: '/guia-completa-elegir-hosting-chile',
      category: 'Fundamentos'
    },
    {
      title: 'Errores Comunes al Elegir Hosting',
      description: 'Evita los 8 errores más costosos que cometen los usuarios',
      icon: Shield,
      path: '/errores-comunes-hosting-chile',
      category: 'Fundamentos'
    },
    {
      title: 'Mejor Hosting WordPress Chile',
      description: 'Ranking especializado para sitios WordPress',
      icon: Server,
      path: '/mejor-hosting-wordpress-chile',
      category: 'Especializados'
    },
    {
      title: 'Mejor Hosting E-commerce Chile',
      description: 'Hosting optimizado para tiendas online',
      icon: TrendingUp,
      path: '/mejor-hosting-ecommerce-chile',
      category: 'Especializados'
    },
    {
      title: 'Guía para Elegir VPS',
      description: 'Cuándo y cómo migrar a un servidor virtual privado',
      icon: Server,
      path: '/guia-elegir-vps-chile',
      category: 'Avanzado'
    },
    {
      title: 'Guía para Elegir Servidor Dedicado',
      description: 'Máximo rendimiento para proyectos enterprise',
      icon: Database,
      path: '/guia-elegir-servidor-dedicado-chile',
      category: 'Avanzado'
    },
    {
      title: 'Guía de Seguridad Web',
      description: 'Protege tu sitio web contra amenazas comunes',
      icon: Shield,
      path: '/guia-seguridad-web-chile',
      category: 'Seguridad'
    },
    {
      title: 'Guía para Elegir SSL',
      description: 'Certificados SSL y HTTPS para tu sitio',
      icon: Shield,
      path: '/guia-elegir-ssl-chile',
      category: 'Seguridad'
    },
    {
      title: 'Guía para Elegir CDN',
      description: 'Acelera tu sitio con redes de distribución de contenido',
      icon: Zap,
      path: '/guia-elegir-cdn-chile',
      category: 'Performance'
    },
    {
      title: 'Guía para Migrar Hosting',
      description: 'Cambia de hosting sin perder tráfico ni datos',
      icon: FileText,
      path: '/guia-migrar-hosting-chile',
      category: 'Migraciones'
    },
    {
      title: 'Guía Hosting WordPress',
      description: 'Optimización específica para WordPress',
      icon: BookOpen,
      path: '/guia-hosting-wordpress-chile',
      category: 'WordPress'
    }
  ];

  const herramientas = [
    {
      title: 'Calculadora TCO',
      description: 'Calcula el costo total de propiedad de tu hosting',
      icon: Calculator,
      path: '/calculadora-tco-hosting'
    },
    {
      title: 'Comparador de Hosting',
      description: 'Compara características y precios lado a lado',
      icon: TrendingUp,
      path: '/comparativa'
    },
    {
      title: 'Monitoreo de Uptime',
      description: 'Datos en tiempo real de disponibilidad de proveedores',
      icon: Zap,
      path: '/monitoreo-uptime-hosting-chile'
    }
  ];

  const categorias = Array.from(new Set(guias.map(g => g.category)));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <DynamicMetaTags
        title="Recursos y Guías de Hosting Chile 2025"
        description="Centro completo de recursos: guías, comparativas, herramientas y datos verificables para elegir el mejor hosting en Chile. Información actualizada y gratuita."
        keywords="recursos hosting chile, guías hosting, comparador hosting, calculadora hosting, monitoreo uptime"
      />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Recursos y Guías de Hosting Chile",
            "description": "Centro completo de recursos para elegir hosting en Chile",
            "url": "https://eligetuhosting.cl/recursos-hosting-chile",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": guias.length + herramientas.length,
              "itemListElement": [
                ...guias.map((guia, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Article",
                    "name": guia.title,
                    "description": guia.description,
                    "url": `https://eligetuhosting.cl${guia.path}`
                  }
                })),
                ...herramientas.map((tool, index) => ({
                  "@type": "ListItem",
                  "position": guias.length + index + 1,
                  "item": {
                    "@type": "WebApplication",
                    "name": tool.title,
                    "description": tool.description,
                    "url": `https://eligetuhosting.cl${tool.path}`
                  }
                }))
              ]
            }
          })}
        </script>
      </Helmet>

      <Navbar />
      <SEOBreadcrumbs items={breadcrumbItems} />

      <main className="flex-grow container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Centro de Recursos de Hosting Chile
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Guías completas, herramientas gratuitas y datos verificables para tomar la mejor decisión de hosting
          </p>
        </header>

        {/* Herramientas destacadas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Herramientas Gratuitas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {herramientas.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.path} to={tool.path}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Guías por categoría */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Guías Completas</h2>
          {categorias.map(categoria => (
            <div key={categoria} className="mb-10">
              <h3 className="text-2xl font-semibold mb-4 text-primary">{categoria}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guias
                  .filter(guia => guia.category === categoria)
                  .map((guia) => {
                    const Icon = guia.icon;
                    return (
                      <Link key={guia.path} to={guia.path}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                          <CardHeader>
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{guia.title}</CardTitle>
                            <CardDescription>{guia.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Necesitas ayuda personalizada?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nuestro equipo puede ayudarte a encontrar la solución perfecta para tu proyecto
          </p>
          <Link to="/contacto">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Contactar un Experto
            </button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RecursosHosting;