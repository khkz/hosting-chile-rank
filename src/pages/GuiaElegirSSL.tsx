
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Helmet } from 'react-helmet';

const GuiaElegirSSL = () => {
  return (
    <>
      <Helmet>
        <title>Guía Certificados SSL | EligeTuHosting.cl</title>
        <meta 
          name="description" 
          content="Todo lo que necesitas saber para elegir el certificado SSL adecuado para tu sitio web y mantenerlo seguro." 
        />
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#F7F9FC]">
        {/* Hero section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
              Guía para elegir el mejor certificado SSL (2025)
            </h1>
            <p className="text-lg text-[#555] max-w-2xl mx-auto mb-8">
              Protege tu sitio web y a tus usuarios con el certificado SSL adecuado.
              Aprende a elegir entre los diferentes tipos y proveedores.
            </p>
          </div>
        </section>
        
        {/* Tabla de contenidos */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Tabla de contenidos</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#que-es-ssl" className="text-[#EF233C] hover:underline">1. ¿Qué es un certificado SSL?</a>
                </li>
                <li>
                  <a href="#tipos-ssl" className="text-[#EF233C] hover:underline">2. Tipos de certificados SSL</a>
                </li>
                <li>
                  <a href="#factores-clave" className="text-[#EF233C] hover:underline">3. Factores clave a considerar</a>
                </li>
                <li>
                  <a href="#recomendaciones" className="text-[#EF233C] hover:underline">4. Nuestras recomendaciones</a>
                </li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Contenido principal */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <section id="que-es-ssl" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">1. ¿Qué es un certificado SSL?</h2>
              <p className="mb-4">
                Un certificado SSL (Secure Sockets Layer) es una tecnología de seguridad que establece
                una conexión cifrada entre el servidor web y el navegador del visitante. Esta conexión
                asegura que toda la información transmitida permanezca privada y protegida.
              </p>
              <div className="bg-white p-5 rounded-lg shadow-sm mt-4">
                <h3 className="font-semibold mb-2">Beneficios principales:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Protege los datos sensibles como información personal y detalles de pago</li>
                  <li>Mejora el posicionamiento SEO (Google favorece sitios seguros)</li>
                  <li>Genera confianza en los visitantes (candado verde en la barra de dirección)</li>
                  <li>Es obligatorio para cumplir con normativas como PCI DSS si procesas pagos</li>
                  <li>Evita advertencias de "sitio no seguro" en navegadores modernos</li>
                </ul>
              </div>
            </section>
            
            <Separator className="my-10" />
            
            <section id="tipos-ssl" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">2. Tipos de certificados SSL</h2>
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Certificado de Dominio Único (DV)</h3>
                  <p className="text-gray-700">
                    Es el tipo más básico y económico. Solo verifica la propiedad del dominio, sin 
                    validar la identidad de la organización. Ideal para blogs, sitios personales o 
                    proyectos pequeños.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Certificado de Organización (OV)</h3>
                  <p className="text-gray-700">
                    Ofrece un nivel intermedio de validación. Además de verificar el dominio, 
                    comprueba la identidad de la organización. Recomendado para sitios corporativos 
                    y comerciales.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Certificado de Validación Extendida (EV)</h3>
                  <p className="text-gray-700">
                    El nivel más alto de validación. Requiere una verificación exhaustiva de la 
                    identidad legal de la organización. Ideal para sitios que manejan información 
                    financiera o datos muy sensibles.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Certificado Wildcard</h3>
                  <p className="text-gray-700">
                    Protege el dominio principal y todos sus subdominios de primer nivel. Excelente 
                    opción si tienes múltiples subdominios (blog.tudominio.cl, tienda.tudominio.cl, etc).
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold">Certificado Multi-dominio (SAN/UCC)</h3>
                  <p className="text-gray-700">
                    Permite proteger múltiples dominios diferentes con un solo certificado. 
                    Útil si gestionas varios sitios web relacionados con diferentes nombres de dominio.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="my-10" />
            
            <section id="factores-clave" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">3. Factores clave a considerar</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Nivel de seguridad requerido</AccordionTrigger>
                  <AccordionContent>
                    Evalúa qué tipo de información maneja tu sitio. Para tiendas online o sitios
                    que procesan datos financieros, prioriza certificados OV o EV. Para blogs o sitios
                    informativos, un certificado DV suele ser suficiente.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Autoridad de Certificación (CA)</AccordionTrigger>
                  <AccordionContent>
                    Elige certificados emitidos por CAs reconocidas como Comodo, DigiCert, GlobalSign o Let's Encrypt.
                    Esto garantiza que tu certificado será reconocido por la mayoría de los navegadores sin problemas.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Período de validez</AccordionTrigger>
                  <AccordionContent>
                    Los certificados suelen tener validez de 1 a 3 años. Considera que los certificados
                    más nuevos tendrán un máximo de 398 días (poco más de un año) debido a nuevas regulaciones
                    de seguridad implementadas por los navegadores.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Garantía y soporte</AccordionTrigger>
                  <AccordionContent>
                    Los certificados de pago suelen ofrecer garantías financieras y mejor soporte técnico.
                    Esto puede ser crucial si tienes problemas durante la instalación o renovación del certificado.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>Compatibilidad con dispositivos</AccordionTrigger>
                  <AccordionContent>
                    Asegúrate de que el certificado es compatible con dispositivos y navegadores antiguos
                    si tu audiencia utiliza tecnología más antigua. Los certificados modernos utilizan
                    algoritmos que pueden no ser compatibles con sistemas muy desactualizados.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
            
            <Separator className="my-10" />
            
            <section id="recomendaciones" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">4. Nuestras recomendaciones</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EF233C]">
                  <div className="flex items-center gap-3 mb-3">
                    <img src="/logo-hostingplus.svg" alt="HostingPlus" className="h-10" loading="lazy" />
                    <h3 className="text-xl font-semibold">HostingPlus SSL</h3>
                    <span className="bg-[#EF233C] text-white text-xs px-2 py-1 rounded">Mejor opción</span>
                  </div>
                  <p className="mb-3">
                    Ofrece certificados SSL de diferentes niveles con excelente soporte para la instalación.
                    Sus planes de hosting incluyen SSL Let's Encrypt gratuito y automatizado.
                  </p>
                  <a 
                    href="https://www.hostingplus.cl/blog/servicio/certificados-ssl-ip-fija/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#EF233C] hover:underline font-medium inline-flex items-center"
                  >
                    Ver certificados SSL <span className="ml-1">→</span>
                  </a>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <img src="/logo-hostgator.svg" alt="HostGator" className="h-10" loading="lazy" />
                    <h3 className="text-xl font-semibold">HostGator SSL</h3>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Gran variedad</span>
                  </div>
                  <p className="mb-3">
                    Amplia variedad de certificados SSL, desde opciones básicas hasta certificados EV
                    para empresas. Buena documentación y soporte para la implementación.
                  </p>
                  <a 
                    href="https://www.hostgator.cl/ssl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#EF233C] hover:underline font-medium inline-flex items-center"
                  >
                    Ver certificados <span className="ml-1">→</span>
                  </a>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <img src="/logo-cloudhosting.svg" alt="CloudHosting" className="h-10" loading="lazy" />
                    <h3 className="text-xl font-semibold">CloudHosting SSL</h3>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Mejor precio</span>
                  </div>
                  <p className="mb-3">
                    Buenas opciones de certificados SSL a precios competitivos, incluyendo opciones
                    Wildcard y Multi-dominio con descuentos por contratación multianual.
                  </p>
                  <a 
                    href="https://www.cloudhosting.cl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#EF233C] hover:underline font-medium inline-flex items-center"
                  >
                    Ver certificados <span className="ml-1">→</span>
                  </a>
                </div>
              </div>
            </section>
            
            <section className="bg-[#EDF2F4] p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Conclusión</h2>
              <p className="mb-4">
                Actualmente, tener un certificado SSL no es opcional sino necesario para cualquier sitio web.
                Además de la seguridad que proporciona, afecta directamente al SEO, la confianza del usuario
                y el correcto funcionamiento en navegadores modernos.
              </p>
              <p>
                Evalúa tu presupuesto y necesidades específicas para elegir el tipo de certificado adecuado,
                y no escatimes en seguridad si tu sitio maneja información sensible de los usuarios.
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

export default GuiaElegirSSL;
