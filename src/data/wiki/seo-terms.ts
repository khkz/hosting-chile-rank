import { WikiTerm } from './terms';

export const seoTerms: WikiTerm[] = [
  {
    id: 'seo-001',
    slug: 'schema-markup',
    title: 'Schema Markup',
    shortDefinition: 'Código estructurado que ayuda a Google entender tu contenido y mostrar rich snippets en los resultados de búsqueda.',
    longDefinition: `Schema Markup es el **lenguaje secreto** que hablan Google, Bing y otros motores de búsqueda. Es código estructurado (JSON-LD) que describe exactamente qué tipo de contenido tienes en tu sitio.

**La magia:** Cuando Google entiende perfectamente tu contenido, puede mostrar **rich snippets** - esos resultados enriquecidos con estrellas, precios, fechas, imágenes que destacan en los resultados de búsqueda.

En el mercado chileno, Schema Markup te da una ventaja real para destacar en búsquedas locales y e-commerce.`,
    category: 'seo',
    cms: 'general',
    tags: ['schema', 'rich-snippets', 'structured-data', 'json-ld', 'seo-tecnico'],
    level: 'medio',
    related: ['yoast-seo', 'google-search-console', 'seo-local'],
    hostingRequirements: ['Soporte para modificar <head>', 'Plugins SEO compatibles'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Hosting optimizado para SEO con Schema automático incluido',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Schema automático configurado', 'Rich snippets monitoring'],
    whenToUse: 'Imprescindible para e-commerce, negocios locales, blogs de contenido',
    synonyms: ['datos estructurados', 'rich snippets'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'seo-002',
    slug: 'google-search-console',
    title: 'Google Search Console',
    shortDefinition: 'Herramienta gratuita de Google que muestra cómo tu sitio aparece en búsquedas y te ayuda a optimizar tu SEO.',
    longDefinition: `Google Search Console es la **línea directa entre tu sitio web y Google**. Te dice qué búsquedas traen visitantes, qué páginas indexa Google, qué errores encuentra, y más importante: **qué oportunidades estás perdiendo**.

En Chile, donde 95% de las búsquedas pasan por Google, Search Console te conecta directamente con tu audiencia.`,
    category: 'seo',
    cms: 'general',
    tags: ['google', 'search-console', 'analytics', 'seo-tools'],
    level: 'medio',
    related: ['schema-markup', 'yoast-seo', 'page-speed'],
    hostingRequirements: ['Verificación HTML/DNS', 'Sitemap.xml automático'],
    cta: {
      plan: 'SEO Pro',
      copy: 'Hosting con Google Search Console pre-configurado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Search Console configurado', 'Monitoreo SEO 24/7'],
    whenToUse: 'Imprescindible para cualquier sitio que quiera tráfico orgánico',
    synonyms: ['GSC', 'webmaster tools'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'seo-003',
    slug: 'page-speed-insights',
    title: 'Page Speed Insights',
    shortDefinition: 'Herramienta de Google que analiza la velocidad de tu sitio web y proporciona recomendaciones específicas para mejorar el rendimiento.',
    longDefinition: `Page Speed Insights es la **herramienta oficial de Google** para medir y optimizar la velocidad de sitios web. En Chile, donde la conexión móvil promedio es más lenta, un sitio lento significa **pérdida directa de ventas**.

Google usa Page Speed como factor de ranking directo desde 2018.`,
    category: 'seo',
    cms: 'general',
    tags: ['velocidad', 'performance', 'core-web-vitals', 'page-speed'],
    level: 'medio',
    related: ['litespeed-cache', 'google-search-console', 'cdn'],
    hostingRequirements: ['SSD NVMe', 'HTTP/3', 'Cache server-side'],
    cta: {
      plan: 'Performance Pro',
      copy: 'Hosting ultra-rápido con Page Speed 90+ garantizado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Page Speed Score 90+', 'CDN global incluido'],
    whenToUse: 'Esencial para e-commerce, landing pages, sitios corporativos',
    synonyms: ['page speed', 'velocidad web', 'core web vitals'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'seo-004',
    slug: 'seo-local',
    title: 'SEO Local',
    shortDefinition: 'Estrategias de optimización para aparecer en búsquedas geográficas específicas. Fundamental para negocios físicos en Chile.',
    longDefinition: `SEO Local es el **arte de aparecer cuando la gente busca servicios cerca de ellos**. En Chile, esto significa que SEO Local bien ejecutado se traduce directamente en foot traffic y ventas.

76% de búsquedas locales resultan en visita física dentro de 24 horas.`,
    category: 'seo',
    cms: 'general',
    tags: ['seo-local', 'google-my-business', 'gmb', 'business-local'],
    level: 'medio',
    related: ['google-search-console', 'schema-markup', 'reviews'],
    hostingRequirements: ['IP geolocalizada en Chile', 'SSL certificado'],
    cta: {
      plan: 'Local Business',
      copy: 'Hosting localizado en Chile con herramientas SEO Local',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Servidores en Chile', 'Google My Business optimization'],
    whenToUse: 'Imprescindible para restaurantes, clínicas, talleres, tiendas físicas',
    synonyms: ['seo geográfico', 'búsquedas locales'],
    lastUpdated: '2025-01-15'
  }
];