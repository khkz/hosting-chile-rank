import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, DollarSign, Shield } from 'lucide-react';
import RelatedContent from '@/components/RelatedContent';

const HostingWordPressBlogPersonal = () => {
  return (
    <>
      <DynamicMetaTags
        title="Mejor Hosting WordPress para Blog Personal Chile 2025 | Desde $1.658/mes"
        description="Hosting WordPress optimizado para blogs personales en Chile. Comparativa de planes desde $1.658/mes con instalación 1-click, certificado SSL gratis y soporte en español."
        canonical="https://eligetuhosting.cl/hosting-wordpress-blog-personal-chile"
        keywords="hosting wordpress blog, hosting blog personal, wordpress chile, hosting barato wordpress"
      />
      
      <Navbar />
      
      <div className="container mx-auto px-4 pt-8">
        <SEOBreadcrumbs 
          items={[
            { name: 'Guías', href: '/guia-elegir-hosting' },
            { name: 'Hosting WordPress Blog Personal', href: '/hosting-wordpress-blog-personal-chile' }
          ]}
        />
      </div>
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Mejor Hosting WordPress para Blog Personal Chile 2025
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hosting optimizado para WordPress desde <strong className="text-primary">$1.658/mes</strong>. 
            Instalación en 1-click, SSL gratis y soporte en español 24/7.
          </p>
        </section>

        {/* Quick comparison */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Top 3 Hosting para Blog Personal</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-primary shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">HostingPlus</CardTitle>
                  <span className="text-2xl font-bold text-primary">★ 9.8</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">$1.658/mes</p>
                <p className="text-sm text-muted-foreground line-through">$3.990/mes</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>WordPress 1-click</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>SSL gratis incluido</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Backups diarios</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>10GB SSD NVMe</span>
                </div>
                <Button asChild className="w-full mt-4">
                  <a href="https://clientes.hostingplus.cl/cart.php?gid=13" target="_blank" rel="nofollow sponsored noopener noreferrer">
                    Probar gratis 30 días
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">EcoHosting</CardTitle>
                  <span className="text-2xl font-bold text-primary">★ 9.5</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">$2.490/mes</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>WordPress preinstalado</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Email ilimitado</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>5GB SSD</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Soporte WhatsApp</span>
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/catalogo/ecohosting">
                    Ver detalles
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Hostname</CardTitle>
                  <span className="text-2xl font-bold text-primary">★ 9.2</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">$1.990/mes</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Softaculous installer</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Panel cPanel</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>10GB espacio</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>99.9% uptime</span>
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/catalogo/hostname">
                    Ver detalles
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">¿Qué buscar en un hosting para blog personal?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Velocidad optimizada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  SSD NVMe + caché WordPress para cargas bajo 1 segundo. 
                  Fundamental para SEO y retener lectores.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Precio accesible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Planes desde $1.658/mes con todo incluido. 
                  Sin costos ocultos ni cargos por tráfico.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Seguridad incluida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  SSL gratis, backups automáticos y protección anti-malware. 
                  Tu contenido siempre protegido.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  Instalación fácil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  WordPress instalado en 1 click. 
                  Sin conocimientos técnicos, listo en 5 minutos.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Content */}
        <section className="mb-12">
          <RelatedContent currentPage="wordpress" />
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Preguntas frecuentes</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Cuánto cuesta el hosting para un blog personal?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Los planes para blogs personales en Chile van desde $1.658/mes hasta $5.000/mes. 
                  Para empezar, un plan básico de $2.000/mes es suficiente para 500-1000 visitas diarias.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Necesito conocimientos técnicos?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No. Los hostings modernos incluyen instalador 1-click para WordPress. 
                  En 5 minutos puedes tener tu blog funcionando sin tocar código.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Qué incluye el hosting?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Un buen plan incluye: WordPress preinstalado, certificado SSL gratis, 
                  backups automáticos, cuentas de email, cPanel y soporte técnico en español 24/7.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default HostingWordPressBlogPersonal;
