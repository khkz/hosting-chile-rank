import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DatasetSchema from '@/components/SEO/DatasetSchema';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, ExternalLink, Network, ShieldAlert, BookOpen, Calendar, XCircle } from 'lucide-react';
import EstudioFichas, { EstudioTablaGeneral } from '@/components/estudio/EstudioFichas';
import EstudioAfiliados from '@/components/estudio/EstudioAfiliados';
import { SOURCES, TIER1_ROWS } from '@/data/estudio2026';
import {
  COMMERCIAL_DISCLOSURE,
  PRICING_FOOTNOTE,
  VERIFICATION_DATE_HUMAN,
  VERIFICATION_DATE_ISO,
  pitChileLabel,
  hasPitChile,
} from '@/data/verified2026';

const PDF_URL = '/docs/investigacion-hosting-chile-2026-final.pdf';
const PUBLISHED = '2026-05-28';
const VERSION = '3.1';

const EstudioHostingChile2026: React.FC = () => {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: 'Investigación del Mercado de Hosting en Chile 2026',
    headline: 'Top 11 proveedores de hosting en Chile: ASN, precios, reputación y comparadores con vínculo comercial',
    datePublished: PUBLISHED,
    dateModified: VERIFICATION_DATE_ISO,
    inLanguage: 'es-CL',
    version: VERSION,
    author: {
      '@type': 'Organization',
      name: 'Equipo Editorial de EligeTuHosting',
      url: 'https://eligetuhosting.cl/sobre-nosotros',
    },
    publisher: { '@type': 'Organization', name: 'EligeTuHosting.cl', url: 'https://eligetuhosting.cl' },
    about: 'Mercado de hosting en Chile, infraestructura ASN, planes y comparadores con vínculo comercial',
    citation: [
      'https://stat.ripe.net',
      'https://www.peeringdb.com/',
      'https://bgp.tools',
      'https://www.lacnic.net',
      'https://www.reclamos.cl',
    ],
    disambiguatingDescription: COMMERCIAL_DISCLOSURE,
  };

  const articleSchemaSeo = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Estudio Hosting Chile 2026: ASN, precios y comparadores con vínculo comercial',
    mainEntityOfPage: 'https://eligetuhosting.cl/estudio-hosting-chile-2026',
    datePublished: PUBLISHED,
    dateModified: VERIFICATION_DATE_ISO,
    inLanguage: 'es-CL',
    author: { '@type': 'Organization', name: 'EligeTuHosting', url: 'https://eligetuhosting.cl/sobre-nosotros' },
    publisher: {
      '@type': 'Organization',
      name: 'EligeTuHosting.cl',
      url: 'https://eligetuhosting.cl',
      logo: { '@type': 'ImageObject', url: 'https://eligetuhosting.cl/favicon-logo.svg' },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.cl' },
      { '@type': 'ListItem', position: 2, name: 'Recursos', item: 'https://eligetuhosting.cl/recursos-hosting-chile' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Estudio Hosting Chile 2026',
        item: 'https://eligetuhosting.cl/estudio-hosting-chile-2026',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Estudio Hosting Chile 2026 · ASN, precios y comparadores afiliados | EligeTuHosting</title>
        <meta
          name="description"
          content="Estudio editorial del mercado de hosting en Chile 2026: 11 proveedores con ASN, razón social, precios en CLP y reputación pública. Metodología y pesos publicados."
        />
        <link rel="canonical" href="https://eligetuhosting.cl/estudio-hosting-chile-2026" />
        <meta property="og:title" content="Estudio Hosting Chile 2026 · ASN, precios y comparadores afiliados" />
        <meta
          property="og:description"
          content="Top 11 proveedores con ASN en LACNIC, precios anualizados en CLP, reputación pública y auditoría de comparadores con vínculo comercial."
        />
        <meta property="og:url" content="https://eligetuhosting.cl/estudio-hosting-chile-2026" />
        <meta property="og:type" content="article" />
        <meta name="article:published_time" content={PUBLISHED} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchemaSeo)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <DatasetSchema />

      <Navbar />

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* HERO */}
        <header className="mb-12 border-b pb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs">Estudio de mercado</Badge>
            <Badge variant="outline" className="text-xs">v{VERSION}</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" /> Publicado el 28 de mayo de 2026 · datos revisados el{' '}
              {VERIFICATION_DATE_HUMAN}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
            Estudio del Mercado de Hosting en Chile 2026
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
            Top 11 proveedores con ASN en LACNIC, razón social, precios anualizados en CLP y reputación pública.
            Incluye una revisión documentada de los principales <strong>comparadores con vínculo comercial</strong>{' '}
            que aparecen en Google.cl.
          </p>
          <p className="text-xs text-muted-foreground bg-muted/50 border rounded-md px-3 py-2 mb-6">
            {COMMERCIAL_DISCLOSURE}
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
            <li><a href="#alerta" className="text-primary hover:underline">6. Comparadores con vínculo comercial</a></li>
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
              <strong>ASN asignado en LACNIC</strong> e infraestructura en datacenters nacionales; de ellas, solo dos
              están efectivamente conectadas al <strong>PIT Chile</strong>. En el medio, hostings con marca pero sin
              red propia. En el extremo internacional, marcas globales (Hostinger, HostGator, DonWeb) que
              comercializan en Chile pero alojan en Brasil, EE.UU. o Argentina. Y debajo, decenas de revendedores
              que reempaquetan cPanel.
            </p>
            <p>
              Tener un ASN asignado no equivale a tener red desplegada: hay que mirar los{' '}
              <strong>prefijos efectivamente originados</strong> y los vecinos BGP. Los tres elementos que
              consideramos más informativos son: <strong>(a) prefijos originados y peering verificable</strong>,{' '}
              <strong>(b) razón social y RUT chileno</strong> con domicilio comercial y{' '}
              <strong>(c) canal de soporte nacional</strong>.
            </p>
            <div className="my-6 p-5 border-l-4 border-l-destructive bg-destructive/5 rounded-r-lg not-prose">
              <p className="flex items-start gap-2 text-sm">
                <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>Hallazgo principal:</strong> varios de los «comparadores de hosting» que ranquean en
                  Google.cl mantienen <strong>vínculo comercial</strong> con los proveedores que listan, mediante
                  enlaces de afiliado que monetizan cada venta. Documentamos los casos de{' '}
                  <strong>comparahosting.cl</strong>, <strong>rankinghosting.cl</strong> y{' '}
                  <strong>mejorhosting.cl</strong> distinguiendo lo verificado de lo no demostrado.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* 2. METODOLOGÍA */}
        <section id="metodologia" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">2. Metodología y criterios</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Para cada proveedor se cruzaron las siguientes fuentes públicas. Los pesos del puntaje compuesto se
              publican en{' '}
              <Link to="/metodologia" className="text-primary underline">/metodologia</Link>.
            </p>
            <ul>
              <li><strong>Infraestructura técnica:</strong> LACNIC RDAP, RIPEstat (prefijos originados y vecinos BGP), PeeringDB (netixlan por ASN) y bgp.tools para el listado de miembros del PIT Santiago.</li>
              <li><strong>Datos corporativos:</strong> registros públicos y NIC Chile para razón social y RUT. Cuando el holder del ASN es una marca y no una sociedad, se indica así.</li>
              <li><strong>Planes y precios:</strong> inspección directa del sitio del proveedor, anualizando el plan de entrada e indicando si el valor es neto o con IVA.</li>
              <li><strong>Reputación:</strong> reclamos.cl, Trustpilot, HostAdvice y foros chilenos.</li>
              <li><strong>Comparadores:</strong> inspección de enlaces salientes y CTAs. No publicamos nombres de personas naturales obtenidos de WHOIS.</li>
            </ul>
            <p className="text-sm">{PRICING_FOOTNOTE}</p>
          </div>
        </section>

        {/* 3. MAPA */}
        <section id="mapa" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">3. Mapa del mercado: ASN asignado vs revendedores</h2>

          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Hosting chileno con ASN asignado en LACNIC
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            La columna «PIT Chile» refleja presencia efectiva en el IXP según PeeringDB (netixlan) y el listado de
            miembros de bgp.tools. Solo <strong>PowerHost</strong> y <strong>Hostname.cl</strong> están conectados;
            el resto no aparece como miembro.
          </p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 border-b">Proveedor</th>
                  <th className="text-left p-3 border-b">ASN</th>
                  <th className="text-left p-3 border-b">Razón social / holder</th>
                  <th className="text-left p-3 border-b">Prefijos v4 originados</th>
                  <th className="text-left p-3 border-b">PIT Chile</th>
                </tr>
              </thead>
              <tbody className="[&>tr:nth-child(even)]:bg-muted/30">
                {TIER1_ROWS.map((r) => (
                  <tr key={r.asn}>
                    <td className="p-3">{r.name}</td>
                    <td className="p-3 font-mono text-xs">{r.asn}</td>
                    <td className="p-3">{r.legal}</td>
                    <td className="p-3">{r.prefixes}</td>
                    <td className="p-3">
                      {hasPitChile(r.asn.split(' ')[0]) ? pitChileLabel(r.asn.split(' ')[0]) : 'No'}
                    </td>
                  </tr>
                ))}
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
          <p className="text-sm text-muted-foreground mb-6">
            Este estudio cubre 11 proveedores; el ranking de portada muestra el Top 10 y no incluye a{' '}
            <strong>DonWeb / Dattatec</strong>, que aquí se lista por su relevancia regional aunque aloja en
            Argentina.
          </p>
          <EstudioFichas />
        </section>

        {/* 5. TABLA COMPARATIVA */}
        <section id="tabla" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">5. Tabla comparativa general</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Precios de entrada anualizados en CLP, observados el {VERIFICATION_DATE_HUMAN}. PowerHost aparece con su
            catálogo VPS porque no comercializa hosting compartido, por lo que no es comparable en precio.
          </p>
          <EstudioTablaGeneral />
        </section>

        {/* 6. COMPARADORES CON VÍNCULO COMERCIAL */}
        <EstudioAfiliados />

        {/* 7. CONCLUSIONES */}
        <section id="conclusiones" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Conclusiones y recomendaciones editoriales</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Por <strong>red efectivamente desplegada</strong> (prefijos originados y peering), el orden es:{' '}
              <strong>Hostname.cl (23 prefijos, PIT Chile) · PowerHost (15 prefijos, PIT Chile + 9 IXP
              internacionales) · Linets (10) · EcoHosting (6) · Hosting.cl (5) · Gigas Chile (3) · BlueHosting (3)</strong>.
              HostingPlus tiene ASN asignado pero <strong>0 prefijos IPv4 originados</strong>. Con ASN propio menor:
              BlueHosting e iHosting; el ASN de HostingNet (AS272144) figura{' '}
              <strong>inactivo desde mayo de 2024</strong>. <strong>Sin ASN propio</strong>: PlanetaHosting,
              SolucionHost, WebHosting.cl, Microhost, Cinetic y Sered Chile.
            </p>
            <p>
              Aclaración: <strong>Hostname y Hosting.cl son entidades distintas</strong>, con distinto RUT y
              distinto ASN.
            </p>
            <p>
              Para un <strong>departamento TI corporativo</strong>, el criterio de red propia favorece a PowerHost y
              Hostname.cl. Para <strong>microemprendedores</strong>, EcoHosting y BlueHosting combinan precio de
              entrada bajo con documento tributario chileno. Para quienes <strong>solo miran el precio inicial</strong>,
              Hostinger es el más bajo, con las advertencias de prepago a 48 meses, renovación a USD 10,99/mes, DC en
              São Paulo y ausencia de DTE chileno.
            </p>
            <p className="text-sm">{COMMERCIAL_DISCLOSURE}</p>
          </div>
        </section>

        {/* 8. FUENTES */}
        <section id="fuentes" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">8. Anexo: fuentes consultadas</h2>

          {(Object.entries(SOURCES) as [keyof typeof SOURCES, typeof SOURCES.tech][]).map(([key, items]) => (
            <div key={key} className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                {key === 'tech'
                  ? 'Fuentes técnicas (ASN, BGP, peering)'
                  : key === 'reputation'
                  ? 'Reputación y reclamos'
                  : 'Registros corporativos'}
              </h3>
              <ul className="space-y-2 text-sm">
                {items.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {s.label} <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="text-sm text-muted-foreground mt-6">
            El anexo del PDF incluye enlaces específicos a reclamos y fichas corporativas.{' '}
            <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Descargar PDF completo
            </a>
            .
          </p>
        </section>

        {/* FOOTER DEL ARTÍCULO */}
        <footer className="mt-16 pt-8 border-t">
          <div className="flex items-start gap-3 p-5 bg-muted/40 rounded-lg">
            <FileText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">Sobre este informe.</strong> Elaborado por el equipo editorial de
                EligeTuHosting sobre fuentes públicas listadas en el Anexo. Las afirmaciones técnicas (ASN, prefijos,
                peering) provienen de LACNIC RDAP, RIPEstat, PeeringDB y bgp.tools; las corporativas, de registros
                públicos y NIC Chile.
              </p>
              <p>{COMMERCIAL_DISCLOSURE}</p>
              <p>
                {PRICING_FOOTNOTE} Datos revisados el {VERIFICATION_DATE_HUMAN}. La inclusión de un proveedor no
                implica recomendación comercial. Versión {VERSION}.
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
