import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import AuthorByline from '@/components/AuthorByline';
import EditorialImage from '@/components/media/EditorialImage';
import ReadingLayout, { type TocItem } from '@/components/reading/ReadingLayout';
import type { EditorialImageKey } from '@/lib/editorialImages';

interface GuidePageProps {
  /** Migas: <GuideBreadcrumbs> o el <SEOBreadcrumbs> que la página ya tenía. */
  breadcrumbs: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Fecha de la última revisión (AAAA-MM-DD). Sin fecha, no hay línea de autoría. */
  reviewedAt?: string;
  /** Metadatos extra, después de la autoría. */
  meta?: React.ReactNode;
  toc: TocItem[];
  /**
   * Foto editorial de la guía (una como máximo, sin repetirla entre guías).
   * Si no está publicada, la plantilla la omite.
   */
  image?: EditorialImageKey;
  /** Clase de object-position para afinar el recorte (por ejemplo, «object-[50%_35%]»). */
  imagePosition?: string;
  /** Fuentes, «Sobre esta guía» y relacionados. */
  footer?: React.ReactNode;
  /** Bandas después del artículo (por ejemplo, FinalCTA). */
  after?: React.ReactNode;
  stickyCta?: boolean;
  /** false: el cuerpo no va en `prose` (índices y listas a ancho de columna). */
  prose?: boolean;
  children: React.ReactNode;
}

/**
 * Plantilla única de las guías: navegación, ReadingLayout (migas, H1, bajada,
 * autoría, foto, índice y cuerpo en `prose`) y pie del sitio.
 * La foto va al ancho de la columna del título y en formato apaisado
 * (2:1 en móvil, 5:2 desde 640 px) para no alejar el índice de la primera pantalla.
 */
const GuidePage: React.FC<GuidePageProps> = ({
  breadcrumbs,
  title,
  lead,
  reviewedAt,
  meta,
  toc,
  image,
  imagePosition,
  footer,
  after,
  stickyCta = true,
  prose = true,
  children,
}) => {
  const hasMeta = Boolean(reviewedAt || meta);
  return (
    <>
      <Navbar />
      <main>
        <ReadingLayout
          breadcrumbs={breadcrumbs}
          title={title}
          lead={lead}
          meta={
            hasMeta ? (
              <>
                {reviewedAt && <AuthorByline reviewedAt={reviewedAt} inline />}
                {meta}
              </>
            ) : undefined
          }
          image={
            image ? (
              <EditorialImage
                name={image}
                className="aspect-[2/1] max-w-[46rem] sm:aspect-[5/2]"
                imgClassName={imagePosition}
                sizes="(min-width: 768px) 736px, 100vw"
                priority
              />
            ) : undefined
          }
          toc={toc}
          footer={footer}
          prose={prose}
        >
          {children}
        </ReadingLayout>
        {after}
      </main>
      {stickyCta && <StickyCTA />}
      <Footer />
    </>
  );
};

export default GuidePage;
