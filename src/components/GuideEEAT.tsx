import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDataDate, isoDate } from '@/lib/format';

export interface GuideSource {
  label: string;
  url: string;
}

interface GuideEEATProps {
  /** Fecha de la última revisión, AAAA-MM-DD (se lee como fecha local). */
  reviewedAt: string;
  reviewer?: string;
  /** Experiencia del equipo. Solo si se puede verificar; si no, se omite. */
  expertise?: string;
  /** Fuentes externas que la guía cita. Sin fuentes, la fila no se dibuja: no se inventan. */
  sources?: GuideSource[];
  /** id de la sección (ancla). */
  id?: string;
  className?: string;
}

const LINK =
  'inline-flex min-h-11 items-center font-medium text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-ink sm:min-h-0';

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
    <dt className="t-label">{label}</dt>
    <dd className="t-small min-w-0 text-ink-2">{children}</dd>
  </div>
);

/**
 * «Sobre esta guía»: autoría, fecha de revisión, dónde está la metodología
 * del sitio y, si las hay, las fuentes externas que la guía cita.
 */
const GuideEEAT: React.FC<GuideEEATProps> = ({
  reviewedAt,
  reviewer = 'Equipo Editorial de EligeTuHosting',
  expertise,
  sources = [],
  id = 'sobre-esta-guia',
  className,
}) => {
  const headingId = `${id}-titulo`;
  const iso = isoDate(reviewedAt);
  return (
    <section id={id} aria-labelledby={headingId} className={cn('scroll-mt-24', className)}>
      <h2 id={headingId} className="t-h3 text-ink">
        Sobre esta guía
      </h2>
      <dl className="mt-4 divide-y divide-rule border-y border-rule">
        <Row label="Autoría">
          <Link to="/sobre-nosotros" className={LINK}>
            {reviewer}
          </Link>
          {expertise && <p className="t-meta mt-1">{expertise}</p>}
        </Row>
        <Row label="Última revisión">
          {iso ? <time dateTime={iso}>{formatDataDate(reviewedAt)}</time> : 'Sin fecha'}
        </Row>
        <Row label="Metodología">
          <ul className="sm:space-y-1">
            <li>
              <Link to="/metodologia" className={LINK}>
                Metodología del ranking
              </Link>
            </li>
            <li>
              <Link to="/metodologia-benchmark" className={LINK}>
                Metodología del benchmark
              </Link>
            </li>
          </ul>
        </Row>
        {sources.length > 0 && (
          <Row label="Fuentes citadas">
            <ul className="sm:space-y-1">
              {sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={cn(LINK, 'gap-1 break-words')}
                  >
                    {s.label}
                    <ExternalLink aria-hidden className="h-3.5 w-3.5 shrink-0" />
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Row>
        )}
      </dl>
    </section>
  );
};

export default GuideEEAT;
