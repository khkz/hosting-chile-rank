import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, FileText, Shield, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatShortDate, isoDate } from '@/lib/format';

interface VersionRow {
  version: string;
  published_at: string;
  is_current: boolean | null;
}

interface Props {
  /** «Versión vigente» ya resuelta (valor tal como viene, cargando o sin dato). */
  version: React.ReactNode;
  changelog: VersionRow[] | undefined;
  changelogLoading: boolean;
  /** true si la metodología vigente no se pudo cargar. */
  unavailable: boolean;
  markdown?: string | null;
  exportUrl: string;
}

/** Los encabezados del documento de la base bajan de nivel: la página ya tiene su H1 y sus H2. */
const MD_COMPONENTS = {
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h4 {...p} />,
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h4 {...p} />,
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h5 {...p} />,
  h4: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h6 {...p} />,
};

const docLink = 'h-auto min-h-11 justify-start whitespace-normal py-2.5 text-left';

/** Secciones 6 a 10 de /metodologia: versiones, documentos, límites y correcciones. */
const MetodologiaAnexos: React.FC<Props> = ({ version, changelog, changelogLoading, unavailable, markdown, exportUrl }) => (
  <>
    <h2 id="frecuencia" className="scroll-mt-24">6. Frecuencia y versionado</h2>
    <ul>
      <li>
        <strong>Uptime:</strong> ping cada hora (cron pg_cron + pg_net).
      </li>
      <li>
        <strong>Benchmark profundo:</strong> mensual (día 1) + manual desde panel admin.
      </li>
      <li>
        <strong>Curaduría editorial:</strong> revisión trimestral.
      </li>
      <li>
        <strong>Versión vigente:</strong> {version}
      </li>
    </ul>

    <h2 id="changelog" className="scroll-mt-24">7. Cambios y changelog</h2>
    {changelogLoading ? (
      <p role="status">Cargando el historial de versiones…</p>
    ) : changelog && changelog.length > 0 ? (
      <ol className="not-prose divide-y divide-rule border-y border-rule">
        {changelog.map((c) => (
          <li key={c.version} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
            <span className="tabular font-semibold text-ink">{c.version}</span>
            <time dateTime={isoDate(c.published_at)} className="t-meta">
              {formatShortDate(c.published_at)}
            </time>
            {c.is_current && <Badge variant="outline">Vigente</Badge>}
          </li>
        ))}
      </ol>
    ) : (
      <p>
        {unavailable
          ? 'No pudimos cargar el historial de versiones. Vuelve a intentarlo en unos minutos.'
          : 'Todavía no hay cambios registrados.'}
      </p>
    )}

    <h2 id="documentos" className="scroll-mt-24">8. Documentos y descargas</h2>
    <div className="not-prose grid gap-3 sm:grid-cols-2">
      <Button asChild variant="outline" className={docLink}>
        <a href={exportUrl} target="_blank" rel="noopener noreferrer">
          <Download aria-hidden />
          Exportar últimos resultados (JSON)
        </a>
      </Button>
      <Button asChild variant="outline" className={docLink}>
        <Link to="/metodologia-benchmark">
          <FileText aria-hidden />
          Metodología técnica del benchmark
        </Link>
      </Button>
      <Button asChild variant="outline" className={docLink}>
        <Link to="/transparencia-hosting-chile">
          <Shield aria-hidden />
          Política de transparencia
        </Link>
      </Button>
      <Button asChild variant="outline" className={docLink}>
        <a href="#autoria">
          <Users aria-hidden />
          Proceso editorial
        </a>
      </Button>
    </div>

    {markdown && (
      <>
        <h3>Documento metodológico vigente</h3>
        <div className="rounded-xl border border-rule px-5 py-1 [&_h4]:mt-6 [&_h5]:mt-5">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
            {markdown}
          </ReactMarkdown>
        </div>
      </>
    )}

    <h2 id="limitaciones" className="scroll-mt-24">9. Limitaciones</h2>
    <ul>
      <li>Uptime se mide desde edge de Supabase, no replica latencia desde todos los ISP chilenos.</li>
      <li>Benchmarks Lighthouse son sintéticos; no reemplazan medición real de usuarios (RUM).</li>
      <li>Reclamos.cl puede contener denuncias no verificadas; las ponderamos solo cuando hay evidencia.</li>
      <li>Precio se calcula sobre planes de entrada publicados; no cubre negociaciones privadas.</li>
    </ul>

    <h2 id="contacto" className="scroll-mt-24">10. Correcciones</h2>
    <p>¿Detectaste un error o tienes evidencia adicional? Escríbenos y revisaremos en menos de 5 días hábiles.</p>
    <div className="not-prose">
      <Button asChild>
        <Link to="/contacto?asunto=Correcci%C3%B3n+metodolog%C3%ADa">Reportar una corrección</Link>
      </Button>
    </div>
  </>
);

export default MetodologiaAnexos;
