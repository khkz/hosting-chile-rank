import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ProvenanceTag, type Provenance } from '@/components/data/Provenance';
import { formatShortDate, isoDate } from '@/lib/format';

export interface CompareColumn {
  key: string;
  name: string;
  /** Enlace interno a la ficha del proveedor. */
  href?: string;
}

export interface CompareCell {
  /** Valor visible. null, undefined o '' muestran el texto de vacío de la fila. */
  value?: React.ReactNode;
  /** Valor comparable para marcar «Difieren». null o undefined = sin dato (no compara). */
  raw?: string | number | boolean | null;
  /** Fecha del dato (medición o actualización), AAAA-MM-DD o ISO. */
  date?: string | null;
}

export interface CompareRow {
  id: string;
  label: string;
  /** Procedencia del dato de toda la fila. */
  kind?: Provenance;
  /** Aclaración breve bajo el rótulo (fuente, unidad, limitación). */
  note?: React.ReactNode;
  /** Texto para celdas sin dato. Por defecto «Sin dato». */
  empty?: string;
  cells: CompareCell[];
}

const isEmpty = (v: React.ReactNode) => v === null || v === undefined || v === '';

/** Difieren solo si todas las celdas tienen dato comparable y no son todas iguales. */
const rowDiffers = (row: CompareRow): boolean => {
  const raws = row.cells.map((c) => c.raw);
  if (raws.length < 2 || raws.some((r) => r === null || r === undefined || r === '')) return false;
  const norm = raws.map((r) => (typeof r === 'string' ? r.trim().toLowerCase() : r));
  return new Set(norm).size > 1;
};

const DiffBadge = () => (
  <Badge variant="outline" className="border-ink/40 text-ink">
    Difieren
  </Badge>
);

const RowLabel: React.FC<{ row: CompareRow; differs: boolean }> = ({ row, differs }) => (
  <>
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="font-semibold text-ink">{row.label}</span>
      {row.kind && <ProvenanceTag kind={row.kind} variant="glyph" />}
      {differs && <DiffBadge />}
    </div>
    {row.note && <p className="t-meta mt-0.5 font-normal">{row.note}</p>}
  </>
);

const CellValue: React.FC<{ cell: CompareCell; empty?: string }> = ({ cell, empty }) => (
  <>
    {isEmpty(cell.value) ? (
      <span className="text-ink-3">{empty ?? 'Sin dato'}</span>
    ) : (
      <span className="tabular text-ink">{cell.value}</span>
    )}
    {cell.date && (
      <time dateTime={isoDate(cell.date)} className="t-meta mt-0.5 block">
        {formatShortDate(cell.date)}
      </time>
    )}
  </>
);

const ColumnName: React.FC<{ col: CompareColumn; className?: string }> = ({ col, className }) =>
  col.href ? (
    <Link to={col.href} className={cn('text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink', className)}>
      {col.name}
    </Link>
  ) : (
    <span className={cn('text-ink', className)}>{col.name}</span>
  );

interface CompareTableProps {
  columns: CompareColumn[];
  rows: CompareRow[];
  /** Título accesible de la tabla. */
  caption: string;
  /** Encabezado de la columna de rótulos. */
  labelHeader?: string;
  className?: string;
}

/**
 * Comparación lado a lado. Escritorio (sm+): tabla con una fila por dato.
 * Móvil: el rótulo va como fila de grupo y los valores, lado a lado al 50 %,
 * cada uno con el nombre del proveedor. Las filas donde los datos difieren
 * llevan fondo papel, regla izquierda y la etiqueta «Difieren» (no solo color).
 */
const CompareTable: React.FC<CompareTableProps> = ({ columns, rows, caption, labelHeader = 'Dato', className }) => {
  const labelWidth = columns.length <= 2 ? '34%' : columns.length === 3 ? '28%' : '22%';
  return (
    <div className={cn('min-w-0', className)}>
      <table className="hidden w-full table-fixed border-collapse text-left text-[15px] sm:table">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col style={{ width: labelWidth }} />
          {columns.map((c) => (
            <col key={c.key} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b-2 border-ink">
            <th scope="col" className="py-3 pr-4 align-bottom text-[13px] font-semibold text-ink-2">
              {labelHeader}
            </th>
            {columns.map((c) => (
              <th key={c.key} scope="col" className="py-3 pr-4 align-bottom text-base font-bold">
                <ColumnName col={c} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const differs = rowDiffers(row);
            return (
              <tr key={row.id} className={cn('border-b border-rule align-top', differs && 'bg-paper')}>
                <th
                  scope="row"
                  className={cn('py-3 pr-4 text-left font-normal', differs ? 'border-l-[3px] border-l-ink pl-3' : 'pl-0')}
                >
                  <RowLabel row={row} differs={differs} />
                </th>
                {row.cells.map((cell, i) => (
                  <td key={columns[i]?.key ?? i} className="break-words py-3 pr-4">
                    <CellValue cell={cell} empty={row.empty} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <dl className="border-t-2 border-ink sm:hidden">
        {rows.map((row) => {
          const differs = rowDiffers(row);
          return (
            <div
              key={row.id}
              className={cn('border-b border-rule py-3', differs && 'border-l-[3px] border-l-ink bg-paper pl-3 pr-2')}
            >
              <dt className="text-[15px]">
                <RowLabel row={row} differs={differs} />
              </dt>
              <dd className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3">
                {row.cells.map((cell, i) => (
                  <div key={columns[i]?.key ?? i} className="min-w-0 break-words text-base">
                    <span className="t-meta block">{columns[i]?.name}</span>
                    <CellValue cell={cell} empty={row.empty} />
                  </div>
                ))}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

export default CompareTable;
