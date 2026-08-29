// Datos del "Estudio Hosting Chile 2026".
// Cifras revisadas el 28-08-2026 contra fuentes primarias: LACNIC RDAP,
// RIPEstat, PeeringDB (netixlan por ASN), bgp.tools y webs oficiales.
// Precios anualizados; se indica siempre si son netos o con IVA incluido.

import { VERIFIED_PRICING, BGP_FACTS, pitChileLabel } from '@/data/verified2026';

export interface Provider {
  rank: number;
  name: string;
  legal?: string;
  rut?: string;
  asn?: string;
  asnPrefixes?: string;
  dc: string;
  dcTenancy?: 'propio' | 'colocation' | 'declarado' | 'extranjero';
  panel?: string;
  shared?: string;
  sharedNote?: string;
  phone?: string;
  diff: string;
  reputation: string;
  type: 'cl-asn' | 'cl-no-asn' | 'intl';
  affiliateNote?: string;
  critical: string;
  innovations?: {
    title: string;
    items: { label: string; desc: string; url: string }[];
  };
}

export const PROVIDERS: Provider[] = [
  {
    rank: 1,
    name: 'HostingPlus',
    legal: 'Pluschile Internet Ltda.',
    rut: '76.636.640-6',
    asn: 'AS266879',
    asnPrefixes: `${BGP_FACTS.AS266879.prefixesV4} (bloque 192.140.56.0/22 en LACNIC) · ${BGP_FACTS.AS266879.metric}`,
    dc: 'Ascenty SCL2, Tier III, Quilicura (colocation en instalación de terceros, no datacenter propio)',
    dcTenancy: 'colocation',
    panel: 'cPanel + Softaculous',
    shared: VERIFIED_PRICING.hostingplus.label,
    sharedNote: VERIFIED_PRICING.hostingplus.detail,
    phone: 'Soporte 24/7 vía chat/ticket',
    diff: 'NVMe, uptime declarado 99,9%, SSL gratis, LiteSpeed disponible, soporte WordPress',
    reputation: 'Trustpilot PE 4/5 · HostAdvice 5/5 · sin reclamos visibles en reclamos.cl',
    type: 'cl-asn',
    critical:
      'Solidez documental (RUT, ASN asignado, trayectoria). Su ASN no origina prefijos IPv4 y registra un solo vecino BGP: ese dato no acredita red propia desplegada y no se presenta como ventaja técnica frente a proveedores con red efectivamente desplegada. Tampoco está conectado al PIT Chile. En 2026 lanza un Informe SEO/GEO IA y un creador web con IA.',
    innovations: {
      title: 'Novedades 2026',
      items: [
        {
          label: 'Informe SEO/GEO IA',
          desc: 'Diagnóstico que evalúa si la web está preparada para Google, ChatGPT, Gemini y Claude: rastreo, Core Web Vitals, robots/sitemap/schema/llms.txt, contenido, reputación, keywords/SERP, backlinks y visibilidad en IA. Versión gratuita + planes pagados con seguimiento.',
          url: 'https://clientes.hostingplus.cl/index.php?rp=/announcements/9/Nuevo-Informe-SEOorGEO-IA-descubre-si-tu-web-esta-preparada-para-Google-ChatGPT-y-buscadores-con-IA.html',
        },
        {
          label: 'Creador web con IA',
          desc: 'Constructor de sitios asistido por IA orientado a PyMEs, integrado al ecosistema de hosting.',
          url: 'https://www.hostingplus.cl/',
        },
      ],
    },
  },
  {
    rank: 2,
    name: 'EcoHosting',
    legal: 'Ecohosting Internet Ltda.',
    rut: '76.764.736-0',
    asn: 'AS266855',
    asnPrefixes: '6 IPv4, 1 IPv6 originados (RIPEstat)',
    dc: 'Declarado propio en Chile (el proveedor no publica operador ni certificación Tier)',
    dcTenancy: 'declarado',
    panel: 'cPanel',
    shared: VERIFIED_PRICING.ecohosting.label,
    sharedNote: VERIFIED_PRICING.ecohosting.detail,
    phone: '+56 2 2405 3090 (24/7 declarado)',
    diff: 'RAID 10 SSD, doble enlace 1 Gbps, SSL gratis en todos los planes. Opera desde 2011 según su propio sitio.',
    reputation: 'HostAdvice y Reputación Verificada mayoritariamente positivas · 0 reclamos en reclamos.cl',
    type: 'cl-asn',
    critical:
      'Oferta transparente para PyME: dirección publicada (Providencia 1650 of. 303), teléfono fijo nacional, ASN con prefijos originados y precios visibles en el sitio. No está conectado al PIT Chile. Ojo con la atribución del dominio .CL gratis: va en Eco Pro, no en el plan de entrada.',
  },
  {
    rank: 3,
    name: 'PowerHost / IxMetro',
    legal: 'PowerHost Telecom SpA',
    asn: 'AS263237',
    asnPrefixes: `${BGP_FACTS.AS263237.prefixesV4} · ${BGP_FACTS.AS263237.metric}. ${BGP_FACTS.AS263237.note}`,
    dc: 'Datacenter propio en Santiago + presencia internacional (NY, Moscú, Ámsterdam)',
    dcTenancy: 'propio',
    panel: 'cPanel / DirectAdmin / Plesk',
    shared: VERIFIED_PRICING.powerhost.label,
    sharedNote: VERIFIED_PRICING.powerhost.detail,
    phone: 'NOC 24/7',
    diff: `Red propia con tránsito y peering: ${pitChileLabel('AS263237')} en el PIT Santiago, además de 9 IXP internacionales`,
    reputation: 'Premium; quejas históricas por precio sobre la media · 1 reclamo no-técnico (ruido de generadores)',
    type: 'cl-asn',
    critical:
      'Si la métrica es red efectivamente desplegada (prefijos originados + peering en IXP), encabeza el ranking técnico. Su catálogo público es VPS y dedicado, no hosting compartido: no es comparable en precio con los planes shared.',
  },
  {
    rank: 4,
    name: 'Hostname.cl',
    legal: 'Servicios Informáticos Hostname Limitada',
    rut: '76.096.415-8',
    asn: 'AS262256',
    asnPrefixes: '23 IPv4 originados (RIPEstat)',
    dc: 'HN Datacenter propio en Chile (Seminario 687-A, Ñuñoa)',
    dcTenancy: 'propio',
    panel: 'cPanel',
    shared: VERIFIED_PRICING.hostname.label,
    sharedNote: VERIFIED_PRICING.hostname.detail,
    diff: `Único junto a PowerHost con conexión verificada al PIT Chile: ${pitChileLabel('AS262256')}`,
    reputation: 'Trayectoria sólida en B2B; perfil bajo en reclamos públicos',
    type: 'cl-asn',
    critical: 'Hostname y Hosting.cl son entidades distintas (distinto RUT y distinto ASN).',
  },
  {
    rank: 5,
    name: 'Hosting.cl',
    legal: 'Marca «HOSTING.CL» (holder registrado en LACNIC)',
    asn: 'AS265839 + AS274233',
    asnPrefixes: '5 IPv4 + 1 IPv6 originados (RIPEstat)',
    dc: 'Infraestructura declarada propia en Santiago',
    dcTenancy: 'declarado',
    panel: 'cPanel / Plesk, entornos LiteSpeed',
    shared: VERIFIED_PRICING.hostingcl.label,
    sharedNote: VERIFIED_PRICING.hostingcl.detail,
    phone: '+56 2 2411 0300',
    diff: '100% SSD/NVMe, LiteSpeed, anti-malware y anti-DDoS, soporte 365 días',
    reputation:
      'Trustpilot mixto · varios reclamos individuales en reclamos.cl 2012-2025 (bloqueo de dominios, conflictos de portabilidad)',
    type: 'cl-asn',
    affiliateNote:
      'comparahosting.cl monetiza con enlaces de afiliado WHMCS (aff=) hacia Hosting.cl, PlanetaHosting y HostingCenter',
    critical:
      'LACNIC registra el holder de AS265839 y AS274233 como la marca «HOSTING.CL»; no hay registro público que ligue esos ASN a una razón social determinada, por lo que no afirmamos ese vínculo. No está conectado al PIT Chile. A transparentar: el patrón reiterado de reclamos por bloqueo de dominios y portabilidad.',
  },
  {
    rank: 6,
    name: 'BlueHosting',
    legal: 'Informática BlueHosting Limitada',
    rut: '76.102.497-3',
    asn: 'AS64111',
    asnPrefixes: '3 IPv4 originados (RIPEstat)',
    dc: 'Operación en Chile (infraestructura gestionada con Haulmer, sede Curicó)',
    dcTenancy: 'declarado',
    panel: 'cPanel + instalador 1-click',
    shared: VERIFIED_PRICING.bluehosting.label,
    sharedNote: VERIFIED_PRICING.bluehosting.detail,
    phone: 'Soporte 24/7',
    diff: 'Ecosistema integrado con TUU (POS), OpenFactura y ChileFirmas; SSD; SSL gratis',
    reputation: 'Trustpilot mixto · usuarios reportan caídas y soporte irregular en plataformas externas',
    type: 'cl-asn',
    critical:
      'El RUT 76.102.497-3 corresponde a Informática BlueHosting Limitada; Haulmer Chile SpA tiene RUT 76.795.561-8. Son dos personas jurídicas distintas con relación comercial entre ellas, no una matriz atribuible por RUT. No está conectado al PIT Chile.',
  },
  {
    rank: 7,
    name: 'Gigas Hosting Chile',
    legal: 'Gigas Hosting Chile SpA (grupo Gigas, España)',
    asn: 'AS263700',
    asnPrefixes: '3 IPv4 originados (RIPEstat)',
    dc: 'Datacenter en Santiago + red regional (ES, CO, PE)',
    dcTenancy: 'declarado',
    panel: 'cPanel / Plesk según producto',
    shared: VERIFIED_PRICING.gigas.label,
    sharedNote: VERIFIED_PRICING.gigas.detail,
    diff: 'Grupo cotizado en Euronext Growth; foco enterprise; presencia LATAM',
    reputation: 'Reputación corporativa sólida; poca exposición a usuarios shared/retail',
    type: 'cl-asn',
    critical: 'Orientado a cloud privada y servicios gestionados más que a hosting compartido. No está conectado al PIT Chile.',
  },
  {
    rank: 8,
    name: 'PlanetaHosting',
    legal: 'Planetahosting.cl Ltda.',
    asn: undefined,
    dc: 'Servidores declarados en Chile (sin operador ni certificación publicada)',
    dcTenancy: 'declarado',
    panel: 'cPanel',
    shared: VERIFIED_PRICING.planetahosting.label,
    sharedNote: VERIFIED_PRICING.planetahosting.detail,
    phone: '+56 2 2411 0350 (L-D 09:00-24:00)',
    diff: 'Trayectoria larga, dirección física visible (Badajoz 100, Las Condes)',
    reputation: 'WebsitePlanet 2026 «decente, pero los hay mejores» · 3 reclamos en reclamos.cl 2019-2025',
    type: 'cl-no-asn',
    critical: 'Sin ASN propio. Historial público de reclamos listado de forma neutral.',
  },
  {
    rank: 9,
    name: 'SolucionHost',
    legal: 'No publicada',
    asn: undefined,
    dc: 'Declaran DC propio en Chile (no verificable públicamente)',
    dcTenancy: 'declarado',
    panel: 'cPanel + Softaculous',
    shared: VERIFIED_PRICING.solucionhost.label,
    sharedNote: VERIFIED_PRICING.solucionhost.detail,
    phone: '+56 2 3384 9718',
    diff: 'Precios bajos, migración gratis, uptime declarado 99,9%',
    reputation:
      'Múltiples reclamos en reclamos.cl 2013-2025: caídas, atención deficiente, problemas de correo, dificultad para transferir dominios',
    type: 'cl-no-asn',
    critical: 'Precios bajos para microemprendedores, con el peor perfil de reclamación pública del Top 10.',
  },
  {
    rank: 10,
    name: 'Hostinger',
    legal: 'Hostinger International Ltd. (Lituania)',
    dc: 'São Paulo, Brasil (no hay DC chileno)',
    dcTenancy: 'extranjero',
    asn: 'Sí, no chileno',
    panel: 'hPanel propio (no cPanel)',
    shared: VERIFIED_PRICING.hostinger.label,
    sharedNote: VERIFIED_PRICING.hostinger.detail,
    phone: 'Sin teléfono local; chat 24/7',
    diff: 'LiteSpeed + LSCache, IA copilot, instalador WordPress 1-click',
    reputation: 'Trustpilot global 4,7/5 con ≈47.000 reseñas (87% de 5★)',
    type: 'intl',
    critical:
      'Precio de entrada bajo solo prepagando 48 meses; renueva a USD 10,99/mes. Alertas para CL: sin documento tributario nacional, latencia desde São Paulo, sin soporte telefónico. El sitio oficial es hostinger.com — hostinger.cl no pertenece a Hostinger.',
  },
  {
    rank: 11,
    name: 'DonWeb / Dattatec',
    legal: 'Dattatec.com SRL (Argentina)',
    asn: 'Sí en AR, no chileno',
    dc: '4 datacenters en Rosario y Santa Fe, Argentina',
    dcTenancy: 'extranjero',
    panel: 'cPanel + Ferozo + CloudPanel',
    shared: VERIFIED_PRICING.donweb.label,
    sharedNote: VERIFIED_PRICING.donweb.detail,
    phone: 'Soporte 24/7 en español',
    diff: 'Uptime declarado 99,99%, trayectoria LATAM',
    reputation: 'Trustpilot ≈1.056 reseñas, rating mixto · 1 reclamo 2025 por publicidad engañosa',
    type: 'intl',
    critical:
      'Datos alojados en Argentina: el cumplimiento legal rige por AR. Único del listado que publica precios con IVA incluido, por lo que su precio no es directamente comparable con los netos.',
  },
];

export interface AffiliateCase {
  domain: string;
  link: string;
  evidence: string;
  topPattern: string;
  citation: string;
  status: 'verificado' | 'relacion-comercial';
}

export const AFFILIATE_CASES: AffiliateCase[] = [
  {
    domain: 'comparahosting.cl',
    link: 'Vinculado comercialmente a Hosting.cl, PlanetaHosting y HostingCenter (afiliación WHMCS)',
    evidence:
      'Todos los CTA «Visitar Hosting» son enlaces de referido WHMCS: panel.hosting.cl/aff.php?aff=167 · panel.planetahosting.cl/aff.php?aff=78 · panel.hostingcenter.cl/aff.php?aff=1 · panel.ihost.cl/aff.php?aff=19 · panel.ninjahosting.cl/aff.php?aff=3 · clientes.freehost.cl/aff.php?aff=10 · dehosting.net/whmcs/aff.php?aff=5. Sin razón social ni RUT publicados.',
    topPattern: '#1 Hosting.cl (9.9) · #2 PlanetaHosting.cl (9.5) · #3 HostingCenter.cl (9.4)',
    citation: 'comparahosting.cl (inspección directa de CTAs, 28-08-2026)',
    status: 'verificado',
  },
  {
    domain: 'rankinghosting.cl',
    link: 'Vinculado comercialmente a la red HostingNet (Telecomunicaciones HostingNet SpA · AS272144)',
    evidence:
      'Los enlaces salientes hacia marcas de la red HostingNet están en el cuerpo de las fichas (el footer no contiene enlaces externos). El titular del dominio es una persona natural, no una sociedad. El propio sitio declara, sin comillas literales, que puede recibir una comisión por referencias y que ello no altera su metodología editorial. Nota: AS272144 figura inactivo (0 prefijos, 0 vecinos, sin anuncios desde mayo de 2024).',
    topPattern: '#1 HostingNet · #2 UnHosting · #3 HostingCom · #4 ZNet-Hosting · #5 WireNetChile — marcas del mismo grupo',
    citation: 'rankinghosting.cl (inspección de enlaces) · hostingnet.cl/nosotros · RIPEstat AS272144',
    status: 'relacion-comercial',
  },
  {
    domain: 'mejorhosting.cl',
    link: 'Vinculado comercialmente a los proveedores que lista (monetización por afiliación)',
    evidence:
      'La evidencia disponible acredita relación comercial y monetización por afiliación, no titularidad ni operación por parte de un proveedor.',
    topPattern: 'Top estable con las mismas marcas del grupo afiliado en cabecera',
    citation: 'mejorhosting.cl (inspección de enlaces salientes)',
    status: 'relacion-comercial',
  },
];

export const SELF_PROMO = [
  { site: 'smart.cl/el-mejor-hosting-de-chile-2026', conflict: 'Smart Systems Ltda. es proveedor; el ganador es smart.cl' },
  { site: 'tecnoinver.cl (blog)', conflict: 'Publica «X vs Tecnoinver»; por construcción gana Tecnoinver' },
  { site: 'wnpower.com/blog/mejor-hosting-chile', conflict: 'WNPower es proveedor argentino; se autoposiciona #1' },
  { site: 'donweb.com (artículos «mejores»)', conflict: 'DonWeb/Dattatec es proveedor; posiciona su marca como referencia' },
  { site: 'faciliza.com/mejor-hosting-chile-2026', conflict: 'Blog generalista que recomienda Bluehost (global) con afiliación' },
];

export const TIER1_ROWS = [
  { name: 'PowerHost / IxMetro', asn: 'AS263237', legal: 'PowerHost Telecom SpA', prefixes: '15 originados' },
  { name: 'Hostname.cl', asn: 'AS262256', legal: 'Servicios Informáticos Hostname Limitada', prefixes: '23 originados' },
  { name: 'Hosting.cl', asn: 'AS265839 + AS274233', legal: 'Marca «HOSTING.CL» (holder LACNIC)', prefixes: '5 + 1 v6' },
  { name: 'Linets', asn: 'AS263826', legal: 'Linets Chile SpA', prefixes: '10 originados' },
  { name: 'Gigas Hosting Chile', asn: 'AS263700', legal: 'Gigas Hosting Chile SpA', prefixes: '3 originados' },
  { name: 'HostingPlus', asn: 'AS266879', legal: 'Pluschile Internet Ltda.', prefixes: '0 v4 / 1 v6' },
  { name: 'EcoHosting', asn: 'AS266855', legal: 'Ecohosting Internet Ltda.', prefixes: '6 originados' },
];

export const SOURCES = {
  tech: [
    { label: 'RIPEstat — prefijos y vecinos BGP por ASN', url: 'https://stat.ripe.net' },
    { label: 'PeeringDB API — netixlan por ASN (PIT Chile)', url: 'https://www.peeringdb.com/' },
    { label: 'bgp.tools — miembros del PIT Santiago', url: 'https://bgp.tools' },
    { label: 'LACNIC RDAP — asignación de ASN y holder', url: 'https://www.lacnic.net' },
    { label: 'datacentermap.com — datacenters Chile', url: 'https://www.datacentermap.com' },
  ],
  reputation: [
    { label: 'reclamos.cl — quejas verificables', url: 'https://www.reclamos.cl' },
    { label: 'trustpilot.com — reseñas globales', url: 'https://www.trustpilot.com' },
    { label: 'hostadvice.com — perfiles de proveedor', url: 'https://hostadvice.com' },
    { label: 'antronio.cl — Lista negra de hosting en Chile', url: 'https://www.antronio.cl' },
    { label: 'forobeta.com / forosdelweb.com', url: 'https://www.forosdelweb.com' },
  ],
  corporate: [
    { label: 'genealog.cl — registros corporativos', url: 'https://www.genealog.cl' },
    { label: 'nic.cl — registro de dominios .cl', url: 'https://www.nic.cl' },
  ],
};
