
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HostingCard from '@/components/HostingCard';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { Users, Award, Globe, CreditCard } from 'lucide-react';

const ResellerHosting = () => {
  // Reseller hosting data with EcoHosting and HostingPlus prioritized
  const hostingData = [
    {
      position: 1,
      name: "HostingPlus.cl",
      logo: "/logo-hostingplus-new.svg",
      rating: 9.9,
      features: [
        "Panel WHMCS y cPanel incluidos",
        "Marca blanca completa",
        "LiteSpeed Enterprise y JetBackup",
        "Soporte técnico 24/7 para revendedores"
      ],
      specs: [
        "LiteSpeed Enterprise", 
        "WHMCS", 
        "IP Chile", 
        "cPanel WHM"
      ],
      url: "https://www.hostingplus.cl/reseller",
      isPodium: true,
      isTopRated: true,
      isRecommended: true
    },
    {
      position: 2,
      name: "EcoHosting.cl",
      logo: "/logo-ecohosting-new.svg",
      rating: 9.8,
      features: [
        "Recursos ilimitados para clientes",
        "Migración gratis de clientes",
        "Certificados SSL ilimitados",
        "Energía 100% renovable como valor agregado"
      ],
      specs: [
        "Apache Optimizado", 
        "WHMCS", 
        "IP Chile", 
        "cPanel WHM"
      ],
      url: "https://www.ecohosting.cl/reseller",
      isPodium: true
    },
    {
      position: 3,
      name: "ZipHosting.cl",
      logo: "/logo-ziphosting.svg",
      rating: 9.1,
      features: [
        "Planes flexibles de reventa",
        "Facturación automatizada",
        "Creación ilimitada de cuentas",
        "Soporte prioritario"
      ],
      specs: [
        "Apache", 
        "WHMCS opcional", 
        "IP Chile", 
        "cPanel WHM"
      ],
      url: "https://ziphosting.cl/reseller",
      isPodium: true
    },
    {
      position: 4,
      name: "WebHosting.cl",
      logo: "/logo-webhosting.svg",
      rating: 8.8,
      features: [
        "Planes escalables de reventa",
        "Almacenamiento SSD",
        "Backups diarios",
        "Soporte técnico"
      ],
      specs: [
        "Apache", 
        "Blesta", 
        "IP Chile", 
        "cPanel WHM"
      ],
      url: "https://webhosting.cl/reseller",
      isPodium: false
    },
    {
      position: 5,
      name: "NetHosting.cl",
      logo: "/logo-nethosting.svg",
      rating: 8.6,
      features: [
        "Planes económicos",
        "Panel personalizable",
        "Dominios ilimitados",
        "Soporte en español"
      ],
      specs: [
        "Apache", 
        "WHMCS", 
        "IP Chile", 
        "cPanel WHM"
      ],
      url: "https://nethosting.cl/reseller",
      isPodium: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Helmet>
        <title>Reseller Hosting Chile 2025 | Comienza Tu Negocio de Hosting</title>
        <meta name="description" content="Planes de Reseller Hosting para emprendedores y agencias que quieren iniciar su propio negocio de hosting bajo su marca personal." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Reseller Hosting Chile 2025
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Comienza tu propio negocio de hosting web con planes de reventa que incluyen todo lo necesario para ofrecer servicios bajo tu propia marca.
        </p>
        
        {/* Benefits */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-4">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Clientes Ilimitados</h3>
            <p className="text-sm text-gray-600">Crea y administra todas las cuentas que necesites</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Marca Propia</h3>
            <p className="text-sm text-gray-600">Personaliza completamente con tu logo y nombre</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Nameservers Personalizados</h3>
            <p className="text-sm text-gray-600">DNS propios con tu dominio para mayor profesionalismo</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-1">Sistema de Facturación</h3>
            <p className="text-sm text-gray-600">WHMCS incluido para gestión automática de cobros</p>
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
          <h2 className="text-2xl font-bold mb-4">¿Quieres empezar tu negocio de hosting?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Te ayudamos a configurar tu plan de reseller y a dar los primeros pasos para tener tu propio negocio de hosting rentable.
          </p>
          <Button asChild size="lg" className="bg-[#EF233C] hover:bg-[#D90429]">
            <a href="/cotiza-hosting">Asesoría Gratuita para Resellers</a>
          </Button>
        </div>
        
        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Preguntas Frecuentes sobre Reseller Hosting</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Qué es el Reseller Hosting y cómo funciona?</h3>
              <p className="text-gray-700">
                El Reseller Hosting te permite revender servicios de hosting bajo tu propia marca. Compras un plan con recursos grandes y los divides para vender a tus propios clientes, estableciendo tus precios y usando tu marca, mientras el proveedor se encarga de la infraestructura.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Qué incluye un buen plan de Reseller Hosting?</h3>
              <p className="text-gray-700">
                Un buen plan de reventa debe incluir: panel WHM para crear cuentas, WHMCS para facturación automática, nameservers personalizados, certificados SSL, emails personalizados para tu marca, y soporte técnico para revendedores.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">¿Es rentable el negocio de reventa de hosting?</h3>
              <p className="text-gray-700">
                Sí, la reventa de hosting puede ser un negocio rentable si tienes un buen plan de marketing y atención al cliente. Muchas agencias web lo utilizan como servicio complementario. La clave está en añadir valor con tu propio soporte técnico y servicios adicionales.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResellerHosting;
