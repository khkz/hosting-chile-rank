import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import SEOFAQSchema from '@/components/SEO/SEOFAQSchema';
import RecommendedByData from '@/components/RecommendedByData';
import EditorialImage from '@/components/media/EditorialImage';
import GuidePage from '@/components/guias/GuidePage';
import GuideBreadcrumbs from '@/components/guias/GuideBreadcrumbs';
import GuideFooter from '@/components/guias/GuideFooter';
import { ExperienciaYTipos, FactoresClave } from '@/components/guias/elegir-hosting/TiposYFactores';
import { Preguntas, Requisitos, ErroresComunes } from '@/components/guias/elegir-hosting/PreguntasYRequisitos';
import { Recomendaciones, Conclusion } from '@/components/guias/elegir-hosting/Recomendaciones';

const guiaFaqs = [
  { question: '¿Qué tipo de sitio web voy a crear?', answer: 'Un blog personal, una tienda online, un sitio corporativo o una aplicación web tienen requisitos diferentes. Por ejemplo, para una tienda online necesitarás certificado SSL, respaldos frecuentes y buen soporte técnico.' },
  { question: '¿Cuánto tráfico espero recibir?', answer: 'El volumen de visitas determinará los recursos necesarios. Si esperas mucho tráfico desde el inicio o planeas crecer rápidamente, considera opciones más robustas como VPS o planes premium.' },
  { question: '¿Qué habilidades técnicas tengo?', answer: 'Si no tienes experiencia técnica, busca hosting con panel de control intuitivo (cPanel, Plesk) y buena documentación. Los hostings administrados son ideales para quienes prefieren enfocarse en su negocio y no en mantener el servidor.' },
  { question: '¿Qué importancia tiene la velocidad para mi proyecto?', answer: 'Para sitios de comercio electrónico o con audiencia principalmente chilena, la velocidad es crucial. Busca hosting con servidores en Chile, CDN incluido y tecnologías de caché para garantizar tiempos de carga óptimos.' },
  { question: '¿Cuál es mi presupuesto a largo plazo?', answer: 'Considera no solo el costo inicial sino también las renovaciones. Algunos proveedores ofrecen grandes descuentos el primer año pero luego las renovaciones son costosas. Evalúa el TCO (Costo Total de Propiedad) a 3 años.' },
];

const CRUMBS = [
  { name: 'Guías', url: '/recursos-hosting-chile' },
  { name: 'Guía: elegir hosting', url: '/guia-elegir-hosting' },
];

const TOC = [
  { id: 'experiencia', label: 'Mi experiencia' },
  { id: 'tipos-hosting', label: 'Tipos de hosting disponibles' },
  { id: 'factores-clave', label: 'Factores clave a considerar' },
  { id: 'preguntas', label: 'Preguntas que debes hacerte' },
  { id: 'websiterequisitos', label: 'Requisitos según tipo de sitio web' },
  { id: 'errorescomunes', label: 'Errores comunes al elegir hosting' },
  { id: 'recomendaciones', label: 'Nuestras recomendaciones' },
  { id: 'conclusion', label: 'Conclusión' },
];

const REVIEWED_AT = '2026-05-15';

const GuiaElegirHosting = () => {
  useEffect(() => {
    document.title = "Guía para elegir el mejor hosting | eligetuhosting.cl";
  }, []);

  return (
    <>
      <Helmet>
        <title>Guía Elegir Hosting Chile | EligeTuHosting.cl</title>
        <meta
          name="description"
          content="Aprende a elegir el mejor proveedor de hosting para tu sitio web según tus necesidades. Guía completa paso a paso."
        />
      </Helmet>
      <BreadcrumbSchema items={[{ name: 'Guías', url: '/recursos-hosting-chile' }, { name: "Guía: elegir hosting", url: "/guia-elegir-hosting" }]} />
      <SEOFAQSchema faqs={guiaFaqs} />

      <GuidePage
        breadcrumbs={<GuideBreadcrumbs items={CRUMBS} />}
        title="¿Hosting en Chile? Te enseño cómo elegir el mejor"
        lead="Después de 8 años ayudando a empresas chilenas a encontrar su hosting ideal, te voy a contar todo lo que necesitas saber para no meter la pata (como me pasó con mi primer sitio)."
        reviewedAt={REVIEWED_AT}
        image={
          <EditorialImage
            name="guias"
            className="aspect-[16/9] md:aspect-[2/1]"
            sizes="(min-width: 1024px) 64rem, 100vw"
            priority
          />
        }
        toc={TOC}
        footer={<GuideFooter reviewedAt={REVIEWED_AT} extra={<RecommendedByData />} />}
      >
        <ExperienciaYTipos />
        <FactoresClave />
        <Preguntas faqs={guiaFaqs} />
        <Requisitos />
        <ErroresComunes />
        <Recomendaciones />
        <Conclusion />
      </GuidePage>
    </>
  );
};

export default GuiaElegirHosting;
