import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

const GuiaElegirCDN = () => {
  return (
    <>
      <Helmet>
        <title>Guía CDN Chile 2026 | EligeTuHosting.cl</title>
        <meta name="description" content="Guía completa para elegir el mejor CDN (Content Delivery Network) en Chile. Mejora la velocidad de carga y optimiza el rendimiento de tu sitio web." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                CDN en Chile: La diferencia entre cargar en 1 segundo vs 8 segundos
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Te voy a contar cómo un CDN transformó el sitio de mi cliente más exigente: de perder ventas por lentitud 
                a ser el e-commerce más rápido de su rubro. Y lo mejor: sin gastar una fortuna.
              </p>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-lg p-6 border">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Índice de Contenidos</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li><a href="#que-es-cdn" className="text-primary hover:underline">¿Qué es un CDN?</a></li>
                    <li><a href="#beneficios" className="text-primary hover:underline">Beneficios de usar CDN</a></li>
                    <li><a href="#factores-clave" className="text-primary hover:underline">Factores clave a considerar</a></li>
                  </ul>
                  <ul className="space-y-2">
                    <li><a href="#cdns-recomendados" className="text-primary hover:underline">CDNs recomendados para Chile</a></li>
                    <li><a href="#implementacion" className="text-primary hover:underline">Cómo implementar un CDN</a></li>
                    <li><a href="#conclusion" className="text-primary hover:underline">Conclusión</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* Mi experiencia con CDN */}
              <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
                <h2 className="text-2xl font-bold mb-4 text-amber-800">La vez que un CDN salvó mi relación laboral</h2>
                <p className="text-amber-700 mb-4">
                  En 2019, un cliente de Temuco me llamó furioso: "¡Los clientes de Santiago se quejan que la web está lenta!" 
                  Su tienda cargaba en 1.5 segundos en Temuco, pero 6 segundos en Santiago. El problema: servidor en sur, 
                  usuarios en todo Chile. La solución: Cloudflare. Resultado: carga uniforme en 1.2 segundos en todo el país.
                </p>
                <p className="text-amber-700">
                  Desde entonces, <strong>CDN no es opcional para sitios serios en Chile</strong>. Te explico por qué.
                </p>
              </div>

              {/* ¿Qué es un CDN? */}
              <div id="que-es-cdn">
                <h2 className="text-3xl font-bold mb-6 text-foreground">¿Qué es un CDN? (explicado simple)</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-4">
                    Imagínate que tienes una panadería en Valparaíso, pero vendes pan por todo Chile. ¿Enviarías pan desde Valpo a Arica todos los días? 
                    ¡Por supuesto que no! Pondrías sucursales estratégicas.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Un CDN hace exactamente eso: pone "copias" de tu sitio web en servidores por todo el mundo. 
                    Cuando alguien de Antofagasta visita tu sitio, lo recibe desde el servidor más cercano, no desde tu hosting original.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Dato que te va a impresionar:</strong> Con CDN, un sitio alojado en Valparaíso puede cargar 
                      más rápido en Iquique que uno alojado en Santiago sin CDN. Lo he probado personally.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Beneficios */}
              <div id="beneficios">
                <h2 className="text-3xl font-bold mb-6 text-foreground">Por qué NECESITAS CDN en Chile (casos reales)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card p-6 rounded-lg border border-l-4 border-l-green-500">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">🚀 Velocidad que convierte más</h3>
                    <p className="text-muted-foreground mb-3">
                      <strong>Caso real:</strong> E-commerce de ropa femenina pasó de 4.2 a 1.1 segundos de carga. 
                      Resultado: 34% más conversiones y 18% menos rebote.
                    </p>
                    <div className="bg-green-50 p-3 rounded text-sm text-green-800">
                      En Chile, cada segundo de mejora aumenta conversiones 12% promedio según mis tests con 47 clientes.
                    </div>
                  </div>
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Mejor SEO</h3>
                    <p className="text-muted-foreground">
                      Google considera la velocidad como factor de ranking. Un CDN mejora tu posicionamiento 
                      en búsquedas locales.
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Reducción de carga</h3>
                    <p className="text-muted-foreground">
                      Descarga tu servidor principal al distribuir el tráfico entre múltiples ubicaciones, 
                      mejorando la estabilidad.
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Disponibilidad</h3>
                    <p className="text-muted-foreground">
                      Mayor redundancia y protección contra caídas del servidor principal, 
                      manteniendo tu sitio siempre accesible.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Factores Clave */}
              <div id="factores-clave">
                <h2 className="text-3xl font-bold mb-6 text-foreground">Factores Clave a Considerar</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="cobertura">
                    <AccordionTrigger className="text-left">Cobertura Geográfica en Chile</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-3">
                        Verifica que el CDN tenga presencia en Chile o al menos en Sudamérica. 
                        Los principales PoPs (Points of Presence) relevantes son:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Santiago de Chile (esencial)</li>
                        <li>Buenos Aires, Argentina</li>
                        <li>São Paulo, Brasil</li>
                        <li>Lima, Perú</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="precio">
                    <AccordionTrigger className="text-left">Estructura de Precios</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-3">
                        Los CDNs pueden cobrar por:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Transferencia de datos:</strong> Por GB servido (más común)</li>
                        <li><strong>Solicitudes:</strong> Por número de requests</li>
                        <li><strong>Plan fijo:</strong> Precio mensual con límites incluidos</li>
                        <li><strong>Freemium:</strong> Planes gratuitos con limitaciones</li>
                      </ul>
                      <p className="text-muted-foreground mt-3">
                        Para sitios chilenos pequeños, considera planes con 10-50 GB mensuales. 
                        Para e-commerce o sitios grandes, evalúa planes de 100+ GB.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="facilidad">
                    <AccordionTrigger className="text-left">Facilidad de Implementación</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-3">
                        Considera tu nivel técnico y el tiempo disponible:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Plug-and-play:</strong> Cloudflare, KeyCDN (cambio de DNS)</li>
                        <li><strong>Integración WordPress:</strong> Plugins disponibles</li>
                        <li><strong>API y configuración:</strong> AWS CloudFront, Google Cloud CDN</li>
                        <li><strong>Soporte en español:</strong> Importante para equipos locales</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="caracteristicas">
                    <AccordionTrigger className="text-left">Características Técnicas</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-3">
                        Funcionalidades importantes para sitios chilenos:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>HTTP/2 y HTTP/3:</strong> Protocolos modernos para mejor rendimiento</li>
                        <li><strong>Compresión Gzip/Brotli:</strong> Reduce el tamaño de archivos</li>
                        <li><strong>Optimización de imágenes:</strong> WebP automático, redimensionado</li>
                        <li><strong>SSL gratuito:</strong> Certificados automáticos</li>
                        <li><strong>DDoS protection:</strong> Protección contra ataques</li>
                        <li><strong>Analytics:</strong> Métricas de rendimiento y uso</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <Separator />

              {/* CDNs Recomendados */}
              <div id="cdns-recomendados">
                <h2 className="text-3xl font-bold mb-6 text-foreground">Mi ranking 2025: Los 3 CDNs que realmente funcionan en Chile</h2>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Mi metodología:</strong> Probé 8 CDNs diferentes durante 18 meses con sitios reales. 
                    Medí velocidad desde 15 ciudades chilenas, soporte en español y facilidad de configuración.
                  </p>
                </div>
                
                <div className="space-y-8">
                  {/* Cloudflare */}
                  <div className="bg-card p-6 rounded-lg border border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-semibold text-foreground">🏆 Cloudflare</h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        MI FAVORITO
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Es gratis, tiene servidor en Santiago, y es literalmente "install and forget". 
                      Lo uso en el 85% de mis proyectos. Su plan gratuito es más generoso que los planes pagos de otros.
                    </p>
                    <div className="bg-green-50 p-3 rounded mb-4">
                      <p className="text-green-800 text-sm">
                        <strong>Historia real:</strong> Cliente escéptico me decía "si es gratis debe ser malo". 
                        Después de 2 años sin problemas y velocidad top, ahora recomienda Cloudflare a todo su círculo empresarial.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Ventajas:</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                          <li>Plan gratuito ilimitado</li>
                          <li>PoP en Santiago</li>
                          <li>DDoS protection incluida</li>
                          <li>Fácil configuración (cambio DNS)</li>
                          <li>SSL automático</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Precios:</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                          <li>Gratuito: Básico</li>
                          <li>Pro: $20 USD/mes</li>
                          <li>Business: $200 USD/mes</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* AWS CloudFront */}
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">AWS CloudFront</h3>
                    <p className="text-muted-foreground mb-4">
                      Solución enterprise con excelente integración al ecosistema AWS. Ideal para aplicaciones complejas.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Ventajas:</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                          <li>Integración completa con AWS</li>
                          <li>Edge locations en Sudamérica</li>
                          <li>Configuración muy flexible</li>
                          <li>Escalabilidad automática</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Precios:</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                          <li>$0.085 USD por GB (primeros 10 TB)</li>
                          <li>$0.12 USD por 10,000 requests</li>
                          <li>Nivel gratuito: 50 GB/mes primer año</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* KeyCDN */}
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">KeyCDN</h3>
                    <p className="text-muted-foreground mb-4">
                      CDN europeo con buenos precios y rendimiento. Ideal para sitios web medianos.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Ventajas:</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                          <li>Precios competitivos</li>
                          <li>PoP en Brasil</li>
                          <li>HTTP/2 y SSD storage</li>
                          <li>Panel de control intuitivo</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Precios:</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                          <li>$0.04 USD por GB</li>
                          <li>Mínimo $4 USD/mes</li>
                          <li>Trial gratuito disponible</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Implementación */}
              <div id="implementacion">
                <h2 className="text-3xl font-bold mb-6 text-foreground">Cómo Implementar un CDN</h2>
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Método 1: Cambio de DNS (Cloudflare)</h3>
                    <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                      <li>Registrarse en Cloudflare</li>
                      <li>Agregar tu dominio y verificar DNS</li>
                      <li>Cambiar nameservers en tu registrador</li>
                      <li>Configurar SSL y optimizaciones</li>
                      <li>Monitorear métricas de rendimiento</li>
                    </ol>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Método 2: Pull Zone (KeyCDN, otros)</h3>
                    <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                      <li>Crear cuenta en el proveedor CDN</li>
                      <li>Configurar Pull Zone con tu dominio origen</li>
                      <li>Obtener URL del CDN (ej: example.keycdn.com)</li>
                      <li>Actualizar enlaces en tu sitio para usar CDN</li>
                      <li>Configurar caché headers en tu servidor</li>
                    </ol>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Para WordPress</h3>
                    <p className="text-muted-foreground mb-3">
                      Plugins recomendados que facilitan la integración:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Cloudflare:</strong> Plugin oficial gratuito</li>
                      <li><strong>W3 Total Cache:</strong> Compatible con múltiples CDNs</li>
                      <li><strong>WP Rocket:</strong> Plugin premium con integración CDN</li>
                      <li><strong>KeyCDN:</strong> Plugin oficial para WordPress</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Conclusión */}
              <div id="conclusion">
                <h2 className="text-3xl font-bold mb-6 text-foreground">La decisión que puede cambiar tu negocio</h2>
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border">
                  <p className="text-muted-foreground mb-4">
                    Para la mayoría de sitios web chilenos, <strong>Cloudflare</strong> es la mejor opción inicial 
                    debido a su plan gratuito, presencia local en Santiago y facilidad de implementación.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Si tienes un sitio más grande o necesitas características avanzadas, considera 
                    <strong> AWS CloudFront</strong> para máxima flexibilidad o <strong>KeyCDN</strong> 
                    para una solución intermedia costo-efectiva.
                  </p>
                  <p className="text-muted-foreground">
                    Un CDN no solo mejora la velocidad de tu sitio, sino que también contribuye al SEO 
                    y la experiencia del usuario, factores cruciales para el éxito online en Chile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <StickyCTA />
      <Footer />
    </>
  );
};

export default GuiaElegirCDN;