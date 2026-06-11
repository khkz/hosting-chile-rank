import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, Info, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  useLatestBenchmark, useCompanyHistory, useCurrentMethodology, type BenchmarkRow,
} from "@/hooks/useBenchmark";
import SourcesCard from "@/components/benchmark/SourcesCard";
import ReproduceButton from "@/components/benchmark/ReproduceButton";

const fmtDate = (iso: string) =>
  format(new Date(iso), "d 'de' MMMM yyyy, HH:mm", { locale: es });

const Benchmark: React.FC = () => {
  const { data, isLoading } = useLatestBenchmark();
  const { data: methodology } = useCurrentMethodology();
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined);
  const { data: history } = useCompanyHistory(selectedCompany);

  const run = data?.run;
  const results = data?.results ?? [];

  // Selected first item
  React.useEffect(() => {
    if (!selectedCompany && results.length) {
      setSelectedCompany(results[0].company_id);
    }
  }, [results, selectedCompany]);

  const chartData = useMemo(
    () =>
      results.map((r) => ({
        name: r.hosting_companies?.name ?? "—",
        ttfb: r.ttfb_median_ms ?? 0,
        perf: r.lighthouse_perf ?? 0,
        uptime: r.uptime_30d_pct ?? 0,
        score: r.composite_score ?? 0,
      })),
    [results],
  );

  const historyData = useMemo(
    () =>
      (history ?? []).map((r) => ({
        date: format(new Date(r.measured_at), "MMM yy", { locale: es }),
        ttfb: r.ttfb_median_ms,
        score: r.composite_score,
      })),
    [history],
  );

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

  return (
    <>
      <Helmet>
        <title>{`Benchmark Hosting Chile ${new Date().getFullYear()} | Datos reales medidos | EligeTuHosting.cl`}</title>
        <meta
          name="description"
          content="Benchmark independiente de hosting Chile. TTFB, Lighthouse y uptime medidos cada hora. Metodología pública y datos descargables."
        />
        <link rel="canonical" href="https://eligetuhosting.cl/benchmark" />
        {datasetSchema && (
          <script type="application/ld+json">{JSON.stringify(datasetSchema)}</script>
        )}
      </Helmet>

      <Navbar />

      <main className="bg-[#F7F9FC] min-h-screen">
        {/* Hero */}
        <section className="py-12 md:py-16 bg-white border-b">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-3">
                  Benchmark de Hosting Chile
                </h1>
                <p className="text-base md:text-lg text-[#555] max-w-3xl">
                  Mediciones reales y reproducibles de los principales proveedores de hosting en Chile.
                  Sin datos inventados: cada número proviene de una medición fechada y citable.
                </p>
                {run && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <Badge variant="secondary">Última ejecución: {fmtDate(run.run_date)}</Badge>
                    <Badge variant="outline">Metodología {run.methodology_version}</Badge>
                    <Badge variant="outline">{run.total_providers} proveedores</Badge>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" asChild className="min-h-11">
                  <Link to="/metodologia-benchmark">
                    <Info className="w-4 h-4 mr-2" />
                    Ver metodología
                  </Link>
                </Button>
                {run && (
                  <Button onClick={downloadJson} className="min-h-11">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar JSON crudo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Fuentes y herramientas — visible siempre */}
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <SourcesCard />
          </div>
        </section>

        {/* Estado vacío */}
        {!isLoading && !run && (
          <section className="py-20">
            <div className="container mx-auto px-4 max-w-2xl text-center">
              <Card>
                <CardHeader>
                  <CardTitle>Aún no hay ejecuciones del benchmark</CardTitle>
                  <CardDescription>
                    El sistema de medición ya está instalado. La primera ejecución completa se realizará
                    el día 1 del próximo mes a las 03:00 CLT, o puede ser disparada manualmente desde el
                    panel administrativo.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
        )}

        {/* Tabla principal */}
        {run && results.length > 0 && (
          <section className="py-10">
            <div className="container mx-auto px-4 max-w-6xl">
              <Card>
                <CardHeader>
                  <CardTitle>Resultados del último benchmark</CardTitle>
                  <CardDescription>
                    Ordenado por score compuesto. Pasa el cursor sobre cada métrica para ver detalle.
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <TooltipProvider>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Proveedor</TableHead>
                          <TableHead className="text-right">Score</TableHead>
                          <TableHead className="text-right">TTFB (ms)</TableHead>
                          <TableHead className="text-right">Lighthouse</TableHead>
                          <TableHead className="text-right">Uptime 30d</TableHead>
                          <TableHead>Server</TableHead>
                          <TableHead>Medido</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((r) => (
                          <BenchmarkRowItem key={r.id} row={r} />
                        ))}
                      </TableBody>
                    </Table>
                  </TooltipProvider>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Charts */}
        {run && chartData.length > 0 && (
          <section className="py-10 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-2xl font-bold mb-6">Visualizaciones</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-base">Score compuesto</CardTitle></CardHeader>
                  <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip />
                        <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">TTFB mediana (menor es mejor)</CardTitle></CardHeader>
                  <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip />
                        <Bar dataKey="ttfb" fill="#3366CC" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Lighthouse Performance</CardTitle></CardHeader>
                  <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip />
                        <Bar dataKey="perf" fill="#329933" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Uptime 30 días (%)</CardTitle></CardHeader>
                  <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[95, 100]} />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip />
                        <Bar dataKey="uptime" fill="#FF9933" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Histórico */}
        {run && results.length > 0 && (
          <section className="py-10">
            <div className="container mx-auto px-4 max-w-6xl">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico por proveedor</CardTitle>
                  <CardDescription>
                    Evolución del TTFB y score compuesto a lo largo del tiempo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 max-w-xs">
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger><SelectValue placeholder="Selecciona un proveedor" /></SelectTrigger>
                      <SelectContent>
                        {results.map((r) => (
                          <SelectItem key={r.company_id} value={r.company_id}>
                            {r.hosting_companies?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-72">
                    {historyData.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        Solo hay 1 medición disponible. El histórico aparecerá tras varios runs mensuales.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="ttfb" stroke="#3366CC" name="TTFB ms" />
                          <Line yAxisId="right" type="monotone" dataKey="score" stroke="hsl(var(--primary))" name="Score" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Resumen metodología */}
        {methodology && (
          <section className="py-10 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
              <Card>
                <CardHeader>
                  <CardTitle>Cómo medimos esto</CardTitle>
                  <CardDescription>Versión {methodology.version}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {methodology.markdown.slice(0, 600)}…
                  </div>
                  <Button variant="link" asChild className="px-0 mt-2">
                    <Link to="/metodologia-benchmark">Leer metodología completa →</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      <StickyCTA />
      <Footer />
    </>
  );
};

const BenchmarkRowItem: React.FC<{ row: BenchmarkRow }> = ({ row }) => {
  const c = row.hosting_companies;
  const measuredLabel = row.measured_at
    ? format(new Date(row.measured_at), "d MMM yyyy", { locale: es })
    : "—";
  const targetUrl = c?.benchmark_target_url ?? "";

  return (
    <TableRow>
      <TableCell className="font-medium">
        {c?.slug ? (
          <Link to={`/catalogo/${c.slug}`} className="hover:text-primary">
            {c.name}
          </Link>
        ) : "—"}
      </TableCell>
      <TableCell className="text-right font-semibold">
        {row.composite_score?.toFixed(1) ?? "—"}
      </TableCell>
      <TableCell className="text-right">
        <UITooltip>
          <TooltipTrigger className="underline decoration-dotted underline-offset-2">
            {row.ttfb_median_ms ?? "—"}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">
              Mediana de 5 muestras GET desde Supabase Edge.
              {row.ttfb_p95_ms != null && <> p95: {row.ttfb_p95_ms}ms.</>}
            </p>
            {targetUrl && (
              <p className="text-xs mt-1 break-all">URL: {targetUrl}</p>
            )}
          </TooltipContent>
        </UITooltip>
      </TableCell>
      <TableCell className="text-right">
        {row.lighthouse_perf != null ? (
          <UITooltip>
            <TooltipTrigger className="underline decoration-dotted underline-offset-2">
              {row.lighthouse_perf}
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Lighthouse Mobile (PageSpeed Insights API).</p>
              <p className="text-xs">SEO: {row.lighthouse_seo ?? "—"} · A11y: {row.lighthouse_a11y ?? "—"}</p>
              <p className="text-xs">LCP: {row.lcp_ms ?? "—"}ms · CLS: {row.cls?.toFixed(3) ?? "—"}</p>
            </TooltipContent>
          </UITooltip>
        ) : "—"}
      </TableCell>
      <TableCell className="text-right">
        {row.uptime_30d_pct != null ? `${row.uptime_30d_pct.toFixed(2)}%` : "—"}
      </TableCell>
      <TableCell className="text-xs">
        {row.server_software ?? "—"}
        {row.has_brotli && <Badge variant="outline" className="ml-1 text-[10px]">br</Badge>}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            {measuredLabel}
            {targetUrl && (
              <a href={targetUrl} target="_blank" rel="nofollow noopener" className="text-muted-foreground hover:text-foreground" title="Abrir URL medida">
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          {targetUrl && <ReproduceButton url={targetUrl} label="PageSpeed →" />}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default Benchmark;
