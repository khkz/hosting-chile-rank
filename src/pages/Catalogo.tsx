
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { getAllHostingCompanies } from '@/data/hostingCompanies';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Helmet } from 'react-helmet';

const CatalogoPage = () => {
  const hostingCompanies = getAllHostingCompanies();
  
  return (
    <>
      <Helmet>
        <title>Catálogo de Empresas de Hosting en Chile | eligetuhosting.cl</title>
        <meta 
          name="description" 
          content="Directorio completo de proveedores de hosting en Chile. Información detallada, planes y datos de contacto." 
        />
      </Helmet>
    
      <Navbar />
      
      {/* Hero section */}
      <section className="bg-[#F7F9FC] py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-4">
            Catálogo de Empresas de Hosting en Chile
          </h1>
          <p className="mt-4 text-lg text-[#555] max-w-2xl mx-auto">
            Encuentra información completa sobre proveedores de hosting en Chile: planes, 
            precios, características técnicas y datos de contacto actualizados.
          </p>
        </div>
      </section>
      
      {/* Catalog section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostingCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden flex flex-col">
                <div className="h-32 flex items-center justify-center p-4 bg-[#F7F9FC]">
                  <img 
                    src={company.logo} 
                    alt={`Logo de ${company.name}`} 
                    className="max-h-20 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <CardContent className="flex-grow pt-6">
                  <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#EDF2F4] text-[#2B2D42] px-2 py-1 rounded-md text-sm">
                      {company.rating}/10
                    </div>
                    <div className="text-sm text-gray-500">
                      Desde {company.yearFounded}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {company.description}
                  </p>
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-medium w-24">Teléfono:</span>
                      <span>{company.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium w-24">Email:</span>
                      <span className="truncate">{company.contactInfo.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium w-24">Planes desde:</span>
                      <span>${Math.min(...company.plans.map(plan => plan.price)).toLocaleString('es-CL')}/mes</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-[#F7F9FC] flex flex-col sm:flex-row gap-3 p-4">
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link to={`/catalogo/${company.id}`}>
                      Ver Detalles
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link to={`/comparativa/${company.id}`}>
                      Comparativa
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto gap-1">
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      Sitio Web <ExternalLink size={14} />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why choose section */}
      <section className="py-12 bg-[#F7F9FC]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">¿Por qué elegir un hosting chileno?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Mejor velocidad para usuarios locales</h3>
              <p className="text-gray-600">
                Los servidores ubicados en Chile ofrecen tiempos de respuesta más rápidos para 
                visitantes locales, mejorando la experiencia del usuario y el SEO para búsquedas 
                desde Chile.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Soporte técnico en español</h3>
              <p className="text-gray-600">
                Contar con atención al cliente en tu idioma y en tu zona horaria facilita 
                la resolución de problemas técnicos y mejora la comunicación con tu proveedor.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">IP local para SEO</h3>
              <p className="text-gray-600">
                Una dirección IP chilena puede mejorar el posicionamiento en buscadores para 
                las búsquedas realizadas desde Chile, especialmente para negocios locales.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Facturación local</h3>
              <p className="text-gray-600">
                La facturación en pesos chilenos y la posibilidad de emitir documentos tributarios 
                locales simplifican la contabilidad para empresas y emprendedores del país.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <StickyCTA />
      <Footer />
    </>
  );
};

export default CatalogoPage;
