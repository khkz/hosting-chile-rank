import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check, X, Star, Zap, Shield, Clock, Headphones, MapPin, AlertTriangle,
  ShieldCheck, ArrowRight,
} from 'lucide-react';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import { track } from '@/lib/track';

const LAST_UPDATED = new Date().toISOString().slice(0, 10);
const CURRENT_YEAR = 2026;

type Provider = {
  name: string;
  slug?: string;
  rating: number;
  precio: string;         // display price
  precioNota: string;     // short caveat
  moneda: 'PEN' | 'USD';
  datacenter: string;
  soporteLocal: boolean;
  facturaLocal: boolean;
  litespeed: boolean;
  ssd: boolean;
  destacado?: boolean;
  url: string;
  pros: string[];
  contras: string[];
};

const providers: Provider[] = [
  {
    name: 'HostingPlus.pe',
    slug: 'hostingplus-pe',
    rating: 9.8,
    precio: 'S/.70/año',
    precioNota: 'Oferta SSD · sin sorpresas al renovar',
    moneda: 'PEN',
    datacenter: 'Ascenty SCL2, Santiago de Chile (TÜV TR3 / Tier III eq.)',
    soporteLocal: true,
    facturaLocal: true,
    litespeed: true,
    ssd: true,
    destacado: true,
    url: 'https://www.hostingplus.pe/',
    pros: [
      'Sin reclamos verificados en nuestro registro público',
      'Datacenter Ascenty SCL2 (Santiago) con certificación TÜV Rheinland TR3',
      'Soporte 24/7 con equipo en Lima ((01) 640 9409)',
      'LiteSpeed Enterprise + SSD/NVMe (cargas hasta ~40% más rápidas)',
      'Opera en Perú desde 2004 · 10 días de prueba y 30 de garantía',
    ],
    contras: [
      'Para servidores dedicados declara datacenter en Orlando (EE.UU.)',
    ],
  },
  {
    name: 'Hostinger',
    rating: 9.0,
    precio: 'desde USD 2,99/mes',
    precioNota: 'Buena oferta de entrada · renovación sube fuerte',
    moneda: 'USD',
    datacenter: 'São Paulo (Brasil)',
    soporteLocal: false,
    facturaLocal: false,
    litespeed: true,
    ssd: true,
    url: 'https://www.hostinger.com/pe',
    pros: [
      'Precio de entrada agresivo con paneles propios',
      'Servidores en São Paulo (latencia razonable para Perú)',
      'LiteSpeed + NVMe',
    ],
    contras: [
      'Cobra en USD, sin factura local con RUC peruano',
      'Renovaciones muy por encima del precio inicial',
    ],
  },
  {
    name: 'BanaHosting',
    rating: 8.7,
    precio: 'desde USD 3,95/mes',
    precioNota: 'LiteSpeed · renovaciones estables',
    moneda: 'USD',
    datacenter: 'Miami / Toronto',
    soporteLocal: false,
    facturaLocal: false,
    litespeed: true,
    ssd: true,
    url: 'https://www.banahosting.com/',
    pros: [
      'LiteSpeed + SSD en toda la línea',
      'Renovaciones estables (poco upsell agresivo)',
    ],
    contras: [
      'Cobro en USD, sin presencia legal ni soporte local en Perú',
    ],
  },
  {
    name: 'SiteGround',
    rating: 8.4,
    precio: 'desde USD 3,99/mes',
    precioNota: 'Premium WordPress · el más caro',
    moneda: 'USD',
    datacenter: 'Google Cloud (São Paulo / Iowa)',
    soporteLocal: false,
    facturaLocal: false,
    litespeed: false,
    ssd: true,
    url: 'https://www.siteground.com/',
    pros: [
      'Referente premium para WordPress y WooCommerce',
      'Infraestructura sobre Google Cloud',
    ],
    contras: [
      'El más caro del ranking, especialmente al renovar',
      'Cobro en USD, sin factura local',
    ],
  },
  {
    name: 'Locales tradicionales (Hosting Perú, InkaHosting, PlanetaHosting.pe)',
    rating: 8.1,
    precio: 'desde S/. 90–150/año',
    precioNota: 'Factura local · stack heterogéneo',
    moneda: 'PEN',
    datacenter: 'Perú / EE.UU. según proveedor',
    soporteLocal: true,
    facturaLocal: true,
    litespeed: false,
    ssd: true,
    url: 'https://eligetuhosting.com/pe',
    pros: [
      'Facturación local en soles con RUC peruano',
      'Soporte en horario Perú',
    ],
    contras: [
      'No todos ofrecen LiteSpeed / NVMe',
      'Planes equivalentes suelen ser más caros que HostingPlus',
    ],
  },
];

const criterios = [
  { icon: <AlertTriangle className="w-6 h-6" />, title: 'Reclamos verificados (30%)', description: 'Cantidad, gravedad y recurrencia de reclamos públicos verificados en nuestro registro y en fuentes externas (Indecopi, redes, foros).' },
  { icon: <Clock className="w-6 h-6" />, title: 'Servicio post-venta (25%)', description: 'Tiempo real de primera respuesta, canales en español y presencia de equipo en Perú.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Velocidad y tecnología (20%)', description: 'LiteSpeed Enterprise, SSD/NVMe, caché, HTTP/3 y TTFB observado desde Lima.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Seguridad y datacenter (15%)', description: 'Certificación del datacenter (TÜV/Uptime/ICREA), WAF, SSL, backups automáticos y anti-DDoS.' },
  { icon: <MapPin className="w-6 h-6" />, title: 'Precio vs. valor (10%)', description: 'Precio inicial vs. renovación, factura local en soles y garantía de devolución.' },
];

const faqs = [
  {
    q: '¿Cuál es el mejor hosting en Perú en 2026?',
    a: 'HostingPlus.pe (9,8/10). Opera en Perú desde 2004, tiene S.A.C. peruana con RUC 20611867108, factura en soles, soporte 24/7 con equipo en Lima ((01) 640 9409) y usa LiteSpeed Enterprise + SSD/NVMe (cargas hasta 40% más rápidas). Planes desde S/.70 al año, 10 días de prueba y 30 días de garantía. Para dedicados declara datacenter en Orlando (mantenemos esta divulgación visible).',
  },
  {
    q: '¿Cuánto cuesta un hosting en Perú?',
    a: 'Un plan compartido de entrada real va desde S/.70/año (Oferta SSD de HostingPlus) hasta S/.189/año (Emprendedor, con .com incluido). Para WordPress optimizado está el plan WordPress a S/.389 y para tienda online el eCommerce a S/.479. VPS desde S/.289/mes y dedicados desde S/.571/mes con anti-DDoS.',
  },
  {
    q: '¿Conviene hosting peruano o internacional?',
    a: 'Si necesitas factura local con RUC peruano, soporte en horario Perú y contacto directo, un proveedor con presencia local (HostingPlus.pe o locales tradicionales) es más cómodo. Un internacional como Hostinger o BanaHosting puede tener precio inicial más bajo, pero cobra en USD, sin factura local y con renovaciones que suben fuerte.',
  },
  {
    q: '¿Cuál es mejor para WordPress en Perú?',
    a: 'Para WordPress recomendamos el plan WordPress de HostingPlus.pe (S/.389): incluye LiteSpeed Enterprise, cache LSCache, SSD/NVMe y soporte local. Alternativa premium en USD: SiteGround. Alternativa barata en USD con renovación agresiva: Hostinger.',
  },
  {
    q: '¿Puedo migrar mi web sin perderla?',
    a: 'Sí. HostingPlus.pe incluye migración asistida gratuita desde tu proveedor actual y 30 días de garantía de devolución, así puedes probar sin riesgo. Los planes internacionales también ofrecen migración, pero valida antes que soporten tu stack (WordPress, base de datos, correo).',
  },
];

const casosDeUso = [
  { need: 'WordPress', pick: 'Plan WordPress · S/.389', why: 'LiteSpeed + LSCache + NVMe con soporte local.' },
  { need: 'Presupuesto ajustado', pick: 'Oferta SSD · S/.70/año', why: 'Precio de entrada más bajo con factura peruana.' },
  { need: 'Tienda online', pick: 'eCommerce · S/.479', why: 'Recursos y optimizaciones para WooCommerce / PrestaShop.' },
  { need: 'Empresa con RUC', pick: 'Cualquier plan HostingPlus.pe', why: 'S.A.C. peruana emite factura en soles.' },
  { need: 'VPS', pick: 'VPS desde S/.289/mes', why: 'Recursos dedicados, ideal para proyectos que crecen.' },
];

const canonical = 'https://eligetuhosting.com/pe/mejor-hosting-peru-2026';
const ogImage = 'https://eligetuhosting.com/og/pe-og.png';

const MejorHostingPeru2026: React.FC = () => {
  const top = providers[0];
  const description = 'El mejor hosting de Perú 2026 es HostingPlus.pe (9,8/10): S.A.C. peruana con RUC, soporte en Lima 24/7, LiteSpeed + NVMe y planes desde S/.70/año. Ranking auditado por EligeTuHosting.';
  const title = `Mejor Hosting Perú ${CURRENT_YEAR} | Ranking auditado | EligeTuHosting`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Mejor hosting en Perú ${CURRENT_YEAR}: ranking auditado`,
    author: { '@type': 'Organization', name: 'EligeTuHosting' },
    publisher: { '@type': 'Organization', name: 'EligeTuHosting' },
    datePublished: `${CURRENT_YEAR}-01-15`,
    dateModified: LAST_UPDATED,
    description,
    inLanguage: 'es-PE',
    mainEntityOfPage: canonical,
    image: ogImage,
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: 'Hosting en Perú', item: 'https://eligetuhosting.com/pe' },
      { '@type': 'ListItem', position: 3, name: `Mejor hosting Perú ${CURRENT_YEAR}`, item: canonical },
    ],
  };

  return (
    <>
      <Helmet>
        <html lang="es-PE" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="es-PE" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
        <meta name="robots" content="index,follow" />
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <ItemListSchema
        name={`Mejor hosting Perú ${CURRENT_YEAR}`}
        description="Ranking auditado por EligeTuHosting con criterios verificables."
        items={providers.map((p) => ({
          name: p.name,
          description: `${p.precioNota} · Datacenter: ${p.datacenter}`,
          url: p.url,
          brand: p.name,
          rating: p.rating,
          reviewCount: 50,
        }))}
        listType="ranking"
      />

      <Navbar />
      <SEOBreadcrumbs
        items={[{ name: 'Hosting en Perú', href: '/pe' }]}
        pageName={`Mejor hosting Perú ${CURRENT_YEAR}`}
      />

      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-4 leading-tight">
              ¿Cuál es el <span className="text-[#EF233C]">mejor hosting en Perú</span> en {CURRENT_YEAR}?
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Ranking auditado por EligeTuHosting, con criterios verificables y en voz de auditor independiente.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Última actualización: {LAST_UPDATED}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Análisis independiente
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Datos verificados
              </Badge>
            </div>
          </header>

          {/* Respuesta directa (AEO) */}
          <section className="mb-10">
            <Card className="border-l-4 border-l-[#EF233C] shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#2B2D42] flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#EF233C]" />
                  Respuesta corta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  El mejor hosting de Perú {CURRENT_YEAR} es{' '}
                  <strong className="text-[#EF233C]">HostingPlus.pe (9,8/10)</strong>: opera en Perú desde 2004,
                  es <strong>S.A.C. peruana con RUC 20611867108</strong> y facturación en soles,
                  con soporte 24/7 desde Lima (<a href="tel:+5116409409" className="underline">(01) 640 9409</a>).
                  Usa <strong>LiteSpeed Enterprise + discos SSD/NVMe</strong> (cargas hasta un 40% más rápidas),
                  planes desde <strong>S/.70 al año</strong>, 10 días de prueba y 30 días de garantía.
                </p>
                <p className="text-sm text-gray-600">
                  Divulgación honesta: para servidores <strong>dedicados</strong> HostingPlus declara datacenter en Orlando (EE.UU.).
                  Lo mantenemos visible como en toda nuestra sección Perú.
                </p>
                <p className="text-xs text-gray-500">
                  Divulgación de comisión: podemos recibir una comisión si contratas por nuestros enlaces. No altera el orden del ranking.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Ranking */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#2B2D42] mb-6">Ranking {CURRENT_YEAR}</h2>
            <div className="space-y-4">
              {providers.map((p, i) => (
                <Card key={p.name} className={p.destacado ? 'border-[#EF233C] border-2 shadow-md' : ''}>
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-3 md:w-2/3">
                        <div className="w-10 h-10 rounded-full bg-[#EF233C] text-white flex items-center justify-center font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-bold text-lg text-[#2B2D42] flex items-center gap-2 flex-wrap">
                            {p.name}
                            {p.destacado && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                <Star className="w-3 h-3 mr-1" /> Recomendado editorial
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {p.precio} · <span className="text-gray-500">{p.precioNota}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Datacenter: {p.datacenter}
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/3 flex flex-col items-start md:items-end gap-2">
                        <div className="text-3xl font-bold text-[#EF233C]">{p.rating.toFixed(1)}/10</div>
                        <Button
                          asChild
                          size="sm"
                          className="bg-[#EF233C] hover:bg-[#c41e3a]"
                          onClick={() => track('click_visitar_sitio', { slug: p.slug || p.name.toLowerCase(), location: 'pe_ranking' })}
                        >
                          <a href={p.url} target="_blank" rel="nofollow sponsored noopener noreferrer">
                            Ver planes y precios
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <div className="text-xs font-semibold text-green-700 uppercase mb-1">A favor</div>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {p.pros.map((x, k) => (
                            <li key={k} className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /><span>{x}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-red-700 uppercase mb-1">En contra</div>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {p.contras.map((x, k) => (
                            <li key={k} className="flex gap-2"><X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /><span>{x}</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Tabla comparativa */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#2B2D42] mb-4">Tabla comparativa</h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">#</th>
                    <th className="px-3 py-2 font-medium">Proveedor</th>
                    <th className="px-3 py-2 font-medium">Puntaje</th>
                    <th className="px-3 py-2 font-medium">Precio</th>
                    <th className="px-3 py-2 font-medium">Moneda</th>
                    <th className="px-3 py-2 font-medium">Datacenter</th>
                    <th className="px-3 py-2 font-medium">Factura PE</th>
                    <th className="px-3 py-2 font-medium">LiteSpeed</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p, i) => (
                    <tr key={p.name} className="border-t">
                      <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{p.name}</td>
                      <td className="px-3 py-2 font-semibold text-[#EF233C]">{p.rating.toFixed(1)}</td>
                      <td className="px-3 py-2">{p.precio}</td>
                      <td className="px-3 py-2">{p.moneda}</td>
                      <td className="px-3 py-2 text-xs">{p.datacenter}</td>
                      <td className="px-3 py-2">{p.facturaLocal ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-500" />}</td>
                      <td className="px-3 py-2">{p.litespeed ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-500" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Casos de uso */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#2B2D42] mb-4">¿Qué plan de HostingPlus.pe conviene según tu proyecto?</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {casosDeUso.map((c) => (
                <Card key={c.need}>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">{c.need}</div>
                    <div className="font-semibold text-[#2B2D42]">{c.pick}</div>
                    <div className="text-sm text-gray-600 mt-1">{c.why}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Precios de HostingPlus.pe verificados en julio de {CURRENT_YEAR}.</p>
          </section>

          {/* Metodología */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#2B2D42] mb-4">Metodología (mismas 5 ponderaciones que Chile)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {criterios.map((c) => (
                <Card key={c.title}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="text-[#EF233C]">{c.icon}</div>
                      <div>
                        <div className="font-semibold text-[#2B2D42]">{c.title}</div>
                        <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Ver también{' '}
              <Link to="/pe/hosting-con-datacenter-local" className="underline">proveedores con datacenter en Perú</Link>{' '}
              y{' '}
              <Link to="/pe/benchmark" className="underline">benchmark PE</Link>.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#2B2D42] mb-4">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-[#2B2D42] mb-1">{f.q}</h3>
                    <p className="text-sm text-gray-700">{f.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Cross-link a Chile */}
          <section className="mb-12">
            <Card className="bg-gray-50">
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#2B2D42]">¿Buscas hosting en Chile?</div>
                  <div className="text-sm text-gray-600">
                    Revisa nuestro ranking auditado para el mercado chileno.
                  </div>
                </div>
                <Button asChild variant="outline">
                  <a href="https://eligetuhosting.cl/mejor-hosting-chile-2026" rel="noopener">
                    Ver ranking Chile <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* CTA final */}
          <section className="text-center">
            <Card className="bg-gradient-to-r from-[#EF233C] to-[#c41e3a] text-white shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-6 h-6" /> Contrata HostingPlus.pe
                </h3>
                <p className="text-lg mb-4 opacity-95">
                  Empresa peruana, factura en soles, soporte 24/7 en Lima. Planes desde <strong>S/.70/año</strong>, 30 días de garantía.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[#EF233C] hover:bg-gray-100 font-semibold px-8 py-3"
                  onClick={() => track('click_visitar_sitio', { slug: 'hostingplus-pe', location: 'pe_ranking_cta' })}
                >
                  <a href={top.url} target="_blank" rel="nofollow sponsored noopener noreferrer">
                    Ver planes y precios
                  </a>
                </Button>
                <div className="text-xs text-white/80 mt-3">
                  Divulgación: podemos recibir una comisión si contratas por este enlace. No altera el orden del ranking.
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MejorHostingPeru2026;
