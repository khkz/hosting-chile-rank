import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import HowToSchema from '@/components/SEO/HowToSchema';
import SEOFAQSchema from '@/components/SEO/SEOFAQSchema';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import RelatedArticles from '@/components/RelatedArticles';
import EditorialImage from '@/components/media/EditorialImage';
import { Button } from '@/components/ui/button';
import GuidePage from '@/components/guias/GuidePage';
import GuideFooter from '@/components/guias/GuideFooter';
import { H2, MarkList, MarkItem } from '@/components/guias/GuideBlocks';

const GuiaCompletaElegirHosting = () => {
  // Alimenta el JSON-LD de las migas (SEOBreadcrumbs): no cambiar.
  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Recursos', href: '/recursos-hosting-chile' },
    { name: 'Guía Completa', href: '/guia-completa-elegir-hosting-chile' }
  ];

  const relatedArticles = [
    {
      title: 'Errores comunes al elegir hosting',
      description: 'Evita los 8 errores más costosos',
      path: '/errores-comunes-hosting-chile'
    },
    {
      title: 'Mejor hosting WordPress en Chile',
      description: 'Ranking especializado para WordPress',
      path: '/mejor-hosting-wordpress-chile'
    },
    {
      title: 'Calculadora TCO',
      description: 'Calcula el costo real de tu hosting',
      path: '/calculadora-tco'
    }
  ];

  // Alimenta el JSON-LD HowTo: textos sin cambios.
  const steps = [
    {
      name: "Define tus necesidades y presupuesto",
      text: "Identifica el tipo de sitio web que necesitas (blog, e-commerce, corporativo), estima el tráfico mensual esperado y establece un presupuesto realista considerando costos iniciales y renovaciones.",
    },
    {
      name: "Evalúa el rendimiento y velocidad",
      text: "Verifica que el hosting ofrezca discos SSD o NVMe, tecnología LiteSpeed o similar, y ubicación de servidores cercana a tu audiencia (idealmente en Chile para sitios chilenos).",
    },
    {
      name: "Revisa el soporte técnico",
      text: "Confirma que haya soporte 24/7 en español, tiempo de respuesta rápido (menos de 30 minutos), y múltiples canales (chat, ticket, teléfono).",
    },
    {
      name: "Analiza características de seguridad",
      text: "Asegúrate de que incluyan SSL gratuito, backups automáticos diarios, protección anti-DDoS, y actualizaciones de seguridad regulares.",
    },
    {
      name: "Verifica escalabilidad y garantías",
      text: "Revisa la facilidad para upgrades, garantía de uptime (mínimo 99.9%), política de reembolso, y lee opiniones reales de usuarios chilenos.",
    }
  ];

  // Alimenta el JSON-LD FAQPage: textos sin cambios.
  const faqs = [
    {
      question: "¿Cuánto debería invertir en hosting para mi primer sitio web?",
      answer: "Para un sitio web básico o blog personal, puedes empezar con planes a consultar. Para e-commerce o sitios corporativos, considera invertir a consultar para asegurar rendimiento y seguridad adecuados."
    },
    {
      question: "¿Es mejor hosting compartido o VPS para empezar?",
      answer: "El hosting compartido es ideal para comenzar si esperas menos de 10.000 visitas mensuales y tienes presupuesto limitado. Un VPS es recomendable cuando superes las 20.000 visitas mensuales o necesites recursos dedicados para aplicaciones específicas."
    },
    {
      question: "¿Por qué es importante que el servidor esté en Chile?",
      answer: "Los servidores en Chile reducen la latencia entre 80-200ms comparado con servidores en USA o Europa, lo que mejora la velocidad de carga hasta en un 40%. Esto impacta directamente en el SEO, experiencia de usuario y tasas de conversión."
    },
    {
      question: "¿Qué significa uptime del 99.9% en la práctica?",
      answer: "Un uptime del 99.9% permite hasta 43 minutos de inactividad al mes. El 99.95% permite 21 minutos, y el 99.99% solo 4 minutos. Para sitios de negocio, busca mínimo 99.95% con compensación en caso de incumplimiento."
    },
    {
      question: "¿Cómo puedo verificar la reputación de un proveedor de hosting?",
      answer: "Revisa rankings con metodología publicada, como EligeTuHosting.cl, busca opiniones en redes sociales chilenas, consulta en Reclamos.cl, prueba el soporte antes de contratar, y verifica certificaciones de calidad y tiempo en el mercado."
    }
  ];

  const checklist = [
    "Disco SSD o NVMe",
    "Certificado SSL gratuito incluido",
    "Backups automáticos diarios",
    "Panel de control en español (cPanel/Plesk)",
    "Soporte técnico 24/7 en español",
    "Servidores en Chile o Latinoamérica",
    "Garantía de uptime mínimo 99,9 %",
    "Política de reembolso (14–30 días)",
    "Migración gratuita desde otro hosting",
    "Protección anti-malware y firewall",
    "Emails corporativos incluidos",
    "Facilidad para escalar recursos"
  ];

  const commonMistakes = [
    {
      title: "Elegir solo por precio bajo",
      description: "El hosting más barato suele tener recursos limitados, soporte deficiente y muchas restricciones ocultas.",
    },
    {
      title: "No leer la letra pequeña de renovación",
      description: "Muchos proveedores ofrecen precios promocionales que se duplican o triplican al renovar.",
    },
    {
      title: "Ignorar la ubicación del servidor",
      description: "Un servidor en Europa puede añadir 200–300 ms de latencia a visitantes chilenos, afectando SEO.",
    },
    {
      title: "No verificar límites de recursos",
      description: "El «almacenamiento ilimitado» suele tener restricciones de inodos o ancho de banda ocultas.",
    }
  ];

  const toc = [
    { id: 'por-que', label: '¿Por qué esta guía es diferente?' },
    { id: 'pasos', label: 'Proceso de selección en 5 pasos' },
    { id: 'checklist', label: 'Checklist: qué debe incluir' },
    { id: 'errores', label: 'Errores comunes a evitar' },
    { id: 'preguntas-frecuentes', label: 'Preguntas frecuentes' },
    { id: 'siguiente-paso', label: '¿Listo para elegir?' },
  ];

  return (
    <>
      <DynamicMetaTags
        title="Guía Completa para Elegir Hosting en Chile 2026"
        description="Guía paso a paso con checklist, errores comunes a evitar y recomendaciones de expertos para elegir el mejor hosting para tu sitio web en Chile."
        keywords="guía elegir hosting, cómo elegir hosting chile, checklist hosting, errores hosting"
      />

      <HowToSchema
        name="Cómo Elegir el Mejor Hosting en Chile - Guía Completa 2026"
        description="Guía paso a paso para seleccionar el hosting ideal según tus necesidades, presupuesto y objetivos de negocio en Chile."
        totalTime="PT20M"
        steps={steps}
      />

      <SEOFAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[{ name: 'Guías', url: '/recursos-hosting-chile' }, { name: 'Guía completa para elegir hosting', url: '/guia-completa-elegir-hosting-chile-2026' }]} />

      <GuidePage
        breadcrumbs={<SEOBreadcrumbs items={breadcrumbItems} />}
        title="Guía Completa para Elegir Hosting en Chile 2026"
        lead="Todo lo que necesitas saber para tomar la decisión correcta"
        reviewedAt="2026-05-15"
        meta={
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="h-4 w-4 text-ink-3" />
            Lectura: 20 min
          </span>
        }
        image={
          <EditorialImage name="guias" className="aspect-[16/9] md:aspect-[2/1]" sizes="(min-width: 1024px) 64rem, 100vw" priority />
        }
        toc={toc}
        footer={
          <GuideFooter reviewedAt="2026-05-15" related={<RelatedArticles articles={relatedArticles} embedded />} />
        }
      >
        <H2 id="por-que">¿Por qué esta guía es diferente?</H2>
        <p>
          Después de analizar más de 50 proveedores de hosting en Chile y revisar miles de opiniones reales, hemos
          creado esta guía práctica basada en datos verificables y experiencias documentadas.
        </p>
        <p>
          No encontrarás promociones comerciales aquí, solo información objetiva para ayudarte a elegir el hosting que
          realmente necesitas.
        </p>

        <H2 id="pasos">Proceso de selección en 5 pasos</H2>
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <h3>
              Paso {index + 1}: {step.name}
            </h3>
            <p>{step.text}</p>
          </React.Fragment>
        ))}

        <H2 id="checklist">Checklist: ¿qué debe incluir tu hosting?</H2>
        <MarkList className="sm:columns-2 sm:gap-8 [&>li]:break-inside-avoid">
          {checklist.map((item) => (
            <MarkItem key={item}>{item}</MarkItem>
          ))}
        </MarkList>

        <H2 id="errores">Errores comunes a evitar</H2>
        {commonMistakes.map((mistake) => (
          <React.Fragment key={mistake.title}>
            <h3>{mistake.title}</h3>
            <p>{mistake.description}</p>
          </React.Fragment>
        ))}

        <H2 id="preguntas-frecuentes">Preguntas frecuentes</H2>
        {faqs.map((faq) => (
          <React.Fragment key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </React.Fragment>
        ))}

        <H2 id="siguiente-paso">¿Listo para elegir tu hosting?</H2>
        <p>Consulta nuestro ranking actualizado con análisis detallados de cada proveedor.</p>
        <div className="not-prose mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/mejor-hosting-chile-2026">Ver el ranking</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/comparativa">Comparar</Link>
          </Button>
        </div>
      </GuidePage>
    </>
  );
};

export default GuiaCompletaElegirHosting;
