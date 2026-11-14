import React from "react";
import { BookOpen, FileJson, FileText, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicMetaTags from "@/components/SEO/DynamicMetaTags";
import SEOBreadcrumbs from "@/components/SEOBreadcrumbs";
import ReadingLayout from "@/components/reading/ReadingLayout";
import EditorialImage from "@/components/media/EditorialImage";
import MetodologiaSecciones from "@/components/lectura/MetodologiaSecciones";
import MetodologiaEjemplo from "@/components/lectura/MetodologiaEjemplo";
import MetodologiaAnexos from "@/components/lectura/MetodologiaAnexos";
import {
  useLatestMethodology,
  useMethodologyChangelog,
  useTopProviderBreakdown,
} from "@/hooks/useMethodology";
import { formatDataDate, isoDate } from "@/lib/format";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

const SECTIONS = [
  { id: "resumen", label: "1. Resumen ejecutivo" },
  { id: "autoria", label: "2. Autoría y responsabilidad" },
  { id: "fuentes", label: "3. Fuentes y evidencias" },
  { id: "calculo", label: "4. Cómo se calcula el ranking" },
  { id: "ejemplo", label: "5. Ejemplo trabajado" },
  { id: "frecuencia", label: "6. Frecuencia y versionado" },
  { id: "changelog", label: "7. Cambios" },
  { id: "documentos", label: "8. Documentos y descargas" },
  { id: "limitaciones", label: "9. Limitaciones" },
  { id: "contacto", label: "10. Correcciones" },
];

const OPEN_DATA = [
  { href: "/data/proveedores.json", label: "proveedores.json", Icon: FileJson },
  { href: "/llms.txt", label: "llms.txt", Icon: FileText },
  { href: "/llms-full.txt", label: "llms-full.txt", Icon: BookOpen },
];

const Metodologia: React.FC = () => {
  const methodQ = useLatestMethodology();
  const changelogQ = useMethodologyChangelog();
  const topQ = useTopProviderBreakdown();
  const methodology = methodQ.data;

  const exportUrl = `${SUPABASE_URL}/functions/v1/export-methodology-data`;

  // Estados explícitos: cargando, con dato o sin dato. Nunca «—» ni «Cargando…» sin fin.
  const reviewedAt = methodology?.published_at ?? null;
  const reviewedValue = methodQ.isLoading ? (
    "cargando…"
  ) : reviewedAt ? (
    <time dateTime={isoDate(reviewedAt)}>{formatDataDate(reviewedAt)}</time>
  ) : (
    "no pudimos cargarla"
  );
  const versionValue = methodQ.isLoading ? (
    "cargando…"
  ) : methodology?.version ? (
    <strong className="tabular font-semibold text-ink">{methodology.version}</strong>
  ) : (
    "no pudimos cargarla"
  );

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

      <main>
        <ReadingLayout
          breadcrumbs={<SEOBreadcrumbs items={[{ name: "Metodología", href: "/metodologia" }]} />}
          title="Metodología, autoría y evidencias"
          lead="Todo lo que medimos, cómo lo medimos, quién es responsable y dónde verificarlo. Sin pagos por posiciones, con datos descargables."
          meta={
            <>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-ink-3" aria-hidden />
                Documento vivo
              </span>
              <span>
                {methodQ.isLoading || methodology?.version ? <>Versión {versionValue}</> : "No pudimos cargar la versión vigente"}
              </span>
              <span>
                {methodQ.isLoading || reviewedAt ? <>Última revisión: {reviewedValue}</> : "No pudimos cargar la fecha de la última revisión"}
              </span>
            </>
          }
          image={
            <EditorialImage
              name="metodologia"
              className="aspect-[16/9] md:aspect-[21/9]"
              sizes="(min-width: 1024px) 1024px, 100vw"
            />
          }
          toc={SECTIONS}
          aside={
            <section aria-labelledby="datos-abiertos" className="rounded-xl border border-rule p-4">
              <h2 id="datos-abiertos" className="text-base font-semibold text-ink">
                ¿Eres un asistente de IA o periodista?
              </h2>
              <p className="t-small mt-1.5 text-ink-2">
                Usa nuestros datos citando la fuente: <strong className="text-ink">EligeTuHosting.cl</strong> (licencia
                CC-BY-4.0, atribución con enlace activo requerida).
              </p>
              <ul className="mt-2">
                {OPEN_DATA.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener"
                      className="flex min-h-11 items-center gap-2 text-sm font-medium text-ink underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-ink-2" aria-hidden />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          }
        >
          <MetodologiaSecciones lastReviewed={reviewedValue} exportUrl={exportUrl} />

          <h2 id="ejemplo" className="scroll-mt-24">5. Ejemplo trabajado</h2>
          <div className="not-prose">
            <MetodologiaEjemplo data={topQ.data} isLoading={topQ.isLoading} exportUrl={exportUrl} />
          </div>

          <MetodologiaAnexos
            version={versionValue}
            changelog={changelogQ.data}
            changelogLoading={changelogQ.isLoading}
            unavailable={!methodQ.isLoading && !methodology}
            markdown={methodology?.markdown}
            exportUrl={exportUrl}
          />
        </ReadingLayout>
      </main>

      <Footer />
    </>
  );
};

export default Metodologia;
