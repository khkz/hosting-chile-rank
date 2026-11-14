import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ProvenanceTag, type Provenance } from '@/components/data/Provenance';
import type { HubProvider } from './hubTypes';
import { BackupValue, DatacenterValue, NotaValue, PriceValue, ReclamosValue, TechValue } from './hubCells';

export interface HubRowData {
  provider: HubProvider;
  nota: number | null;
  companyId?: string;
}

const Head: React.FC<{ children: React.ReactNode; kind?: Provenance; unit?: string; className?: string }> = ({
  children, kind, unit, className,
}) => (
  <th scope="col" className={cn('py-3 pr-4 align-bottom text-[13px] font-semibold text-ink-2', className)}>
    <span className="inline-flex items-center gap-1.5">
      {children}
      {kind && <ProvenanceTag kind={kind} variant="glyph" />}
    </span>
    {unit && <span className="block font-normal text-ink-3">{unit}</span>}
  </th>
);

/**
 * Tabla del hub desde 1024 px. Una unidad por columna; la procedencia va en
 * el encabezado. La fila destacada (decisión pendiente 3) usa fondo papel y
 * una etiqueta neutra, sin borde rojo.
 */
const HubTable: React.FC<{ rows: HubRowData[]; highlightId: string; notaLoading?: boolean }> = ({
  rows, highlightId, notaLoading,
}) => (
  <table className="w-full table-fixed border-collapse text-left text-[15px]">
    <caption className="sr-only">Comparativa de proveedores de hosting en Chile, una unidad por columna</caption>
    <colgroup>
      <col className="w-[14%]" />
      <col className="w-[8%]" />
      <col className="w-[10%]" />
      <col className="w-[16%]" />
      <col className="w-[10%]" />
      <col className="w-[9%]" />
      <col className="w-[13%]" />
      <col className="w-[10%]" />
      <col className="w-[10%]" />
    </colgroup>
    <thead>
      <tr className="border-b-2 border-ink">
        <Head>Proveedor</Head>
        <Head kind="editorial" unit="sobre 10">Nota</Head>
        <Head kind="measured">ASN</Head>
        <Head kind="declared">Datacenter</Head>
        <Head kind="declared" unit="frecuencia">Backups</Head>
        <Head kind="measured" unit="verificados, 12 meses">Reclamos</Head>
        <Head kind="declared" unit="CLP al año, sin IVA">Precio de entrada</Head>
        <Head kind="declared">Tecnologías</Head>
        <th scope="col" className="py-3 align-bottom"><span className="sr-only">Acción</span></th>
      </tr>
    </thead>
    <tbody>
      {rows.length > 0 ? (
        rows.map(({ provider, nota, companyId }) => {
          const highlighted = provider.id === highlightId;
          return (
            <tr key={provider.id} className={cn('border-b border-rule align-top', highlighted && 'bg-paper-deep')}>
              <th scope="row" className={cn('py-3.5 pr-4 font-semibold text-ink', highlighted && 'pl-3')}>
                {provider.name}
                {highlighted && <Badge variant="ink" className="mt-1.5 block w-fit">Recomendado</Badge>}
              </th>
              <td className="py-3.5 pr-4"><NotaValue nota={nota} loading={notaLoading} /></td>
              <td className="tabular py-3.5 pr-4 text-ink">{provider.asn}</td>
              <td className="py-3.5 pr-4"><DatacenterValue provider={provider} /></td>
              <td className="py-3.5 pr-4"><BackupValue provider={provider} /></td>
              <td className="py-3.5 pr-4"><ReclamosValue companyId={companyId} /></td>
              <td className="py-3.5 pr-4"><PriceValue provider={provider} /></td>
              <td className="py-3.5 pr-4"><TechValue provider={provider} /></td>
              <td className="py-2.5 text-right">
                <Link
                  to={`/catalogo/${provider.catalogSlug}`}
                  className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-lg border border-ink/25 bg-white px-3 text-sm font-semibold text-ink hover:border-ink"
                >
                  Ver ficha<span className="sr-only"> de {provider.name}</span>
                </Link>
              </td>
            </tr>
          );
        })
      ) : null}
    </tbody>
  </table>
);

export default HubTable;
