import React from 'react';
import GuideEEAT, { type GuideSource } from '@/components/GuideEEAT';

interface GuideFooterProps {
  /** Fecha de la última revisión. Sin fecha, no se dibuja «Sobre esta guía». */
  reviewedAt?: string;
  /** Fuentes externas que la guía cita (hoy ninguna guía cita fuentes). */
  sources?: GuideSource[];
  /** Bloques a la medida de lectura después de «Sobre esta guía». */
  extra?: React.ReactNode;
  /** Lecturas relacionadas, al ancho de la columna. */
  related?: React.ReactNode;
}

/** Pie común de las guías: autoría y método, bloques extra y relacionados. */
const GuideFooter: React.FC<GuideFooterProps> = ({ reviewedAt, sources, extra, related }) => (
  <div className="space-y-12">
    {(reviewedAt || extra) && (
      <div className="max-w-[38rem] space-y-10">
        {reviewedAt && <GuideEEAT reviewedAt={reviewedAt} sources={sources} />}
        {extra}
      </div>
    )}
    {related}
  </div>
);

export default GuideFooter;
