import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch } from 'lucide-react';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import RelatedArticles from '@/components/RelatedArticles';
import { Button } from '@/components/ui/button';
import GuidePage from '@/components/guias/GuidePage';
import GuideFooter from '@/components/guias/GuideFooter';
import { H2 } from '@/components/guias/GuideBlocks';

const NB = ' ';

const errors = [
  {
    title: "Elegir solo por el precio más bajo",
    description: "El error número 1 que cometen los principiantes.",
    consequences: [
      "Recursos extremadamente limitados (RAM, CPU)",
      "Soporte técnico inexistente o muy lento",
      "Restricciones ocultas en el contrato",
      "Servidores sobrecargados con cientos de sitios"
    ],
    solution: "Evalúa el valor real: compara recursos, soporte y uptime. Pagar algo más por un proveedor estable suele costar menos que las caídas que evita.",
    realCost: "Impacto típico: ventas caídas mientras el sitio está inaccesible"
  },
  {
    title: "No leer la política de renovación",
    description: "Los precios promocionales pueden ser engañosos.",
    consequences: [
      "Precio promocional bajo el primer periodo y renovación bastante más alta",
      "Cargos automáticos sin previo aviso",
      "Penalidades por cancelación anticipada",
      "Costos ocultos por servicios «incluidos»"
    ],
    solution: "Siempre revisa el precio de renovación ANTES de contratar. Pregunta por descuentos en contratos anuales o bianuales.",
    realCost: `Sobrecosto promedio: 200–400${NB}% sobre precio promocional`
  },
  {
    title: "Ignorar la ubicación del datacenter",
    description: "La distancia física afecta directamente la velocidad.",
    consequences: [
      `Latencia de 200–400${NB}ms desde servidores USA/Europa`,
      "Penalización de Google por velocidad lenta",
      `Tasa de rebote 30–50${NB}% mayor`,
      `Pérdida de conversiones del 20–40${NB}%`
    ],
    solution: "Para audiencia chilena, elige servidores en Santiago. Para Latinoamérica, considera Miami o São Paulo. Para global, usa CDN.",
    realCost: `Pérdida conversiones: 20–40${NB}% de ventas potenciales`
  },
  {
    title: "Confiar en «recursos ilimitados»",
    description: "El marketing de «ilimitado» es técnicamente imposible.",
    consequences: [
      "Límites ocultos de inodos (archivos)",
      "Suspensión por «uso excesivo de CPU»",
      "Throttling de ancho de banda no anunciado",
      "Términos vagos de «uso justo»"
    ],
    solution: "Lee los TOS (Términos de Servicio) para encontrar límites reales. Pregunta específicamente por límites de inodos, CPU y RAM.",
    realCost: "Sitio suspendido sin previo aviso en momentos críticos"
  },
  {
    title: "No verificar la reputación del proveedor",
    description: "Muchos proveedores tienen historial de problemas.",
    consequences: [
      "Caídas frecuentes no compensadas",
      "Soporte que tarda días en responder",
      "Migración forzada por cierre de empresa",
      "Pérdida de datos por backups inexistentes"
    ],
    solution: "Revisa: tiempo en el mercado (mínimo 3 años), opiniones en Reclamos.cl, rankings independientes, y prueba el soporte antes de contratar.",
    realCost: "Pérdida total de datos y 2–7 días de inactividad"
  },
  {
    title: "Subestimar las necesidades de crecimiento",
    description: "El plan más barato hoy puede ser insuficiente mañana.",
    consequences: [
      "Migraciones frecuentes entre planes",
      "Caídas durante picos de tráfico",
      "Costos de migración a otro proveedor",
      "Pérdida de momentum en campañas"
    ],
    solution: "Calcula crecimiento esperado a 12 meses. Elige un plan que permita escalar fácilmente sin cambiar de proveedor.",
    realCost: "Costo migración: a consultar + tiempo perdido"
  },
  {
    title: "No tener backups propios",
    description: "Confiar solo en los backups del hosting es arriesgado.",
    consequences: [
      "Los backups del hosting pueden fallar",
      "Políticas de retención limitadas (7–30 días)",
      "Costo extra por restauración de backups",
      "Pérdida permanente de datos críticos"
    ],
    solution: "Implementa backups automáticos externos (Google Drive, Dropbox, servicios especializados). Prueba restauraciones mensualmente.",
    realCost: "Pérdida total de negocio si no hay backup externo"
  },
  {
    title: "Descuidar la seguridad",
    description: "Un sitio hackeado puede destruir tu reputación.",
    consequences: [
      "Blacklisting de Google (penalización SEO)",
      "Robo de datos de clientes (multas GDPR)",
      "Distribución de malware a visitantes",
      "Pérdida total de confianza de clientes"
    ],
    solution: "Verifica que incluya: SSL gratis, firewall, anti-malware, actualizaciones automáticas, y monitoreo de seguridad 24/7.",
    realCost: "Recuperación de hackeo: a consultar"
  }
];

const CHECKLIST = [
  "Comparar al menos 3 proveedores",
  "Verificar precio de renovación",
  "Confirmar ubicación del datacenter",
  "Leer términos de «uso justo»",
  "Revisar opiniones en Reclamos.cl",
  "Calcular crecimiento a 12 meses",
  "Configurar backups externos",
  "Verificar certificaciones de seguridad"
];

const TOC = [
  { id: 'por-que', label: 'Por qué leer esta guía' },
  ...errors.map((e, i) => ({ id: `error-${i + 1}`, label: `${i + 1}. ${e.title}` })),
  { id: 'checklist', label: 'Checklist rápido' },
  { id: 'ayuda', label: '¿Necesitas ayuda?' },
];

const ErroresComunesHosting = () => {
  // Alimenta el JSON-LD de las migas (SEOBreadcrumbs): no cambiar.
  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Recursos', href: '/recursos-hosting-chile' },
    { name: 'Errores Comunes', href: '/errores-comunes-hosting-chile' }
  ];

  const relatedArticles = [
    {
      title: 'Guía completa para elegir hosting',
      description: 'Todo lo que necesitas saber',
      path: '/guia-completa-elegir-hosting-chile-2026'
    },
    {
      title: 'Guía de seguridad web',
      description: 'Protege tu sitio correctamente',
      path: '/guia-seguridad-web'
    },
    {
      title: 'Ranking de hosting en Chile',
      description: 'Proveedores verificados y probados',
      path: '/ranking'
    }
  ];

  return (
    <>
      <DynamicMetaTags
        title="8 Errores Comunes al Elegir Hosting en Chile (y Cómo Evitarlos)"
        description="Descubre los errores más costosos que cometen usuarios al contratar hosting en Chile y cómo evitarlos. Guía con casos reales y soluciones prácticas."
        keywords="errores hosting, problemas hosting chile, elegir mal hosting, hosting barato problemas"
      />

      <GuidePage
        breadcrumbs={<SEOBreadcrumbs items={breadcrumbItems} />}
        title="8 Errores Comunes al Elegir Hosting en Chile"
        lead="Evita pérdidas evitables conociendo estos errores antes de contratar"
        meta={
          <span className="inline-flex items-center gap-1.5">
            <FileSearch aria-hidden className="h-4 w-4 text-ink-3" />
            Basado en análisis de 500+ casos reales de usuarios chilenos
          </span>
        }
        toc={TOC}
        footer={<GuideFooter related={<RelatedArticles articles={relatedArticles} embedded />} />}
      >
        <H2 id="por-que">Por qué leer esta guía</H2>
        <p>
          El 73&nbsp;% de los usuarios chilenos que contratan su primer hosting cometen al menos uno de estos errores, lo
          que suele salir caro durante el primer año.
        </p>
        <p>
          Esta guía está basada en casos reales documentados y te mostrará no solo qué evitar, sino también el costo real
          de cada error.
        </p>

        {errors.map((error, index) => (
          <React.Fragment key={error.title}>
            <H2 id={`error-${index + 1}`}>
              {index + 1}. {error.title}
            </H2>
            <p>{error.description}</p>
            <h3>Consecuencias</h3>
            <ul>
              {error.consequences.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <h3>Solución</h3>
            <p>{error.solution}</p>
            <p>
              <strong>Costo real de este error:</strong> {error.realCost}
            </p>
          </React.Fragment>
        ))}

        <H2 id="checklist">Checklist rápido anti-errores</H2>
        <ol>
          {CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>

        <H2 id="ayuda">¿Necesitas ayuda para elegir correctamente?</H2>
        <p>Consulta nuestro ranking con análisis detallados y verificados.</p>
        <div className="not-prose mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/mejor-hosting-chile-2026">Ver el ranking</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/guia-completa-elegir-hosting-chile-2026">Guía completa paso a paso</Link>
          </Button>
        </div>
      </GuidePage>
    </>
  );
};

export default ErroresComunesHosting;
