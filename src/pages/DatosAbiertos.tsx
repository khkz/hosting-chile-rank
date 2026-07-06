import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Download, FileJson, FileText, ExternalLink } from 'lucide-react';

const ENDPOINTS = [
  { path: '/data/proveedores-latam.json', title: 'LATAM unificado', desc: '168 proveedores (Chile + Perú + México + Colombia + Argentina) con datos verificables.' },
  { path: '/data/proveedores-cl.json', title: 'Chile', desc: 'Directorio verificado de proveedores con presencia en Chile.' },
  { path: '/data/proveedores-pe.json', title: 'Perú', desc: 'Proveedores con operaciones o dominio .pe verificado.' },
  { path: '/data/proveedores-mx.json', title: 'México', desc: 'Proveedores con RFC / entidad legal / .mx verificado.' },
  { path: '/data/proveedores-co.json', title: 'Colombia', desc: 'Proveedores con NIT / entidad legal / .co verificado.' },
  { path: '/data/proveedores-ar.json', title: 'Argentina', desc: 'Proveedores con CUIT / entidad legal / .com.ar verificado.' },
  { path: '/data/benchmarks-pe.json', title: 'Benchmarks Perú', desc: 'TTFB y uptime observados de los proveedores PE en los últimos 7 días.' },
  { path: '/data/benchmarks-mx.json', title: 'Benchmarks México', desc: 'TTFB y uptime observados de los proveedores MX.' },
  { path: '/data/benchmarks-co.json', title: 'Benchmarks Colombia', desc: 'TTFB y uptime observados de los proveedores CO.' },
  { path: '/data/benchmarks-ar.json', title: 'Benchmarks Argentina', desc: 'TTFB y uptime observados de los proveedores AR.' },
];

const MARKDOWN = [
  { path: '/pe.md', title: 'Perú (Markdown)' },
  { path: '/mx.md', title: 'México (Markdown)' },
  { path: '/co.md', title: 'Colombia (Markdown)' },
  { path: '/ar.md', title: 'Argentina (Markdown)' },
  { path: '/llms.txt', title: 'llms.txt (index para IA)' },
  { path: '/llms-full.txt', title: 'llms-full.txt (dataset extendido)' },
];

const DatosAbiertos = () => {
  const canonical = 'https://eligetuhosting.com/datos';
  const title = 'Datos abiertos de hosting (LATAM) · CC-BY-4.0 | EligeTuHosting';
  const description = 'Endpoints JSON abiertos con proveedores, verificaciones técnicas y benchmarks de hosting en Chile, Perú, México, Colombia y Argentina. Licencia CC-BY-4.0.';
  const generatedAt = new Date().toISOString();

  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Directorio de hosting LATAM',
    description,
    url: canonical,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'EligeTuHosting', url: 'https://eligetuhosting.com/' },
    distribution: ENDPOINTS.map(e => ({
      '@type': 'DataDownload',
      encodingFormat: e.path.endsWith('.json') ? 'application/json' : 'text/markdown',
      contentUrl: `https://eligetuhosting.com${e.path}`,
      name: e.title,
    })),
    dateModified: generatedAt,
  };

  return (
    <>
      <Helmet>
        <html lang="es" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:locale" content="es_419" />
        <meta property="og:image" content="https://eligetuhosting.com/og/datos.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://eligetuhosting.com/og/datos.png" />
        <script type="application/ld+json">{JSON.stringify(datasetLd)}</script>
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-emerald-800 to-emerald-600 text-white py-14">
          <div className="container mx-auto px-4">
            <Badge className="bg-white/20 text-white border-white/30 mb-3">
              <Database className="w-4 h-4 mr-1" /> Datos abiertos
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Datos abiertos de hosting en LATAM</h1>
            <p className="text-lg text-white/90 max-w-3xl">
              Todos los endpoints JSON que usamos para publicar rankings, comparativas y benchmarks
              están disponibles bajo licencia <strong>Creative Commons Atribución 4.0 (CC-BY-4.0)</strong>.
              Podés usarlos en tu medio, dashboard o modelo de IA.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileJson className="w-5 h-5" /> Endpoints JSON
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {ENDPOINTS.map(e => (
                <Card key={e.path}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{e.title}</h3>
                        <code className="text-xs text-gray-500 break-all">https://eligetuhosting.com{e.path}</code>
                        <p className="text-sm text-gray-700 mt-2">{e.desc}</p>
                      </div>
                      <a href={e.path} className="shrink-0 inline-flex items-center gap-1 text-blue-700 hover:underline text-sm">
                        <Download className="w-4 h-4" /> Abrir
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Markdown para agentes de IA
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              {MARKDOWN.map(m => (
                <a key={m.path} href={m.path} className="block bg-white border rounded p-3 hover:border-blue-500">
                  <div className="font-medium">{m.title}</div>
                  <code className="text-xs text-gray-500">{m.path}</code>
                </a>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-5 space-y-3 text-sm text-gray-700">
              <h2 className="text-xl font-bold text-gray-900">Licencia y atribución</h2>
              <p>
                Todos los archivos listados en esta página se publican bajo la licencia
                <a href="https://creativecommons.org/licenses/by/4.0/deed.es" target="_blank" rel="noopener" className="text-blue-700 hover:underline mx-1 inline-flex items-center gap-1">
                  Creative Commons Atribución 4.0 Internacional (CC-BY-4.0) <ExternalLink className="w-3 h-3" />
                </a>. Podés copiar, redistribuir, remezclar, transformar y construir a partir del material para cualquier propósito, incluso comercialmente, siempre que:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Cites <strong>EligeTuHosting</strong> como fuente.</li>
                <li>Enlaces a <a className="text-blue-700 hover:underline" href="https://eligetuhosting.com/">https://eligetuhosting.com/</a>.</li>
                <li>Indiques si hiciste cambios sobre los datos.</li>
              </ul>
              <h3 className="font-semibold text-gray-900 mt-3">Cómo citar</h3>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto"><code>{`EligeTuHosting (${new Date().getFullYear()}). Directorio de hosting LATAM [Dataset].
Recuperado de https://eligetuhosting.com/datos — CC-BY-4.0.`}</code></pre>
              <p className="text-xs text-gray-500">Fecha de generación de esta página: {generatedAt}</p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/latam" className="text-blue-700 hover:underline">← Volver al hub LATAM</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DatosAbiertos;
