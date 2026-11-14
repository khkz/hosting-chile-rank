import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadingLayout from "@/components/reading/ReadingLayout";
import EditorialImage from "@/components/media/EditorialImage";
import { Button } from "@/components/ui/button";
import CountryCrumbs from "@/components/ranking/pais/CountryCrumbs";
import MethodologyMarkdown from "@/components/benchmark/MethodologyMarkdown";
import { markdownToc } from "@/components/benchmark/markdownUtils";
import { formatDataDate, isoDate } from "@/lib/format";

/** «v1.0» o «1.0» se muestran como «1.0» (la base ya trae la «v»). */
const plainVersion = (v: string) => v.replace(/^v/i, "");

const MetodologiaBenchmark: React.FC = () => {
  const { data: methodologies, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["benchmark-methodologies-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("benchmark_methodology")
        .select("*")
        .order("published_at", { ascending: false });
      // Un error no es «sin metodología»: se muestra como error.
      if (error) throw error;
      return data ?? [];
    },
  });

  const current = methodologies?.find((m) => m.is_current);
  const previous = methodologies?.filter((m) => !m.is_current) ?? [];

  return (
    <>
      <Helmet>
        <title>Metodología del Benchmark | EligeTuHosting.cl</title>
        <meta
          name="description"
          content="Cómo medimos el rendimiento de los proveedores de hosting en Chile. Metodología y pesos publicados."
        />
        <link rel="canonical" href="https://eligetuhosting.cl/metodologia-benchmark" />
      </Helmet>

      <Navbar />

      <main>
        <ReadingLayout
          breadcrumbs={
            <CountryCrumbs
              items={[
                { name: "Inicio", href: "/" },
                { name: "Benchmark", href: "/benchmark" },
                { name: "Metodología" },
              ]}
            />
          }
          title="Metodología del Benchmark"
          lead="Documentación pública y versionada de cómo medimos a los proveedores de hosting en Chile: qué medimos, con qué herramientas, cada cuánto y con qué límites."
          meta={
            current ? (
              <>
                <span>Versión {plainVersion(current.version)}, vigente</span>
                <span>
                  Publicada el <time dateTime={isoDate(current.published_at)}>{formatDataDate(current.published_at)}</time>
                </span>
                <Link to="/benchmark" className="font-medium text-ink underline underline-offset-4">
                  Ver los resultados del benchmark
                </Link>
              </>
            ) : undefined
          }
          image={<EditorialImage name="metodologia" sizes="(min-width: 1024px) 64rem, 100vw" />}
          toc={current ? markdownToc(current.markdown) : undefined}
          prose={false}
          footer={
            previous.length > 0 ? (
              <section aria-labelledby="versiones-anteriores">
                <h2 id="versiones-anteriores" className="t-h2 text-ink">
                  Versiones anteriores
                </h2>
                <ul className="mt-6 divide-y divide-rule border-y border-rule">
                  {previous.map((m) => (
                    <li key={m.version}>
                      <details className="group py-2">
                        <summary className="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 font-semibold text-ink">
                          <span>Versión {plainVersion(m.version)}</span>
                          <span className="t-meta font-normal">
                            Publicada el <time dateTime={isoDate(m.published_at)}>{formatDataDate(m.published_at)}</time>
                          </span>
                        </summary>
                        <MethodologyMarkdown markdown={m.markdown} offset={1} className="pb-6 pt-2" />
                      </details>
                    </li>
                  ))}
                </ul>
              </section>
            ) : undefined
          }
        >
          {isLoading ? (
            <p className="t-body text-ink-2">Cargando la metodología…</p>
          ) : isError || !current ? (
            <div role={isError ? "alert" : undefined} className="max-w-[62ch] rounded-xl border border-rule bg-paper p-6">
              <p className="t-h3 text-ink">No pudimos cargar la versión vigente</p>
              <p className="t-small mt-2 text-ink-2">
                {isError
                  ? "Falló la conexión con nuestra base de datos. La metodología sigue publicada: vuelve a intentarlo en unos segundos."
                  : "La base no devolvió una versión vigente. Mientras lo revisamos, el resumen de fuentes y fórmulas está en la página del benchmark."}{" "}
                Si el problema sigue, escríbenos a{" "}
                <a href="mailto:contacto@eligetuhosting.cl" className="font-medium text-ink underline underline-offset-4">
                  contacto@eligetuhosting.cl
                </a>
                .
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                  {isFetching ? "Reintentando…" : "Reintentar"}
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/benchmark">Ir al benchmark</Link>
                </Button>
              </div>
            </div>
          ) : (
            <MethodologyMarkdown markdown={current.markdown} />
          )}
        </ReadingLayout>
      </main>

      <Footer />
    </>
  );
};

export default MetodologiaBenchmark;
