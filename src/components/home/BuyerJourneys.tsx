import React from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Briefcase, ShoppingCart, ArrowRight } from 'lucide-react';

/**
 * Buyer journeys por segmento. Enlaza a guías reales y a fichas del ranking.
 * Todo el contenido es verificable en el propio sitio (no hay testimonios ni cifras inventadas).
 */
const journeys = [
  {
    icon: PenLine,
    tag: 'Blog personal / portafolio',
    who: 'Escribo, público un portafolio o pruebo una idea. Tráfico bajo, presupuesto ajustado.',
    need: 'WordPress simple, SSL gratis, panel en español y precio predecible.',
    picks: [
      { label: 'HostingPlus (9.9/10)', to: '/catalogo/hostingplus' },
      { label: 'EcoHosting (9.6/10)', to: '/catalogo/ecohosting' },
    ],
    guide: { label: 'Guía: hosting WordPress para blog personal', to: '/hosting-wordpress-blog-personal-chile' },
  },
  {
    icon: Briefcase,
    tag: 'Pyme y sitio corporativo',
    who: 'Necesito email profesional, factura electrónica y soporte que conteste en horario chileno.',
    need: 'Datacenter local, uptime medido, backups diarios y soporte 24/7 en español.',
    picks: [
      { label: 'HostingPlus (9.9/10)', to: '/catalogo/hostingplus' },
      { label: 'HN.cl (9.2/10)', to: '/catalogo/hn-cl' },
    ],
    guide: { label: 'Hub: mejor hosting para pymes en Chile', to: '/mejor-hosting-pymes-chile' },
  },
  {
    icon: ShoppingCart,
    tag: 'Tienda online (WooCommerce, Shopify, Jumpseller)',
    who: 'Vendo online. Cada segundo de latencia me cuesta pedidos y CyberDay puede romperme el sitio.',
    need: 'LiteSpeed o similar, TTFB bajo desde Santiago, HTTPS y capacidad para peaks de tráfico.',
    picks: [
      { label: 'HostingPlus (9.9/10)', to: '/catalogo/hostingplus' },
      { label: 'EcoHosting (9.6/10)', to: '/catalogo/ecohosting' },
    ],
    guide: { label: 'Hub: mejor hosting e-commerce Chile', to: '/mejor-hosting-ecommerce-chile' },
  },
];

const BuyerJourneys: React.FC = () => {
  return (
    <section
      id="para-tu-caso"
      aria-labelledby="journeys-title"
      className="py-14 bg-white"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-red mb-2">
            Elige por caso de uso
          </p>
          <h2 id="journeys-title" className="font-poppins text-2xl md:text-3xl font-bold text-[#2B2D42] mb-3">
            ¿Qué necesitas hostear?
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            No hay "un mejor hosting" universal. Hay uno mejor <em>para ti</em>. Estas son las tres
            rutas más comunes en Chile y qué proveedor verificado encaja mejor con cada una.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {journeys.map(({ icon: Icon, tag, who, need, picks, guide }) => (
            <article
              key={tag}
              className="bg-warm-cream/40 rounded-xl p-5 border border-border shadow-sm flex flex-col"
            >
              <Icon className="h-6 w-6 text-brand-red mb-3" aria-hidden />
              <h3 className="font-semibold text-[#2B2D42] mb-1">{tag}</h3>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                <span className="block text-gray-600 italic mb-2">"{who}"</span>
                <strong className="text-[#2B2D42]">Lo que importa:</strong> {need}
              </p>

              <div className="mt-auto space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recomendaciones verificadas
                </p>
                <ul className="space-y-1">
                  {picks.map((p) => (
                    <li key={p.to}>
                      <Link
                        to={p.to}
                        className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                      >
                        {p.label} <ArrowRight className="h-3 w-3" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={guide.to}
                  className="inline-block text-xs text-muted-foreground hover:text-foreground underline mt-2"
                >
                  {guide.label} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuyerJourneys;
