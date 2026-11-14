import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/system/PageHeader";
import Section from "@/components/system/Section";
import EditorialImage from "@/components/media/EditorialImage";
import { ProvenanceTag } from "@/components/data/Provenance";
import { useLatestBenchmark, useCompanyHistory, useCurrentMethodology } from "@/hooks/useBenchmark";
import SourcesCard from "@/components/benchmark/SourcesCard";
import BenchmarkTable from "@/components/benchmark/BenchmarkTable";
import BenchmarkCharts from "@/components/benchmark/BenchmarkCharts";
import BenchmarkHistory from "@/components/benchmark/BenchmarkHistory";
import { formatDataDate, formatInteger, isoDate } from "@/lib/format";

const versionText = (v?: string | null) => (v ? `v${v.replace(/^v/i, "")}` : null);

const Benchmark: React.FC = () => {
  const { data, isLoading } = useLatestBenchmark();
  const { data: methodology } = useCurrentMethodology();
  const [picked, setPicked] = useState<string | undefined>(undefined);

  const run = data?.run;
  const results = data?.results ?? [];
  // Por defecto, el primero de la tabla; sin efecto ni estado extra.
  const selectedCompany = picked ?? results[0]?.company_id;
  const { data: history } = useCompanyHistory(selectedCompany);

  const datasetSchema = run ? {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `Benchmark Hosting Chile — ${run.methodology_version}`,
    "description": "Mediciones reales de TTFB (mediana de 5 muestras), Lighthouse Mobile (PageSpeed Insights v5), uptime 30 días (pings horarios) y score compuesto de proveedores de hosting en Chile.",
    "url": "https://eligetuhosting.cl/benchmark",
    "dateModified": run.run_date,
    "temporalCoverage": "30D",
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "creator": {
      "@type": "Organization",
      "name": "EligeTuHosting.cl",
      "url": "https://eligetuhosting.cl",
    },
    "variableMeasured": [
      { "@type": "PropertyValue", "name": "TTFB mediana", "unitText": "ms" },
      { "@type": "PropertyValue", "name": "TTFB p95", "unitText": "ms" },
      { "@type": "PropertyValue", "name": "Lighthouse Performance", "unitText": "score 0-100" },
      { "@type": "PropertyValue", "name": "Lighthouse SEO", "unitText": "score 0-100" },
      { "@type": "PropertyValue", "name": "Lighthouse Accessibility", "unitText": "score 0-100" },
      { "@type": "PropertyValue", "name": "Largest Contentful Paint", "unitText": "ms" },
      { "@type": "PropertyValue", "name": "Cumulative Layout Shift", "unitText": "unitless" },
      { "@type": "PropertyValue", "name": "Uptime 30 días", "unitText": "%" },
      { "@type": "PropertyValue", "name": "Score compuesto", "unitText": "score 0-100" },
    ],
  } : null;

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify({ run, results }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `benchmark-${run?.run_date.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const version = versionText(run?.methodology_version ?? methodology?.version);

  return (
    <>
      <Helmet>
        <title>{`Benchmark Hosting Chile ${new Date().getFullYear()} | Datos reales medidos | EligeTuHosting.cl`}</title>
        <meta
          name="description"
          content="Benchmark de hosting en Chile. TTFB, Lighthouse y uptime medidos cada hora. Metodología pública y datos descargables."
        />
        <link rel="canonical" href="https://eligetuhosting.cl/benchmark" />
        {datasetSchema && (
          <script type="application/ld+json">{JSON.stringify(datasetSchema)}</script>
        )}
      </Helmet>

      <Navbar />

      <main className="bg-white">
        <PageHeader
          title="Benchmark de Hosting Chile"
          lead="Mediciones reales y reproducibles de los principales proveedores de hosting en Chile. Sin datos inventados: cada número viene de una medición con fecha, que puedes citar y repetir."
          actions={
            <>
              {run && (
                <Button onClick={downloadJson}>
                  <Download aria-hidden /> Descargar datos (JSON)
                </Button>
              )}
              <Button asChild variant="outline">
                <Link to="/metodologia-benchmark">
                  <Info aria-hidden /> Ver metodología
                </Link>
              </Button>
            </>
          }
          meta={
            run ? (
              <>
                <span className="inline-flex flex-wrap items-center gap-2">
                  <ProvenanceTag kind="measured" />
                  Última medición: <time dateTime={isoDate(run.run_date)}>{formatDataDate(run.run_date)}</time>
                </span>
                {version && <span>Metodología {version}</span>}
                <span>{formatInteger(run.total_providers)} proveedores medidos</span>
              </>
            ) : undefined
          }
          aside={<EditorialImage name="metodologia" className="aspect-[4/3]" sizes="(min-width: 1024px) 45vw, 100vw" priority />}
        />

        {isLoading && (
          <Section density="tight" aria-label="Cargando resultados">
            <p className="border-y-2 border-ink py-10 text-ink-2">Cargando resultados…</p>
          </Section>
        )}

        {!isLoading && !run && (
          <Section density="tight" aria-label="Sin mediciones publicadas">
            <div className="max-w-3xl rounded-xl border border-rule bg-paper p-6 md:p-8">
              <h2 className="t-h3 text-ink">Todavía estamos midiendo</h2>
              <p className="t-body mt-2 text-ink-2">
                Los benchmarks se corren automáticamente el día 1 de cada mes a las 03:00 CLT. Mientras tanto, puedes revisar la
                metodología para saber exactamente qué medimos y cómo. Si algo no cuadra, escríbenos a{" "}
                <a href="mailto:contacto@eligetuhosting.cl" className="font-medium text-ink underline underline-offset-4">
                  contacto@eligetuhosting.cl
                </a>
                .
              </p>
              <Button asChild variant="outline" className="mt-5">
                <Link to="/metodologia-benchmark">Ver metodología</Link>
              </Button>
            </div>
          </Section>
        )}

        {run && results.length > 0 && (
          <>
            <Section
              id="resultados"
              title="Resultados de la última medición"
              lead={`Ordenados por puntaje compuesto. Medición del ${formatDataDate(run.run_date)}.`}
            >
              <BenchmarkTable rows={results} />
            </Section>

            <Section id="graficos" tone="paper" title="Los mismos datos, en gráficos" lead="Todos los proveedores, con su valor escrito al final de cada barra.">
              <BenchmarkCharts rows={results} />
            </Section>

            <Section id="historico" title="Histórico por proveedor" lead="Cómo cambian el TTFB y el puntaje compuesto de un proveedor entre mediciones.">
              <BenchmarkHistory results={results} selected={selectedCompany} onSelect={setPicked} history={history} />
            </Section>
          </>
        )}

        <Section
          id="fuentes"
          tone="paper"
          title="De dónde vienen estos datos"
          lead="Cada número viene de una herramienta pública o de un script propio que cualquier persona puede auditar. No usamos cifras inventadas ni afirmaciones de marketing del proveedor."
        >
          <SourcesCard version={version} />
          {methodology?.published_at && (
            <p className="t-meta mt-3">
              Metodología {versionText(methodology.version)} publicada el{" "}
              <time dateTime={isoDate(methodology.published_at)}>{formatDataDate(methodology.published_at)}</time>.
            </p>
          )}
        </Section>
      </main>

      <StickyCTA />
      <Footer />
    </>
  );
};

export default Benchmark;
