import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { ProvenanceTag } from '@/components/data/Provenance';

/*
 * Recuadro compartido (guías, blog, wiki, hubs y comparativas). Las notas están
 * escritas a mano (decisión pendiente 10) y la divulgación «Sin patrocinios» es
 * la decisión pendiente 8: aquí solo cambia el estilo. Enlaces y rel sin cambios.
 * Sin encabezado propio: vive dentro de esquemas de títulos muy distintos.
 */

const RECOMENDADOS = [
  { name: 'HostingPlus.cl', ficha: '/catalogo/hostingplus', nota: '9,9', site: 'https://www.hostingplus.cl/' },
  { name: 'EcoHosting.cl', ficha: '/catalogo/ecohosting', nota: '9,6', site: 'https://www.ecohosting.cl/' },
];

const link = 'underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const RecommendedByData: React.FC<{ className?: string }> = ({ className = '' }) => (
  <aside
    className={`rounded-xl border border-rule bg-paper p-5 md:p-6 ${className}`}
    aria-label="Recomendado por datos"
  >
    <div className="flex items-start gap-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-ink-2" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">Recomendado por datos</p>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {RECOMENDADOS.map((r) => (
            <li key={r.name} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5">
              <span className="flex items-center gap-2">
                <Link to={r.ficha} className={`font-semibold text-ink ${link}`}>{r.name}</Link>
                <span className="tabular text-ink-2">{r.nota}/10</span>
                <ProvenanceTag kind="editorial" variant="glyph" />
              </span>
              <a
                href={r.site}
                rel="noopener"
                target="_blank"
                className={`t-small inline-flex min-h-[44px] items-center gap-1.5 text-ink-2 hover:text-ink ${link}`}
              >
                Ir al sitio de {r.name} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
        <p className="t-meta mt-3">
          Basado en mediciones verificables (ASN, benchmark, reputación pública). Sin patrocinios.
        </p>
      </div>
    </div>
  </aside>
);

export default RecommendedByData;
