import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap } from 'lucide-react';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import FinalCTA from '@/components/FinalCTA';
import EditorialImage from '@/components/media/EditorialImage';
import GuidePage from '@/components/guias/GuidePage';
import GuideBreadcrumbs from '@/components/guias/GuideBreadcrumbs';
import GuideFooter from '@/components/guias/GuideFooter';
import WpIntro from '@/components/guias/wordpress/WpIntro';
import WpRanking from '@/components/guias/wordpress/WpRanking';
import WpOptimizacion from '@/components/guias/wordpress/WpOptimizacion';
import WpMigracionCasos from '@/components/guias/wordpress/WpMigracionCasos';

const CRUMBS = [
  { name: 'Guías', url: '/recursos-hosting-chile' },
  { name: 'Guía: hosting WordPress', url: '/guia-hosting-wordpress' },
];

const TOC = [
  { id: 'experiencia', label: 'Mi experiencia con WordPress' },
  { id: 'requerimientos', label: 'Requerimientos específicos' },
  { id: 'tipos-hosting', label: 'Tipos de hosting WordPress' },
  { id: 'ranking-proveedores', label: 'Ranking proveedores Chile' },
  { id: 'optimizaciones', label: 'Optimizaciones específicas' },
  { id: 'problemas-comunes', label: 'Problemas comunes' },
  { id: 'migracion-wp', label: 'Migración WordPress' },
  { id: 'casos-reales', label: 'Casos reales de éxito' },
  { id: 'plan-accion', label: 'Tu plan de acción' },
];

const REVIEWED_AT = '2026-05-15';

const GuiaHostingWordPress = () => {
  return (
    <>
      <Helmet>
        <title>Hosting WordPress Chile 2026 | EligeTuHosting.cl</title>
        <meta name="description" content="Guía específica para elegir hosting WordPress en Chile. Comparativa real de proveedores, optimizaciones específicas y casos de éxito con WordPress chileno." />
        <meta name="keywords" content="hosting wordpress chile, mejor hosting wordpress, wordpress optimizado chile, hosting wordpress rapido" />
      </Helmet>
      <BreadcrumbSchema items={[{ name: 'Guías', url: '/recursos-hosting-chile' }, { name: "Guía: hosting WordPress", url: "/guia-hosting-wordpress" }]} />

      <GuidePage
        breadcrumbs={<GuideBreadcrumbs items={CRUMBS} />}
        title="Hosting para WordPress en Chile"
        lead="Después de optimizar 500+ sitios WordPress chilenos, te muestro qué hosting realmente funciona"
        reviewedAt={REVIEWED_AT}
        meta={
          <span className="inline-flex items-center gap-1.5">
            <Zap aria-hidden className="h-4 w-4 text-ink-3" />
            WordPress corre en 43&nbsp;% de internet
          </span>
        }
        image={
          <EditorialImage name="wordpress" className="aspect-[16/9] md:aspect-[2/1]" sizes="(min-width: 1024px) 64rem, 100vw" priority />
        }
        toc={TOC}
        footer={<GuideFooter reviewedAt={REVIEWED_AT} />}
        after={
          <FinalCTA
            title="¿Listo para un WordPress súper rápido?"
            subtitle="HostingPlus optimiza WordPress automáticamente. 30 días de garantía."
            buttonText="Probar HostingPlus WordPress"
            buttonLink="https://www.hostingplus.cl/"
          />
        }
      >
        <WpIntro />
        <WpRanking />
        <WpOptimizacion />
        <WpMigracionCasos />
      </GuidePage>
    </>
  );
};

export default GuiaHostingWordPress;
