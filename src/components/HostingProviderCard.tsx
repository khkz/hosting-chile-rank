import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProvenanceTag, type Provenance } from '@/components/data/Provenance';
import DatacenterBadge from '@/components/DatacenterBadge';
import { track } from '@/lib/track';
import type { HubProvider } from '@/components/comparar/hubTypes';
import {
  BackupValue, DatacenterValue, NotaValue, PriceValue, ReclamosValue, TechValue,
} from '@/components/comparar/hubCells';

interface HostingProviderCardProps {
  provider: HubProvider;
  /** Nota editorial leída de la base (null = sin nota). */
  nota: number | null;
  /** id de hosting_companies, para los reclamos verificados. */
  companyId?: string;
  notaLoading?: boolean;
  /** Fila destacada del hub (decisión pendiente 3): fondo papel, sin borde rojo. */
  isHighlighted?: boolean;
}

const Row: React.FC<{ label: string; kind?: Provenance; children: React.ReactNode }> = ({ label, kind, children }) => (
  <div className="flex items-start justify-between gap-4 py-2.5">
    <dt className="t-small flex shrink-0 items-center gap-1.5 text-ink-2">
      {label}
      {kind && <ProvenanceTag kind={kind} variant="glyph" />}
    </dt>
    <dd className="min-w-0 text-right text-[15px]">{children}</dd>
  </div>
);

/** Tarjeta del hub /comparativa bajo 1024 px: mismas columnas que la tabla. */
const HostingProviderCard: React.FC<HostingProviderCardProps> = ({ provider, nota, companyId, notaLoading, isHighlighted = false }) => (
  <article className={`rounded-xl border border-rule p-5 ${isHighlighted ? 'bg-paper-deep' : 'bg-white'}`}>
    <header className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="t-h3 text-ink">{provider.name}</h3>
        {isHighlighted && (
          <Badge variant="ink" className="mt-1.5">Recomendado</Badge>
        )}
      </div>
      <div className="shrink-0 text-right">
        <NotaValue nota={nota} loading={notaLoading} />
        <div className="mt-1 flex justify-end">
          <ProvenanceTag kind="editorial" variant="glyph" />
        </div>
      </div>
    </header>

    <dl className="mt-4 divide-y divide-rule border-y border-rule">
      <Row label="ASN" kind="measured"><span className="tabular text-ink">{provider.asn}</span></Row>
      <Row label="Datacenter" kind="declared"><DatacenterValue provider={provider} /></Row>
      <Row label="Backups" kind="declared"><BackupValue provider={provider} /></Row>
      <Row label="Reclamos (12 meses)" kind="measured"><ReclamosValue companyId={companyId} /></Row>
      <Row label="Precio al año" kind="declared"><PriceValue provider={provider} /></Row>
      <Row label="Tecnologías" kind="declared"><TechValue provider={provider} /></Row>
    </dl>

    <DatacenterBadge providerName={provider.name} variant="row" className="mt-3" />

    <Button asChild variant="outline" className="mt-4 w-full">
      <Link
        to={`/catalogo/${provider.catalogSlug}`}
        onClick={() => track('click_ver_ficha', { slug: provider.id, location: 'provider_card' })}
      >
        Ver ficha
      </Link>
    </Button>
  </article>
);

export default HostingProviderCard;
