/**
 * Contenido fijo de /seo-audit (planes, qué revisa y preguntas frecuentes).
 * Se movió tal cual desde pages/SeoAudit.tsx: precios y promesas comerciales
 * son decisiones de negocio y no se cambian aquí.
 */
import { FileText, Link2, Shield, Smartphone, TrendingUp, Zap, type LucideIcon } from 'lucide-react';

export interface SeoPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

export const PLANS: SeoPlan[] = [
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

export const CHECKS: { icon: LucideIcon; title: string; items: string[] }[] = [
  { icon: Shield, title: "Auditoría técnica", items: ["HTTPS / SSL", "Robots.txt y sitemap", "Canonical tags", "Hreflang", "Status codes", "Indexabilidad"] },
  { icon: FileText, title: "On-page SEO", items: ["Title tags", "Meta descriptions", "Estructura H1-H6", "Densidad keywords", "Alt en imágenes", "Schema.org JSON-LD"] },
  { icon: Zap, title: "Core Web Vitals", items: ["LCP, FID, CLS", "Performance Score", "Tiempo de carga", "Tamaño de página", "Recursos bloqueantes", "Compresión Brotli/Gzip"] },
  { icon: Link2, title: "Backlinks", items: ["Total backlinks", "Referring domains", "Anchor text", "Toxic links", "Lost links", "Competitor gap"] },
  { icon: TrendingUp, title: "Keywords y SERP", items: ["Posiciones en Google CL", "Volumen y CPC", "Keyword difficulty", "Featured snippets", "People Also Ask", "Histórico ranking"] },
  { icon: Smartphone, title: "Mobile y UX", items: ["Mobile-friendly", "Viewport correcto", "Tap targets", "Texto legible", "Accesibilidad WCAG", "Best practices"] },
];

export const FAQS = [
  { q: "¿Qué datos usan para los reportes?", a: "Usamos DataForSEO (mismo proveedor que Semrush para sus datos), Google PageSpeed Insights, Google Search Console (opcional) y nuestro propio crawler. Todos los datos provienen de fuentes verificables, nunca inventamos cifras." },
  { q: "¿En cuánto tiempo recibo mi primer informe?", a: "El mini-audit gratuito tarda menos de 30 segundos. La auditoría completa tras la suscripción se entrega en menos de 5 minutos en tu dashboard, y se reprograma automáticamente según tu plan (mensual/semanal/diario)." },
  { q: "¿Puedo cambiar de plan?", a: "Sí, puedes hacer upgrade o downgrade en cualquier momento desde tu dashboard. Los cambios prorratean automáticamente." },
  { q: "¿Cubren mercados fuera de Chile?", a: "Sí. Por defecto trabajamos con Google Chile (location_code 2152) en español, pero puedes configurar cualquier país e idioma soportados por DataForSEO (190+ países)." },
  { q: "¿Hay permanencia?", a: "No. Mes a mes, cancelas cuando quieras con un click. Garantía de devolución 14 días si no estás conforme." },
  { q: "¿Qué pasa si tengo dudas técnicas sobre el informe?", a: "Todos los issues incluyen una recomendación accionable. En planes Pro y Agency tienes soporte prioritario por email para consultar dudas específicas." },
];

/** Gravedad de cada problema, en español. */
export const SEVERITY_LABEL: Record<string, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
  info: "Informativo",
};

/** Pesos del puntaje total, tal como se publican en la página. */
export const SCORE_WEIGHTS: { icon: LucideIcon; label: string; weight: string; detail: string }[] = [
  { icon: Shield, label: "Técnico", weight: "30 %", detail: "HTTPS, canonical, schema, viewport, indexabilidad" },
  { icon: FileText, label: "Contenido", weight: "25 %", detail: "Titles, descriptions, H1-H6, alt text, longitud" },
  { icon: Link2, label: "Backlinks", weight: "20 %", detail: "Total links, referring domains, autoridad, spam score" },
  { icon: Zap, label: "UX", weight: "15 %", detail: "Core Web Vitals, performance, accesibilidad" },
  { icon: TrendingUp, label: "SERP", weight: "10 %", detail: "Keywords rankeando, posiciones, traffic share, featured snippets" },
];
