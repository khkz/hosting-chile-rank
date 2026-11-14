import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink } from 'lucide-react';
import { ProvenanceTag, type Provenance } from '@/components/data/Provenance';
import { Button } from '@/components/ui/button';
import ScoreValue from '@/components/hubs/ScoreValue';
import { cn } from '@/lib/utils';

/**
 * Ficha de un proveedor en las guías WordPress y e-commerce: nota editorial,
 * datos declarados (precio, uptime garantizado) con su procedencia,
 * características y acciones. El rojo marca solo el puesto 1.
 */
export interface PickRow {
  label: string;
  value: React.ReactNode;
  kind?: Provenance;
}

interface ProviderPickCardProps {
  rank: number;
  name: string;
  score: number;
  /** Qué nota es: «Nota WordPress», «Nota e-commerce». */
  scoreLabel: string;
  rows: PickRow[];
  featuresTitle: string;
  features: string[];
  pros?: string;
  cons?: string;
  /** Enlace saliente tal como estaba (href y rel sin cambios). */
  site: { href: string; rel: string; label: string };
  secondary?: { to: string; label: string };
}

const ProviderPickCard: React.FC<ProviderPickCardProps> = ({
  rank,
  name,
  score,
  scoreLabel,
  rows,
  featuresTitle,
  features,
  pros,
  cons,
  site,
  secondary,
}) => (
  <article className="relative rounded-xl border border-rule bg-white p-5 md:p-7" aria-label={`Puesto ${rank}: ${name}`}>
    {rank === 1 && <span aria-hidden className="absolute bottom-6 left-0 top-6 w-1 rounded-r bg-brand" />}
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className={cn('text-[13px] font-semibold leading-snug tabular', rank === 1 ? 'text-brand-ink' : 'text-ink-3')}>
          <span className="sr-only">Puesto </span>#{rank}
        </p>
        <h3 className="t-h3 mt-0.5 text-ink">{name}</h3>
      </div>
      <div className="text-right">
        <ScoreValue value={score} size="lg" />
        <p className="mt-1.5 flex items-center justify-end gap-2 text-[13px] text-ink-2">
          {scoreLabel}
          <ProvenanceTag kind="editorial" />
        </p>
      </div>
    </header>

    {rows.length > 0 && (
      <dl className="mt-5 grid gap-x-8 border-y border-rule py-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-1.5">
            <dt className="t-small text-ink-2">{row.label}</dt>
            <dd className="flex items-center gap-2 font-semibold tabular text-ink">
              {row.value}
              {row.kind && <ProvenanceTag kind={row.kind} variant="glyph" />}
            </dd>
          </div>
        ))}
      </dl>
    )}

    <div className="mt-5 grid gap-6 md:grid-cols-2">
      <div>
        <h4 className="t-label">{featuresTitle}</h4>
        <ul className="mt-2 space-y-1.5 text-[15px] text-ink">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="mt-1 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      {(pros || cons) && (
        <div className="space-y-4">
          {pros && (
            <div>
              <h4 className="t-label">Ventajas</h4>
              <p className="t-small mt-1 text-ink-2">{pros}</p>
            </div>
          )}
          {cons && (
            <div>
              <h4 className="t-label">Consideraciones</h4>
              <p className="t-small mt-1 text-ink-2">{cons}</p>
            </div>
          )}
        </div>
      )}
    </div>

    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
      <Button asChild variant={rank === 1 ? 'brand' : 'default'}>
        <a href={site.href} target="_blank" rel={site.rel}>
          {site.label}
          <ExternalLink aria-hidden />
        </a>
      </Button>
      {secondary && (
        <Button asChild variant="outline">
          <Link to={secondary.to}>{secondary.label}</Link>
        </Button>
      )}
    </div>
  </article>
);

export default ProviderPickCard;
