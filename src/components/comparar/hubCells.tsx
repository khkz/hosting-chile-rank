import React from 'react';
import { Check, X } from 'lucide-react';
import { useCompanyReputation } from '@/hooks/useCompanyReputation';
import { getVerifiedPricing } from '@/data/verified2026';
import { formatInteger, formatMoney, formatScore } from '@/lib/format';
import type { HubProvider } from './hubTypes';

/*
 * Celdas del hub /comparativa: una unidad por columna. Lo que no calza con la
 * unidad de la columna se muestra como «ver ficha» en vez de mezclar formatos.
 */

const Muted: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-ink-3">{children}</span>
);

const Detail: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="t-meta mt-0.5 block">{children}</span>
);

/** Nota editorial leída de la base. */
export const NotaValue: React.FC<{ nota: number | null; loading?: boolean }> = ({ nota, loading }) =>
  nota != null ? (
    <span className="tabular font-semibold text-ink">{formatScore(nota)}<span className="font-normal text-ink-3">/10</span></span>
  ) : (
    <Muted>{loading ? '…' : 'Sin nota'}</Muted>
  );

/** Reclamos verificados en los últimos 12 meses (mismo dato que la ficha). */
export const ReclamosValue: React.FC<{ companyId?: string }> = ({ companyId }) => {
  const { data, isLoading } = useCompanyReputation(companyId);
  if (!companyId || (!isLoading && !data)) return <Muted>Sin dato</Muted>;
  if (isLoading || !data) return <Muted>…</Muted>;
  return <span className="tabular text-ink">{formatInteger(data.internal_complaints_12m)}</span>;
};

/** Datacenter y, debajo, su ubicación. */
export const DatacenterValue: React.FC<{ provider: HubProvider }> = ({ provider }) => (
  <span className="text-ink">
    {provider.datacenter}
    <Detail>{provider.datacenterPlace}</Detail>
  </span>
);

/** Frecuencia de respaldo; si el dato no es una frecuencia, «ver ficha». */
export const BackupValue: React.FC<{ provider: HubProvider }> = ({ provider }) => {
  if (provider.backupFreq) {
    const detail = provider.backups.match(/\(([^)]+)\)/)?.[1];
    return (
      <span className="text-ink">
        {provider.backupFreq}
        {detail && <Detail>{detail}</Detail>}
      </span>
    );
  }
  if (provider.backups === 'Sí') {
    return (
      <span className="text-ink">
        Sí<Detail>Frecuencia sin dato</Detail>
      </span>
    );
  }
  return <Muted>ver ficha</Muted>;
};

/** Precio de entrada en CLP al año, sin IVA. Lo que no es comparable va a la ficha. */
export const PriceValue: React.FC<{ provider: HubProvider }> = ({ provider }) => {
  const v = getVerifiedPricing(provider.id);
  if (provider.priceCLP != null && v?.tax === 'neto' && v.category === 'shared') {
    const firstYear = /primer año/i.test(v.label);
    return (
      <span className="tabular text-ink">
        {formatMoney(provider.priceCLP)}
        <Detail>
          {v.plan}
          {firstYear ? ', precio del primer año' : ''}
        </Detail>
      </span>
    );
  }
  if (!v || (v.annualNetCLP == null && v.label === 'No disponible')) return <Muted>Sin dato</Muted>;
  return (
    <span>
      <Muted>ver ficha</Muted>
      <Detail>{v.label}</Detail>
    </span>
  );
};

/** LiteSpeed y WAF declarados: sí o no, con texto (no solo color). */
export const TechValue: React.FC<{ provider: HubProvider }> = ({ provider }) => (
  <span className="flex flex-col gap-1 text-ink">
    {[
      { label: 'LiteSpeed', on: provider.hasLiteSpeed },
      { label: 'WAF', on: provider.hasWAF },
    ].map((t) => (
      <span key={t.label} className="inline-flex items-center gap-1.5">
        {t.on ? <Check aria-hidden className="h-4 w-4 shrink-0 text-ink" /> : <X aria-hidden className="h-4 w-4 shrink-0 text-ink-3" />}
        <span>
          {t.label}
          <span className="sr-only">: {t.on ? 'sí' : 'no'}</span>
        </span>
      </span>
    ))}
  </span>
);
