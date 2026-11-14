import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ScoreValue from '@/components/hubs/ScoreValue';
import { getProviderLink } from '@/lib/providerLinks';
import { cn } from '@/lib/utils';

/**
 * Top de cada hub por segmento con el patrón de RankingPositions4to10: tabla
 * desde 1024 px y lista debajo, sin columnas escondidas. El orden llega fijo
 * desde segmentHubs (decisión pendiente 3): aquí no se reordena.
 */
export interface HubProvider {
  slug: string;
  name: string;
  logo_url: string | null;
  overall_rating: number | null;
  promo_price: number | null;
  datacenter_location: string | null;
  total_reviews: number | null;
  website: string | null;
}

interface HubTopListProps {
  providers: HubProvider[];
  status: 'loading' | 'ready' | 'error';
}

const PRICE_TEXT = 'En el sitio oficial';

const Rank: React.FC<{ n: number; className?: string }> = ({ n, className }) => (
  <span className={cn('text-xl font-bold tabular', n === 1 ? 'text-brand-ink' : 'text-ink-3', className)}>
    <span className="sr-only">Puesto </span>
    {n}
  </span>
);

const Datacenter: React.FC<{ value: string | null }> = ({ value }) =>
  value ? (
    <span className="inline-flex items-center gap-1.5">
      <span>{value}</span>
      <ProvenanceTag kind="declared" variant="glyph" />
    </span>
  ) : (
    <span>Datacenter: no lo declara</span>
  );

const Actions: React.FC<{ provider: HubProvider; stretch?: boolean }> = ({ provider, stretch }) => {
  const link = getProviderLink(provider.slug, provider.website);
  return (
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
        href={link.href}
        rel={link.rel}
        target="_blank"
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
};

const HubTopList: React.FC<HubTopListProps> = ({ providers, status }) => {
  if (status === 'loading') {
    return (
      <div aria-busy="true" aria-label="Cargando el top del segmento" className="divide-y divide-rule border-y-2 border-ink">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 py-5">
            <div className="h-5 w-6 rounded-sm bg-paper-deep" />
            <div className="h-5 w-1/3 rounded-sm bg-paper-deep" />
            <div className="ml-auto h-5 w-16 rounded-sm bg-paper-deep" />
          </div>
        ))}
      </div>
    );
  }
  if (status === 'error') {
    return (
      <p role="alert" className="rounded-xl border border-rule bg-paper p-4 text-ink-2">
        No pudimos cargar el top de este segmento: la consulta a nuestra base no respondió. Recarga la página en unos
        minutos.
      </p>
    );
  }
  if (providers.length === 0) {
    return (
      <p className="rounded-xl border border-rule bg-paper p-4 text-ink-2">
        Todavía no hay proveedores publicados para este segmento. Mientras tanto, revisa el{' '}
        <Link to="/ranking" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          ranking general
        </Link>
        .
      </p>
    );
  }

  return (
    <>
      {/* Escritorio (desde 1024 px): tabla */}
      <Table className="hidden text-[15px] lg:table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Puesto</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead className="w-48">
              <span className="flex items-center gap-2">
                Nota general <ProvenanceTag kind="editorial" />
              </span>
            </TableHead>
            <TableHead className="w-44">Precio</TableHead>
            <TableHead className="text-right">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((p, i) => (
            <TableRow key={p.slug} className="hover:bg-transparent">
              <TableCell className="relative">
                {i === 0 && <span aria-hidden className="absolute bottom-3 left-0 top-3 w-1 rounded-r bg-brand" />}
                <Rank n={i + 1} className="pl-2" />
              </TableCell>
              <th scope="row" className="px-3 py-3 text-left align-middle font-normal">
                <span className="block font-semibold text-ink">{p.name}</span>
                <span className="t-meta mt-0.5 block">
                  <Datacenter value={p.datacenter_location} />
                </span>
              </th>
              <TableCell>
                <ScoreValue value={p.overall_rating} glyph />
              </TableCell>
              <TableCell className="text-ink-2">{PRICE_TEXT}</TableCell>
              <TableCell>
                <Actions provider={p} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Móvil y tableta: lista con los mismos datos */}
      <ol className="divide-y divide-rule border-y-2 border-ink lg:hidden" aria-label="Top del segmento">
        {providers.map((p, i) => (
          <li key={p.slug} className="relative py-5">
            {i === 0 && <span aria-hidden className="absolute bottom-5 left-0 top-5 w-1 rounded-r bg-brand" />}
            <div className="flex items-baseline gap-3 pl-3">
              <Rank n={i + 1} className="w-6" />
              <h3 className="min-w-0 flex-1 font-semibold text-ink">{p.name}</h3>
              <ScoreValue value={p.overall_rating} glyph />
            </div>
            <dl className="ml-12 mt-3 grid gap-y-2 text-[15px]">
              <div className="flex flex-wrap gap-x-2">
                <dt className="t-meta">Datacenter</dt>
                <dd className="text-ink">
                  {p.datacenter_location ? <Datacenter value={p.datacenter_location} /> : 'No lo declara'}
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="t-meta">Precio</dt>
                <dd className="text-ink">{PRICE_TEXT}</dd>
              </div>
            </dl>
            <div className="ml-12 mt-4">
              <Actions provider={p} stretch />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
};

export default HubTopList;
