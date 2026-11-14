import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { ProvenanceTag } from '@/components/data/Provenance';
import Callout from '@/components/system/Callout';

interface VeredictoProps {
  name: string;
  /** Se conserva por compatibilidad: el veredicto no repite la nota (ya está en la cabecera). */
  rating?: number;
  editorial?: string | null;
  pros?: string[] | null;
  cons?: string[] | null;
}

const clean = (list?: string[] | null) =>
  (list ?? []).filter((s): s is string => typeof s === 'string' && s.trim().length > 0);

/**
 * Veredicto editorial: el texto del equipo y los pros y contras que trae la
 * base, desde uno. Si no hay nada escrito, lo dice; nunca rellena con frases fijas.
 */
const Veredicto: React.FC<VeredictoProps> = ({ name, editorial, pros, cons }) => {
  const text = editorial?.trim() ?? '';
  const prosList = clean(pros);
  const consList = clean(cons);
  const hasLists = prosList.length > 0 || consList.length > 0;

  if (!text && !hasLists) {
    return (
      <Callout tone="note" title={`Todavía no escribimos el veredicto de ${name}`} className="my-0 max-w-[62ch]">
        <p>Mientras tanto, revisa abajo lo que declara el proveedor y cómo se calcula su nota.</p>
      </Callout>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="min-w-0">
        <p className="flex items-center gap-2 t-meta">
          <ProvenanceTag kind="editorial" />
          Criterio del equipo editorial
        </p>
        {text ? (
          <p className="t-body mt-4 max-w-[62ch] whitespace-pre-line text-ink">{text}</p>
        ) : (
          <p className="t-body mt-4 max-w-[62ch] text-ink-2">
            Aún no hay un texto de veredicto para {name}. Estos son los puntos a favor y en contra que registramos.
          </p>
        )}
      </div>

      {hasLists && (
        <div className="grid min-w-0 gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {prosList.length > 0 && (
            <div>
              <h3 className="t-h3 text-ink">A favor</h3>
              <ul className="mt-3 space-y-2.5">
                {prosList.map((p, i) => (
                  <li key={i} className="flex gap-2.5 t-small text-ink">
                    <Plus className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {consList.length > 0 && (
            <div>
              <h3 className="t-h3 text-ink">En contra</h3>
              <ul className="mt-3 space-y-2.5">
                {consList.map((c, i) => (
                  <li key={i} className="flex gap-2.5 t-small text-ink">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" aria-hidden />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Veredicto;
