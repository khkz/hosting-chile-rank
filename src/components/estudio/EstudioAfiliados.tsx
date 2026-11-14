import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, MinusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AFFILIATE_CASES, SELF_PROMO } from '@/data/estudio2026';

/**
 * Sección de comparadores con vínculo comercial.
 * Solo se publican casos que resisten verificación literal; cuando la evidencia
 * acredita monetización pero no titularidad, hablamos de vínculo comercial y no
 * de operación. No se publican nombres de personas naturales (Ley 21.719).
 * Lo que se dice de otros comparadores es una decisión pendiente: los textos
 * quedan idénticos y solo cambia el estilo (sin rojo, que es del puesto 1).
 */
const EstudioAfiliados: React.FC = () => (
  <section aria-labelledby="alerta" className="scroll-mt-24">
    <div className="prose">
      <h2 id="alerta" className="flex scroll-mt-24 items-center gap-3">
        <AlertTriangle className="h-6 w-6 shrink-0 text-ink-2" aria-hidden />
        6. Comparadores con vínculo comercial
      </h2>
      <p>
        Varios sitios que aparecen primero en Google.cl al buscar «mejor hosting Chile» monetizan mediante enlaces de
        afiliado hacia los proveedores que comparan. Publicamos solo los casos cuya evidencia pudimos verificar de forma
        directa, y distinguimos entre <strong>vínculo comercial acreditado</strong> y titularidad u operación, que no
        damos por probada.
      </p>
      <h3>6.1 Casos documentados</h3>
    </div>

    <div className="mt-5 space-y-5">
      {AFFILIATE_CASES.map((c) => (
        <article key={c.domain} className="rounded-xl border border-rule border-l-4 border-l-ink bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="t-h3 text-ink">{c.domain}</h4>
            <Badge variant="outline">{c.status === 'verificado' ? 'AFILIACIÓN VERIFICADA' : 'VÍNCULO COMERCIAL'}</Badge>
          </div>
          <dl className="t-small mt-3 space-y-2 text-ink-2">
            <div>
              <dt className="inline font-semibold text-ink">Vinculado comercialmente a: </dt>
              <dd className="inline">{c.link}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-ink">Evidencia: </dt>
              <dd className="inline [overflow-wrap:anywhere]">{c.evidence}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-ink">Patrón del top: </dt>
              <dd className="inline">{c.topPattern}</dd>
            </div>
            <div className="t-meta mt-3 border-t border-rule pt-2">
              <dt className="inline font-semibold">Evidencia citable:</dt> <dd className="inline">{c.citation}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>

    <div className="prose mt-10">
      <h3>6.2 Auto-promoción disfrazada de comparativa</h3>
      <p>
        Proveedores que publican «rankings de los mejores hosting de Chile» en su propio dominio, posicionándose a sí mismos
        como #1. No son comparadores: son artículos SEO con disclosure ausente o débil.
      </p>
    </div>
    <ul className="mt-4 space-y-2">
      {SELF_PROMO.map((s) => (
        <li key={s.site} className="t-small flex items-start gap-2 rounded-lg border border-rule px-3 py-2.5 text-ink-2">
          <MinusCircle className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
          <span className="min-w-0 [overflow-wrap:anywhere]">
            <strong className="text-ink">{s.site}</strong> — {s.conflict}
          </span>
        </li>
      ))}
    </ul>

    <div className="mt-8 rounded-xl border border-rule bg-paper p-5">
      <h4 className="flex items-center gap-2 font-semibold text-ink">
        <CheckCircle2 className="h-5 w-5 text-ink-2" aria-hidden />
        Qué debería exigirse a un comparador
      </h4>
      <ol className="t-small mt-3 list-decimal space-y-1 pl-5 text-ink-2 marker:text-ink-3">
        <li>Razón social, RUT chileno y datos de contacto visibles.</li>
        <li>Sección «Transparencia» que declare la política de afiliados y las relaciones comerciales.</li>
        <li>Metodología con pesos publicados.</li>
        <li>Declaración explícita de qué proveedores patrocinan o anuncian.</li>
        <li>Mecanismo público de derecho a réplica.</li>
      </ol>
      <p className="t-small mt-3 text-ink-2">
        Ver nuestra implementación en{' '}
        <Link to="/transparencia-hosting-chile" className="font-semibold text-ink underline underline-offset-2">
          /transparencia-hosting-chile
        </Link>{' '}
        y{' '}
        <Link to="/metodologia" className="font-semibold text-ink underline underline-offset-2">
          /metodologia
        </Link>
        .
      </p>
    </div>
  </section>
);

export default EstudioAfiliados;
