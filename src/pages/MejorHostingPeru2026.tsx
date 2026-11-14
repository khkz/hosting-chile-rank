import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import Section from '@/components/system/Section';
import { ProvenanceTag } from '@/components/data/Provenance';
import { COUNTRY_CONTENT } from '@/data/countryContent';
import { CountryHeroCopy, CountryIntroCopy } from '@/components/country/CountryHeroCopy';
import FaqList from '@/components/ranking/pais/FaqList';
import PeShortAnswer from '@/components/ranking/pais/PeShortAnswer';
import PeRanking from '@/components/ranking/pais/PeRanking';
import PeComparisonTable from '@/components/ranking/pais/PeComparisonTable';
import { PeChileLink, PeDatacenterTest, PeFinalCta, PeMethodology, PeUseCases } from '@/components/ranking/pais/PeSections';
import { displayText, type PeProvider } from '@/components/ranking/pais/peTypes';

const LAST_UPDATED = new Date().toISOString().slice(0, 10);
const CURRENT_YEAR = 2026;

// Notas, precios y textos de Perú: pendiente 6 (no cambiarlos). precioNota y
// datacenter alimentan el JSON-LD tal cual; el formato visible se arma al mostrar.
const providers: PeProvider[] = [
  {
    name: 'HostingPlus.pe',
    slug: 'hostingplus-pe',
    rating: 9.8,
    price: { amount: 70, currency: 'PEN', period: 'año' },
    precioNota: 'Oferta SSD · sin sorpresas al renovar',
    datacenter: 'GTD Lima, Perú — Tier III certificado',
    soporteLocal: true,
    facturaLocal: true,
    litespeed: true,
    ssd: true,
    destacado: true,
    url: 'https://www.hostingplus.pe/',
    pros: [
      'Único del directorio PE con datacenter local Tier III certificado (GTD Lima)',
      '0 reclamos INDECOPI en el registro «Mira a Quién le Compras»',
      'Razón social peruana con RUC: Hostingplus Datacenter S.A.C. (RUC 20611867108)',
      'Soporte 24/7 con equipo en Lima ((01) 640 9409)',
      'NVMe RAID 10 + LiteSpeed Enterprise (cargas hasta ~40% más rápidas)',
      'Grupo multi-datacenter: GTD Lima + Ascenty Santiago Tier III de respaldo + Google Cloud São Paulo',
      '10 días de prueba y 30 días de garantía',
    ],
    contras: [
      'Para servidores dedicados opcionales declara datacenter Hivelocity en Tampa, FL (EE.UU.)',
    ],
  },
  {
    name: 'Hostinger',
    rating: 9.0,
    price: { amount: 2.99, currency: 'USD', period: 'mes', from: true },
    precioNota: 'Buena oferta de entrada · renovación sube fuerte',
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
    price: { amount: 3.95, currency: 'USD', period: 'mes', from: true },
    precioNota: 'LiteSpeed · renovaciones estables',
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
    price: { amount: 3.99, currency: 'USD', period: 'mes', from: true },
    precioNota: 'Premium WordPress · el más caro',
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
    price: { amount: 90, max: 150, currency: 'PEN', period: 'año', from: true },
    precioNota: 'Factura local · stack heterogéneo',
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

const faqs = [
  {
    q: '¿Cuál es el mejor hosting en Perú en 2026?',
    a: 'HostingPlus.pe (9,8/10). Es el único proveedor del directorio PE con datacenter local Tier III certificado (GTD Lima, Perú). 0 reclamos INDECOPI en el registro «Mira a Quién le Compras», razón social peruana Hostingplus Datacenter S.A.C. (RUC 20611867108), soporte 24/7 con equipo en Lima ((01) 640 9409), NVMe RAID 10 + LiteSpeed Enterprise. Planes desde S/.70/año, 10 días de prueba y 30 días de garantía. Para dedicados opcionales declara Hivelocity Tampa, FL (EE.UU.); lo mantenemos visible.',
  },
  {
    q: '¿Dónde está físicamente el datacenter de HostingPlus Perú?',
    a: 'El hosting web (compartido, WordPress, VPS) se aloja en el datacenter GTD de Lima, Perú, con certificación Tier III. Los servidores dedicados opcionales se declaran en el datacenter Hivelocity de Tampa, Florida (EE.UU.). El grupo HostingPlus opera además Ascenty Santiago (Tier III) como respaldo regional y es Google Cloud Partner con instancias en São Paulo.',
  },
  {
    q: '¿Cuánto cuesta un hosting en Perú?',
    a: 'Un plan compartido de entrada real va desde S/.70/año (Oferta SSD de HostingPlus) hasta S/.189/año (Emprendedor, con .com incluido). Para WordPress optimizado está el plan WordPress a S/.389 y para tienda online el eCommerce a S/.479. VPS desde S/.289/mes y dedicados desde S/.571/mes con anti-DDoS.',
  },
  {
    q: '¿Conviene hosting peruano o internacional?',
    a: 'Si necesitas factura local con RUC peruano, soporte en horario Perú y datacenter dentro del país, HostingPlus.pe es la opción más clara (GTD Lima Tier III + RUC 20611867108). Un internacional como Hostinger o BanaHosting puede tener precio inicial más bajo, pero cobra en USD, sin factura local y con renovaciones que suben fuerte.',
  },
  {
    q: '¿Cuál es mejor para WordPress en Perú?',
    a: 'Para WordPress recomendamos el plan WordPress de HostingPlus.pe (S/.389): incluye LiteSpeed Enterprise, cache LSCache, NVMe RAID 10, datacenter GTD Lima Tier III y soporte local. Alternativa premium en USD: SiteGround. Alternativa barata en USD con renovación agresiva: Hostinger.',
  },
  {
    q: '¿Puedo migrar mi web sin perderla?',
    a: 'Sí. HostingPlus.pe incluye migración asistida gratuita desde tu proveedor actual y 30 días de garantía de devolución, así puedes probar sin riesgo.',
  },
];

const canonical = 'https://eligetuhosting.com/pe/mejor-hosting-peru-2026';
const ogImage = 'https://eligetuhosting.com/og/pe-og.png';

const MejorHostingPeru2026: React.FC = () => {
  const top = providers[0];
  const description = 'El mejor hosting de Perú 2026 es HostingPlus.pe (9,8/10): único con datacenter local Tier III certificado (GTD Lima), 0 reclamos INDECOPI, RUC peruano, soporte 24/7 en Lima, NVMe + LiteSpeed y planes desde S/.70/año. Ranking auditado por EligeTuHosting.';
  const c = COUNTRY_CONTENT['pe'];
  const title = `${c.title} | EligeTuHosting`;

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

      <main className="bg-white">
        <CountryHeroCopy
          slug="pe"
          breadcrumbs={
            <SEOBreadcrumbs items={[{ name: 'Hosting en Perú', href: '/pe' }]} pageName={`Mejor hosting Perú ${CURRENT_YEAR}`} />
          }
          rankingHref="#ranking"
          methodLabel="Cómo ponderamos"
          extraMeta={
            <>
              <span className="inline-flex items-center gap-2">
                Notas <ProvenanceTag kind="editorial" />
              </span>
              <span>Precios de HostingPlus.pe verificados en julio de {CURRENT_YEAR}</span>
            </>
          }
        />

        <Section density="tight" aria-label="Cómo leer la edición Perú">
          <CountryIntroCopy slug="pe" />
        </Section>

        <Section id="respuesta" tone="paper" title="Respuesta corta">
          <PeShortAnswer year={CURRENT_YEAR} rating={top.rating} />
        </Section>

        <Section id="ranking" title={`Ranking ${CURRENT_YEAR}`} lead="Cinco opciones con su nota editorial, lo que declara cada proveedor y lo que pesa a favor y en contra.">
          <PeRanking providers={providers} />
        </Section>

        <Section id="tabla" tone="paper" title="Tabla comparativa">
          <PeComparisonTable providers={providers} />
        </Section>

        <Section id="planes" title="¿Qué plan de HostingPlus.pe conviene según tu proyecto?">
          <PeUseCases year={CURRENT_YEAR} />
        </Section>

        <Section
          id="metodologia"
          tone="paper"
          title="Cómo ponderamos en Perú"
          lead="Cinco factores con su peso en la nota editorial de cada proveedor peruano."
        >
          <PeMethodology />
        </Section>

        <Section id="datacenter" title="¿Datacenter certificado o solo «autodeclarado»? El test que ningún proveedor peruano quiere que hagas">
          <PeDatacenterTest />
        </Section>

        <Section id="preguntas" tone="paper" title="Preguntas frecuentes">
          <FaqList items={[...c.faq, ...faqs]} renderAnswer={displayText} />
        </Section>

        <Section density="tight" aria-label="Ranking de Chile">
          <PeChileLink />
        </Section>

        <Section tone="paper" aria-label="Contratar HostingPlus.pe">
          <PeFinalCta top={top} />
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default MejorHostingPeru2026;
