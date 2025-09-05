export interface WikiTerm {
  id: string;
  slug: string;
  title: string;
  shortDefinition: string;
  longDefinition?: string;
  category: 'wordpress' | 'builders' | 'seo' | 'performance' | 'security' | 'woocommerce' | 'lms' | 'cms' | 'cdn' | 'infrastructure' | 'email' | 'devops' | 'migration' | 'analytics' | 'trends-2025';
  cms: 'wordpress' | 'joomla' | 'moodle' | 'general' | 'drupal' | 'prestashop';
  tags: string[];
  level: 'basico' | 'medio' | 'avanzado';
  related: string[];
  hostingRequirements?: string[];
  cta: {
    plan: string;
    copy: string;
    url: string;
  };
  proofPoints: string[];
  whenToUse?: string;
  synonyms?: string[];
  lastUpdated?: string;
}

export interface WikiCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  termCount: number;
}

export const wikiCategories: WikiCategory[] = [
  {
    id: 'wordpress',
    name: 'WordPress Core',
    description: 'Conceptos fundamentales de WordPress',
    icon: '🔧',
    termCount: 15
  },
  {
    id: 'builders',
    name: 'Page Builders',
    description: 'Constructores visuales para WordPress',
    icon: '🎨',
    termCount: 12
  },
  {
    id: 'seo',
    name: 'SEO',
    description: 'Optimización para motores de búsqueda',
    icon: '🔍',
    termCount: 14
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Optimización de velocidad y caché',
    icon: '⚡',
    termCount: 18
  },
  {
    id: 'security',
    name: 'Seguridad',
    description: 'Protección y hardening web',
    icon: '🛡️',
    termCount: 12
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'E-commerce con WordPress',
    icon: '🛒',
    termCount: 15
  },
  {
    id: 'lms',
    name: 'LMS',
    description: 'Sistemas de gestión de aprendizaje',
    icon: '🎓',
    termCount: 8
  },
  {
    id: 'cms',
    name: 'CMS Alternativos',
    description: 'Joomla, Drupal y otros CMS',
    icon: '🌐',
    termCount: 10
  },
  {
    id: 'trends-2025',
    name: 'Tendencias 2025',
    description: 'IA, nuevas tecnologías y el futuro del hosting',
    icon: '🚀',
    termCount: 12
  }
];

export const wikiTerms: WikiTerm[] = [
  // SEO Terms
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
  },
  // WordPress Core
  {
    id: 'wp-001',
    slug: 'wordpress',
    title: 'WordPress',
    shortDefinition: 'El CMS más popular del mundo, que impulsa el 43% de todos los sitios web.',
    longDefinition: `WordPress es el sistema de gestión de contenidos (CMS) más popular del mundo, utilizado por millones de sitios web desde blogs personales hasta empresas Fortune 500.

**¿Por qué WordPress domina?**
- **Facilidad de uso:** Interface intuitiva para usuarios no técnicos
- **Flexibilidad total:** Desde blogs simples hasta e-commerce complejos
- **Comunidad masiva:** Miles de plugins y temas disponibles
- **SEO-friendly:** Optimización natural para motores de búsqueda`,
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['cms', 'content-management', 'blog', 'website', 'open-source'],
    level: 'basico',
    related: ['gutenberg', 'plugins', 'temas', 'hosting-wordpress'],
    hostingRequirements: ['PHP 7.4+', 'MySQL 5.7+', 'Mod_rewrite', 'HTTPS'],
    cta: {
      plan: 'WordPress Starter',
      copy: 'Hosting optimizado para WordPress con instalación en 1 clic',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=78'
    },
    proofPoints: ['WordPress pre-instalado', 'Actualizaciones automáticas', 'Backup diario', 'Soporte especializado'],
    whenToUse: 'Ideal para cualquier proyecto web: blogs, sitios corporativos, tiendas online, portfolios, comunidades',
    synonyms: ['wp', 'content management system', 'cms'],
    lastUpdated: '2025-01-15'
  }
];

// Utility functions - explicitly exported
export const searchTerms = (query: string, filters?: Record<string, any>): WikiTerm[] => {
  let results = wikiTerms;
  
  // Apply text search if query provided
  if (query.trim()) {
    const searchQuery = query.toLowerCase();
    results = results.filter(term => 
      term.title.toLowerCase().includes(searchQuery) ||
      term.shortDefinition.toLowerCase().includes(searchQuery) ||
      term.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
      (term.synonyms && term.synonyms.some(synonym => synonym.toLowerCase().includes(searchQuery)))
    );
  }
  
  // Apply filters if provided
  if (filters) {
    if (filters.category) {
      results = results.filter(term => term.category === filters.category);
    }
    if (filters.cms) {
      results = results.filter(term => term.cms === filters.cms);
    }
    if (filters.level) {
      results = results.filter(term => term.level === filters.level);
    }
  }
  
  return results;
};

export const getRelatedTerms = (currentSlug: string): WikiTerm[] => {
  const currentTerm = wikiTerms.find(term => term.slug === currentSlug);
  if (!currentTerm) return [];
  
  return wikiTerms.filter(term => 
    term.slug !== currentSlug && 
    currentTerm.related.includes(term.slug)
  );
};