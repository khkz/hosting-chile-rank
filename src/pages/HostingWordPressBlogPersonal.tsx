import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink } from 'lucide-react';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { Button } from '@/components/ui/button';
import { ProvenanceTag } from '@/components/data/Provenance';
import RelatedContent from '@/components/RelatedContent';
import GuidePage from '@/components/guias/GuidePage';
import GuideFooter from '@/components/guias/GuideFooter';
import { H2 } from '@/components/guias/GuideBlocks';
import { formatScore } from '@/lib/format';
import { trackEvent } from '@/lib/analytics';

interface Opcion {
  nombre: string;
  /** Nota escrita en esta página (pendiente 10 del dueño): se muestra tal cual, como criterio editorial. */
  nota: number;
  incluye: string[];
  accion: React.ReactNode;
}

const OPCIONES: Opcion[] = [
  {
    nombre: 'HostingPlus',
    nota: 9.8,
    incluye: ['WordPress 1-click', 'SSL gratis incluido', 'Backups diarios', '10 GB SSD NVMe'],
    accion: (
      <Button asChild>
        <a
          href="https://clientes.hostingplus.cl/cart.php?gid=13"
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => trackEvent('cta_probar_gratis', { provider: 'hostingplus', location: 'wordpress_blog_personal' })}
        >
          Probar gratis 30 días
          <ExternalLink aria-hidden />
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </Button>
    ),
  },
  {
    nombre: 'EcoHosting',
    nota: 9.5,
    incluye: ['WordPress preinstalado', 'Email ilimitado', '5 GB SSD', 'Soporte WhatsApp'],
    accion: (
      <Button asChild variant="outline">
        <Link to="/catalogo/ecohosting">Ver ficha</Link>
      </Button>
    ),
  },
  {
    nombre: 'Hostname',
    nota: 9.2,
    incluye: ['Softaculous installer', 'Panel cPanel', '10 GB espacio', '99,9 % uptime'],
    accion: (
      <Button asChild variant="outline">
        <Link to="/catalogo/hostname">Ver ficha</Link>
      </Button>
    ),
  },
];

const QUE_BUSCAR = [
  { t: 'Velocidad optimizada', d: 'SSD NVMe + caché WordPress para cargas bajo 1 segundo. Fundamental para SEO y retener lectores.' },
  { t: 'Precio accesible', d: 'Planes a consultar con todo incluido. Sin costos ocultos ni cargos por tráfico.' },
  { t: 'Seguridad incluida', d: 'SSL gratis, backups automáticos y protección anti-malware. Tu contenido siempre protegido.' },
  { t: 'Instalación fácil', d: 'WordPress instalado en 1 click. Sin conocimientos técnicos, listo en 5 minutos.' },
];

const FAQS = [
  {
    q: '¿Cuánto cuesta el hosting para un blog personal?',
    a: 'Los planes para blogs personales en Chile varían según proveedor y plazo de contratación. Para empezar, un plan compartido básico es suficiente para 500–1.000 visitas diarias.',
  },
  {
    q: '¿Necesito conocimientos técnicos?',
    a: 'No. Los hostings modernos incluyen instalador 1-click para WordPress. En 5 minutos puedes tener tu blog funcionando sin tocar código.',
  },
  {
    q: '¿Qué incluye el hosting?',
    a: 'Un buen plan incluye: WordPress preinstalado, certificado SSL gratis, backups automáticos, cuentas de email, cPanel y soporte técnico en español 24/7.',
  },
];

const TOC = [
  { id: 'top-3', label: 'Top 3 para blog personal' },
  { id: 'que-buscar', label: 'Qué buscar en un hosting' },
  { id: 'preguntas-frecuentes', label: 'Preguntas frecuentes' },
];

const HostingWordPressBlogPersonal = () => {
  return (
    <>
      <DynamicMetaTags
        title="Mejor Hosting WordPress para Blog Personal en Chile"
        description="Hosting WordPress optimizado para blogs personales en Chile. Comparativa de planes con instalación 1-click, certificado SSL gratis y soporte en español."
        canonical="https://eligetuhosting.cl/hosting-wordpress-blog-personal-chile"
        keywords="hosting wordpress blog, hosting blog personal, wordpress chile, hosting barato wordpress"
      />

      <GuidePage
        breadcrumbs={
          <SEOBreadcrumbs
            items={[
              { name: 'Guías', href: '/guia-elegir-hosting' },
              { name: 'Hosting WordPress Blog Personal', href: '/hosting-wordpress-blog-personal-chile' }
            ]}
          />
        }
        title="Mejor Hosting WordPress para Blog Personal Chile"
        lead="Hosting optimizado para WordPress con planes a consultar en el sitio de cada proveedor. Instalación en 1-click, SSL gratis y soporte en español 24/7."
        toc={TOC}
        stickyCta={false}
        footer={<GuideFooter related={<RelatedContent currentPage="wordpress" />} />}
      >
        <H2 id="top-3">Top 3 hosting para blog personal</H2>
        <ol className="not-prose my-6 space-y-4">
          {OPCIONES.map((o, i) => (
            <li key={o.nombre} className="rounded-xl border border-rule bg-white p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <p className="t-label tabular text-ink-3">
                    <span className="sr-only">Puesto </span>#{i + 1}
                  </p>
                  <h3 className="t-h3 text-ink">{o.nombre}</h3>
                  <p className="t-small mt-0.5 text-ink-2">Planes a consultar</p>
                </div>
                <div className="text-right">
                  <p className="tabular text-2xl font-extrabold leading-none text-ink">
                    {formatScore(o.nota)}
                    <span className="ml-0.5 text-sm font-semibold text-ink-3">/10</span>
                  </p>
                  <div className="mt-1.5 flex justify-end">
                    <ProvenanceTag kind="editorial" />
                  </div>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5">
                {o.incluye.map((f) => (
                  <li key={f} className="t-body flex items-start gap-2 text-ink-2">
                    <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-ink-3" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5">{o.accion}</div>
            </li>
          ))}
        </ol>

        <H2 id="que-buscar">¿Qué buscar en un hosting para blog personal?</H2>
        {QUE_BUSCAR.map((x) => (
          <React.Fragment key={x.t}>
            <h3>{x.t}</h3>
            <p>{x.d}</p>
          </React.Fragment>
        ))}

        <H2 id="preguntas-frecuentes">Preguntas frecuentes</H2>
        {FAQS.map((f) => (
          <React.Fragment key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </React.Fragment>
        ))}
      </GuidePage>
    </>
  );
};

export default HostingWordPressBlogPersonal;
