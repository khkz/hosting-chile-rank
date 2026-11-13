import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Flag from '@/components/data/Flag';
import { ProvenanceGlyph, ProvenanceLegend, ProvenanceTag } from '@/components/data/Provenance';
import { useLatamIndex, type LatamIndexRow } from '@/features/ranking';
import {
  COM_ORIGIN,
  CL_ORIGIN,
  LATAM_HOME_URL,
  PUBLISHED_EDITIONS,
  VERIFYING_EDITIONS,
  editionHref,
  hreflangAlternates,
  rankingPath,
} from '@/lib/countries';

const nf = (n: number) => n.toLocaleString('es-CL');
const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);
const shortDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

/** Barra de proporción con el color de la procedencia del dato. */
const ShareBar: React.FC<{ part: number; total: number; tone: 'declared' | 'measured' }> = ({ part, total, tone }) => (
  <span className="mt-1.5 block h-1 w-full max-w-[120px] overflow-hidden rounded-full bg-paper-deep" aria-hidden>
    <span
      className={`block h-full rounded-full ${tone === 'declared' ? 'bg-signal-declared' : 'bg-signal-measured'}`}
      style={{ width: `${pct(part, total)}%` }}
    />
  </span>
);

const rankingLabel = (row: LatamIndexRow) => `Ranking de ${row.edition.name}`;
const rankingHref = (row: LatamIndexRow) => editionHref(row.edition.code, rankingPath(row.edition));

const IndexTable: React.FC<{ rows: LatamIndexRow[] }> = ({ rows }) => (
  <>
    {/* Escritorio: tabla */}
    <table className="hidden w-full border-collapse text-left md:table">
      <caption className="sr-only">Índice de hosting por país: proveedores verificados, datacenter en el país y mediciones propias</caption>
      <thead>
        <tr className="border-b-2 border-ink text-[13px] font-semibold text-ink-2">
          <th scope="col" className="py-3 pr-4 font-semibold">País</th>
          <th scope="col" className="py-3 pr-4 text-right font-semibold">Proveedores verificados</th>
          <th scope="col" className="py-3 pr-4 font-semibold">
            <span className="flex items-center justify-end gap-2">
              Datacenter en el país <ProvenanceTag kind="declared" />
            </span>
          </th>
          <th scope="col" className="py-3 pr-4 font-semibold">
            <span className="flex items-center justify-end gap-2">
              Medidos por nosotros <ProvenanceTag kind="measured" />
            </span>
          </th>
          <th scope="col" className="py-3 pr-4 text-right font-semibold">Última actualización</th>
          <th scope="col" className="py-3"><span className="sr-only">Ranking</span></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.edition.code} className="border-b border-rule align-middle">
            <th scope="row" className="py-4 pr-4 text-left font-normal">
              <a href={editionHref(row.edition.code)} className="group inline-flex items-center gap-3">
                <Flag code={row.edition.code} size={26} />
                <span>
                  <span className="block text-[17px] font-semibold text-ink group-hover:underline underline-offset-4">{row.edition.name}</span>
                  <span className="block text-xs text-ink-3">
                    {row.edition.code === 'CL' ? 'eligetuhosting.cl' : `eligetuhosting.com/${row.edition.slug}`}
                  </span>
                </span>
              </a>
            </th>
            <td className="py-4 pr-4 text-right text-xl font-semibold text-ink tabular">{nf(row.total)}</td>
            <td className="py-4 pr-4 text-right tabular">
              <span className="text-xl font-semibold text-ink">{nf(row.localDc)}</span>
              <span className="ml-1.5 text-sm text-ink-3">{pct(row.localDc, row.total)}%</span>
              <span className="flex justify-end"><ShareBar part={row.localDc} total={row.total} tone="declared" /></span>
            </td>
            <td className="py-4 pr-4 text-right tabular">
              {row.measured == null ? (
                <span className="text-ink-3">sin dato</span>
              ) : (
                <>
                  <span className="text-xl font-semibold text-ink">{nf(row.measured)}</span>
                  <span className="ml-1.5 text-sm text-ink-3">{pct(row.measured, row.total)}%</span>
                  <span className="flex justify-end"><ShareBar part={row.measured} total={row.total} tone="measured" /></span>
                </>
              )}
            </td>
            <td className="py-4 pr-4 text-right text-sm text-ink-2 tabular">{shortDate(row.updatedAt)}</td>
            <td className="py-4 text-right">
              <a
                href={rankingHref(row)}
                className="inline-flex h-9 items-center rounded-md border border-ink/20 px-3 text-sm font-semibold text-ink hover:border-ink hover:bg-paper"
              >
                {rankingLabel(row)}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Móvil: filas apiladas */}
    <ul className="divide-y divide-rule border-y-2 border-ink md:hidden">
      {rows.map((row) => (
        <li key={row.edition.code} className="py-4">
          <a href={editionHref(row.edition.code)} className="flex items-center gap-3">
            <Flag code={row.edition.code} size={26} />
            <span className="text-lg font-semibold text-ink">{row.edition.name}</span>
          </a>
          <dl className="mt-3 grid grid-cols-3 gap-3 text-ink tabular">
            <div>
              <dt className="text-xs text-ink-3">Verificados</dt>
              <dd className="text-lg font-semibold">{nf(row.total)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-xs text-ink-3">
                DC en el país <ProvenanceGlyph kind="declared" />
              </dt>
              <dd className="text-lg font-semibold">{nf(row.localDc)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-xs text-ink-3">
                Medidos <ProvenanceGlyph kind="measured" />
              </dt>
              <dd className="text-lg font-semibold">{row.measured == null ? '—' : nf(row.measured)}</dd>
            </div>
          </dl>
          <a href={rankingHref(row)} className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-ink underline underline-offset-4">
            {rankingLabel(row)}
          </a>
        </li>
      ))}
    </ul>
  </>
);

const IndexSkeleton = () => (
  <div className="divide-y divide-rule border-y-2 border-ink" aria-busy="true" aria-label="Cargando el índice">
    {PUBLISHED_EDITIONS.map((e) => (
      <div key={e.code} className="flex items-center gap-4 py-5">
        <Flag code={e.code} size={26} />
        <span className="text-[17px] font-semibold text-ink">{e.name}</span>
        <span className="ml-auto h-4 w-1/2 animate-pulse rounded bg-paper-deep" />
      </div>
    ))}
  </div>
);

const TopByCountry: React.FC<{ rows: LatamIndexRow[] }> = ({ rows }) => (
  <div className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-rule">
    {rows.map((row) => (
      <section key={row.edition.code} aria-labelledby={`top-${row.edition.code}`} className="lg:px-5 lg:first:pl-0 lg:last:pr-0">
        <h3 id={`top-${row.edition.code}`} className="flex items-center gap-2 text-base font-semibold text-ink">
          <Flag code={row.edition.code} size={20} />
          {row.edition.name}
        </h3>
        <p className="mt-1 flex min-h-[2.5rem] items-start gap-1.5 text-xs leading-snug text-ink-3">
          {row.order === 'editorial' ? (
            <>
              <ProvenanceGlyph kind="editorial" className="mt-[3px]" />
              Orden editorial con pesos publicados
            </>
          ) : (
            <>Orden por infraestructura, red, razón social y antigüedad</>
          )}
        </p>
        {row.top.length === 0 ? (
          <p className="mt-4 text-sm text-ink-2">Aún sin proveedores ordenados.</p>
        ) : (
          <ol className="mt-3 space-y-3">
            {row.top.map((p, i) => (
              <li key={p.id} className="flex items-baseline gap-3">
                <span
                  className={`type-display w-6 shrink-0 text-2xl tabular ${i === 0 ? 'text-brand' : 'text-ink/35'}`}
                  aria-label={`Puesto ${i + 1}`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <a href={p.href} className="font-semibold text-ink hover:underline underline-offset-4 break-words">
                    {p.name}
                  </a>
                  {p.score != null && (
                    <span className="ml-2 inline-flex items-center gap-1 text-sm text-ink-2 tabular">
                      {p.score.toFixed(1).replace('.', ',')}
                      <ProvenanceGlyph kind="editorial" />
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        )}
        <a href={rankingHref(row)} className="mt-4 inline-flex min-h-[40px] items-center text-sm font-semibold text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
          Ranking completo
        </a>
      </section>
    ))}
  </div>
);

const LatamIndex = () => {
  const { data, isLoading, isError, refetch } = useLatamIndex();
  const totalProviders = data?.totals.providers;
  // Fecha de los datos más recientes del índice, no la del reloj del visitante.
  const latestIso = (data?.rows ?? []).reduce<string | null>(
    (max, r) => (r.updatedAt && (!max || r.updatedAt > max) ? r.updatedAt : max),
    null
  );
  const latestHuman = latestIso
    ? new Date(latestIso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
    : isLoading
    ? '…'
    : '—';

  const title = 'Hosting en Latinoamérica 2026: ranking y datos por país | EligeTuHosting';
  const description = `Índice de hosting en Latinoamérica: ${totalProviders ? `${nf(totalProviders)} proveedores verificados` : 'proveedores verificados'} en ${PUBLISHED_EDITIONS.map((e) => e.name).join(', ')}. Cada dato indica si es medido, declarado por el proveedor o editorial.`;

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ediciones de EligeTuHosting por país',
    url: LATAM_HOME_URL,
    numberOfItems: PUBLISHED_EDITIONS.length,
    itemListElement: PUBLISHED_EDITIONS.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Hosting en ${e.name}`,
      url: e.code === 'CL' ? `${CL_ORIGIN}/` : `${COM_ORIGIN}/${e.slug}`,
    })),
  };
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Hosting en Latinoamérica: ranking y datos por país',
    url: LATAM_HOME_URL,
    inLanguage: 'es-419',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    publisher: { '@type': 'Organization', name: 'EligeTuHosting', url: LATAM_HOME_URL },
  };

  return (
    <>
      <Helmet>
        <html lang="es-419" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={LATAM_HOME_URL} />
        <meta name="robots" content="index,follow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content="es_419" />
        <meta property="og:title" content="Hosting en Latinoamérica, comparado país por país" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={LATAM_HOME_URL} />
        <meta property="og:image" content={`${COM_ORIGIN}/og/latam.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${COM_ORIGIN}/og/latam.png`} />
        {hreflangAlternates().map((a) => (
          <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
        ))}
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
      </Helmet>

      <Navbar />

      <main>
        <section className="border-b border-rule bg-paper">
          <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-12 md:py-16">
            <div className="md:col-span-8">
              <h1 className="type-display text-[2.4rem] text-ink sm:text-[3.25rem] lg:text-[3.6rem]">
                Hosting en Latinoamérica, comparado país por país.
              </h1>
              <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-ink-2">
                Revisamos a los proveedores de hosting de cada país con el mismo método: quién es la empresa, dónde están
                sus servidores y cómo responde su red. Cada cifra indica si la medimos nosotros, si la declara el
                proveedor o si es criterio editorial.
              </p>
            </div>
            <aside className="self-end md:col-span-4" aria-label="Resumen de la edición">
              <dl className="divide-y divide-rule border-y border-ink/80 text-ink tabular">
                <div className="flex items-baseline justify-between py-3">
                  <dt className="text-sm text-ink-2">Datos al</dt>
                  <dd className="font-semibold">{latestHuman}</dd>
                </div>
                <div className="flex items-baseline justify-between py-3">
                  <dt className="text-sm text-ink-2">Proveedores verificados</dt>
                  <dd className="text-2xl font-bold">{totalProviders != null ? nf(totalProviders) : '…'}</dd>
                </div>
                <div className="flex items-baseline justify-between py-3">
                  <dt className="text-sm text-ink-2">Países publicados</dt>
                  <dd className="text-2xl font-bold">{PUBLISHED_EDITIONS.length}</dd>
                </div>
                <div className="flex items-baseline justify-between py-3">
                  <dt className="text-sm text-ink-2">En verificación</dt>
                  <dd className="text-2xl font-bold">{VERIFYING_EDITIONS.length}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section id="indice" aria-labelledby="indice-titulo" className="container mx-auto px-4 py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 id="indice-titulo" className="type-wide text-2xl font-bold text-ink md:text-3xl">
              Índice por país
            </h2>
            <p className="text-sm text-ink-3">Cifras leídas de nuestra base de datos en cada visita.</p>
          </div>

          {isLoading && <IndexSkeleton />}
          {isError && (
            <div role="alert" className="rounded-md border border-rule bg-paper p-4 text-sm text-ink-2">
              No pudimos leer el índice. Las cifras de esta página no se cargaron; no significa que no haya proveedores.{' '}
              <button type="button" onClick={() => refetch()} className="font-semibold text-ink underline underline-offset-2">
                Reintentar
              </button>
            </div>
          )}
          {data && <IndexTable rows={data.rows} />}

          <div id="cobertura" className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h3 className="text-sm font-semibold text-ink">Países en verificación</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                Publicamos un país cuando sus proveedores tienen razón social, datacenter y contacto comprobados.
                Mientras tanto, su página no aparece en buscadores.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {VERIFYING_EDITIONS.map((e) => (
                  <li key={e.code}>
                    <a href={editionHref(e.code)} className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
                      <Flag code={e.code} size={16} />
                      {e.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <h3 className="mb-3 text-sm font-semibold text-ink">Cómo leer cada dato</h3>
              <ProvenanceLegend compact />
            </div>
          </div>
        </section>

        <section aria-labelledby="top-titulo" className="border-t border-rule bg-white">
          <div className="container mx-auto px-4 py-14">
            <div className="mb-8 max-w-2xl">
              <h2 id="top-titulo" className="type-wide text-2xl font-bold text-ink md:text-3xl">
                Primeros puestos por país
              </h2>
              <p className="mt-2 text-ink-2">
                Cada país se ordena con su propio criterio publicado. Chile tiene notas editoriales; en el resto,
                el orden sale de la infraestructura comprobable mientras completamos las mediciones.
              </p>
            </div>
            {data ? (
              <TopByCountry rows={data.rows} />
            ) : isError ? (
              <p className="text-sm text-ink-2">No pudimos leer los primeros puestos por país.</p>
            ) : (
              <div className="h-40 animate-pulse rounded-md bg-paper" />
            )}
          </div>
        </section>

        <section aria-labelledby="datos-titulo" className="border-t border-rule bg-paper">
          <div className="container mx-auto grid gap-8 px-4 py-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 id="datos-titulo" className="type-wide text-2xl font-bold text-ink">
                Datos abiertos
              </h2>
              <p className="mt-2 leading-relaxed text-ink-2">
                Puedes usar estos datos citando a EligeTuHosting (licencia CC-BY-4.0). Están pensados para
                periodistas, investigadores y asistentes de IA.
              </p>
            </div>
            <ul className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 md:col-span-7">
              {PUBLISHED_EDITIONS.map((e) => {
                const file = e.code === 'CL' ? '/data/proveedores.json' : `/data/proveedores-${e.slug}.json`;
                return (
                  <li key={e.code}>
                    <a href={file} className="inline-flex items-center gap-2 text-ink hover:underline underline-offset-4">
                      <Flag code={e.code} size={16} />
                      <span>Proveedores de {e.name}</span>
                      <span className="text-ink-3">JSON</span>
                    </a>
                  </li>
                );
              })}
              <li>
                <a href="/data/proveedores-latam.json" className="inline-flex items-center gap-2 text-ink hover:underline underline-offset-4">
                  <span>Latinoamérica unificado</span>
                  <span className="text-ink-3">JSON</span>
                </a>
              </li>
              <li>
                <a href="/llms.txt" className="text-ink hover:underline underline-offset-4">
                  Resumen para asistentes de IA (llms.txt)
                </a>
              </li>
              <li>
                <a href="/datos" className="text-ink hover:underline underline-offset-4">
                  Documentación de los datos
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LatamIndex;
