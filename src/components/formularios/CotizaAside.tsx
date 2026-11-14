import React from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProvenanceTag } from '@/components/data/Provenance';
import { formatScore } from '@/lib/format';

const RAZONES = [
  { t: 'Comparativa con metodología publicada', d: 'Analizamos múltiples proveedores para recomendarte la mejor opción.' },
  { t: 'Asesoría gratuita', d: 'Te explicamos las ventajas y desventajas de cada opción.' },
  { t: 'Descuentos exclusivos', d: 'Conseguimos mejores precios que contratando directamente.' },
  { t: 'Soporte post-contratación', d: 'Te ayudamos si surgen problemas después de contratar el servicio.' },
];

/** Notas escritas a mano en esta página (decisión pendiente 10): solo cambia el estilo. */
const NOTAS_DESTACADA = [
  { label: 'Velocidad', value: 9.8 },
  { label: 'Soporte técnico', value: 9.9 },
  { label: 'Relación calidad/precio', value: 9.6 },
];

/** Columna lateral de /cotiza-hosting. */
const CotizaAside: React.FC = () => (
  <div className="space-y-6">
    <section aria-labelledby="cotiza-por-que" className="rounded-xl border border-rule bg-white p-5 md:p-6">
      <h2 id="cotiza-por-que" className="t-h3 text-ink">¿Por qué cotizar con nosotros?</h2>
      <ul className="mt-4 space-y-4">
        {RAZONES.map((r) => (
          <li key={r.t} className="flex gap-3">
            <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" />
            <div>
              <h3 className="font-semibold text-ink">{r.t}</h3>
              <p className="t-small text-ink-2">{r.d}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>

    <section aria-labelledby="cotiza-destacada" className="rounded-xl border border-rule bg-white p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 id="cotiza-destacada" className="t-h3 text-ink">Recomendación destacada</h2>
        <ProvenanceTag kind="editorial" />
      </div>
      <img
        src="/logo-hostingplus-official.png"
        alt="HostingPlus"
        className="mt-4 h-10 w-auto"
        loading="lazy"
      />
      <dl className="mt-5 space-y-4">
        {NOTAS_DESTACADA.map((n) => (
          <div key={n.label}>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="t-small text-ink-2">{n.label}</dt>
              <dd className="tabular font-semibold text-ink">{formatScore(n.value)}/10</dd>
            </div>
            <div aria-hidden className="mt-1.5 h-1.5 w-full rounded-sm bg-paper-deep">
              <div className="h-1.5 rounded-sm bg-ink-2" style={{ width: `${n.value * 10}%` }} />
            </div>
          </div>
        ))}
      </dl>
      <Button asChild variant="outline" className="mt-6 w-full">
        <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
          Ir al sitio de HostingPlus <ExternalLink aria-hidden />
        </a>
      </Button>
    </section>
  </div>
);

export default CotizaAside;
