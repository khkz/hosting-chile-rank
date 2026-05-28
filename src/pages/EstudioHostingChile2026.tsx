import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Download,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Server,
  Network,
  ShieldAlert,
  BookOpen,
  Calendar,
} from 'lucide-react';

const PDF_URL = '/docs/investigacion-hosting-chile-2026-v3.pdf';
const PUBLISHED = '2026-05-28';
const VERSION = '3.0';

// ----------------------------------------------------------------------
// Datos transcritos del PDF — todas las cifras provienen del informe v3.0
// fechado 28-may-2026, no son benchmarks propios del sitio.
// ----------------------------------------------------------------------

interface Provider {
  rank: number;
  name: string;
  legal?: string;
  rut?: string;
  asn?: string;
  asnPrefixes?: string;
  dc: string;
  panel?: string;
  shared?: string;
  phone?: string;
  diff: string;
  reputation: string;
  type: 'cl-asn' | 'cl-no-asn' | 'intl';
  affiliateNote?: string;
  critical: string;
}

const PROVIDERS: Provider[] = [
  {
    rank: 1,
    name: 'HostingPlus',
    legal: 'Pluschile Internet Ltda.',
    rut: '76.636.640-6',
    asn: 'AS266879',
    asnPrefixes: '0 v4 / 1 v6 (bloque 192.140.56.0/22 en LACNIC)',
    dc: 'Propio en Santiago, enlaces redundantes 10 Gbps',
    panel: 'cPanel + Softaculous',
    shared: 'Desde $49.900 CLP/año (Personal SSD)',
    phone: 'Soporte 24/7 vía chat/ticket',
    diff: 'SSD, uptime 99,9%, SSL gratis, Litespeed disponible, soporte WordPress',
    reputation: 'Trustpilot PE 4/5 · HostAdvice 5/5 · sin reclamos visibles en reclamos.cl',
    type: 'cl-asn',
    critical: 'Solidez documental (RUT, ASN, 20+ años). Falta exponer precios mensuales de VPS y dedicado sin entrar al carrito. En bgp.he.net su prefijo v4 figura inactivo en el snapshot actual.',
  },
  {
    rank: 2,
    name: 'EcoHosting',
    legal: 'Ecohosting Internet Ltda.',
    rut: '76.764.736-0',
    asn: 'AS266855',
    asnPrefixes: '6 IPv4, 1 IPv6',
    dc: 'Propio en Chile, redundancia eléctrica y climatización',
    panel: 'cPanel',
    shared: 'Desde $19.900 CLP/año (con descuento, dominio .cl incluido)',
    phone: '+56 2 2405 3090 (24/7 real)',
    diff: 'RAID 10 SSD, doble enlace 1 Gbps, SSL gratis en todos los planes',
    reputation: 'HostAdvice y Reputación Verificada mayoritariamente positivas · 0 reclamos en reclamos.cl',
    type: 'cl-asn',
    critical: 'Probablemente la oferta más limpia para PyME en transparencia: dirección publicada (Providencia 1650 of. 303), teléfono fijo nacional, ASN propio y precios desde el sitio.',
  },
  {
    rank: 3,
    name: 'PowerHost / IxMetro',
    legal: 'PowerHost Telecom SpA',
    asn: 'AS263237',
    asnPrefixes: '≈350 prefijos IPv4, ~1.918 adyacencias BGP',
    dc: '4 datacenters propios: Santiago, NY, Moscú, Ámsterdam',
    panel: 'cPanel / DirectAdmin / Plesk',
    shared: 'Rango medio-premium (no publicado en directorios)',
    phone: 'NOC 24/7',
    diff: 'Líder técnico chileno por red: tránsito propio, peering directo, neutralidad de carrier, Tier III',
    reputation: 'Premium; quejas históricas por precio sobre la media · 1 reclamo no-técnico (ruido vecinal de generadores)',
    type: 'cl-asn',
    critical: 'Si la métrica es ASN propio + peering, debe encabezar el ranking técnico aunque el retail no sea el más barato.',
  },
  {
    rank: 4,
    name: 'Hostname.cl',
    legal: 'Hostname Limitada',
    rut: '76.096.415-8',
    asn: 'AS262256',
    asnPrefixes: '23 IPv4',
    dc: 'HN Datacenter propio en Chile (Seminario 687-A, Ñuñoa)',
    panel: 'cPanel',
    diff: 'Red propia Tier 1 chileno; 15+ años en el mercado; cooperación de red con Hosting.cl (entidades distintas)',
    reputation: 'Trayectoria sólida en B2B; perfil bajo en reclamos públicos',
    type: 'cl-asn',
    affiliateNote: 'Opera mejorhosting.cl como comparador alineado (HN #1, INC #2)',
    critical: 'Hostname y Hosting.cl son entidades distintas (diferente RUT y ASN). La existencia de mejorhosting.cl como supuesto comparador independiente que coloca a HN como #1 es el principal punto a transparentar.',
  },
  {
    rank: 5,
    name: 'Hosting.cl',
    legal: 'Premium Hosting Solutions SpA',
    rut: '76.457.436-2',
    asn: 'AS265839 + AS274233',
    dc: 'Infraestructura propia en Santiago (Santa María 274)',
    panel: 'cPanel / Plesk, entornos LiteSpeed',
    phone: '+56 2 2411 0300',
    diff: '100% SSD/NVMe, LiteSpeed, anti-malware y anti-DDoS, soporte 365 días',
    reputation: 'Trustpilot mixto · varios reclamos individuales en reclamos.cl 2012-2025 (bloqueo de dominios, conflictos de portabilidad)',
    type: 'cl-asn',
    affiliateNote: 'comparahosting.cl monetiza con afiliados WHMCS (aff=) hacia Hosting.cl, PlanetaHosting y HostingCenter',
    critical: 'Infraestructura real con ASN propio. A transparentar: (a) patrón reiterado de reclamos por bloqueo de dominios y dificultad de portabilidad; (b) comparahosting.cl como canal de captación afiliado.',
  },
  {
    rank: 6,
    name: 'BlueHosting',
    legal: 'Informática BlueHosting Ltda. (matriz: Haulmer SpA)',
    rut: '76.102.497-3',
    asn: 'AS64111',
    asnPrefixes: '3 IPv4',
    dc: 'Propio en Chile (operación Haulmer, sede Curicó)',
    panel: 'cPanel + instalador 1-click',
    shared: 'Desde $43.900 CLP/año + IVA · top hasta $600.000/año',
    phone: 'Soporte 24/7 vía Haulmer',
    diff: 'Ecosistema integrado con TUU (POS), OpenFactura y ChileFirmas; SSD; SSL gratis',
    reputation: 'Trustpilot mixto · varios usuarios reportan caídas y soporte irregular en plataformas externas',
    type: 'cl-asn',
    affiliateNote: 'hostingexperto.cl funciona como canal del grupo Haulmer; ranking no cambia desde 2019 (Wayback Machine)',
    critical: 'Único ecosistema en Chile que une facturación + firma + POS + hosting. Para sitios con foco en rendimiento puro hay alternativas mejor evaluadas técnicamente.',
  },
  {
    rank: 7,
    name: 'Gigas Hosting Chile',
    legal: 'Gigas Hosting Chile SpA (grupo Gigas, España)',
    asn: 'AS263700',
    asnPrefixes: '3 IPv4',
    dc: 'Datacenter en Santiago + red regional (ES, CO, PE)',
    panel: 'cPanel / Plesk según producto',
    diff: 'Grupo cotizado en Euronext Growth; foco enterprise; LATAM con red propia',
    reputation: 'Reputación corporativa sólida; poca exposición a usuarios shared/retail',
    type: 'cl-asn',
    critical: 'Orientado a cloud privada y servicios gestionados PyME-media/empresa más que a hosting shared.',
  },
  {
    rank: 8,
    name: 'PlanetaHosting',
    legal: 'Planetahosting.cl Ltda.',
    asn: undefined,
    dc: 'Servidores en Chile (arriendo probable en DC neutral)',
    panel: 'cPanel',
    shared: 'Desde $39.900 CLP/año · E-commerce $159.900–$249.900/año',
    phone: '+56 2 2411 0350 (L-D 09:00-24:00)',
    diff: 'Trayectoria 24+ años, dirección física visible (Badajoz 100, Las Condes)',
    reputation: 'WebsitePlanet 2026 «decente, pero los hay mejores» · 3 reclamos en reclamos.cl 2019-2025',
    type: 'cl-no-asn',
    critical: 'Sin ASN propio. Historial público de reclamos a listar de forma neutral. Plan empresa caro frente a alternativas con LiteSpeed/NVMe.',
  },
  {
    rank: 9,
    name: 'SolucionHost',
    legal: 'No publicada',
    asn: undefined,
    dc: 'Declaran DC propio en Chile (no verificable públicamente)',
    panel: 'cPanel + Softaculous',
    shared: 'Web Hosting desde $10.000 CLP/año',
    phone: '+56 2 3384 9718',
    diff: 'Precios bajos, migración gratis, uptime declarado 99,9%',
    reputation: 'Múltiples reclamos en reclamos.cl 2013-2025: caídas, atención deficiente, problemas de correo, dificultad para transferir dominios',
    type: 'cl-no-asn',
    critical: 'Precios atractivos para microemprendedores, pero el perfil de reclamación pública es el peor del Top 10.',
  },
  {
    rank: 10,
    name: 'Hostinger',
    legal: 'Hostinger International Ltd. (Lituania)',
    asn: 'Sí, no chileno',
    dc: 'São Paulo, Brasil (no hay DC chileno)',
    panel: 'hPanel propio (no cPanel)',
    shared: 'Desde USD 2,99/mes',
    phone: 'Sin teléfono local; chat 24/7',
    diff: 'LiteSpeed + LSCache, IA copilot, instalador WordPress 1-click',
    reputation: 'Trustpilot global 4,7/5 con ≈47.000 reseñas (87% de 5★)',
    type: 'intl',
    critical: 'Mejor precio/UX para principiantes. Alertas para CL: sin factura electrónica nacional, latencia desde São Paulo, sin soporte telefónico.',
  },
  {
    rank: 11,
    name: 'DonWeb / Dattatec',
    legal: 'Dattatec.com SRL (Argentina)',
    asn: 'Sí en AR, no chileno',
    dc: '4 datacenters en Rosario y Santa Fe, Argentina',
    panel: 'cPanel + Ferozo + CloudPanel',
    shared: 'Desde ~$1.800 CLP/mes · Plan 2 Linux ≈ $28.800/año',
    phone: 'Soporte 24/7 en español',
    diff: 'Uptime declarado 99,99%, trayectoria LATAM',
    reputation: 'Trustpilot ≈1.056 reseñas, rating mixto · 1 reclamo 2025 publicidad engañosa',
    type: 'intl',
    critical: 'Datos alojados en Argentina, cumplimiento legal rige por AR. Marcar claramente como tal en la ficha del comparador.',
  },
];

interface AffiliateCase {
  domain: string;
  ownedBy: string;
  evidence: string;
  topPattern: string;
  citation: string;
}

const AFFILIATE_CASES: AffiliateCase[] = [
  {
    domain: 'rankinghosting.cl',
    ownedBy: 'HostingNet (Telecomunicaciones HostingNet SpA · AS272144)',
    evidence: '4 de 4 enlaces del footer apuntan a la red HostingNet. WHOIS: Rodrigo Manríquez Salas. Auto-confesión: "puede recibir compensación por algunas de las compañías cuyos productos son revisados".',
    topPattern: '#1 HostingNet · #2 UnHosting · #3 HostingCom · #4 ZNet-Hosting · #5 WireNetChile — todas marcas del mismo grupo',
    citation: 'whois.com/whois/rankinghosting.cl · hostingnet.cl/nosotros · ipinfo.io/AS272144',
  },
  {
    domain: 'mejorhosting.cl',
    ownedBy: 'Hostname / HN (Hostname Limitada · RUT 76.096.415-8 · AS262256)',
    evidence: 'Top con HN #1 e INC #2 (marca asociada). Enlace SEO interno a hn.cl. Testimonios destacados son clientes de HN e INC. Sin razón social ni RUT en aviso legal.',
    topPattern: '#1 HN · #2 INC · #3 HOST.cl · #4 Hosting.cl · #5 PlanetaHosting · #6 HostingPlus · #7 Tecnoinver',
    citation: 'mejorhosting.cl · hn.cl/empresa · peeringdb.com/net/8589',
  },
  {
    domain: 'comparahosting.cl',
    ownedBy: 'Afiliación a Hosting.cl, PlanetaHosting y HostingCenter (propiedad: probable Hosting.cl, no demostrada)',
    evidence: 'Todos los CTA "Visitar Hosting" son enlaces de referido WHMCS: panel.hosting.cl/aff.php?aff=167 · panel.planetahosting.cl/aff.php?aff=78 · panel.hostingcenter.cl/aff.php?aff=1. Sin razón social ni RUT publicados.',
    topPattern: '#1 Hosting.cl (9.9) · #2 PlanetaHosting.cl (9.5) · #3 HostingCenter.cl (9.4)',
    citation: 'comparahosting.cl (inspección de CTAs)',
  },
  {
    domain: 'hostingexperto.cl',
    ownedBy: 'BlueHosting / Haulmer SpA',
    evidence: 'El ranking no ha cambiado en 7 años (snapshot Wayback Machine 18-oct-2019 vs sitio actual). Infraestructura Haulmer expuesta como subdominio website-bluehosting-cl.haulmer.dev. Sin razón social ni metodología publicada.',
    topPattern: 'Top inmóvil desde 2019 con BlueHosting en cabecera',
    citation: 'web.archive.org/web/20191018120855/https://www.hostingexperto.cl/ · haulmer.com/quienes-somos',
  },
];

const SELF_PROMO = [
  { site: 'smart.cl/el-mejor-hosting-de-chile-2026', conflict: 'Smart Systems Ltda. es proveedor; el ganador es smart.cl' },
  { site: 'tecnoinver.cl (blog)', conflict: 'Publica "X vs Tecnoinver"; por construcción gana Tecnoinver' },
  { site: 'wnpower.com/blog/mejor-hosting-chile', conflict: 'WNPower es proveedor argentino; se autoposiciona #1' },
  { site: 'donweb.com (artículos "mejores")', conflict: 'DonWeb/Dattatec es proveedor; posiciona su marca como referencia' },
  { site: 'faciliza.com/mejor-hosting-chile-2026', conflict: 'Blog generalista que recomienda Bluehost (global) con afiliación' },
];

const SOURCES = {
  tech: [
    { label: 'bgp.he.net/country/CL (snapshot 27-may-2026)', url: 'https://bgp.he.net/country/CL' },
    { label: 'bgpview.io — ASN registry', url: 'https://bgpview.io' },
    { label: 'peeringdb.com — PIT Chile', url: 'https://www.peeringdb.com/' },
    { label: 'lacnic.net — asignación de ASN', url: 'https://www.lacnic.net' },
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

// ----------------------------------------------------------------------

const EstudioHostingChile2026: React.FC = () => {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: 'Investigación Profunda del Mercado de Hosting en Chile 2026',
    headline: 'Top 11 proveedores de hosting en Chile: ASN, precios, reputación y comparadores afiliados',
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    inLanguage: 'es-CL',
    version: VERSION,
    author: {
      '@type': 'Organization',
      name: 'Equipo Editorial de EligeTuHosting',
      url: 'https://eligetuhosting.cl/sobre-nosotros',
    },
    publisher: {
      '@type': 'Organization',
      name: 'EligeTuHosting.cl',
      url: 'https://eligetuhosting.cl',
    },
    contributor: {
      '@type': 'SoftwareApplication',
      name: 'Claude Sonnet 4.7',
      applicationCategory: 'AI assistant',
      creator: { '@type': 'Organization', name: 'Anthropic' },
    },
    about: 'Mercado de hosting en Chile, infraestructura ASN, planes y comparadores afiliados',
    citation: [
      'https://bgp.he.net/country/CL',
      'https://www.lacnic.net',
      'https://www.reclamos.cl',
      'https://www.trustpilot.com',
      'https://web.archive.org/web/20191018120855/https://www.hostingexperto.cl/',
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Estudio Hosting Chile 2026 · ASN, precios y comparadores afiliados | EligeTuHosting</title>
        <meta
          name="description"
          content="Investigación independiente del mercado de hosting en Chile 2026: 11 proveedores con ASN, RUT, precios CLP y reputación verificable. Alerta sobre comparadores afiliados (rankinghosting, mejorhosting, comparahosting, hostingexperto)."
        />
        <link rel="canonical" href="https://eligetuhosting.cl/estudio-hosting-chile-2026" />
        <meta property="og:title" content="Estudio Hosting Chile 2026 · ASN, precios y comparadores afiliados" />
        <meta property="og:description" content="Top 11 proveedores con ASN propio en LACNIC, planes en CLP, reputación pública y la primera auditoría documentada de comparadores afiliados en Chile." />
        <meta property="og:url" content="https://eligetuhosting.cl/estudio-hosting-chile-2026" />
        <meta property="og:type" content="article" />
        <meta name="article:published_time" content={PUBLISHED} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* HERO */}
        <header className="mb-12 border-b pb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs">Investigación de mercado</Badge>
            <Badge variant="outline" className="text-xs">v{VERSION}</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" /> Publicado el 28 de mayo de 2026
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
            Investigación Profunda del Mercado de Hosting en Chile 2026
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            Top 11 proveedores con ASN propio en LACNIC, razón social, precios en CLP y reputación pública.
            Incluye la primera auditoría documentada de los principales <strong>comparadores afiliados</strong>{' '}
            que se hacen pasar por independientes en Google.cl.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={PDF_URL} target="_blank" rel="noopener noreferrer" download>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF (28 págs)
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#fuentes">
                <BookOpen className="w-4 h-4 mr-2" />
                Ver fuentes
              </a>
            </Button>
          </div>
        </header>

        {/* TOC */}
        <nav aria-label="Tabla de contenidos" className="mb-12 p-6 bg-muted/40 rounded-lg border">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Contenido del informe
          </h2>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <li><a href="#resumen" className="text-primary hover:underline">1. Resumen ejecutivo</a></li>
            <li><a href="#metodologia" className="text-primary hover:underline">2. Metodología y criterios</a></li>
            <li><a href="#mapa" className="text-primary hover:underline">3. Mapa del mercado: ASN vs revendedores</a></li>
            <li><a href="#fichas" className="text-primary hover:underline">4. Top 11 proveedores — fichas</a></li>
            <li><a href="#tabla" className="text-primary hover:underline">5. Tabla comparativa general</a></li>
            <li><a href="#alerta" className="text-primary hover:underline">6. Alerta: comparadores afiliados</a></li>
            <li><a href="#conclusiones" className="text-primary hover:underline">7. Conclusiones editoriales</a></li>
            <li><a href="#fuentes" className="text-primary hover:underline">8. Anexo: fuentes consultadas</a></li>
          </ol>
        </nav>

        {/* 1. RESUMEN */}
        <section id="resumen" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">1. Resumen ejecutivo</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              El mercado chileno de hosting está fragmentado en cuatro capas. En la cima, empresas con{' '}
              <strong>ASN propio en LACNIC</strong>, infraestructura en datacenters nacionales y peering activo en
              PIT Chile. En el medio, hostings con marca pero sin red propia. En el extremo internacional, marcas
              globales (Hostinger, HostGator, DonWeb) que comercializan en Chile pero alojan en Brasil, EE.UU. o
              Argentina. Y debajo, decenas de revendedores que reempaquetan cPanel.
            </p>
            <p>
              Para distinguir un hosting serio de uno <em>de fachada</em>, la métrica más honesta no es el precio:
              son tres elementos verificables públicamente: <strong>(a) ASN propio</strong> con prefijos anunciados
              en BGP, <strong>(b) razón social y RUT chileno</strong> con domicilio comercial verificable y{' '}
              <strong>(c) canal de soporte telefónico nacional</strong>.
            </p>
            <div className="my-6 p-5 border-l-4 border-l-destructive bg-destructive/5 rounded-r-lg not-prose">
              <p className="flex items-start gap-2 text-sm">
                <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>Hallazgo crítico:</strong> varios de los principales «comparadores de hosting» que
                  ranquean en Google.cl no son independientes. Son sitios afiliados operados por los mismos
                  hostings que aparecen en sus rankings, con enlaces de referido que monetizan cada venta.
                  Se documentan los casos de <strong>rankinghosting.cl</strong>, <strong>mejorhosting.cl</strong>,{' '}
                  <strong>comparahosting.cl</strong> y <strong>hostingexperto.cl</strong>.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* 2. METODOLOGÍA */}
        <section id="metodologia" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">2. Metodología y criterios</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>Para cada proveedor se cruzaron las siguientes fuentes verificables públicamente:</p>
            <ul>
              <li><strong>Infraestructura técnica:</strong> bgp.he.net, bgpview.io, peeringdb.com, ipinfo.io para verificar ASN, prefijos BGP, peering en PIT Chile y datacenter.</li>
              <li><strong>Datos corporativos:</strong> genealog.cl, gonow.cl y NIC Chile para razón social, RUT y representantes legales.</li>
              <li><strong>Planes y precios:</strong> inspección directa del sitio del proveedor (CLP, con IVA cuando se indica).</li>
              <li><strong>Reputación:</strong> reclamos.cl (quejas verificables), Trustpilot, HostAdvice y foros chilenos (Antronio, ForoBeta, ForosDelWeb).</li>
              <li><strong>Comparadores afiliados:</strong> WHOIS, inspección de footer y CTAs, Wayback Machine para verificar inmutabilidad temporal del ranking.</li>
            </ul>
          </div>
        </section>

        {/* 3. MAPA */}
        <section id="mapa" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">3. Mapa del mercado: ASN propio vs revendedores</h2>

          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Tier 1 — Hosting chileno con red BGP robusta
          </h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 border-b">Proveedor</th>
                  <th className="text-left p-3 border-b">ASN</th>
                  <th className="text-left p-3 border-b">Razón social</th>
                  <th className="text-left p-3 border-b">Prefijos v4</th>
                  <th className="text-left p-3 border-b">PIT Chile</th>
                </tr>
              </thead>
              <tbody className="[&>tr:nth-child(even)]:bg-muted/30">
                <tr><td className="p-3">PowerHost / IxMetro</td><td className="p-3 font-mono">AS263237</td><td className="p-3">PowerHost Telecom SpA</td><td className="p-3">≈350</td><td className="p-3">Sí (activo)</td></tr>
                <tr><td className="p-3">Hostname.cl</td><td className="p-3 font-mono">AS262256</td><td className="p-3">Hostname Limitada</td><td className="p-3">23</td><td className="p-3">Sí</td></tr>
                <tr><td className="p-3">Hosting.cl</td><td className="p-3 font-mono">AS265839 + AS274233</td><td className="p-3">Premium Hosting Solutions SpA</td><td className="p-3">5+1</td><td className="p-3">Sí</td></tr>
                <tr><td className="p-3">Linets</td><td className="p-3 font-mono">AS263826</td><td className="p-3">Linets Chile SpA</td><td className="p-3">10</td><td className="p-3">Sí</td></tr>
                <tr><td className="p-3">Gigas Hosting Chile</td><td className="p-3 font-mono">AS263700</td><td className="p-3">Gigas Hosting Chile SpA</td><td className="p-3">3</td><td className="p-3">Sí</td></tr>
                <tr><td className="p-3">HostingPlus</td><td className="p-3 font-mono">AS266879</td><td className="p-3">Pluschile Internet Ltda.</td><td className="p-3">0 v4 / 1 v6</td><td className="p-3">Sí</td></tr>
                <tr><td className="p-3">EcoHosting</td><td className="p-3 font-mono">AS266855</td><td className="p-3">Ecohosting Internet Ltda.</td><td className="p-3">6</td><td className="p-3">Sí</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mb-3">Sin ASN propio — revendedores / arrendadores de datacenter</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Estos proveedores tienen marca y presencia comercial, pero no figuran en LACNIC con ASN propio.
            Operan sobre IPs y tránsito de un upstream — no los hace malos por defecto, pero implica una
            dependencia técnica que conviene transparentar.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm mb-6">
            {['PlanetaHosting.cl', 'SolucionHost.cl', 'WebHosting.cl', 'Microhost', 'Cinetic', 'Sered Chile (operador español)'].map((p) => (
              <li key={p} className="flex items-center gap-2 p-3 bg-muted/40 rounded">
                <XCircle className="w-4 h-4 text-destructive shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. FICHAS */}
        <section id="fichas" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">4. Top 11 proveedores — fichas detalladas</h2>
          <div className="space-y-6">
            {PROVIDERS.map((p) => (
              <Card key={p.rank} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      <span className="text-muted-foreground mr-2">#{p.rank}</span>
                      {p.name}
                    </h3>
                    {p.legal && <p className="text-sm text-muted-foreground mt-1">{p.legal}{p.rut && ` · RUT ${p.rut}`}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.type === 'cl-asn' && <Badge className="bg-green-600 hover:bg-green-700"><Server className="w-3 h-3 mr-1" /> ASN propio CL</Badge>}
                    {p.type === 'cl-no-asn' && <Badge variant="destructive">Sin ASN propio</Badge>}
                    {p.type === 'intl' && <Badge variant="secondary">Internacional</Badge>}
                  </div>
                </div>

                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                  {p.asn && (<><dt className="font-semibold">ASN</dt><dd className="font-mono text-xs">{p.asn} {p.asnPrefixes && `· ${p.asnPrefixes}`}</dd></>)}
                  <dt className="font-semibold">Datacenter</dt><dd>{p.dc}</dd>
                  {p.panel && (<><dt className="font-semibold">Panel</dt><dd>{p.panel}</dd></>)}
                  {p.shared && (<><dt className="font-semibold">Hosting shared</dt><dd>{p.shared}</dd></>)}
                  {p.phone && (<><dt className="font-semibold">Soporte</dt><dd>{p.phone}</dd></>)}
                  <dt className="font-semibold">Diferenciadores</dt><dd>{p.diff}</dd>
                  <dt className="font-semibold">Reputación pública</dt><dd>{p.reputation}</dd>
                </dl>

                {p.affiliateNote && (
                  <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-l-amber-500 rounded-r text-sm">
                    <strong className="text-amber-700 dark:text-amber-400">⚠ Comparador afiliado:</strong> {p.affiliateNote}
                  </div>
                )}

                <p className="text-sm italic text-muted-foreground border-t pt-3">
                  <strong className="not-italic text-foreground">Nota crítica:</strong> {p.critical}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* 5. TABLA COMPARATIVA */}
        <section id="tabla" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">5. Tabla comparativa general</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Precios CLP referenciales (con IVA cuando se indica). Cifras observadas en mayo 2026.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 border-b">#</th>
                  <th className="text-left p-3 border-b">Proveedor</th>
                  <th className="text-left p-3 border-b">ASN</th>
                  <th className="text-left p-3 border-b">DC Chile</th>
                  <th className="text-left p-3 border-b">Shared</th>
                  <th className="text-left p-3 border-b">Tipo</th>
                </tr>
              </thead>
              <tbody className="[&>tr:nth-child(even)]:bg-muted/30">
                {PROVIDERS.map((p) => (
                  <tr key={p.rank}>
                    <td className="p-3">{p.rank}</td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 font-mono text-xs">{p.asn ?? '—'}</td>
                    <td className="p-3">{p.type === 'cl-asn' ? '✓ Propio' : p.type === 'cl-no-asn' ? 'Arriendo' : 'No (extranjero)'}</td>
                    <td className="p-3">{p.shared ?? '—'}</td>
                    <td className="p-3 text-xs">{p.type === 'cl-asn' ? 'Chileno c/ASN' : p.type === 'cl-no-asn' ? 'Chileno s/ASN' : 'Internacional'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. ALERTA AFILIADOS */}
        <section id="alerta" className="mb-14 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-7 h-7 text-destructive" />
            <h2 className="text-2xl md:text-3xl font-bold">6. Alerta: comparadores afiliados</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Varios sitios que aparecen primero en Google.cl al buscar «mejor hosting Chile» <strong>no son
            comparadores independientes</strong>: son canales de marketing operados por los mismos hostings que
            están comparando. El usuario cree que lee una recomendación neutral cuando en realidad está siendo
            dirigido — vía afiliado o ranking sesgado — a una marca del mismo grupo.
          </p>

          <h3 className="text-xl font-semibold mb-4">6.1 Casos documentados</h3>
          <div className="space-y-5 mb-8">
            {AFFILIATE_CASES.map((c) => (
              <Card key={c.domain} className="p-5 border-l-4 border-l-destructive">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <h4 className="text-lg font-bold font-mono">{c.domain}</h4>
                  <Badge variant="destructive">CONFIRMADO</Badge>
                </div>
                <dl className="space-y-2 text-sm">
                  <div><dt className="font-semibold inline">Operado por: </dt><dd className="inline">{c.ownedBy}</dd></div>
                  <div><dt className="font-semibold inline">Evidencia técnica: </dt><dd className="inline">{c.evidence}</dd></div>
                  <div><dt className="font-semibold inline">Patrón del top: </dt><dd className="inline italic">{c.topPattern}</dd></div>
                  <div className="pt-2 text-xs text-muted-foreground border-t mt-3">
                    <span className="font-semibold">Evidencia citable:</span> {c.citation}
                  </div>
                </dl>
              </Card>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-4">6.2 Auto-promoción disfrazada de comparativa</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Proveedores que publican «rankings de los mejores hosting de Chile» en su propio dominio,
            posicionándose a sí mismos como #1. No son comparadores: son artículos SEO con disclosure ausente o débil.
          </p>
          <ul className="space-y-2 text-sm mb-6">
            {SELF_PROMO.map((s) => (
              <li key={s.site} className="flex items-start gap-2 p-3 bg-muted/40 rounded">
                <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <span><strong className="font-mono">{s.site}</strong> — {s.conflict}</span>
              </li>
            ))}
          </ul>

          <Card className="p-5 bg-primary/5 border-primary/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Qué hace genuinamente independiente a un comparador
            </h4>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Razón social, RUT chileno y dirección física visibles en el footer.</li>
              <li>Sección «Transparencia» que declare política de afiliados.</li>
              <li>Metodología cuantitativa replicable con pesos publicados.</li>
              <li>Declaración explícita de qué proveedores NO patrocinan ni anuncian.</li>
              <li>Mecanismo público de derecho a réplica.</li>
            </ol>
            <p className="text-sm mt-3">
              Ver nuestra implementación en{' '}
              <Link to="/transparencia-hosting-chile" className="text-primary underline">/transparencia-hosting-chile</Link>{' '}
              y{' '}
              <Link to="/nuestro-metodo" className="text-primary underline">/nuestro-metodo</Link>.
            </p>
          </Card>
        </section>

        {/* 7. CONCLUSIONES */}
        <section id="conclusiones" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Conclusiones y recomendaciones editoriales</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Por <strong>tamaño de red BGP</strong>, los hostings chilenos más importantes son, en orden:{' '}
              <strong>PowerHost · Hostname.cl · Hosting.cl · Linets · Gigas Chile · HostingPlus · EcoHosting</strong>.
              Con ASN propio menor: BlueHosting, HostingNet, iHosting. <strong>Sin ASN propio</strong> y con marca
              importante: PlanetaHosting, SolucionHost, WebHosting.cl, Microhost, Cinetic y Sered Chile.
            </p>
            <p>
              Aclaración: <strong>Hostname y Hosting.cl son entidades distintas</strong> (RUT 76.096.415-8 vs
              76.457.436-2) que recientemente acordaron cooperación de red — no son la misma empresa.
            </p>
            <p>
              Para un <strong>departamento TI corporativo</strong>, el ranking debe liderarlo PowerHost. Para
              <strong> microemprendedores</strong>, conviene mantener BlueHosting, EcoHosting e iHost cerca del tope
              por precio + factura electrónica nacional. Para usuarios que <strong>solo quieren precio</strong>,
              Hostinger sigue ganando — con las alertas de DC en São Paulo y sin DTE chileno.
            </p>
          </div>
        </section>

        {/* 8. FUENTES */}
        <section id="fuentes" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">8. Anexo: fuentes consultadas</h2>

          {(Object.entries(SOURCES) as [keyof typeof SOURCES, typeof SOURCES.tech][]).map(([key, items]) => (
            <div key={key} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 capitalize">
                {key === 'tech' ? 'Fuentes técnicas (ASN, BGP, peering)' : key === 'reputation' ? 'Reputación y reclamos' : 'Registros corporativos'}
              </h3>
              <ul className="space-y-2 text-sm">
                {items.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline inline-flex items-center gap-1">
                      {s.label} <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="text-sm text-muted-foreground mt-6">
            El anexo completo del PDF incluye más de 60 enlaces específicos a reclamos, snapshots de Wayback
            Machine y fichas corporativas.{' '}
            <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Descargar PDF completo
            </a>.
          </p>
        </section>

        {/* FOOTER DEL ARTÍCULO */}
        <footer className="mt-16 pt-8 border-t">
          <div className="flex items-start gap-3 p-5 bg-muted/40 rounded-lg">
            <FileText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">Sobre este informe.</strong> Elaborado por el Equipo Editorial
                de EligeTuHosting con asistencia de <em>Claude Sonnet 4.7</em> (Anthropic) sobre fuentes públicas
                verificables listadas en el Anexo. Las afirmaciones técnicas (ASN, RUT, prefijos BGP) provienen
                de LACNIC, bgp.he.net, NIC Chile y registros corporativos chilenos. Las afirmaciones sobre
                comparadores afiliados están respaldadas por inspección directa de CTAs, WHOIS y Wayback Machine.
              </p>
              <p>
                Los precios CLP y prefijos BGP tienen una validez de mercado típica de 3 meses; conviene
                contrastarlos antes de tomar decisiones. La inclusión de un proveedor en este informe no implica
                recomendación comercial. Versión {VERSION} · {PUBLISHED}.
              </p>
              <p>
                ¿Eres un proveedor mencionado y quieres ejercer derecho a réplica?{' '}
                <Link to="/contacto" className="text-primary underline">Contáctanos</Link>.
              </p>
            </div>
          </div>
        </footer>
      </main>

      <Footer />
    </div>
  );
};

export default EstudioHostingChile2026;
