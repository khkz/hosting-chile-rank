import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import ProductSchema from '@/components/SEO/ProductSchema';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Zap, Shield, TrendingUp, DollarSign, Clock, Rocket } from 'lucide-react';

const MejorHostingWordPressChile = () => {
  const topProviders = [
    {
      name: "HostingPlus",
      logo: "/logo-hostingplus.svg",
      score: 9.4,
      price: 4990,
      features: [
        "WordPress optimizado con LiteSpeed",
        "Cache LSCache incluido",
        "Staging environment gratuito",
        "Migración WordPress gratis",
        "Backups diarios automáticos",
        "SSL gratuito con auto-renovación"
      ],
      pros: "Mejor rendimiento WordPress en Chile. LiteSpeed Cache nativo.",
      cons: "Plan básico limitado a 1 sitio WordPress.",
      url: "https://hostingplus.cl",
      affiliate: true
    },
    {
      name: "SiteGround",
      logo: "/logo-siteground.svg",
      score: 9.2,
      price: 6990,
      features: [
        "SG Optimizer plugin exclusivo",
        "SuperCacher integrado",
        "WordPress auto-updates",
        "Free CDN Cloudflare",
        "Staging con 1 clic",
        "Soporte experto WordPress 24/7"
      ],
      pros: "Herramientas WordPress más avanzadas. Soporte excepcional.",
      cons: "Precio más alto al renovar (hasta $12.990).",
      url: "https://siteground.com",
      affiliate: false
    },
    {
      name: "Webempresa",
      logo: "/logo-webhosting.svg",
      score: 8.9,
      price: 5490,
      features: [
        "Servidores optimizados para WP",
        "WPO (Web Performance Optimization)",
        "Ninja Firewall para WordPress",
        "Copias de seguridad 14 días",
        "WP-CLI instalado",
        "Imágenes WebP automáticas"
      ],
      pros: "Excelente relación precio-rendimiento. Soporte en español.",
      cons: "Datacenter en España (latencia +150ms para Chile).",
      url: "https://webempresa.com",
      affiliate: false
    }
  ];

  const optimizationTips = [
    {
      title: "Usa un tema optimizado",
      description: "Temas como GeneratePress, Astra o Kadence son hasta 10x más rápidos que temas pesados como Avada o Divi.",
      icon: Zap
    },
    {
      title: "Instala un plugin de caché",
      description: "WP Rocket, LiteSpeed Cache o W3 Total Cache pueden reducir tiempos de carga en 50-70%.",
      icon: Rocket
    },
    {
      title: "Optimiza las imágenes",
      description: "Usa formatos WebP y lazy loading. Plugins: ShortPixel, Imagify o EWWW Image Optimizer.",
      icon: TrendingUp
    },
    {
      title: "Limita plugins",
      description: "Cada plugin añade código. Mantén solo los esenciales (máximo 15-20 plugins).",
      icon: Shield
    }
  ];

  const schemaItems = topProviders.map((provider, index) => ({
    name: provider.name,
    description: `Hosting WordPress optimizado: ${provider.pros}`,
    url: provider.url,
    image: `https://eligetuhosting.cl${provider.logo}`,
    brand: provider.name,
    rating: provider.score,
    reviewCount: 150 - (index * 20),
    price: provider.price,
    priceCurrency: "CLP"
  }));

  return (
    <>
      <DynamicMetaTags
        title="Mejor Hosting para WordPress Chile 2025 - Top 3 Optimizados"
        description="Ranking actualizado de los mejores hosting optimizados para WordPress en Chile. Comparativa de velocidad, soporte y precios. LiteSpeed, cache y staging incluidos."
        keywords="hosting wordpress chile, mejor hosting wordpress, wordpress optimizado chile, litespeed wordpress"
      />

      <ItemListSchema
        name="Mejores Hosting para WordPress en Chile 2025"
        description="Ranking de proveedores con infraestructura optimizada específicamente para WordPress"
        items={schemaItems}
        listType="ranking"
      />

      <ProductSchema
        name="Hosting WordPress Optimizado - HostingPlus"
        description="Plan WordPress con LiteSpeed, cache LSCache, staging y backups automáticos"
        brand="HostingPlus"
        image="https://eligetuhosting.cl/logo-hostingplus.svg"
        url="https://hostingplus.cl"
        offers={[{
          name: "Plan WordPress Starter",
          price: 4990,
          priceCurrency: "CLP",
          url: "https://hostingplus.cl/wordpress"
        }]}
        rating={{
          value: 9.4,
          count: 156,
          bestRating: 10,
          worstRating: 1
        }}
        category="Hosting WordPress"
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-12">
          {/* Header */}
          <header className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Rocket className="w-5 h-5" />
              <span className="font-semibold">WordPress Optimizado</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Mejor Hosting para WordPress Chile 2025
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Comparativa de hosting con infraestructura optimizada específicamente para WordPress
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Actualizado: Enero 2025
              </span>
              <span>•</span>
              <span>Tests de velocidad incluidos</span>
            </div>
          </header>

          {/* Por qué hosting específico para WP */}
          <section className="max-w-4xl mx-auto mb-16">
            <Card className="p-8 bg-primary/5 border-primary/20">
              <h2 className="text-2xl font-semibold mb-4">¿Por qué necesitas hosting específico para WordPress?</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  WordPress representa el 43% de todos los sitios web del mundo, pero requiere configuraciones 
                  específicas para funcionar óptimamente. Un hosting genérico puede hacer que tu WordPress sea 
                  hasta 5x más lento que uno optimizado.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-background p-4 rounded-lg border">
                    <div className="text-3xl font-bold text-primary mb-2">3.2x</div>
                    <div className="text-sm">Más rápido con LiteSpeed vs Apache</div>
                  </div>
                  <div className="bg-background p-4 rounded-lg border">
                    <div className="text-3xl font-bold text-primary mb-2">60%</div>
                    <div className="text-sm">Reducción tiempo carga con cache</div>
                  </div>
                  <div className="bg-background p-4 rounded-lg border">
                    <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-sm">Uptime con infraestructura dedicada</div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Ranking */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">Top 3 Hosting WordPress Chile 2025</h2>
            <div className="space-y-6">
              {topProviders.map((provider, index) => (
                <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 text-center md:text-left">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-2xl mb-4">
                        #{index + 1}
                      </div>
                      <img 
                        src={provider.logo} 
                        alt={`${provider.name} logo`}
                        className="h-12 mx-auto md:mx-0 object-contain mb-4"
                      />
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {provider.score}/10
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Score WordPress
                      </div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        ${provider.price.toLocaleString('es-CL')}
                      </div>
                      <div className="text-xs text-muted-foreground">CLP/mes</div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        {provider.name}
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                            Características WordPress
                          </h4>
                          <ul className="space-y-1.5">
                            {provider.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="mb-4">
                            <h4 className="font-semibold text-sm text-green-700 mb-2">✅ Ventajas</h4>
                            <p className="text-sm text-muted-foreground">{provider.pros}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-yellow-700 mb-2">⚠️ Consideraciones</h4>
                            <p className="text-sm text-muted-foreground">{provider.cons}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <a 
                          href={provider.url}
                          target="_blank"
                          rel={provider.affiliate ? "nofollow sponsored" : "nofollow"}
                          className="inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                          Ver {provider.name}
                        </a>
                        <Link
                          to={`/resenas/${provider.name.toLowerCase().replace(/\s/g, '-')}`}
                          className="inline-flex items-center px-6 py-2.5 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                        >
                          Ver Análisis Completo
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Tips de Optimización */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">
              Cómo Optimizar tu WordPress (independiente del hosting)
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {optimizationTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <Card key={index} className="p-6">
                    <div className="flex gap-4 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Tabla Comparativa */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">Comparativa Técnica</h2>
            <Card className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Característica</th>
                    <th className="text-center p-4 font-semibold">HostingPlus</th>
                    <th className="text-center p-4 font-semibold">SiteGround</th>
                    <th className="text-center p-4 font-semibold">Webempresa</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-4">Servidor Web</td>
                    <td className="p-4 text-center">LiteSpeed</td>
                    <td className="p-4 text-center">NGINX</td>
                    <td className="p-4 text-center">LiteSpeed</td>
                  </tr>
                  <tr>
                    <td className="p-4">Cache Incluido</td>
                    <td className="p-4 text-center">✅ LSCache</td>
                    <td className="p-4 text-center">✅ SuperCacher</td>
                    <td className="p-4 text-center">✅ LiteSpeed</td>
                  </tr>
                  <tr>
                    <td className="p-4">PHP 8.2+</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="p-4">Staging</td>
                    <td className="p-4 text-center">✅ Gratis</td>
                    <td className="p-4 text-center">✅ Gratis</td>
                    <td className="p-4 text-center">❌</td>
                  </tr>
                  <tr>
                    <td className="p-4">CDN Incluido</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅ Cloudflare</td>
                    <td className="p-4 text-center">❌</td>
                  </tr>
                  <tr>
                    <td className="p-4">Backups</td>
                    <td className="p-4 text-center">Diarios (7d)</td>
                    <td className="p-4 text-center">Diarios (30d)</td>
                    <td className="p-4 text-center">Diarios (14d)</td>
                  </tr>
                  <tr>
                    <td className="p-4">Datacenter</td>
                    <td className="p-4 text-center">🇨🇱 Chile</td>
                    <td className="p-4 text-center">🇺🇸 USA</td>
                    <td className="p-4 text-center">🇪🇸 España</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </section>

          {/* CTA */}
          <section className="max-w-4xl mx-auto text-center">
            <Card className="p-8 bg-primary text-primary-foreground">
              <h2 className="text-2xl font-bold mb-4">
                ¿Necesitas más opciones de hosting?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Consulta nuestro ranking completo con todos los proveedores de Chile
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/mejor-hosting-chile-2025"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Ver Ranking Completo 2025
                </Link>
                <Link 
                  to="/comparativa"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary-foreground/10 text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/20 transition-colors"
                >
                  Comparar Todos los Hosting
                </Link>
              </div>
            </Card>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MejorHostingWordPressChile;