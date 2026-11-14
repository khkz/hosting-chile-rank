import React from 'react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { formatScore } from '@/lib/format';
import { priceText, splitName, type PeProvider } from './peTypes';

const yesNo = (v: boolean) => (v ? 'Sí' : 'No');

/**
 * Tabla comparativa de Perú: una sola tinta para notas y puestos, procedencia
 * en los encabezados y lista en móvil y tableta.
 */
const PeComparisonTable: React.FC<{ providers: PeProvider[] }> = ({ providers }) => (
  <>
    <table className="hidden w-full border-collapse text-left text-[15px] lg:table">
      <caption className="sr-only">Comparación de los cinco proveedores del ranking de Perú</caption>
      <thead>
        <tr className="border-b-2 border-ink text-[13px] text-ink-2">
          <th scope="col" className="w-16 py-2.5 pr-3 font-semibold">Puesto</th>
          <th scope="col" className="py-2.5 pr-4 font-semibold">Proveedor</th>
          <th scope="col" className="py-2.5 pr-4 text-right font-semibold">
            <span className="inline-flex items-center gap-1.5">
              Nota <ProvenanceTag kind="editorial" variant="glyph" />
            </span>
          </th>
          <th scope="col" className="py-2.5 pr-4 font-semibold">
            <span className="inline-flex items-center gap-1.5">
              Precio <ProvenanceTag kind="declared" variant="glyph" />
            </span>
          </th>
          <th scope="col" className="py-2.5 pr-4 font-semibold">
            <span className="inline-flex items-center gap-1.5">
              Datacenter <ProvenanceTag kind="declared" variant="glyph" />
            </span>
          </th>
          <th scope="col" className="py-2.5 pr-4 font-semibold">Factura peruana</th>
          <th scope="col" className="py-2.5 font-semibold">LiteSpeed</th>
        </tr>
      </thead>
      <tbody>
        {providers.map((p, i) => {
          const { title, subtitle } = splitName(p.name);
          return (
            <tr key={p.name} className="border-b border-rule align-top">
              <td className="py-3.5 pr-3 text-xl font-bold text-ink-3 tabular">{i + 1}</td>
              <th scope="row" className="py-3.5 pr-4 font-semibold text-ink">
                {title}
                {subtitle && <span className="mt-0.5 block text-sm font-normal text-ink-2">{subtitle}</span>}
              </th>
              <td className="py-3.5 pr-4 text-right text-lg font-bold text-ink tabular">{formatScore(p.rating)}</td>
              <td className="py-3.5 pr-4 text-ink tabular">{priceText(p.price)}</td>
              <td className="py-3.5 pr-4 text-sm text-ink-2">{p.datacenter}</td>
              <td className="py-3.5 pr-4 text-ink">{yesNo(p.facturaLocal)}</td>
              <td className="py-3.5 text-ink">{yesNo(p.litespeed)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>

    <ol className="divide-y divide-rule border-y-2 border-ink lg:hidden">
      {providers.map((p, i) => {
        const { title, subtitle } = splitName(p.name);
        return (
          <li key={p.name} className="py-4">
            <div className="flex items-baseline gap-3">
              <span className="w-7 shrink-0 text-xl font-bold text-ink-3 tabular">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{title}</p>
                {subtitle && <p className="text-sm text-ink-2">{subtitle}</p>}
              </div>
              <span className="text-lg font-bold text-ink tabular">
                {formatScore(p.rating)}
                <span className="sr-only"> de 10 (nota editorial)</span>
              </span>
            </div>
            <dl className="ml-10 mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="col-span-2">
                <dt className="t-meta">Precio (declarado)</dt>
                <dd className="text-ink tabular">{priceText(p.price)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="t-meta">Datacenter (declarado)</dt>
                <dd className="text-ink-2">{p.datacenter}</dd>
              </div>
              <div>
                <dt className="t-meta">Factura peruana</dt>
                <dd className="text-ink">{yesNo(p.facturaLocal)}</dd>
              </div>
              <div>
                <dt className="t-meta">LiteSpeed</dt>
                <dd className="text-ink">{yesNo(p.litespeed)}</dd>
              </div>
            </dl>
          </li>
        );
      })}
    </ol>
  </>
);

export default PeComparisonTable;
