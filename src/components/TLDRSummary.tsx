import React from 'react';
import { ExternalLink } from 'lucide-react';

interface TLDRData {
  title: string;
  keyPoints: string[];
  stats?: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
  sources?: {
    title: string;
    url: string;
  }[];
}

interface TLDRSummaryProps {
  data: TLDRData;
}

/** Resumen al inicio de un término: puntos clave, cifras que trae el contenido y sus fuentes. */
const TLDRSummary: React.FC<TLDRSummaryProps> = ({ data }) => (
  <section aria-label="En resumen" className="rounded-xl border border-rule bg-paper p-5 md:p-6">
    <p className="t-label">En resumen</p>
    <p className="t-h3 mt-1 text-ink">{data.title}</p>

    <ul className="t-body mt-4 list-disc space-y-1.5 pl-5 text-ink-2 marker:text-ink-3">
      {data.keyPoints.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>

    {data.stats && data.stats.length > 0 && (
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {data.stats.map((stat, index) => (
          <div key={index} className="rounded-lg border border-rule bg-white p-3">
            <dt className="t-meta flex items-center gap-1.5 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-ink-3">
              <span aria-hidden className="inline-flex">
                {stat.icon}
              </span>
              {stat.label}
            </dt>
            <dd className="tabular mt-1 text-lg font-bold text-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>
    )}

    {data.sources && data.sources.length > 0 && (
      <div className="mt-5">
        <p className="t-label">Fuentes</p>
        <ul className="mt-1.5 space-y-1">
          {data.sources.map((source, index) => (
            <li key={index}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="t-small inline-flex items-center gap-1 text-ink underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink"
              >
                {source.title}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </section>
);

export default TLDRSummary;
