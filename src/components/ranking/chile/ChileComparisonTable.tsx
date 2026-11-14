import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Section from '@/components/system/Section';
import { ProvenanceTag } from '@/components/data/Provenance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ScoreValue from '@/components/hubs/ScoreValue';
import { formatDataDate, formatInteger, isoDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ComplaintInfo } from '@/services/hostingComplaints';
import type { ChileGuideProvider } from './chileGuideData';

/**
 * Tabla principal de /mejor-hosting-chile-2026 con el patrón de
 * RankingPositions4to10: tabla desde 1024 px y lista debajo, sin columnas
 * escondidas. Nota y velocidad son editoriales; los reclamos son el conteo
 * público de Reclamos.cl; los precios van en una sola nota.
 */
interface ChileComparisonTableProps {
  providers: ChileGuideProvider[];
  /** Fecha real de revisión de las notas (AAAA-MM-DD). */
  reviewedAt: string;
  year: number;
}

const hostOf = (url: string): string | null => {
  try {
    return new URL(url).host.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
};

/**
 * Integridad: el conteo se muestra solo si la búsqueda de Reclamos.cl es la del
 * dominio de esa fila. Si el registro apunta a otra marca, decimos «sin dato».
 */
const complaintsFor = (p: ChileGuideProvider): ComplaintInfo | null => {
  const c = p.complaints;
  if (!c?.reclamosUrl) return null;
  try {
    const concept = new URL(c.reclamosUrl).searchParams.get('concepto');
    return concept && concept.toLowerCase() === hostOf(p.url) ? c : null;
  } catch {
    return null;
  }
};

const linkClass = 'font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';
const SITE_REL = 'nofollow sponsored noopener noreferrer';

const Complaints: React.FC<{ provider: ChileGuideProvider }> = ({ provider }) => {
  const c = complaintsFor(provider);
  if (!c) return <span className="text-ink-3">Sin dato</span>;
  return (
    <span className="flex flex-col gap-0.5">
      <span className="font-semibold tabular text-ink">
        {formatInteger(c.count)} {c.count === 1 ? 'reclamo' : 'reclamos'}
      </span>
      <a href={c.reclamosUrl} target="_blank" rel="nofollow" className={cn(linkClass, 'text-sm')}>
        Ver en Reclamos.cl<span className="sr-only"> ({provider.name})</span>
      </a>
    </span>
  );
};

const Speed: React.FC<{ grade: string }> = ({ grade }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="font-semibold text-ink">{grade}</span>
    <ProvenanceTag kind="editorial" variant="glyph" />
  </span>
);

const Datacenter: React.FC<{ value: string }> = ({ value }) => (
  <span className="inline-flex items-center gap-1.5">
    {value}
    <ProvenanceTag kind="declared" variant="glyph" />
  </span>
);

const Actions: React.FC<{ provider: ChileGuideProvider; stretch?: boolean }> = ({ provider, stretch }) => (
  <div className={cn('flex gap-2', stretch ? 'w-full' : 'justify-end')}>
    <Link
      to={`/catalogo/${provider.slug}`}
      className={cn(
        'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-ink/25 px-3 text-sm font-semibold text-ink hover:border-ink',
        stretch && 'flex-1',
      )}
    >
      Ver ficha<span className="sr-only"> de {provider.name}</span>
    </Link>
    <a
      href={provider.url}
      target="_blank"
      rel={SITE_REL}
      className={cn(
        'inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-ink px-3 text-sm font-semibold text-white hover:bg-ink-soft',
        stretch && 'flex-1',
      )}
    >
      Ir al sitio<span className="sr-only"> de {provider.name}</span>
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </a>
  </div>
);

const Rank: React.FC<{ n: number; className?: string }> = ({ n, className }) => (
  <span className={cn('text-xl font-bold tabular', n === 1 ? 'text-brand-ink' : 'text-ink-3', className)}>
    <span className="sr-only">Puesto </span>
    {n}
  </span>
);

const ChileComparisonTable: React.FC<ChileComparisonTableProps> = ({ providers, reviewedAt, year }) => (
  <Section
    id="comparativa"
    title={`Comparativa de los 5 mejores hosting de Chile en ${year}`}
    lead={
      <>
        Notas y velocidad revisadas el{' '}
        <time dateTime={isoDate(reviewedAt)} className="font-semibold text-ink">
          {formatDataDate(reviewedAt)}
        </time>
        . Cada fila enlaza a la ficha del proveedor.
      </>
    }
  >
    {/* Escritorio (desde 1024 px): tabla */}
    <Table className="hidden text-[15px] lg:table">
      <caption className="sr-only">
        Comparativa de cinco proveedores de hosting en Chile: nota, velocidad, reclamos y datacenter
      </caption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Puesto</TableHead>
          <TableHead>Proveedor</TableHead>
          <TableHead className="w-36">
            <span className="flex items-center gap-2">
              Nota <ProvenanceTag kind="editorial" />
            </span>
          </TableHead>
          <TableHead className="w-40">
            <span className="flex items-center gap-2">
              Velocidad <ProvenanceTag kind="editorial" />
            </span>
          </TableHead>
          <TableHead className="whitespace-nowrap">Reclamos en Reclamos.cl</TableHead>
          <TableHead className="text-right">
            <span className="sr-only">Acciones</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {providers.map((provider, index) => (
          <TableRow key={provider.slug} className="hover:bg-transparent">
            <TableCell className="relative">
              {index === 0 && <span aria-hidden className="absolute bottom-3 left-0 top-3 w-1 rounded-r bg-brand" />}
              <Rank n={index + 1} className="pl-2" />
            </TableCell>
            <th scope="row" className="px-3 py-3 text-left align-middle font-normal">
              <span className="block font-semibold text-ink">{provider.name}</span>
              <span className="t-meta mt-0.5 block">
                <Datacenter value={provider.datacenter} />
              </span>
            </th>
            <TableCell>
              <ScoreValue value={provider.rating} glyph />
            </TableCell>
            <TableCell>
              <Speed grade={provider.velocidad} />
            </TableCell>
            <TableCell>
              <Complaints provider={provider} />
            </TableCell>
            <TableCell>
              <Actions provider={provider} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    {/* Móvil y tableta: lista, con todos los datos de la tabla */}
    <ol className="divide-y divide-rule border-y-2 border-ink lg:hidden" aria-label="Comparativa de cinco proveedores">
      {providers.map((provider, index) => (
        <li key={provider.slug} className="relative py-5">
          {index === 0 && <span aria-hidden className="absolute bottom-5 left-0 top-5 w-1 rounded-r bg-brand" />}
          <div className="flex items-baseline gap-3 pl-3">
            <Rank n={index + 1} className="w-6" />
            <h3 className="min-w-0 flex-1 font-semibold text-ink">{provider.name}</h3>
            <ScoreValue value={provider.rating} glyph />
          </div>
          <dl className="ml-12 mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-[15px]">
            <div>
              <dt className="t-meta">Velocidad</dt>
              <dd className="mt-0.5">
                <Speed grade={provider.velocidad} />
              </dd>
            </div>
            <div>
              <dt className="t-meta">Reclamos</dt>
              <dd className="mt-0.5">
                <Complaints provider={provider} />
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="t-meta">Datacenter</dt>
              <dd className="mt-0.5 text-ink">
                <Datacenter value={provider.datacenter} />
              </dd>
            </div>
          </dl>
          <div className="ml-12 mt-4">
            <Actions provider={provider} stretch />
          </div>
        </li>
      ))}
    </ol>

    <div className="t-small mt-6 max-w-[78ch] space-y-2 text-ink-2">
      <p>
        <strong className="font-semibold text-ink">Nota y velocidad:</strong> criterio editorial. La velocidad va en
        letras (A+ es la más alta), a partir de pruebas con{' '}
        <a href="https://gtmetrix.com" target="_blank" rel="nofollow" className={linkClass}>
          GTmetrix
        </a>
        ; esta tabla no publica milisegundos.
      </p>
      <p>
        <strong className="font-semibold text-ink">Reclamos:</strong> conteo público en{' '}
        <a href="https://reclamos.cl" target="_blank" rel="nofollow" className={linkClass}>
          Reclamos.cl
        </a>{' '}
        (últimos periodos disponibles). Si el registro no corresponde al dominio del proveedor, ponemos «sin dato».
      </p>
      <p>
        <strong className="font-semibold text-ink">Precios:</strong> estamos reverificando el catálogo, así que no
        publicamos cifras; consulta el valor vigente en el sitio oficial de cada proveedor. EcoHosting y HostGator usan
        una promoción el primer periodo y suben el valor al renovar; HostingPlus mantiene el mismo valor en la
        renovación de su plan de 36 meses.
      </p>
    </div>
  </Section>
);

export default ChileComparisonTable;
