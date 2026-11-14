/**
 * Contenido escrito a mano de las reseñas (/resenas/:slug), movido tal cual
 * desde Resena.tsx para dejar la página bajo 400 líneas.
 * Las notas y textos de aquí son la decisión de negocio pendiente 10: no se
 * cambian. Los datos medidos y la ficha salen de la base, no de este archivo.
 */
export interface ResenaHosting {
  name: string;
  logo: string;
  rating: number;
  description: string;
  pros: string[];
  cons: string[];
  url: string;
}

/**
 * Slug de la reseña y slug de la ficha del catálogo de Chile. Solo pares
 * comprobados uno a uno; null = no hay ficha equivalente (no se muestra desglose).
 * Ojo: en la reseña «bluehost» es BlueHost y «bluehosting» es BlueHosting.cl,
 * mientras que en el catálogo «bluehost» es BlueHosting.cl.
 */
export const RESENA_TO_CATALOG: Record<string, string | null> = {
  hostingplus: 'hostingplus',
  ecohosting: 'ecohosting',
  '1hosting': '1hosting-cl',
  hostgator: 'hostgator',
  hostname: 'hn',
  bluehost: null,
  donweb: 'donweb',
  godaddy: 'godaddy',
  powerhost: 'powerhost',
  hostingcl: 'hostingcl',
  bluehosting: 'bluehost',
};

// Datos completos para reseñas de hosting
export const hostingData: Record<string, ResenaHosting> = {
  'hostingplus': {
    name: 'HostingPlus',
    logo: '/logo-hostingplus-official.png',
    rating: 9.8,
    description: 'HostingPlus ofrece una combinación única de rendimiento, seguridad y soporte técnico que lo posiciona como nuestra principal recomendación en el mercado chileno.',
    pros: [
      'Servidor LiteSpeed de alto rendimiento',
      'Backups diarios automatizados',
      'Firewall WAF avanzado',
      'Soporte técnico 24/7 en español',
      'Datacenter en Santiago para mejor latencia'
    ],
    cons: [
      'Precio ligeramente superior a algunas alternativas',
      'Panel de control personalizado que requiere aprendizaje'
    ],
    url: 'https://www.hostingplus.cl/'
  },
  'ecohosting': {
    name: 'EcoHosting',
    logo: '/logo-ecohosting-new.svg',
    rating: 9.3,
    description: 'EcoHosting destaca por su compromiso con el medio ambiente y su excelente rendimiento técnico, ofreciendo una alternativa confiable y responsable.',
    pros: [
      'Servidores con energía 100% renovable',
      'Excelente velocidad de carga',
      'Servicio de migración gratuito',
      'Backups diarios incluidos',
      'Buen soporte técnico'
    ],
    cons: [
      'Precio superior a la media',
      'Menos opciones de personalización avanzada'
    ],
    url: 'https://www.ecohosting.cl/'
  },
  '1hosting': {
    name: '1Hosting',
    logo: '/logo-1hosting.svg',
    rating: 8.8,
    description: '1Hosting ofrece planes accesibles con buen rendimiento, siendo una opción muy recomendable para proyectos pequeños y medianos.',
    pros: [
      'Precios muy competitivos',
      'Uptime monitoreado (ver /benchmark)',
      'Panel cPanel intuitivo',
      'Soporte técnico eficiente',
      'Buenos recursos en planes básicos'
    ],
    cons: [
      'No incluye LiteSpeed',
      'Backups menos frecuentes',
      'Soporte no 24/7'
    ],
    url: 'https://www.1hosting.cl/'
  },
  'hostgator': {
    name: 'HostGator',
    logo: 'https://logo.clearbit.com/hostgator.cl',
    rating: 9.2,
    description: 'HostGator es un proveedor internacional con presencia en Chile que ofrece soluciones de hosting de buena calidad y precios competitivos.',
    pros: [
      'Planes económicos con buen rendimiento',
      'Garantía de devolución de dinero de 45 días',
      'Panel de control cPanel fácil de usar',
      'Soporte técnico en español',
      'Uptime monitoreado (ver /benchmark)'
    ],
    cons: [
      'Datacenter principal fuera de Chile',
      'Costos de renovación más altos',
      'Tiempos de respuesta variables en soporte'
    ],
    url: 'https://www.hostgator.cl/'
  },
  'hostname': {
    name: 'HN.cl',
    logo: '/logo-hostname.png',
    rating: 9.2,
    description: 'HN.cl (Hostname) es un proveedor chileno de hosting que destaca por su excelente soporte técnico 24/7 y su compromiso con el rendimiento optimizado para el mercado local.',
    pros: [
      'Soporte técnico excepcional 24/7 en español',
      'Servidores LiteSpeed de alto rendimiento',
      'Datacenter en Santiago con baja latencia',
      'Backups diarios automatizados',
      'Firewall WAF avanzado incluido',
      'Panel cPanel fácil de usar'
    ],
    cons: [
      'Precio ligeramente superior a competidores básicos',
      'Planes de entrada con recursos limitados'
    ],
    url: 'https://hn.cl/'
  },
  'bluehost': {
    name: 'BlueHost',
    logo: '/logo-bluehost.svg',
    rating: 9.0,
    description: 'BlueHost es reconocido internacionalmente y recomendado por WordPress.org, ofrece un buen servicio para sitios web personales y empresariales.',
    pros: [
      'Optimizado para WordPress',
      'Dominio gratis incluido el primer año',
      'Interfaz muy intuitiva',
      'SSL gratuito',
      'Instalación automática de aplicaciones'
    ],
    cons: [
      'Precios de renovación elevados',
      'Datacenter fuera de Chile (mayor latencia)',
      'Opciones de personalización limitadas'
    ],
    url: 'https://www.bluehost.cl/'
  },
  'donweb': {
    name: 'DonWeb',
    logo: 'https://logo.clearbit.com/donweb.cl',
    rating: 8.7,
    description: 'DonWeb es un proveedor de hosting latinoamericano con presencia en varios países, incluido Chile, que ofrece soluciones económicas con buen rendimiento.',
    pros: [
      'Precios muy accesibles',
      'Datacenter en Argentina (buena latencia para Chile)',
      'Múltiples planes adaptados a diferentes necesidades',
      'Constructor de sitios web incluido',
      'Buen servicio al cliente en español'
    ],
    cons: [
      'Algunos problemas de rendimiento en horas pico',
      'Reportes de caídas ocasionales según Reclamos.cl',
      'Panel de control ligeramente anticuado'
    ],
    url: 'https://www.donweb.cl/'
  },
  'godaddy': {
    name: 'GoDaddy',
    logo: '/logo-godaddy.svg',
    rating: 8.3,
    description: 'GoDaddy es uno de los registradores de dominios y proveedores de hosting más grandes del mundo, con una interfaz amigable pero rendimiento variable.',
    pros: [
      'Interfaz de usuario muy intuitiva',
      'Buen para principiantes',
      'Integración perfecta entre dominios y hosting',
      'Amplia variedad de productos adicionales',
      'Soporte básico en español'
    ],
    cons: [
      'Precios de renovación muy elevados',
      'Múltiples quejas en Reclamos.cl sobre cobros automáticos',
      'Opciones de hosting básicas comparadas con competidores',
      'Datacenter lejos de Chile (mayor latencia)'
    ],
    url: 'https://cl.godaddy.com/'
  },
  'powerhost': {
    name: 'PowerHost / IxMetro',
    logo: 'https://logo.clearbit.com/powerhost.cl',
    rating: 8.5,
    description: 'PowerHost (IxMetro) opera como datacenter e infraestructura de red con ASN propio AS263237. Actualmente su oferta está enfocada en servicios de datacenter para empresas —VPS SSD, servidores dedicados (baremetal), housing/colocation, datacenter virtual, cross connect e IXP content vía AmericaIX— y no comercializa hosting compartido tradicional para usuarios finales. Es una alternativa para empresas que necesitan infraestructura, no para quien busca un plan de hosting clásico.',
    pros: [
      'ASN propio AS263237 con anuncios BGP verificables',
      'Datacenters propios en Santiago y presencia internacional (NY, MOW, AMS) según el proveedor',
      'Infraestructura propia declarada por el proveedor',
      'Servicios de housing, colocation y cross connect para empresas',
      'Conexión directa a AmericaIX (IXP) para reducir latencia internacional'
    ],
    cons: [
      'No vende hosting compartido tradicional: enfoque actual es datacenter e infraestructura',
      'Planes orientados a empresas: VPS SSD desde $43.000 + IVA/mes y dedicados desde 10,5 UF + IVA/mes',
      'Curva de entrada más técnica que un hosting compartido convencional',
      'Certificación Tier III declarada por el proveedor, sin verificación independiente del Uptime Institute'
    ],
    url: 'https://www.powerhost.cl/'
  },

  'hostingcl': {
    name: 'Hosting.cl',
    logo: 'https://logo.clearbit.com/hosting.cl',
    rating: 8.4,
    description: 'Hosting.cl es un proveedor chileno con datacenter propio en Santiago y ASN AS265839. Arrastra reclamos públicos repetidos entre 2012 y 2025 que se deben considerar. Nota editorial: Hosting.cl publicita "100% uptime", una garantía técnicamente imposible de cumplir; los SLA serios del sector rondan el 99,9%.',
    pros: [
      'Datacenter propio en Santiago (baja latencia local)',
      'ASN propio AS265839 verificable',
      'Servidores con LiteSpeed y WAF incluidos',
      'Backups diarios y dominio .CL en planes anuales'
    ],
    cons: [
      'Publicita "100% uptime", garantía técnicamente imposible de cumplir (SLA realista del sector: 99,9%)',
      'Reclamos públicos recurrentes entre 2012 y 2025 en Reclamos.cl',
      'Planes PYME desde $159.900 + IVA/año',
      'Tiempos de respuesta de soporte variables según horario'
    ],
    url: 'https://www.hosting.cl/'
  },
  'bluehosting': {
    name: 'BlueHosting.cl',
    logo: 'https://logo.clearbit.com/bluehosting.cl',
    rating: 8.2,
    description: 'BlueHosting.cl es un proveedor chileno que opera sobre infraestructura de Haulmer en Curicó (ASN AS64111). Su sitio web y estrategia de marketing sugieren una orientación mayor hacia la captación de tráfico y posicionamiento SEO que hacia la especialización técnica en hosting puro. Ofrece planes anuales con precios visibles y un perfil de reclamos mixto que conviene revisar antes de contratar.',
    pros: [
      'Publica precios anuales en su sitio',
      'Infraestructura en datacenter Haulmer (Curicó, Chile)',
      'Firewall WAF y backups diarios incluidos',
      'Dominio .CL gratis el primer año',
      'Panel cPanel familiar para usuarios técnicos'
    ],
    cons: [
      'No utiliza servidores LiteSpeed (Apache/Nginx estándar)',
      'Perfil de reclamos mixto en redes y foros locales',
      'Soporte 24/7 sólo en planes superiores',
      'Depende de infraestructura de terceros (Haulmer)',
      'Estrategia de marketing orientada a tráfico/SEO más que a especialización técnica en hosting'
    ],
    url: 'https://www.bluehosting.cl/'
  }
};
