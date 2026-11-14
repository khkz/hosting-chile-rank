import React from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RICH } from './GuideBlocks';

export interface GuideTableRow {
  key: string;
  /** Una celda por columna; la primera es el nombre de la fila. */
  cells: React.ReactNode[];
}

interface GuideTableProps {
  /** Descripción de la tabla para lectores de pantalla. */
  caption: string;
  columns: string[];
  rows: GuideTableRow[];
  className?: string;
}

/**
 * Tabla de guía: lista apilada en móvil (sin desplazamiento lateral) y tabla
 * con regla de tinta desde 768 px.
 */
const GuideTable: React.FC<GuideTableProps> = ({ caption, columns, rows, className }) => (
  <div className={cn('not-prose my-8', className)}>
    <ul aria-label={caption} className="divide-y divide-rule border-y border-rule md:hidden">
      {rows.map((r) => (
        <li key={r.key} className="py-4">
          <p className="font-semibold text-ink">{r.cells[0]}</p>
          <dl className="mt-2 space-y-2">
            {columns.slice(1).map((col, i) => (
              <div key={col}>
                <dt className="t-meta">{col}</dt>
                <dd className={cn('t-body', RICH)}>{r.cells[i + 1]}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
    <div className="hidden md:block">
      <Table>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c}>{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.key}>
              {r.cells.map((cell, i) => (
                <TableCell key={i} className={cn('align-top', i === 0 ? 'font-semibold' : RICH)}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default GuideTable;
