import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EvidenceCard from '@/components/system/EvidenceCard';
import { ProvenanceTag } from '@/components/data/Provenance';
import type { CompareCompany } from './useCompareData';

const inlineLink =
  'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

interface VsRecommendationProps {
  a: Pick<CompareCompany, 'slug' | 'name'>;
  b: Pick<CompareCompany, 'slug' | 'name'>;
  involvesAnchor: boolean;
  hostingplus?: CompareCompany;
  ecohosting?: CompareCompany;
}

/**
 * «Nuestra recomendación» de las comparativas A vs B. Texto y notas escritos a
 * mano (decisión pendiente 10): aquí solo cambia el estilo. Enlaces y rel
 * salientes sin cambios (decisión pendiente 8).
 */
const VsRecommendation: React.FC<VsRecommendationProps> = ({ a, b, involvesAnchor, hostingplus, ecohosting }) => {
  if (involvesAnchor) {
    return (
      <>
        <p className="t-body measure text-ink-2">
          Si buscas equilibrio entre rendimiento, soporte y datacenter local, recomendamos{' '}
          <Link to="/catalogo/hostingplus" className={inlineLink}>HostingPlus.cl</Link>{' '}
          <span className="tabular whitespace-nowrap">(9,9/10 <ProvenanceTag kind="editorial" variant="glyph" />)</span>,
          líder verificado del ranking 2026.{' '}
          <Link to="/catalogo/ecohosting" className={inlineLink}>EcoHosting.cl</Link>{' '}
          <span className="tabular whitespace-nowrap">(9,6/10 <ProvenanceTag kind="editorial" variant="glyph" />)</span>{' '}
          es la alternativa recomendada por relación precio-rendimiento.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="brand">
            <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener">
              Ir al sitio de HostingPlus.cl <ExternalLink aria-hidden />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://www.ecohosting.cl/" target="_blank" rel="noopener">
              Ir al sitio de EcoHosting.cl <ExternalLink aria-hidden />
            </a>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="t-body measure text-ink-2">
        Ni {a.name} ni {b.name} alcanzan al líder del ranking en métricas medibles. Recomendamos{' '}
        <Link to="/catalogo/hostingplus" className={inlineLink}>HostingPlus.cl</Link>{' '}
        <strong className="tabular font-semibold text-ink">(9,9/10)</strong>: datacenter en Santiago, LiteSpeed
        Enterprise, soporte 24/7 y cero reclamos visibles. Para presupuestos ajustados,{' '}
        <Link to="/catalogo/ecohosting" className={inlineLink}>EcoHosting.cl</Link>{' '}
        <strong className="tabular font-semibold text-ink">(9,6/10)</strong> mantiene la mejor relación
        precio-rendimiento.
      </p>
      <div className="mt-6 grid max-w-4xl gap-4 sm:grid-cols-2">
        {hostingplus && (
          <EvidenceCard
            title="HostingPlus.cl"
            subtitle="Líder verificado"
            score={9.9}
            rank={1}
            rows={[{ label: 'Datacenter', value: hostingplus.datacenter_location || 'Datacenter Chile', kind: 'declared' }]}
            footer={
              <Button asChild variant="outline">
                <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener">
                  Ir al sitio de HostingPlus.cl <ExternalLink aria-hidden />
                </a>
              </Button>
            }
          />
        )}
        {ecohosting && (
          <EvidenceCard
            title="EcoHosting.cl"
            subtitle="Mejor precio-rendimiento"
            score={9.6}
            rows={[]}
            footer={
              <Button asChild variant="outline">
                <a href="https://www.ecohosting.cl/" target="_blank" rel="noopener">
                  Ir al sitio de EcoHosting.cl <ExternalLink aria-hidden />
                </a>
              </Button>
            }
          />
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {[a, b].map((s) => (
          <Link
            key={s.slug}
            to={`/alternativas-a/${s.slug}`}
            className="t-small inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            Alternativas a {s.name} <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </>
  );
};

export default VsRecommendation;
