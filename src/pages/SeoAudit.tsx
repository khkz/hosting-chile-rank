import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Search, Zap, Shield, TrendingUp, Link as LinkIcon, FileSearch, Globe, Smartphone,
  CheckCircle2, XCircle, Loader2, BarChart3, Eye, Target, Award, ArrowRight, Sparkles, Clock, Lock
} from "lucide-react";

interface MiniAuditResult {
  domain: string;
  score: number;
  head: {
    reachable: boolean;
    https?: boolean;
    title?: string | null;
    title_length?: number;
    description?: string | null;
    description_length?: number;
    h1_count?: number;
    has_viewport?: boolean;
    has_canonical?: boolean;
    has_open_graph?: boolean;
    has_schema_org?: boolean;
    is_noindex?: boolean;
  };
  pagespeed?: {
    performance: number;
    seo: number;
    accessibility: number;
    lcp_ms: number | null;
    cls: number | null;
  } | null;
  keywords?: {
    total_keywords: number;
    top: Array<{ keyword: string; position: number; search_volume: number | null; cpc: number | null; url: string }>;
  } | null;
}

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 19990,
    tagline: "Para emprendedores y blogs",
    domains: 1,
    keywords: 50,
    frequency: "Auditoría mensual",
    features: [
      "1 dominio monitoreado",
      "50 keywords trackeadas",
      "Auditoría técnica mensual",
      "Core Web Vitals + PageSpeed",
      "On-page + meta tags",
      "Reporte PDF mensual",
      "Alertas por email",
      "Soporte por email",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 49990,
    tagline: "Para PYMEs y e-commerce",
    domains: 5,
    keywords: 500,
    frequency: "Auditoría semanal",
    features: [
      "5 dominios monitoreados",
      "500 keywords trackeadas",
      "Auditoría semanal completa",
      "Backlinks + autoridad",
      "Monitoreo de 5 competidores",
      "Análisis SERP de Google Chile",
      "Reporte PDF white-label",
      "Soporte prioritario WhatsApp",
    ],
    highlight: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 149990,
    tagline: "Para agencias y consultores",
    domains: 25,
    keywords: 5000,
    frequency: "Auditoría diaria",
    features: [
      "25 dominios monitoreados",
      "5.000 keywords trackeadas",
      "Auditoría diaria automática",
      "API completa de DataForSEO",
      "Monitoreo ilimitado competidores",
      "Reporte white-label personalizado",
      "Dashboard multi-cliente",
      "Account manager dedicado",
    ],
    highlight: false,
  },
];

const CHECKS = [
  { icon: Zap, title: "Core Web Vitals reales", desc: "LCP, CLS, FCP, TBT medidos con Lighthouse de Google" },
  { icon: Shield, title: "Seguridad SSL/HTTPS", desc: "Certificados, redirecciones, headers de seguridad" },
  { icon: FileSearch, title: "On-page completo", desc: "Title, meta, H1-H6, schema.org, Open Graph, canonical" },
  { icon: TrendingUp, title: "Ranking en Google Chile", desc: "Posición real para cada keyword del SERP local" },
  { icon: LinkIcon, title: "Perfil de backlinks", desc: "Dominios referentes, autoridad, anchor text, follow/nofollow" },
  { icon: Globe, title: "Análisis técnico", desc: "Sitemap, robots.txt, hreflang, indexabilidad, crawl errors" },
  { icon: Smartphone, title: "Mobile-first", desc: "Usabilidad móvil, viewport, tap targets, contenido legible" },
  { icon: Target, title: "Keywords y oportunidades", desc: "Volumen real, CPC, dificultad, gaps vs competidores" },
  { icon: BarChart3, title: "Comparativa competidores", desc: "Quién te gana en Google y por qué keywords" },
  { icon: Eye, title: "Contenido y E-E-A-T", desc: "Profundidad, autoría, frescura, intenciones de búsqueda" },
  { icon: Award, title: "Schema.org / Rich Results", desc: "Datos estructurados válidos para resultados enriquecidos" },
  { icon: Lock, title: "Auditoría de seguridad", desc: "Vulnerabilidades comunes, exposición de datos, headers" },
];

const FAQS = [
  { q: "¿Qué tan completos son los informes?", a: "Cada informe incluye más de 40 checks técnicos, on-page, de contenido, backlinks y SERP. Los datos vienen de fuentes verificables: Google Lighthouse (PageSpeed), DataForSEO (rankings reales en Google), y crawls técnicos en vivo. Nada inventado." },
  { q: "¿De dónde salen los datos de keywords y SERP?", a: "Usamos DataForSEO, el mismo proveedor que utilizan Semrush, Ahrefs y SE Ranking para datos crudos. Consultamos directamente la SERP de Google en Chile (location_code 2152) en español. Ningún dato es scrapeado de terceros sin licencia." },
  { q: "¿Cuánto tardo en ver el primer informe?", a: "El mini-audit gratis es instantáneo (30-60s). Tu primer informe completo se genera dentro de las 2 horas siguientes a activar la suscripción y queda disponible en tu dashboard privado." },
  { q: "¿Puedo cancelar cuando quiera?", a: "Sí. Suscripción mensual sin permanencia. Cancelas con un click desde tu dashboard y mantienes acceso hasta el fin del período pagado." },
  { q: "¿Funciona para sitios fuera de Chile?", a: "Sí. Por defecto auditamos en Google Chile, pero puedes elegir cualquier país y idioma soportado por Google (más de 180 ubicaciones)." },
  { q: "¿Incluye implementación de las mejoras?", a: "El informe entrega recomendaciones priorizadas y accionables, no implementación. Si necesitas que ejecutemos los cambios, ofrecemos servicio aparte de consultoría SEO." },
];

export default function SeoAudit() {
  const { toast } = useToast();
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MiniAuditResult | null>(null);

  const handleAudit = async () => {
    if (!domainInput.trim()) {
      toast({ title: "Ingresa un dominio", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("seo-audit-mini", {
        body: { domain: domainInput },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error ?? "Error desconocido");
      setResult(data as MiniAuditResult);
      // Scroll to results
      setTimeout(() => document.getElementById("mini-result")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      toast({
        title: "Error al auditar",
        description: e instanceof Error ? e.message : "Intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Auditoría SEO Profesional - Elige Tu Hosting",
    description: "Auditoría SEO mensual con datos reales de Google. Más de 40 checks técnicos, ranking en Google Chile, backlinks y competidores.",
    brand: { "@type": "Brand", name: "Elige Tu Hosting" },
    offers: PLANS.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price,
      priceCurrency: "CLP",
      availability: "https://schema.org/InStock",
      url: `https://eligetuhosting.cl/seo-audit#plan-${p.id}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Helmet>
        <title>Auditoría SEO Profesional Chile 2026 | Informes con datos reales de Google</title>
        <meta name="description" content="Auditoría SEO mensual desde $19.990 CLP. Datos reales de Google Chile, +40 checks técnicos, backlinks, competidores y ranking. Prueba gratis ahora." />
        <link rel="canonical" href="https://eligetuhosting.cl/seo-audit" />
        <meta property="og:title" content="Auditoría SEO Profesional Chile 2026" />
        <meta property="og:description" content="Informes SEO mensuales con datos reales de Google. Desde $19.990 CLP. Mini-audit gratis." />
        <meta property="og:url" content="https://eligetuhosting.cl/seo-audit" />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navbar />

      {/* HERO + MINI AUDIT */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" /> Datos reales de Google · Sin scraping turbio
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Auditoría SEO profesional<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">con datos reales de Google</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Más de 40 checks técnicos, ranking real en Google Chile, backlinks y comparativa de competidores.
              Empieza con un mini-audit gratis ahora.
            </p>
          </div>

          {/* Mini audit input */}
          <Card className="border-2 border-primary/20 shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ejemplo.cl"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleAudit()}
                    disabled={loading}
                    className="pl-10 h-14 text-base"
                  />
                </div>
                <Button onClick={handleAudit} disabled={loading} size="lg" className="h-14 px-8 text-base">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  <span className="ml-2">{loading ? "Analizando..." : "Auditar gratis"}</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                <Clock className="inline w-3 h-3 mr-1" />
                30 segundos · Sin registro · 10 análisis gratis por día
              </p>
            </CardContent>
          </Card>

          {/* MINI RESULT */}
          {result && (
            <div id="mini-result" className="mt-10 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-2xl">{result.domain}</CardTitle>
                      <CardDescription>Mini-auditoría SEO instantánea</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`text-5xl font-bold ${result.score >= 75 ? "text-green-600" : result.score >= 50 ? "text-amber-600" : "text-red-600"}`}>
                        {Math.round(result.score)}
                      </div>
                      <div className="text-xs text-muted-foreground">SCORE / 100</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* PageSpeed */}
                  {result.pagespeed && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2"><Zap className="w-4 h-4" />PageSpeed (móvil)</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: "Performance", v: result.pagespeed.performance },
                          { label: "SEO", v: result.pagespeed.seo },
                          { label: "Accesibilidad", v: result.pagespeed.accessibility },
                        ].map((m) => (
                          <div key={m.label}>
                            <div className="flex justify-between text-sm mb-1"><span>{m.label}</span><span className="font-mono">{m.v}</span></div>
                            <Progress value={m.v} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* On-page checks */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><FileSearch className="w-4 h-4" />Checks On-page</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {[
                        ["HTTPS habilitado", result.head.https],
                        [`Title (${result.head.title_length ?? 0} chars)`, (result.head.title_length ?? 0) >= 20 && (result.head.title_length ?? 0) <= 65],
                        [`Meta description (${result.head.description_length ?? 0} chars)`, (result.head.description_length ?? 0) >= 80 && (result.head.description_length ?? 0) <= 165],
                        [`Un único H1 (${result.head.h1_count ?? 0})`, result.head.h1_count === 1],
                        ["Viewport responsive", result.head.has_viewport],
                        ["Canonical URL", result.head.has_canonical],
                        ["Open Graph", result.head.has_open_graph],
                        ["Schema.org", result.head.has_schema_org],
                        ["Indexable por Google", !result.head.is_noindex],
                      ].map(([label, ok]) => (
                        <div key={label as string} className="flex items-center gap-2">
                          {ok ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                          <span className={ok ? "" : "text-muted-foreground"}>{label as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keywords */}
                  {result.keywords && result.keywords.top.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />Top keywords en Google Chile
                        <Badge variant="outline">{result.keywords.total_keywords} totales</Badge>
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-left text-muted-foreground border-b">
                            <tr><th className="py-2">Keyword</th><th>Pos.</th><th>Volumen</th><th>CPC</th></tr>
                          </thead>
                          <tbody>
                            {result.keywords.top.slice(0, 5).map((k, i) => (
                              <tr key={i} className="border-b border-border/50">
                                <td className="py-2 font-medium">{k.keyword}</td>
                                <td>#{k.position}</td>
                                <td>{k.search_volume ?? "—"}</td>
                                <td>{k.cpc ? `$${Number(k.cpc).toFixed(2)}` : "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {result.keywords.top.length > 5 && (
                          <div className="mt-3 p-3 bg-muted rounded-md text-sm text-center">
                            <Lock className="inline w-4 h-4 mr-1" />
                            Hay <strong>{result.keywords.total_keywords - 5}</strong> keywords más con datos completos en el informe Pro.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Upsell */}
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6 text-center">
                    <h4 className="font-bold text-lg mb-2">¿Quieres el informe completo?</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Backlinks, competidores, 40+ checks, monitoreo continuo y alertas automáticas.
                    </p>
                    <Button size="lg" asChild>
                      <a href="#planes">Ver planes desde $19.990<ArrowRight className="ml-2 w-4 h-4" /></a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* QUÉ INCLUYE */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">Cobertura del informe</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Más de 40 checks profesionales</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mismas fuentes de datos que usan agencias top: Google Lighthouse, DataForSEO, crawlers propios.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHECKS.map((c) => (
              <Card key={c.title} className="hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2"><c.icon className="w-5 h-5 text-primary" /></div>
                    <div>
                      <h3 className="font-semibold mb-1">{c.title}</h3>
                      <p className="text-sm text-muted-foreground">{c.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">Planes mensuales</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Suscripción sin permanencia</h2>
            <p className="text-muted-foreground">Cancela cuando quieras. Garantía de 14 días.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <Card key={plan.id} id={`plan-${plan.id}`} className={plan.highlight ? "border-2 border-primary shadow-xl scale-105 relative" : ""}>
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Más popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.tagline}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price.toLocaleString("es-CL")}</span>
                    <span className="text-muted-foreground"> /mes CLP</span>
                  </div>
                  <p className="text-sm text-primary font-medium mt-1">{plan.frequency}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.highlight ? "default" : "outline"} size="lg" asChild>
                    <Link to="/auth">Empezar prueba 14 días</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            Pagos seguros · Boleta electrónica automática · Cancela con un click
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3">Preguntas frecuentes</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Todo lo que necesitas saber</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <Card key={f.q}>
                <CardHeader>
                  <CardTitle className="text-lg">{f.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <CardContent className="pt-10 pb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Empieza con un mini-audit gratis</h2>
              <p className="text-muted-foreground mb-6">Sin registro. Resultados en 30 segundos.</p>
              <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Analizar mi sitio ahora <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
