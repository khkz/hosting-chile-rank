
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HostingCard from '@/components/HostingCard';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { Server, Database, Shield, Wifi } from 'lucide-react';

const ServidoresDedicados = () => {
  // Servidores Dedicados data with HostingPlus and EcoHosting prioritized
  const hostingData = [
    {
      position: 1,
      name: "EcoHosting.cl",
      logo: "/logo-ecohosting-new.svg",
      rating: 9.8,
      features: [
        "Servidores Dell PowerEdge última generación",
        "Sistema de energía renovable certificado",
        "Configuración personalizada de hardware",
        "Administración completa incluida"
      ],
      specs: [
        "Intel Xeon", 
        "SSD NVMe RAID", 
        "IPv4 Dedicada", 
        "Ancho de banda dedicado"
      ],
      url: "https://www.ecohosting.cl/servidores-dedicados",
      isPodium: true,
      isTopRated: true,
      isRecommended: true
    },
    {
      position: 2,
      name: "HostingPlus.cl",
      logo: "/logo-hostingplus-new.svg",
      rating: 9.7,
      features: [
        "Datacenter propio Tier III en Santiago",
        "Servidores de alta disponibilidad",
        "Monitoreo avanzado 24/7/365",
        "Firewall hardware dedicado opcional"
      ],
      specs: [
        "Intel Xeon/AMD EPYC", 
        "SSD NVMe Enterprise", 
        "IP Dedicadas", 
        "1 Gbps garantizado"
      ],
      url: "https://www.hostingplus.cl/dedicados",
      isPodium: true
    },
    {
      position: 3,
      name: "HostGator.cl",
      logo: "/logo-hostgator.svg",
      rating: 9.0,
      features: [
        "Hardware personalizable",
        "Soporte técnico especializado",
        "Panel de control incluido",
        "Acceso root completo"
      ],
      specs: [
        "Intel Xeon", 
        "SSD/HDD", 
        "IP Dedicadas", 
        "Ancho de banda configurable"
      ],
      url: "https://www.hostgator.cl/dedicados",
      isPodium: true
    },
    {
      position: 4,
      name: "PlanetaHosting.cl",
      logo: "/logo-planetahosting.svg",
      rating: 8.7,
      features: [
        "Servidores en datacenter chileno",
        "Administración opcional",
        "Backup incluido",
        "Soporte técnico 24/7"
      ],
      specs: [
        "Intel Xeon", 
        "SSD Enterprise", 
        "IP Dedicadas", 
        "Tráfico ilimitado"
      ],
      url: "https://planetahosting.cl/dedicados",
      isPodium: false
    },
    {
      position: 5,
      name: "NinjaHosting.cl",
      logo: "/logo-ninjahosting.svg",
      rating: 8.5,
      features: [
        "Servidores económicos",
        "Configuración personalizada",
        "Administración básica incluida",
        "Respuesta rápida ante incidentes"
      ],
      specs: [
        "Intel Core/Xeon", 
        "SSD", 
        "IP Dedicada", 
        "500 Mbps"
      ],
      url: "https://ninjahosting.cl/dedicados",
      isPodium: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Helmet>
        <title>Servidores Dedicados en Chile 2025 | Máximo Rendimiento Garantizado</title>
        <meta name="description" content="Servidores físicos dedicados de alto rendimiento para empresas y proyectos que requieren máxima potencia, seguridad y personalización." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Servidores Dedicados Chile 2025
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Hardware exclusivo con máximo rendimiento para tus aplicaciones críticas, bases de datos complejas y proyectos de alta demanda.
        </p>
        
        {/* Benefits */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-4">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Hardware Exclusivo</h3>
            <p className="text-sm text-gray-600">Servidor físico completo para tu uso exclusivo</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Almacenamiento Veloz</h3>
            <p className="text-sm text-gray-600">Discos SSD NVMe en configuración RAID</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Seguridad Avanzada</h3>
            <p className="text-sm text-gray-600">Firewall físico y protección DDoS especializada</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wifi className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-1">Conectividad Premium</h3>
            <p className="text-sm text-gray-600">Ancho de banda dedicado hasta 10 Gbps</p>
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
          <h2 className="text-2xl font-bold mb-4">¿Necesitas una configuración especializada?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Podemos diseñar un servidor dedicado a medida según tus necesidades específicas de hardware, software y seguridad.
          </p>
          <Button asChild size="lg" className="bg-[#EF233C] hover:bg-[#D90429]">
            <a href="/cotiza-hosting">Solicitar Servidor a Medida</a>
          </Button>
        </div>
        
        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Preguntas Frecuentes sobre Servidores Dedicados</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Cuál es la diferencia entre un VPS y un servidor dedicado?</h3>
              <p className="text-gray-700">
                Un VPS es una partición virtual dentro de un servidor físico que comparte hardware con otros VPS, mientras que un servidor dedicado es una máquina física completa exclusiva para tu uso. Los servidores dedicados ofrecen máximo rendimiento, personalización y seguridad.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Qué tipo de empresas necesitan un servidor dedicado?</h3>
              <p className="text-gray-700">
                Los servidores dedicados son ideales para empresas con aplicaciones críticas, altos volúmenes de tráfico, necesidades de seguridad estrictas, procesamiento intensivo, bases de datos grandes, o requisitos de cumplimiento normativo específicos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Puedo personalizar el hardware de mi servidor dedicado?</h3>
              <p className="text-gray-700">
                Sí, la mayoría de proveedores de servidores dedicados te permiten personalizar componentes como procesador, memoria RAM, discos de almacenamiento, tarjetas de red y configuraciones RAID según tus necesidades específicas.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServidoresDedicados;
