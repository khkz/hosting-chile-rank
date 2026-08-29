/**
 * Datos verificados el 28-08-2026 contra fuentes primarias
 * (LACNIC RDAP, RIPEstat, PeeringDB API, bgp.tools y webs oficiales).
 *
 * Fuente única para React (mirror en verified2026.ts) y para los generadores
 * de estáticos/datasets (scripts/*.mjs). Si editas uno, edita el otro.
 */

export const VERIFICATION_DATE_ISO = '2026-08-28';
export const VERIFICATION_DATE_HUMAN = '28 de agosto de 2026';

/** Nota al pie obligatoria en toda tabla que muestre precios. */
export const PRICING_FOOTNOTE =
  'Precios netos (sin IVA 19%) salvo donde se indique. Los valores «desde» pueden ser promocionales o exigir permanencia; consulta el precio de renovación en el sitio del proveedor.';

/** Divulgación de relación comercial (junto al ranking, no solo en el footer). */
export const COMMERCIAL_DISCLOSURE =
  'Divulgación: el editor de este sitio mantiene relación comercial con algunos de los proveedores listados.';

/** Cómo describimos el ranking y la metodología (afirmaciones sostenibles). */
export const EDITORIAL_CLAIM = 'Ranking editorial con metodología publicada';
export const METHOD_CLAIM = 'Metodología y pesos publicados';

/**
 * Precios anualizados y verificados. `annualNetCLP` es el valor anual del plan
 * de entrada en CLP; `tax` indica si el importe es neto o con IVA incluido.
 * `category` evita comparar categorías distintas (shared vs VPS/dedicado).
 */
export const VERIFIED_PRICING = {
  hostingplus: {
    plan: 'Personal NVME',
    annualNetCLP: 64900,
    tax: 'neto',
    category: 'shared',
    label: '$64.900 + IVA/año',
    detail:
      '25 GB NVMe, 10 casillas, 1 sitio, dominio .CL incluido. Multianual: 24 meses $108.900 y 36 meses $151.900 (+IVA).',
  },
  ecohosting: {
    plan: 'Hosting Eco Personal',
    annualNetCLP: 24900,
    tax: 'neto',
    category: 'shared',
    label: '$24.900/año (1er año con 50% dcto.)',
    detail:
      '10 GB, 10 correos, 1 sitio. No incluye dominio .cl: el dominio .CL gratis está solo en el plan Eco Pro ($109.900). El precio de entrada aplica 50% de descuento el primer año.',
  },
  bluehosting: {
    plan: 'Power',
    annualNetCLP: 38900,
    tax: 'neto',
    category: 'shared',
    label: '$38.900 + IVA/año',
    detail:
      'Plan de entrada «Power». «Emprendedores Full» cuesta $43.900 + IVA/año. El techo del catálogo es «Empresas Ultimate» a $791.900 + IVA/año.',
  },
  planetahosting: {
    plan: 'Hosting Profesional',
    annualNetCLP: 59900,
    tax: 'neto',
    category: 'shared',
    label: '$59.900 + IVA/año',
    detail:
      '30 GB, 3 sitios, dominio gratis el primer año. Los planes e-commerce van de $159.900 a $249.900 + IVA/año.',
  },
  solucionhost: {
    plan: 'Plan Estándar 1',
    annualNetCLP: 11900,
    tax: 'neto',
    category: 'shared',
    label: '$11.900 + IVA/año',
    detail:
      '20 GB, 1 dominio. El valor «$10.000» que circula aparece solo en el title/meta SEO de esa página, no en la tabla de planes.',
  },
  hostingcl: {
    plan: 'PYME',
    annualNetCLP: 159900,
    tax: 'neto',
    category: 'shared',
    label: '$159.900 + IVA/año',
    detail: '10 GB. PYME PLUS $229.900 + IVA/año y PYME MAX $299.900 + IVA/año.',
  },
  hostinger: {
    plan: 'Hosting compartido',
    annualNetCLP: null,
    tax: 'USD',
    category: 'shared',
    label: 'USD 2,99/mes prepagando 48 meses (USD 143,52)',
    detail:
      'El precio «desde» exige prepagar 48 meses (USD 143,52) y renueva a USD 10,99/mes. Facturación en USD, sin documento tributario chileno.',
  },
  donweb: {
    plan: 'LinuxPersonal',
    annualNetCLP: 18000,
    tax: 'con IVA',
    category: 'shared',
    label: '$18.000/año con IVA incluido ($1.500/mes)',
    detail:
      '$1.800/mes en tarifa mensual promocional o $1.500/mes contratando anual ($18.000/año). Renueva a $4.290/mes. Es el único proveedor del listado que publica precios con IVA incluido.',
  },
  powerhost: {
    plan: 'VPS SSD Starter Linux',
    annualNetCLP: 516000,
    tax: 'neto',
    category: 'vps',
    label: 'VPS desde $43.000 + IVA/mes',
    detail:
      'PowerHost sí publica precios en su web. VPS SSD desde $43.000 + IVA/mes (Starter Linux) hasta $165.000 Linux / $189.000 Windows. Servidores dedicados desde 10,5 UF + IVA/mes. Son VPS y dedicados, no hosting compartido: no es comparable con los planes shared de la tabla.',
  },
  gigas: {
    plan: null,
    annualNetCLP: null,
    tax: null,
    category: 'cloud',
    label: 'No publica precios',
    detail:
      'Gigas Hosting Chile publica solo especificaciones y un botón «Solicitar»: no hay precio de lista público.',
  },
  hostname: {
    plan: null,
    annualNetCLP: null,
    tax: null,
    category: 'shared',
    label: 'No disponible',
    detail: 'No fue posible verificar un precio de lista público a la fecha de revisión.',
  },
};

/** Alias de slug del catálogo → clave de VERIFIED_PRICING. */
export const PRICING_ALIASES = {
  bluehost: 'bluehosting',
  hn: 'hostname',
  'hostname-cl': 'hostname',
  ixmetro: 'powerhost',
  dattatec: 'donweb',
};

export function getVerifiedPricing(slug) {
  if (!slug) return null;
  const key = PRICING_ALIASES[slug] || slug;
  return VERIFIED_PRICING[key] || null;
}

/**
 * Conexión efectiva al PIT Chile (PIT Santiago), verificada en la API de
 * PeeringDB (netixlan por ASN) y en el listado de miembros de bgp.tools.
 * Solo dos ASN del mercado están efectivamente conectados.
 */
export const PIT_CHILE_MEMBERS = {
  AS263237: { ip: '45.68.16.120', speed: '100 Gbps', note: 'Además presente en 9 IXP internacionales.' },
  AS262256: { ip: '45.68.16.61', speed: '10 Gbps', note: '' },
};

/** ASN sin registro de IXP: no están en el PIT Chile. */
export const PIT_CHILE_ABSENT = [
  'AS266879',
  'AS266855',
  'AS265839',
  'AS263826',
  'AS263700',
  'AS64111',
  'AS272144',
];

export function hasPitChile(asn) {
  if (!asn) return false;
  const key = String(asn).toUpperCase().replace(/\s/g, '');
  return Object.prototype.hasOwnProperty.call(PIT_CHILE_MEMBERS, key);
}

/** Etiqueta para la columna «PIT Chile». */
export function pitChileLabel(asn) {
  const m = PIT_CHILE_MEMBERS[String(asn || '').toUpperCase()];
  if (!m) return 'No';
  return `Sí · ${m.ip} · ${m.speed}`;
}

/**
 * Descripción unificada de instalación. Distinguimos datacenter propio de
 * colocation en instalación de terceros.
 */
export const DATACENTER_FACTS = {
  hostingplus: {
    label: 'Ascenty SCL2, Tier III, Quilicura',
    tenancy: 'colocation',
    note: 'Ascenty es un operador de colocation de terceros: no es datacenter propio de HostingPlus.',
  },
  hostname: { label: 'HN Datacenter, Ñuñoa', tenancy: 'propio', note: '' },
  powerhost: { label: 'Datacenter propio, Santiago', tenancy: 'propio', note: '' },
};

/** Correcciones de identidad corporativa verificadas el 28-08-2026. */
export const CORPORATE_FACTS = {
  bluehosting: {
    legal: 'Informática BlueHosting Limitada',
    rut: '76.102.497-3',
    note: 'El RUT 76.102.497-3 pertenece a Informática BlueHosting Limitada. Haulmer Chile SpA tiene RUT 76.795.561-8: son dos personas jurídicas distintas, con relación comercial entre ambas.',
  },
  hostname: {
    legal: 'Servicios Informáticos Hostname Limitada',
    rut: '76.096.415-8',
    note: '',
  },
  hostingcl: {
    legal: null,
    rut: null,
    note: 'LACNIC registra el holder de AS265839 y AS274233 como la marca «HOSTING.CL». No hay registro público que ligue esos ASN a una razón social determinada.',
  },
};

/** Datos BGP con la métrica declarada explícitamente. */
export const BGP_FACTS = {
  AS263237: {
    prefixesV4: '15 prefijos IPv4 originados (3.328 IPs)',
    metric: 'RIPEstat — prefijos originados por el ASN',
    note: 'La cifra mayor de bgp.he.net (540 «announced») incluye el cono de clientes en tránsito, no espacio propio.',
  },
  AS266879: {
    prefixesV4: '0 prefijos IPv4 originados / 1 IPv6',
    metric: 'RIPEstat — prefijos originados por el ASN',
    note: 'Un ASN sin prefijos IPv4 originados y con un solo vecino BGP no acredita red propia desplegada; se publica como dato, no como ventaja técnica.',
  },
  AS272144: {
    prefixesV4: '0 prefijos · 0 vecinos',
    metric: 'RIPEstat — estado de anuncio',
    note: 'ASN inactivo: «announced: No», sin anuncios BGP desde mayo de 2024.',
  },
};

/** Nota de limitación de la medición de velocidad (visible junto a las métricas). */
export const SPEED_LIMITATION_NOTE =
  'Limitación: el TTFB se mide desde us-east y no representa la latencia desde Chile específicamente.';
