import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDataDate, formatInteger, isoDate } from '@/lib/format';

/**
 * Rótulos del PDF enlazado (/docs/investigacion-hosting-chile-2026-final.pdf),
 * verificados con pdfinfo y pdftotext el 13-11-2026: 23 páginas; portada
 * «Version 2.0» y «fecha de cálculo: 3 de agosto de 2026»; «Universo: 14
 * proveedores»; fuentes en la sección 12. Si se reemplaza el archivo, hay que
 * volver a verificarlos. Son distintos de la versión y la fecha de esta página.
 */
export const PDF_INFO = {
  version: '2.0',
  date: '2026-08-03',
  pages: 23,
  providers: 14,
  sourcesSection: 12,
} as const;

/** Texto corto para enlaces al PDF: «versión 2.0, 23 páginas». */
export const pdfShortLabel = `versión ${PDF_INFO.version}, ${formatInteger(PDF_INFO.pages)} páginas`;

interface Props {
  url: string;
  /** Proveedores que resume esta página (para aclarar la diferencia con el PDF). */
  pageProviders: number;
}

/** Ficha del PDF descargable: qué versión es, de cuándo y qué cubre. */
const EstudioPdf: React.FC<Props> = ({ url, pageProviders }) => (
  <section aria-labelledby="pdf-titulo" className="rounded-xl border border-rule p-4">
    <h2 id="pdf-titulo" className="text-base font-semibold text-ink">
      Informe en PDF
    </h2>
    <dl className="t-small mt-3 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1.5">
      <dt className="t-meta">Versión</dt>
      <dd className="tabular font-semibold text-ink">{PDF_INFO.version}</dd>
      <dt className="t-meta">Calculado el</dt>
      <dd className="font-semibold text-ink">
        <time dateTime={isoDate(PDF_INFO.date)}>{formatDataDate(PDF_INFO.date)}</time>
      </dd>
      <dt className="t-meta">Páginas</dt>
      <dd className="tabular font-semibold text-ink">{formatInteger(PDF_INFO.pages)}</dd>
      <dt className="t-meta">Proveedores</dt>
      <dd className="tabular font-semibold text-ink">{formatInteger(PDF_INFO.providers)}</dd>
    </dl>
    <p className="t-meta mt-3">
      Es otra edición: esta página resume {formatInteger(pageProviders)} proveedores y el PDF evalúa{' '}
      {formatInteger(PDF_INFO.providers)}.
    </p>
    <Button asChild variant="brand" className="mt-4 w-full">
      <a href={url} target="_blank" rel="noopener noreferrer" download>
        <Download aria-hidden />
        Descargar el PDF
      </a>
    </Button>
  </section>
);

export default EstudioPdf;
