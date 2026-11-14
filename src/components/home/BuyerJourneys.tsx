import React from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Briefcase, ShoppingCart } from 'lucide-react';
import Section from '@/components/system/Section';
import { ProvenanceTag } from '@/components/data/Provenance';

/**
 * Buyer journeys por segmento. Enlaza a guías reales y a fichas del ranking.
 * Todo el contenido es verificable en el propio sitio (no hay testimonios ni cifras inventadas).
 * Las recomendaciones son editoriales (decisión pendiente 3): se muestran tal cual.
 */
const journeys = [
  {
    icon: PenLine,
    tag: 'Blog personal / portafolio',
    who: 'Escribo, publico un portafolio o pruebo una idea. Tráfico bajo, presupuesto ajustado.',
    need: 'WordPress simple, SSL gratis, panel en español y precio predecible.',
    picks: [
      { label: 'HostingPlus', to: '/catalogo/hostingplus' },
      { label: 'EcoHosting', to: '/catalogo/ecohosting' },
    ],
    guide: { label: 'Guía: hosting WordPress para blog personal', to: '/hosting-wordpress-blog-personal-chile' },
  },
  {
    icon: Briefcase,
    tag: 'Pyme y sitio corporativo',
    who: 'Necesito email profesional, factura electrónica y soporte que conteste en horario chileno.',
    need: 'Datacenter local, uptime medido, backups diarios y soporte 24/7 en español.',
    picks: [
      { label: 'HostingPlus', to: '/catalogo/hostingplus' },
      { label: 'HN.cl', to: '/catalogo/hn-cl' },
    ],
    guide: { label: 'Mejor hosting para pymes en Chile', to: '/mejor-hosting-pymes-chile' },
  },
  {
    icon: ShoppingCart,
    tag: 'Tienda online (WooCommerce, Shopify, Jumpseller)',
    who: 'Vendo online. Cada segundo de latencia me cuesta pedidos y CyberDay puede romperme el sitio.',
    need: 'LiteSpeed o similar, TTFB bajo desde Santiago, HTTPS y capacidad para peaks de tráfico.',
    picks: [
      { label: 'HostingPlus', to: '/catalogo/hostingplus' },
      { label: 'EcoHosting', to: '/catalogo/ecohosting' },
    ],
    guide: { label: 'Mejor hosting e-commerce en Chile', to: '/mejor-hosting-ecommerce-chile' },
  },
];

const textLink = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const BuyerJourneys: React.FC = () => (
  <Section
    id="para-tu-caso"
    tone="paper"
    title="¿Qué necesitas hostear?"
    lead={
      <>
        No hay «un mejor hosting» universal. Hay uno mejor <em>para ti</em>. Estas son las tres rutas más comunes en Chile
        y qué proveedor verificado encaja mejor con cada una.
      </>
    }
  >
    <div className="grid gap-10 md:grid-cols-3 md:gap-8">
      {journeys.map(({ icon: Icon, tag, who, need, picks, guide }) => (
        <article key={tag} className="flex flex-col border-t-2 border-ink pt-4">
          <h3 className="t-h3 flex items-start gap-2 text-ink">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" aria-hidden />
            {tag}
          </h3>
          <p className="mt-3 text-base italic leading-relaxed text-ink-2 md:text-[15px]">«{who}»</p>
          <p className="mt-2 text-base leading-relaxed text-ink-2 md:text-[15px]">
            <strong className="font-semibold text-ink">Lo que importa:</strong> {need}
          </p>

          <div className="mt-5 border-t border-rule pt-3 md:mt-auto">
            <p className="t-label flex flex-wrap items-center gap-2">
              Recomendación <ProvenanceTag kind="editorial" />
              <Link to="/metodologia" className="inline-flex min-h-[44px] items-center font-normal text-ink-3 underline decoration-ink/30 underline-offset-4 hover:text-ink md:min-h-0">
                Cómo la hacemos
              </Link>
            </p>
            <ul className="mt-1">
              {picks.map((p) => (
                <li key={p.to}>
                  <Link to={p.to} className={`inline-flex min-h-[44px] items-center md:min-h-[32px] ${textLink}`}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to={guide.to}
              className="mt-2 inline-flex min-h-[44px] items-center text-sm text-ink-2 underline decoration-ink/30 underline-offset-4 hover:text-ink md:min-h-0"
            >
              {guide.label}
            </Link>
          </div>
        </article>
      ))}
    </div>
  </Section>
);

export default BuyerJourneys;
