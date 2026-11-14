import React from 'react';
import { cn } from '@/lib/utils';
import { formatScore } from '@/lib/format';
import { ProvenanceTag } from '@/components/data/Provenance';

/**
 * Nota editorial en el formato único de la familia «ranking»: «9,9» en tinta
 * con «/10» en ink-3. Sin estrellas ni colores. Sirve a /ranking, la guía de
 * Chile, los hubs por segmento y las páginas WordPress y e-commerce.
 */
interface ScoreValueProps {
  value: number | null | undefined;
  /** sm: tablas y listas; md: filas destacadas; lg: tarjetas del podio. */
  size?: 'sm' | 'md' | 'lg';
  /** Añade el símbolo de procedencia «Editorial» (con texto para lectores de pantalla). */
  glyph?: boolean;
  className?: string;
}

const SIZE: Record<NonNullable<ScoreValueProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-[2rem] leading-none',
};

const ScoreValue: React.FC<ScoreValueProps> = ({ value, size = 'sm', glyph = false, className }) => {
  if (value == null || !Number.isFinite(Number(value))) {
    return <span className={cn('t-small text-ink-3', className)}>Sin nota</span>;
  }
  const text = formatScore(value);
  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      <span className="tabular whitespace-nowrap" aria-hidden>
        <span className={cn('font-bold text-ink', SIZE[size])} style={size === 'lg' ? { fontStretch: '112%' } : undefined}>
          {text}
        </span>
        <span className="ml-0.5 text-sm font-semibold text-ink-3">/10</span>
      </span>
      <span className="sr-only">{text} de 10</span>
      {glyph && <ProvenanceTag kind="editorial" variant="glyph" className="self-center" />}
    </span>
  );
};

export default ScoreValue;
