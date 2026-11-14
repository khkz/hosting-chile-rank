import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatInteger, formatScore } from '@/lib/format';

export interface ReputationRow {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  avg: number | null;
  count: number;
}

const reviewsLabel = (n: number) => `${formatInteger(n)} reseña${n === 1 ? '' : 's'} verificada${n === 1 ? '' : 's'}`;
const trustpilotUrl = (name: string) => `https://www.trustpilot.com/search?query=${encodeURIComponent(name)}`;

const Rating: React.FC<{ row: ReputationRow }> = ({ row }) =>
  row.count > 0 && row.avg != null ? (
    <span className="tabular">
      <span className="font-semibold text-ink">{formatScore(row.avg)}</span>
      <span className="text-ink-2"> de 5</span>
      <span className="t-meta block">{reviewsLabel(row.count)}</span>
    </span>
  ) : (
    <span className="t-small text-ink-3">Aún sin reseñas verificadas</span>
  );

const Actions: React.FC<{ row: ReputationRow; countrySlug: string; reviewLabel: string; className?: string }> = ({
  row,
  countrySlug,
  reviewLabel,
  className = '',
}) => (
  <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
    {row.count === 0 && (
      <Button asChild variant="outline" size="sm" className="h-11 md:h-9">
        <Link to={`/${countrySlug}/${row.slug}#dejar-resena`}>
          {reviewLabel}<span className="sr-only"> de {row.name}</span>
        </Link>
      </Button>
    )}
    <a
      href={trustpilotUrl(row.name)}
      target="_blank"
      rel="noopener nofollow"
      className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink md:min-h-0"
    >
      Buscar en Trustpilot<span className="sr-only"> a {row.name}</span>
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </a>
  </div>
);

/**
 * Reputación por proveedor: tabla del sistema desde 768 px y lista apilada en
 * móvil. Las reseñas son de usuarios y pasan por moderación; no son una
 * medición nuestra ni un dato declarado por el proveedor.
 */
const ReputationList: React.FC<{ rows: ReputationRow[]; countrySlug: string; reviewLabel: string }> = ({
  rows,
  countrySlug,
  reviewLabel,
}) => (
  <>
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-0">Proveedor</TableHead>
            <TableHead>Reseñas de usuarios (moderadas)</TableHead>
            <TableHead className="pr-0">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="pl-0">
                <Link
                  to={`/${countrySlug}/${r.slug}`}
                  className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                >
                  {r.name}
                </Link>
              </TableCell>
              <TableCell>
                <Rating row={r} />
              </TableCell>
              <TableCell className="pr-0">
                <Actions row={r} countrySlug={countrySlug} reviewLabel={reviewLabel} className="justify-end" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <ul className="divide-y divide-rule border-y-2 border-ink md:hidden">
      {rows.map((r) => (
        <li key={r.id} className="py-4">
          <Link
            to={`/${countrySlug}/${r.slug}`}
            className="inline-flex min-h-[44px] items-center text-lg font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            {r.name}
          </Link>
          <p className="mt-1">
            <Rating row={r} />
          </p>
          <Actions row={r} countrySlug={countrySlug} reviewLabel={reviewLabel} className="mt-2" />
        </li>
      ))}
    </ul>
  </>
);

export default ReputationList;
