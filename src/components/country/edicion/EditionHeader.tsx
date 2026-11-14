import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/system/PageHeader';
import EditorialImage, { isEmptyEditorial } from '@/components/media/EditorialImage';
import Flag from '@/components/data/Flag';
import { Button } from '@/components/ui/button';
import { formatInteger, formatShortDate, isoDate } from '@/lib/format';
import type { EditorialImageKey } from '@/lib/editorialImages';
import type { CountryCode } from '@/lib/countries';
import SummaryCard, { type SummaryItem } from './SummaryCard';
import { editionLead, type ComSlug } from './editionVoice';

const IMAGE: Record<ComSlug, EditorialImageKey> = {
  pe: 'pe-edition',
  mx: 'mx-edition',
  co: 'co-edition',
  ar: 'ar-edition',
};

interface EditionHeaderProps {
  code: CountryCode;
  slug: ComSlug;
  name: string;
  /** Ruta del ranking de la edición. */
  rankingTo: string;
  loading: boolean;
  total: number | null;
  localDc: number | null;
  /** updated_at más reciente de una ficha del país. */
  latestIso: string | null;
}

/**
 * Cabecera de la portada de cada edición: bandera, H1, bajada con la voz del
 * país, acciones y el resumen en cifras. Sin imagen publicada, el resumen
 * ocupa la columna derecha; con imagen, pasa a una franja bajo la cabecera.
 */
const EditionHeader: React.FC<EditionHeaderProps> = ({
  code,
  slug,
  name,
  rankingTo,
  loading,
  total,
  localDc,
  latestIso,
}) => {
  const pending = loading ? '…' : 'sin dato';
  const items: SummaryItem[] = [
    {
      label: 'Proveedores verificados',
      value: total != null ? formatInteger(total) : pending,
      emphasis: 'figure',
    },
    {
      label: 'Datacenter en el país',
      kind: 'declared',
      value: localDc != null ? formatInteger(localDc) : pending,
      emphasis: 'figure',
    },
    {
      label: 'Última edición',
      value: latestIso ? <time dateTime={isoDate(latestIso)}>{formatShortDate(latestIso)}</time> : pending,
      note: `La ficha más reciente de ${name}`,
    },
  ];
  const summaryLabel = `${name} en cifras`;
  const image = (
    <EditorialImage name={IMAGE[slug]} className="aspect-[16/9]" sizes="(min-width: 1024px) 45vw, 100vw" priority />
  );
  const hasImage = !isEmptyEditorial(image);

  return (
    <>
      <PageHeader
        size="display"
        breadcrumbs={
          <p className="t-label flex items-center gap-2">
            <Flag code={code} size={22} />
            Edición {name}
          </p>
        }
        title={`Hosting en ${name}`}
        lead={editionLead(slug, name)}
        actions={
          <>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to={rankingTo}>Ver el ranking de {name}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to={`/${slug}/hosting-con-datacenter-local`}>Con datacenter en {name}</Link>
            </Button>
          </>
        }
        meta={
          <>
            <a href="#como-ordenamos" className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              Cómo ordenamos este directorio
            </a>
            <a
              href={`/data/proveedores-${slug}.json`}
              className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              Datos abiertos de {name} (JSON)
            </a>
          </>
        }
        aside={
          <EditorialImage
            name={IMAGE[slug]}
            className="aspect-[16/9]"
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
            fallback={<SummaryCard label={summaryLabel} items={items} className="lg:ml-auto lg:max-w-[26rem]" />}
          />
        }
      />
      {hasImage && (
        <div className="border-b border-rule bg-white">
          <div className="container py-6 md:py-8">
            <SummaryCard label={summaryLabel} items={items} layout="strip" />
          </div>
        </div>
      )}
    </>
  );
};

export default EditionHeader;
