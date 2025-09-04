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
    termCount: 10
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
  // WordPress Core
  {
    id: 'wp-001',
    slug: 'wordpress',
    title: 'WordPress',
    shortDefinition: 'CMS más popular del mundo. Potencia el 43% de los sitios web globalmente.',
    longDefinition: 'Sistema de gestión de contenidos (CMS) de código abierto que permite crear y administrar sitios web sin conocimientos técnicos avanzados.',
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['cms', 'open-source', 'php'],
    level: 'basico',
    related: ['gutenberg', 'child-themes', 'multisite'],
    hostingRequirements: ['PHP 8.0+', 'MySQL 5.7+', 'HTTPS', 'mod_rewrite'],
    cta: {
      plan: 'WordPress Básico',
      copy: 'Hosting optimizado para WordPress desde $2.990/mes',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=1'
    },
    proofPoints: ['Instalación automática', 'Actualizaciones automáticas', 'Soporte especializado'],
    whenToUse: 'Para blogs, sitios corporativos, e-commerce y portales de noticias.',
    synonyms: ['wp'],
    lastUpdated: '2025-01-01'
  },
  {
    id: 'wp-002',
    slug: 'gutenberg',
    title: 'Gutenberg',
    shortDefinition: 'Editor de bloques nativo de WordPress. Permite diseñar páginas sin código.',
    longDefinition: 'Editor moderno de WordPress basado en bloques que reemplazó al editor clásico. Permite crear layouts complejos arrastrando y soltando elementos.',
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['editor', 'bloques', 'fse'],
    level: 'basico',
    related: ['elementor', 'page-builders', 'full-site-editing'],
    hostingRequirements: ['PHP 8.0+', 'Memory limit 256MB+'],
    cta: {
      plan: 'WordPress Básico',
      copy: 'Prueba Gutenberg con hosting optimizado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=1'
    },
    proofPoints: ['Compatible con todos los temas', 'Incluido gratis', 'Constantemente actualizado'],
    whenToUse: 'Para crear contenido rico sin plugins adicionales.',
    synonyms: ['editor de bloques', 'block editor']
  },

  // Page Builders
  {
    id: 'pb-001',
    slug: 'elementor',
    title: 'Elementor',
    shortDefinition: 'Constructor visual líder para WordPress. Acelera con LiteSpeed + HTTP/3.',
    longDefinition: 'Page builder freemium que permite diseñar sitios web profesionales con interfaz drag & drop. Incluye plantillas, widgets avanzados y opciones de responsive design.',
    category: 'builders',
    cms: 'wordpress',
    tags: ['page-builder', 'visual', 'drag-drop', 'responsive'],
    level: 'medio',
    related: ['litespeed-cache', 'elementor-ai', 'divi', 'beaver-builder'],
    hostingRequirements: ['LiteSpeed Server', 'PHP 8.1+', 'Memory 512MB+', 'HTTP/3'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Acelera Elementor con LiteSpeed + HTTP/3',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['LiteSpeed Enterprise', 'HTTP/3 nativo', 'Staging con 1 clic', 'JetBackup diario'],
    whenToUse: 'Para sitios corporativos, landing pages y portales que requieren diseño personalizado.',
    synonyms: ['constructor visual', 'page builder']
  },
  {
    id: 'pb-002',
    slug: 'elementor-ai',
    title: 'Elementor AI',
    shortDefinition: 'IA integrada en Elementor para generar texto, código CSS y layouts automáticamente.',
    category: 'trends-2025',
    cms: 'wordpress',
    tags: ['ia', 'elementor', 'automatizacion', 'css'],
    level: 'medio',
    related: ['elementor', 'ai-engine', 'openai-wordpress'],
    hostingRequirements: ['Elementor Pro', 'Conectividad API estable', 'Memory 512MB+'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'IA sin interrupciones con hosting premium',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['Uptime 99.9%', 'Conectividad premium', 'Soporte especializado'],
    whenToUse: 'Para acelerar la creación de contenido y diseños únicos.'
  },

  // Performance & Cache
  {
    id: 'perf-001',
    slug: 'litespeed-cache',
    title: 'LiteSpeed Cache',
    shortDefinition: 'Plugin de caché oficial para servidores LiteSpeed. Mejora velocidad hasta 10x.',
    longDefinition: 'Plugin gratuito de caché diseñado específicamente para servidores LiteSpeed. Incluye optimización automática, caché de objetos, CDN y compresión avanzada.',
    category: 'performance',
    cms: 'wordpress',
    tags: ['cache', 'litespeed', 'velocidad', 'gratis'],
    level: 'medio',
    related: ['litespeed-server', 'wp-rocket', 'redis-cache', 'cloudflare'],
    hostingRequirements: ['Servidor LiteSpeed', 'mod_rewrite', 'PHP 7.4+'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Máximo rendimiento con LiteSpeed Enterprise',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['Único hosting LiteSpeed en Chile', 'HTTP/3 + QUIC', 'Configuración optimizada'],
    whenToUse: 'Solo funciona al máximo en hosting con servidor LiteSpeed nativo.',
    synonyms: ['lscache', 'litespeed plugin']
  },
  {
    id: 'perf-002',
    slug: 'redis-cache',
    title: 'Redis Object Cache',
    shortDefinition: 'Sistema de caché en memoria que reduce consultas a la base de datos hasta 80%.',
    category: 'performance',
    cms: 'general',
    tags: ['cache', 'database', 'memoria', 'performance'],
    level: 'avanzado',
    related: ['litespeed-cache', 'memcached', 'object-cache-pro'],
    hostingRequirements: ['Redis server', 'PHP Redis extension', 'Memory 256MB+'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Redis incluido en planes Pro y superiores',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Redis preconfigurado', 'Monitoreo 24/7', 'Backup automático'],
    whenToUse: 'Sites con alto tráfico, e-commerce o consultas complejas de BD.'
  },
  {
    id: 'perf-003',
    slug: 'core-web-vitals',
    title: 'Core Web Vitals',
    shortDefinition: 'Métricas de Google que miden experiencia de usuario: LCP, CLS e INP.',
    category: 'performance',
    cms: 'general',
    tags: ['google', 'seo', 'ux', 'metricas'],
    level: 'medio',
    related: ['inp', 'lcp', 'cls', 'pagespeed'],
    hostingRequirements: ['Servidor rápido', 'HTTP/3', 'Compresión Brotli'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Mejora Core Web Vitals con servidor premium',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['HTTP/3 nativo', 'SSD NVMe', 'Red premium'],
    whenToUse: 'Esencial para SEO y ranking en Google desde 2021.'
  },
  {
    id: 'perf-004',
    slug: 'inp',
    title: 'INP (Interaction to Next Paint)',
    shortDefinition: 'Nueva métrica de Google 2024 que reemplaza FID. Mide respuesta a interacciones.',
    category: 'trends-2025',
    cms: 'general',
    tags: ['google', 'web-vitals', '2024', 'interactividad'],
    level: 'avanzado',
    related: ['core-web-vitals', 'javascript', 'performance'],
    hostingRequirements: ['CPU rápida', 'Baja latencia', 'Optimización JS'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Optimiza INP con CPU dedicada',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['CPU Intel/AMD última gen', 'Baja latencia', 'Optimización JS automática'],
    whenToUse: 'Sites con mucha interactividad: e-commerce, apps web, dashboards.'
  },

  // Security
  {
    id: 'sec-001',
    slug: 'wordfence',
    title: 'Wordfence Security',
    shortDefinition: 'Plugin de seguridad líder para WordPress con firewall y detección de malware.',
    category: 'security',
    cms: 'wordpress',
    tags: ['seguridad', 'firewall', 'malware', 'wordpress'],
    level: 'medio',
    related: ['waf', 'jetbackup', 'sucuri', 'hardening'],
    hostingRequirements: ['PHP 7.4+', 'Cron jobs', 'Memory 256MB+'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Seguridad multicapa: Wordfence + WAF servidor',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['WAF a nivel servidor', 'JetBackup diario', 'Monitoreo 24/7'],
    whenToUse: 'Todo sitio WordPress necesita protección contra ataques.'
  },
  {
    id: 'sec-002',
    slug: 'jetbackup',
    title: 'JetBackup',
    shortDefinition: 'Sistema de backup empresarial con restore granular y versionado múltiple.',
    category: 'security',
    cms: 'general',
    tags: ['backup', 'restore', 'seguridad', 'empresarial'],
    level: 'medio',
    related: ['backup', 'restore', 'disaster-recovery'],
    hostingRequirements: ['cPanel/DirectAdmin', 'Espacio adicional', 'Cron jobs'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'JetBackup incluido: restore en minutos',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Backup cada 4 horas', 'Restore granular', '30 días de retención'],
    whenToUse: 'Sites críticos que no pueden permitirse pérdida de datos.'
  },

  // WooCommerce
  {
    id: 'woo-001',
    slug: 'woocommerce',
    title: 'WooCommerce',
    shortDefinition: 'Plugin gratuito que convierte WordPress en tienda online. Potencia 28% del e-commerce mundial.',
    category: 'woocommerce',
    cms: 'wordpress',
    tags: ['ecommerce', 'tienda', 'ventas', 'wordpress'],
    level: 'medio',
    related: ['woocommerce-performance', 'flow-payment', 'khipu'],
    hostingRequirements: ['PHP 8.0+', 'MySQL 5.7+', 'SSL', 'Memory 512MB+'],
    cta: {
      plan: 'WordPress E-commerce',
      copy: 'Hosting optimizado para WooCommerce',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=5'
    },
    proofPoints: ['Caché especializada Woo', 'SSL incluido', 'CDN gratis'],
    whenToUse: 'Para crear tiendas online con total control y flexibilidad.'
  },
  {
    id: 'woo-002',
    slug: 'flow-payment',
    title: 'Flow (Pago)',
    shortDefinition: 'Gateway de pago chileno que acepta tarjetas, transferencias y wallets digitales.',
    category: 'woocommerce',
    cms: 'wordpress',
    tags: ['pago', 'chile', 'ecommerce', 'gateway'],
    level: 'medio',
    related: ['woocommerce', 'khipu', 'mercadopago'],
    cta: {
      plan: 'WordPress E-commerce',
      copy: 'Integra Flow con hosting estable',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=5'
    },
    proofPoints: ['Uptime 99.9%', 'Conectividad premium', 'Soporte local'],
    whenToUse: 'E-commerce en Chile que necesita múltiples métodos de pago.'
  },

  // LMS
  {
    id: 'lms-001',
    slug: 'moodle',
    title: 'Moodle',
    shortDefinition: 'LMS de código abierto para educación. Requiere hosting robusto con CPU/RAM dedicada.',
    longDefinition: 'Sistema de gestión de aprendizaje usado por universidades y empresas. Soporta SCORM, exámenes avanzados, foros y seguimiento detallado de estudiantes.',
    category: 'lms',
    cms: 'moodle',
    tags: ['lms', 'educacion', 'elearning', 'open-source'],
    level: 'avanzado',
    related: ['learndash', 'php', 'mysql', 'redis-cache'],
    hostingRequirements: ['CPU dedicada', 'RAM 2GB+', 'PHP 8.0+', 'Cron cada minuto', 'Redis'],
    cta: {
      plan: 'VPS Cloud',
      copy: 'Moodle profesional con VPS optimizado',
      url: 'https://clientes.hostingplus.cl/vps-cloud'
    },
    proofPoints: ['CPU/RAM dedicada', 'Redis incluido', 'Migración asistida', 'Soporte especializado'],
    whenToUse: 'Educación formal, capacitación empresarial, cursos con certificación.',
    synonyms: ['lms', 'plataforma educativa']
  },
  {
    id: 'lms-002',
    slug: 'learndash',
    title: 'LearnDash',
    shortDefinition: 'LMS premium para WordPress. Más liviano que Moodle, ideal para cursos comerciales.',
    category: 'lms',
    cms: 'wordpress',
    tags: ['lms', 'wordpress', 'cursos', 'premium'],
    level: 'medio',
    related: ['moodle', 'woocommerce', 'elementor'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'LearnDash optimizado con Redis y staging',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Optimización LMS', 'Redis Object Cache', 'Staging para pruebas'],
    whenToUse: 'Venta de cursos online, academia privada, formación corporativa.'
  },

  // CMS Alternativos
  {
    id: 'cms-001',
    slug: 'joomla',
    title: 'Joomla',
    shortDefinition: 'CMS robusto para sitios complejos. Menos popular que WordPress pero muy potente.',
    category: 'cms',
    cms: 'joomla',
    tags: ['cms', 'php', 'open-source'],
    level: 'avanzado',
    related: ['wordpress', 'drupal', 'migration'],
    hostingRequirements: ['PHP 8.0+', 'MySQL 5.7+', 'mod_rewrite', 'Memory 256MB+'],
    cta: {
      plan: 'Hosting Pro',
      copy: 'Acelera Joomla con LiteSpeed + Redis',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['LiteSpeed compatible', 'Redis opcional', 'Migración gratuita'],
    whenToUse: 'Sitios corporativos complejos, portales con múltiples usuarios.',
    synonyms: ['joomla cms']
  },
  {
    id: 'cms-002',
    slug: 'prestashop',
    title: 'PrestaShop',
    shortDefinition: 'E-commerce especializado, alternativa a WooCommerce con características avanzadas.',
    category: 'cms',
    cms: 'prestashop',
    tags: ['ecommerce', 'php', 'tienda'],
    level: 'avanzado',
    related: ['woocommerce', 'magento', 'ecommerce'],
    cta: {
      plan: 'VPS Cloud',
      copy: 'PrestaShop empresarial con VPS dedicado',
      url: 'https://clientes.hostingplus.cl/vps-cloud'
    },
    proofPoints: ['Recursos dedicados', 'Optimización e-commerce', 'Soporte especializado'],
    whenToUse: 'E-commerce con inventario complejo y múltiples sucursales.'
  },

  // Tendencias 2025
  {
    id: 'ai-001',
    slug: 'ai-wordpress',
    title: 'IA para WordPress',
    shortDefinition: 'Plugins y servicios de inteligencia artificial para generar contenido, imágenes y código.',
    category: 'trends-2025',
    cms: 'wordpress',
    tags: ['ia', 'contenido', 'automatizacion', '2025'],
    level: 'medio',
    related: ['ai-engine', 'elementor-ai', 'openai', 'chatgpt'],
    hostingRequirements: ['Memory 512MB+', 'Cron confiable', 'API calls estables'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'IA sin interrupciones con hosting premium',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['Uptime 99.9%', 'Conectividad premium', 'Resources garantizados'],
    whenToUse: 'Para acelerar creación de contenido y automatizar tareas.'
  },
  {
    id: 'ai-002',
    slug: 'ai-engine',
    title: 'AI Engine',
    shortDefinition: 'Plugin que integra ChatGPT y otras IAs en WordPress para chatbots y generación de contenido.',
    category: 'trends-2025',
    cms: 'wordpress',
    tags: ['ia', 'chatgpt', 'plugin', 'chatbot'],
    level: 'medio',
    related: ['ai-wordpress', 'openai', 'chatbot'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'AI Engine optimizado con hosting confiable',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['API calls estables', 'Memory garantizada', 'Uptime 99.9%'],
    whenToUse: 'Sites que quieren chatbots inteligentes o generación automática.'
  },
  {
    id: 'trend-001',
    slug: 'headless-wordpress',
    title: 'Headless WordPress',
    shortDefinition: 'WordPress como backend puro usando API REST o GraphQL, frontend independiente.',
    category: 'trends-2025',
    cms: 'wordpress',
    tags: ['headless', 'api', 'javascript', 'react'],
    level: 'avanzado',
    related: ['wp-graphql', 'rest-api', 'jamstack'],
    hostingRequirements: ['API optimizada', 'CORS configurado', 'Cache especial'],
    cta: {
      plan: 'VPS Cloud',
      copy: 'Headless WP con Node.js + PHP en VPS',
      url: 'https://clientes.hostingplus.cl/vps-cloud'
    },
    proofPoints: ['Stack personalizable', 'Node.js disponible', 'Configuración experta'],
    whenToUse: 'Apps web, sitios super rápidos, arquitecturas modernas.'
  },
  {
    id: 'trend-002',
    slug: 'http3-quic',
    title: 'HTTP/3 y QUIC',
    shortDefinition: 'Protocolo de internet más rápido que HTTP/2. Reduce latencia hasta 50%.',
    category: 'trends-2025',
    cms: 'general',
    tags: ['http3', 'quic', 'velocidad', 'protocolo'],
    level: 'avanzado',
    related: ['litespeed-server', 'performance', 'core-web-vitals'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Primer hosting con HTTP/3 nativo en Chile',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['HTTP/3 desde 2023', 'LiteSpeed Enterprise', 'QUIC.cloud CDN'],
    whenToUse: 'Sites que buscan máxima velocidad y mejor UX.'
  },

  // SEO
  {
    id: 'seo-001',
    slug: 'yoast-seo',
    title: 'Yoast SEO',
    shortDefinition: 'Plugin SEO más popular para WordPress con análisis de contenido y sitemaps automáticos.',
    category: 'seo',
    cms: 'wordpress',
    tags: ['seo', 'sitemap', 'meta', 'schema'],
    level: 'basico',
    related: ['rankmath', 'all-in-one-seo', 'schema'],
    cta: {
      plan: 'WordPress Básico',
      copy: 'SEO optimizado desde el primer día',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=1'
    },
    proofPoints: ['Instalación automática', 'Sitemap automático', 'Guías SEO incluidas'],
    whenToUse: 'Todo sitio WordPress necesita optimización SEO básica.'
  },
  {
    id: 'seo-002',
    slug: 'rankmath',
    title: 'RankMath',
    shortDefinition: 'Plugin SEO moderno y gratuito, alternativa potente a Yoast con más características.',
    category: 'seo',
    cms: 'wordpress',
    tags: ['seo', 'moderno', 'gratis', 'analytics'],
    level: 'medio',
    related: ['yoast-seo', 'schema', 'google-analytics'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'RankMath Pro con hosting optimizado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Performance optimizada', 'Analytics integrado', 'Soporte especializado'],
    whenToUse: 'Sites que buscan SEO avanzado sin pagar licencias.'
  },

  // Infrastructure
  {
    id: 'infra-001',
    slug: 'litespeed-server',
    title: 'LiteSpeed Server',
    shortDefinition: 'Servidor web empresarial más rápido que Apache/Nginx. Compatible con .htaccess.',
    category: 'infrastructure',
    cms: 'general',
    tags: ['servidor', 'litespeed', 'performance', 'http3'],
    level: 'avanzado',
    related: ['litespeed-cache', 'http3-quic', 'apache', 'nginx'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Único hosting LiteSpeed Enterprise en Chile',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['LiteSpeed Enterprise', 'HTTP/3 nativo', 'Compatibilidad total'],
    whenToUse: 'Sites que necesitan máximo rendimiento y compatibilidad.'
  },
  {
    id: 'infra-002',
    slug: 'php-8-4',
    title: 'PHP 8.4',
    shortDefinition: 'Última versión de PHP con mejoras de rendimiento y nuevas características.',
    category: 'trends-2025',
    cms: 'general',
    tags: ['php', '2024', 'performance', 'actualizacion'],
    level: 'medio',
    related: ['php-8-3', 'wordpress', 'performance'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'PHP 8.4 disponible en todos los planes',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Todas las versiones PHP', 'Actualización inmediata', 'Testing sin riesgo'],
    whenToUse: 'Para aprovechar las últimas mejoras de rendimiento.'
  },

  // Migration & DevOps
  {
    id: 'dev-001',
    slug: 'staging',
    title: 'Staging (Entorno de Pruebas)',
    shortDefinition: 'Copia exacta del sitio para probar cambios sin afectar la versión en vivo.',
    category: 'devops',
    cms: 'general',
    tags: ['staging', 'testing', 'desarrollo', 'seguridad'],
    level: 'medio',
    related: ['backup', 'jetbackup', 'desarrollo'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Staging automático con 1 clic',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Staging ilimitado', 'Clonado automático', 'Sincronización fácil'],
    whenToUse: 'Antes de actualizar plugins, temas o hacer cambios importantes.'
  },
  {
    id: 'mig-001',
    slug: 'migracion-wordpress',
    title: 'Migración WordPress',
    shortDefinition: 'Proceso de mover un sitio WordPress entre hosting sin perder datos ni posicionamiento.',
    category: 'migration',
    cms: 'wordpress',
    tags: ['migracion', 'transferencia', 'dns', 'seo'],
    level: 'medio',
    related: ['dns', 'ssl', 'duplicator', 'backup'],
    cta: {
      plan: 'Migración Gratuita',
      copy: 'Migración profesional sin costo',
      url: 'https://clientes.hostingplus.cl/migracion-gratuita'
    },
    proofPoints: ['100% gratuita', 'Sin tiempo offline', 'Soporte especializado'],
    whenToUse: 'Al cambiar de hosting o actualizar plan.'
  }

  // Nota: Este es un conjunto inicial. Se pueden agregar más términos según necesidades específicas.
];

// Función para buscar términos
export const searchTerms = (query: string, filters?: {
  category?: string;
  cms?: string;
  level?: string;
}): WikiTerm[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  return wikiTerms.filter(term => {
    // Filtros
    if (filters?.category && term.category !== filters.category) return false;
    if (filters?.cms && term.cms !== filters.cms) return false;
    if (filters?.level && term.level !== filters.level) return false;
    
    // Búsqueda en texto
    if (!normalizedQuery) return true;
    
    const searchIn = [
      term.title,
      term.shortDefinition,
      ...term.tags,
      ...(term.synonyms || [])
    ].join(' ').toLowerCase();
    
    return searchIn.includes(normalizedQuery);
  });
};

// Función para obtener términos relacionados
export const getRelatedTerms = (termSlug: string): WikiTerm[] => {
  const term = wikiTerms.find(t => t.slug === termSlug);
  if (!term) return [];
  
  return wikiTerms.filter(t => 
    term.related.includes(t.slug) || 
    t.related.includes(termSlug)
  ).slice(0, 6);
};