import { isDofollowProvider } from '@/lib/providerLinks';
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import ProductSchema from '@/components/SEO/ProductSchema';
import RelatedArticles from '@/components/RelatedArticles';
import Section from '@/components/system/Section';
import RankingHeader from '@/components/hubs/RankingHeader';
import ProviderPickCard from '@/components/hubs/ProviderPickCard';
import { ProvenanceTag } from '@/components/data/Provenance';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatMoney } from '@/lib/format';
import { Zap, Shield, TrendingUp, Rocket } from 'lucide-react';

/**
 * /mejor-hosting-wordpress-chile-2026 con la plantilla de la familia «ranking».
 * Notas, precios y características siguen escritos a mano en esta página
 * (decisión pendiente 10): se muestran con su procedencia, sin cambiar valores.
 */

// Comparativa técnica (mismos valores que antes, sin emojis ni banderas emoji).
const TECH_PROVIDERS = ['HostingPlus', 'SiteGround', 'Webempresa'];
const TECH_ROWS: { label: string; values: string[] }[] = [
  { label: 'Servidor web', values: ['LiteSpeed', 'NGINX', 'LiteSpeed'] },
  { label: 'Caché incluida', values: ['Sí (LSCache)', 'Sí (SuperCacher)', 'Sí (LiteSpeed)'] },
  { label: 'PHP 8.2+', values: ['Sí', 'Sí', 'Sí'] },
  { label: 'Staging', values: ['Sí, gratis', 'Sí, gratis', 'No'] },
  { label: 'CDN incluida', values: ['No', 'Sí (Cloudflare)', 'No'] },
  { label: 'Backups', values: ['Diarios (7 días)', 'Diarios (30 días)', 'Diarios (14 días)'] },
  { label: 'Datacenter', values: ['Chile', 'EE. UU.', 'España'] },
];

const WHY_STATS = [
  { value: '3,2x', label: 'Más rápido con LiteSpeed vs Apache' },
  { value: '60 %', label: 'Reducción tiempo carga con cache' },
  { value: '99,9 %', label: 'Uptime con infraestructura dedicada' },
];

const MejorHostingWordPressChile = () => {
  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Recursos', href: '/recursos-hosting-chile' },
    { name: 'WordPress', href: '/mejor-hosting-wordpress-chile' }
  ];

  const relatedArticles = [
    {
      title: 'Guía de hosting WordPress',
      description: 'Optimización completa para WordPress',
      path: '/guia-hosting-wordpress-chile'
    },
    {
      title: 'Guía de seguridad web',
      description: 'Protege tu sitio WordPress',
      path: '/guia-seguridad-web-chile'
    },
    {
      title: 'Guía para elegir CDN',
      description: 'Acelera tu WordPress globalmente',
      path: '/guia-elegir-cdn-chile'
    }
  ];
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
      cons: "El precio sube al renovar; revisa el valor de renovación antes de contratar.",
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
    url: isDofollowProvider(null, provider.url) ? provider.url : undefined,
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

      <Navbar />

      <main className="bg-white">
        <RankingHeader
          crumbs={breadcrumbItems}
          title="Mejor Hosting para WordPress Chile"
          lead="Comparativa de hosting con infraestructura optimizada específicamente para WordPress."
          reviewedAt={null}
          undatedNote="Actualizado en enero de 2025"
          meta={<span>Tests de velocidad incluidos</span>}
        />

        <Section id="por-que" title="¿Por qué necesitas hosting específico para WordPress?">
          <p className="t-body measure text-ink-2">
            WordPress representa el 43% de todos los sitios web del mundo, pero requiere configuraciones específicas para
            funcionar óptimamente. Un hosting genérico puede hacer que tu WordPress sea hasta 5x más lento que uno
            optimizado.
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {WHY_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col rounded-xl border border-rule bg-white p-5">
                <dt className="t-small order-2 mt-1 text-ink-2">{stat.label}</dt>
                <dd className="text-3xl font-bold tabular text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section
          id="ranking"
          tone="paper"
          title="Los 3 mejores hosting para WordPress"
          lead="Notas editoriales; precios declarados por cada proveedor. Confirma el valor vigente en su sitio antes de contratar."
        >
          <ol className="space-y-4">
            {topProviders.map((provider, index) => (
              <li key={provider.name}>
                <ProviderPickCard
                  rank={index + 1}
                  name={provider.name}
                  score={provider.score}
                  scoreLabel="Nota WordPress"
                  rows={[{ label: 'Precio', value: `${formatMoney(provider.price, 'CLP')} al mes`, kind: 'declared' }]}
                  featuresTitle="Características WordPress"
                  features={provider.features}
                  pros={provider.pros}
                  cons={provider.cons}
                  site={{
                    href: provider.url,
                    rel: provider.affiliate ? "nofollow sponsored" : "nofollow",
                    label: `Ir al sitio de ${provider.name}`,
                  }}
                  secondary={{
                    to: `/resenas/${provider.name.toLowerCase().replace(/\s/g, '-')}`,
                    label: 'Ver el análisis completo',
                  }}
                />
              </li>
            ))}
          </ol>
        </Section>

        <Section id="optimizar" title="Cómo optimizar tu WordPress (independiente del hosting)">
          <ul className="grid gap-4 md:grid-cols-2">
            {optimizationTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <li key={tip.title} className="flex gap-4 rounded-xl border border-rule bg-white p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper">
                    <Icon className="h-5 w-5 text-ink-2" aria-hidden />
                  </span>
                  <div>
                    <h3 className="t-h3 text-ink">{tip.title}</h3>
                    <p className="t-small mt-1 text-ink-2">{tip.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section
          id="comparativa-tecnica"
          tone="paper"
          title="Comparativa técnica"
          lead={
            <span className="inline-flex flex-wrap items-center gap-2">
              Lo que declara cada proveedor en su sitio. <ProvenanceTag kind="declared" />
            </span>
          }
        >
          <Table className="hidden text-[15px] md:table">
            <TableHeader>
              <TableRow>
                <TableHead>Característica</TableHead>
                {TECH_PROVIDERS.map((name) => (
                  <TableHead key={name}>{name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {TECH_ROWS.map((row) => (
                <TableRow key={row.label} className="hover:bg-transparent">
                  <th scope="row" className="px-3 py-3 text-left font-semibold text-ink">{row.label}</th>
                  {row.values.map((value, i) => (
                    <TableCell key={TECH_PROVIDERS[i]}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Móvil: cada característica con los tres valores, sin columnas escondidas */}
          <dl className="divide-y divide-rule border-y-2 border-ink md:hidden">
            {TECH_ROWS.map((row) => (
              <div key={row.label} className="py-4">
                <dt className="font-semibold text-ink">{row.label}</dt>
                <dd className="mt-2 grid grid-cols-3 gap-3 text-[15px]">
                  {row.values.map((value, i) => (
                    <span key={TECH_PROVIDERS[i]} className="min-w-0">
                      <span className="t-meta block">{TECH_PROVIDERS[i]}</span>
                      <span className="text-ink">{value}</span>
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section
          id="mas-opciones"
          title="¿Necesitas más opciones de hosting?"
          lead="Consulta nuestro ranking completo con todos los proveedores de Chile."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/mejor-hosting-chile-2026">Ver el ranking</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/comparativa">Comparar proveedores</Link>
            </Button>
          </div>
        </Section>

        <div className="container pb-16">
          <RelatedArticles articles={relatedArticles} title="Artículos relacionados" />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MejorHostingWordPressChile;
