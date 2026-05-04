import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Gauge, Server, Calculator, ExternalLink, FileCode2 } from "lucide-react";
import { Link } from "react-router-dom";

const sources = [
  {
    icon: Server,
    title: "TTFB y headers HTTP",
    desc: "Medición propia: 5 GET secuenciales con 2s de espera, mediana y p95 reportadas. Captura encabezados Server y Content-Encoding.",
    tool: "Edge Function run-benchmark (Supabase Deno)",
    link: null,
  },
  {
    icon: Gauge,
    title: "Lighthouse (Performance, SEO, Accesibilidad, LCP, CLS, FCP)",
    desc: "Google PageSpeed Insights API v5, strategy=mobile. Reproducible públicamente desde el botón de cada fila.",
    tool: "pagespeed.web.dev",
    link: "https://pagespeed.web.dev",
  },
  {
    icon: Activity,
    title: "Uptime 30 días",
    desc: "Pings HEAD (fallback GET) cada hora desde Edge Functions. Calculado como % de respuestas 2xx/3xx en los últimos 30 días.",
    tool: "Edge Function uptime-monitor + tabla uptime_pings",
    link: null,
  },
  {
    icon: Calculator,
    title: "Score compuesto",
    desc: "0,35·LighthousePerf + 0,25·TTFBscore + 0,25·Uptime + 0,15·LighthouseSEO. TTFBscore = max(0, 100 − TTFBms/10).",
    tool: "Documentado en metodología v1.0",
    link: null,
  },
];

const SourcesCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileCode2 className="w-5 h-5 text-primary" />
        De dónde vienen estos datos
      </CardTitle>
      <CardDescription>
        Cada número que ves en esta tabla proviene de una herramienta pública o de un script propio
        que cualquier persona puede auditar. No usamos cifras inventadas ni "marketing claims" del proveedor.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="grid md:grid-cols-2 gap-4">
        {sources.map((s) => (
          <li key={s.title} className="flex gap-3 p-4 rounded-lg border bg-muted/30">
            <s.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">{s.title}</p>
              <p className="text-muted-foreground mt-1">{s.desc}</p>
              <p className="text-xs mt-2 text-muted-foreground">
                Fuente: <span className="font-mono">{s.tool}</span>
                {s.link && (
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-2 text-primary hover:underline">
                    abrir <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground mt-4">
        ¿Quieres ver la fórmula completa, los pesos y los criterios de exclusión?{" "}
        <Link to="/metodologia-benchmark" className="text-primary hover:underline">Lee la metodología v1.0 →</Link>
      </p>
    </CardContent>
  </Card>
);

export default SourcesCard;
