import React, { useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatInteger } from '@/lib/format';

/** Convención única: los obligatorios no llevan marca; los opcionales dicen «(opcional)». */
export const RequiredNote: React.FC = () => (
  <p className="t-small text-ink-2">Todos los campos son obligatorios, salvo los que dicen «(opcional)».</p>
);

export const Optional: React.FC = () => <span className="font-normal text-ink-3"> (opcional)</span>;

/** Rango visible y contador: «Entre 20 y 1.000 caracteres» y «12 de 1.000». */
export const CharCount: React.FC<{ value: string | undefined; min?: number; max: number }> = ({ value, min, max }) => {
  const n = (value ?? '').length;
  const short = min != null && n > 0 && n < min;
  return (
    <span className="flex flex-wrap justify-between gap-x-4 gap-y-1">
      <span>
        {min != null
          ? `Entre ${formatInteger(min)} y ${formatInteger(max)} caracteres.`
          : `Hasta ${formatInteger(max)} caracteres.`}
      </span>
      <span className="tabular">
        {formatInteger(n)} de {formatInteger(max)}
        {short && <span className="text-ink"> (faltan {formatInteger(min - n)})</span>}
      </span>
    </span>
  );
};

/** Aviso de error del envío, dentro de la misma tarjeta. */
export const FormAlert: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div role="alert" className="flex gap-3 rounded-xl border border-rule border-l-4 border-l-ink bg-paper p-4">
    <AlertCircle aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-ink" />
    <div className="min-w-0">
      <p className="font-semibold text-ink">{title}</p>
      <div className="t-small mt-1 text-ink-2">{children}</div>
    </div>
  </div>
);

/**
 * Confirmación en la misma tarjeta tras un envío correcto. Recibe el foco al
 * aparecer, porque el botón que lo tenía deja de existir.
 */
export const FormSuccess: React.FC<{
  title: string;
  children: React.ReactNode;
  resetLabel: string;
  onReset: () => void;
}> = ({ title, children, resetLabel, onReset }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <CheckCircle2 aria-hidden className="h-8 w-8 text-ink" />
      <h3 className="t-h3 mt-3 text-ink">{title}</h3>
      <div className="t-body measure mt-2 space-y-2 text-ink-2">{children}</div>
      <Button type="button" variant="outline" className="mt-6" onClick={onReset}>
        {resetLabel}
      </Button>
    </div>
  );
};
