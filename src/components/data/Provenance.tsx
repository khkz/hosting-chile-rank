import React from 'react';

/**
 * Procedencia de un dato. Es la regla central del sitio: cada cifra dice de
 * dónde sale. La forma del símbolo (círculo lleno, anillo, rombo) codifica
 * la procedencia sin depender del color.
 */
export type Provenance = 'measured' | 'declared' | 'editorial';

export const PROVENANCE: Record<Provenance, { label: string; description: string; text: string; bg: string; fill: string }> = {
  measured: {
    label: 'Medido',
    description: 'Lo medimos nosotros con herramientas propias: TTFB, uptime, SSL o ASN de la IP.',
    text: 'text-signal-measured',
    bg: 'bg-signal-measured-bg',
    fill: 'rgb(var(--signal-measured))',
  },
  declared: {
    label: 'Declarado',
    description: 'Lo informa el propio proveedor en su sitio o ficha. No lo hemos comprobado.',
    text: 'text-signal-declared',
    bg: 'bg-signal-declared-bg',
    fill: 'rgb(var(--signal-declared))',
  },
  editorial: {
    label: 'Editorial',
    description: 'Juicio del equipo editorial, con pesos publicados en la metodología.',
    text: 'text-signal-editorial',
    bg: 'bg-signal-editorial-bg',
    fill: 'rgb(var(--signal-editorial))',
  },
};

export const ProvenanceGlyph: React.FC<{ kind: Provenance; size?: number; className?: string }> = ({ kind, size = 8, className = '' }) => {
  const fill = PROVENANCE[kind].fill;
  return (
    <svg viewBox="0 0 10 10" width={size} height={size} aria-hidden className={`shrink-0 ${className}`}>
      {kind === 'measured' && <circle cx={5} cy={5} r={4.2} fill={fill} />}
      {kind === 'declared' && <circle cx={5} cy={5} r={3.4} fill="none" stroke={fill} strokeWidth={1.7} />}
      {kind === 'editorial' && <rect x={1.6} y={1.6} width={6.8} height={6.8} fill={fill} transform="rotate(45 5 5)" />}
    </svg>
  );
};

interface ProvenanceTagProps {
  kind: Provenance;
  /** `tag`: etiqueta con texto. `glyph`: solo el símbolo, con nombre accesible. */
  variant?: 'tag' | 'glyph';
  className?: string;
}

export const ProvenanceTag: React.FC<ProvenanceTagProps> = ({ kind, variant = 'tag', className = '' }) => {
  const p = PROVENANCE[kind];
  if (variant === 'glyph') {
    return (
      <span className={`inline-flex items-center ${className}`} title={`${p.label}: ${p.description}`}>
        <ProvenanceGlyph kind={kind} />
        <span className="sr-only">{p.label}</span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] px-1.5 py-[1px] text-[11px] font-semibold leading-4 ${p.text} ${p.bg} ${className}`}
      title={p.description}
    >
      <ProvenanceGlyph kind={kind} size={7} />
      {p.label}
    </span>
  );
};

/** Leyenda: qué significa cada procedencia. */
export const ProvenanceLegend: React.FC<{ className?: string; compact?: boolean }> = ({ className = '', compact = false }) => (
  <dl className={`grid gap-x-8 gap-y-4 ${compact ? 'sm:grid-cols-3' : 'md:grid-cols-3'} ${className}`}>
    {(Object.keys(PROVENANCE) as Provenance[]).map((k) => (
      <div key={k} className="min-w-0">
        <dt>
          <ProvenanceTag kind={k} />
        </dt>
        <dd className={`mt-1.5 text-ink-2 ${compact ? 'text-xs leading-snug' : 'text-sm leading-relaxed'}`}>
          {PROVENANCE[k].description}
        </dd>
      </div>
    ))}
  </dl>
);
