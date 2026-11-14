import React from 'react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { formatInteger, formatShortDate, isoDate } from '@/lib/format';
import { ASN_CHECKED_AT } from '@/lib/dcTier';

interface CountrySummaryProps {
  countryName: string;
  /** undefined mientras carga: se muestra «…». */
  total?: number;
  declaredLocal?: number;
  /** Proveedores con la IP en una red (ASN) del país. */
  measuredLocal?: number;
  /** IP revisadas cuya red se ve (no CDN): el denominador honesto. */
  measuredVisible?: number;
  /** IP revisadas detrás de una CDN: no muestran dónde está el origen. */
  measuredCdn?: number;
}

/** Fila con dato y valor, más una nota opcional a todo el ancho debajo. */
const Row: React.FC<{ label: React.ReactNode; children: React.ReactNode; note?: React.ReactNode }> = ({
  label,
  children,
  note,
}) => (
  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-3">
    <dt className="t-small text-ink-2">{label}</dt>
    <dd className="text-right">{children}</dd>
    {note && <dd className="t-meta col-span-2 mt-1">{note}</dd>}
  </div>
);

const num = (n?: number) => (n == null ? '…' : formatInteger(n));

/**
 * Resumen de la edición con cifras leídas de la base. Cada fila dice de
 * dónde sale el dato. Va junto a la introducción, antes de la tabla.
 */
const CountrySummary: React.FC<CountrySummaryProps> = ({
  countryName,
  total,
  declaredLocal,
  measuredLocal,
  measuredVisible,
  measuredCdn,
}) => {
  const loading = measuredVisible == null || measuredCdn == null;
  const visible = measuredVisible ?? 0;
  const cdn = measuredCdn ?? 0;
  const at = ASN_CHECKED_AT ? (
    <>
      Revisión del <time dateTime={isoDate(ASN_CHECKED_AT)}>{formatShortDate(ASN_CHECKED_AT)}</time>.
    </>
  ) : null;
  const cdnText = cdn > 0 ? `${formatInteger(cdn)} detrás de una CDN, que no muestra el origen.` : null;

  let value: React.ReactNode;
  let note: React.ReactNode = null;
  if (loading) {
    value = <span className="text-2xl font-bold">…</span>;
  } else if (visible + cdn === 0) {
    value = <span className="font-semibold">Sin medir</span>;
  } else if (visible === 0) {
    value = <span className="font-semibold">Sin dato</span>;
    note = (
      <>
        {cdnText} {at}
      </>
    );
  } else {
    value = <span className="text-2xl font-bold">{num(measuredLocal)}</span>;
    note = (
      <>
        De {formatInteger(visible)} IP con la red a la vista. {cdnText} {at}
      </>
    );
  }

  return (
    <aside aria-labelledby="resumen-datos-titulo">
      <p id="resumen-datos-titulo" className="t-label">
        Los datos de {countryName}
      </p>
      <dl className="mt-3 divide-y divide-rule border-y-2 border-ink text-ink tabular">
        <Row label="Proveedores verificados">
          <span className="text-2xl font-bold">{num(total)}</span>
        </Row>
        <Row
          label={
            <span className="flex flex-wrap items-center gap-2">
              Declaran datacenter en {countryName} <ProvenanceTag kind="declared" />
            </span>
          }
        >
          <span className="text-2xl font-bold">{num(declaredLocal)}</span>
        </Row>
        <Row
          label={
            <span className="flex flex-wrap items-center gap-2">
              Con la IP en una red de {countryName} <ProvenanceTag kind="measured" />
            </span>
          }
          note={note}
        >
          {value}
        </Row>
      </dl>
    </aside>
  );
};

export default CountrySummary;
