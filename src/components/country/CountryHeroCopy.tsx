import React from 'react';
import { Check } from 'lucide-react';
import { COUNTRY_CONTENT, type CountryCopy } from '@/data/countryContent';
import PageHeader from '@/components/system/PageHeader';
import EditorialImage from '@/components/media/EditorialImage';
import Flag from '@/components/data/Flag';
import { Button } from '@/components/ui/button';
import FaqList from '@/components/ranking/pais/FaqList';
import { formatDataDate, formatInteger, isoDate } from '@/lib/format';
import type { CountryCode } from '@/lib/countries';
import type { EditorialImageKey } from '@/lib/editorialImages';

type Slug = 'pe' | 'mx' | 'co' | 'ar';

const EDITION: Record<Slug, { code: CountryCode; name: string; image: EditorialImageKey }> = {
  pe: { code: 'PE', name: 'Perú', image: 'pe-edition' },
  mx: { code: 'MX', name: 'México', image: 'mx-edition' },
  co: { code: 'CO', name: 'Colombia', image: 'co-edition' },
  ar: { code: 'AR', name: 'Argentina', image: 'ar-edition' },
};

type Props = {
  slug: Slug;
  /** Migas (SEOBreadcrumbs o CountryCrumbs). */
  breadcrumbs?: React.ReactNode;
  /** Fecha real de los datos (ISO desde la base). Sin ella no se muestra fecha. */
  updatedIso?: string | null;
  /** Compatibilidad: fecha ya formateada. Se prefiere `updatedIso`. */
  updated?: string | null;
  /** Proveedores verificados, contados en la base. */
  providerCount?: number | null;
  /** Ancla del ranking en la página («#tabla», «#ranking»). */
  rankingHref?: string;
  /** Ancla de la metodología y su rótulo. */
  methodHref?: string;
  methodLabel?: string;
  /** Metadatos extra (procedencia de las notas, fecha de precios). */
  extraMeta?: React.ReactNode;
  /** Qué mostrar mientras la imagen editorial no esté publicada. */
  imageFallback?: React.ReactNode;
};

/**
 * Cabecera de los rankings por país con el sistema: migas, bandera SVG y
 * edición, H1 (texto de countryContent, sin cambios), bajada, acción principal
 * y fecha real de los datos.
 */
export const CountryHeroCopy: React.FC<Props> = ({
  slug,
  breadcrumbs,
  updatedIso,
  updated,
  providerCount,
  rankingHref = '#tabla',
  methodHref = '#metodologia',
  methodLabel = 'Cómo ordenamos',
  extraMeta,
  imageFallback,
}) => {
  const c: CountryCopy = COUNTRY_CONTENT[slug];
  if (!c) return null;
  const ed = EDITION[slug];
  const dateText = updatedIso ? formatDataDate(updatedIso) : updated ?? null;
  return (
    <PageHeader
      breadcrumbs={
        <>
          {breadcrumbs}
          <p className={`t-label flex items-center gap-2 ${breadcrumbs ? 'mt-4' : ''}`}>
            <Flag code={ed.code} size={22} />
            Edición {ed.name}
          </p>
        </>
      }
      title={c.title}
      lead={c.subtitle}
      actions={
        <>
          <Button asChild variant="brand" size="lg">
            <a href={rankingHref}>Ver el ranking</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={methodHref}>{methodLabel}</a>
          </Button>
        </>
      }
      meta={
        <>
          {dateText && (
            <span>
              Datos actualizados el{' '}
              {updatedIso ? <time dateTime={isoDate(updatedIso)}>{dateText}</time> : dateText}
            </span>
          )}
          {providerCount != null && <span>{formatInteger(providerCount)} proveedores verificados</span>}
          {extraMeta}
        </>
      }
      aside={
        <EditorialImage
          name={ed.image}
          className="aspect-[4/3]"
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority
          fallback={imageFallback}
        />
      }
    />
  );
};

/** Introducción de la edición y lo que trae la comparación (antes, píldoras). */
export const CountryIntroCopy: React.FC<{ slug: Slug; children?: React.ReactNode }> = ({ slug, children }) => {
  const c = COUNTRY_CONTENT[slug];
  if (!c) return null;
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="prose lg:col-span-7">
        {c.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="lg:col-span-4 lg:col-start-9">
        <p className="t-label">En esta comparación</p>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {c.chips.map((ch) => (
            <li key={ch} className="flex items-start gap-2.5 py-3 text-[15px] text-ink">
              <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" />
              {ch}
            </li>
          ))}
        </ul>
        {children}
      </div>
    </div>
  );
};

/** Preguntas frecuentes de la edición (sin título: lo pone la sección). */
export const CountryFaqCopy: React.FC<{ slug: Slug }> = ({ slug }) => {
  const c = COUNTRY_CONTENT[slug];
  if (!c) return null;
  return <FaqList items={c.faq} />;
};

export default CountryHeroCopy;
