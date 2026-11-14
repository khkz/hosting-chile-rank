import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DatasetSchema from '@/components/SEO/DatasetSchema';
import ReadingLayout from '@/components/reading/ReadingLayout';
import Callout from '@/components/system/Callout';
import Migas from '@/components/lectura/Migas';
import EstudioFichas, { EstudioTablaGeneral } from '@/components/estudio/EstudioFichas';
import EstudioAfiliados from '@/components/estudio/EstudioAfiliados';
import EstudioMapa from '@/components/estudio/EstudioMapa';
import EstudioPdf, { PDF_INFO, pdfShortLabel } from '@/components/estudio/EstudioPdf';
import { PROVIDERS, SOURCES } from '@/data/estudio2026';
import {
  COMMERCIAL_DISCLOSURE,
  PRICING_FOOTNOTE,
  VERIFICATION_DATE_HUMAN,
  VERIFICATION_DATE_ISO,
} from '@/data/verified2026';
import { formatDataDate, isoDate } from '@/lib/format';

const PDF_URL = '/docs/investigacion-hosting-chile-2026-final.pdf';
const PUBLISHED = '2026-05-28';
const VERSION = '3.1';

const TOC = [
  { id: 'resumen', label: '1. Resumen ejecutivo' },
  { id: 'metodologia', label: '2. Metodología y criterios' },
  { id: 'mapa', label: '3. Mapa del mercado' },
  { id: 'fichas', label: '4. Fichas de proveedores' },
  { id: 'tabla', label: '5. Tabla comparativa' },
  { id: 'alerta', label: '6. Comparadores con vínculo comercial' },
  { id: 'conclusiones', label: '7. Conclusiones' },
  { id: 'fuentes', label: '8. Fuentes consultadas' },
];

const SOURCE_GROUP: Record<keyof typeof SOURCES, string> = {
  tech: 'Fuentes técnicas (ASN, BGP, peering)',
  reputation: 'Reputación y reclamos',
  corporate: 'Registros corporativos',
};

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
    <div className="min-h-screen bg-white">
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

      <main>
        <ReadingLayout
          prose={false}
          breadcrumbs={
            <Migas
              items={[
                { name: 'Inicio', href: '/' },
                { name: 'Recursos', href: '/recursos-hosting-chile' },
                { name: 'Estudio Hosting Chile 2026' },
              ]}
            />
          }
          title="Estudio del Mercado de Hosting en Chile 2026"
          lead={
            <>
              Top 11 proveedores con ASN en LACNIC, razón social, precios anualizados en CLP y reputación pública. Incluye
              una revisión documentada de los principales <strong className="text-ink">comparadores con vínculo comercial</strong>{' '}
              que aparecen en Google.cl.
            </>
          }
          meta={
            <>
              <span>Estudio de mercado</span>
              <span>
                Página publicada el <time dateTime={isoDate(PUBLISHED)}>{formatDataDate(PUBLISHED)}</time>
              </span>
              <span>
                Datos revisados el <time dateTime={VERIFICATION_DATE_ISO}>{VERIFICATION_DATE_HUMAN}</time>
              </span>
              <span>Versión de la página: {VERSION}</span>
            </>
          }
          toc={TOC}
          aside={<EstudioPdf url={PDF_URL} pageProviders={PROVIDERS.length} />}
          footer={
            <section aria-labelledby="sobre-informe" className="rounded-xl border border-rule bg-paper p-5 md:p-6">
              <h2 id="sobre-informe" className="font-semibold text-ink">
                Sobre este informe
              </h2>
              <div className="t-small mt-2 max-w-[70ch] space-y-2 text-ink-2">
                <p>
                  Elaborado por el equipo editorial de EligeTuHosting sobre fuentes públicas listadas en el Anexo. Las
                  afirmaciones técnicas (ASN, prefijos, peering) provienen de LACNIC RDAP, RIPEstat, PeeringDB y bgp.tools;
                  las corporativas, de registros públicos y NIC Chile.
                </p>
                <p>{COMMERCIAL_DISCLOSURE}</p>
                <p>
                  {PRICING_FOOTNOTE} Datos revisados el {VERIFICATION_DATE_HUMAN}. La inclusión de un proveedor no implica
                  recomendación comercial. Versión de la página: {VERSION}.
                </p>
                <p>
                  ¿Eres un proveedor mencionado y quieres ejercer derecho a réplica?{' '}
                  <Link to="/contacto" className="font-semibold text-ink underline underline-offset-2">
                    Contáctanos
                  </Link>
                  .
                </p>
              </div>
            </section>
          }
        >
          <div className="space-y-14">
            <Callout tone="note" className="my-0">
              <p>{COMMERCIAL_DISCLOSURE}</p>
            </Callout>

            <section aria-labelledby="resumen" className="prose">
              <h2 id="resumen" className="scroll-mt-24">1. Resumen ejecutivo</h2>
              <p>
                El mercado chileno de hosting está fragmentado en cuatro capas. En la cima, empresas con{' '}
                <strong>ASN asignado en LACNIC</strong> e infraestructura en datacenters nacionales; de ellas, solo dos están
                efectivamente conectadas al <strong>PIT Chile</strong>. En el medio, hostings con marca pero sin red propia.
                En el extremo internacional, marcas globales (Hostinger, HostGator, DonWeb) que comercializan en Chile pero
                alojan en Brasil, EE.UU. o Argentina. Y debajo, decenas de revendedores que reempaquetan cPanel.
              </p>
              <p>
                Tener un ASN asignado no equivale a tener red desplegada: hay que mirar los{' '}
                <strong>prefijos efectivamente originados</strong> y los vecinos BGP. Los tres elementos que consideramos más
                informativos son: <strong>(a) prefijos originados y peering verificable</strong>,{' '}
                <strong>(b) razón social y RUT chileno</strong> con domicilio comercial y{' '}
                <strong>(c) canal de soporte nacional</strong>.
              </p>
              <div className="not-prose">
                <Callout tone="caution">
                  <p>
                    <strong className="text-ink">Hallazgo principal:</strong> varios de los «comparadores de hosting» que
                    ranquean en Google.cl mantienen <strong className="text-ink">vínculo comercial</strong> con los
                    proveedores que listan, mediante enlaces de afiliado que monetizan cada venta. Documentamos los casos de{' '}
                    <strong className="text-ink">comparahosting.cl</strong>, <strong className="text-ink">rankinghosting.cl</strong>{' '}
                    y <strong className="text-ink">mejorhosting.cl</strong> distinguiendo lo verificado de lo no demostrado.
                  </p>
                </Callout>
              </div>
            </section>

            <section aria-labelledby="metodologia" className="prose">
              <h2 id="metodologia" className="scroll-mt-24">2. Metodología y criterios</h2>
              <p>
                Para cada proveedor se cruzaron las siguientes fuentes públicas. Los pesos del puntaje compuesto se publican
                en <Link to="/metodologia">/metodologia</Link>.
              </p>
              <ul>
                <li><strong>Infraestructura técnica:</strong> LACNIC RDAP, RIPEstat (prefijos originados y vecinos BGP), PeeringDB (netixlan por ASN) y bgp.tools para el listado de miembros del PIT Santiago.</li>
                <li><strong>Datos corporativos:</strong> registros públicos y NIC Chile para razón social y RUT. Cuando el holder del ASN es una marca y no una sociedad, se indica así.</li>
                <li><strong>Planes y precios:</strong> inspección directa del sitio del proveedor, anualizando el plan de entrada e indicando si el valor es neto o con IVA.</li>
                <li><strong>Reputación:</strong> reclamos.cl, Trustpilot, HostAdvice y foros chilenos.</li>
                <li><strong>Comparadores:</strong> inspección de enlaces salientes y CTAs. No publicamos nombres de personas naturales obtenidos de WHOIS.</li>
              </ul>
              <p className="text-sm">{PRICING_FOOTNOTE}</p>
            </section>

            <EstudioMapa />

            <section aria-labelledby="fichas">
              <div className="prose">
                <h2 id="fichas" className="scroll-mt-24">4. Top 11 proveedores — fichas detalladas</h2>
                <p>
                  Este estudio cubre 11 proveedores; el ranking de portada muestra el Top 10 y no incluye a{' '}
                  <strong>DonWeb / Dattatec</strong>, que aquí se lista por su relevancia regional aunque aloja en Argentina.
                </p>
              </div>
              <div className="mt-6">
                <EstudioFichas />
              </div>
            </section>

            <section aria-labelledby="tabla">
              <div className="prose">
                <h2 id="tabla" className="scroll-mt-24">5. Tabla comparativa general</h2>
                <p>
                  Precios de entrada anualizados en CLP, observados el {VERIFICATION_DATE_HUMAN}. PowerHost aparece con su
                  catálogo VPS porque no comercializa hosting compartido, por lo que no es comparable en precio.
                </p>
              </div>
              <div className="mt-6">
                <EstudioTablaGeneral />
              </div>
            </section>

            <EstudioAfiliados />

            <section aria-labelledby="conclusiones" className="prose">
              <h2 id="conclusiones" className="scroll-mt-24">7. Conclusiones y recomendaciones editoriales</h2>
              <p>
                Por <strong>red efectivamente desplegada</strong> (prefijos originados y peering), el orden es:{' '}
                <strong>Hostname.cl (23 prefijos, PIT Chile) · PowerHost (15 prefijos, PIT Chile + 9 IXP
                internacionales) · Linets (10) · EcoHosting (6) · Hosting.cl (5) · Gigas Chile (3) · BlueHosting (3)</strong>.
                HostingPlus tiene ASN asignado pero <strong>0 prefijos IPv4 originados</strong>. Con ASN propio menor:
                BlueHosting e iHosting; el ASN de HostingNet (AS272144) figura <strong>inactivo desde mayo de 2024</strong>.{' '}
                <strong>Sin ASN propio</strong>: PlanetaHosting, SolucionHost, WebHosting.cl, Microhost, Cinetic y Sered Chile.
              </p>
              <p>
                Aclaración: <strong>Hostname y Hosting.cl son entidades distintas</strong>, con distinto RUT y distinto ASN.
              </p>
              <p>
                Para un <strong>departamento TI corporativo</strong>, el criterio de red propia favorece a PowerHost y
                Hostname.cl. Para <strong>microemprendedores</strong>, EcoHosting y BlueHosting combinan precio de entrada bajo
                con documento tributario chileno. Para quienes <strong>solo miran el precio inicial</strong>, Hostinger es el
                más bajo, con las advertencias de prepago a 48 meses, renovación a USD 10,99/mes, DC en São Paulo y ausencia de
                DTE chileno.
              </p>
              <p className="text-sm">{COMMERCIAL_DISCLOSURE}</p>
            </section>

            <section aria-labelledby="fuentes" className="prose">
              <h2 id="fuentes" className="scroll-mt-24">8. Anexo: fuentes consultadas</h2>
              {(Object.entries(SOURCES) as [keyof typeof SOURCES, (typeof SOURCES)['tech']][]).map(([key, items]) => (
                <React.Fragment key={key}>
                  <h3>{SOURCE_GROUP[key]}</h3>
                  <ul>
                    {items.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1">
                          {s.label}
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                </React.Fragment>
              ))}
              <p>
                El PDF detalla sus fuentes en la sección {PDF_INFO.sourcesSection}.{' '}
                <a href={PDF_URL} target="_blank" rel="noopener noreferrer">
                  Descargar el PDF completo ({pdfShortLabel})
                </a>
                .
              </p>
            </section>
          </div>
        </ReadingLayout>
      </main>

      <Footer />
    </div>
  );
};

export default EstudioHostingChile2026;
