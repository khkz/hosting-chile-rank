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
    shortDefinition: 'El CMS que cambió la web: potencia más del 43% de todos los sitios web del mundo. Desde blogs personales hasta tiendas online masivas.',
    longDefinition: `
## ¿Qué es WordPress realmente?

WordPress comenzó en 2003 como una plataforma simple para blogs, pero se ha convertido en el motor que impulsa casi la mitad de internet. No es solo un software; es todo un ecosistema que permite a cualquier persona crear sitios web profesionales sin necesidad de programar.

![Ilustración conceptual de un dashboard moderno](/src/assets/wiki/wordpress-dashboard.jpg "Ilustración abstracta representando un panel de administración - Interfaz moderna y minimalista")

## ¿Por qué WordPress domina el mercado?

![Visualización de datos abstracta](/src/assets/wiki/wordpress-stats.jpg "Ilustración de gráficos y estadísticas en estilo minimalista")

**La historia es fascinante:** Matt Mullenweg tenía solo 19 años cuando cofundó WordPress. Hoy, empresas como The New York Times, Sony Music y hasta la Casa Blanca usan WordPress. En Chile, desde La Tercera hasta pequeños emprendimientos locales confían en esta plataforma.

### Lo que hace especial a WordPress:

**1. Flexibilidad sin límites**
WordPress puede ser literalmente cualquier cosa: un blog personal, una tienda online que facture millones, un sitio corporativo, un portal de noticias, o incluso una plataforma de cursos. La flexibilidad viene de su arquitectura modular: temas controlan el diseño, plugins agregan funcionalidad.

**2. Comunidad global activa**
Con más de 60,000 plugins gratuitos y miles de temas, hay una solución para prácticamente cualquier necesidad. La comunidad chilena de WordPress también es muy activa, con meetups regulares en Santiago y Valparaíso.

**3. SEO nativo**
WordPress está construido pensando en SEO. URLs limpias, estructura semántica, sitemap automático, y compatibilidad con plugins como Yoast o RankMath hacen que posicionar en Google sea mucho más fácil.

## Editor Gutenberg: La revolución del contenido

![Ilustración de edición de contenido](/src/assets/wiki/gutenberg-editor.jpg "Representación abstracta del flujo de trabajo creativo y edición de contenido")

El editor Gutenberg transformó WordPress desde 2018. Permite crear diseños sofisticados usando bloques: párrafos, imágenes, botones, columnas, galerías. Es como tener un page builder básico incluido gratis.

## Casos de uso reales en Chile

**Restaurantes:** La Piojera, Barrio Lastarria y cientos de restaurantes usan WordPress con reservas online, menús digitales y delivery integrado.

**E-commerce:** Desde artesanías en Pomaire hasta tecnología en Santiago, WooCommerce (plugin de WordPress) permite vender online con pasarelas chilenas como Flow y Khipu.

**Profesionales:** Abogados, arquitectos, dentistas... WordPress es perfecto para sitios corporativos que necesitan proyectar seriedad pero mantenerse actualizados fácilmente.

**Medios:** Varios medios digitales chilenos usan WordPress por su capacidad de manejar alto tráfico y publicar contenido rápidamente.

## Ventajas honestas de WordPress

✅ **Curva de aprendizaje suave:** Si sabes usar Word, puedes usar WordPress
✅ **Escalable:** Sirve desde 10 hasta 10 millones de visitas mensuales
✅ **Económico:** El software es gratis, solo pagas hosting y eventualmente plugins premium
✅ **SEO-friendly:** Google ama WordPress por su estructura limpia
✅ **Actualizaciones constantes:** Se mantiene al día con estándares web
✅ **Respaldo masivo:** 40% del web no puede estar equivocado

## Desventajas que debes conocer

❌ **Puede ser vulnerable:** Al ser tan popular, es blanco de hackers (se soluciona con seguridad adecuada)
❌ **Rendimiento variable:** Puede volverse lento con muchos plugins mal configurados
❌ **Mantenimiento necesario:** Requiere actualizaciones regulares
❌ **Curva técnica:** Para personalizaciones avanzadas necesitas conocimientos o ayuda profesional

## ¿Cuándo WordPress es la mejor opción?

**✅ Perfecto para:**
- Blogs y sitios de contenido
- Sitios corporativos medianos a grandes
- E-commerce con WooCommerce
- Portales de noticias y revistas
- Sitios que necesitan actualización frecuente
- Proyectos con presupuesto variable (puede crecer gradualmente)

**❌ Considera alternativas para:**
- Aplicaciones web complejas (mejor React/Angular)
- Sitios ultra-rápidos estáticos (mejor Gatsby/Next.js)
- E-commerce masivo (considera Shopify Plus)
- Aplicaciones móviles nativas

## Requisitos técnicos explicados simple

![Ilustración de infraestructura técnica](/src/assets/wiki/wordpress-requirements.jpg "Representación visual abstracta de requisitos técnicos y hosting")

**Hosting recomendado:**
- **PHP 8.0+:** WordPress está escrito en PHP, versiones antiguas son inseguras
- **MySQL 5.7+:** Base de datos donde se guarda todo el contenido
- **HTTPS obligatorio:** Google penaliza sitios sin SSL
- **Mod_rewrite:** Permite URLs amigables (/sobre-nosotros/ en vez de /index.php?page=about)

**En la práctica:** Cualquier hosting chileno decente cumple estos requisitos. HostingPlus los tiene optimizados específicamente para WordPress.

## WordPress vs. la competencia

**vs. Wix/Squarespace:** WordPress es más flexible pero requiere más conocimiento técnico

**vs. Shopify:** Para e-commerce puro, Shopify puede ser más simple, pero WordPress + WooCommerce es más económico a largo plazo

**vs. Drupal/Joomla:** WordPress es más fácil de usar, ellos son más potentes pero complejos

## Mitos que debes ignorar

**"WordPress es solo para blogs"** - Falso. El 43% del web incluye tiendas, portales corporativos, aplicaciones web.

**"WordPress es lento"** - Falso. Con hosting adecuado y configuración correcta, puede ser extremadamente rápido.

**"WordPress no es seguro"** - Falso. Es tan seguro como cualquier CMS si se mantiene actualizado y se configura correctamente.

## Primeros pasos recomendados

1. **Elige hosting especializado:** No todos los hostings son iguales para WordPress
2. **Instala WordPress:** Muchos hostings lo hacen automáticamente
3. **Elige un tema:** Empieza con Twenty Twenty-Four (tema oficial)
4. **Plugins esenciales:** Yoast SEO, Wordfence Security, backup plugin
5. **Crea contenido:** Empieza con páginas básicas (Inicio, Sobre nosotros, Contacto)

## El futuro de WordPress

WordPress no se duerme en los laureles. **Gutenberg** (el nuevo editor) está transformando la experiencia de creación. **Full Site Editing** permite personalizar completamente el diseño. La integración con **inteligencia artificial** está llegando fuerte.

**En Chile:** La adopción sigue creciendo. Empresas medianas están migrando de sitios estáticos a WordPress para tener control total de su presencia digital.

## FAQ frecuentes

**¿Es WordPress gratis?**
El software sí, pero necesitas hosting (desde $3.000/mes) y dominio ($15.000/año). Plugins premium son opcionales.

**¿Puedo migrar mi sitio actual a WordPress?**
Sí, hay herramientas y servicios especializados. La mayoría de hostings chilenos ofrecen migración gratuita.

**¿Necesito saber programar?**
No para uso básico. Para personalizaciones avanzadas ayuda, pero hay miles de desarrolladores WordPress en Chile.

**¿WordPress funciona en móviles?**
Sí, todos los temas modernos son responsive. Además puedes gestionar el sitio desde la app móvil.

## Conclusión: ¿Por qué WordPress sigue ganando?

WordPress democratizó la creación web. Antes necesitabas un programador para cada cambio; hoy cualquier emprendedor chileno puede tener una presencia web profesional en horas, no meses.

No es perfecto, pero la combinación de flexibilidad, costo y facilidad de uso lo mantiene como la mejor opción para la mayoría de proyectos web. En un mercado digital chileno cada vez más competitivo, WordPress te da las herramientas para destacar sin necesidad de ser un experto técnico.

**¿La recomendación?** Si tienes dudas entre WordPress y otra opción, probablemente WordPress sea la respuesta. Es difícil equivocarse con la plataforma que confían 800 millones de sitios web.
    `,
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['cms', 'open-source', 'php', 'blog', 'ecommerce', 'seo', 'gutenberg', 'woocommerce'],
    level: 'basico',
    related: ['gutenberg', 'woocommerce', 'child-themes', 'multisite', 'elementor', 'yoast-seo'],
    hostingRequirements: [
      'PHP 8.0+ (recomendado 8.1 para mejor rendimiento)',
      'MySQL 5.7+ o MariaDB 10.4+',
      'HTTPS/SSL obligatorio (incluido gratis)',
      'Mod_rewrite para URLs amigables',
      'Memory limit mínimo 256MB (recomendado 512MB)',
      'Backup automático diario',
      'Actualizaciones automáticas de seguridad'
    ],
    cta: {
      plan: 'WordPress Básico',
      copy: 'WordPress optimizado con instalación automática, SSL gratis y soporte especializado desde $2.990/mes. Perfecto para empezar.',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=1'
    },
    proofPoints: [
      'Instalación con 1 clic y configuración optimizada',
      'Actualizaciones automáticas de WordPress y plugins', 
      'Soporte técnico especializado en WordPress',
      'SSL gratuito incluido',
      'Backup diario con restore fácil',
      'Staging area para probar cambios',
      'Cache optimizado para WordPress',
      'Malware scanning automático'
    ],
    whenToUse: 'WordPress es ideal para blogs, sitios corporativos, portales de noticias, e-commerce con WooCommerce, sitios de servicios profesionales (abogados, dentistas, arquitectos), portfolios creativos, y cualquier proyecto que necesite actualizaciones frecuentes de contenido. En Chile es especialmente popular para restaurantes, tiendas online, medios digitales y empresas de servicios.',
    synonyms: ['wp', 'wordpress.org', 'cms wordpress', 'gestor de contenidos'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'wp-002',
    slug: 'gutenberg',
    title: 'Gutenberg',
    shortDefinition: 'Editor de bloques moderno de WordPress que permite crear contenido usando bloques arrastrables.',
    longDefinition: `## ¿Qué es Gutenberg?

Gutenberg es el **editor de bloques oficial de WordPress**, introducido en la versión 5.0 en diciembre de 2018. Su nombre honra a Johannes Gutenberg, inventor de la imprenta moderna. Este revolucionario editor reemplaza el antiguo editor clásico TinyMCE con un sistema de **bloques visuales e intuitivos**.

### Características principales

- **Sistema de bloques**: Cada elemento (párrafo, imagen, lista) es un bloque independiente
- **Interfaz visual**: Lo que ves es lo que obtienes (WYSIWYG) mejorado
- **Reutilización**: Bloques reutilizables para elementos comunes
- **Responsive**: Vista previa responsive directa en el editor
- **Extensible**: Compatible con bloques personalizados de temas y plugins

### Ventajas sobre el editor clásico

| Aspecto | Editor Clásico | Gutenberg |
|---------|----------------|-----------|
| Flexibilidad | Limitado | Máxima flexibilidad |
| Diseño | Básico | Avanzado sin código |
| Reutilización | No | Bloques reutilizables |
| Responsive | Manual | Automático |
| Futuro | Obsoleto | En desarrollo activo |

### Tipos de bloques disponibles

**Bloques comunes:**
- Párrafo, Encabezado, Lista, Imagen
- Galería, Cita, Audio, Video

**Bloques de diseño:**
- Columnas, Grupo, Separador
- Espaciador, Botones, Medios y texto

**Bloques de widgets:**
- Archivo, Calendario, Categorías
- Últimos posts, Búsqueda, Nube de etiquetas

**Bloques avanzados:**
- HTML personalizado, Código
- Shortcode, Tabla, Verso

### Rendimiento y optimización

Gutenberg genera código HTML más limpio y semántico que el editor clásico. Sin embargo, puede cargar más CSS y JavaScript en el frontend. Para optimizar:

- Usa un **hosting optimizado para WordPress**
- Implementa **caché a nivel de servidor**
- Considera plugins de optimización como **LiteSpeed Cache**
- Minimiza bloques innecesarios

### Comparación con page builders

Mientras que **Elementor** o **Divi** son page builders completos, Gutenberg se enfoca en la **edición de contenido**. Es ideal para blogs y sitios de contenido, mientras que page builders son mejores para diseños complejos.`,
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['editor', 'bloques', 'wordpress', 'contenido', 'wysiwyg'],
    level: 'basico',
    related: ['wordpress', 'elementor', 'yoast-seo', 'litespeed-cache'],
    hostingRequirements: [
      'WordPress 5.0 o superior',
      'PHP 7.4+ recomendado',
      'Memoria mínima 256MB',
      'Navegador web moderno'
    ],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Optimiza tu experiencia con Gutenberg en hosting WordPress especializado',
      url: 'https://clientes.hostingplus.cl/cotiza-hosting?plan=wordpress-pro'
    },
    proofPoints: [
      'Hosting optimizado para WordPress',
      'Caching especializado para Gutenberg',
      'Backups automáticos diarios',
      'Soporte especializado en WordPress'
    ],
    whenToUse: 'Para sitios de contenido, blogs, y cuando necesitas flexibilidad sin complejidad de page builders',
    synonyms: ['Editor de bloques', 'Block Editor', 'WordPress Editor'],
    lastUpdated: '2025-01-15'
  },

  // Page Builders
  {
    id: 'pb-001',
    slug: 'elementor',
    title: 'Elementor',
    shortDefinition: 'Constructor visual líder para WordPress. Acelera con LiteSpeed + HTTP/3.',
    longDefinition: `# ¿Qué es Elementor?

Elementor revolucionó WordPress desde 2016 convirtiéndose en el page builder más popular del mundo. No es solo una herramienta de diseño; es un ecosistema completo que democratiza la creación web profesional.

**La realidad en números:** Más de 5 millones de sitios web activos usan Elementor. En Chile, desde startups hasta corporaciones como Falabella Digital confían en esta plataforma para sus proyectos críticos.

## Elementor Free vs Pro: ¿Qué necesitas realmente?

### Elementor Free (Gratis)
- **30+ widgets básicos:** Texto, imagen, botón, video, mapa
- **Responsive editing:** Edita para móvil, tablet y desktop
- **Drag & drop visual:** Interfaz intuitiva sin código
- **Plantillas básicas:** Biblioteca limitada pero funcional

### Elementor Pro ($59/año)
- **90+ widgets premium:** Formularios, WooCommerce, testimonios
- **Theme Builder:** Crea headers, footers y plantillas personalizadas
- **WooCommerce Builder:** Páginas de producto, checkout, carrito
- **Motion Effects:** Animaciones, parallax, scrolling effects
- **Marketing Tools:** Popup Builder, Lead Generation

## Rendimiento: Elementor + LiteSpeed = Velocidad Extrema

**El problema común:** Elementor puede generar código pesado que ralentiza sitios web. La solución está en la infraestructura de hosting.

### Optimización con LiteSpeed Cache

\`\`\`
Configuración recomendada LiteSpeed:
- Page Cache: Activado
- Object Cache: Redis/Memcached
- CSS/JS Minify: LSCache automático
- Image Optimization: WebP + lazy loading
- Critical CSS: Generación automática
\`\`\`

**Resultado real:** Sitios Elementor que cargan en 2-3 segundos se optimizan a 0.8-1.2 segundos con LiteSpeed Enterprise + HTTP/3.

## Compatibilidad: Elementor vs Gutenberg

**¿Usar ambos?** Sí, es posible y recomendable:

- **Gutenberg:** Para blog posts y contenido editorial
- **Elementor:** Para landing pages, home, servicios, contacto

### Tabla Comparativa: Constructores Visuales

| Criterio | Elementor | Gutenberg | Divi |
|----------|-----------|-----------|------|
| **Curva aprendizaje** | Fácil | Muy fácil | Medio |
| **Velocidad base** | Media | Rápida | Lenta |
| **Widgets incluidos** | 90+ (Pro) | 20+ | 100+ |
| **Responsive editing** | Excelente | Bueno | Excelente |
| **SEO-friendly** | Bueno | Excelente | Regular |
| **Precio anual** | $59 | Gratis | $89 |
| **Compatibilidad plugins** | Excelente | Excelente | Buena |

## Casos de uso en Chile

### 1. E-commerce (WooCommerce)
**Ejemplo:** Tienda de ropa online
- Product Builder personalizado
- Checkout optimizado
- Landing pages promocionales
- **Hosting recomendado:** WordPress Pro + Redis

### 2. Sitios corporativos
**Ejemplo:** Estudio legal en Santiago
- Diseño profesional y responsive
- Formularios de contacto avanzados
- Testimonios y casos de éxito
- **Hosting recomendado:** WordPress Turbo + HTTP/3

### 3. Landing pages conversion
**Ejemplo:** Curso online
- A/B testing con diferentes diseños
- Popup builder integrado
- Formularios con CRM
- **Hosting recomendado:** WordPress Turbo + LiteSpeed

## Pros y contras honestos

### ✅ Ventajas
- **Flexibilidad total:** Diseña cualquier layout sin limitaciones
- **Comunidad activa:** Miles de plantillas y tutoriales
- **Actualizaciones constantes:** Nuevos widgets cada mes
- **Integración nativa:** Compatible con 99% de plugins WordPress

### ❌ Desventajas
- **Dependencia del plugin:** Sin Elementor, el diseño se rompe
- **Código adicional:** Genera CSS/JS extra vs temas nativos
- **Vendor lock-in:** Migrar a otro builder es complejo
- **Costo anual:** $59/año para funciones profesionales

## Mejores prácticas 2025

### 1. Optimización de rendimiento
\`\`\`
- Usa solo widgets necesarios
- Optimiza imágenes a WebP
- Activa lazy loading
- Purga CSS no utilizado
\`\`\`

### 2. SEO y estructura
- **Un H1 por página:** No uses múltiples Heading widgets H1
- **Alt tags descriptivos:** Siempre completa alt text en imágenes
- **Schema markup:** Usa widgets estructurados para FAQ, reviews
- **URL structure:** Mantén URLs limpias y descriptivas

### 3. Responsive design
- **Mobile-first:** Diseña primero para móvil
- **Breakpoints custom:** Ajusta para dispositivos específicos
- **Typography scales:** Usa escalas responsivas para texto
- **Touch targets:** Botones mínimo 44px en móvil

## ¿Cuándo NO usar Elementor?

1. **Blogs puros:** Gutenberg es más eficiente para contenido editorial
2. **Sites ultra-rápidos:** Si Core Web Vitals son críticos, considera temas custom
3. **Presupuesto limitado:** Version gratuita es muy básica
4. **Desarrolladores avanzados:** ACF + custom fields puede ser más flexible

## Conclusión y recomendación

Elementor es la herramienta ideal para **90% de proyectos WordPress** que requieren diseño personalizado. La clave del éxito está en la **infraestructura de hosting**.

**Nuestra recomendación:** Elementor Pro + LiteSpeed Enterprise + HTTP/3 es la combinación que permite crear sitios web visualmente impactantes sin sacrificar velocidad.

### Next steps
1. **Evalúa tus necesidades:** ¿Free o Pro?
2. **Elige hosting optimizado:** LiteSpeed + Redis es esencial
3. **Planifica estructura:** Define pages vs posts desde el inicio
4. **Optimiza desde día 1:** Configura cache y optimización de imágenes`,
    category: 'builders',
    cms: 'wordpress',
    tags: ['page-builder', 'visual', 'drag-drop', 'responsive', 'woocommerce', 'theme-builder'],
    level: 'medio',
    related: ['litespeed-cache', 'elementor-ai', 'divi', 'beaver-builder', 'gutenberg', 'core-web-vitals'],
    hostingRequirements: ['LiteSpeed Server', 'PHP 8.1+', 'Memory 512MB+', 'HTTP/3'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Acelera Elementor con LiteSpeed + HTTP/3',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['LiteSpeed Enterprise', 'HTTP/3 nativo', 'Staging con 1 clic', 'JetBackup diario'],
    whenToUse: 'Para sitios corporativos, landing pages y portales que requieren diseño personalizado.',
    synonyms: ['constructor visual', 'page builder', 'elementor pro', 'page builder wordpress'],
    lastUpdated: '2025-01-04'
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

  {
    id: 'pb-003',
    slug: 'divi',
    title: 'Divi',
    shortDefinition: 'Constructor visual de Elegant Themes con diseño único y módulos premium.',
    longDefinition: 'Page builder premium de Elegant Themes que incluye el Divi Theme. Ofrece interfaz drag & drop, módulos exclusivos y diseños únicos, pero requiere más recursos que Elementor.',
    category: 'builders',
    cms: 'wordpress',
    tags: ['page-builder', 'visual', 'elegant-themes', 'premium'],
    level: 'medio',
    related: ['elementor', 'beaver-builder', 'litespeed-cache', 'core-web-vitals'],
    hostingRequirements: ['PHP 8.0+', 'Memory 768MB+', 'LiteSpeed recomendado'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Optimiza Divi con LiteSpeed Enterprise',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['Optimización específica Divi', 'Cache avanzado', 'Soporte especializado'],
    whenToUse: 'Para diseños únicos y proyectos que requieren estética diferenciada.',
    synonyms: ['divi builder', 'elegant themes'],
    lastUpdated: '2025-01-04'
  },
  {
    id: 'pb-004',
    slug: 'beaver-builder',
    title: 'Beaver Builder',
    shortDefinition: 'Page builder enfocado en rendimiento y código limpio. Ideal para desarrolladores.',
    longDefinition: 'Constructor visual que prioriza código limpio y rendimiento. Popular entre desarrolladores por su flexibilidad y hooks personalizados. Menos recursos visuales que Elementor pero más eficiente.',
    category: 'builders',
    cms: 'wordpress',
    tags: ['page-builder', 'performance', 'developer-friendly', 'codigo-limpio'],
    level: 'avanzado',
    related: ['elementor', 'divi', 'litespeed-cache', 'advanced-custom-fields'],
    hostingRequirements: ['PHP 7.4+', 'Memory 256MB+'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Hosting optimizado para Beaver Builder',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Código optimizado', 'Velocidad superior', 'Developer-friendly'],
    whenToUse: 'Para proyectos que priorizan rendimiento y requieren customización avanzada.',
    synonyms: ['bb', 'beaver page builder'],
    lastUpdated: '2025-01-04'
  },

  // Performance & Cache
  {
    id: 'perf-001',
    slug: 'litespeed-cache',
    title: 'LiteSpeed Cache',
    shortDefinition: 'Plugin de caché avanzado para WordPress que optimiza el rendimiento del sitio web.',
    longDefinition: `## ¿Qué es LiteSpeed Cache?

**LiteSpeed Cache** es un plugin de caché **gratuito y de código abierto** para WordPress desarrollado por LiteSpeed Technologies. Es considerado uno de los plugins de caché más potentes y eficientes disponibles, especialmente cuando se usa en servidores **LiteSpeed Web Server**.

### Características principales

**Caché avanzado:**
- **Page cache**: Almacena páginas HTML estáticas
- **Object cache**: Caché de base de datos y consultas
- **Browser cache**: Configuración automática de caché del navegador
- **CDN integrado**: Cloudflare y QUIC.cloud incluidos

**Optimización automática:**
- **Minificación** de CSS, JavaScript y HTML
- **Combinación** de archivos CSS/JS
- **Lazy loading** de imágenes y iframes
- **WebP** conversion automática
- **Critical CSS** generation

### Ventajas sobre otros plugins de caché

| Característica | LiteSpeed Cache | WP Rocket | W3 Total Cache |
|----------------|-----------------|-----------|----------------|
| Precio | Gratis | $59/año | Gratis/Premium |
| Facilidad uso | Alta | Muy alta | Media |
| Rendimiento | Excelente* | Excelente | Bueno |
| CDN incluido | Sí (QUIC.cloud) | No | No |
| ESI support | Sí | No | No |

*Máximo rendimiento solo en servidores LiteSpeed

### Configuración recomendada

**Configuración básica (principiantes):**
1. Activar **Page Cache**
2. Habilitar **Browser Cache**
3. Activar **Object Cache** (si disponible)
4. Configurar **Image Optimization**

**Configuración avanzada:**
- **TTL de caché**: 604800 segundos (1 semana)
- **Exclude pages**: /carrito/, /checkout/, /mi-cuenta/
- **Database cleanup**: Habilitado
- **CDN**: Configurar QUIC.cloud
- **Critical CSS**: Generar automáticamente

### Requisitos de hosting

Para aprovechar al **100% las capacidades** de LiteSpeed Cache:

- **LiteSpeed Web Server** (no Apache/Nginx)
- **Redis** o **Memcached** para object cache
- **QUIC.cloud CDN** configurado
- **PHP 7.4+** con extensiones necesarias

### Problemas comunes y soluciones

**1. Caché no funciona:**
- Verificar permisos de escritura en /wp-content/
- Comprobar que no hay plugins conflictivos
- Revisar exclusiones de caché

**2. CSS/JS roto:**
- Deshabilitar minificación temporalmente
- Excluir archivos problemáticos
- Usar "Separate CCSS Per URL"

**3. Performance no mejora:**
- Verificar que estás en servidor LiteSpeed
- Activar Object Cache
- Configurar CDN correctamente

### Herramientas de diagnóstico

- **Debug mode**: Para identificar problemas
- **Page optimization**: Análisis automático
- **Heartbeat control**: Reduce carga del servidor
- **Database optimizer**: Limpieza automática`,
    category: 'performance',
    cms: 'wordpress',
    tags: ['cache', 'performance', 'optimizacion', 'velocidad', 'litespeed', 'cdn'],
    level: 'medio',
    related: ['wordpress', 'core-web-vitals', 'redis-cache'],
    hostingRequirements: [
      'LiteSpeed Web Server (para máximo rendimiento)',
      'WordPress con permisos de escritura',
      'PHP 7.4+ recomendado',
      'Redis o Memcached (opcional)'
    ],
    cta: {
      plan: 'Performance Pro',
      copy: 'Acelera tu WordPress con hosting LiteSpeed optimizado',
      url: 'https://clientes.hostingplus.cl/cotiza-hosting?plan=performance-pro'
    },
    proofPoints: [
      'Servidores LiteSpeed nativos',
      'Caché integrado a nivel servidor',
      'Optimización automática',
      'CDN QUIC.cloud incluido'
    ],
    whenToUse: 'Para cualquier sitio WordPress que necesite mejor rendimiento, especialmente en servidores LiteSpeed',
    synonyms: ['LSCache', 'LiteSpeed WordPress Cache', 'LSCWP'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'perf-002',
    slug: 'redis-cache',
    title: 'Redis Object Cache',
    shortDefinition: 'Sistema de caché en memoria que acelera las consultas de base de datos en WordPress.',
    longDefinition: `## ¿Qué es Redis Object Cache?

**Redis Object Cache** es una tecnología de **caché en memoria** que acelera dramáticamente las consultas de base de datos en WordPress. Redis (Remote Dictionary Server) almacena datos en **RAM**, proporcionando acceso ultrarrápido a información frecuentemente solicitada.

### ¿Cómo funciona?

Cuando WordPress necesita datos de la base de datos:

1. **Sin Redis**: WordPress consulta MySQL directamente (lento)
2. **Con Redis**: WordPress consulta primero Redis (ultrarrápido)
3. Si el dato no está en Redis, consulta MySQL y guarda en Redis

### Beneficios de rendimiento

**Mejoras típicas:**
- **Reducción de tiempo de respuesta**: 50-80%
- **Menos carga en MySQL**: Hasta 90% menos consultas
- **Mayor concurrencia**: Soporta más usuarios simultáneos
- **Escalabilidad**: Mejor rendimiento bajo carga

### Casos de uso ideales

**E-commerce:**
- Consultas de productos frecuentes
- Sesiones de usuario
- Carrito de compras persistente

**Sitios de alto tráfico:**
- Blogs con miles de visitas
- Portales de noticias
- Foros y comunidades

**WooCommerce:**
- Cache de categorías y productos
- Datos de inventario
- Configuraciones de tienda

### Configuración técnica

**Plugins recomendados:**
- **Redis Object Cache** (by Till Krüss)
- **LiteSpeed Cache** (con soporte Redis)
- **W3 Total Cache** (configuración manual)

**Configuración wp-config.php:**
\`\`\`php
define('WP_REDIS_HOST', '127.0.0.1');
define('WP_REDIS_PORT', 6379);
define('WP_REDIS_DATABASE', 0);
define('WP_CACHE_KEY_SALT', 'tu-dominio.com');
\`\`\`

### Monitoreo y mantenimiento

**Métricas importantes:**
- **Hit ratio**: >90% es excelente
- **Memory usage**: Monitorear uso de RAM
- **Evicted keys**: Indicador de memoria insuficiente
- **Connected clients**: Número de conexiones activas

**Comandos útiles Redis:**
- \`redis-cli info memory\`: Estado de memoria
- \`redis-cli monitor\`: Ver consultas en tiempo real
- \`redis-cli flushall\`: Limpiar caché completo

### Comparación con Memcached

| Aspecto | Redis | Memcached |
|---------|-------|-----------|
| Persistencia | Sí | No |
| Tipos de datos | Avanzados | Básicos |
| Clustering | Nativo | Manual |
| Rendimiento | Excelente | Excelente |
| Popularidad WordPress | Alta | Media |

### Problemas comunes

**1. Alto uso de memoria:**
- Configurar \`maxmemory\` apropiadamente
- Implementar políticas de eviction
- Monitorear growth rate

**2. Conexiones perdidas:**
- Verificar configuración de red
- Revisar logs de Redis
- Comprobar timeouts

**3. Performance no mejora:**
- Verificar hit ratio
- Revisar configuración de plugins
- Analizar bottlenecks reales`,
    category: 'performance',
    cms: 'wordpress',
    tags: ['redis', 'cache', 'database', 'performance', 'memoria', 'optimizacion'],
    level: 'avanzado',
    related: ['wordpress', 'litespeed-cache', 'core-web-vitals'],
    hostingRequirements: [
      'Servidor Redis instalado y configurado',
      'Plugin Redis Object Cache para WordPress',
      'PHP con extensión Redis habilitada',
      'Memoria RAM suficiente (>1GB recomendado)'
    ],
    cta: {
      plan: 'Business Pro',
      copy: 'Implementa Redis en tu hosting profesional',
      url: 'https://clientes.hostingplus.cl/cotiza-hosting?plan=business-pro'
    },
    proofPoints: [
      'Redis incluido en planes premium',
      'Configuración automática optimizada',
      'Monitoreo 24/7 de performance',
      'Soporte técnico especializado'
    ],
    whenToUse: 'Para sitios con alta carga de base de datos, e-commerce, o más de 10,000 visitas mensuales',
    synonyms: ['Object Cache', 'Redis Cache', 'In-Memory Cache'],
    lastUpdated: '2025-01-15'
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
    longDefinition: `Wordfence Security es el plugin de seguridad más utilizado en WordPress, con más de 4 millones de instalaciones activas. Desarrollado por Defiant Inc., ofrece protección integral contra malware, ataques de fuerza bruta, y vulnerabilidades de seguridad.

## ¿Por qué Wordfence es Essential?

### El Panorama de Seguridad WordPress

**Estadísticas alarmantes:**
- **90,000+ ataques** por minuto contra sitios WordPress
- **70% de sitios WordPress** tienen vulnerabilidades conocidas
- **$4.45 millones** costo promedio de un breach de datos
- **43% de ciberataques** dirigidos a pequeñas empresas

En Chile, los ataques a sitios web han aumentado **300% desde 2020**, especialmente contra e-commerce y sitios corporativos.

### Arquitectura de Protección

**1. Web Application Firewall (WAF)**
- Bloquea ataques antes de que lleguen a WordPress
- Protege contra SQL injection y XSS
- Updates de reglas en tiempo real
- Geoblocking por países

**2. Malware Scanner**
- Escaneo completo de archivos
- Comparación con core de WordPress
- Detección de backdoors y shells
- Alertas instantáneas por email

**3. Login Security**
- Protección contra fuerza bruta
- Two-Factor Authentication (2FA)
- CAPTCHA inteligente
- Limiting de intentos de login

## Configuración Optimal para Chile

### Setup Inicial Recomendado

**1. Activación y License**
\`\`\`bash
# Free vs Premium
Free: Funcionalidades básicas
Premium ($119/año): 
- Real-time IP blacklist
- Country blocking
- Premium support
- Advanced 2FA
\`\`\`

**2. Firewall Configuration**
- **Learning Mode**: 1 semana inicial
- **Protection Level**: Medium (para empezar)
- **Rate Limiting**: 1 request/minuto para login
- **Brute Force Protection**: Activado

**3. Geoblocking para Chile**
Configuración sugerida para empresas chilenas:
- **Permitir**: Chile, Argentina, Perú, Bolivia
- **Bloquear**: China, Rusia, Filipinas (alta incidencia de ataques)
- **Whitelist**: IPs de oficina y desarrolladores

### Scan Configuration

**Scheduled Scans:**
- **Core files**: Diario a las 3 AM
- **Plugins/Themes**: Cada 6 horas
- **Full scan**: Semanal (domingos)
- **Email alerts**: Solo para High severity

**Exclusion Rules:**
\`\`\`
/wp-content/cache/
/wp-content/uploads/
.log files
backup files
\`\`\`

## Casos de Uso Específicos

### E-commerce (WooCommerce)

**Protecciones críticas:**
1. **Payment security**: Protección de checkout
2. **Customer data**: Encriptación de datos personales
3. **Inventory protection**: Prevención de manipulación
4. **Session security**: Protección de carritos de compra

**Configuration checklist:**
- [ ] SSL enforced en todo el site
- [ ] Rate limiting en APIs
- [ ] Admin access restriction
- [ ] Payment gateway IP whitelist

### Sitios Corporativos

**Multi-site management:**
- Central dashboard para múltiples sitios
- Políticas de seguridad unificadas
- Reporting consolidado
- Automated response

### High-Traffic Sites

**Performance considerations:**
- **Async scanning**: No impacta performance
- **Cache exclusions**: Configurar con LiteSpeed Cache
- **Resource limits**: Monitor CPU usage
- **CDN integration**: Bypass para security checks

## Threat Intelligence

### Threat Defense Feed

**Real-time protection:**
- **IP reputation**: 200+ million IPs monitored
- **Signature updates**: Multiple times daily
- **Geographic intelligence**: Country-based threats
- **Malware signatures**: 500,000+ known variants

### Advanced Features (Premium)

**1. Live Traffic View**
- Real-time visitor monitoring
- Attack visualization
- Geographic threat mapping
- Suspicious behavior detection

**2. Two-Factor Authentication**
- TOTP apps (Google Authenticator)
- SMS backup codes
- Recovery codes
- Forced 2FA for administrators

**3. Country Blocking**
- Granular country controls
- Continent-level blocking
- VPN/Proxy detection
- Whitelist override

## Integration con Hosting

### Server-Level WAF vs Plugin WAF

| Aspecto | Server WAF | Wordfence WAF |
|---------|------------|---------------|
| Performance | Faster | Good |
| WordPress específico | No | Yes |
| Customization | Limited | Extensive |
| Cost | Incluido | Free/Premium |
| Maintenance | Host managed | Self-managed |

**Best practice**: Ambos layers activos (defense in depth)

### Compatibility Issues

**Common conflicts:**
1. **Caching plugins**: Exclusion rules needed
2. **Other security plugins**: Choose one primary
3. **CDN services**: Bypass configuration
4. **Page builders**: Whitelist admin areas

## Incident Response

### When Malware is Detected

**Immediate actions:**
1. **Don't panic** - Automated cleanup available
2. **Review scan results** in detail
3. **Backup clean files** before cleanup
4. **Run manual cleanup** or use automated
5. **Change all passwords** after cleanup
6. **Audit user accounts** for unauthorized access

### Response Timeline

**0-1 hour:**
- Site isolation (if severely compromised)
- Initial assessment and backup
- Password changes

**1-24 hours:**
- Deep malware cleanup
- Vulnerability patching
- Security hardening

**24-72 hours:**
- Full security audit
- Performance optimization
- Team training/documentation

## Performance Impact

### Resource Usage

**Typical overhead:**
- **CPU**: <2% additional usage
- **Memory**: 50-100MB RAM
- **Database**: Minimal queries
- **Page load**: <100ms added

**Optimization tips:**
1. Schedule heavy scans during low traffic
2. Use premium real-time IP blacklist
3. Configure appropriate scan frequency
4. Exclude cache directories

## Compliance y Legal

### Chilean Data Protection

**Ley 19.628 compliance:**
- Personal data encryption
- Access logging and monitoring
- Incident notification procedures
- Data breach response plan

### International Standards

**SOC 2 Type II compliance:**
- Security controls documentation
- Regular penetration testing
- Third-party security audits
- Incident response procedures

## Cost-Benefit Analysis

### ROI Calculation

**Prevention costs:**
- Wordfence Premium: $119/año
- Labor for setup: 4-8 horas
- Ongoing maintenance: 2 horas/mes

**Incident costs (without protection):**
- Cleanup services: $500-$5,000
- Lost revenue: $1,000-$50,000
- Reputation damage: Incalculable
- Legal compliance: $10,000+

**ROI**: 1000%+ en prevención vs remediation

## Advanced Configuration

### Custom Rules

**Block by file extension:**
\`\`\`
Block files ending in: .php.bak, .sql, .log
Allow only for admins: wp-admin/
Rate limit: /wp-json/ endpoints
\`\`\`

**Whitelist management:**
- Development team IPs
- Third-party integrations
- Legitimate crawlers
- Payment gateway IPs

### API Security

**WordPress REST API protection:**
- Endpoint-specific rate limiting
- Authentication enforcement
- Query parameter validation
- Response filtering

## Conclusion

Wordfence represents the gold standard for WordPress security. For Chilean businesses, the combination of local threat intelligence, Chilean legal compliance features, and integration with hosting providers makes it an essential security investment.

**The bottom line:** No WordPress site should run without professional security protection. The cost of prevention is always lower than the cost of recovery.`,
    category: 'security',
    cms: 'wordpress',
    tags: ['seguridad', 'firewall', 'malware', 'wordpress'],
    level: 'medio',
    related: ['wordpress', 'jetbackup', 'ssl', 'hosting-wordpress'],
    hostingRequirements: ['PHP 7.4+', 'Cron jobs estables', 'Memory 256MB+', 'Email SMTP'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Seguridad multicapa: Wordfence + WAF servidor',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['WAF a nivel servidor', 'JetBackup diario', 'Monitoreo 24/7', 'Soporte seguridad'],
    whenToUse: 'Todo sitio WordPress necesita protección contra ataques.',
    synonyms: ['Wordfence Security', 'WordPress Security', 'WP Firewall'],
    lastUpdated: '2024-12-09'
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
    longDefinition: `WooCommerce es el plugin de e-commerce más popular para WordPress, utilizado por más del 28% de todas las tiendas online del mundo.

## ¿Qué es WooCommerce?

WooCommerce es una extensión gratuita y de código abierto para WordPress que transforma cualquier sitio web en una tienda online completamente funcional. Desarrollado por Automattic (la empresa detrás de WordPress.com), se ha convertido en la solución de e-commerce más utilizada globalmente.

### Características Principales

- **Gestión de productos ilimitados** con variaciones, categorías y atributos
- **Sistema de pagos integrado** con soporte para múltiples pasarelas
- **Gestión de inventario** automática con alertas de stock bajo
- **Cálculo de envíos** flexible con múltiples opciones de entrega
- **Sistema de cupones** y descuentos avanzado
- **Informes y analytics** detallados de ventas
- **Soporte multimoneda** y multi-idioma

## Configuración en Chile

### Pasarelas de Pago Chilenas

1. **Transbank Webpay Plus** - Oficial del sistema bancario chileno
2. **Flow** - Popular entre startups y PYME
3. **Khipu** - Transferencias bancarias directas
4. **MercadoPago** - Para ventas internacionales

### Configuración de Envíos

\`\`\`
Zona: Región Metropolitana
- Envío estándar: $3.000 - $5.000
- Envío express: $5.000 - $8.000
- Retiro en tienda: Gratis

Zona: Regiones
- Envío estándar: $5.000 - $8.000
- Envío express: $8.000 - $12.000
\`\`\`

## Requisitos de Hosting para WooCommerce

### Especificaciones Mínimas
- **PHP 8.0+** (recomendado 8.3)
- **MySQL 5.7+** o MariaDB 10.3+
- **Memoria RAM**: 512MB mínimo, 2GB recomendado
- **Almacenamiento**: 10GB+ con SSD
- **SSL**: Certificado obligatorio
- **Ancho de banda**: Ilimitado preferible

### Optimizaciones de Rendimiento

1. **Cache de objetos** (Redis/Memcached)
2. **CDN** para imágenes de productos
3. **Compresión de imágenes** automática
4. **Cache de base de datos** específico
5. **HTTP/3** para carga más rápida

## Extensiones Esenciales

### Gratuitas
- **WooCommerce Blocks** - Bloques Gutenberg
- **WooCommerce PDF Invoices** - Facturas automáticas
- **YITH WooCommerce Wishlist** - Lista de deseos

### Premium
- **WooCommerce Subscriptions** - Pagos recurrentes
- **WooCommerce Bookings** - Reservas y citas
- **WooCommerce Memberships** - Contenido exclusivo

## Casos de Uso en Chile

### PYME y Startups
- Catálogo de productos simple
- Integración con redes sociales
- Gestión de inventario básica
- Reportes de ventas automáticos

### E-commerce Empresarial
- Múltiples sucursales
- Integración con ERP/CRM
- B2B con precios por volumen
- Marketplace multi-vendor

## Problemas Comunes y Soluciones

### Lentitud en la Carga
**Problema**: Tienda lenta con muchos productos
**Solución**: 
- Activar cache de objetos Redis
- Optimizar imágenes (WebP)
- Usar CDN para recursos estáticos
- Minimizar plugins activos

### Errores en Checkout
**Problema**: Clientes no pueden finalizar compra
**Solución**:
- Verificar SSL válido
- Aumentar memory_limit PHP
- Revisar conflictos de plugins
- Optimizar base de datos

### Problemas de Stock
**Problema**: Desincronización de inventario
**Solución**:
- Configurar alertas de stock bajo
- Implementar reservas temporales
- Integrar con sistema de bodega
- Auditorías de inventario regulares

## SEO para WooCommerce

### Configuración Básica
1. **URLs amigables** (/producto/nombre-producto/)
2. **Meta descriptions** únicas por producto
3. **Schema markup** automático
4. **Sitemap XML** de productos
5. **Breadcrumbs** estructurados

### Optimización Avanzada
- Rich snippets con precios y reviews
- Optimización de imágenes con alt text
- Velocidad de carga optimizada
- Estructura de categorías lógica

## Seguridad en WooCommerce

### Medidas Esenciales
1. **SSL/TLS** en todo el sitio
2. **Actualizaciones** regulares
3. **Backups** diarios automáticos
4. **Firewall** específico para e-commerce
5. **Monitoreo** de transacciones sospechosas

### Cumplimiento Legal Chile
- Protección de datos personales (Ley 19.628)
- Facturación electrónica (SII)
- Términos y condiciones claros
- Política de devoluciones explícita

## Migración a WooCommerce

### Desde Otras Plataformas
1. **Shopify → WooCommerce**: Plugin Cart2Cart
2. **Magento → WooCommerce**: Importación manual
3. **PrestaShop → WooCommerce**: LitExtension
4. **Tienda física → Online**: Implementación gradual

### Proceso de Migración
1. Auditoría de productos actuales
2. Configuración de hosting optimizado
3. Importación de datos
4. Configuración de pagos y envíos
5. Testing exhaustivo
6. Lanzamiento gradual

## Mantenimiento y Escalabilidad

### Tareas Rutinarias
- Actualización semanal de plugins
- Optimización mensual de base de datos
- Revisión trimestral de rendimiento
- Auditoría anual de seguridad

### Escalabilidad
**Pequeña tienda** (0-100 productos):
- Hosting compartido optimizado
- Cache básico
- Backup semanal

**Tienda mediana** (100-1000 productos):
- VPS dedicado
- Cache avanzado (Redis)
- CDN implementado
- Backup diario

**Tienda grande** (1000+ productos):
- Servidor dedicado
- Cluster de base de datos
- CDN multi-región
- Monitoreo 24/7

## ROI y Métricas Clave

### KPIs Esenciales
- **Tasa de conversión**: Meta 2-3%
- **Valor promedio del pedido**: Seguimiento mensual
- **Costo de adquisición**: Por canal de marketing
- **Lifetime value**: Valor de cliente a largo plazo
- **Abandono de carrito**: Meta <70%

### Herramientas de Analytics
1. Google Analytics 4 + Enhanced E-commerce
2. Google Search Console
3. WooCommerce Analytics nativo
4. Hotjar para comportamiento de usuario

## Futuro de WooCommerce

### Tendencias 2025
- **Headless commerce** para mejor rendimiento
- **IA para personalización** de productos
- **Realidad aumentada** para prueba virtual
- **Checkout en una página** optimizado
- **Sostenibilidad** y comercio consciente

### Nuevas Funcionalidades
- Integración nativa con redes sociales
- Pagos en criptomonedas
- Suscripciones flexibles
- Marketplace interno
- Automatización de marketing

## Conclusión

WooCommerce sigue siendo la mejor opción para e-commerce en WordPress por su flexibilidad, ecosistema de plugins y soporte de la comunidad. Para tiendas en Chile, la combinación de WooCommerce + hosting optimizado + pasarelas locales ofrece una solución completa y escalable.

**¿Listo para lanzar tu tienda online?** Un hosting optimizado para WooCommerce es fundamental para el éxito de tu e-commerce.`,
    category: 'woocommerce',
    cms: 'wordpress',
    tags: ['ecommerce', 'tienda', 'ventas', 'wordpress'],
    level: 'medio',
    related: ['flow', 'ssl', 'hosting-wordpress', 'litespeed-cache', 'redis-cache'],
    hostingRequirements: ['PHP 8.0+', 'MySQL 5.7+', 'SSL certificado', 'Memory 512MB+', 'SSD storage'],
    cta: {
      plan: 'WordPress E-commerce',
      copy: 'Hosting optimizado para WooCommerce',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=5'
    },
    proofPoints: [
      'Soporte PHP 8.3 optimizado',
      'MySQL 8.0 para máximo rendimiento',
      'SSL gratuito incluido',
      'Backup automático diario'
    ],
    whenToUse: 'Cuando necesites crear una tienda online robusta con WordPress',
    synonyms: ['WooCommerce', 'Woo'],
    lastUpdated: '2024-12-09'
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
    longDefinition: `RankMath es el plugin SEO más innovador para WordPress, desarrollado por MyThemeShop. Desde su lanzamiento en 2018, ha ganado más de 1 millón de instalaciones activas gracias a su interfaz moderna y características avanzadas incluidas gratuitamente.

## ¿Por qué RankMath supera a Yoast?

### Características Gratuitas vs Premium

| Funcionalidad | RankMath (Gratis) | Yoast (Gratis) | Yoast Premium |
|---------------|-------------------|----------------|---------------|
| Keywords por post | 5 | 1 | Ilimitadas |
| Schema Markup | 13+ tipos | Básico | Avanzado |
| Google Analytics | Integrado | No | No |
| Search Console | Integrado | No | No |
| 404 Monitor | ✅ | ❌ | ✅ |
| Redirects | ✅ | ❌ | ✅ |
| Local SEO | ✅ | ❌ | ✅ |

### Ventajas Técnicas

**1. Performance superior**
- Código más limpio y optimizado
- Menor impacto en velocidad del sitio
- Database footprint más pequeño

**2. Interfaz moderna**
- Dashboard centralizado
- Setup wizard intuitivo
- Interface similar a Google Analytics

**3. Funcionalidades avanzadas**
- Content AI para optimización
- Internal linking automático
- XML sitemaps avanzados
- Meta title/description templates

## Configuración Paso a Paso

### 1. Instalación y Setup Wizard

1. **Instalar RankMath** desde WordPress admin
2. **Ejecutar Setup Wizard** (conecta Analytics y Search Console)
3. **Elegir tipo de sitio** (Blog, Business, E-commerce, etc.)
4. **Configurar preferencias** SEO básicas

### 2. Configuración de Schema Markup

RankMath incluye 13+ tipos de Schema automáticos:

- **Article/BlogPosting** - Para posts de blog
- **Product** - Para WooCommerce
- **LocalBusiness** - Para empresas locales
- **FAQ** - Para páginas de preguntas
- **Recipe** - Para blogs de cocina
- **Course** - Para contenido educativo

### 3. Optimización de Contenido

**Focus Keywords múltiples:**
\`\`\`
Keyword principal: "hosting wordpress chile"
Keywords secundarias: 
- "mejor hosting wordpress"
- "hosting optimizado wordpress"
- "servidor wordpress chile"
\`\`\`

**Content AI analysis:**
- Analiza top 10 resultados de Google
- Sugiere keywords relacionadas
- Recomienda longitud de contenido
- Identifica gaps de contenido

## Características Específicas para Chile

### Local SEO Setup

1. **Google My Business**: Conexión directa
2. **Schema LocalBusiness**:
   \`\`\`json
   {
     "@type": "LocalBusiness",
     "name": "Tu Empresa",
     "address": {
       "streetAddress": "Av. Providencia 123",
       "addressLocality": "Santiago",
       "addressRegion": "RM",
       "postalCode": "7500000",
       "addressCountry": "CL"
     }
   }
   \`\`\`

3. **Multiple Locations**: Para empresas con sucursales

### Optimización para Búsquedas Chilenas

**Keywords locales automáticas:**
- Geo-targeting para regiones específicas
- Integración con Google Trends Chile
- Análisis de competencia local

## Migración desde Yoast

### Proceso Automático

1. **Backup completo** antes de migrar
2. **Activar RankMath** (mantener Yoast temporalmente)
3. **Import Tool** automático:
   - Meta títulos y descripciones
   - Keywords focus
   - Configuraciones básicas
   - Redirects existentes

4. **Verificar migración**:
   - Revisar meta tags principales
   - Comprobar Schema markup
   - Verificar sitemaps XML

### Post-Migración Checklist

- [ ] Google Search Console reconectado
- [ ] Analytics funcionando
- [ ] Sitemaps enviados
- [ ] Redirects funcionando
- [ ] Schema markup activo

## Características Avanzadas

### 1. Content AI

**Análisis de competencia:**
- Examina top 10 resultados
- Sugiere keywords LSI
- Recomienda H2/H3 structure
- Analiza sentiment

**Optimization score:**
- Evaluación automática 0-100
- Sugerencias específicas
- Real-time feedback

### 2. Internal Linking

**Automatic suggestions:**
- Detecta oportunidades de linking
- Sugiere anchor text optimizado
- Orphan content detection
- Link equity distribution

### 3. Analytics Integration

**Unified dashboard:**
- Search Console data
- Google Analytics metrics
- Keyword ranking tracking
- Click-through rates

## Optimización E-commerce

### WooCommerce Integration

**Product Schema automático:**
- Precios y disponibilidad
- Reviews y ratings
- Variaciones de producto
- Rich snippets en SERP

**Category optimization:**
- Meta descriptions dinámicas
- Breadcrumb optimization
- Faceted navigation SEO

## Troubleshooting Común

### 1. Schema Markup No Aparece

**Solución:**
1. Verificar en Google Rich Results Test
2. Revisar conflictos con otros plugins
3. Limpiar cache
4. Re-indexar contenido

### 2. Analytics No Sincroniza

**Solución:**
1. Reconectar API de Google
2. Verificar permisos de cuenta
3. Comprobar quotas API
4. Revisar configuración firewall

### 3. Performance Issues

**Solución:**
1. Desactivar módulos no necesarios
2. Optimizar database
3. Configurar object caching
4. Revisar hosting compatibility

## ROI y Métricas

### KPIs a Monitorear

**Ranking improvements:**
- Posición promedio en SERP
- CTR orgánico
- Impresiones totales
- Keywords en top 10

**Technical SEO:**
- Core Web Vitals score
- Schema markup coverage
- Internal linking density
- Crawl error reduction

### Comparativa de Resultados

**Caso estudio típico (6 meses):**
- **Yoast → RankMath**: +23% tráfico orgánico
- **Schema implementation**: +15% CTR
- **Multiple keywords**: +31% keyword coverage
- **Local SEO**: +45% búsquedas locales

## Futuro y Roadmap

### Nuevas Características 2025

- **AI Content Generator** integrado
- **Voice search optimization**
- **Video SEO** avanzado
- **E-A-T scoring** automático
- **Core Web Vitals** monitoring

### Integration Roadmap

- Deeper WooCommerce integration
- Advanced Schema types
- Multilingual SEO improvements
- API expansions

## Conclusión

RankMath representa la evolución natural del SEO para WordPress. Su combinación de características gratuitas avanzadas, interfaz moderna y performance superior lo convierte en la mejor opción para proyectos nuevos y migraciones desde Yoast.

**Para sitios en Chile**, la integración nativa con Local SEO y Google My Business hace que RankMath sea especialmente valioso para empresas que buscan visibilidad local.`,
    category: 'seo',
    cms: 'wordpress',
    tags: ['seo', 'moderno', 'gratis', 'analytics'],
    level: 'medio',
    related: ['yoast-seo', 'schema', 'google-analytics', 'wordpress', 'woocommerce'],
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