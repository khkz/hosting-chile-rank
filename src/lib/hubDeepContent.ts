import type { HubKey } from './segmentHubs';

export interface HubDeep {
  protagonist: string;
  problem: { title: string; body: string; pains: string[] };
  guide: { title: string; body: string; pillars: { h: string; p: string }[] };
  plan: { title: string; steps: string[] };
  objections: { q: string; a: string }[];
  journeys: { persona: string; scenario: string; recommendation: string; slug: string; guide?: { label: string; href: string } }[];
  internalLinks: { label: string; href: string }[];
  criteria: string[]; // verifiable data points we use
}

export const HUB_DEEP: Record<HubKey, HubDeep> = {
  wordpress: {
    protagonist: 'Tú, que estás por lanzar (o migrar) un WordPress y no quieres que la velocidad ni el soporte te frenen.',
    problem: {
      title: 'El problema real de hospedar WordPress en Chile',
      body: 'La mayoría de sitios WordPress lentos no tienen un problema de "tema pesado": tienen un hosting que no cachea a nivel de servidor, servidores compartidos sobrevendidos y un datacenter lejos de tus lectores. Cuando el TTFB pasa de 800 ms, Google baja tu ranking y los lectores rebotan antes de ver el contenido.',
      pains: [
        'TTFB alto porque no hay LiteSpeed/Redis ni caché a nivel de servidor',
        'Migraciones que rompen enlaces internos, medios y permalinks',
        'Soporte en inglés o en horario que no coincide con Chile',
        'Backups que "existen" pero no se pueden restaurar en 5 minutos',
      ],
    },
    guide: {
      title: 'Cómo evaluamos hosting WordPress (sin patrocinios)',
      body: 'Priorizamos datacenter en Chile verificado por ASN, TTFB medido desde Santiago, stack LiteSpeed/Redis publicado por el proveedor y soporte con RUT chileno. El ranking se ordena por datos reales, no por comisión.',
      pillars: [
        { h: 'Datacenter local real', p: 'Confirmado por ASN y no por la palabra del proveedor.' },
        { h: 'Stack de caché', p: 'LiteSpeed + Redis u Object Cache activo, no sólo "caché genérica".' },
        { h: 'Soporte hispano', p: 'Empresa con RUT chileno y respuesta en minutos, no días.' },
      ],
    },
    plan: {
      title: 'Tu plan en 3 pasos',
      steps: [
        'Revisa el Top 5 verificado y elige por datacenter + rating.',
        'Contrata un plan WordPress con LiteSpeed y SSL incluidos.',
        'Pide la migración gratuita: te ahorra el 90% del riesgo técnico.',
      ],
    },
    objections: [
      { q: '¿Y si mi sitio actual está en el extranjero?', a: 'La migración a un hosting con datacenter en Santiago suele bajar el TTFB de 900 ms a 200-300 ms para usuarios chilenos. HostingPlus y EcoHosting incluyen migración gratis.' },
      { q: '¿WordPress no anda bien en cualquier hosting compartido?', a: 'Anda, pero con LiteSpeed + Redis los tiempos de carga bajan al menos 40%. La diferencia se nota sobre 5.000 visitas/día o con plugins pesados (WooCommerce, Elementor).' },
      { q: '¿Puedo empezar barato y escalar?', a: 'Sí. Un plan desde $3.325/mes cubre 500-1.000 visitas/día. Cuando escales, migras al plan superior sin cambiar de proveedor.' },
    ],
    journeys: [
      { persona: 'Blogger o creador de contenido', scenario: 'Menos de 1.000 visitas/día, presupuesto ajustado, quieres empezar bien.', recommendation: 'EcoHosting plan básico', slug: 'ecohosting', guide: { label: 'Guía blog personal', href: '/hosting-wordpress-blog-personal-chile' } },
      { persona: 'Agencia o sitio corporativo', scenario: 'Necesitas velocidad consistente, staging y soporte 24/7.', recommendation: 'HostingPlus WordPress optimizado', slug: 'hostingplus' },
      { persona: 'Sitio con WooCommerce', scenario: 'Vas a vender online y necesitas SSL, WAF y caché avanzada.', recommendation: 'HostingPlus con LiteSpeed Enterprise', slug: 'hostingplus', guide: { label: 'Guía ecommerce', href: '/mejor-hosting-ecommerce-chile' } },
    ],
    internalLinks: [
      { label: 'Guía completa: cómo elegir hosting', href: '/guia-elegir-hosting' },
      { label: 'Nuestro método de evaluación', href: '/nuestro-metodo' },
      { label: 'Comparativa HostingPlus vs EcoHosting', href: '/comparativa/hostingplus-vs-ecohosting' },
      { label: 'Errores comunes al contratar hosting', href: '/errores-comunes-hosting' },
    ],
    criteria: ['TTFB medido desde Santiago', 'ASN del datacenter', 'Reputación pública (reclamos)', 'Uptime medido 30 días'],
  },

  pymes: {
    protagonist: 'Tú, dueño/a de una PYME chilena que necesita email @tudominio.cl que no caiga en spam y un sitio que abra rápido para tus clientes locales.',
    problem: {
      title: 'Lo que rompe una PYME en su hosting',
      body: 'La PYME chilena promedio no tiene un problema de "recursos infinitos": tiene un problema de continuidad. Cuando el email cae un lunes a las 9 a.m. o el sitio queda fuera durante una campaña, pierdes clientes reales. Y el soporte internacional en inglés no te sirve a esa hora.',
      pains: [
        'Correos @tudominio.cl que llegan a spam por mala reputación IP',
        'Facturación en USD sin RUT: dolor de cabeza contable',
        'Soporte que responde en 24 h cuando lo necesitas en 15 minutos',
        'Sitios lentos que castigan la conversión desde el móvil',
      ],
    },
    guide: {
      title: 'Por qué priorizamos proveedores locales para PYMES',
      body: 'Una PYME necesita boleta electrónica en CLP, empresa con RUT chileno y datacenter en Santiago para que el sitio abra bajo 40 ms. Verificamos ASN, dominio del proveedor y reclamos públicos para armar el ranking.',
      pillars: [
        { h: 'Facturación en CLP', p: 'RUT vigente y boleta electrónica, sin sorpresas con Aduana.' },
        { h: 'Email profesional', p: 'IPs con buena reputación anti-spam y DKIM/SPF/DMARC listos.' },
        { h: 'Soporte en horario chileno', p: 'Respuesta real en minutos por chat o teléfono local.' },
      ],
    },
    plan: {
      title: 'Tu plan en 3 pasos',
      steps: [
        'Contrata un plan PYME con email empresarial incluido.',
        'Configura SPF/DKIM/DMARC para no caer en spam (soporte lo hace por ti).',
        'Deja SSL, backups y actualizaciones automáticas activadas.',
      ],
    },
    objections: [
      { q: '¿No me sale más barato Google Workspace + hosting internacional?', a: 'En dólares sí, en pesos y con soporte local casi siempre no. Además pierdes la ventaja de datacenter en Santiago para el sitio.' },
      { q: '¿Cambiar de hosting no es riesgoso para mi email?', a: 'HostingPlus y EcoHosting migran cuentas de correo con historial incluido. El downtime real suele ser inferior a 1 hora si se hace bien.' },
      { q: '¿Necesito plan caro?', a: 'No. Desde $3.325/mes (EcoHosting) o $4.219/mes (HostingPlus) cubres una PYME chica con web + emails corporativos.' },
    ],
    journeys: [
      { persona: 'Emprendedor recién partiendo', scenario: 'Necesitas 3-5 correos y una landing simple.', recommendation: 'EcoHosting plan básico', slug: 'ecohosting' },
      { persona: 'PYME establecida', scenario: 'Ya tienes clientes, no puedes darte lujo de caídas de email.', recommendation: 'HostingPlus plan empresarial', slug: 'hostingplus' },
      { persona: 'PYME con tienda', scenario: 'Vendes online además de tener sitio corporativo.', recommendation: 'HostingPlus WooCommerce', slug: 'hostingplus', guide: { label: 'Guía ecommerce', href: '/mejor-hosting-ecommerce-chile' } },
    ],
    internalLinks: [
      { label: 'Nuestro método (cómo rankeamos)', href: '/nuestro-metodo' },
      { label: 'Guía para elegir hosting sin arrepentirte', href: '/guia-elegir-hosting' },
      { label: 'Reclamos verificados por proveedor', href: '/reclamos' },
      { label: 'Errores comunes al contratar hosting', href: '/errores-comunes-hosting' },
    ],
    criteria: ['Empresa con RUT chileno', 'Datacenter en Santiago (ASN)', 'Reputación anti-spam del rango IP', 'Reclamos públicos verificados'],
  },

  ecommerce: {
    protagonist: 'Tú, que vendes online (o estás por lanzar) y sabes que 10 minutos caído en CyberDay valen más que un año de hosting.',
    problem: {
      title: 'La verdad incómoda del hosting ecommerce en Chile',
      body: 'Una tienda con WooCommerce o PrestaShop no es un sitio más: consume 3-5x memoria PHP, requiere SSL válido para el checkout y no perdona caídas en peak. La mayoría de planes "compartidos ecommerce" son planes normales con la etiqueta puesta encima.',
      pains: [
        'Checkout caído en CyberDay o Black Friday por saturación',
        'SSL básico que las pasarelas locales rechazan',
        'Backups que no se restauran a tiempo tras un ataque',
        'Falta de staging: cada cambio se prueba en producción',
      ],
    },
    guide: {
      title: 'Cómo evaluamos hosting para tiendas online',
      body: 'Priorizamos WAF activo, LiteSpeed Enterprise o equivalente, backups diarios con restauración < 1 hora y datacenter en Chile para checkout rápido con Webpay/Mercado Pago. El ranking se basa en benchmark propio, no en promesas.',
      pillars: [
        { h: 'WAF + SSL Wildcard', p: 'Reduce ataques comunes al checkout y protege subdominios.' },
        { h: 'Caché avanzada', p: 'LiteSpeed Enterprise + Object Cache mantiene el sitio en peak.' },
        { h: 'Staging + Backups', p: 'Copias diarias y entorno de pruebas para actualizar sin miedo.' },
      ],
    },
    plan: {
      title: 'Tu plan en 3 pasos',
      steps: [
        'Elige un plan ecommerce con WAF y caché a nivel servidor.',
        'Activa staging antes de subir productos o actualizar plugins.',
        'Configura backups diarios y revisa restauración una vez al mes.',
      ],
    },
    objections: [
      { q: '¿Necesito VPS desde el día uno?', a: 'Bajo 5.000-10.000 visitas/día un plan ecommerce optimizado alcanza. Sobre eso, VPS o cloud dedicado.' },
      { q: '¿Cuánto cuesta un hosting ecommerce serio?', a: 'Desde $4.219/mes (HostingPlus) para tiendas pequeñas. Sobre $7.000/mes obtienes recursos dedicados y prioridad de soporte.' },
      { q: '¿Y si mi pasarela local exige certificaciones?', a: 'Los proveedores chilenos del Top 5 son PCI-compatibles y trabajan con Webpay/Mercado Pago sin fricciones.' },
    ],
    journeys: [
      { persona: 'Tienda partiendo (WooCommerce)', scenario: 'Menos de 100 productos, tráfico estable.', recommendation: 'HostingPlus WooCommerce', slug: 'hostingplus' },
      { persona: 'Tienda mediana en peak', scenario: 'CyberDay/Black Friday te preocupa cada año.', recommendation: 'HostingPlus plan business + WAF', slug: 'hostingplus' },
      { persona: 'PrestaShop / Magento', scenario: 'Stack pesado, catálogo grande.', recommendation: 'EcoHosting plan business o VPS', slug: 'ecohosting', guide: { label: 'Ver VPS', href: '/mejor-vps-chile' } },
    ],
    internalLinks: [
      { label: 'Guía: WordPress + WooCommerce', href: '/mejor-hosting-wordpress-chile' },
      { label: 'Nuestro método de evaluación', href: '/nuestro-metodo' },
      { label: 'Reclamos verificados', href: '/reclamos' },
      { label: 'Comparativa HostingPlus vs EcoHosting', href: '/comparativa/hostingplus-vs-ecohosting' },
    ],
    criteria: ['TTFB en peak medido', 'Uptime 30 días', 'WAF y SSL Wildcard verificados', 'Compatibilidad Webpay/Mercado Pago'],
  },

  vps: {
    protagonist: 'Tú, que ya superaste el hosting compartido y necesitas recursos dedicados, root y una IPv4 tuya en Chile.',
    problem: {
      title: 'Cuando el compartido ya no da',
      body: 'Sabes que necesitas VPS cuando el compartido te empieza a tirar 502, cuando quieres instalar software custom o cuando tu tráfico ya justifica recursos garantizados. Pero el "VPS más barato del mundo" suele ser cloud sobrevendido y sin soporte real.',
      pains: [
        'CPU compartida encubierta ("vCPU" que no es dedicada)',
        'Discos SATA disfrazados de SSD',
        'Falta de snapshots o backups automáticos',
        'Soporte que sólo revisa la máquina, no ayuda a operar',
      ],
    },
    guide: {
      title: 'Cómo evaluamos VPS en Chile',
      body: 'Buscamos KVM (no OpenVZ), disco NVMe verificado, IPv4 dedicada real, red gigabit y datacenter en Santiago. Rechazamos "VPS" que en realidad son shared containers.',
      pillars: [
        { h: 'Virtualización KVM', p: 'Aislamiento real de CPU y RAM, sin sobreventa contenerizada.' },
        { h: 'Disco NVMe', p: 'IOPS varias veces superior a SSD SATA, crucial para bases de datos.' },
        { h: 'Red y snapshots', p: 'Gigabit dedicado y snapshots on-demand para operar tranquilo.' },
      ],
    },
    plan: {
      title: 'Tu plan en 3 pasos',
      steps: [
        'Dimensiona: 2 vCPU y 4 GB RAM cubren la mayoría de proyectos serios.',
        'Contrata KVM con NVMe y IPv4 dedicada; evita "cloud" ambiguo.',
        'Activa snapshots semanales y monitoreo desde el día uno.',
      ],
    },
    objections: [
      { q: '¿VPS chileno es más caro que uno de Hetzner/DigitalOcean?', a: 'En USD sí. En pesos, con factura CLP y datacenter en Santiago, la diferencia es marginal y ganas latencia y soporte hispano.' },
      { q: '¿Necesito administración?', a: 'Si no eres sysadmin, contrata VPS administrado. HostingPlus y PowerHost lo ofrecen; te evitas 90% de los dolores.' },
      { q: '¿Cuándo NO necesito VPS?', a: 'Si tu sitio tiene menos de 10.000 visitas/día y no requiere software custom, un plan compartido bueno alcanza y sobra.' },
    ],
    journeys: [
      { persona: 'Desarrollador o agencia', scenario: 'Múltiples sitios, quieres root y control total.', recommendation: 'HostingPlus VPS KVM', slug: 'hostingplus' },
      { persona: 'Ecommerce mediano', scenario: 'Ya no te aguanta el compartido en peak.', recommendation: 'PowerHost VPS gestionado', slug: 'powerhost', guide: { label: 'Ver ecommerce', href: '/mejor-hosting-ecommerce-chile' } },
      { persona: 'App SaaS o API', scenario: 'Necesitas recursos garantizados y baja latencia local.', recommendation: 'HostingPlus VPS NVMe', slug: 'hostingplus' },
    ],
    internalLinks: [
      { label: 'Guía: servidor dedicado', href: '/guia-elegir-servidor-dedicado' },
      { label: 'Nuestro método', href: '/nuestro-metodo' },
      { label: 'Benchmark técnico', href: '/benchmark' },
      { label: 'Errores comunes al contratar hosting', href: '/errores-comunes-hosting' },
    ],
    criteria: ['ASN del datacenter', 'Tipo de virtualización (KVM verificado)', 'Benchmark de disco y red', 'Uptime medido 30 días'],
  },
};
