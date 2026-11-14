import React from 'react';
import PageHeader from '@/components/system/PageHeader';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { ProvenanceLegend } from '@/components/data/Provenance';
import { formatDataDate, isoDate } from '@/lib/format';

/**
 * Cabecera común de la familia «ranking» (/ranking, guía de Chile, hubs por
 * segmento, WordPress, e-commerce y certificaciones): migas con SEOBreadcrumbs,
 * H1 con el rol t-h1 a la izquierda, bajada, fecha real de revisión y leyenda
 * de procedencia. La fecha es obligatoria: si la página no tiene una, se dice.
 */
interface Crumb {
  name: string;
  href: string;
}

interface RankingHeaderProps {
  /** Texto del H1 tal cual (no se toca). */
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Migas intermedias (Inicio lo agrega SEOBreadcrumbs). */
  crumbs: Crumb[];
  /** Nombre de la página actual en las migas. */
  pageName?: string;
  /** Fecha real de revisión de los datos (AAAA-MM-DD), o null si la página no la tiene. */
  reviewedAt: string | null;
  /** Qué se revisó en esa fecha. */
  reviewedLabel?: string;
  /** Qué decir cuando no hay fecha de revisión. */
  undatedNote?: React.ReactNode;
  /** Metadatos extra: método, divulgación, enlaces. */
  meta?: React.ReactNode;
  /** Leyenda Medido / Declarado / Editorial (por defecto, sí). */
  legend?: boolean;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
}

const RankingHeader: React.FC<RankingHeaderProps> = ({
  title,
  lead,
  crumbs,
  pageName,
  reviewedAt,
  reviewedLabel = 'Notas revisadas el',
  undatedNote = 'Sin fecha de revisión publicada',
  meta,
  legend = true,
  actions,
  aside,
}) => (
  <PageHeader
    breadcrumbs={<SEOBreadcrumbs items={crumbs} pageName={pageName} />}
    title={title}
    lead={lead}
    actions={actions}
    aside={aside}
    meta={
      <>
        {reviewedAt ? (
          <span>
            {reviewedLabel}{' '}
            <time dateTime={isoDate(reviewedAt)} className="font-semibold text-ink-2">
              {formatDataDate(reviewedAt)}
            </time>
          </span>
        ) : (
          <span>{undatedNote}</span>
        )}
        {meta}
        {legend && (
          <div className="mt-2 w-full border-t border-rule pt-4">
            <ProvenanceLegend compact />
          </div>
        )}
      </>
    }
  />
);

export default RankingHeader;
