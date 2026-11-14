import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Callout from '@/components/system/Callout';
import { Badge } from '@/components/ui/badge';

/** Cuerpo de lectura fuera de `prose`: mismo tamaño y ritmo que el texto corrido. */
export const BODY = 'text-[1.0625rem] leading-[1.7]';

/** Estilos de texto enriquecido para bloques `not-prose` (fichas, notas, tablas). */
export const RICH =
  'space-y-3 text-ink-2 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/30 [&_a]:underline-offset-2 [&_a:hover]:decoration-ink';

/** Título de sección del cuerpo, con ancla para el índice «En esta página». */
export const H2: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2 id={id} className="scroll-mt-24">
    {children}
  </h2>
);

interface GuideNoteProps {
  /** note: dato o contexto; tip: consejo práctico; caution: algo a revisar antes de decidir. */
  tone?: 'note' | 'tip' | 'caution';
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Callout del sistema adaptado al cuerpo en `prose` (reemplaza las cajas de colores). */
export const GuideNote: React.FC<GuideNoteProps> = ({ tone = 'note', title, children, className }) => (
  <Callout
    tone={tone}
    title={title}
    className={cn(
      'not-prose [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/30 [&_a]:underline-offset-2 [&_a:hover]:decoration-ink [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5',
      className,
    )}
  >
    {children}
  </Callout>
);

/** Lista con marca de sí o no (reemplaza las marcas emoji de las guías heredadas). */
export const MarkList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <ul className={cn('not-prose my-4 space-y-2', className)}>{children}</ul>
);

interface MarkItemProps {
  /** true: marca de «no» (equis). */
  no?: boolean;
  /** Texto para lectores de pantalla antes del ítem; por defecto «No:» en los ítems con equis. */
  srLabel?: string;
  children: React.ReactNode;
}

export const MarkItem: React.FC<MarkItemProps> = ({ no = false, srLabel, children }) => {
  const Icon = no ? X : Check;
  const spoken = srLabel ?? (no ? 'No: ' : undefined);
  return (
    <li className={cn('flex gap-2.5 text-ink-2', BODY)}>
      <Icon aria-hidden className="mt-[0.35em] h-4 w-4 shrink-0 text-ink-3" />
      <span className="min-w-0 [&_strong]:font-semibold [&_strong]:text-ink">
        {spoken && <span className="sr-only">{spoken}</span>}
        {children}
      </span>
    </li>
  );
};

interface ProsConsProps {
  pros: string[];
  cons: string[];
  prosLabel?: string;
  consLabel?: string;
}

/** Ventajas y desventajas como etiquetas neutras, con rótulo (el color ya no carga el significado). */
export const ProsCons: React.FC<ProsConsProps> = ({ pros, cons, prosLabel = 'A favor', consLabel = 'En contra' }) => (
  <dl className="not-prose mt-4 space-y-2">
    {[
      { label: prosLabel, items: pros },
      { label: consLabel, items: cons },
    ]
      .filter((g) => g.items.length > 0)
      .map((g) => (
        <div key={g.label} className="flex flex-wrap items-center gap-2">
          <dt className="t-label mr-1">{g.label}</dt>
          {g.items.map((it) => (
            <dd key={it}>
              <Badge variant="secondary">{it}</Badge>
            </dd>
          ))}
        </div>
      ))}
  </dl>
);
