import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Search, 
  BarChart3, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Award,
  Database,
  ExternalLink,
  FileText
} from 'lucide-react';
import OpenDataBadge from '@/components/OpenDataBadge';

const NuestroMetodo = () => {
  return (
    <>
      <DynamicMetaTags
        title="Nuestra Metodología de Testing | EligeTuHosting.cl"
        description="Cómo evaluamos y rankeamos proveedores de hosting en Chile. Proceso 100% transparente con datos verificables de Reclamos.cl, uptime monitoring y speed tests."
        canonical="https://eligetuhosting.cl/nuestro-metodo"
        keywords="metodología hosting, evaluación hosting, testing hosting, ranking transparente"
      />
      
      <Navbar />
      
      <div className="container mx-auto px-4 pt-8">
        <SEOBreadcrumbs 
          items={[
            { name: 'Nuestra Metodología', href: '/nuestro-metodo' }
          ]}
        />
      </div>
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-semibold">100% Transparente</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Cómo Evaluamos el Hosting en Chile
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nuestro proceso de testing es completamente transparente y basado en datos verificables.
            No aceptamos pagos por posiciones en el ranking.
          </p>
        </section>

        {/* Process Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Proceso de Evaluación en 5 Pasos</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                icon: Search,
                title: "1. Investigación",
                description: "Identificamos proveedores activos en Chile con presencia verificable"
              },
              {
                icon: Database,
                title: "2. Recolección",
                description: "Extraemos datos de Reclamos.cl, uptime monitors y speed tests"
              },
              {
                icon: BarChart3,
                title: "3. Análisis",
                description: "Procesamos 20+ métricas de rendimiento, soporte y precio"
              },
              {
                icon: CheckCircle2,
                title: "4. Verificación",
                description: "Validamos cada dato con múltiples fuentes independientes"
              },
              {
                icon: TrendingUp,
                title: "5. Ranking",
                description: "Calculamos el score final con ponderación transparente"
              }
            ].map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <step.icon className="h-8 w-8 text-primary mb-3" />
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-16 bg-muted/30 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Fuentes de Datos Verificables</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Reclamos.cl
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Plataforma oficial del SERNAC para reclamos de consumidores en Chile
                </p>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-2">Qué extraemos:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Total de reclamos por empresa</li>
                    <li>• Tipo de reclamos (técnicos, facturación, soporte)</li>
                    <li>• Tendencia temporal (mejora/empeora)</li>
                    <li>• Respuesta de la empresa a reclamos</li>
                  </ul>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full gap-2">
                  <a href="https://www.reclamos.cl" target="_blank" rel="noopener noreferrer">
                    Visitar Reclamos.cl <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  UptimeRobot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Monitoreo 24/7 de disponibilidad desde servidores en Santiago y globales
                </p>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Qué medimos:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Uptime % último año</li>
                    <li>• Tiempo promedio de respuesta</li>
                    <li>• Incidentes y downtime total</li>
                    <li>• Tiempo de recuperación ante fallas</li>
                  </ul>
                </div>
                <div className="text-xs text-muted-foreground">
                  Checks cada 5 minutos desde 10+ ubicaciones
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  PageSpeed Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  API de Google para métricas de velocidad y Core Web Vitals
                </p>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-yellow-900 mb-2">Qué analizamos:</p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Tiempo First Contentful Paint (FCP)</li>
                    <li>• Largest Contentful Paint (LCP)</li>
                    <li>• Time to Interactive (TTI)</li>
                    <li>• Cumulative Layout Shift (CLS)</li>
                  </ul>
                </div>
                <div className="text-xs text-muted-foreground">
                  Tests desde Santiago, Chile cada semana
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Opiniones Verificadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Reviews de clientes reales con comprobante de compra
                </p>
                <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-2">Proceso de verificación:</p>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Comprobante de pago o email de confirmación</li>
                    <li>• Verificación de email del dominio</li>
                    <li>• Antigüedad mínima 30 días como cliente</li>
                    <li>• Moderación anti-fraude</li>
                  </ul>
                </div>
                <div className="text-xs text-muted-foreground">
                  Solo 1 review por cliente por empresa
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Scoring System */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Sistema de Puntuación</h2>
          <Card className="bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <CardTitle className="text-2xl">Ponderación de Factores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { factor: "Reputación (Reclamos.cl)", weight: 30, description: "Menor cantidad de reclamos = mayor puntaje" },
                  { factor: "Uptime & Disponibilidad", weight: 25, description: "99.9%+ es el estándar esperado" },
                  { factor: "Velocidad & Rendimiento", weight: 20, description: "Core Web Vitals y tiempo de carga" },
                  { factor: "Soporte & Documentación", weight: 15, description: "Respuesta < 2h y docs en español" },
                  { factor: "Precio & Valor", weight: 10, description: "Relación features/precio competitiva" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{item.factor}</span>
                        <span className="text-primary font-bold">{item.weight}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${item.weight}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Score Final:</strong> Promedio ponderado de todos los factores en escala 1-10.
                  Los proveedores con score bajo 7.0 no califican para el Top 10.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Open Data */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Dataset Público</h2>
          <OpenDataBadge />
        </section>

        {/* Trust Principles */}
        <section className="mb-16 bg-gradient-to-br from-green-50 to-background p-8 rounded-2xl border-2 border-green-200">
          <h2 className="text-3xl font-bold mb-6 text-center">Principios de Independencia</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Sin Conflictos</h3>
              <p className="text-sm text-muted-foreground">
                No aceptamos dinero por posiciones en el ranking. Los enlaces son afiliados transparentes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Datos Públicos</h3>
              <p className="text-sm text-muted-foreground">
                Todo nuestro dataset es público y descargable. Puedes verificar cada métrica.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Actualización Continua</h3>
              <p className="text-sm text-muted-foreground">
                Monitoreamos 24/7 y actualizamos el ranking mensualmente con datos frescos.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary text-primary-foreground p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">¿Listo para elegir con confianza?</h2>
          <p className="text-lg mb-6 opacity-90">
            Ve el ranking completo basado en esta metodología
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/ranking">
              Ver Ranking Completo
            </Link>
          </Button>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default NuestroMetodo;
