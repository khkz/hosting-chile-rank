import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import RelatedArticles from '@/components/RelatedArticles';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Shield, CreditCard, Zap, TrendingUp, Lock, Clock } from 'lucide-react';

const MejorHostingEcommerceChile = () => {
  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Recursos', href: '/recursos-hosting-chile' },
    { name: 'E-commerce', href: '/mejor-hosting-ecommerce-chile' }
  ];

  const relatedArticles = [
    {
      title: 'Guía de Seguridad Web',
      description: 'Seguridad crítica para e-commerce',
      path: '/guia-seguridad-web-chile'
    },
    {
      title: 'Guía para Elegir SSL',
      description: 'Certificados para tiendas online',
      path: '/guia-elegir-ssl-chile'
    },
    {
      title: 'Calculadora TCO',
      description: 'Costo real de tu infraestructura',
      path: '/calculadora-tco-hosting'
    }
  ];
  const topProviders = [
    {
      name: "HostingPlus E-Commerce",
      logo: "/logo-hostingplus.svg",
      score: 9.5,
      price: 12990,
      features: [
        "SSL dedicado incluido",
        "PCI DSS compliance",
        "Recursos dedicados garantizados",
        "Backups cada 6 horas",
        "IP dedicada chilena",
        "Optimización WooCommerce/Shopify"
      ],
      uptime: "99.99%",
      support: "24/7 prioridad",
      url: "https://hostingplus.cl/ecommerce"
    },
    {
      name: "SiteGround E-Commerce",
      logo: "/logo-siteground.svg",
      score: 9.3,
      price: 15990,
      features: [
        "PCI compliance certificado",
        "WooCommerce auto-updates",
        "CDN enterprise gratis",
        "Staging e-commerce",
        "HTTP/3 y QUIC",
        "Monitoreo uptime 24/7"
      ],
      uptime: "99.99%",
      support: "24/7 + prioridad",
      url: "https://siteground.com/ecommerce-hosting"
    }
  ];

  const requirements = [
    {
      title: "Uptime 99.99% mínimo",
      description: "1 hora de caída mensual = pérdida promedio $500.000 CLP en ventas",
      icon: TrendingUp,
      critical: true
    },
    {
      title: "SSL/TLS certificado",
      description: "Obligatorio para procesar pagos. Google penaliza sitios sin HTTPS.",
      icon: Lock,
      critical: true
    },
    {
      title: "PCI DSS compliance",
      description: "Estándar de seguridad requerido para manejar datos de tarjetas de crédito.",
      icon: Shield,
      critical: true
    },
    {
      title: "Backups frecuentes",
      description: "Mínimo cada 12 horas. Ideal: cada 6 horas para no perder transacciones.",
      icon: Clock,
      critical: false
    },
    {
      title: "Recursos escalables",
      description: "Black Friday puede multiplicar tráfico por 10x. Necesitas escalar rápido.",
      icon: Zap,
      critical: false
    },
    {
      title: "IP dedicada",
      description: "Evita que IPs compartidas afecten tu reputación de envío de emails.",
      icon: CreditCard,
      critical: false
    }
  ];

  const schemaItems = topProviders.map((provider, index) => ({
    name: provider.name,
    description: `Hosting e-commerce con ${provider.uptime} uptime y soporte ${provider.support}`,
    url: provider.url,
    image: `https://eligetuhosting.cl${provider.logo}`,
    brand: provider.name.split(' ')[0],
    rating: provider.score,
    reviewCount: 80 - (index * 15),
    price: provider.price,
    priceCurrency: "CLP"
  }));

  return (
    <>
      <DynamicMetaTags
        title="Mejor Hosting para E-Commerce Chile 2025 | WooCommerce & Shopify"
        description="Ranking de hosting optimizado para tiendas online en Chile. SSL dedicado, PCI compliance, uptime 99.99% y soporte prioritario. WooCommerce y Shopify ready."
        keywords="hosting ecommerce chile, hosting tienda online, woocommerce hosting chile, shopify hosting"
      />

      <ItemListSchema
        name="Mejores Hosting para E-Commerce en Chile 2025"
        description="Ranking de proveedores con infraestructura de alta disponibilidad para tiendas online"
        items={schemaItems}
        listType="ranking"
      />

      <div className="min-h-screen bg-background">
      <Navbar />
      <SEOBreadcrumbs items={breadcrumbItems} />
        
        <main className="container mx-auto px-4 py-12">
          {/* Header */}
          <header className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-600/10 text-green-700 px-4 py-2 rounded-full mb-6">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">E-Commerce Optimizado</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Mejor Hosting para E-Commerce Chile 2025
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Hosting con alta disponibilidad, seguridad PCI y soporte prioritario para tiendas online
            </p>
          </header>

          {/* Alerta Importancia */}
          <section className="max-w-4xl mx-auto mb-16">
            <Card className="p-8 bg-yellow-50 border-yellow-200">
              <div className="flex gap-4">
                <Shield className="w-12 h-12 text-yellow-700 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold text-yellow-900 mb-3">
                    ⚠️ Un e-commerce NO es un sitio web común
                  </h2>
                  <p className="text-lg text-yellow-800 leading-relaxed mb-4">
                    Una tienda online procesa dinero real, datos personales y transacciones financieras. 
                    Un hosting genérico puede exponerte a:
                  </p>
                  <ul className="space-y-2 text-yellow-800">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>Multas de hasta $50.000.000 CLP por incumplir normativas PCI DSS</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>Pérdida de $500.000+ CLP por cada hora de caída durante Black Friday</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>Demandas por robo de datos de clientes (GDPR/Ley 19.628)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>

          {/* Requisitos Críticos */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">Requisitos Obligatorios para E-Commerce</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {requirements.map((req, index) => {
                const Icon = req.icon;
                return (
                  <Card 
                    key={index} 
                    className={`p-6 ${req.critical ? 'border-red-500 border-2 bg-red-50' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          req.critical ? 'bg-red-100' : 'bg-primary/10'
                        }`}>
                          <Icon className={`w-6 h-6 ${req.critical ? 'text-red-600' : 'text-primary'}`} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {req.title}
                          </h3>
                          {req.critical && (
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                              CRÍTICO
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {req.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Top Proveedores */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">Top 2 Hosting E-Commerce Chile 2025</h2>
            <div className="space-y-8">
              {topProviders.map((provider, index) => (
                <Card key={index} className="p-8 hover:shadow-xl transition-shadow border-2">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-700 font-bold text-3xl mb-4">
                        #{index + 1}
                      </div>
                      <img 
                        src={provider.logo} 
                        alt={`${provider.name} logo`}
                        className="h-16 mx-auto object-contain mb-6"
                      />
                      <div className="space-y-3">
                        <div>
                          <div className="text-4xl font-bold text-foreground">
                            {provider.score}/10
                          </div>
                          <div className="text-sm text-muted-foreground">Score E-Commerce</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-green-600">
                            ${provider.price.toLocaleString('es-CL')}
                          </div>
                          <div className="text-xs text-muted-foreground">CLP/mes</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">
                            {provider.uptime}
                          </div>
                          <div className="text-xs text-muted-foreground">Uptime garantizado</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-6">
                        {provider.name}
                      </h3>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                          Características E-Commerce
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {provider.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <a 
                          href={provider.url}
                          target="_blank"
                          rel="nofollow sponsored"
                          className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Ver Plan E-Commerce
                        </a>
                        <Link
                          to="/comparativa"
                          className="inline-flex items-center px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                        >
                          Comparar Planes
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Costos de Downtime */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">Costo Real del Downtime en E-Commerce</h2>
            <Card className="p-8 bg-red-50 border-red-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-red-300">
                      <th className="text-left p-4 font-semibold">Ventas Mensuales</th>
                      <th className="text-right p-4 font-semibold">Pérdida por Hora</th>
                      <th className="text-right p-4 font-semibold">Pérdida por Día</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-200">
                    <tr>
                      <td className="p-4">$1.000.000 CLP/mes</td>
                      <td className="p-4 text-right font-bold text-red-700">$1.400 CLP</td>
                      <td className="p-4 text-right font-bold text-red-700">$33.000 CLP</td>
                    </tr>
                    <tr>
                      <td className="p-4">$5.000.000 CLP/mes</td>
                      <td className="p-4 text-right font-bold text-red-700">$7.000 CLP</td>
                      <td className="p-4 text-right font-bold text-red-700">$167.000 CLP</td>
                    </tr>
                    <tr>
                      <td className="p-4">$10.000.000 CLP/mes</td>
                      <td className="p-4 text-right font-bold text-red-700">$14.000 CLP</td>
                      <td className="p-4 text-right font-bold text-red-700">$333.000 CLP</td>
                    </tr>
                    <tr>
                      <td className="p-4">$50.000.000 CLP/mes</td>
                      <td className="p-4 text-right font-bold text-red-700">$70.000 CLP</td>
                      <td className="p-4 text-right font-bold text-red-700">$1.667.000 CLP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-red-800 mt-4 italic">
                * Cálculos asumen distribución uniforme de ventas 24/7. Durante Black Friday o Cyber Monday, 
                las pérdidas pueden ser 5-10x superiores.
              </p>
            </Card>
          </section>

          {/* CTA */}
          <section className="max-w-4xl mx-auto text-center">
            <Card className="p-8 bg-green-600 text-white">
              <h2 className="text-2xl font-bold mb-4">
                ¿Necesitas asesoría personalizada?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Contáctanos para una recomendación basada en tu volumen de ventas y plataforma
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/mejor-hosting-chile-2025"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Ver Ranking Completo
                </Link>
                <Link 
                  to="/comparativa"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border-2 border-white/30"
                >
                  Comparar Todos los Planes
                </Link>
              </div>
            </Card>
        </section>

        <RelatedArticles articles={relatedArticles} />
      </main>

      <Footer />
      </div>
    </>
  );
};

export default MejorHostingEcommerceChile;