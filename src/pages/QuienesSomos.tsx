import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, HeartHandshake, ShieldCheck, Database, MessageSquare } from 'lucide-react';

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
        <meta property="og:image" content="https://eligetuhosting.cl/og/quienes-somos.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://eligetuhosting.cl/og/quienes-somos.png" />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-4">
            Quiénes somos
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            EligeTuHosting nació porque casi todas las "listas del mejor hosting" del
            mundo hispano estaban rellenas de puntajes inventados, testimonios falsos y
            rankings pagados. Nosotros hacemos lo contrario: solo publicamos lo que
            podemos probar.
          </p>
        </header>

        <section className="mb-10" aria-labelledby="por-que">
          <h2 id="por-que" className="text-2xl md:text-3xl font-semibold text-[#2B2D42] mb-4 inline-flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-primary" aria-hidden="true" />
            Por qué existimos
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Cuando alguien busca "mejor hosting Chile" hoy, encuentra casi puro afiliado
            disfrazado de review. Nosotros queríamos un sitio que le sirviera de verdad
            a una PyME o a un desarrollador: qué proveedor es real, dónde está su
            datacenter, cómo responde su soporte y qué reclamos existen. Nada de eso
            requiere inventar cifras — requiere ir a mirar.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Todo lo que publicamos viene de una de tres fuentes: benchmarks que corremos
            nosotros mismos, datos públicos (NIC Chile, WHOIS, ASN, registros mercantiles)
            o reclamos verificados. Cuando no tenemos evidencia, lo decimos.
          </p>
        </section>

        <section className="mb-10" aria-labelledby="quien">
          <h2 id="quien" className="text-2xl md:text-3xl font-semibold text-[#2B2D42] mb-4">
            Quién está detrás
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Somos un equipo editorial pequeño con experiencia real administrando
            servidores Linux, cPanel/WHM, WordPress y stacks LAMP/LEMP, además de
            trabajo con WAFs (ModSecurity, BitNinja, Imunify360) y análisis OSINT. No
            vamos a inventar nombres ni fotos de "equipo" que no existe: preferimos
            mostrar la metodología y dejar que los datos hablen. Si necesitas hablar con
            una persona real, escribinos.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Ver también nuestra{' '}
            <Link to="/sobre-nosotros" className="text-primary underline">
              descripción técnica del equipo editorial
            </Link>{' '}
            y la{' '}
            <Link to="/metodologia" className="text-primary underline">
              metodología completa
            </Link>
            .
          </p>
        </section>

        <section className="mb-10" aria-labelledby="financiamiento">
          <h2 id="financiamiento" className="text-2xl md:text-3xl font-semibold text-[#2B2D42] mb-4 inline-flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" aria-hidden="true" />
            Cómo nos financiamos
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Con comisiones de afiliado. Si alguien contrata hosting a través de uno de
            nuestros enlaces, el proveedor nos paga una comisión. Eso es todo. No
            recibimos plata por "subir" empresas en el ranking y no borramos reclamos a
            cambio de nada.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            Para que sea obvio: los enlaces afiliados están marcados y aparecen también
            proveedores con los que <strong>no</strong> tenemos relación comercial. El
            orden del ranking se calcula con los mismos pesos publicados en{' '}
            <Link to="/metodologia" className="text-primary underline">
              /metodologia
            </Link>{' '}
            y en{' '}
            <Link to="/metodologia-benchmark" className="text-primary underline">
              /metodologia-benchmark
            </Link>
            .
          </p>
          <p className="text-gray-700 leading-relaxed">
            Si un día un proveedor nos pidiera "arreglar" su posición, la respuesta
            sería la misma que hoy: mejorá el uptime, mejorá el soporte, y el ranking se
            va a mover solo.
          </p>
        </section>

        <section className="mb-10" aria-labelledby="verificamos">
          <h2 id="verificamos" className="text-2xl md:text-3xl font-semibold text-[#2B2D42] mb-4 inline-flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" aria-hidden="true" />
            Cómo verificamos
          </h2>
          <ul className="space-y-2 text-gray-700 leading-relaxed list-disc pl-6">
            <li>
              <strong>Existencia real:</strong> razón social, RUT/RFC/NIT/CUIT, sitio
              oficial y WHOIS. Si no podemos confirmar la empresa, no la listamos.
            </li>
            <li>
              <strong>Datacenter:</strong> lo declaramos como "local" solo si la
              infraestructura está físicamente en el país; si el proveedor revende o
              opera desde afuera, lo decimos.
            </li>
            <li>
              <strong>Rendimiento:</strong> uptime y velocidad medidos por nuestros
              propios probes, guardados en{' '}
              <code className="text-sm bg-gray-100 px-1 rounded">benchmark_results</code>{' '}
              y{' '}
              <code className="text-sm bg-gray-100 px-1 rounded">uptime_pings</code>.
            </li>
            <li>
              <strong>Reputación:</strong> reclamos públicos procesados y datados. Los
              agregamos, no los inventamos.
            </li>
            <li>
              <strong>Datos abiertos:</strong> todo el dataset se publica bajo CC-BY-4.0
              en{' '}
              <Link to="/datos" className="text-primary underline">
                /datos
              </Link>
              . Cualquier periodista, IA o competidor puede auditarlo.
            </li>
          </ul>
        </section>

        <section aria-labelledby="contacto">
          <h2 id="contacto" className="text-2xl md:text-3xl font-semibold text-[#2B2D42] mb-4 inline-flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" aria-hidden="true" />
            Cómo contactarnos
          </h2>
          <Card>
            <CardContent className="p-6 space-y-3 text-gray-700">
              <p>
                Si encontraste un error, tenés evidencia que contradice algún dato o
                querés proponer una corrección, escribinos. Publicamos actualizaciones
                con fecha cuando la evidencia lo justifica.
              </p>
              <p className="inline-flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" aria-hidden="true" />
                <a href="mailto:contacto@eligetuhosting.cl" className="text-primary underline">
                  contacto@eligetuhosting.cl
                </a>
              </p>
              <p className="text-sm text-gray-500">
                Respondemos personas reales, no bots. Suele tomar 1–3 días hábiles.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default QuienesSomos;
