import React from 'react';
import { BadgeCheck, ChevronDown, ExternalLink, EyeOff, Globe2, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  certifiedOperators,
  rankingHosts,
  type CertificationBody,
  type DcStatus,
} from '@/data/datacenters';

/**
 * Plegables de «¿Dónde vive realmente tu sitio?»: operadores certificados y
 * datacenter por proveedor. Todo sale de src/data/datacenters.ts, con su fuente.
 * El estado va en tinta con íconos distintos: verde, ámbar y violeta son solo de
 * procedencia (Medido, Declarado, Editorial), y círculo, anillo y rombo también.
 */

const ORG_LABEL: Record<CertificationBody, string> = {
  uptime: 'Uptime Institute',
  tuv_tr3: 'Certificaciones publicadas por el operador',
  icrea: 'ICREA',
};

const DC_STATUS: Record<DcStatus, { text: string; Icon: React.ComponentType<{ className?: string }> }> = {
  certificado: { text: 'Certificado por tercero', Icon: BadgeCheck },
  autodeclarado: { text: 'Autodeclarado (sin auditoría)', Icon: MessageSquare },
  extranjero: { text: 'Infraestructura extranjera', Icon: Globe2 },
  no_divulga: { text: 'No divulga', Icon: EyeOff },
};

// Ranking objetivo de operadores certificados:
// 1) Uptime Tier IV > Tier III; 2) presencia de "Constructed Facility"; 3) sustentabilidad Gold.
function operatorScore(nivel: string): number {
  let s = 0;
  if (/tier\s*iv/i.test(nivel)) s += 40;
  else if (/tier\s*iii/i.test(nivel)) s += 30;
  if (/constructed\s+facility/i.test(nivel)) s += 15;
  if (/design/i.test(nivel)) s += 5;
  if (/gold\s+sustainability/i.test(nivel)) s += 10;
  if (/m&o/i.test(nivel)) s += 5;
  return s;
}

const rankedOperators = [...certifiedOperators].sort((a, b) => operatorScore(b.nivel) - operatorScore(a.nivel));

const sourceLink =
  'inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink md:min-h-0';

const Fold: React.FC<{ title: string; summary: string; children: React.ReactNode }> = ({ title, summary, children }) => (
  <details className="group border-b border-rule">
    <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
      <span>
        <span className="t-h3 block text-ink">{title}</span>
        <span className="t-small text-ink-2">{summary}</span>
      </span>
      <ChevronDown className="h-5 w-5 shrink-0 text-ink-2 transition-transform group-open:rotate-180" aria-hidden />
    </summary>
    <div className="pb-6">{children}</div>
  </details>
);

const StatusLabel: React.FC<{ estado: DcStatus }> = ({ estado }) => {
  const s = DC_STATUS[estado];
  return (
    <span className="inline-flex items-center gap-1.5 text-ink">
      <s.Icon className="h-4 w-4 shrink-0 text-ink-2" aria-hidden />
      {s.text}
    </span>
  );
};

/** Operadores con certificación pública verificable, ordenados por criterios objetivos. */
export const OperatorsFold: React.FC = () => (
  <Fold
    title="Operadores certificados en Chile"
    summary={`${rankedOperators.length} operadores con certificación pública verificable`}
  >
    <p className="measure mb-4 text-base text-ink-2 md:text-[15px]">
      Ordenados por criterios objetivos: nivel Tier declarado, evidencia de instalación construida («Constructed
      Facility») y sustentabilidad Gold. Solo incluye operadores con certificación pública verificable.
    </p>
    <ol className="divide-y divide-rule border-y border-rule">
      {rankedOperators.map((op, i) => (
        <li key={op.nombre} className="flex items-start gap-4 py-4">
          <span className="w-6 shrink-0 text-lg font-bold text-ink-3 tabular">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-ink">{op.nombre}</p>
              <Badge variant="outline">{ORG_LABEL[op.organismo]}</Badge>
            </div>
            <p className="mt-1 text-base text-ink-2 md:text-[15px]">{op.nivel}</p>
            <p className="t-meta mt-0.5">{op.ubicacion}</p>
          </div>
          <a
            href={op.fuente_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`${sourceLink} shrink-0`}
            aria-label={`Fuente de la certificación de ${op.nombre} (se abre en otra pestaña)`}
          >
            Fuente <ExternalLink className="h-3.5 w-3.5 text-ink-2" aria-hidden />
          </a>
        </li>
      ))}
    </ol>
  </Fold>
);

/** Datacenter que declara cada proveedor del ranking: tabla en escritorio, lista en móvil. */
export const HostsFold: React.FC = () => (
  <Fold title="¿Qué datacenter usa cada proveedor?" summary={`${rankingHosts.length} proveedores, con su fuente pública`}>
    <p className="measure mb-4 text-base text-ink-2 md:text-[15px]">
      Estado según fuentes públicas del propio proveedor. Cuando el proveedor no transparenta operador o certificación,
      lo marcamos como autodeclarado o «no divulga».
    </p>

    <table className="hidden w-full border-collapse text-left text-[15px] md:table">
      <thead>
        <tr className="border-b-2 border-ink text-[13px] text-ink-2">
          <th scope="col" className="py-2.5 pr-4 font-semibold">Proveedor</th>
          <th scope="col" className="py-2.5 pr-4 font-semibold">Datacenter declarado</th>
          <th scope="col" className="py-2.5 pr-4 font-semibold">Operador</th>
          <th scope="col" className="py-2.5 pr-4 font-semibold">Estado</th>
          <th scope="col" className="py-2.5 font-semibold">Fuente</th>
        </tr>
      </thead>
      <tbody>
        {rankingHosts.map((h) => (
          <tr key={h.nombre} className="border-b border-rule align-top">
            <th scope="row" className="whitespace-nowrap py-3 pr-4 font-semibold text-ink">{h.nombre}</th>
            <td className="py-3 pr-4 text-ink-2">{h.dc_declarado ?? 'Sin dato'}</td>
            <td className="py-3 pr-4 text-ink-2">{h.operador ?? 'Sin dato'}</td>
            <td className="py-3 pr-4"><StatusLabel estado={h.estado} /></td>
            <td className="py-3">
              <a href={h.fuente_url} target="_blank" rel="noopener noreferrer nofollow" className={sourceLink} aria-label={`Fuente pública de ${h.nombre} (se abre en otra pestaña)`}>
                Ver <ExternalLink className="h-3.5 w-3.5 text-ink-2" aria-hidden />
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <ul className="divide-y divide-rule border-y-2 border-ink md:hidden">
      {rankingHosts.map((h) => (
        <li key={h.nombre} className="py-4">
          <p className="font-semibold text-ink">{h.nombre}</p>
          <dl className="mt-1 space-y-0.5 text-base text-ink-2">
            <div className="flex gap-1.5">
              <dt className="text-ink-3">Datacenter:</dt>
              <dd>{h.dc_declarado ?? 'Sin dato'}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-ink-3">Operador:</dt>
              <dd>{h.operador ?? 'Sin dato'}</dd>
            </div>
          </dl>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <StatusLabel estado={h.estado} />
            <a href={h.fuente_url} target="_blank" rel="noopener noreferrer nofollow" className={sourceLink} aria-label={`Fuente pública de ${h.nombre} (se abre en otra pestaña)`}>
              Fuente <ExternalLink className="h-3.5 w-3.5 text-ink-2" aria-hidden />
            </a>
          </div>
        </li>
      ))}
    </ul>
  </Fold>
);
