import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { getOperatorByName, rankingHosts, type RankingHostDc } from '@/data/datacenters';

/**
 * Datacenter de un proveedor con la gramática de procedencia del sitio:
 * - autodeclarado: lo publica el proveedor, o sea «Declarado», con su fuente.
 * - certificado: certificación publicada por un tercero (el operador), con su fuente.
 * - extranjero / no divulga: se dice tal cual, con la fuente consultada.
 * Lee src/data/datacenters.ts. Si el proveedor no está en el registro, no dibuja nada.
 */

// Coincidencia flexible: sin dominio, espacios ni mayúsculas («HostingPlus» = «HostingPlus.cl»).
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

const domain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '');

const SourceLink: React.FC<{ url: string }> = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="nofollow noopener noreferrer"
    className="inline-flex items-center gap-1 t-meta underline decoration-ink/30 underline-offset-2 hover:text-ink hover:decoration-ink"
  >
    Fuente: {domain(url)}
    <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
  </a>
);

const Status: React.FC<{ host: RankingHostDc }> = ({ host }) => {
  if (host.estado === 'certificado') {
    const op = host.operador ? getOperatorByName(host.operador) : undefined;
    return (
      <>
        <span className="font-semibold text-ink">{host.operador ?? host.dc_declarado}</span>
        <span className="rounded-sm border border-rule bg-white px-1.5 py-0.5 text-xs font-semibold leading-4 text-ink-2">
          Certificado por terceros
        </span>
        {op?.nivel && <span className="t-meta">{op.nivel}</span>}
        {op?.fuente_url ? <SourceLink url={op.fuente_url} /> : <SourceLink url={host.fuente_url} />}
      </>
    );
  }
  if (host.estado === 'autodeclarado') {
    return (
      <>
        <span className="font-semibold text-ink">{host.dc_declarado ?? 'Datacenter propio'}</span>
        <ProvenanceTag kind="declared" />
        <span className="t-meta">Sin certificación de terceros publicada</span>
        <SourceLink url={host.fuente_url} />
      </>
    );
  }
  return (
    <>
      <span className="font-semibold text-ink">
        {host.estado === 'extranjero' ? 'Infraestructura extranjera' : 'No publica qué datacenter usa'}
      </span>
      <SourceLink url={host.fuente_url} />
    </>
  );
};

interface Props {
  providerName: string;
  variant?: 'inline' | 'row';
  className?: string;
}

const DatacenterBadge: React.FC<Props> = ({ providerName, variant = 'inline', className = '' }) => {
  const host = lookupHostDc(providerName);
  if (!host) return null;

  const how = (
    <Link
      to="/latam#dc-education-heading"
      className="t-meta underline decoration-ink/30 underline-offset-2 hover:text-ink hover:decoration-ink"
    >
      ¿Cómo lo verificamos?
    </Link>
  );

  if (variant === 'row') {
    return (
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 t-small ${className}`}>
        <span className="text-ink-2">Datacenter</span>
        <Status host={host} />
        {how}
      </div>
    );
  }

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 t-small ${className}`}>
      <Status host={host} />
      {how}
    </span>
  );
};

export default DatacenterBadge;
