import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Zap, Server, AlertTriangle, CheckCircle2, Eye, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SecurityRiskQuiz from '@/components/SecurityRiskQuiz';


const GuiaHostingMasSeguro = () => {
  const breadcrumbItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Guías', href: '/recursos-hosting-chile' },
    { name: 'Cómo elegir el hosting más seguro', href: '/guia-hosting-mas-seguro-chile' },
  ];

  const checklist = [
    { icon: Shield, title: 'WAF a nivel de servidor', detail: 'Web Application Firewall que filtra peticiones maliciosas antes de que lleguen a WordPress, Joomla o tu CMS.' },
    { icon: Eye, title: 'Escaneo de malware automático', detail: 'Detección y limpieza diaria de archivos infectados sin que tengas que intervenir.' },
    { icon: Lock, title: 'Aislamiento por cuenta', detail: 'Cada sitio corre en un entorno separado para que un hackeo no contamine al resto.' },
    { icon: FileWarning, title: 'Parcheo virtual de vulnerabilidades', detail: 'Bloqueo de exploits conocidos aunque tu plugin o tema todavía no esté actualizado.' },
    { icon: Server, title: 'Backups diarios fuera del servidor', detail: 'Copias automáticas, retenidas varios días y restaurables con un clic.' },
    { icon: Zap, title: 'Soporte 24/7 con acceso a sysadmin', detail: 'Que un humano pueda revisar logs, mitigar ataques y restaurar en minutos, no días.' },
  ];

  const capas = [
    {
      title: 'Capa 1 — Red e infraestructura',
      items: [
        'Firewall Enterprise perimetral con reglas anti-DDoS',
        'Filtrado de IPs maliciosas con feeds globales',
        'Segmentación de red entre servidores',
      ],
    },
    {
      title: 'Capa 2 — Servidor',
      items: [
        'BitNinja: WAF distribuido que aprende de millones de servidores y bloquea botnets en tiempo real',
        'Imunify360: detección de malware, parcheo virtual de CVEs y reputación de IPs',
        'ModSecurity con reglas OWASP CRS afinadas para CMS chilenos',
      ],
    },
    {
      title: 'Capa 3 — Aplicación / WordPress',
      items: [
        'Plugin de seguridad propio del proveedor con login protegido y 2FA',
        'Hardening automático de wp-config, xmlrpc y wp-login',
        'Escaneo programado de plugins y temas con CVE conocidas',
      ],
    },
    {
      title: 'Capa 4 — Datos y recuperación',
      items: [
        'Backups diarios con retención de 7 a 30 días',
        'Restauración granular (un archivo, una base, todo el sitio)',
        'Snapshots externos al servidor principal',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <DynamicMetaTags
        title="Cómo elegir el hosting más seguro en Chile 2026"
        description="Guía práctica para elegir un hosting seguro: WAF, BitNinja, Imunify360, firewall enterprise, parcheo de vulnerabilidades WordPress y cPanel. Checklist y comparativa."
        keywords="hosting seguro chile, hosting con waf, bitninja, imunify360, seguridad wordpress, seguridad cpanel, firewall hosting"
      />
      <Helmet>
        <link rel="canonical" href="https://eligetuhosting.cl/guia-hosting-mas-seguro-chile" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Cómo elegir el hosting más seguro en Chile',
            description:
              'Checklist técnico para evaluar la seguridad real de un proveedor de hosting: WAF, BitNinja, Imunify360, firewall enterprise y parcheo de vulnerabilidades.',
            author: { '@type': 'Organization', name: 'EligeTuHosting.cl' },
            publisher: { '@type': 'Organization', name: 'EligeTuHosting.cl' },
            datePublished: '2026-05-15',
            mainEntityOfPage: 'https://eligetuhosting.cl/guia-hosting-mas-seguro-chile',
          })}
        </script>
      </Helmet>

      <Navbar />
      <SEOBreadcrumbs items={breadcrumbItems} />

      <main className="flex-grow container mx-auto px-4 py-10 max-w-4xl">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm mb-4">
            <AlertTriangle className="w-4 h-4" />
            Mitos publica vulnerabilidades nuevas todas las semanas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cómo elegir el hosting más seguro para tu sitio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guía técnica y honesta para elegir un proveedor que realmente te proteja: WAF, BitNinja,
            Imunify360, firewall enterprise y parcheo de vulnerabilidades de WordPress y cPanel.
          </p>
        </header>

        {/* Por qué importa */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Por qué la seguridad del hosting importa más que nunca</h2>
          <p className="text-muted-foreground mb-3">
            Plataformas como Mitos.cl publican constantemente nuevas vulnerabilidades y los atacantes
            automatizan su explotación en cuestión de horas. La mayoría de los sitios en Chile corre
            sobre WordPress, Joomla o aplicaciones PHP en cPanel, los blancos más buscados por bots.
          </p>
          <p className="text-muted-foreground">
            Tu hosting es la primera línea de defensa: si filtra el ataque antes de que toque tu CMS,
            no importa que tengas un plugin desactualizado. Si no lo filtra, un solo CVE público
            puede tumbarte.
          </p>
        </section>

        {/* Checklist */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Checklist: lo que un hosting seguro debe ofrecer</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {checklist.map(({ icon: Icon, title, detail }) => (
              <Card key={title} className="border-primary/10">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base leading-snug">{title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quiz interactivo */}
        <section id="quiz" className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Test: ¿qué tan en riesgo está tu sitio?</h2>
          <p className="text-muted-foreground mb-6">
            10 preguntas rápidas para calcular tu nivel de riesgo y ver qué funciones de seguridad
            necesitas exigirle a tu hosting.
          </p>
          <SecurityRiskQuiz />
        </section>

        {/* Capas */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Las 4 capas de seguridad que debes exigir</h2>
          <div className="space-y-4">
            {capas.map((c) => (
              <div key={c.title} className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold mb-3">{c.title}</h3>
                <ul className="space-y-2">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* WordPress + cPanel */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Seguridad específica para WordPress y cPanel</h2>
          <p className="text-muted-foreground mb-3">
            La mayoría de los hackeos en Chile entran por tres puertas: plugins de WordPress
            desactualizados, contraseñas débiles en cPanel y formularios sin validación. Un buen
            hosting cierra las tres por defecto:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Bloqueo de fuerza bruta en wp-login y en cPanel después de N intentos fallidos.</li>
            <li>Doble factor obligatorio en el panel del cliente.</li>
            <li>Escaneo de archivos PHP con firmas y heurística (Imunify AV+).</li>
            <li>Aviso proactivo cuando un plugin queda con CVE pública.</li>
          </ul>
        </section>

        {/* Caso destacado */}
        <section className="mb-12">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle>Caso destacado: HostingPlus</CardTitle>
              <CardDescription>
                Es el proveedor del ranking que hoy combina las cuatro capas con tecnologías
                comerciales reconocidas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span><strong>BitNinja</strong> como WAF distribuido + reputación global de IPs.</span>
              </div>
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span><strong>Imunify360</strong> con escaneo de malware, parcheo virtual y limpieza automática.</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span><strong>Firewall Enterprise</strong> perimetral con mitigación DDoS.</span>
              </div>
              <div className="flex items-start gap-2">
                <Server className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span><strong>Plugin propio de seguridad</strong> y hardening automático de WordPress.</span>
              </div>

              <Alert className="mt-4 bg-background">
                <AlertDescription className="text-xs text-muted-foreground">
                  Esta evaluación se basa en la curaduría pública de proveedores verificados del
                  ranking. No es un patrocinio: cualquier proveedor que cumpla las cuatro capas
                  recibe la misma consideración.
                </AlertDescription>
              </Alert>

              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href="https://www.hostingplus.cl/hosting/?utm_source=eligetuhosting&utm_medium=guia&utm_campaign=hosting-seguro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>Ver planes con seguridad incluida</Button>
                </a>
                <Link to="/mejor-hosting-chile-2026">
                  <Button variant="outline">Ver el ranking completo</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Preguntas para hacerle al proveedor */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7 preguntas para hacerle a tu hosting actual</h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>¿Tienen WAF a nivel de servidor o solo confían en plugins del CMS?</li>
            <li>¿Usan Imunify360, BitNinja u otra solución comercial reconocida?</li>
            <li>¿Cada cuánto escanean malware y cómo me avisan?</li>
            <li>¿Hacen parcheo virtual de CVEs mientras yo actualizo?</li>
            <li>¿Cuántos días de backup retienen y dónde los guardan?</li>
            <li>¿Cuál es el SLA de respuesta ante un hackeo confirmado?</li>
            <li>¿Aíslan mi cuenta de los demás clientes del servidor?</li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes</h2>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="faq-waf" className="bg-card border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium text-base">
                ¿Qué es un WAF y por qué debería exigirlo del hosting?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                Un WAF (Web Application Firewall) filtra y monitorea el tráfico HTTP antes de que llegue a tu sitio. Bloquea inyecciones SQL, XSS, bots maliciosos y exploits contra plugins desactualizados. Un WAF a nivel de servidor protege todo el entorno de hosting, no solo una instalación de WordPress, y reduce drásticamente la ventana de ataque cuando Mitos u otros publican un CVE.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-backups" className="bg-card border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium text-base">
                ¿Son suficientes los backups del hosting o debo hacer los míos?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                Los backups del hosting son la primera línea, pero nunca deben ser la única. Exige al menos 7 a 30 días de retención, almacenamiento fuera del servidor principal y restauración granular (archivo, base de datos o sitio completo). Para proyectos críticos, complementa con tu propio backup remoto (por ejemplo, con plugins de WordPress a S3) como política de redundancia.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-parcheo" className="bg-card border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium text-base">
                ¿Cómo funciona el parcheo virtual si mi plugin todavía no tiene actualización?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                El parcheo virtual (también llamado virtual patching) crea una regla del WAF que bloquea la petición maliciosa conocida sin modificar el código del plugin. Es una medida temporal: te da tiempo para actualizar el plugin cuando el desarrollador publique el fix oficial, evitando que tu sitio sea hackeado en las primeras 24-48 horas después de la divulgación del CVE. Imunify360 y algunos WAF avanzados implementan esto automáticamente.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-wordpress" className="bg-card border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium text-base">
                Mi sitio usa WordPress y cPanel: ¿qué debo exigir al hosting?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                Específicamente para WordPress: bloqueo de fuerza bruta en wp-login y xmlrpc, hardening automático de wp-config, escaneo de plugins con CVEs conocidas y alerta proactiva de actualizaciones críticas. Para cPanel: 2FA obligatorio, aislamiento por cuenta (CageFS), protección de fuerza bruta en el panel y monitoreo de archivos PHP subidos. Un hosting que combine ambas capas reduce el riesgo real de hackeo en más del 90%.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Relacionados */}
        <section className="mb-4">
          <h2 className="text-2xl font-bold mb-4">Sigue aprendiendo</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/guia-seguridad-web" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Guía de seguridad web</CardTitle>
                  <CardDescription>Buenas prácticas más allá del hosting.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/guia-elegir-ssl" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Cómo elegir SSL</CardTitle>
                  <CardDescription>HTTPS sin sorpresas.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/mejor-hosting-wordpress-chile" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Mejor hosting WordPress</CardTitle>
                  <CardDescription>Ranking enfocado en WP.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GuiaHostingMasSeguro;
