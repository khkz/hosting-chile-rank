
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HostingCard from '@/components/HostingCard';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { Globe, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';

const WebHosting = () => {
  // Hosting data with EcoHosting and HostingPlus prioritized
  const hostingData = [
    {
      position: 1,
      name: "EcoHosting.cl",
      logo: "/logo-ecohosting-new.svg",
      rating: 9.9,
      features: [
        "Servidores en Chile con energía 100% renovable",
        "Optimizado para WordPress y WooCommerce",
        "MagicSpam y backups JetBackup incluidos",
        "Certificado SSL gratuito y dominio .CL gratis 1 año"
      ],
      specs: [
        "LiteSpeed Enterprise", 
        "MagicSpam", 
        "IP Chile", 
        "JetBackup"
      ],
      url: "https://www.ecohosting.cl/web-hosting",
      isPodium: true,
      isTopRated: true,
      isRecommended: true
    },
    {
      position: 2,
      name: "HostingPlus.cl",
      logo: "/logo-hostingplus-new.svg",
      rating: 9.8,
      features: [
        "Datacenter propio en Santiago (IP CL)",
        "LiteSpeed Enterprise + BitNinja + JetBackup",
        "0 reclamos en Reclamos.cl (2020-2025)",
        "Soporte 24/7 y creador web IA gratis"
      ],
      specs: [
        "LiteSpeed Enterprise", 
        "BitNinja WAF", 
        "IP Chile", 
        "JetBackup"
      ],
      url: "https://www.hostingplus.cl/planes",
      isPodium: true
    },
    {
      position: 3,
      name: "HostGator.cl",
      logo: "/logo-hostgator.svg",
      rating: 9.2,
      features: [
        "12 años de experiencia en Chile",
        "Panel de control personalizado",
        "Soporte técnico por chat y teléfono",
        "Garantía de uptime 99.9%"
      ],
      specs: [
        "Apache Standard", 
        "ModSecurity", 
        "IP Chile", 
        "Backups diarios"
      ],
      url: "https://www.hostgator.cl/",
      isPodium: true
    },
    {
      position: 4,
      name: "FullHosting.cl",
      logo: "/logo-fullhosting.svg",
      rating: 8.9,
      features: [
        "Planes escalables según necesidades",
        "Soporte técnico en español",
        "Panel de control cPanel",
        "Protección DDoS"
      ],
      specs: [
        "cPanel", 
        "CloudLinux", 
        "IP Chile", 
        "Backup semanal"
      ],
      url: "https://www.fullhosting.cl/",
      isPodium: false
    },
    {
      position: 5,
      name: "Hosting24.cl",
      logo: "/logo-hosting24.svg",
      rating: 8.7,
      features: [
        "Soporte 24/7 vía telefónica",
        "Planes económicos",
        "Protección antivirus",
        "Backup automático"
      ],
      specs: [
        "Apache", 
        "Imunify360", 
        "IP Chile", 
        "Backup diario"
      ],
      url: "https://hosting24.cl/",
      isPodium: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Helmet>
        <title>Mejor Web Hosting Chile 2025 | Comparativa de Precios y Planes</title>
        <meta name="description" content="Compara los mejores servicios de web hosting en Chile. Planes optimizados para WordPress, tiendas online y sitios corporativos con alto rendimiento." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Mejor Web Hosting Chile 2025
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Comparativa de los mejores servicios de alojamiento web en Chile. Precios actualizados y características detalladas para eligir el plan perfecto para tu sitio web.
        </p>
        
        {/* Benefits */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-4">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Optimizados para SEO</h3>
            <p className="text-sm text-gray-600">Mayor visibilidad en Google gracias a servidores rápidos en Chile</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-1">Seguridad Avanzada</h3>
            <p className="text-sm text-gray-600">Protección contra malware y ataques DDoS incluida</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Backups Automáticos</h3>
            <p className="text-sm text-gray-600">Restauración con un clic para mantener tu sitio protegido</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Headphones className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Soporte 24/7</h3>
            <p className="text-sm text-gray-600">Atención personalizada en español por expertos</p>
          </div>
        </div>
        
        {/* Hosting Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {hostingData.map((hosting) => (
            <HostingCard 
              key={hosting.position}
              position={hosting.position}
              name={hosting.name}
              logo={hosting.logo}
              rating={hosting.rating}
              features={hosting.features}
              specs={hosting.specs}
              url={hosting.url}
              isPodium={hosting.isPodium}
              isTopRated={hosting.isTopRated}
              isRecommended={hosting.isRecommended}
            />
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="bg-white p-8 rounded-xl shadow-md text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">¿Necesitas ayuda para elegir tu hosting?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Nuestros expertos pueden ayudarte a encontrar el plan perfecto según tus necesidades específicas y presupuesto.
          </p>
          <Button asChild size="lg" className="bg-[#EF233C] hover:bg-[#D90429]">
            <a href="/cotiza-hosting">Cotización Personalizada Gratis</a>
          </Button>
        </div>
        
        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Preguntas Frecuentes sobre Web Hosting</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Qué es el web hosting y por qué lo necesito?</h3>
              <p className="text-gray-700">
                El web hosting es un servicio que permite publicar un sitio web en internet. Proporciona el espacio en servidor, conectividad y servicios necesarios para que tu sitio sea accesible en línea. Sin hosting, tu sitio no podría ser visitado por los usuarios.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Por qué elegir un hosting en Chile?</h3>
              <p className="text-gray-700">
                Un hosting con servidores en Chile ofrece mejor velocidad de carga para visitantes locales, mejor posicionamiento SEO en búsquedas locales y cumplimiento con regulaciones chilenas de datos. Además, el soporte técnico estará en tu mismo uso horario.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Qué características debo considerar al elegir un hosting?</h3>
              <p className="text-gray-700">
                Debes considerar la velocidad de carga, uptime garantizado, espacio de almacenamiento, límite de transferencia mensual, número de bases de datos y cuentas de email, soporte técnico, facilidad de uso del panel de control y opciones de seguridad incluidas.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WebHosting;
