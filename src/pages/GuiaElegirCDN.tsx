import React from 'react';
import { Helmet } from 'react-helmet-async';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import EditorialImage from '@/components/media/EditorialImage';
import GuidePage from '@/components/guias/GuidePage';
import GuideBreadcrumbs from '@/components/guias/GuideBreadcrumbs';
import GuideFooter from '@/components/guias/GuideFooter';
import CdnBasicos from '@/components/guias/cdn/CdnBasicos';
import CdnRecomendados from '@/components/guias/cdn/CdnRecomendados';

const CRUMBS = [
  { name: 'Guías', url: '/recursos-hosting-chile' },
  { name: 'Guía: elegir CDN', url: '/guia-elegir-cdn' },
];

const TOC = [
  { id: 'experiencia', label: 'Mi experiencia con CDN' },
  { id: 'que-es-cdn', label: '¿Qué es un CDN?' },
  { id: 'beneficios', label: 'Beneficios de usar CDN' },
  { id: 'factores-clave', label: 'Factores clave a considerar' },
  { id: 'cdns-recomendados', label: 'CDNs recomendados para Chile' },
  { id: 'implementacion', label: 'Cómo implementar un CDN' },
  { id: 'conclusion', label: 'Conclusión' },
];

const REVIEWED_AT = '2026-05-15';

const GuiaElegirCDN = () => {
  return (
    <>
      <Helmet>
        <title>Guía CDN Chile 2026 | EligeTuHosting.cl</title>
        <meta name="description" content="Guía completa para elegir el mejor CDN (Content Delivery Network) en Chile. Mejora la velocidad de carga y optimiza el rendimiento de tu sitio web." />
      </Helmet>
      <BreadcrumbSchema items={[{ name: 'Guías', url: '/recursos-hosting-chile' }, { name: "Guía: elegir CDN", url: "/guia-elegir-cdn" }]} />

      <GuidePage
        breadcrumbs={<GuideBreadcrumbs items={CRUMBS} />}
        title="CDN en Chile: La diferencia entre cargar en 1 segundo vs 8 segundos"
        lead="Te voy a contar cómo un CDN transformó el sitio de mi cliente más exigente: de perder ventas por lentitud a ser el e-commerce más rápido de su rubro. Y lo mejor: sin gastar una fortuna."
        reviewedAt={REVIEWED_AT}
        image={
          <EditorialImage name="datacenter" className="aspect-[16/9] md:aspect-[2/1]" sizes="(min-width: 1024px) 64rem, 100vw" priority />
        }
        toc={TOC}
        footer={<GuideFooter reviewedAt={REVIEWED_AT} />}
      >
        <CdnBasicos />
        <CdnRecomendados />
      </GuidePage>
    </>
  );
};

export default GuiaElegirCDN;
