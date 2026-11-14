import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import { formatDataDate, formatInteger, isoDate, parseDataDate } from '@/lib/format';
import { useOpenDataMeta } from '@/components/herramientas/useOpenDataMeta';

const ENDPOINTS = [
  { path: '/data/proveedores-latam.json', title: 'LATAM unificado', desc: 'Proveedores de Chile, Perú, México, Colombia y Argentina con datos verificables.' },
  { path: '/data/proveedores-cl.json', title: 'Chile', desc: 'Directorio verificado de proveedores con presencia en Chile.' },
  { path: '/data/proveedores-pe.json', title: 'Perú', desc: 'Proveedores con operaciones o dominio .pe verificado.' },
  { path: '/data/proveedores-mx.json', title: 'México', desc: 'Proveedores con RFC / entidad legal / .mx verificado.' },
  { path: '/data/proveedores-co.json', title: 'Colombia', desc: 'Proveedores con NIT / entidad legal / .co verificado.' },
  { path: '/data/proveedores-ar.json', title: 'Argentina', desc: 'Proveedores con CUIT / entidad legal / .com.ar verificado.' },
  { path: '/data/benchmarks-pe.json', title: 'Benchmarks Perú', desc: 'TTFB y uptime observados de los proveedores PE en los últimos 7 días.' },
  { path: '/data/benchmarks-mx.json', title: 'Benchmarks México', desc: 'TTFB y uptime observados de los proveedores MX.' },
  { path: '/data/benchmarks-co.json', title: 'Benchmarks Colombia', desc: 'TTFB y uptime observados de los proveedores CO.' },
  { path: '/data/benchmarks-ar.json', title: 'Benchmarks Argentina', desc: 'TTFB y uptime observados de los proveedores AR.' },
];

const MARKDOWN = [
  { path: '/pe.md', title: 'Perú (Markdown)' },
  { path: '/mx.md', title: 'México (Markdown)' },
  { path: '/co.md', title: 'Colombia (Markdown)' },
  { path: '/ar.md', title: 'Argentina (Markdown)' },
  { path: '/llms.txt', title: 'llms.txt (index para IA)' },
  { path: '/llms-full.txt', title: 'llms-full.txt (dataset extendido)' },
];

const LATAM = '/data/proveedores-latam.json';
const linkClass = 'text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const DatosAbiertos = () => {
  const canonical = 'https://eligetuhosting.com/datos';
  const title = 'Datos abiertos de hosting (LATAM) · CC-BY-4.0 | EligeTuHosting';
  const description = 'Endpoints JSON abiertos con proveedores, verificaciones técnicas y benchmarks de hosting en Chile, Perú, México, Colombia y Argentina. Licencia CC-BY-4.0.';
  const meta = useOpenDataMeta(ENDPOINTS.map((e) => e.path));
  const latamDate = meta[LATAM]?.date ?? null;
  const citeYear = parseDataDate(latamDate)?.getFullYear();

  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Directorio de hosting LATAM',
    description,
    url: canonical,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'EligeTuHosting', url: 'https://eligetuhosting.com/' },
    distribution: ENDPOINTS.map(e => ({
      '@type': 'DataDownload',
      encodingFormat: e.path.endsWith('.json') ? 'application/json' : 'text/markdown',
      contentUrl: `https://eligetuhosting.com${e.path}`,
      name: e.title,
    })),
    // Fecha del archivo unificado, no la hora de la visita (sin fecha, se omite).
    dateModified: latamDate ?? undefined,
  };

  return (
    <>
      <Helmet>
        <html lang="es" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:locale" content="es_419" />
        <meta property="og:image" content="https://eligetuhosting.com/og/datos.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://eligetuhosting.com/og/datos.png" />
        <script type="application/ld+json">{JSON.stringify(datasetLd)}</script>
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-white text-ink">
        <PageHeader
          title="Datos abiertos de hosting en LATAM"
          lead={
            <>
              Todos los endpoints JSON que usamos para publicar rankings, comparativas y benchmarks están disponibles bajo licencia{' '}
              <strong className="text-ink">Creative Commons Atribución 4.0 (CC-BY-4.0)</strong>. Puedes usarlos en tu medio, dashboard o
              modelo de IA.
            </>
          }
          meta={<span>Cada archivo indica su fecha de generación: cítala junto con el enlace.</span>}
        />

        <Section title="Endpoints JSON" density="tight">
          <ul className="divide-y divide-rule border-y border-rule">
            {ENDPOINTS.map((e) => {
              const m = meta[e.path];
              return (
                <li key={e.path} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-8">
                  <div className="min-w-0">
                    <h3 className="t-h3 text-ink">{e.title}</h3>
                    <code className="t-meta mt-1 block break-all">https://eligetuhosting.com{e.path}</code>
                    <p className="t-small mt-2 text-ink-2">{e.desc}</p>
                    <p className="t-meta mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      {m?.status === 'loading' && <span>Leyendo la fecha del archivo…</span>}
                      {m?.status === 'ok' && (
                        <span>
                          Generado el{' '}
                          {m.date ? <time dateTime={isoDate(m.date)}>{formatDataDate(m.date)}</time> : 'sin fecha en el archivo'}
                        </span>
                      )}
                      {m?.status === 'ok' && m.total != null && <span className="tabular">{formatInteger(m.total)} proveedores</span>}
                      {m?.status === 'missing' && <span>Sin fecha: no pudimos leer este archivo.</span>}
                    </p>
                  </div>
                  <a href={e.path} className={`${linkClass} t-small inline-flex min-h-11 items-center gap-1.5 font-semibold`}>
                    <Download aria-hidden className="h-4 w-4" />
                    Abrir<span className="sr-only"> {e.title} (JSON)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title="Markdown para agentes de IA" density="tight" className="border-t border-rule">
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {MARKDOWN.map((m) => (
              <li key={m.path}>
                <a href={m.path} className={`${linkClass} inline-flex min-h-11 flex-col justify-center`}>
                  <span className="font-semibold">{m.title}</span>
                  <code className="t-meta no-underline">{m.path}</code>
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section tone="paper" title="Licencia y atribución" density="tight">
          <div className="prose">
            <p>
              Todos los archivos listados en esta página se publican bajo la licencia{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/deed.es" target="_blank" rel="noopener" className="inline-flex items-center gap-1">
                Creative Commons Atribución 4.0 Internacional (CC-BY-4.0)
                <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              </a>
              . Puedes copiar, redistribuir, remezclar, transformar y construir a partir del material para cualquier propósito, incluso
              comercialmente, siempre que:
            </p>
            <ul>
              <li>Cites <strong>EligeTuHosting</strong> como fuente.</li>
              <li>Enlaces a <a href="https://eligetuhosting.com/">https://eligetuhosting.com/</a>.</li>
              <li>Indiques si hiciste cambios sobre los datos.</li>
            </ul>
            <h3>Cómo citar</h3>
          </div>
          <pre className="measure mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-rule bg-white p-4 text-sm text-ink">
            <code>{`EligeTuHosting (${citeYear ?? 's. f.'}). Directorio de hosting LATAM [Dataset].
Recuperado de https://eligetuhosting.com/datos — CC-BY-4.0.`}</code>
          </pre>
          <p className="t-meta mt-2">
            El año corresponde a la fecha de generación del archivo LATAM unificado
            {latamDate ? (
              <>
                {' '}(<time dateTime={isoDate(latamDate)}>{formatDataDate(latamDate)}</time>)
              </>
            ) : null}
            .
          </p>
          <p className="mt-8">
            <Link to="/latam" className={`${linkClass} inline-flex min-h-11 items-center gap-1.5 font-semibold`}>
              <ArrowLeft aria-hidden className="h-4 w-4" />
              Volver al hub LATAM
            </Link>
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default DatosAbiertos;
