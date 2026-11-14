import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Methodology from '@/components/Methodology';
import ProductSchema from '@/components/SEO/ProductSchema';
import HowToSchema from '@/components/SEO/HowToSchema';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import SEOReviewSchema from '@/components/SEO/SEOReviewSchema';
import RankingHeader from '@/components/hubs/RankingHeader';
import RankingFaq from '@/components/hubs/RankingFaq';
import ChileComparisonTable from '@/components/ranking/chile/ChileComparisonTable';
import { ChileCriteria, ChileSources, ChileSummary } from '@/components/ranking/chile/ChileIntroSections';
import { ChileClosing, ChileWinnerAnalysis } from '@/components/ranking/chile/ChileVerdictSections';
import { hostingProviders, criterios, faqs, guideLinks } from '@/components/ranking/chile/chileGuideData';
import { CURRENT_YEAR, getLastUpdatedDate, getYearStartDate } from '@/utils/dateHelpers';
import { VERIFICATION_DATE_ISO } from '@/data/verified2026';

/**
 * Guía /mejor-hosting-chile-2026. Las piezas viven en
 * src/components/ranking/chile/ (datos, tabla y secciones); aquí quedan el SEO
 * (sin cambios) y el orden de las secciones (sin cambios).
 */
const MejorHostingChile2026 = () => {
  return (
    <>
      <Helmet>
        <title>{`Mejor Hosting Chile ${CURRENT_YEAR} | Guía Completa | EligeTuHosting.cl`}</title>
        <meta 
          name="description" 
          content={`Descubre cuál es el mejor hosting en Chile ${CURRENT_YEAR}. Comparativa completa de velocidad, uptime y precios. Guía definitiva para elegir hosting SSD rápido.`}
        />
        <meta name="keywords" content={`mejor hosting Chile, cuál es el mejor hosting en Chile, hosting rápido SSD en Chile, mejor hosting chileno ${CURRENT_YEAR}, hosting confiable Chile, hosting WordPress Chile`} />
        <link rel="canonical" href="https://eligetuhosting.cl/mejor-hosting-chile-2026" />
        <link rel="alternate" hrefLang="es-cl" href="https://eligetuhosting.cl/mejor-hosting-chile-2026" />
        <link rel="alternate" type="application/rss+xml" href="/feed/latest-domains.xml" />
        <meta property="og:title" content={`¿Cuál es el mejor hosting en Chile en ${CURRENT_YEAR}? Guía definitiva`} />
        <meta property="og:description" content={`Comparativa exhaustiva del mejor hosting Chile ${CURRENT_YEAR}. Análisis de velocidad, uptime y precios de los principales proveedores.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://eligetuhosting.cl/mejor-hosting-chile-2026" />
        <meta property="og:image" content="https://eligetuhosting.cl/images/mejor-hosting-chile-hero.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `¿Cuál es el mejor hosting en Chile en ${CURRENT_YEAR}? Guía definitiva y comparativa`,
            author: { "@type": "Organization", name: "eligetuhosting.cl" },
            datePublished: getYearStartDate(),
            dateModified: getLastUpdatedDate(),
            description: `Análisis completo de los mejores proveedores de hosting en Chile para ${CURRENT_YEAR}, incluyendo comparativas de velocidad, uptime y precios.`
          }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(f => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer }
            }))
          }) }} />
      </Helmet>

      {/* Enhanced Product Schema for Top Provider */}
      <ProductSchema 
        name={`Hosting ${hostingProviders[0].name}`}
        description={`El mejor hosting en Chile ${CURRENT_YEAR} con ${hostingProviders[0].uptime} de uptime, velocidad ${hostingProviders[0].velocidad}, servidores en ${hostingProviders[0].datacenter}`}
        brand={hostingProviders[0].name}
        image={`https://eligetuhosting.cl${hostingProviders[0].logo}`}
        url={hostingProviders[0].url}
        rating={{
          value: hostingProviders[0].rating,
          count: 247,
          bestRating: 10,
          worstRating: 1
        }}
        category="Web Hosting"
        sku={hostingProviders[0].asn}
      />

      {/* ItemList Schema for Ranking */}
      <ItemListSchema 
        name={`Mejores Hosting Chile ${CURRENT_YEAR} - Ranking Completo`}
        description="Ranking editorial con metodología publicada de proveedores de hosting en Chile basado en pruebas de uptime, velocidad y análisis de reclamos"
        items={hostingProviders.map(p => ({
          name: p.name,
          description: `Hosting en Chile con ${p.uptime} uptime, velocidad ${p.velocidad}, datacenter en ${p.datacenter}`,
          url: p.url,
          image: `https://eligetuhosting.cl${p.logo}`,
          brand: p.name,
          rating: p.rating,
          reviewCount: 50
        }))}
        listType="ranking"
      />

      {/* HowTo Schema - Cómo elegir hosting */}
      <HowToSchema 
        name="Cómo elegir el mejor hosting en Chile"
        description="Guía paso a paso para seleccionar el proveedor de hosting ideal para tu sitio web en Chile"
        totalTime="PT15M"
        steps={[
          {
            name: "Evaluar el Uptime",
            text: "Verifica que el proveedor ofrezca al menos 99.9% de uptime. Consulta estadísticas reales y evita promesas de 100%."
          },
          {
            name: "Verificar la Velocidad",
            text: "Busca hosting con tecnología LiteSpeed o SSD NVMe, especialmente si usarás WordPress. La velocidad impacta directamente en SEO."
          },
          {
            name: "Confirmar Servidores en Chile",
            text: "Para audiencia chilena, servidores locales reducen latencia en 200ms+ y mejoran posicionamiento local."
          },
          {
            name: "Revisar Historial de Reclamos",
            text: "Consulta Reclamos.cl para ver quejas verificadas. Proveedores con 0 reclamos demuestran excelente servicio."
          },
          {
            name: "Comparar Precios Reales",
            text: "Calcula el costo de renovación, no solo el precio promocional. Algunos proveedores suben hasta 144% al renovar."
          }
        ]}
      />

      {/* Review Schema for Top Provider */}
      <SEOReviewSchema 
        type="company"
        company={{
          id: hostingProviders[0].asn,
          name: hostingProviders[0].name,
          slug: "hostingplus",
          logo: hostingProviders[0].logo,
          website: hostingProviders[0].url,
          rating: hostingProviders[0].rating,
          reviewCount: 247
        }}
        reviews={[
          {
            id: "review-1",
            author: "Juan Pérez",
            datePublished: `${CURRENT_YEAR}-01-15`,
            ratingValue: 10,
            reviewBody: "Excelente servicio, llevo 3 años con ellos y nunca he tenido problemas. Soporte rápido y profesional.",
            title: "El mejor hosting que he probado"
          },
          {
            id: "review-2",
            author: "María González",
            datePublished: `${CURRENT_YEAR}-01-10`,
            ratingValue: 9,
            reviewBody: "Muy buen uptime y velocidad. El precio se mantiene estable en renovación, algo difícil de encontrar.",
            title: "Relación calidad-precio excelente"
          }
        ]}
      />

      <Navbar />

      <main className="bg-white">
        <RankingHeader
          crumbs={[{ name: 'Ranking', href: '/ranking' }]}
          pageName={`Mejor hosting Chile ${CURRENT_YEAR}`}
          title={`¿Cuál es el mejor hosting en Chile en ${CURRENT_YEAR}?`}
          lead="Comparamos a los cinco proveedores mejor evaluados de Chile: nota, velocidad, reclamos públicos y dónde están sus servidores. Cada dato dice de dónde sale."
          reviewedAt={VERIFICATION_DATE_ISO}
          meta={
            <Link to="/metodologia" className="font-semibold text-ink-2 underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              Ranking editorial con pesos publicados
            </Link>
          }
          actions={
            <Button asChild>
              <a href="#comparativa">Ver la comparativa</a>
            </Button>
          }
        />

        <ChileSummary year={CURRENT_YEAR} />
        <ChileCriteria criteria={criterios} guides={guideLinks} />
        <Methodology />
        <ChileSources />
        <ChileComparisonTable providers={hostingProviders} reviewedAt={VERIFICATION_DATE_ISO} year={CURRENT_YEAR} />
        <ChileWinnerAnalysis year={CURRENT_YEAR} />
        <RankingFaq items={faqs} title="Preguntas frecuentes sobre el mejor hosting en Chile" />
        <ChileClosing year={CURRENT_YEAR} />
      </main>

      <Footer />
    </>
  );
};

export default MejorHostingChile2026;
