
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HostingCard from '@/components/HostingCard';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { Server, Cpu, Shield, Gauge } from 'lucide-react';

const VpsHosting = () => {
  // VPS hosting data with HostingPlus and EcoHosting prioritized
  const hostingData = [
    {
      position: 1,
      name: "HostingPlus.cl",
      logo: "/logo-hostingplus-new.svg",
      rating: 9.9,
      features: [
        "VPS administrado con panel Virtualizor",
        "Datacenter en Santiago con IP chilena",
        "SSD NVMe y procesadores Intel Xeon",
        "Monitoreo 24/7 y firewall avanzado"
      ],
      specs: [
        "Virtualización KVM", 
        "SSD NVMe", 
        "IPv4 Dedicada", 
        "Ancho de banda 1 Gbps"
      ],
      url: "https://www.hostingplus.cl/vps",
      isPodium: true,
      isTopRated: true,
      isRecommended: true
    },
    {
      position: 2,
      name: "EcoHosting.cl",
      logo: "/logo-ecohosting-new.svg",
      rating: 9.7,
      features: [
        "Infraestructura de alto rendimiento",
        "Energía 100% renovable certificada",
        "Respaldos automáticos incluidos",
        "Panel de administración intuitivo"
      ],
      specs: [
        "Virtualización KVM", 
        "SSD Enterprise", 
        "IP Chile", 
        "Backup semanal"
      ],
      url: "https://www.ecohosting.cl/vps",
      isPodium: true
    },
    {
      position: 3,
      name: "HostGator.cl",
      logo: "/logo-hostgator.svg",
      rating: 9.1,
      features: [
        "Servidores VPS escalables",
        "Acceso root completo",
        "Planes personalizables",
        "Soporte técnico especializado"
      ],
      specs: [
        "OpenVZ", 
        "SSD", 
        "IP Dedicada", 
        "Tráfico ilimitado"
      ],
      url: "https://www.hostgator.cl/vps",
      isPodium: true
    },
    {
      position: 4,
      name: "WebHosting.cl",
      logo: "/logo-webhosting.svg",
      rating: 8.8,
      features: [
        "VPS administrado o no administrado",
        "Recursos garantizados",
        "Múltiples sistemas operativos",
        "Soporte 24/7"
      ],
      specs: [
        "KVM/OpenVZ", 
        "SSD", 
        "IP Dedicada", 
        "Control panel"
      ],
      url: "https://webhosting.cl/vps",
      isPodium: false
    },
    {
      position: 5,
      name: "SmartHost.cl",
      logo: "/logo-smarthost.svg",
      rating: 8.6,
      features: [
        "Planes VPS económicos",
        "Panel de control incluido",
        "Backup automático",
        "Firewall incluido"
      ],
      specs: [
        "OpenVZ", 
        "SSD", 
        "IP Compartida", 
        "Backup semanal"
      ],
      url: "https://smarthost.cl/vps",
      isPodium: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Helmet>
        <title>Mejores VPS Chile 2025 | Servidores Virtuales de Alto Rendimiento</title>
        <meta name="description" content="Compara los mejores VPS en Chile con recursos garantizados. Servidores virtuales para proyectos que necesitan más control y rendimiento." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Mejores VPS Chile 2025
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Servidores virtuales privados (VPS) con alto rendimiento, recursos dedicados y control total para tus proyectos más exigentes.
        </p>
        
        {/* Benefits */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-4">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Recursos Dedicados</h3>
            <p className="text-sm text-gray-600">CPU, RAM y almacenamiento exclusivos para tu proyecto</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Cpu className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Procesadores Potentes</h3>
            <p className="text-sm text-gray-600">Intel Xeon o AMD EPYC de última generación</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Seguridad Avanzada</h3>
            <p className="text-sm text-gray-600">Firewall, detección de intrusiones y protección DDoS</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gauge className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-1">Alto Rendimiento</h3>
            <p className="text-sm text-gray-600">Discos SSD NVMe y redes de alta velocidad</p>
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
          <h2 className="text-2xl font-bold mb-4">¿Necesitas un VPS personalizado?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Podemos configurar un servidor virtual según tus necesidades exactas de CPU, memoria, almacenamiento y software.
          </p>
          <Button asChild size="lg" className="bg-[#EF233C] hover:bg-[#D90429]">
            <a href="/cotiza-hosting">Solicitar Cotización VPS</a>
          </Button>
        </div>
        
        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Preguntas Frecuentes sobre VPS</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Cuál es la diferencia entre un hosting compartido y un VPS?</h3>
              <p className="text-gray-700">
                En un hosting compartido, múltiples sitios web comparten los recursos de un servidor, mientras que en un VPS tienes recursos dedicados (CPU, RAM, almacenamiento) y aislamiento completo de otros usuarios, lo que resulta en mejor rendimiento y seguridad.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Cuándo debería migrar de un hosting compartido a un VPS?</h3>
              <p className="text-gray-700">
                Deberías considerar un VPS cuando tu sitio web recibe mucho tráfico, necesitas instalar software personalizado, requieres mayor seguridad y privacidad, o cuando tu sitio actual sufre de lentitud debido a las limitaciones de recursos compartidos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Necesito conocimientos técnicos para administrar un VPS?</h3>
              <p className="text-gray-700">
                Depende del tipo de VPS que elijas. Los VPS administrados incluyen soporte técnico que se encarga de las actualizaciones, seguridad y mantenimiento. Los VPS no administrados requieren conocimientos de administración de servidores Linux o Windows.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VpsHosting;
