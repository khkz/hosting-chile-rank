import React from "react";
import { Activity, Gauge, Server, Calculator, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Source {
  icon: typeof Server;
  title: string;
  desc: string;
  tool: string;
  link: string | null;
}

const sourcesFor = (version: string): Source[] => [
  {
    icon: Server,
    title: "TTFB y encabezados HTTP",
    desc: "Medición propia: 5 GET seguidos con 2 s de espera; reportamos la mediana y el p95. También guardamos los encabezados Server y Content-Encoding.",
    tool: "función run-benchmark (Supabase Edge)",
    link: null,
  },
  {
    icon: Gauge,
    title: "Lighthouse (rendimiento, SEO, accesibilidad, LCP, CLS, FCP)",
    desc: "API de Google PageSpeed Insights v5, estrategia móvil. Puedes repetirlo tú con el enlace «Reproducir» de cada fila.",
    tool: "pagespeed.web.dev",
    link: "https://pagespeed.web.dev",
  },
  {
    icon: Activity,
    title: "Uptime 30 días",
    desc: "Pings HEAD (o GET si falla) cada hora desde funciones Edge. Es el porcentaje de respuestas 2xx/3xx de los últimos 30 días.",
    tool: "función uptime-monitor y tabla uptime_pings",
    link: null,
  },
  {
    icon: Calculator,
    title: "Puntaje compuesto",
    desc: "0,35 × Lighthouse rendimiento + 0,25 × puntaje TTFB + 0,25 × uptime + 0,15 × Lighthouse SEO. Puntaje TTFB = máx(0, 100 − TTFB en ms ÷ 10).",
    tool: `documentado en la metodología ${version}`,
    link: null,
  },
];

/**
 * De dónde sale cada cifra del benchmark. Va dentro de una <Section> que pone
 * el título; aquí solo la lista y el enlace a la metodología.
 */
const SourcesCard: React.FC<{ version?: string | null }> = ({ version }) => {
  const v = version ? `v${version.replace(/^v/i, "")}` : "vigente";
  return (
    <>
      <ul className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule md:grid-cols-2">
        {sourcesFor(v).map((s) => (
          <li key={s.title} className="flex gap-3 bg-white p-5">
            <s.icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" />
            <div className="min-w-0">
              <p className="font-semibold text-ink">{s.title}</p>
              <p className="t-small mt-1 text-ink-2">{s.desc}</p>
              <p className="t-meta mt-2">
                Fuente: {s.tool}
                {s.link && (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center gap-1 font-medium text-ink underline underline-offset-4"
                  >
                    Abrir <ExternalLink aria-hidden className="h-3.5 w-3.5" />
                  </a>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="t-small mt-5 text-ink-2">
        ¿Quieres ver la fórmula completa, los pesos y los criterios de exclusión?{" "}
        <Link to="/metodologia-benchmark" className="font-medium text-ink underline underline-offset-4">
          Lee la metodología {v}
        </Link>
        .
      </p>
    </>
  );
};

export default SourcesCard;
