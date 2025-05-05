
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Helmet } from 'react-helmet';

const GuiaElegirHosting = () => {
  useEffect(() => {
    document.title = "Guía para elegir el mejor hosting | eligetuhosting.cl";
  }, []);

  return (
    <>
      <Helmet>
        <title>Guía para elegir el mejor hosting | eligetuhosting.cl</title>
        <meta 
          name="description" 
          content="Aprende a elegir el mejor proveedor de hosting para tu sitio web según tus necesidades. Guía completa paso a paso." 
        />
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#F7F9FC]">
        {/* Hero section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
              Guía definitiva para elegir el mejor hosting en Chile (2025)
            </h1>
            <p className="text-lg text-[#555] max-w-2xl mx-auto mb-8">
              Aprende a identificar qué características son importantes para tu proyecto y cómo evaluar 
              correctamente a los proveedores de hosting en Chile.
            </p>
            <div className="flex justify-center">
              <img 
                src="/placeholder.svg" 
                alt="Elegir hosting" 
                className="max-h-64 rounded-lg shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        </section>
        
        {/* Tabla de contenidos */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Tabla de contenidos</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#tipos-hosting" className="text-[#EF233C] hover:underline">1. Tipos de hosting disponibles</a>
                </li>
                <li>
                  <a href="#factores-clave" className="text-[#EF233C] hover:underline">2. Factores clave a considerar</a>
                </li>
                <li>
                  <a href="#preguntas" className="text-[#EF233C] hover:underline">3. Preguntas que debes hacerte</a>
                </li>
                <li>
                  <a href="#websiterequisitos" className="text-[#EF233C] hover:underline">4. Requisitos según tipo de sitio web</a>
                </li>
                <li>
                  <a href="#errorescomunes" className="text-[#EF233C] hover:underline">5. Errores comunes al elegir hosting</a>
                </li>
                <li>
                  <a href="#recomendaciones" className="text-[#EF233C] hover:underline">6. Nuestras recomendaciones</a>
                </li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Contenido principal */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Tipos de hosting */}
            <section id="tipos-hosting" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">1. Tipos de hosting disponibles</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Hosting Compartido</h3>
                  <p className="mb-3">
                    En esta modalidad, varios sitios web comparten los recursos de un mismo servidor. Es la opción más 
                    económica y adecuada para proyectos pequeños o en etapas iniciales.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Económico</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Fácil de administrar</span>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Recursos limitados</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Hosting VPS</h3>
                  <p className="mb-3">
                    Un servidor virtual privado (VPS) ofrece recursos dedicados dentro de un servidor físico compartido. 
                    Ofrece mayor control y rendimiento que el hosting compartido.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Mayor rendimiento</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Recursos garantizados</span>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Conocimientos técnicos</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Hosting WordPress</h3>
                  <p className="mb-3">
                    Servidores optimizados específicamente para WordPress, con características como caché preconfigurada, 
                    actualizaciones automáticas y medidas de seguridad específicas.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Optimizado para WP</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Fácil de usar</span>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Menos flexible</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Servidor Dedicado</h3>
                  <p className="mb-3">
                    Un servidor físico completo exclusivo para tu proyecto. Máximo rendimiento y control total sobre 
                    la configuración y recursos. Ideal para proyectos grandes con alto tráfico.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Máximo rendimiento</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Control total</span>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Precio elevado</span>
                  </div>
                </div>
              </div>
            </section>
            
            <Separator className="my-10" />
            
            {/* Factores clave */}
            <section id="factores-clave" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">2. Factores clave a considerar</h2>
              
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Velocidad y rendimiento</h3>
                  <p className="text-gray-700">
                    Un hosting rápido mejora la experiencia de usuario, ayuda al SEO y reduce las tasas de rebote. 
                    Busca proveedores con servidores LiteSpeed o NGINX, SSD y ubicados en Chile.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Uptime y disponibilidad</h3>
                  <p className="text-gray-700">
                    La disponibilidad del servicio debe ser mínimo de 99.9%. Cada minuto que tu sitio está caído representa 
                    pérdidas potenciales de ventas y visitantes.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Seguridad</h3>
                  <p className="text-gray-700">
                    Certificados SSL incluidos, firewalls, protección contra malware, DDoS y backups automáticos son 
                    características de seguridad esenciales.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Soporte técnico</h3>
                  <p className="text-gray-700">
                    Asegúrate que ofrezcan soporte 24/7, preferiblemente en español y a través de diversos canales 
                    (chat en vivo, tickets, teléfono).
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Escalabilidad</h3>
                  <p className="text-gray-700">
                    Tu hosting debe poder crecer con tu proyecto. Verifica la facilidad para actualizar planes o migrar 
                    a servidores más potentes cuando sea necesario.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Precio y relación calidad/precio</h3>
                  <p className="text-gray-700">
                    Compara no solo el precio inicial sino también las renovaciones. El hosting más barato no siempre es 
                    la mejor opción a largo plazo.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="my-10" />
            
            {/* Preguntas clave */}
            <section id="preguntas" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">3. Preguntas que debes hacerte</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>¿Qué tipo de sitio web voy a crear?</AccordionTrigger>
                  <AccordionContent>
                    Un blog personal, una tienda online, un sitio corporativo o una aplicación web tienen requisitos 
                    diferentes. Por ejemplo, para una tienda online necesitarás certificado SSL, respaldos frecuentes y 
                    buen soporte técnico.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>¿Cuánto tráfico espero recibir?</AccordionTrigger>
                  <AccordionContent>
                    El volumen de visitas determinará los recursos necesarios. Si esperas mucho tráfico desde el inicio 
                    o planeas crecer rápidamente, considera opciones más robustas como VPS o planes premium.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>¿Qué habilidades técnicas tengo?</AccordionTrigger>
                  <AccordionContent>
                    Si no tienes experiencia técnica, busca hosting con panel de control intuitivo (cPanel, Plesk) y 
                    buena documentación. Los hostings administrados son ideales para quienes prefieren enfocarse en su 
                    negocio y no en mantener el servidor.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>¿Qué importancia tiene la velocidad para mi proyecto?</AccordionTrigger>
                  <AccordionContent>
                    Para sitios de comercio electrónico o con audiencia principalmente chilena, la velocidad es crucial. 
                    Busca hosting con servidores en Chile, CDN incluido y tecnologías de caché para garantizar tiempos 
                    de carga óptimos.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>¿Cuál es mi presupuesto a largo plazo?</AccordionTrigger>
                  <AccordionContent>
                    Considera no solo el costo inicial sino también las renovaciones. Algunos proveedores ofrecen grandes 
                    descuentos el primer año pero luego las renovaciones son costosas. Evalúa el TCO (Costo Total de 
                    Propiedad) a 3 años.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
            
            <Separator className="my-10" />
            
            {/* Requisitos según tipo de web */}
            <section id="websiterequisitos" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">4. Requisitos según tipo de sitio web</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Tipo de sitio</th>
                      <th className="border p-3 text-left">Requisitos recomendados</th>
                      <th className="border p-3 text-left">Hosting sugerido</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3 font-medium">Blog personal</td>
                      <td className="border p-3">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>1-5 GB de espacio</li>
                          <li>SSL gratuito</li>
                          <li>Soporte para WordPress</li>
                        </ul>
                      </td>
                      <td className="border p-3">Hosting compartido básico</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border p-3 font-medium">Sitio empresarial</td>
                      <td className="border p-3">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>10-20 GB de espacio</li>
                          <li>SSL gratuito</li>
                          <li>Correos corporativos</li>
                          <li>Backups diarios</li>
                        </ul>
                      </td>
                      <td className="border p-3">Hosting compartido premium</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Tienda online</td>
                      <td className="border p-3">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>20+ GB de espacio</li>
                          <li>SSL wilcard</li>
                          <li>Certificación PCI</li>
                          <li>Backups diarios</li>
                          <li>IP dedicada</li>
                        </ul>
                      </td>
                      <td className="border p-3">VPS o hosting e-commerce</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border p-3 font-medium">Aplicación web</td>
                      <td className="border p-3">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Recursos dedicados</li>
                          <li>Control de configuración</li>
                          <li>Escalabilidad on-demand</li>
                          <li>Alta disponibilidad</li>
                        </ul>
                      </td>
                      <td className="border p-3">VPS o servidor dedicado</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            <Separator className="my-10" />
            
            {/* Errores comunes */}
            <section id="errorescomunes" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">5. Errores comunes al elegir hosting</h2>
              
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-red-500">
                  <h3 className="font-semibold">Elegir solo por precio</h3>
                  <p className="text-gray-700">
                    El hosting más barato suele ofrecer recursos limitados, soporte deficiente y tiempos de carga lentos, 
                    afectando negativamente la experiencia del usuario y el SEO.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-red-500">
                  <h3 className="font-semibold">No verificar las políticas de respaldo</h3>
                  <p className="text-gray-700">
                    Muchos proveedores económicos no realizan backups automáticos o cobran extra por restaurarlos. 
                    Asegúrate que incluyan respaldos automáticos y gratuitos.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-red-500">
                  <h3 className="font-semibold">Ignorar la ubicación del servidor</h3>
                  <p className="text-gray-700">
                    Para sitios orientados al público chileno, un servidor ubicado en Chile o al menos en Latinoamérica 
                    ofrecerá mejor velocidad que uno en Europa o Estados Unidos.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-red-500">
                  <h3 className="font-semibold">No considerar la escalabilidad</h3>
                  <p className="text-gray-700">
                    Tu proyecto web probablemente crecerá con el tiempo. Asegúrate que tu proveedor permita escalar 
                    fácilmente a planes superiores sin complicaciones o costos ocultos.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-red-500">
                  <h3 className="font-semibold">Desatender los términos de servicio</h3>
                  <p className="text-gray-700">
                    Algunos proveedores tienen políticas restrictivas sobre contenido, uso de recursos o cancelación. 
                    Lee siempre los términos de servicio antes de contratar.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="my-10" />
            
            {/* Recomendaciones */}
            <section id="recomendaciones" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">6. Nuestras recomendaciones</h2>
              
              <p className="mb-6">
                Basados en nuestro análisis de rendimiento, precio, características y valoraciones de usuarios, 
                estas son nuestras recomendaciones para diferentes necesidades:
              </p>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EF233C]">
                  <div className="flex items-center gap-3 mb-3">
                    <img src="/logo-hostingplus.svg" alt="HostingPlus" className="h-10" loading="lazy" />
                    <h3 className="text-xl font-semibold">HostingPlus</h3>
                    <span className="bg-[#EF233C] text-white text-xs px-2 py-1 rounded">Mejor opción general</span>
                  </div>
                  <p className="mb-3">
                    Ideal para todo tipo de proyectos que requieran alto rendimiento y soporte de calidad. Su combinación de 
                    velocidad, seguridad y atención al cliente los posiciona como nuestra principal recomendación.
                  </p>
                  <a 
                    href="https://www.hostingplus.cl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#EF233C] hover:underline font-medium inline-flex items-center"
                  >
                    Visitar HostingPlus <span className="ml-1">→</span>
                  </a>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <img src="/logo-1hosting.svg" alt="1Hosting" className="h-10" loading="lazy" />
                    <h3 className="text-xl font-semibold">1Hosting</h3>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Mejor precio</span>
                  </div>
                  <p className="mb-3">
                    Excelente opción si buscas una buena relación calidad-precio. Ofrece planes económicos sin sacrificar 
                    demasiado rendimiento o características esenciales.
                  </p>
                  <a 
                    href="https://www.1hosting.cl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#EF233C] hover:underline font-medium inline-flex items-center"
                  >
                    Visitar 1Hosting <span className="ml-1">→</span>
                  </a>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <img src="/logo-ecohosting.svg" alt="EcoHosting" className="h-10" loading="lazy" />
                    <h3 className="text-xl font-semibold">EcoHosting</h3>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Más sustentable</span>
                  </div>
                  <p className="mb-3">
                    Si la sustentabilidad ambiental es importante para tu proyecto, EcoHosting ofrece servidores con energías 
                    renovables sin comprometer el rendimiento técnico.
                  </p>
                  <a 
                    href="https://www.ecohosting.cl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#EF233C] hover:underline font-medium inline-flex items-center"
                  >
                    Visitar EcoHosting <span className="ml-1">→</span>
                  </a>
                </div>
              </div>
            </section>
            
            {/* Conclusión */}
            <section className="bg-[#EDF2F4] p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Conclusión</h2>
              <p className="mb-4">
                Elegir el hosting adecuado es una decisión importante que afectará directamente al rendimiento, 
                seguridad y éxito de tu sitio web. Evalúa cuidadosamente tus necesidades, compara las opciones 
                disponibles y prioriza características como velocidad, soporte técnico y escalabilidad.
              </p>
              <p>
                Recuerda que el proveedor de hosting más adecuado no siempre es el más barato o el más caro, 
                sino el que mejor se adapta a las necesidades específicas de tu proyecto.
              </p>
            </section>
          </div>
        </div>
        
      </main>
      
      <StickyCTA />
      <Footer />
    </>
  );
};

export default GuiaElegirHosting;
