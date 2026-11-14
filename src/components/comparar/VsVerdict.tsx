import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { ProvenanceTag } from '@/components/data/Provenance';
import Callout from '@/components/system/Callout';
import { Button } from '@/components/ui/button';

export interface VerdictSide {
  slug: string;
  name: string;
  /** Ventajas tal como vienen de la base (campo pros). */
  pros: string[];
  /** Desventajas tal como vienen de la base (campo cons). */
  cons: string[];
}

const MAX_PROS = 4;
const MAX_CONS = 3;

const SideBlock: React.FC<{ side: VerdictSide }> = ({ side }) => {
  const pros = side.pros.slice(0, MAX_PROS);
  const cons = side.cons.slice(0, MAX_CONS);
  const headingId = `elige-${side.slug}`;
  return (
    <section aria-labelledby={headingId} className="flex flex-col rounded-xl border border-rule bg-white p-5 md:p-6">
      <h3 id={headingId} className="t-h3 text-ink">
        Elige {side.name} si te importa…
      </h3>
      {pros.length === 0 && cons.length === 0 && (
        <p className="t-body mt-3 text-ink-2">
          Aún no registramos ventajas ni desventajas de {side.name}. Faltan datos para decirte cuándo conviene.
        </p>
      )}
      {pros.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {pros.map((p) => (
            <li key={p} className="t-body flex gap-2.5 text-ink">
              <Plus aria-hidden className="mt-1 h-4 w-4 shrink-0 text-ink-2" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      ) : (
        cons.length > 0 && <p className="t-body mt-3 text-ink-2">Aún no registramos ventajas de {side.name}.</p>
      )}
      {cons.length > 0 && (
        <>
          <p className="t-label mt-5">Ten en cuenta</p>
          <ul className="mt-2 space-y-2">
            {cons.map((c) => (
              <li key={c} className="t-body flex gap-2.5 text-ink-2">
                <Minus aria-hidden className="mt-1 h-4 w-4 shrink-0 text-ink-3" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
        <ProvenanceTag kind="editorial" />
        <Link
          to={`/catalogo/${side.slug}`}
          className="t-small inline-flex min-h-[44px] items-center font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          Ver ficha de {side.name}
        </Link>
      </div>
    </section>
  );
};

/**
 * «Elige A si… / elige B si…» armado solo con las ventajas y desventajas
 * que registra la base. Si no hay ninguna, lo dice: no inventa razones.
 */
const VsVerdict: React.FC<{ a: VerdictSide; b: VerdictSide }> = ({ a, b }) => {
  const count = (s: VerdictSide) => s.pros.length + s.cons.length;
  if (count(a) === 0 && count(b) === 0) {
    return (
      <div>
        <Callout tone="note" title="Faltan datos para este veredicto" className="my-0 max-w-[62ch]">
          <p>
            Todavía no registramos ventajas ni desventajas de {a.name} ni de {b.name}, así que no te vamos a decir
            cuándo conviene cada uno.
          </p>
          <p>Mientras tanto, mira las filas marcadas «Difieren» en la tabla y abre cada ficha.</p>
        </Callout>
        <div className="mt-5 flex flex-wrap gap-3">
          {[a, b].map((s) => (
            <Button key={s.slug} asChild variant="outline">
              <Link to={`/catalogo/${s.slug}`}>Ver ficha de {s.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <SideBlock side={a} />
      <SideBlock side={b} />
    </div>
  );
};

export default VsVerdict;
