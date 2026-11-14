import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check, ChevronDown, Loader2, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/system/PageHeader";
import Section from "@/components/system/Section";
import Callout from "@/components/system/Callout";
import SeoAuditResult from "@/components/herramientas/SeoAuditResult";
import { useSeoMiniAudit } from "@/components/herramientas/useSeoMiniAudit";
import { CHECKS, FAQS, PLANS, SCORE_WEIGHTS } from "@/components/herramientas/seoAuditContent";

export default function SeoAudit() {
  const [domain, setDomain] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { loading, result, checkedAt, error, run } = useSeoMiniAudit();

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!domain.trim()) {
      setFieldError("Escribe un dominio, por ejemplo tudominio.cl.");
      return;
    }
    setFieldError(null);
    run(domain);
  };

  const form = (
    <form onSubmit={submit} noValidate className="w-full max-w-2xl">
      <label htmlFor="seo-audit-dominio" className="t-label">Tu dominio</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Input
          id="seo-audit-dominio"
          placeholder="tudominio.cl"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          value={domain}
          onChange={(e) => {
            setDomain(e.target.value);
            setFieldError(null);
          }}
          disabled={loading}
          aria-invalid={!!fieldError}
          aria-describedby={fieldError ? "seo-audit-error seo-audit-ayuda" : "seo-audit-ayuda"}
          className="sm:flex-1"
        />
        <Button type="submit" variant="brand" disabled={loading}>
          {loading ? <Loader2 aria-hidden className="animate-spin" /> : <Search aria-hidden />}
          Auditar gratis
        </Button>
      </div>
      {fieldError && (
        <p id="seo-audit-error" role="alert" className="t-small mt-2 flex items-start gap-2 text-ink">
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" />
          {fieldError}
        </p>
      )}
      <p id="seo-audit-ayuda" className="t-meta mt-2">Sin registro, 10 análisis gratis por día y tu dominio queda confidencial.</p>
    </form>
  );

  return (
    <div className="min-h-screen bg-white text-ink">
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

      <main>
        <PageHeader
          title="Auditoría SEO Profesional con datos verificables"
          lead="Descubre por qué tu sitio no rankea. Reporte completo con 40+ checks técnicos, keywords reales, backlinks y comparativa con competidores. Mini-audit gratis en 30 segundos."
          actions={form}
          meta={<span>Datos reales de Google Chile vía DataForSEO y PageSpeed Insights.</span>}
        />

        {(loading || error || result) && (
          <Section density="tight" aria-label="Resultado del mini-audit" className="border-b border-rule">
            <div aria-live="polite">
              {loading && (
                <p className="t-small flex items-center gap-2 text-ink-2" role="status">
                  <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                  Analizando {domain.trim()}. Tarda unos segundos.
                </p>
              )}
              {!loading && error && (
                <Callout tone="caution" title="No pudimos completar el análisis" className="my-0 max-w-[62ch]">
                  <p>{error}</p>
                  {domain.trim() && (
                    <Button variant="default" className="mt-3" onClick={() => run(domain)}>
                      <RefreshCw aria-hidden />
                      Reintentar
                    </Button>
                  )}
                </Callout>
              )}
              {!loading && result && <SeoAuditResult result={result} checkedAt={checkedAt} />}
            </div>
          </Section>
        )}

        <Section title="40+ checks en cada auditoría" lead="Todo lo que tu sitio necesita para rankear en Google, en un solo informe accionable.">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CHECKS.map((c) => (
              <li key={c.title} className="rounded-xl border border-rule bg-white p-5">
                <h3 className="t-h3 flex items-center gap-2 text-ink">
                  <c.icon aria-hidden className="h-5 w-5 text-ink-2" />
                  {c.title}
                </h3>
                <ul className="t-small mt-3 space-y-1.5 text-ink-2">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check aria-hidden className="h-4 w-4 shrink-0 text-ink-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="planes" tone="paper" title="Planes de suscripción" lead="Cancela cuando quieras, garantía de 14 días y sin permanencia.">
          <ul className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <li key={plan.id} className={`flex flex-col rounded-xl bg-white p-6 ${plan.highlight ? "border-2 border-ink" : "border border-rule"}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="t-h3 text-ink">{plan.name}</h3>
                  {plan.highlight && <Badge variant="ink">Más popular</Badge>}
                </div>
                <p className="t-small mt-1 text-ink-2">{plan.description}</p>
                <p className="mt-4">
                  <span className="tabular text-4xl font-extrabold text-ink">${plan.price}</span>
                  <span className="t-small text-ink-3"> CLP/mes</span>
                </p>
                <ul className="t-small mt-5 flex-1 space-y-2 text-ink-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full" variant={plan.highlight ? "default" : "outline"}>
                  <Link to="/auth">
                    {plan.cta}
                    <span className="sr-only"> con el plan {plan.name}</span>
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="¿Cómo calculamos tu score?" lead="Metodología transparente y pública. Sin cajas negras.">
          <p className="tabular measure rounded-xl border border-rule bg-paper p-4 text-ink">
            Score total = 0,30 × Técnico + 0,25 × Contenido + 0,20 × Backlinks + 0,15 × UX + 0,10 × SERP
          </p>
          <dl className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
            {SCORE_WEIGHTS.map((w) => (
              <div key={w.label} className="flex gap-3">
                <w.icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" />
                <div>
                  <dt className="font-semibold text-ink">{w.label} ({w.weight})</dt>
                  <dd className="t-small text-ink-2">{w.detail}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Section>

        <Section tone="paper" title="Preguntas frecuentes">
          <div className="measure divide-y divide-rule border-y border-rule">
            {FAQS.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 py-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <ChevronDown aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-ink-2 transition-transform group-open:rotate-180" />
                </summary>
                <p className="t-body pb-4 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section tone="ink" title="¿Listo para subir en Google?">
          <p className="-mt-4 mb-6 max-w-[62ch] text-lg leading-relaxed text-white/75 md:-mt-6">
            Empieza con un mini-audit gratis o suscríbete y recibe tu primer informe completo en 5 minutos.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary" size="lg">
              <a href="#planes">Ver planes<ArrowRight aria-hidden /></a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">Crear cuenta</Link>
            </Button>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
