import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldAlert } from 'lucide-react';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import RecommendedByData from '@/components/RecommendedByData';
import GuidePage from '@/components/guias/GuidePage';
import GuideBreadcrumbs from '@/components/guias/GuideBreadcrumbs';
import GuideFooter from '@/components/guias/GuideFooter';
import SegAmenazas from '@/components/guias/seguridad/SegAmenazas';
import SegWordPressWaf from '@/components/guias/seguridad/SegWordPressWaf';
import SegMonitoreoCasos from '@/components/guias/seguridad/SegMonitoreoCasos';

const CRUMBS = [
  { name: 'Guías', url: '/recursos-hosting-chile' },
  { name: 'Guía: seguridad web', url: '/guia-seguridad-web' },
];

const TOC = [
  { id: 'experiencia', label: 'Mi experiencia con hackeos' },
  { id: 'amenazas-chile', label: 'Amenazas específicas en Chile' },
  { id: 'medidas-basicas', label: 'Medidas básicas de seguridad' },
  { id: 'wordpress-security', label: 'Seguridad WordPress' },
  { id: 'firewall-waf', label: 'Firewall y WAF' },
  { id: 'ssl-certificados', label: 'SSL y certificados' },
  { id: 'monitoreo', label: 'Monitoreo y alertas' },
  { id: 'casos-reales', label: 'Casos reales en Chile' },
  { id: 'plan-accion', label: 'Plan de acción inmediato' },
];

const REVIEWED_AT = '2026-05-15';

const GuiaSeguridadWeb = () => {
  return (
    <>
      <Helmet>
        <title>Seguridad Web Chile 2026 | EligeTuHosting.cl</title>
        <meta name="description" content="Guía completa de seguridad web en Chile. Aprende a proteger tu sitio de hackers, malware y ataques. Medidas específicas para el mercado chileno con casos reales." />
        <meta name="keywords" content="seguridad web chile, proteger sitio web, firewall chile, SSL chile, malware wordpress" />
      </Helmet>
      <BreadcrumbSchema items={[{ name: 'Guías', url: '/recursos-hosting-chile' }, { name: "Guía: seguridad web", url: "/guia-seguridad-web" }]} />

      <GuidePage
        breadcrumbs={<GuideBreadcrumbs items={CRUMBS} />}
        title="Seguridad Web en Chile: Protege tu Sitio"
        lead="Después de limpiar más de 300 sitios hackeados en Chile, te enseño cómo proteger el tuyo"
        reviewedAt={REVIEWED_AT}
        meta={
          <span className="inline-flex items-center gap-1.5">
            <ShieldAlert aria-hidden className="h-4 w-4 text-ink-3" />
            En Chile se hackean 50+ sitios diarios
          </span>
        }
        toc={TOC}
        footer={<GuideFooter reviewedAt={REVIEWED_AT} extra={<RecommendedByData />} />}
      >
        <SegAmenazas />
        <SegWordPressWaf />
        <SegMonitoreoCasos />
      </GuidePage>
    </>
  );
};

export default GuiaSeguridadWeb;
