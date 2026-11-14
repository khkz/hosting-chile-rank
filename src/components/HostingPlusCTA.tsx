import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { buildHostingPlusURL, trackCTAClick } from '@/utils/cta';

interface HostingPlusCTAProps {
  termSlug: string;
  termTitle: string;
  plan: string;
  copy: string;
  url: string;
  proofPoints: string[];
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Recomendación de proveedor al final de un término de la wiki. Sus textos y
 * su divulgación son una decisión de negocio pendiente: aquí solo cambia el
 * estilo al sistema (sin emoji, sin letra bajo 12 px, sin rojo).
 */
const HostingPlusCTA: React.FC<HostingPlusCTAProps> = ({
  termSlug,
  termTitle,
  copy,
  url,
  proofPoints,
  className = '',
  variant = 'default',
}) => {
  const handleCTAClick = (type: 'primary' | 'secondary' = 'primary') => {
    trackCTAClick(termSlug, type);
  };

  const primaryUrl = buildHostingPlusURL(url, {
    content: termSlug,
    term: termTitle.toLowerCase(),
  });

  const secondaryUrl = buildHostingPlusURL('https://clientes.hostingplus.cl/submitticket.php?step=2&deptid=4', {
    content: `${termSlug}-secondary`,
  });

  const openPrimary = () => {
    handleCTAClick('primary');
    window.open(primaryUrl, '_blank');
  };
  const openSecondary = () => {
    handleCTAClick('secondary');
    window.open(secondaryUrl, '_blank');
  };

  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-rule bg-paper p-4 ${className}`}>
        <p className="t-label">Recomendado: HostingPlus</p>
        <p className="t-small mt-2 text-ink">{copy}</p>
        {proofPoints.length > 0 && (
          <ul className="t-meta mt-2 list-disc space-y-1 pl-4 marker:text-ink-3">
            {proofPoints.slice(0, 3).map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button className="flex-1" onClick={openPrimary}>
            Ver planes y precios
            <ExternalLink aria-hidden />
          </Button>
          <Button variant="outline" onClick={openSecondary}>
            Cotizar
          </Button>
        </div>
        <p className="t-meta mt-3">
          30 días de garantía de devolución publicada por el proveedor · Enlace de afiliado, sin costo extra para ti.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Recomendado: HostingPlus" className={`rounded-xl border border-rule bg-paper p-6 md:p-8 ${className}`}>
      <Badge variant="outline">Recomendado: HostingPlus</Badge>
      <p className="t-h3 mt-3 text-ink">Hosting Optimizado para {termTitle}</p>
      <p className="t-body mt-2 max-w-[62ch] text-ink-2">{copy}</p>

      {proofPoints.length > 0 && (
        <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {proofPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-ink">
              <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-sm bg-ink-3" />
              {point}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={openPrimary}>
          Ver planes y precios
          <ExternalLink aria-hidden />
        </Button>
        <Button variant="outline" size="lg" onClick={openSecondary}>
          Cotizar mi proyecto
        </Button>
      </div>

      <div className="t-meta mt-5 max-w-[62ch] space-y-1">
        <p>30 días de garantía de devolución publicada por el proveedor · Datacenter en Ascenty SCL2 (Santiago) · Soporte técnico local.</p>
        <p>Divulgación: enlace de afiliado; puede generarnos una comisión sin costo adicional para ti.</p>
      </div>
    </section>
  );
};

export default HostingPlusCTA;
