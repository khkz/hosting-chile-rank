import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Search, Loader2, CheckCircle2, XCircle, AlertTriangle, TrendingUp,
  Shield, Zap, Smartphone, FileText, Link2, BarChart3, Crown, Sparkles,
  ArrowRight, Lock, Globe, Target,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface MiniAuditResult {
  domain: string;
  scores: { total: number; technical: number; content: number; backlinks: number; ux: number; serp: number };
  onpage: any;
  performance: any;
  keywords: any;
  issues: Array<{ severity: string; category: string; title: string; recommendation: string }>;
  data_sources: { pagespeed: boolean; dataforseo: boolean };
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "border border-ink bg-white text-ink",
  medium: "bg-paper-deep text-ink",
  low: "bg-paper text-ink-2",
  info: "bg-paper text-ink-3",
};

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "19.990",
    description: "Para sitios pequeños y proyectos personales",
    features: [
      "1 dominio monitoreado",
      "Auditoría mensual completa",
      "50 keywords trackeadas",
      "PageSpeed + Core Web Vitals",
      "Reporte PDF descargable",
      "Alertas por email",
    ],
    cta: "Comenzar",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "49.990",
    description: "Para negocios y agencias en crecimiento",
    features: [
      "5 dominios monitoreados",
      "Auditoría semanal",
      "500 keywords trackeadas",
      "Análisis de competidores",
      "Backlinks profile",
      "Histórico 12 meses",
      "PDF white-label",
      "Soporte prioritario",
    ],
    cta: "Comenzar prueba",
    highlight: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: "149.990",
    description: "Para agencias SEO y equipos",
    features: [
      "25 dominios monitoreados",
      "Auditoría diaria",
      "5.000 keywords trackeadas",
      "API access",
      "White-label completo",
      "Múltiples usuarios",
      "Onboarding 1-a-1",
      "SLA 99.9%",
    ],
    cta: "Hablar con ventas",
    highlight: false,
  },
];

const CHECKS = [
  { icon: Shield, title: "Auditoría Técnica", items: ["HTTPS / SSL", "Robots.txt y sitemap", "Canonical tags", "Hreflang", "Status codes", "Indexabilidad"] },
  { icon: FileText, title: "On-Page SEO", items: ["Title tags", "Meta descriptions", "Estructura H1-H6", "Densidad keywords", "Alt en imágenes", "Schema.org JSON-LD"] },
  { icon: Zap, title: "Core Web Vitals", items: ["LCP, FID, CLS", "Performance Score", "Tiempo de carga", "Tamaño de página", "Recursos bloqueantes", "Compresión Brotli/Gzip"] },
  { icon: Link2, title: "Backlinks", items: ["Total backlinks", "Referring domains", "Anchor text", "Toxic links", "Lost links", "Competitor gap"] },
  { icon: TrendingUp, title: "Keywords & SERP", items: ["Posiciones en Google CL", "Volumen y CPC", "Keyword difficulty", "Featured snippets", "People Also Ask", "Histórico ranking"] },
  { icon: Smartphone, title: "Mobile & UX", items: ["Mobile-friendly", "Viewport correcto", "Tap targets", "Texto legible", "Accesibilidad WCAG", "Best practices"] },
];

const FAQS = [
  { q: "¿Qué datos usan para los reportes?", a: "Usamos DataForSEO (mismo proveedor que Semrush para sus datos), Google PageSpeed Insights, Google Search Console (opcional) y nuestro propio crawler. Todos los datos provienen de fuentes verificables, nunca inventamos cifras." },
  { q: "¿En cuánto tiempo recibo mi primer informe?", a: "El mini-audit gratuito tarda menos de 30 segundos. La auditoría completa tras la suscripción se entrega en menos de 5 minutos en tu dashboard, y se reprograma automáticamente según tu plan (mensual/semanal/diario)." },
  { q: "¿Puedo cambiar de plan?", a: "Sí, puedes hacer upgrade o downgrade en cualquier momento desde tu dashboard. Los cambios prorratean automáticamente." },
  { q: "¿Cubren mercados fuera de Chile?", a: "Sí. Por defecto trabajamos con Google Chile (location_code 2152) en español, pero puedes configurar cualquier país e idioma soportados por DataForSEO (190+ países)." },
  { q: "¿Hay permanencia?", a: "No. Mes a mes, cancelas cuando quieras con un click. Garantía de devolución 14 días si no estás conforme." },
  { q: "¿Qué pasa si tengo dudas técnicas sobre el informe?", a: "Todos los issues incluyen una recomendación accionable. En planes Pro y Agency tienes soporte prioritario por email para consultar dudas específicas." },
];

export default function SeoAudit() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MiniAuditResult | null>(null);
  const { toast } = useToast();

  const runAudit = async () => {
    if (!domain.trim()) {
      toast({ title: "Ingresa un dominio", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("seo-audit-mini", {
        body: { domain: domain.trim() },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || data?.message || "Error en el análisis");
      setResult(data);

      // Save lead (silent)
      supabase.from("seo_audit_leads").insert({
        domain: data.domain,
        mini_audit_id: data.audit_id,
        mini_score: data.scores.total,
        source: "landing",
      }).then(() => null);
    } catch (err: any) {
      toast({
        title: "No se pudo completar el análisis",
        description: err?.message || "Intenta de nuevo en unos segundos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Puntaje en tinta: el verde/ámbar es solo de la procedencia.
  const scoreColor = (_s: number) => "text-ink";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Auditoría SEO Profesional — Elige Tu Hosting",
    description: "Auditoría SEO completa con datos reales de Google: técnico, on-page, Core Web Vitals, keywords, backlinks y competidores.",
    brand: { "@type": "Brand", name: "Elige Tu Hosting" },
    offers: PLANS.map((p) => ({
      "@type": "Offer",
      name: `Plan ${p.name}`,
      price: p.price.replace(".", ""),
      priceCurrency: "CLP",
      availability: "https://schema.org/InStock",
      url: "https://eligetuhosting.cl/seo-audit",
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
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Auditoría SEO Profesional Chile | Elige Tu Hosting</title>
        <meta name="description" content="Auditoría SEO completa con datos reales de Google: técnico, Core Web Vitals, keywords, backlinks y competidores. Suscripción a consultar." />
        <link rel="canonical" href="https://eligetuhosting.cl/seo-audit" />
        <meta property="og:title" content="Auditoría SEO Profesional Chile" />
        <meta property="og:description" content="Auditoría SEO con datos reales de Google CL. Mini-audit gratis." />
        <meta property="og:url" content="https://eligetuhosting.cl/seo-audit" />
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navbar />

      {/* HERO */}
      <section className="relative bg-white pt-20 pb-12 lg:pt-28 lg:pb-20">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            <Sparkles aria-hidden className="w-3 h-3 mr-1" /> Datos reales de Google Chile vía DataForSEO
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Auditoría SEO Profesional
            <span className="block mt-2">con datos verificables</span>
          </h1>
          <p className="text-lg md:text-xl text-ink-3 max-w-3xl mx-auto mb-8">
            Descubre por qué tu sitio no rankea. Reporte completo con 40+ checks técnicos,
            keywords reales, backlinks y comparativa con competidores. Mini-audit gratis en 30 segundos.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white border border-rule rounded-xl">
              <Input
                placeholder="tudominio.cl"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && runAudit()}
                disabled={loading}
                className="h-14 text-lg border-0 focus-visible:ring-0 px-4"
              />
              <Button onClick={runAudit} disabled={loading} size="lg" className="h-14 px-8 text-base font-semibold">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                <span className="ml-2">Auditar GRATIS</span>
              </Button>
            </div>
            <p className="text-xs text-ink-3 mt-3">
              Sin registro, 10 análisis gratis por día y tu dominio queda confidencial.
            </p>
          </div>
        </div>
      </section>

      {/* RESULTADO DEL MINI-AUDIT */}
      {result && (
        <section className="container max-w-6xl mx-auto px-4 -mt-6 mb-16 relative z-10">
          <Card className="border overflow-hidden">
            <CardHeader className="bg-paper border-b border-rule">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-ink-3 mb-1">Mini-audit de</p>
                  <CardTitle className="text-2xl">{result.domain}</CardTitle>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${scoreColor(result.scores.total)}`}>{result.scores.total}</div>
                    <div className="text-xs text-ink-3">Score SEO</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Subscores */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Técnico", value: result.scores.technical },
                  { label: "Contenido", value: result.scores.content },
                  { label: "UX", value: result.scores.ux },
                  { label: "SERP", value: result.scores.serp },
                  { label: "Backlinks", value: result.scores.backlinks, locked: true },
                ].map((s) => (
                  <div key={s.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-3">{s.label}</span>
                      <span className={`font-bold ${s.locked ? "text-ink-3" : scoreColor(s.value)}`}>
                        {s.locked ? <Lock className="w-3 h-3 inline" /> : s.value}
                      </span>
                    </div>
                    <Progress value={s.locked ? 0 : s.value} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Performance card */}
              {result.performance && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-paper/40 rounded-xl">
                  <div><div className="text-xs text-ink-3">Performance</div><div className={`text-2xl font-bold ${scoreColor(result.performance.performance)}`}>{result.performance.performance}</div></div>
                  <div><div className="text-xs text-ink-3">LCP</div><div className="text-2xl font-bold">{(result.performance.lcp_ms / 1000).toFixed(1)}s</div></div>
                  <div><div className="text-xs text-ink-3">CLS</div><div className="text-2xl font-bold">{result.performance.cls}</div></div>
                  <div><div className="text-xs text-ink-3">SEO Lighthouse</div><div className={`text-2xl font-bold ${scoreColor(result.performance.seo)}`}>{result.performance.seo}</div></div>
                </div>
              )}

              {/* Keywords */}
              {result.keywords && result.keywords.top?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-ink-2" /> Top keywords en Google Chile</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs text-ink-3 border-b">
                        <tr><th className="py-2 pr-4">Keyword</th><th className="py-2 pr-4">Posición</th><th className="py-2 pr-4">Volumen</th><th className="py-2 pr-4">CPC</th><th className="py-2">Dificultad</th></tr>
                      </thead>
                      <tbody>
                        {result.keywords.top.map((k: any, i: number) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2 pr-4 font-medium">{k.keyword}</td>
                            <td className="py-2 pr-4"><Badge variant={k.position <= 3 ? "default" : k.position <= 10 ? "secondary" : "outline"}>#{k.position}</Badge></td>
                            <td className="py-2 pr-4">{k.search_volume?.toLocaleString() ?? "-"}</td>
                            <td className="py-2 pr-4">${k.cpc?.toFixed(2) ?? "-"}</td>
                            <td className="py-2">{k.difficulty ?? "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {result.keywords.total_keywords > 5 && (
                    <p className="text-xs text-ink-3 mt-2">
                      Mostrando 5 de {result.keywords.total_keywords.toLocaleString()} keywords totales. Suscríbete para ver todas.
                    </p>
                  )}
                </div>
              )}

              {/* Issues */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-ink-2" /> Problemas detectados ({result.issues.length})</h3>
                <div className="space-y-2">
                  {result.issues.slice(0, 5).map((issue, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Badge className={SEVERITY_COLORS[issue.severity]}>{issue.severity}</Badge>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{issue.title}</div>
                        <div className="text-xs text-ink-3 mt-0.5">{issue.recommendation}</div>
                      </div>
                    </div>
                  ))}
                  {result.issues.length > 5 && (
                    <div className="relative p-4 border-2 border-dashed rounded-lg bg-paper/30 text-center">
                      <Lock className="w-5 h-5 mx-auto mb-2 text-ink-3" />
                      <p className="text-sm font-medium">+{result.issues.length - 5} problemas adicionales</p>
                      <p className="text-xs text-ink-3 mb-3">Más backlinks, competidores y plan de acción priorizado</p>
                      <Button asChild size="sm"><a href="#planes">Ver informe completo</a></Button>
                    </div>
                  )}
                </div>
              </div>

              {!result.data_sources.dataforseo && (
                <div className="text-xs text-ink-3 p-3 border border-rule rounded-lg bg-paper">
                  ⓘ Mini-audit corriendo sin datos SERP en vivo. El informe completo tras suscripción incluye keywords y backlinks reales de DataForSEO.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* QUÉ INCLUYE */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">40+ checks en cada auditoría</h2>
          <p className="text-lg text-ink-3 max-w-2xl mx-auto">
            Todo lo que tu sitio necesita para rankear en Google, en un solo informe accionable.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHECKS.map((c) => (
            <Card key={c.title} className="border transition-colors hover:border-ink/30">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-paper flex items-center justify-center mb-3">
                  <c.icon className="w-6 h-6 text-ink-2" />
                </div>
                <CardTitle className="text-xl">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 aria-hidden className="w-4 h-4 text-ink-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="bg-paper/30 py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planes de suscripción</h2>
            <p className="text-lg text-ink-3">Cancela cuando quieras, garantía de 14 días y sin permanencia.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.highlight ? "border-2 border-ink" : "border"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-ink text-white px-3 py-1"><Crown className="w-3 h-3 mr-1" /> Más popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-sm text-ink-3">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-ink-3"> CLP/mes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 aria-hidden className="w-4 h-4 text-ink-2 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={plan.highlight ? "default" : "outline"} size="lg">
                    <Link to="/auth">{plan.cta} <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* METODOLOGÍA */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo calculamos tu score?</h2>
          <p className="text-lg text-ink-3">
            Metodología transparente y pública. Sin cajas negras.
          </p>
        </div>
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="tabular text-sm md:text-base bg-paper border border-rule p-4 rounded-xl mb-6">
              Score total = 0,30 × Técnico + 0,25 × Contenido + 0,20 × Backlinks + 0,15 × UX + 0,10 × SERP
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3"><Shield className="w-5 h-5 text-ink-2 flex-shrink-0" /><div><b>Técnico (30%)</b><p className="text-ink-3">HTTPS, canonical, schema, viewport, indexabilidad</p></div></div>
              <div className="flex gap-3"><FileText className="w-5 h-5 text-ink-2 flex-shrink-0" /><div><b>Contenido (25%)</b><p className="text-ink-3">Titles, descriptions, H1-H6, alt text, longitud</p></div></div>
              <div className="flex gap-3"><Link2 className="w-5 h-5 text-ink-2 flex-shrink-0" /><div><b>Backlinks (20%)</b><p className="text-ink-3">Total links, referring domains, autoridad, spam score</p></div></div>
              <div className="flex gap-3"><Zap className="w-5 h-5 text-ink-2 flex-shrink-0" /><div><b>UX (15%)</b><p className="text-ink-3">Core Web Vitals, performance, accesibilidad</p></div></div>
              <div className="flex gap-3 md:col-span-2"><BarChart3 className="w-5 h-5 text-ink-2 flex-shrink-0" /><div><b>SERP (10%)</b><p className="text-ink-3">Keywords rankeando, posiciones, traffic share, featured snippets</p></div></div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="bg-paper/30 py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <Card key={f.q}>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">{f.q}</h3>
                  <p className="text-sm text-ink-3">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <Globe className="w-12 h-12 text-ink-2 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para subir en Google?</h2>
        <p className="text-lg text-ink-3 mb-6">Empieza con un mini-audit gratis o suscríbete y recibe tu primer informe completo en 5 minutos.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild><a href="#planes">Ver planes <ArrowRight className="w-4 h-4 ml-1" /></a></Button>
          <Button size="lg" variant="outline" asChild><Link to="/auth">Crear cuenta</Link></Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
