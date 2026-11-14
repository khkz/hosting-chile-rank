import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, Shield, Zap } from 'lucide-react';
import { buildHostingPlusURL, trackCTAClick } from '@/utils/cta';

interface RightRailOfferProps {
  termSlug?: string;
  compact?: boolean;
}

const FEATURES = [
  { Icon: Zap, title: 'LiteSpeed Enterprise', detail: 'HTTP/3 + QUIC nativo' },
  { Icon: Shield, title: 'Seguridad Premium', detail: 'WAF + JetBackup cada 4h' },
  { Icon: Star, title: 'Staging Automático', detail: 'Prueba sin riesgos' },
];

const COMPACT_FEATURES = [
  { Icon: Zap, label: 'LiteSpeed + HTTP/3' },
  { Icon: Shield, label: 'JetBackup + WAF' },
  { Icon: Star, label: 'Staging automático' },
];

/**
 * Oferta de la columna lateral de la wiki. Su contenido es una decisión de
 * negocio pendiente (divulgaciones y cifras comerciales): aquí solo cambia el
 * estilo al sistema, no las frases, las cifras ni los enlaces.
 */
const RightRailOffer: React.FC<RightRailOfferProps> = ({ termSlug = 'wiki-sidebar', compact = false }) => {
  const handleCTAClick = (type: 'primary' | 'secondary' = 'primary') => {
    trackCTAClick(termSlug, type);
  };

  const primaryUrl = buildHostingPlusURL('https://clientes.hostingplus.cl/cart.php?a=add&pid=84', {
    content: `${termSlug}-sidebar`,
    term: 'wordpress-hosting',
  });

  const secondaryUrl = buildHostingPlusURL('https://clientes.hostingplus.cl/submitticket.php?step=2&deptid=4', {
    content: `${termSlug}-sidebar`,
    term: 'cotizacion',
  });

  if (compact) {
    return (
      <div className="rounded-xl border border-rule bg-white p-4">
        <Badge variant="outline">#1 Hosting Chile</Badge>
        <p className="mt-3 text-lg font-bold text-ink">WordPress Turbo</p>
        <p className="t-small text-ink-2">Planes a consultar</p>
        <ul className="t-small mt-3 space-y-2 text-ink">
          {COMPACT_FEATURES.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-ink-2" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
        <Button
          className="mt-4 w-full"
          onClick={() => {
            handleCTAClick('primary');
            window.open(primaryUrl, '_blank');
          }}
        >
          Contratar ahora
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-rule bg-white p-5">
        <Badge variant="outline">#1 Ranking Hosting Chile 2026</Badge>
        <p className="mt-3 font-semibold text-ink">¿Necesitas hosting rápido?</p>
        <p className="mt-1 text-xl font-bold leading-tight text-ink">WordPress Turbo</p>
        <p className="t-small text-ink-2">planes a consultar</p>

        <ul className="mt-4 space-y-3">
          {FEATURES.map(({ Icon, title, detail }) => (
            <li key={title} className="flex items-start gap-2.5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" aria-hidden />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{title}</span>
                <span className="t-meta block">{detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-2">
          <Button
            className="h-auto min-h-11 w-full whitespace-normal py-2.5"
            onClick={() => {
              handleCTAClick('primary');
              window.open(primaryUrl, '_blank');
            }}
          >
            Contratar WordPress Turbo
            <ExternalLink aria-hidden />
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              handleCTAClick('secondary');
              window.open(secondaryUrl, '_blank');
            }}
          >
            Cotizar mi proyecto
          </Button>
        </div>

        <p className="t-meta mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
            4,8/5 en Google Reviews
          </span>
          <span>+10.000 clientes</span>
        </p>
      </div>

      <figure className="rounded-xl border border-rule bg-white p-4">
        <div className="flex items-center gap-0.5 text-ink-3" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <blockquote className="t-small mt-2 text-ink">
          "Migré de otro hosting y la diferencia de velocidad es brutal. LiteSpeed realmente funciona."
        </blockquote>
        <figcaption className="t-meta mt-2">- Cliente WordPress Turbo</figcaption>
      </figure>
    </div>
  );
};

export default RightRailOffer;
