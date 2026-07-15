/**
 * Datacenter registry for Chile — operators and ranked hosting providers.
 *
 * SOURCING RULES (mandatory):
 * - Only values with a verifiable source are included.
 * - No source => estado: 'no_divulga'.
 * - "homologable" / self-declared without third-party audit => estado: 'autodeclarado'.
 * - HostingPlus is explicitly tracked as colocation in Ascenty SCL2 (TUV TR3) per project methodology.
 */

export type CertificationBody = 'uptime' | 'tuv_tr3' | 'icrea';
export type DcType = 'propio' | 'colocation' | 'extranjero';
export type DcStatus = 'certificado' | 'autodeclarado' | 'no_divulga' | 'extranjero';

export interface CertifiedOperator {
  nombre: string;
  organismo: CertificationBody;
  nivel: string;
  ubicacion: string;
  fuente_url: string;
}

export interface RankingHostDc {
  nombre: string;
  dc_declarado: string | null;
  operador: string | null;
  tipo: DcType;
  estado: DcStatus;
  fuente_url: string;
}

/**
 * (a) Operators with third-party datacenter certifications in Chile.
 * Sources: Uptime Institute public awards list, Ascenty public certification page.
 */
export const certifiedOperators: CertifiedOperator[] = [
  {
    nombre: 'Ascenty SCL2',
    organismo: 'tuv_tr3',
    nivel: 'TÜV Rheinland TR3 / Tier III equivalente',
    ubicacion: 'Guacolda 2100, Quilicura, Santiago, Chile',
    fuente_url: 'https://ascenty.com/data-centers/seguranca-e-certificacoes/certificacoes/',
  },
  {
    nombre: 'GTD Lidice II',
    organismo: 'uptime',
    nivel: 'Tier III Design, Constructed Facility, Gold Sustainability',
    ubicacion: 'Santiago Centro, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
  {
    nombre: 'GTD DC Panamericana',
    organismo: 'uptime',
    nivel: 'Tier III Design, Constructed Facility, Gold Sustainability',
    ubicacion: 'Santiago, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
  {
    nombre: 'GTD DC Providencia',
    organismo: 'uptime',
    nivel: 'Tier III Design, Constructed Facility',
    ubicacion: 'Providencia, Santiago, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
  {
    nombre: 'Equinix ST1',
    organismo: 'uptime',
    nivel: 'Tier III Constructed Facility, Design, Gold Sustainability',
    ubicacion: 'Santiago, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
  {
    nombre: 'Equinix ST2',
    organismo: 'uptime',
    nivel: 'Tier IV Constructed Facility, Design, Gold Sustainability',
    ubicacion: 'Santiago, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
  {
    nombre: 'Equinix ST3',
    organismo: 'uptime',
    nivel: 'Tier III Design, Constructed Facility + M&O Stamp',
    ubicacion: 'Santiago, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
  {
    nombre: 'Claro Chile Datacenter Liray',
    organismo: 'uptime',
    nivel: 'Tier IV Design, Constructed Facility (Etapa B5); Tier III (B3/B4)',
    ubicacion: 'Liray, Santiago, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
  {
    nombre: 'Cirion Technologies Santiago DC1',
    organismo: 'uptime',
    nivel: 'Tier III Design',
    ubicacion: 'Santiago, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
  {
    nombre: 'Cirion Technologies SAN2 Hyperscale',
    organismo: 'uptime',
    nivel: 'Tier III Design',
    ubicacion: 'Santiago, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
  {
    nombre: 'NextStream Data Center Paine',
    organismo: 'uptime',
    nivel: 'Tier III Gold Sustainability',
    ubicacion: 'Paine, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
  {
    nombre: 'NextStream Data Center Apoquindo',
    organismo: 'uptime',
    nivel: 'Tier III Design, Constructed Facility',
    ubicacion: 'Apoquindo, Santiago, Chile',
    fuente_url: 'https://uptimeinstitute.com/uptime-institute-awards/country/id/CL',
  },
];

/**
 * (b) Hosting providers in the Chile ranking with their declared datacenter status.
 * Sources are the provider's own site or the verified project ficha, unless otherwise noted.
 */
export const rankingHosts: RankingHostDc[] = [
  {
    nombre: 'HostingPlus.cl',
    dc_declarado: 'Ñuñoa, Santiago y Quilicura, Chile',
    operador: 'Ascenty SCL2',
    tipo: 'colocation',
    estado: 'certificado',
    fuente_url: 'https://www.hostingplus.cl/nosotros/',
  },
  {
    nombre: 'EcoHosting.cl',
    dc_declarado: 'Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.ecohosting.cl/',
  },
  {
    nombre: 'HN.cl',
    dc_declarado: 'Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.hn.cl/',
  },
  {
    nombre: 'PowerHost / IxMetro',
    dc_declarado: '4 DC propios (SCL, NY, MOW, AMS)',
    operador: null,
    tipo: 'propio',
    estado: 'autodeclarado',
    fuente_url: 'https://www.powerhost.cl/',
  },
  {
    nombre: 'HostGator.cl',
    dc_declarado: 'Santiago, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.hostgator.cl/',
  },
  {
    nombre: 'BlueHosting.cl',
    dc_declarado: 'Santiago, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.bluehosting.cl/',
  },
  {
    nombre: 'CloudHosting.cl',
    dc_declarado: 'Santiago, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.cloudhosting.cl/',
  },
  {
    nombre: '1Hosting.cl',
    dc_declarado: 'Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.1hosting.cl/',
  },
  {
    nombre: 'FullHosting.cl',
    dc_declarado: 'Santiago, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.fullhosting.cl/',
  },
  {
    nombre: 'ProHosting.cl',
    dc_declarado: 'Santiago de Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.prohosting.cl/',
  },
  {
    nombre: 'Hosting.cl',
    dc_declarado: 'Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.hosting.cl/',
  },
  {
    nombre: 'FastHosting.cl',
    dc_declarado: 'Santiago, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.fasthosting.cl/',
  },
  {
    nombre: 'Hosting24.cl',
    dc_declarado: 'Santiago, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.hosting24.cl/',
  },
  {
    nombre: 'PlanetaHosting.cl',
    dc_declarado: 'Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.planetahosting.cl/',
  },
  {
    nombre: 'INC Web Hosting Chile',
    dc_declarado: 'Santiago, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.inc.cl/',
  },
  {
    nombre: 'WebHosting.cl',
    dc_declarado: 'Santiago, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.webhosting.cl/',
  },
  {
    nombre: 'SmartHost.cl',
    dc_declarado: 'Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.smarthost.cl/',
  },
  {
    nombre: 'GoDaddy.cl',
    dc_declarado: 'Múltiples ubicaciones, incluyendo Santiago',
    operador: null,
    tipo: 'extranjero',
    estado: 'extranjero',
    fuente_url: 'https://www.godaddy.cl/',
  },
  {
    nombre: 'HostingChile.cl',
    dc_declarado: 'Santiago, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.hostingchile.cl/',
  },
  // Not curated but with explicit datacenter declarations in the ranking data
  {
    nombre: 'CBHosting',
    dc_declarado: 'Viña del Mar, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.cbhosting.cl/',
  },
  {
    nombre: 'ChileCom',
    dc_declarado: 'Datacenter propio en Chile (Peñalolén)',
    operador: null,
    tipo: 'propio',
    estado: 'autodeclarado',
    fuente_url: 'https://chilecom.net/',
  },
  {
    nombre: 'cPanelHost',
    dc_declarado: 'Santiago de Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://cpanelhost.cl/',
  },
  {
    nombre: 'Crear Chile',
    dc_declarado: 'Datacenter propio (declarado); certificación ISO/IEC 27001',
    operador: null,
    tipo: 'propio',
    estado: 'autodeclarado',
    fuente_url: 'https://crearchile.com/',
  },
  {
    nombre: 'GameHost',
    dc_declarado: 'Datacenter propio en Santiago, Chile',
    operador: null,
    tipo: 'propio',
    estado: 'autodeclarado',
    fuente_url: 'https://www.gamehost.cl/',
  },
  {
    nombre: 'GrupoCG',
    dc_declarado: 'Datacenter propio en Santiago (Tier, 99.98%); partners Cogent, cPanel, Fortinet, Dell',
    operador: null,
    tipo: 'propio',
    estado: 'autodeclarado',
    fuente_url: 'https://www.grupocg.cl/',
  },
  {
    nombre: 'HostHunder',
    dc_declarado: 'Santiago (declarado)',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://hosthunder.com/',
  },
  {
    nombre: 'HostingCenter',
    dc_declarado: 'Datacenter propio en Chile',
    operador: null,
    tipo: 'propio',
    estado: 'autodeclarado',
    fuente_url: 'https://www.hostingcenter.cl/',
  },
  {
    nombre: 'HostingLatam',
    dc_declarado: 'Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://www.hostinglatam.cl/',
  },
  {
    nombre: 'HostingNIC',
    dc_declarado: 'Datacenter en Santiago, Chile (RM); latencia ~8ms',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://hostingnic.cl/',
  },
  {
    nombre: 'HostingProfesional',
    dc_declarado: 'Servidores en Santiago, Chile; miembro LACNIC',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://hostingprofesional.cl/',
  },
  {
    nombre: 'iHosting',
    dc_declarado: 'Datacenters propios en Viña del Mar y Santiago (+ Azure/AWS/Huawei)',
    operador: null,
    tipo: 'propio',
    estado: 'autodeclarado',
    fuente_url: 'https://www.ihosting.cl/',
  },
  {
    nombre: 'IIA',
    dc_declarado: 'Datacenter propio en Santiago (Porvenir 245)',
    operador: null,
    tipo: 'propio',
    estado: 'autodeclarado',
    fuente_url: 'https://iia.cl/',
  },
  {
    nombre: 'ID1',
    dc_declarado: 'Santiago',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://id1.cl/',
  },
  {
    nombre: 'ItFinden',
    dc_declarado: 'Ñuñoa, Santiago',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://itfinden.com/',
  },
  {
    nombre: 'WebHostChile',
    dc_declarado: 'Santiago, Chile',
    operador: null,
    tipo: 'colocation',
    estado: 'autodeclarado',
    fuente_url: 'https://webhostchile.cl/',
  },
];

/** Quick lookup helpers. */
export const getHostDc = (name: string): RankingHostDc | undefined =>
  rankingHosts.find((h) => h.nombre === name);

export const getOperatorByName = (name: string): CertifiedOperator | undefined =>
  certifiedOperators.find((o) => o.nombre === name);
