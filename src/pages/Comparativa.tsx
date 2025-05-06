
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAllHostingCompanies } from '@/data/hostingCompanies';

const Comparativa = () => {
  const providers = getAllHostingCompanies()
    .filter(provider => provider.id !== 'hostingplus') // Filter out hostingplus
    .sort((a, b) => b.rating - a.rating);

  return (
    <>
      <Helmet>
        <title>Comparativa de Hosting en Chile - EligeTuHosting.cl</title>
        <meta name="description" content="Compara los mejores proveedores de hosting en Chile. Análisis detallado de precios, rendimiento, soporte técnico y más." />
      </Helmet>
      
      <Navbar />
      
      <div className="bg-[#F7F9FC] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42] mb-6">
            Comparativa de Hosting en Chile 2025
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-center text-[#555]">
            Compara los mejores proveedores de hosting en Chile. Elige el servicio ideal para tu sitio web o negocio.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Comparar HostingPlus vs otros proveedores</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.slice(0, 15).map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <img 
                      src={provider.logo} 
                      alt={`${provider.name} logo`} 
                      className="h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  
                  <h3 className="text-lg font-medium text-center mb-4">
                    HostingPlus vs {provider.name}
                  </h3>
                  
                  <p className="text-sm text-[#555] mb-6">
                    Compara planes, precios, rendimiento y soporte entre HostingPlus y {provider.name}.
                  </p>
                  
                  <Button asChild className="w-full" variant="outline">
                    <Link to={`/comparativa/hostingplus-vs/${provider.id}`}>
                      Ver comparativa
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-[#555] mb-4">
              ¿Buscas comparar otros proveedores? Explora nuestro ranking completo y 
              encuentra el servicio ideal para tu proyecto.
            </p>
            <Button asChild>
              <Link to="/ranking">
                Ver ranking completo
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Comparativa;
