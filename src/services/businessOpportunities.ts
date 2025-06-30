import type { DomainAnalysisResult } from './domainAnalysis';

export interface BusinessOpportunity {
  id: string;
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  category: 'security' | 'performance' | 'seo' | 'marketing';
  icon: string;
  cta: {
    text: string;
    url: string;
    type: 'primary' | 'secondary';
  };
  benefits: string[];
  details: {
    problem: string;
    solution: string;
    urgency: string;
  };
}

const detectIssues = (data: DomainAnalysisResult) => {
  return {
    noSSL: !data.ssl.ssl_enabled,
    slowLoadTime: data.performance.load_time_ms > 3000,
    lowPageSpeedScore: data.performance.pagespeed_score < 70,
    noMobileFriendly: false, // Placeholder
    noAnalytics: data.tech_stack.analytics_tools.length === 0
  };
};

export const generateBusinessOpportunities = (data: DomainAnalysisResult): BusinessOpportunity[] => {
  const issues = detectIssues(data);
  const opportunities: BusinessOpportunity[] = [];

  // SSL Certificate opportunity - Enhanced detection
  if (issues.noSSL || (!data.ssl.ssl_enabled && data.basic.domain)) {
    opportunities.push({
      id: 'ssl-certificate',
      title: 'Certificado SSL Requerido',
      description: 'Tu sitio web no tiene un certificado SSL válido. Esto afecta la seguridad y confianza de tus visitantes, además del SEO en Google.',
      impact: 'critical',
      category: 'security',
      icon: 'Shield',
      cta: {
        text: 'Comprar SSL en HostingPlus',
        url: 'https://clientes.hostingplus.cl/cart.php?gid=7',
        type: 'primary'
      },
      benefits: [
        'Protege los datos de tus usuarios',
        'Mejora el ranking en Google',
        'Aumenta la confianza del cliente',
        'Instalación gratuita incluida'
      ],
      details: {
        problem: `El dominio ${data.basic.domain} no cuenta con certificado SSL activo`,
        solution: 'Certificado SSL con instalación y configuración incluida',
        urgency: 'Los navegadores marcan sitios sin SSL como "No seguro"'
      }
    });
  }

  // Performance Optimization opportunity
  if (issues.slowLoadTime || issues.lowPageSpeedScore) {
    opportunities.push({
      id: 'performance-optimization',
      title: 'Optimización de Rendimiento',
      description: 'Tu sitio web tiene un rendimiento lento. Esto afecta la experiencia del usuario y el SEO.',
      impact: 'high',
      category: 'performance',
      icon: 'Zap',
      cta: {
        text: 'Optimizar con HostingPlus',
        url: 'https://www.hostingplus.cl/optimizacion-web/',
        type: 'primary'
      },
      benefits: [
        'Mejora la velocidad de carga',
        'Reduce la tasa de rebote',
        'Mejora el SEO',
        'Aumenta las conversiones'
      ],
      details: {
        problem: `El sitio carga en ${data.performance.load_time_ms}ms y tiene un PageSpeed de ${data.performance.pagespeed_score}`,
        solution: 'Optimización completa de imágenes, código y caché',
        urgency: 'Los usuarios abandonan sitios lentos en 3 segundos'
      }
    });
  }

  // Mobile Optimization opportunity (Placeholder)
  if (issues.noMobileFriendly) {
    opportunities.push({
      id: 'mobile-optimization',
      title: 'Optimización para Móviles',
      description: 'Tu sitio web no está optimizado para dispositivos móviles. Esto afecta la experiencia del usuario y el SEO.',
      impact: 'medium',
      category: 'seo',
      icon: 'Smartphone',
      cta: {
        text: 'Optimizar para Móviles',
        url: '#',
        type: 'secondary'
      },
      benefits: [
        'Mejora la experiencia en móviles',
        'Aumenta el tráfico móvil',
        'Mejora el SEO móvil'
      ],
      details: {
        problem: 'El sitio no se ve bien en dispositivos móviles',
        solution: 'Diseño responsivo y optimización de contenido',
        urgency: 'Más del 50% del tráfico es móvil'
      }
    });
  }

  // Analytics Setup opportunity
  if (issues.noAnalytics) {
    opportunities.push({
      id: 'analytics-setup',
      title: 'Configuración de Analítica Web',
      description: 'Tu sitio web no tiene analítica configurada. No estás midiendo el tráfico ni el comportamiento de tus usuarios.',
      impact: 'medium',
      category: 'marketing',
      icon: 'BarChart',
      cta: {
        text: 'Configurar Google Analytics',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        type: 'secondary'
      },
      benefits: [
        'Mide el tráfico y el comportamiento',
        'Entiende a tus usuarios',
        'Toma decisiones basadas en datos'
      ],
      details: {
        problem: 'No estás midiendo el tráfico ni el comportamiento',
        solution: 'Configuración de Google Analytics y seguimiento de eventos',
        urgency: 'No puedes mejorar lo que no mides'
      }
    });
  }

  return opportunities.sort((a, b) => {
    const impactOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return impactOrder[a.impact] - impactOrder[b.impact];
  });
};
