import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Server, Star } from 'lucide-react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { Button } from '@/components/ui/button';
import SiteLink from '@/components/ficha/SiteLink';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { formatScore } from '@/lib/format';
import { track } from '@/lib/track';

export interface CatalogRowData {
  slug: string;
  name: string;
  /** Nota editorial; null o 0 = «Sin nota editorial». */
  rating: number | null;
  datacenter: string | null;
  group: string | null;
  yearFounded: number | null;
  website: string | null;
  reviews?: { avg: number; count: number } | null;
}

interface CatalogRowProps {
  row: CatalogRowData;
  /** Línea extra bajo el nombre (el directorio agrega razón social y contacto). */
  details?: React.ReactNode;
  /** Origen del clic, para la analítica. */
  location: string;
}

// Mismas columnas en la cabecera y en cada fila (desde 1024 px; bajo eso, fila apilada).
export const CATALOG_GRID =
  'lg:grid-cols-[minmax(0,2.3fr)_5.5rem_minmax(0,2.2fr)_minmax(0,1.4fr)_6rem_12.5rem] lg:[grid-template-areas:"name_nota_dc_group_year_actions"]';

/**
 * Fila densa del catálogo y del directorio. Bajo 1024 px toda la fila lleva a
 * la ficha y el sitio del proveedor queda como enlace secundario; desde 1024 px,
 * columnas alineadas con «Ver ficha» como acción de la fila.
 */
const CatalogRow: React.FC<CatalogRowProps> = ({ row, details, location }) => {
  const hasRating = row.rating != null && Number(row.rating) > 0;
  const href = `/catalogo/${row.slug}`;
  const onOpen = () => track('click_ver_ficha', { slug: row.slug, location });

  return (
    <li
      className={`relative grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 py-4 [grid-template-areas:"name_nota"_"dc_site"_"meta_meta"] lg:items-center lg:gap-x-5 lg:py-3 ${CATALOG_GRID}`}
    >
      <div className="min-w-0 [grid-area:name]">
        <h3 className="text-base font-semibold leading-snug text-ink">
          <Link
            to={href}
            onClick={onOpen}
            className="underline-offset-4 after:absolute after:inset-0 hover:underline lg:after:hidden"
          >
            {row.name}
          </Link>
        </h3>
        {row.reviews && row.reviews.count > 0 && (
          <p className="mt-0.5 flex items-center gap-1 t-meta">
            <Star className="h-3.5 w-3.5 fill-ink-3 text-ink-3" aria-hidden />
            <span className="tabular">{formatScore(row.reviews.avg)} de 5</span> en {row.reviews.count}{' '}
            {row.reviews.count === 1 ? 'reseña' : 'reseñas'}
          </p>
        )}
        {details}
      </div>

      <p className="flex items-center justify-end gap-1.5 [grid-area:nota] lg:justify-start">
        <span className="sr-only">Nota editorial: </span>
        {hasRating ? (
          <>
            <span className="tabular text-lg font-bold text-ink">{formatScore(row.rating)}</span>
            <ProvenanceTag kind="editorial" variant="glyph" />
          </>
        ) : (
          <span className="t-meta">Sin nota editorial</span>
        )}
        <ChevronRight className="h-4 w-4 shrink-0 text-ink-3 lg:hidden" aria-hidden />
      </p>

      <p className="flex min-w-0 items-center gap-1.5 t-small text-ink-2 [grid-area:dc] lg:block">
        <Server className="h-3.5 w-3.5 shrink-0 text-ink-3 lg:hidden" aria-hidden />
        <span className="sr-only">Datacenter: </span>
        {row.datacenter?.trim() ? (
          <>
            <span className="min-w-0 truncate lg:inline lg:whitespace-normal">{row.datacenter}</span>
            <ProvenanceTag kind="declared" variant="glyph" className="lg:ml-1.5 lg:align-middle" />
          </>
        ) : (
          <span className="text-ink-3">No lo declara</span>
        )}
      </p>

      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5 t-meta [grid-area:meta] lg:contents">
        <p className="min-w-0 lg:t-small lg:text-ink-2 lg:[grid-area:group]">
          {row.group ? (
            formatCorporateGroup(row.group)
          ) : (
            <span className="hidden text-ink-3 lg:inline">
              <span className="sr-only">Grupo: </span>sin dato
            </span>
          )}
        </p>
        <p className="lg:t-small lg:text-ink-2 lg:[grid-area:year]">
          {row.yearFounded ? (
            <>
              <span className="lg:sr-only">Opera desde </span>
              <span className="tabular">{row.yearFounded}</span>
            </>
          ) : (
            <span className="hidden text-ink-3 lg:inline">
              <span className="sr-only">Opera desde: </span>sin dato
            </span>
          )}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-end gap-4 [grid-area:site] lg:[grid-area:actions]">
        <Button asChild variant="outline" size="sm" className="hidden h-10 lg:inline-flex">
          <Link to={href} onClick={onOpen}>
            Ver ficha<span className="sr-only"> de {row.name}</span>
          </Link>
        </Button>
        <SiteLink
          slug={row.slug}
          website={row.website}
          name={row.name}
          location={location}
          variant="link"
          short
          className="-my-3 min-h-[44px] lg:my-0 lg:min-h-[40px]"
        />
      </div>
    </li>
  );
};

export default CatalogRow;
