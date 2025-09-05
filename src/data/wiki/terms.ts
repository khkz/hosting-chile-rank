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
  // WordPress Core Terms
  {
    id: 'wp-001',
    slug: 'wordpress',
    title: 'WordPress',
    shortDefinition: 'El CMS más popular del mundo, que impulsa más del 43% de todos los sitios web. Sistema de gestión de contenidos open-source.',
    longDefinition: 'WordPress es el sistema de gestión de contenidos más utilizado globalmente, perfecto para blogs, sitios corporativos y e-commerce. En Chile es la plataforma preferida por desarrolladores y empresas.',
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['cms', 'wordpress-core', 'gestion-contenidos', 'open-source'],
    level: 'basico',
    related: ['gutenberg', 'woocommerce', 'child-themes'],
    hostingRequirements: ['PHP 8.1+', 'MySQL 8.0+', 'WordPress auto-install'],
    cta: {
      plan: 'WordPress Hosting',
      copy: 'Hosting especializado WordPress con instalación automática',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=81'
    },
    proofPoints: ['WordPress pre-instalado', 'Updates automáticos', 'Staging site incluido'],
    whenToUse: 'Ideal para blogs, sitios corporativos, e-commerce y cualquier proyecto web',
    synonyms: ['WP', 'sistema de gestión'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'wp-002',
    slug: 'gutenberg',
    title: 'Gutenberg Editor',
    shortDefinition: 'Editor visual de bloques de WordPress que permite crear contenido arrastrando y soltando elementos sin necesidad de código.',
    longDefinition: 'Gutenberg revoluciona WordPress convirtiendo todo en bloques reutilizables. Permite crear páginas profesionales sin conocimiento técnico.',
    category: 'wordpress',
    cms: 'wordpress', 
    tags: ['gutenberg', 'editor-bloques', 'page-builder', 'fse'],
    level: 'medio',
    related: ['wordpress', 'elementor', 'child-themes'],
    hostingRequirements: ['WordPress 5.0+', 'PHP 7.4+', 'JavaScript habilitado'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Hosting optimizado para Gutenberg con performance garantizada',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Gutenberg pre-configurado', 'Themes FSE incluidos', 'Performance 95+'],
    whenToUse: 'Perfecto para content marketing, landing pages y sitios corporativos',
    synonyms: ['editor de bloques', 'block editor'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'wp-003',
    slug: 'child-themes',
    title: 'Child Themes',
    shortDefinition: 'Tema hijo que hereda funcionalidades del tema padre pero permite personalizaciones seguras sin perder cambios en actualizaciones.',
    longDefinition: 'Los Child Themes protegen las personalizaciones de tu sitio WordPress cuando el tema original se actualiza, manteniendo cambios seguros.',
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['child-theme', 'personalizacion', 'mantenimiento', 'updates'],
    level: 'medio',
    related: ['wordpress', 'custom-css', 'theme-development'],
    hostingRequirements: ['WordPress actualizado', 'Acceso FTP/cPanel', 'PHP 7.4+'],
    cta: {
      plan: 'Developer Pro',
      copy: 'Hosting con acceso completo para desarrollo de Child Themes',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=85'
    },
    proofPoints: ['FTP/SSH incluido', 'Staging site', 'Git deployment'],
    whenToUse: 'Obligatorio para cualquier personalización de tema WordPress',
    synonyms: ['tema hijo', 'child template'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'wp-004',
    slug: 'woocommerce',
    title: 'WooCommerce',
    shortDefinition: 'Plugin de e-commerce para WordPress que convierte cualquier sitio en una tienda online completa con gestión de productos, pagos y envíos.',
    longDefinition: 'WooCommerce es la plataforma de e-commerce más usada del mundo, perfecta para tiendas online en Chile con integración Transbank y envíos nacionales.',
    category: 'woocommerce',
    cms: 'wordpress',
    tags: ['ecommerce', 'tienda-online', 'woocommerce', 'ventas'],
    level: 'medio',
    related: ['wordpress', 'transbank', 'shipping-methods'],
    hostingRequirements: ['SSL certificado', 'PHP 8.0+', 'MySQL optimizado', 'Backup automático'],
    cta: {
      plan: 'E-commerce Pro',
      copy: 'Hosting especializado WooCommerce con SSL y performance garantizada',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=86'
    },
    proofPoints: ['SSL gratuito', 'WooCommerce pre-instalado', 'Backup diario'],
    whenToUse: 'Esencial para cualquier negocio que quiera vender online',
    synonyms: ['tienda virtual', 'e-commerce WordPress'],
    lastUpdated: '2025-01-15'
  },
  // SEO Terms
  {
    id: 'seo-001',
    slug: 'schema-markup',
    title: 'Schema Markup',
    shortDefinition: 'Código estructurado que ayuda a Google entender tu contenido y mostrar rich snippets en los resultados de búsqueda.',
    longDefinition: 'Schema Markup es código JSON-LD que describe tu contenido para motores de búsqueda, mejorando la visibilidad con rich snippets.',
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
    slug: 'yoast-seo',
    title: 'Yoast SEO',
    shortDefinition: 'Plugin WordPress líder en SEO que optimiza contenido, genera sitemaps y mejora el posicionamiento automáticamente.',
    longDefinition: 'Yoast SEO es el plugin SEO más usado del mundo, esencial para optimizar sitios WordPress con análisis de contenido y SEO técnico.',
    category: 'seo',
    cms: 'wordpress',
    tags: ['yoast', 'seo-plugin', 'optimization', 'wordpress-seo'],
    level: 'basico',
    related: ['schema-markup', 'google-search-console', 'wordpress'],
    hostingRequirements: ['WordPress actualizado', 'PHP 7.4+', 'MySQL optimizado'],
    cta: {
      plan: 'SEO Pro',
      copy: 'Hosting con Yoast SEO Premium incluido y configurado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Yoast Premium incluido', 'SEO setup automático', 'Monitoreo ranking'],
    whenToUse: 'Esencial para cualquier sitio WordPress que quiera posicionarse',
    synonyms: ['plugin seo', 'wordpress seo'],
    lastUpdated: '2025-01-15'
  }
];

// Helper functions
export const searchTerms = (query: string, filters?: Record<string, any>): WikiTerm[] => {
  let results = wikiTerms;
  
  if (query) {
    const searchQuery = query.toLowerCase();
    results = results.filter(term =>
      term.title.toLowerCase().includes(searchQuery) ||
      term.shortDefinition.toLowerCase().includes(searchQuery) ||
      term.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  }
  
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
    currentTerm.related.includes(term.slug)
  );
};