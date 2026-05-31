import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Server, Database, Search, Mail, CheckCircle2, BookOpen } from 'lucide-react';

const SobreNosotros: React.FC = () => {
  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre nosotros', href: '/sobre-nosotros' },
  ];

  const expertise = [
    {
      icon: Server,
      title: 'Administración de servidores Linux',
      detail:
        'Operación de cPanel/WHM, Plesk, NGINX, Apache y stacks LAMP/LEMP en proveedores chilenos e internacionales.',
    },
    {
      icon: Shield,
      title: 'Seguridad web y hardening',
      detail:
        'Configuración de WAF (ModSecurity, BitNinja), Imunify360, parcheo virtual de CVEs, mitigación DDoS y respuesta a incidentes en WordPress y cPanel.',
    },
    {
      icon: Database,
      title: 'Benchmarking y monitoreo',
      detail:
        'Diseño del pipeline propio de uptime y velocidad (uptime_pings y benchmark_results) que alimenta el ranking, con verificación reproducible.',
    },
    {
      icon: Search,
      title: 'OSINT y verificación de proveedores',
      detail:
        'Cruce de datos públicos (NIC Chile, registros mercantiles, redes sociales, reclamos) para validar la trayectoria real de cada empresa antes de listarla.',
    },
  ];

  const principios = [
    'Solo listamos proveedores verificados y curados manualmente.',
    'Las cifras de uptime y velocidad provienen únicamente de nuestros propios benchmarks; nunca inventamos datos.',
    'No publicamos badges falsos ni testimonios fabricados.',
    'Declaramos los enlaces de afiliado y nunca alteran el orden del ranking.',
    'Las guías indican fecha de última revisión y se actualizan cuando cambian las condiciones del mercado.',
  ];

  return (
    <>
      <Helmet>
        <title>Sobre nosotros — Equipo Editorial | EligeTuHosting.cl</title>
        <meta
          name="description"
          content="Conoce al Equipo Editorial de EligeTuHosting: experiencia en sysadmin cPanel, seguridad WAF, benchmarking de hosting y verificación OSINT de proveedores en Chile."
        />
        <link rel="canonical" href="https://eligetuhosting.cl/sobre-nosotros" />
        <meta property="og:title" content="Sobre nosotros — Equipo Editorial de EligeTuHosting" />
        <meta
          property="og:description"
          content="Quiénes escriben las guías, qué experiencia técnica respalda nuestras recomendaciones y cómo verificamos cada proveedor de hosting en Chile."
        />
        <meta property="og:url" content="https://eligetuhosting.cl/sobre-nosotros" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            url: 'https://eligetuhosting.cl/sobre-nosotros',
            name: 'Sobre nosotros — EligeTuHosting',
            description:
              'Equipo Editorial de EligeTuHosting: experiencia técnica, metodología y principios para evaluar hosting en Chile.',
            mainEntity: {
              '@type': 'Organization',
              name: 'EligeTuHosting',
              url: 'https://eligetuhosting.cl',
              areaServed: 'Chile',
              email: 'contacto@eligetuhosting.cl',
              knowsAbout: [
                'Hosting compartido',
                'VPS',
                'Servidores dedicados',
                'cPanel',
                'WordPress',
                'Seguridad web',
                'WAF',
                'BitNinja',
                'Imunify360',
                'Benchmarking de hosting',
              ],
              member: {
                '@type': 'OrganizationRole',
                roleName: 'Equipo Editorial',
                description:
                  'Profesionales con experiencia en administración de servidores Linux/cPanel, seguridad web, benchmarking y verificación OSINT de proveedores.',
              },
            },
          })}
        </script>
      </Helmet>
      <Navbar />
      <SEOBreadcrumbs items={breadcrumbItems} />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-10">
          <Badge variant="secondary" className="mb-4">Equipo Editorial</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Quiénes escriben las guías de EligeTuHosting
          </h1>
          <p className="text-lg text-muted-foreground">
            Somos un equipo editorial técnico, independiente, enfocado en evaluar proveedores de
            hosting en Chile. Nuestras guías combinan benchmarks verificables,
            datos públicos auditables y verificación OSINT de cada
            proveedor que listamos.
          </p>
        </header>

        <section className="mb-12" aria-labelledby="experiencia">
          <h2 id="experiencia" className="text-2xl md:text-3xl font-semibold mb-6">
            Experiencia técnica del equipo
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {expertise.map((e) => (
              <Card key={e.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <e.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    <CardTitle className="text-lg">{e.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{e.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12" aria-labelledby="principios">
          <h2 id="principios" className="text-2xl md:text-3xl font-semibold mb-6">
            Principios editoriales
          </h2>
          <ul className="space-y-3">
            {principios.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="metodologia">
          <h2 id="metodologia" className="text-2xl md:text-3xl font-semibold mb-6">
            Metodología y fuentes
          </h2>
          <p className="text-muted-foreground mb-4">
            Las recomendaciones del ranking y de las guías se basan en cuatro fuentes que puedes
            auditar:
          </p>
          <ul className="space-y-2 text-foreground">
            <li>
              <strong>Benchmarks propios:</strong> mediciones de uptime y velocidad ejecutadas
              por nuestra infraestructura. Detalle en{' '}
              <Link to="/metodologia-benchmark" className="text-primary underline">
                /metodologia-benchmark
              </Link>
              .
            </li>
            <li>
              <strong>Curación manual:</strong> solo aparecen empresas verificadas en{' '}
              <Link to="/metodologia" className="text-primary underline">
                /metodologia
              </Link>
              .
            </li>
            <li>
              <strong>Datos públicos:</strong> NIC Chile, registros mercantiles, repositorios de
              CVEs y documentación oficial de cPanel, BitNinja, Imunify360 y OWASP.
            </li>
            <li>
              <strong>Reputación verificada:</strong> reclamos públicos procesados por nuestro
              sistema de reputation_snapshots.
            </li>
          </ul>
        </section>

        <section className="mb-4" aria-labelledby="contacto">
          <h2 id="contacto" className="text-2xl md:text-3xl font-semibold mb-4">
            Contacto y correcciones
          </h2>
          <p className="text-muted-foreground mb-3">
            Si detectas un error en una guía, tienes evidencia que contradiga un dato o quieres
            proponer una corrección, escríbenos. Publicamos actualizaciones con fecha cuando la
            evidencia lo justifica.
          </p>
          <p className="inline-flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" aria-hidden="true" />
            <a href="mailto:contacto@eligetuhosting.cl" className="text-primary underline">
              contacto@eligetuhosting.cl
            </a>
          </p>
          <p className="mt-6 text-sm text-muted-foreground inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            Ver también:{' '}
            <Link to="/recursos-hosting-chile" className="text-primary underline">
              todas las guías
            </Link>{' '}
            ·{' '}
            <Link to="/acerca-de" className="text-primary underline">
              acerca de la organización
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SobreNosotros;
