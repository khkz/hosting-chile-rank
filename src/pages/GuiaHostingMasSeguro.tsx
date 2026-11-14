import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldAlert } from 'lucide-react';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOFAQSchema from '@/components/SEO/SEOFAQSchema';
import SecurityRiskQuiz from '@/components/SecurityRiskQuiz';
import RelatedArticles from '@/components/RelatedArticles';
import GuidePage from '@/components/guias/GuidePage';
import GuideFooter from '@/components/guias/GuideFooter';
import { H2 } from '@/components/guias/GuideBlocks';
import { cifrasES } from '@/components/guias/cifras';
import { SeguroIntro, SeguroCapas } from '@/components/guias/seguro/SeguroIntroCapas';
import SeguroComparativa from '@/components/guias/seguro/SeguroComparativa';

// Alimenta el JSON-LD FAQPage: textos sin cambios (lo visible pasa por cifrasES).
const faqs = [
  {
    question: '¿Qué es un WAF y por qué debería exigirlo del hosting?',
    answer:
      'Un WAF (Web Application Firewall) filtra y monitorea el tráfico HTTP antes de que llegue a tu sitio. Bloquea inyecciones SQL, XSS, bots maliciosos y exploits contra plugins desactualizados. Un WAF a nivel de servidor protege todo el entorno de hosting, no solo una instalación de WordPress, y reduce drásticamente la ventana de ataque cuando Mitos u otros publican un CVE.',
  },
  {
    question: '¿Son suficientes los backups del hosting o debo hacer los míos?',
    answer:
      'Los backups del hosting son la primera línea, pero nunca deben ser la única. Exige al menos 7 a 30 días de retención, almacenamiento fuera del servidor principal y restauración granular (archivo, base de datos o sitio completo). Para proyectos críticos, complementa con tu propio backup remoto (por ejemplo, con plugins de WordPress a S3) como política de redundancia.',
  },
  {
    question: '¿Cómo funciona el parcheo virtual si mi plugin todavía no tiene actualización?',
    answer:
      'El parcheo virtual (también llamado virtual patching) crea una regla del WAF que bloquea la petición maliciosa conocida sin modificar el código del plugin. Es una medida temporal: te da tiempo para actualizar el plugin cuando el desarrollador publique el fix oficial, evitando que tu sitio sea hackeado en las primeras 24-48 horas después de la divulgación del CVE. Imunify360 y algunos WAF avanzados implementan esto automáticamente.',
  },
  {
    question: 'Mi sitio usa WordPress y cPanel: ¿qué debo exigir al hosting?',
    answer:
      'Específicamente para WordPress: bloqueo de fuerza bruta en wp-login y xmlrpc, hardening automático de wp-config, escaneo de plugins con CVEs conocidas y alerta proactiva de actualizaciones críticas. Para cPanel: 2FA obligatorio, aislamiento por cuenta (CageFS), protección de fuerza bruta en el panel y monitoreo de archivos PHP subidos. Un hosting que combine ambas capas reduce el riesgo real de hackeo en más del 90%.',
  },
];

const TOC = [
  { id: 'por-que', label: 'Por qué importa' },
  { id: 'checklist', label: 'Checklist de un hosting seguro' },
  { id: 'quiz', label: 'Test: tu nivel de riesgo' },
  { id: 'capas', label: 'Las 4 capas de seguridad' },
  { id: 'wordpress-cpanel', label: 'WordPress y cPanel' },
  { id: 'caso-destacado', label: 'Caso destacado' },
  { id: 'comparativa', label: 'Comparativa por proveedor' },
  { id: 'preguntas-proveedor', label: '7 preguntas para tu hosting' },
  { id: 'preguntas-frecuentes', label: 'Preguntas frecuentes' },
];

const RELACIONADOS = [
  { title: 'Guía de seguridad web', description: 'Buenas prácticas más allá del hosting.', path: '/guia-seguridad-web' },
  { title: 'Cómo elegir SSL', description: 'HTTPS sin sorpresas.', path: '/guia-elegir-ssl' },
  { title: 'Mejor hosting WordPress', description: 'Ranking enfocado en WP.', path: '/mejor-hosting-wordpress-chile' },
];

const REVIEWED_AT = '2026-05-15';

const GuiaHostingMasSeguro = () => {
  // Alimenta el JSON-LD de las migas (SEOBreadcrumbs): no cambiar.
  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Guías', href: '/recursos-hosting-chile' },
    { name: 'Cómo elegir el hosting más seguro', href: '/guia-hosting-mas-seguro-chile' },
  ];

  return (
    <>
      <DynamicMetaTags
        title="Cómo elegir el hosting más seguro en Chile 2026"
        description="Guía práctica para elegir un hosting seguro: WAF, BitNinja, Imunify360, firewall enterprise, parcheo de vulnerabilidades WordPress y cPanel. Checklist y comparativa."
        keywords="hosting seguro chile, hosting con waf, bitninja, imunify360, seguridad wordpress, seguridad cpanel, firewall hosting"
      />
      <Helmet>
        <link rel="canonical" href="https://eligetuhosting.cl/guia-hosting-mas-seguro-chile" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Cómo elegir el hosting más seguro en Chile',
            description:
              'Checklist técnico para evaluar la seguridad real de un proveedor de hosting: WAF, BitNinja, Imunify360, firewall enterprise y parcheo de vulnerabilidades.',
            author: { '@type': 'Organization', name: 'EligeTuHosting.cl' },
            publisher: { '@type': 'Organization', name: 'EligeTuHosting.cl' },
            datePublished: '2026-05-15',
            mainEntityOfPage: 'https://eligetuhosting.cl/guia-hosting-mas-seguro-chile',
          })}
        </script>
      </Helmet>
      <BreadcrumbSchema items={[{ name: 'Guías', url: '/recursos-hosting-chile' }, { name: "Guía: hosting más seguro", url: "/guia-hosting-mas-seguro-chile" }]} />
      <SEOFAQSchema faqs={faqs} />

      <GuidePage
        breadcrumbs={<SEOBreadcrumbs items={breadcrumbItems} />}
        title="Cómo elegir el hosting más seguro para tu sitio"
        lead="Guía técnica y honesta para elegir un proveedor que realmente te proteja: WAF, BitNinja, Imunify360, firewall enterprise y parcheo de vulnerabilidades de WordPress y cPanel."
        reviewedAt={REVIEWED_AT}
        meta={
          <span className="inline-flex items-center gap-1.5">
            <ShieldAlert aria-hidden className="h-4 w-4 text-ink-3" />
            Mitos publica vulnerabilidades nuevas todas las semanas
          </span>
        }
        toc={TOC}
        stickyCta={false}
        footer={
          <GuideFooter
            reviewedAt={REVIEWED_AT}
            related={<RelatedArticles articles={RELACIONADOS} title="Sigue aprendiendo" embedded />}
          />
        }
      >
        <SeguroIntro />

        <H2 id="quiz">Test: ¿qué tan en riesgo está tu sitio?</H2>
        <p>
          10 preguntas rápidas para calcular tu nivel de riesgo y ver qué funciones de seguridad necesitas exigirle a tu
          hosting.
        </p>
        <div className="not-prose my-6">
          <SecurityRiskQuiz />
        </div>

        <SeguroCapas />
        <SeguroComparativa />

        <H2 id="preguntas-frecuentes">Preguntas frecuentes</H2>
        {faqs.map((faq) => (
          <React.Fragment key={faq.question}>
            <h3>{cifrasES(faq.question)}</h3>
            <p>{cifrasES(faq.answer)}</p>
          </React.Fragment>
        ))}
      </GuidePage>
    </>
  );
};

export default GuiaHostingMasSeguro;
