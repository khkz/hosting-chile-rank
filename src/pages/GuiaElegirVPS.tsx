import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ClipboardCheck } from 'lucide-react';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import RecommendedByData from '@/components/RecommendedByData';
import EditorialImage from '@/components/media/EditorialImage';
import GuidePage from '@/components/guias/GuidePage';
import GuideBreadcrumbs from '@/components/guias/GuideBreadcrumbs';
import GuideFooter from '@/components/guias/GuideFooter';
import VpsSenales from '@/components/guias/vps/VpsSenales';
import VpsRanking from '@/components/guias/vps/VpsRanking';
import VpsErroresMigracion from '@/components/guias/vps/VpsErroresMigracion';

const CRUMBS = [
  { name: 'Guías', url: '/recursos-hosting-chile' },
  { name: 'Guía: elegir VPS', url: '/guia-elegir-vps' },
];

const TOC = [
  { id: 'experiencia', label: 'La lección más cara' },
  { id: 'senales-vps', label: '5 señales de que necesitas VPS' },
  { id: 'ranking-vps', label: 'Ranking VPS Chile' },
  { id: 'errores-comunes', label: 'Errores que debes evitar' },
  { id: 'migracion-paso-a-paso', label: 'Migración paso a paso' },
  { id: 'consejo-final', label: 'Mi consejo final' },
];

const REVIEWED_AT = '2026-05-15';

const GuiaElegirVPS = () => {
  return (
    <>
      <Helmet>
        <title>VPS Chile 2025: Guía y Ranking | EligeTuHosting.cl</title>
        <meta
          name="description"
          content="Guía VPS Chile 2025: 180 migraciones exitosas. Ranking real de 5 mejores proveedores, precios actualizados y cuándo SÍ necesitas VPS. Experiencia de 4 años."
        />
      </Helmet>
      <BreadcrumbSchema items={[{ name: 'Guías', url: '/recursos-hosting-chile' }, { name: "Guía: elegir VPS", url: "/guia-elegir-vps" }]} />

      <GuidePage
        breadcrumbs={<GuideBreadcrumbs items={CRUMBS} />}
        title="VPS Chile: Guía Completa Basada en 180 Migraciones Reales"
        lead="Después de 4 años ayudando empresas chilenas a migrar a VPS, te comparto las 5 señales que indican cuándo SÍ necesitas uno + ranking real de proveedores con precios."
        reviewedAt={REVIEWED_AT}
        meta={
          <span className="inline-flex items-center gap-1.5">
            <ClipboardCheck aria-hidden className="h-4 w-4 text-ink-3" />
            Basado en 180 migraciones exitosas
          </span>
        }
        image={
          <EditorialImage name="vps" className="aspect-[16/9] md:aspect-[2/1]" sizes="(min-width: 1024px) 64rem, 100vw" priority />
        }
        toc={TOC}
        footer={<GuideFooter reviewedAt={REVIEWED_AT} extra={<RecommendedByData />} />}
      >
        <VpsSenales />
        <VpsRanking />
        <VpsErroresMigracion />
      </GuidePage>
    </>
  );
};

export default GuiaElegirVPS;
