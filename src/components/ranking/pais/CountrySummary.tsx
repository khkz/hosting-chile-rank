import React from 'react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { formatInteger, formatShortDate, isoDate } from '@/lib/format';
import { ASN_CHECKED_AT } from '@/lib/dcTier';

interface CountrySummaryProps {
  countryName: string;
  /** undefined mientras carga: se muestra «…» para que la cabecera no salte. */
  total?: number;
  declaredLocal?: number;
  /** Proveedores con la IP en una red (ASN) del país, entre los que tienen IP revisada. */
  measuredLocal?: number;
  /** Proveedores con IP revisada. 0 = no medimos ninguno: «Sin medir», nunca «0». */
  measuredTotal?: number;
}

const Row: React.FC<{ label: React.ReactNode; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-baseline justify-between gap-4 py-3">
    <dt className="t-small text-ink-2">{label}</dt>
    <dd className="shrink-0 text-right">{children}</dd>
  </div>
);

const num = (n?: number) => (n == null ? '…' : formatInteger(n));

/**
 * Resumen de la edición con cifras leídas de la base (respaldo de la imagen
 * editorial en la cabecera). Cada fila dice de dónde sale el dato.
 */
const CountrySummary: React.FC<CountrySummaryProps> = ({ countryName, total, declaredLocal, measuredLocal, measuredTotal }) => (
  <aside aria-label={`Resumen de los datos de ${countryName}`} className="lg:pt-2">
    <dl className="divide-y divide-rule border-y-2 border-ink text-ink tabular">
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
      >
        {measuredTotal === 0 ? (
          <span className="font-semibold">Sin medir</span>
        ) : (
          <>
            <span className="text-2xl font-bold">{num(measuredLocal)}</span>
            {measuredTotal != null && (
              <span className="t-meta block">
                de {formatInteger(measuredTotal)} IP revisadas
                {ASN_CHECKED_AT && (
                  <>
                    {' '}al <time dateTime={isoDate(ASN_CHECKED_AT)}>{formatShortDate(ASN_CHECKED_AT)}</time>
                  </>
                )}
              </span>
            )}
          </>
        )}
      </Row>
    </dl>
  </aside>
);

export default CountrySummary;
