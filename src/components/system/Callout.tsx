import React from 'react';
import { Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalloutProps {
  /** note: dato útil · tip: consejo práctico · caution: algo a revisar antes de decidir. */
  tone?: 'note' | 'tip' | 'caution';
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ICON = { note: Info, tip: Lightbulb, caution: AlertTriangle };

/**
 * Recuadro de texto del sistema. Reemplaza las cajas de colores heredadas:
 * fondo papel, ícono en tinta y, para «caution», una regla izquierda en tinta.
 * Sin verde, ámbar ni rojo: esos colores son de la procedencia y del puesto 1.
 */
const Callout: React.FC<CalloutProps> = ({ tone = 'note', title, children, className }) => {
  const Icon = ICON[tone];
  return (
    <aside
      className={cn(
        'my-6 flex gap-3 rounded-xl border border-rule bg-paper p-4 md:p-5',
        tone === 'caution' && 'border-l-4 border-l-ink',
        className,
      )}
    >
      <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" />
      <div className="min-w-0 text-ink-2">
        {title && <p className="mb-1 font-semibold text-ink">{title}</p>}
        <div className="t-small [&>p+p]:mt-2">{children}</div>
      </div>
    </aside>
  );
};

export default Callout;
