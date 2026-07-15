import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, HelpCircle, Globe2 } from 'lucide-react';
import { rankingHosts, type RankingHostDc, type DcStatus } from '@/data/datacenters';

/**
 * P4-DC3: badge "Datacenter" for provider cards and ficha pages.
 * Reads from src/data/datacenters.ts and links to the LATAM Hub education block.
 * Nothing invented: if the provider is not in the registry, renders null.
 */

const STATUS: Record<
  DcStatus,
  { text: string; className: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  certificado: {
    text: 'Datacenter certificado',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Icon: CheckCircle2,
  },
  autodeclarado: {
    text: 'Datacenter autodeclarado',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    Icon: AlertTriangle,
  },
  extranjero: {
    text: 'Infraestructura extranjera',
    className: 'bg-slate-50 text-slate-700 border-slate-200',
    Icon: Globe2,
  },
  no_divulga: {
    text: 'No divulga datacenter',
    className: 'bg-slate-50 text-slate-500 border-slate-200',
    Icon: HelpCircle,
  },
};

// Loose name matching: strip domain/spaces/case so "HostingPlus" matches "HostingPlus.cl".
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\.cl$|\.com$|\.net$/g, '')
    .replace(/[\s._-]+/g, '')
    .replace(/[^\p{Letter}\p{Number}]/gu, '');
}

const INDEX: Map<string, RankingHostDc> = (() => {
  const m = new Map<string, RankingHostDc>();
  for (const h of rankingHosts) m.set(norm(h.nombre), h);
  return m;
})();

export function lookupHostDc(name: string | null | undefined): RankingHostDc | undefined {
  if (!name) return undefined;
  return INDEX.get(norm(name));
}

interface Props {
  providerName: string;
  variant?: 'inline' | 'row';
  className?: string;
}

const DatacenterBadge: React.FC<Props> = ({ providerName, variant = 'inline', className = '' }) => {
  const host = lookupHostDc(providerName);
  if (!host) return null;
  const s = STATUS[host.estado];

  if (variant === 'row') {
    return (
      <div className={`flex items-start gap-2 text-sm ${className}`}>
        <span className="text-gray-500 shrink-0">Datacenter:</span>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${s.className}`}
          >
            <s.Icon className="h-3 w-3" />
            {s.text}
          </span>
          {host.operador && (
            <span className="text-xs text-[#2B2D42]/70">
              Operador: <span className="font-medium">{host.operador}</span>
            </span>
          )}
          <Link
            to="/latam#dc-education-heading"
            className="text-xs text-[#EF233C] hover:underline"
            aria-label="Ver metodología de certificación de datacenters"
          >
            ¿Cómo lo verificamos?
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${s.className}`}
        title={host.dc_declarado ?? undefined}
      >
        <s.Icon className="h-3 w-3" />
        {s.text}
        {host.operador ? ` · ${host.operador}` : ''}
      </span>
      <Link
        to="/latam#dc-education-heading"
        className="text-[11px] text-[#EF233C] hover:underline"
      >
        ¿Cómo lo verificamos?
      </Link>
    </div>
  );
};

export default DatacenterBadge;
