import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import AuthorByline from '@/components/AuthorByline';
import ReadingLayout, { type TocItem } from '@/components/reading/ReadingLayout';

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
  /** <EditorialImage>; si no está publicada, la plantilla la omite. */
  image?: React.ReactNode;
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
 * autoría, índice y cuerpo en `prose`) y pie del sitio.
 */
const GuidePage: React.FC<GuidePageProps> = ({
  breadcrumbs,
  title,
  lead,
  reviewedAt,
  meta,
  toc,
  image,
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
          image={image}
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
