import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReadingLayout from '@/components/reading/ReadingLayout';
import Migas from '@/components/lectura/Migas';

const TOC = [
  { id: 'por-que', label: 'Por qué existimos' },
  { id: 'quien', label: 'Quién está detrás' },
  { id: 'financiamiento', label: 'Cómo nos financiamos' },
  { id: 'verificamos', label: 'Cómo verificamos' },
  { id: 'contacto', label: 'Cómo contactarnos' },
];

const QuienesSomos: React.FC = () => {
  const canonical = 'https://eligetuhosting.com/quienes-somos';
  const ogImage = 'https://eligetuhosting.com/og/quienes-somos.png';
  const title = 'Quiénes somos — EligeTuHosting';
  const description =
    'Somos un equipo pequeño que evalúa hosting en Chile y LATAM con datos verificables. Sin puntajes inventados, sin equipos ficticios, con divulgación clara de cómo nos financiamos.';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <Navbar />
      <main>
        <ReadingLayout
          breadcrumbs={<Migas items={[{ name: 'Inicio', href: '/' }, { name: 'Quiénes somos' }]} />}
          title="Quiénes somos"
          lead={
            <>
              EligeTuHosting nació porque casi todas las "listas del mejor hosting" del mundo hispano estaban rellenas de
              puntajes inventados, testimonios falsos y rankings pagados. Nosotros hacemos lo contrario: solo publicamos lo
              que podemos probar.
            </>
          }
          toc={TOC}
        >
          <h2 id="por-que" className="scroll-mt-24">Por qué existimos</h2>
          <p>
            Cuando alguien busca "mejor hosting Chile" hoy, encuentra casi puro afiliado disfrazado de review. Nosotros
            queríamos un sitio que le sirviera de verdad a una PyME o a un desarrollador: qué proveedor es real, dónde está su
            datacenter, cómo responde su soporte y qué reclamos existen. Nada de eso requiere inventar cifras — requiere ir a
            mirar.
          </p>
          <p>
            Todo lo que publicamos viene de una de tres fuentes: benchmarks que corremos nosotros mismos, datos públicos (NIC
            Chile, WHOIS, ASN, registros mercantiles) o reclamos verificados. Cuando no tenemos evidencia, lo decimos.
          </p>

          <h2 id="quien" className="scroll-mt-24">Quién está detrás</h2>
          <p>
            Somos un equipo editorial pequeño con experiencia real administrando servidores Linux, cPanel/WHM, WordPress y
            stacks LAMP/LEMP, además de trabajo con WAFs (ModSecurity, BitNinja, Imunify360) y análisis OSINT. No vamos a
            inventar nombres ni fotos de "equipo" que no existe: preferimos mostrar la metodología y dejar que los datos hablen.
            Si necesitas hablar con una persona real, escríbenos.
          </p>
          <p>
            Ver también la <Link to="/metodologia">metodología completa</Link>.
          </p>

          <h2 id="financiamiento" className="scroll-mt-24">Cómo nos financiamos</h2>
          <p>
            Con comisiones de afiliado: si alguien contrata hosting a través de uno de nuestros enlaces, el proveedor nos paga
            una comisión. Además, el editor de este sitio mantiene relación comercial con algunos de los proveedores listados.
            No recibimos pagos por "subir" empresas en el ranking y no borramos reclamos a cambio de nada.
          </p>
          <p>
            Para que sea obvio: los enlaces afiliados están marcados y aparecen también proveedores con los que{' '}
            <strong>no</strong> tenemos relación comercial. El orden del ranking es editorial; los criterios y pesos que usamos
            están publicados en <Link to="/metodologia">/metodologia</Link> y en{' '}
            <Link to="/metodologia-benchmark">/metodologia-benchmark</Link>.
          </p>
          <p>
            Si un proveedor nos pidiera "arreglar" su posición, la respuesta sería la misma que hoy: que mejore su uptime y su
            soporte, y eso se verá en los datos que publicamos.
          </p>

          <h2 id="verificamos" className="scroll-mt-24">Cómo verificamos</h2>
          <ul>
            <li>
              <strong>Existencia real:</strong> razón social, RUT/RFC/NIT/CUIT, sitio oficial y WHOIS. Si no podemos confirmar
              la empresa, no la listamos.
            </li>
            <li>
              <strong>Datacenter:</strong> lo declaramos como "local" solo si la infraestructura está físicamente en el país; si
              el proveedor revende o opera desde afuera, lo decimos.
            </li>
            <li>
              <strong>Rendimiento:</strong> uptime y velocidad medidos por nuestros propios probes, guardados en{' '}
              <code>benchmark_results</code> y <code>uptime_pings</code>.
            </li>
            <li>
              <strong>Reputación:</strong> reclamos públicos procesados y datados. Los agregamos, no los inventamos.
            </li>
            <li>
              <strong>Datos abiertos:</strong> todo el dataset se publica bajo CC-BY-4.0 en <Link to="/datos">/datos</Link>.
              Cualquier periodista, IA o competidor puede auditarlo.
            </li>
          </ul>

          <h2 id="contacto" className="scroll-mt-24">Cómo contactarnos</h2>
          <p>
            Si encontraste un error, tienes evidencia que contradice algún dato o quieres proponer una corrección, escríbenos.
            Publicamos actualizaciones con fecha cuando la evidencia lo justifica.
          </p>
          <div className="not-prose rounded-xl border border-rule bg-paper p-5">
            <a
              href="mailto:contacto@eligetuhosting.cl"
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              <Mail className="h-5 w-5 text-ink-2" aria-hidden />
              contacto@eligetuhosting.cl
            </a>
            <p className="t-small mt-1 text-ink-2">Respondemos personas reales, no bots. Suele tomar 1–3 días hábiles.</p>
          </div>
        </ReadingLayout>
      </main>
      <Footer />
    </>
  );
};

export default QuienesSomos;
