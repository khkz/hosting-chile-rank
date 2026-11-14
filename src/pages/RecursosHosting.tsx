import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calculator, GitCompare, Activity } from 'lucide-react';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { Button } from '@/components/ui/button';
import GuidePage from '@/components/guias/GuidePage';

// Solo alimentan el JSON-LD (CollectionPage), sin cambios. La lista visible está en CATEGORIAS y HERRAMIENTAS.
const guias = [
  { title: 'Guía Completa para Elegir Hosting', description: 'Todo lo que necesitas saber para tomar la mejor decisión', path: '/guia-completa-elegir-hosting-chile' },
  { title: 'Errores Comunes al Elegir Hosting', description: 'Evita los 8 errores más costosos que cometen los usuarios', path: '/errores-comunes-hosting-chile' },
  { title: 'Mejor Hosting WordPress Chile', description: 'Ranking especializado para sitios WordPress', path: '/mejor-hosting-wordpress-chile' },
  { title: 'Mejor Hosting E-commerce Chile', description: 'Hosting optimizado para tiendas online', path: '/mejor-hosting-ecommerce-chile' },
  { title: 'Guía para Elegir VPS', description: 'Cuándo y cómo migrar a un servidor virtual privado', path: '/guia-elegir-vps-chile' },
  { title: 'Guía para Elegir Servidor Dedicado', description: 'Máximo rendimiento para proyectos enterprise', path: '/guia-elegir-servidor-dedicado-chile' },
  { title: 'Guía de Seguridad Web', description: 'Protege tu sitio web contra amenazas comunes', path: '/guia-seguridad-web-chile' },
  { title: 'Guía para Elegir SSL', description: 'Certificados SSL y HTTPS para tu sitio', path: '/guia-elegir-ssl-chile' },
  { title: 'Guía para Elegir CDN', description: 'Acelera tu sitio con redes de distribución de contenido', path: '/guia-elegir-cdn-chile' },
  { title: 'Guía para Migrar Hosting', description: 'Cambia de hosting sin perder tráfico ni datos', path: '/guia-migrar-hosting-chile' },
  { title: 'Guía Hosting WordPress', description: 'Optimización específica para WordPress', path: '/guia-hosting-wordpress-chile' },
];

const herramientas = [
  { title: 'Calculadora TCO', description: 'Calcula el costo total de propiedad de tu hosting', path: '/calculadora-tco-hosting' },
  { title: 'Comparador de Hosting', description: 'Compara características y precios lado a lado', path: '/comparativa' },
  { title: 'Monitoreo de Uptime', description: 'Datos en tiempo real de disponibilidad de proveedores', path: '/monitoreo-uptime-hosting-chile' },
];

interface Item {
  title: string;
  description: string;
  path: string;
}

// Lista visible: rutas que existen en el sitio (varias del JSON-LD llevan a una página no encontrada).
const HERRAMIENTAS: (Item & { icon: React.ElementType })[] = [
  { title: 'Calculadora TCO', description: 'Calcula el costo total de propiedad de tu hosting', path: '/calculadora-tco', icon: Calculator },
  { title: 'Comparador de hosting', description: 'Compara características y precios lado a lado', path: '/comparativa', icon: GitCompare },
  { title: 'Benchmark de hosting', description: 'Velocidad y disponibilidad medidas en cada proveedor', path: '/benchmark', icon: Activity },
];

const CATEGORIAS: { id: string; nombre: string; items: Item[] }[] = [
  {
    id: 'fundamentos',
    nombre: 'Fundamentos',
    items: [
      { title: 'Guía completa para elegir hosting', description: 'Todo lo que necesitas saber para tomar la mejor decisión', path: '/guia-completa-elegir-hosting-chile-2026' },
      { title: 'Guía para elegir hosting', description: 'Tipos de hosting, factores clave, requisitos y errores comunes', path: '/guia-elegir-hosting' },
      { title: 'Errores comunes al elegir hosting', description: 'Evita los 8 errores más costosos que cometen los usuarios', path: '/errores-comunes-elegir-hosting' },
    ],
  },
  {
    id: 'especializados',
    nombre: 'Especializados',
    items: [
      { title: 'Mejor hosting WordPress en Chile', description: 'Ranking especializado para sitios WordPress', path: '/mejor-hosting-wordpress-chile' },
      { title: 'Mejor hosting e-commerce en Chile', description: 'Hosting optimizado para tiendas online', path: '/mejor-hosting-ecommerce-chile' },
    ],
  },
  {
    id: 'avanzado',
    nombre: 'Avanzado',
    items: [
      { title: 'Guía para elegir VPS', description: 'Cuándo y cómo migrar a un servidor virtual privado', path: '/guia-elegir-vps' },
      { title: 'Guía para elegir servidor dedicado', description: 'Máximo rendimiento para proyectos enterprise', path: '/guia-elegir-servidor-dedicado' },
    ],
  },
  {
    id: 'seguridad',
    nombre: 'Seguridad',
    items: [
      { title: 'Guía de seguridad web', description: 'Protege tu sitio web contra amenazas comunes', path: '/guia-seguridad-web' },
      { title: 'Guía para elegir SSL', description: 'Certificados SSL y HTTPS para tu sitio', path: '/guia-elegir-ssl' },
      { title: 'Cómo elegir el hosting más seguro', description: 'WAF, firewall, parcheo de vulnerabilidades y checklist', path: '/guia-hosting-mas-seguro-chile' },
    ],
  },
  {
    id: 'rendimiento',
    nombre: 'Rendimiento',
    items: [
      { title: 'Guía para elegir CDN', description: 'Acelera tu sitio con redes de distribución de contenido', path: '/guia-elegir-cdn' },
    ],
  },
  {
    id: 'migraciones',
    nombre: 'Migraciones',
    items: [
      { title: 'Guía para migrar hosting', description: 'Cambia de hosting sin perder tráfico ni datos', path: '/guia-migrar-hosting' },
    ],
  },
  {
    id: 'wordpress',
    nombre: 'WordPress',
    items: [
      { title: 'Guía de hosting WordPress', description: 'Optimización específica para WordPress', path: '/guia-hosting-wordpress' },
      { title: 'Hosting WordPress para blog personal', description: 'Planes con instalación en un clic, SSL gratis y soporte en español', path: '/hosting-wordpress-blog-personal-chile' },
    ],
  },
];

const TOC = [
  { id: 'herramientas', label: 'Herramientas gratuitas' },
  { id: 'guias', label: 'Guías completas' },
  { id: 'ayuda', label: '¿Necesitas ayuda?' },
];

const Row: React.FC<{ item: Item; icon?: React.ElementType }> = ({ item, icon: Icon }) => (
  <li>
    <Link
      to={item.path}
      className="group flex min-h-11 items-start gap-4 py-4 transition-colors hover:bg-paper"
    >
      {Icon && <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-ink-3" />}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink decoration-ink/30 underline-offset-2 group-hover:underline">
          {item.title}
        </span>
        <span className="t-small mt-0.5 block text-ink-2">{item.description}</span>
      </span>
      <ArrowRight aria-hidden className="mt-1 h-4 w-4 shrink-0 text-ink-3" />
    </Link>
  </li>
);

const RecursosHosting = () => {
  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Recursos', href: '/recursos-hosting-chile' }
  ];

  return (
    <>
      <DynamicMetaTags
        title="Recursos y Guías de Hosting Chile 2025"
        description="Centro completo de recursos: guías, comparativas, herramientas y datos verificables para elegir el mejor hosting en Chile. Información actualizada y gratuita."
        keywords="recursos hosting chile, guías hosting, comparador hosting, calculadora hosting, monitoreo uptime"
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Recursos y Guías de Hosting Chile",
            "description": "Centro completo de recursos para elegir hosting en Chile",
            "url": "https://eligetuhosting.cl/recursos-hosting-chile",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": guias.length + herramientas.length,
              "itemListElement": [
                ...guias.map((guia, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Article",
                    "name": guia.title,
                    "description": guia.description,
                    "url": `https://eligetuhosting.cl${guia.path}`
                  }
                })),
                ...herramientas.map((tool, index) => ({
                  "@type": "ListItem",
                  "position": guias.length + index + 1,
                  "item": {
                    "@type": "WebApplication",
                    "name": tool.title,
                    "description": tool.description,
                    "url": `https://eligetuhosting.cl${tool.path}`
                  }
                }))
              ]
            }
          })}
        </script>
      </Helmet>

      <GuidePage
        breadcrumbs={<SEOBreadcrumbs items={breadcrumbItems} />}
        title="Centro de Recursos de Hosting Chile"
        lead="Guías completas, herramientas gratuitas y datos verificables para tomar la mejor decisión de hosting"
        toc={TOC}
        prose={false}
      >
        <section aria-labelledby="herramientas" className="max-w-[46rem]">
          <h2 id="herramientas" className="t-h2 scroll-mt-24 text-ink">
            Herramientas gratuitas
          </h2>
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {HERRAMIENTAS.map((t) => (
              <Row key={t.path} item={t} icon={t.icon} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="guias" className="mt-14 max-w-[46rem]">
          <h2 id="guias" className="t-h2 scroll-mt-24 text-ink">
            Guías completas
          </h2>
          {CATEGORIAS.map((c) => (
            <div key={c.id} className="mt-8">
              <h3 className="t-h3 text-ink">{c.nombre}</h3>
              <ul className="mt-3 divide-y divide-rule border-y border-rule">
                {c.items.map((g) => (
                  <Row key={g.path} item={g} />
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section aria-labelledby="ayuda" className="mt-14 max-w-[46rem] rounded-xl border border-rule bg-paper p-6 md:p-8">
          <h2 id="ayuda" className="t-h2 scroll-mt-24 text-ink">
            ¿Necesitas ayuda personalizada?
          </h2>
          <p className="t-body mt-3 text-ink-2">
            Nuestro equipo puede ayudarte a encontrar la solución perfecta para tu proyecto
          </p>
          <Button asChild className="mt-5">
            <Link to="/contacto">Contactar un experto</Link>
          </Button>
        </section>
      </GuidePage>
    </>
  );
};

export default RecursosHosting;
