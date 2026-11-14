import React from 'react';
import { Helmet } from 'react-helmet-async';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import RecommendedByData from '@/components/RecommendedByData';
import GuidePage from '@/components/guias/GuidePage';
import GuideBreadcrumbs from '@/components/guias/GuideBreadcrumbs';
import GuideFooter from '@/components/guias/GuideFooter';
import ProviderPick from '@/components/guias/ProviderPick';
import { H2 } from '@/components/guias/GuideBlocks';

const CRUMBS = [
  { name: 'Guías', url: '/recursos-hosting-chile' },
  { name: 'Guía: elegir SSL', url: '/guia-elegir-ssl' },
];

const TOC = [
  { id: 'que-es-ssl', label: '¿Qué es un certificado SSL?' },
  { id: 'tipos-ssl', label: 'Tipos de certificados SSL' },
  { id: 'factores-clave', label: 'Factores clave a considerar' },
  { id: 'recomendaciones', label: 'Nuestras recomendaciones' },
  { id: 'conclusion', label: 'Conclusión' },
];

const TIPOS = [
  {
    t: 'Certificado de dominio único (DV)',
    d: 'Es el tipo más básico y económico. Solo verifica la propiedad del dominio, sin validar la identidad de la organización. Ideal para blogs, sitios personales o proyectos pequeños.',
  },
  {
    t: 'Certificado de organización (OV)',
    d: 'Ofrece un nivel intermedio de validación. Además de verificar el dominio, comprueba la identidad de la organización. Recomendado para sitios corporativos y comerciales.',
  },
  {
    t: 'Certificado de validación extendida (EV)',
    d: 'El nivel más alto de validación. Requiere una verificación exhaustiva de la identidad legal de la organización. Ideal para sitios que manejan información financiera o datos muy sensibles.',
  },
  {
    t: 'Certificado wildcard',
    d: 'Protege el dominio principal y todos sus subdominios de primer nivel. Excelente opción si tienes múltiples subdominios (blog.tudominio.cl, tienda.tudominio.cl, etc.).',
  },
  {
    t: 'Certificado multidominio (SAN/UCC)',
    d: 'Permite proteger múltiples dominios diferentes con un solo certificado. Útil si gestionas varios sitios web relacionados con diferentes nombres de dominio.',
  },
];

const FACTORES = [
  {
    t: 'Nivel de seguridad requerido',
    d: 'Evalúa qué tipo de información maneja tu sitio. Para tiendas online o sitios que procesan datos financieros, prioriza certificados OV o EV. Para blogs o sitios informativos, un certificado DV suele ser suficiente.',
  },
  {
    t: 'Autoridad de certificación (CA)',
    d: "Elige certificados emitidos por CAs reconocidas como Comodo, DigiCert, GlobalSign o Let's Encrypt. Esto garantiza que tu certificado será reconocido por la mayoría de los navegadores sin problemas.",
  },
  {
    t: 'Período de validez',
    d: 'Los certificados suelen tener validez de 1 a 3 años. Considera que los certificados más nuevos tendrán un máximo de 398 días (poco más de un año) debido a nuevas regulaciones de seguridad implementadas por los navegadores.',
  },
  {
    t: 'Garantía y soporte',
    d: 'Los certificados de pago suelen ofrecer garantías financieras y mejor soporte técnico. Esto puede ser crucial si tienes problemas durante la instalación o renovación del certificado.',
  },
  {
    t: 'Compatibilidad con dispositivos',
    d: 'Asegúrate de que el certificado es compatible con dispositivos y navegadores antiguos si tu audiencia utiliza tecnología más antigua. Los certificados modernos utilizan algoritmos que pueden no ser compatibles con sistemas muy desactualizados.',
  },
];

const REVIEWED_AT = '2026-05-15';

const GuiaElegirSSL = () => {
  return (
    <>
      <Helmet>
        <title>Guía Certificados SSL | EligeTuHosting.cl</title>
        <meta
          name="description"
          content="Todo lo que necesitas saber para elegir el certificado SSL adecuado para tu sitio web y mantenerlo seguro."
        />
      </Helmet>
      <BreadcrumbSchema items={[{ name: 'Guías', url: '/recursos-hosting-chile' }, { name: "Guía: elegir SSL", url: "/guia-elegir-ssl" }]} />

      <GuidePage
        breadcrumbs={<GuideBreadcrumbs items={CRUMBS} />}
        title="Guía para elegir el mejor certificado SSL"
        lead="Protege tu sitio web y a tus usuarios con el certificado SSL adecuado. Aprende a elegir entre los diferentes tipos y proveedores."
        reviewedAt={REVIEWED_AT}
        toc={TOC}
        footer={<GuideFooter reviewedAt={REVIEWED_AT} extra={<RecommendedByData />} />}
      >
        <H2 id="que-es-ssl">1. ¿Qué es un certificado SSL?</H2>
        <p>
          Un certificado SSL (Secure Sockets Layer) es una tecnología de seguridad que establece una conexión cifrada
          entre el servidor web y el navegador del visitante. Esta conexión asegura que toda la información transmitida
          permanezca privada y protegida.
        </p>
        <h3>Beneficios principales</h3>
        <ul>
          <li>Protege los datos sensibles como información personal y detalles de pago</li>
          <li>Mejora el posicionamiento SEO (Google favorece sitios seguros)</li>
          <li>Genera confianza en los visitantes (candado verde en la barra de dirección)</li>
          <li>Es obligatorio para cumplir con normativas como PCI DSS si procesas pagos</li>
          <li>Evita advertencias de «sitio no seguro» en navegadores modernos</li>
        </ul>

        <H2 id="tipos-ssl">2. Tipos de certificados SSL</H2>
        {TIPOS.map((x) => (
          <React.Fragment key={x.t}>
            <h3>{x.t}</h3>
            <p>{x.d}</p>
          </React.Fragment>
        ))}

        <H2 id="factores-clave">3. Factores clave a considerar</H2>
        {FACTORES.map((x) => (
          <React.Fragment key={x.t}>
            <h3>{x.t}</h3>
            <p>{x.d}</p>
          </React.Fragment>
        ))}

        <H2 id="recomendaciones">4. Nuestras recomendaciones</H2>
        <ProviderPick
          name="HostingPlus SSL"
          label="Mejor opción"
          href="https://www.hostingplus.cl/blog/servicio/certificados-ssl-ip-fija/"
          rel="noopener noreferrer"
          linkLabel="Ir al sitio de HostingPlus"
        >
          <p>
            Ofrece certificados SSL de diferentes niveles con excelente soporte para la instalación. Sus planes de
            hosting incluyen SSL Let&apos;s Encrypt gratuito y automatizado.
          </p>
        </ProviderPick>
        <ProviderPick
          name="HostGator SSL"
          label="Gran variedad"
          href="https://www.hostgator.cl/ssl"
          rel="noopener noreferrer"
          linkLabel="Ir al sitio de HostGator"
        >
          <p>
            Amplia variedad de certificados SSL, desde opciones básicas hasta certificados EV para empresas. Buena
            documentación y soporte para la implementación.
          </p>
        </ProviderPick>
        <ProviderPick
          name="CloudHosting SSL"
          label="Mejor precio"
          href="https://www.cloudhosting.cl/"
          rel="noopener noreferrer"
          linkLabel="Ir al sitio de CloudHosting"
        >
          <p>
            Buenas opciones de certificados SSL a precios competitivos, incluyendo opciones wildcard y multidominio con
            descuentos por contratación multianual.
          </p>
        </ProviderPick>

        <H2 id="conclusion">Conclusión</H2>
        <p>
          Actualmente, tener un certificado SSL no es opcional sino necesario para cualquier sitio web. Además de la
          seguridad que proporciona, afecta directamente al SEO, la confianza del usuario y el correcto funcionamiento en
          navegadores modernos.
        </p>
        <p>
          Evalúa tu presupuesto y necesidades específicas para elegir el tipo de certificado adecuado, y no escatimes en
          seguridad si tu sitio maneja información sensible de los usuarios.
        </p>
      </GuidePage>
    </>
  );
};

export default GuiaElegirSSL;
