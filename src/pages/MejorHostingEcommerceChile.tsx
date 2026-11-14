import { isDofollowProvider } from '@/lib/providerLinks';
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import RelatedArticles from '@/components/RelatedArticles';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import RankingHeader from '@/components/hubs/RankingHeader';
import ProviderPickCard from '@/components/hubs/ProviderPickCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatMoney, formatPercent } from '@/lib/format';
import { Shield, CreditCard, Zap, TrendingUp, Lock, Clock } from 'lucide-react';

/**
 * /mejor-hosting-ecommerce-chile-2026 con la plantilla de la familia «ranking».
 * Notas, precios y uptime siguen escritos a mano en esta página (decisión
 * pendiente 10): se muestran con su procedencia, sin cambiar valores.
 */

/** «99.99%» (texto heredado) en formato es-CL: «99,99 %». */
const uptimeText = (raw: string) => {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? formatPercent(n, 2) : raw;
};

const MejorHostingEcommerceChile = () => {
  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Recursos', href: '/recursos-hosting-chile' },
    { name: 'E-commerce', href: '/mejor-hosting-ecommerce-chile' }
  ];

  const relatedArticles = [
    {
      title: 'Guía de seguridad web',
      description: 'Seguridad crítica para e-commerce',
      path: '/guia-seguridad-web-chile'
    },
    {
      title: 'Guía para elegir SSL',
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
      title: "Uptime 99,99 % mínimo",
      description: "Cada hora de caída son ventas que no ocurren",
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
    url: isDofollowProvider(null, provider.url) ? provider.url : undefined,
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

      <Navbar />

      <main className="bg-white">
        <RankingHeader
          crumbs={breadcrumbItems}
          title="Mejor Hosting para E-Commerce Chile"
          lead="Hosting con alta disponibilidad, seguridad PCI y soporte prioritario para tiendas online."
          reviewedAt={null}
        />

        <Section id="alerta" title="Un e-commerce no es un sitio web común">
          <Callout tone="caution" className="max-w-[78ch]">
            <p>
              Una tienda online procesa dinero real, datos personales y transacciones financieras. Un hosting genérico
              puede exponerte a:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-ink-3">
              <li>Multas por incumplir normativas PCI DSS</li>
              <li>Pérdida de ventas por cada hora de caída durante Black Friday</li>
              <li>Demandas por robo de datos de clientes (GDPR/Ley 19.628)</li>
            </ul>
          </Callout>
        </Section>

        <Section id="requisitos" tone="paper" title="Requisitos obligatorios para e-commerce">
          <ul className="grid gap-4 md:grid-cols-2">
            {requirements.map((req) => {
              const Icon = req.icon;
              return (
                <li key={req.title} className="flex gap-4 rounded-xl border border-rule bg-white p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper">
                    <Icon className="h-5 w-5 text-ink-2" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="t-h3 text-ink">{req.title}</h3>
                      {req.critical && <Badge variant="ink">Crítico</Badge>}
                    </div>
                    <p className="t-small mt-1 text-ink-2">{req.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section
          id="ranking"
          title="Los 2 mejores hosting para e-commerce"
          lead="Notas editoriales; precio, uptime y soporte declarados por cada proveedor. Confirma el valor vigente en su sitio antes de contratar."
        >
          <ol className="space-y-4">
            {topProviders.map((provider, index) => {
              const brand = provider.name.split(' ')[0];
              return (
                <li key={provider.name}>
                  <ProviderPickCard
                    rank={index + 1}
                    name={provider.name}
                    score={provider.score}
                    scoreLabel="Nota e-commerce"
                    rows={[
                      { label: 'Precio', value: `${formatMoney(provider.price, 'CLP')} al mes`, kind: 'declared' },
                      { label: 'Uptime garantizado', value: uptimeText(provider.uptime), kind: 'declared' },
                      { label: 'Soporte', value: provider.support, kind: 'declared' },
                    ]}
                    featuresTitle="Características e-commerce"
                    features={provider.features}
                    site={{ href: provider.url, rel: "nofollow sponsored", label: `Ir al sitio de ${brand}` }}
                    secondary={{ to: '/comparativa', label: 'Comparar' }}
                  />
                </li>
              );
            })}
          </ol>
        </Section>

        <Section id="downtime" tone="paper" title="Costo real del downtime en e-commerce">
          <p className="t-body measure text-ink-2">
            El costo de una caída es proporcional a lo que vendes: mientras la tienda está inaccesible, cada pedido que no
            entra no se recupera. Calcula tu propio impacto con tus ventas mensuales reales dividiendo por las horas del
            mes.
          </p>
          <p className="t-small measure mt-4 text-ink-3">
            Durante Black Friday o Cyber Monday el impacto es bastante mayor que en un día normal.
          </p>
        </Section>

        <Section
          id="asesoria"
          title="¿Necesitas asesoría personalizada?"
          lead="Contáctanos para una recomendación basada en tu volumen de ventas y plataforma."
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

export default MejorHostingEcommerceChile;
