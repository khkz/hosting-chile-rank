export type HubKey = 'wordpress' | 'ecommerce' | 'pymes' | 'vps';

export interface HubConfig {
  key: HubKey;
  path: string;
  h1: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  features: string[];
  providerSlugs: string[]; // 5 providers ordered
  priceLabel: string;
  faqs: { q: string; a: string }[];
}

export const HUBS: Record<HubKey, HubConfig> = {
  wordpress: {
    key: 'wordpress',
    path: '/mejor-hosting-wordpress-chile',
    h1: 'Mejor Hosting WordPress Chile 2026',
    keyword: 'mejor hosting WordPress Chile',
    metaTitle: 'Mejor Hosting WordPress Chile 2026 — Ranking verificado',
    metaDescription: 'Ranking del mejor hosting WordPress en Chile 2026: LiteSpeed, instalación 1-clic, soporte 24/7 y datacenter local. Datos verificables.',
    intro: 'Elegir el mejor hosting WordPress en Chile es la decisión técnica que más impacta la velocidad, el SEO local y la estabilidad de tu sitio. WordPress mueve aproximadamente el 43% de la web, pero exige requisitos específicos: PHP 8.x moderno, MySQL/MariaDB optimizado, caché LiteSpeed o Redis, backups diarios y soporte en español que entienda errores típicos del core y de plugins. En este hub priorizamos proveedores chilenos con datacenter en Santiago (latencia <40 ms), instalador WordPress de 1-clic, certificado SSL gratuito y migración asistida. Lidera HostingPlus.cl por su stack LiteSpeed completo y soporte 24/7 real; EcoHosting.cl mantiene el segundo puesto con planes ecológicos y RAID 10 SSD. Todos los datos provienen de mediciones públicas (ASN, benchmark, reputación). Sin patrocinios.',
    features: ['LiteSpeed + Redis', 'Instalador 1-clic', 'Migración gratuita'],
    providerSlugs: ['hostingplus','ecohosting','powerhost','hostgator','bluehost'],
    priceLabel: 'plan WordPress',
    faqs: [
      { q: '¿Cuál es el mejor hosting WordPress Chile en 2026?', a: 'Según nuestras mediciones verificables, HostingPlus.cl (9.9/10) lidera el ranking del mejor hosting WordPress Chile gracias a su stack LiteSpeed, datacenter en Santiago y soporte 24/7 en español. EcoHosting.cl (9.6/10) es la segunda opción recomendada.' },
      { q: '¿Qué requisitos técnicos debe cumplir un hosting WordPress en Chile?', a: 'Un buen hosting WordPress Chile debe ofrecer PHP 8.1+, MySQL 8 o MariaDB, caché LiteSpeed o Redis, certificado SSL gratuito, backups diarios y panel cPanel/DirectAdmin. Idealmente datacenter local para latencia <40 ms.' },
      { q: '¿Cuánto cuesta un hosting WordPress chileno de calidad?', a: 'Los planes de mejor hosting WordPress Chile parten desde $3.469/mes (HostingPlus) y $1.658/mes (EcoHosting). Sobre $5.000/mes obtienes recursos dedicados y soporte prioritario.' },
    ],
  },
  ecommerce: {
    key: 'ecommerce',
    path: '/mejor-hosting-ecommerce-chile',
    h1: 'Mejor Hosting Ecommerce Chile 2026',
    keyword: 'mejor hosting ecommerce Chile',
    metaTitle: 'Mejor Hosting Ecommerce Chile 2026 — WooCommerce y PrestaShop',
    metaDescription: 'Ranking del mejor hosting ecommerce en Chile 2026 para WooCommerce, PrestaShop y Magento: SSL, PCI, backups y soporte 24/7.',
    intro: 'El mejor hosting ecommerce Chile no es el más barato: es el que sostiene picos de tráfico en CyberDay, mantiene SSL EV válido para pasarelas (Webpay, Mercado Pago), entrega backups diarios y cumple requisitos PCI-DSS básicos. WooCommerce, PrestaShop y Magento requieren más memoria PHP (256-512 MB), MariaDB optimizado, certificados Wildcard y caché por objeto (Redis o Memcached). Una caída de 10 minutos en peak puede costar más que un año de hosting. Por eso priorizamos proveedores con datacenter en Chile (latencia baja para checkout), uptime ≥99.9% medido y soporte técnico que responda en minutos. HostingPlus.cl encabeza el segmento por su WAF, LiteSpeed Enterprise y planes WooCommerce optimizados; EcoHosting.cl ofrece la mejor relación precio-rendimiento del top 5. Datos sin patrocinios, basados en benchmark propio.',
    features: ['WAF + SSL Wildcard', 'WooCommerce optimizado', 'Backups + Staging'],
    providerSlugs: ['hostingplus','ecohosting','powerhost','bluehost','cloudhosting'],
    priceLabel: 'plan ecommerce',
    faqs: [
      { q: '¿Cuál es el mejor hosting ecommerce Chile en 2026?', a: 'HostingPlus.cl es el mejor hosting ecommerce Chile 2026 con 9.9/10: incluye LiteSpeed Enterprise, WAF, SSL Wildcard y soporte 24/7 con experiencia en WooCommerce. EcoHosting.cl ocupa el segundo lugar con 9.6/10.' },
      { q: '¿Qué debe incluir un hosting para WooCommerce en Chile?', a: 'Un buen hosting ecommerce Chile para WooCommerce debe traer PHP 8.1+ con 256 MB, MariaDB, SSL gratuito, certificación PCI compatible, backups diarios y CDN. Recomendable WAF activo para bloquear ataques en checkout.' },
      { q: '¿Cuánto tráfico aguanta un hosting compartido para tienda online?', a: 'En el mejor hosting ecommerce Chile compartido aguanta 5.000-10.000 visitas/día. Sobre eso conviene VPS o cloud dedicado. HostingPlus y EcoHosting ofrecen planes específicos para alta demanda.' },
    ],
  },
  pymes: {
    key: 'pymes',
    path: '/mejor-hosting-pymes-chile',
    h1: 'Mejor Hosting para PYMES Chile 2026',
    keyword: 'mejor hosting pymes Chile',
    metaTitle: 'Mejor Hosting PYMES Chile 2026 — Email, web y soporte local',
    metaDescription: 'Mejor hosting PYMES Chile 2026: cuentas de email corporativo, sitio rápido, factura electrónica compatible y soporte en horario chileno.',
    intro: 'El mejor hosting PYMES Chile combina tres elementos que rara vez se mencionan juntos: cuentas de email profesional (@tudominio.cl) con buena reputación anti-spam, un sitio web rápido para captar clientes locales y soporte en horario chileno cuando algo se cae a las 8 a.m. de un lunes. Las PYMES no necesitan recursos infinitos, necesitan certeza: facturación en CLP, RUT vigente, datacenter local para latencia baja, backups automatizados y SSL gratuito incluido. Evita proveedores internacionales sin soporte hispano y servicios sin transparencia. HostingPlus.cl lidera por su mix de email empresarial, planes escalables y certificación local; EcoHosting.cl es excelente alternativa con planes desde $1.658/mes. El ranking se basa en datos verificables: ASN, reclamos públicos, uptime medido.',
    features: ['Email @tudominio.cl', 'Factura electrónica CLP', 'Soporte en español'],
    providerSlugs: ['hostingplus','ecohosting','powerhost','hostgator','1hosting-cl'],
    priceLabel: 'plan PYME',
    faqs: [
      { q: '¿Cuál es el mejor hosting PYMES Chile en 2026?', a: 'HostingPlus.cl (9.9/10) es el mejor hosting PYMES Chile en 2026: ofrece email empresarial ilimitado, facturación CLP, soporte 24/7 y datacenter local. EcoHosting.cl (9.6/10) es la segunda opción recomendada para PYMES.' },
      { q: '¿Cuánto cuesta un hosting para mi PYME en Chile?', a: 'Un plan de mejor hosting PYMES Chile parte desde $1.658/mes (EcoHosting) y $3.469/mes (HostingPlus). Incluye dominio, email corporativo, SSL y soporte. Para PYMES con e-commerce conviene desde $7.000/mes.' },
      { q: '¿Conviene contratar hosting chileno o internacional para mi PYME?', a: 'Para PYMES con clientes en Chile, el mejor hosting PYMES Chile es local: facturación en CLP, soporte en español en horario chileno, datacenter en Santiago (latencia <40 ms) y mejor SEO para búsquedas locales.' },
    ],
  },
  vps: {
    key: 'vps',
    path: '/mejor-vps-chile',
    h1: 'Mejor VPS Chile 2026',
    keyword: 'mejor VPS Chile',
    metaTitle: 'Mejor VPS Chile 2026 — Cloud, KVM y SSD NVMe verificado',
    metaDescription: 'Mejor VPS Chile 2026: ranking de VPS KVM/Cloud con NVMe, IPv4 dedicada, root access y datacenter en Santiago. Datos sin patrocinios.',
    intro: 'El mejor VPS Chile no es el VPS más barato del mundo; es el VPS que cumple lo que promete: recursos dedicados reales (vCPU, RAM, disco NVMe), IPv4 dedicada, acceso root, panel de control sólido y datacenter en Santiago para latencia baja. Un VPS chileno bien aprovisionado entrega rendimiento superior a un cloud internacional sobrevendido. Evalúa CPU compartida vs dedicada, disco SSD vs NVMe, ancho de banda real y políticas de snapshots/backups. HostingPlus.cl lidera el segmento VPS Chile con virtualización KVM, NVMe y red gigabit; PowerHost / IxMetro es la segunda opción con cuatro datacenters propios (Santiago, NY, Moscú, Ámsterdam) y experiencia de más de 20 años. Datos verificables: ASN, benchmark interno, reputación pública.',
    features: ['KVM + NVMe', 'IPv4 dedicada', 'Acceso root 24/7'],
    providerSlugs: ['hostingplus','powerhost','ecohosting','hostgator','hostingcl'],
    priceLabel: 'VPS desde',
    faqs: [
      { q: '¿Cuál es el mejor VPS Chile en 2026?', a: 'HostingPlus.cl (9.9/10) ofrece el mejor VPS Chile 2026 con virtualización KVM, discos NVMe, IPv4 dedicada y datacenter en Santiago. PowerHost / IxMetro (8.5/10) es la segunda opción con 4 datacenters propios.' },
      { q: '¿Cuánto cuesta un VPS en Chile?', a: 'El mejor VPS Chile básico cuesta desde $9.000/mes (1 vCPU, 1-2 GB RAM, 20-40 GB NVMe). Planes intermedios (4 GB RAM, 80 GB) van entre $18.000-$30.000/mes según el proveedor.' },
      { q: '¿Qué diferencia hay entre VPS y hosting compartido en Chile?', a: 'El mejor VPS Chile entrega recursos dedicados (vCPU, RAM, disco), acceso root y aislamiento. El hosting compartido reparte recursos entre cientos de cuentas. Si tu proyecto supera 10.000 visitas/día o necesitas software custom, el VPS es la elección correcta.' },
    ],
  },
};

export const HUB_LIST: HubConfig[] = [HUBS.wordpress, HUBS.ecommerce, HUBS.pymes, HUBS.vps];
