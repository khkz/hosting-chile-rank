import React from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicMetaTags from "@/components/SEO/DynamicMetaTags";
import SEOBreadcrumbs from "@/components/SEOBreadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  FileText,
  Database,
  Download,
  ExternalLink,
  Mail,
  AlertTriangle,
  History,
  Users,
} from "lucide-react";
import RankingFormulaBlock from "@/components/RankingFormulaBlock";
import {
  useLatestMethodology,
  useMethodologyChangelog,
  useTopProviderBreakdown,
} from "@/hooks/useMethodology";
import { RANKING_FACTORS } from "@/lib/rankingWeights";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

const SECTIONS = [
  { id: "resumen", label: "Resumen ejecutivo" },
  { id: "autoria", label: "Autoría y responsabilidad" },
  { id: "fuentes", label: "Fuentes y evidencias" },
  { id: "calculo", label: "Cómo se calcula el ranking" },
  { id: "ejemplo", label: "Ejemplo trabajado" },
  { id: "frecuencia", label: "Frecuencia y versionado" },
  { id: "changelog", label: "Cambios" },
  { id: "documentos", label: "Documentos y descargas" },
  { id: "limitaciones", label: "Limitaciones" },
  { id: "contacto", label: "Correcciones" },
];

const Metodologia: React.FC = () => {
  const { data: methodology } = useLatestMethodology();
  const { data: changelog } = useMethodologyChangelog();
  const { data: top } = useTopProviderBreakdown();

  const exportUrl = `${SUPABASE_URL}/functions/v1/export-methodology-data`;
  const lastReviewed = methodology?.published_at
    ? format(new Date(methodology.published_at), "d 'de' MMMM yyyy", {
        locale: es,
      })
    : "—";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline:
      "Metodología, autoría y evidencias del ranking de hosting en Chile",
    author: {
      "@type": "Organization",
      name: "Elige Tu Hosting",
      url: "https://eligetuhosting.cl",
    },
    publisher: {
      "@type": "Organization",
      name: "Elige Tu Hosting",
    },
    dateModified: methodology?.published_at,
    mainEntityOfPage: "https://eligetuhosting.cl/metodologia",
  };

  return (
    <>
      <DynamicMetaTags
        title="Metodología, autoría y evidencias | EligeTuHosting.cl"
        description="Cómo medimos, calculamos y publicamos el ranking de hosting en Chile. Fórmula, fuentes verificables, autoría editorial y descarga abierta de datos."
        canonical="https://eligetuhosting.cl/metodologia"
        keywords="metodología hosting, ranking transparente, evidencias, autoría editorial"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <div className="container mx-auto px-4 pt-8">
        <SEOBreadcrumbs
          items={[{ name: "Metodología", href: "/metodologia" }]}
        />
      </div>

      <main className="container mx-auto px-4 py-10 lg:py-14">
        <header className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-4 text-sm font-semibold">
            <Shield className="h-4 w-4" aria-hidden />
            Documento vivo · v{methodology?.version ?? "—"}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Metodología, autoría y evidencias
          </h1>
          <p className="text-lg text-muted-foreground">
            Todo lo que medimos, cómo lo medimos, quién es responsable y dónde
            verificarlo. Sin pagos por posiciones, con datos descargables.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Última revisión: <strong>{lastReviewed}</strong>
          </p>
        </header>

        <div className="grid lg:grid-cols-[220px_1fr] gap-10">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <details open className="lg:open lg:[&_summary]:hidden">
              <summary className="cursor-pointer font-semibold mb-3 min-h-[44px] flex items-center">
                Contenido
              </summary>
              <nav aria-label="Índice de la metodología">
                <ol className="space-y-2 text-sm">
                  {SECTIONS.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-muted-foreground hover:text-primary block py-1.5 min-h-[36px]"
                      >
                        {String(i + 1).padStart(2, "0")}. {s.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>
          </aside>

          <div className="space-y-12 max-w-3xl [&_section]:scroll-mt-24">
            {/* 1. Resumen */}
            <section id="resumen">
              <h2 className="text-2xl font-bold mb-3">1. Resumen ejecutivo</h2>
              <p className="text-muted-foreground">
                Evaluamos proveedores de hosting en Chile combinando{" "}
                <strong>mediciones automatizadas</strong> (uptime cada hora,
                benchmarks Lighthouse mensuales), <strong>reputación pública</strong>{" "}
                (Reclamos.cl, reseñas verificadas) y <strong>curaduría editorial</strong>{" "}
                (verificación legal, soporte, transparencia). El ranking solo
                muestra empresas marcadas como verificadas y curadas, con score
                ≥ 7.0.
              </p>
            </section>

            {/* 2. Autoría */}
            <section id="autoria">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" aria-hidden />
                2. Autoría y responsabilidad editorial
              </h2>
              <Card>
                <CardContent className="pt-6 space-y-3 text-sm">
                  <div>
                    <strong>Editor responsable:</strong> Equipo Elige Tu Hosting
                  </div>
                  <div>
                    <strong>Contacto editorial:</strong>{" "}
                    <Link to="/contacto" className="text-primary underline">
                      /contacto
                    </Link>
                  </div>
                  <div>
                    <strong>Última revisión:</strong> {lastReviewed}
                  </div>
                  <div className="pt-2 border-t">
                    <strong>Independencia:</strong> No aceptamos pagos por
                    posiciones del ranking. Algunos enlaces a proveedores
                    pueden ser de afiliado; esto se declara en cada ficha y{" "}
                    <strong>nunca</strong> influye en la posición.
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 3. Fuentes */}
            <section id="fuentes">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" aria-hidden />
                3. Fuentes de datos y evidencias
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-md">
                  <thead className="bg-muted">
                    <tr className="text-left">
                      <th className="p-3">Fuente</th>
                      <th className="p-3">Para qué</th>
                      <th className="p-3">Verificable en</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3 font-medium">Reclamos.cl</td>
                      <td className="p-3">Reputación / reclamos</td>
                      <td className="p-3">
                        <a
                          href="https://www.reclamos.cl"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary inline-flex items-center gap-1"
                        >
                          reclamos.cl <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">uptime_pings</td>
                      <td className="p-3">Disponibilidad cada hora</td>
                      <td className="p-3">
                        <a
                          href={exportUrl}
                          className="text-primary inline-flex items-center gap-1"
                        >
                          export JSON <Download className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">benchmark_results</td>
                      <td className="p-3">TTFB · Lighthouse · headers</td>
                      <td className="p-3">
                        <Link
                          to="/metodologia-benchmark"
                          className="text-primary"
                        >
                          /metodologia-benchmark
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Curaduría OSINT</td>
                      <td className="p-3">
                        Verificación legal y técnica
                      </td>
                      <td className="p-3">
                        <Link
                          to="/transparencia-hosting-chile"
                          className="text-primary"
                        >
                          transparencia
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">NIC Chile / WHOIS</td>
                      <td className="p-3">Antigüedad de dominio</td>
                      <td className="p-3">
                        <a
                          href="https://www.nic.cl"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary inline-flex items-center gap-1"
                        >
                          nic.cl <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3.b Criterios de reputación */}
            <section id="reputacion" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-3">3.b Criterios de reputación verificada</h2>
              <ul className="list-disc list-inside text-sm space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Reseña verificada:</strong> usuario autenticado + email confirmado +
                  marcado <code>is_verified_customer</code> con prueba (factura, captura del panel o dominio activo).
                </li>
                <li>
                  <strong className="text-foreground">Reclamo interno verificado:</strong> envío con email confirmado vía token de 48 h
                  y aprobación editorial (estado <code>verified</code> o <code>resolved</code>).
                </li>
                <li>
                  <strong className="text-foreground">Reclamo externo:</strong> resultados de Google
                  <code className="mx-1">site:reclamos.cl &quot;proveedor&quot;</code>; las URLs exactas se citan en cada ficha.
                </li>
                <li>
                  <strong className="text-foreground">Score reputacional:</strong> análisis automatizado mensual del texto de
                  Reclamos.cl ponderado con la cuenta de reclamos internos verificados (1 = pésimo, 10 = excelente).
                </li>
              </ul>
            </section>

            {/* 4. Cálculo */}
            <section id="calculo">
              <h2 className="text-2xl font-bold mb-3">
                4. Cómo se calcula el ranking
              </h2>
              <RankingFormulaBlock variant="full" />
            </section>

            {/* 5. Ejemplo */}
            <section id="ejemplo">
              <h2 className="text-2xl font-bold mb-3">5. Ejemplo trabajado</h2>
              {top?.company ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      #1 actual: {top.company.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Datos vivos desde la base de datos pública.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <tbody className="divide-y">
                        {RANKING_FACTORS.map((f) => {
                          const v =
                            f.key === "speed"
                              ? top.benchmark?.lighthouse_perf
                                ? (top.benchmark.lighthouse_perf / 10).toFixed(1)
                                : "—"
                              : f.key === "uptime"
                              ? top.benchmark?.uptime_30d_pct
                                ? `${top.benchmark.uptime_30d_pct}%`
                                : "—"
                              : f.key === "support"
                              ? top.company.support_rating
                                ? Number(top.company.support_rating).toFixed(1)
                                : "—"
                              : f.key === "price"
                              ? top.company.price_rating
                                ? Number(top.company.price_rating).toFixed(1)
                                : "—"
                              : top.company.overall_rating
                              ? Number(top.company.overall_rating).toFixed(1)
                              : "—";
                          return (
                            <tr key={f.key}>
                              <td className="py-2">{f.label}</td>
                              <td className="py-2 text-right text-muted-foreground">
                                peso {f.weight}%
                              </td>
                              <td className="py-2 text-right font-mono font-semibold">
                                {v}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-muted/50">
                          <td className="py-2 font-semibold">Score compuesto</td>
                          <td />
                          <td className="py-2 text-right font-mono font-bold text-primary">
                            {top.benchmark?.composite_score
                              ? Number(top.benchmark.composite_score).toFixed(2)
                              : Number(top.company.overall_rating).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Cargando ejemplo…
                </p>
              )}
            </section>

            {/* 6. Frecuencia */}
            <section id="frecuencia">
              <h2 className="text-2xl font-bold mb-3">
                6. Frecuencia y versionado
              </h2>
              <ul className="space-y-2 text-sm list-disc pl-5">
                <li>
                  <strong>Uptime:</strong> ping cada hora (cron pg_cron + pg_net).
                </li>
                <li>
                  <strong>Benchmark profundo:</strong> mensual (día 1) + manual
                  desde panel admin.
                </li>
                <li>
                  <strong>Curaduría editorial:</strong> revisión trimestral.
                </li>
                <li>
                  <strong>Versión vigente:</strong>{" "}
                  <Badge variant="secondary">
                    v{methodology?.version ?? "—"}
                  </Badge>
                </li>
              </ul>
            </section>

            {/* 7. Changelog */}
            <section id="changelog">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <History className="h-5 w-5 text-primary" aria-hidden />
                7. Cambios y changelog
              </h2>
              {changelog && changelog.length > 0 ? (
                <ul className="border rounded-md divide-y text-sm">
                  {changelog.map((c) => (
                    <li
                      key={c.version}
                      className="p-3 flex items-center justify-between"
                    >
                      <span className="font-mono">v{c.version}</span>
                      <span className="text-muted-foreground">
                        {format(new Date(c.published_at), "d MMM yyyy", {
                          locale: es,
                        })}
                      </span>
                      {c.is_current && <Badge>Vigente</Badge>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">Sin cambios aún.</p>
              )}
            </section>

            {/* 8. Documentos */}
            <section id="documentos">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" aria-hidden />
                8. Documentos y descargas
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="min-h-[44px] justify-start"
                >
                  <a href={exportUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" aria-hidden />
                    Exportar últimos resultados (JSON)
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="min-h-[44px] justify-start"
                >
                  <Link to="/metodologia-benchmark">
                    <FileText className="h-4 w-4 mr-2" aria-hidden />
                    Metodología técnica del benchmark
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="min-h-[44px] justify-start"
                >
                  <Link to="/transparencia-hosting-chile">
                    <Shield className="h-4 w-4 mr-2" aria-hidden />
                    Política de transparencia
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="min-h-[44px] justify-start"
                >
                  <Link to="/nuestro-metodo">
                    <FileText className="h-4 w-4 mr-2" aria-hidden />
                    Proceso editorial
                  </Link>
                </Button>
              </div>

              {methodology?.markdown && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Documento metodológico vigente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{methodology.markdown}</ReactMarkdown>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* 9. Limitaciones */}
            <section id="limitaciones">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" aria-hidden />
                9. Limitaciones
              </h2>
              <ul className="space-y-2 text-sm list-disc pl-5 text-muted-foreground">
                <li>
                  Uptime se mide desde edge de Supabase, no replica latencia
                  desde todos los ISP chilenos.
                </li>
                <li>
                  Benchmarks Lighthouse son sintéticos; no reemplazan medición
                  real de usuarios (RUM).
                </li>
                <li>
                  Reclamos.cl puede contener denuncias no verificadas; las
                  ponderamos solo cuando hay evidencia.
                </li>
                <li>
                  Precio se calcula sobre planes de entrada publicados; no
                  cubre negociaciones privadas.
                </li>
              </ul>
            </section>

            {/* 10. Contacto */}
            <section id="contacto">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" aria-hidden />
                10. Correcciones
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                ¿Detectaste un error o tienes evidencia adicional? Escríbenos
                y revisaremos en menos de 5 días hábiles.
              </p>
              <Button asChild className="min-h-[44px]">
                <Link to="/contacto?asunto=Correcci%C3%B3n+metodolog%C3%ADa">
                  Reportar corrección
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Metodologia;
