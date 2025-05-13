
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { InfoIcon, Package, Zap, ShieldCheck, Lightbulb, BookOpen, ExternalLink } from 'lucide-react';

interface PersonalizedRecommendationsProps {
  domainName: string;
  ipChile: boolean;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ 
  domainName,
  ipChile
}) => {
  const [siteType, setSiteType] = useState<string>('');

  // Recommendations based on site type and IP location
  const recommendations = {
    ecommerce: {
      hosting: ipChile 
        ? { name: "HostingPlus E-commerce", features: ["Alta velocidad", "Certificado SSL", "PrestaShop optimizado"], url: "https://clientes.hostingplus.cl/cart.php?gid=15" }
        : { name: "HostingPlus E-commerce", features: ["IP chilena", "Menor latencia", "Mejor SEO local"], url: "https://clientes.hostingplus.cl/cart.php?gid=15" }
    },
    blog: {
      hosting: ipChile
        ? { name: "HostingPlus WordPress", features: ["LiteSpeed cache", "10x más rápido", "Optimizado para blogs"], url: "https://clientes.hostingplus.cl/cart.php?gid=14" }
        : { name: "HostingPlus WordPress", features: ["IP chilena", "LiteSpeed cache", "Mejor ranking en Chile"], url: "https://clientes.hostingplus.cl/cart.php?gid=14" }
    },
    corporate: {
      hosting: ipChile
        ? { name: "HostingPlus Empresas", features: ["99.9% uptime", "Soporte prioritario", "Backup diario"], url: "https://clientes.hostingplus.cl/cart.php?gid=13" }
        : { name: "HostingPlus Empresas", features: ["IP chilena", "Mejor imagen local", "Cumplimiento de GDPR"], url: "https://clientes.hostingplus.cl/cart.php?gid=13" }
    },
    hightraffic: {
      hosting: { name: "HostingPlus Cloud VPS", features: ["Recursos dedicados", "Escalabilidad", "Root access"], url: "https://clientes.hostingplus.cl/cart.php?gid=17" }
    }
  };

  // Educational resources based on site type
  const educationalResources = {
    ecommerce: [
      { title: "Optimizando tu tienda online para ventas en Chile", url: "https://eligetuhosting.cl/guias/optimizar-ecommerce/" },
      { title: "Mejores prácticas de SEO para e-commerce en 2025", url: "https://eligetuhosting.cl/guias/seo-ecommerce/" }
    ],
    blog: [
      { title: "Cómo aumentar el tráfico de tu blog", url: "https://eligetuhosting.cl/guias/aumentar-trafico-blog/" },
      { title: "WordPress: Guía de optimización definitiva", url: "https://eligetuhosting.cl/guias/optimizar-wordpress/" }
    ],
    corporate: [
      { title: "Cómo proyectar confianza con tu sitio corporativo", url: "https://eligetuhosting.cl/guias/sitio-corporativo/" },
      { title: "Estrategias digitales B2B para empresas chilenas", url: "https://eligetuhosting.cl/guias/estrategias-b2b/" }
    ],
    hightraffic: [
      { title: "Escalando tu infraestructura web", url: "https://eligetuhosting.cl/guias/escalar-web/" },
      { title: "Guía de optimización para sitios de alto tráfico", url: "https://eligetuhosting.cl/guias/optimizar-alto-trafico/" }
    ]
  };

  const getActiveRecommendation = () => {
    if (!siteType) return null;
    return recommendations[siteType as keyof typeof recommendations];
  };

  const getActiveResources = () => {
    if (!siteType) return [];
    return educationalResources[siteType as keyof typeof educationalResources];
  };

  const activeRecommendation = getActiveRecommendation();
  const activeResources = getActiveResources();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recomendaciones personalizadas</h2>
      
      <Card className="shadow-sm">
        <CardHeader className="bg-white py-4">
          <CardTitle className="flex items-center text-lg">
            <Lightbulb className="h-5 w-5 mr-2 text-blue-700" />
            Configura tus preferencias
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ¿Qué tipo de sitio web tienes o planeas crear?
            </label>
            <Select onValueChange={setSiteType} value={siteType}>
              <SelectTrigger className="w-full md:w-2/3">
                <SelectValue placeholder="Selecciona el tipo de sitio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ecommerce">Tienda online (E-commerce)</SelectItem>
                <SelectItem value="blog">Blog o sitio de contenido</SelectItem>
                <SelectItem value="corporate">Sitio corporativo</SelectItem>
                <SelectItem value="hightraffic">Sitio de alto tráfico</SelectItem>
              </SelectContent>
            </Select>
            
            {!ipChile && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm flex items-start">
                  <InfoIcon className="h-4 w-4 mr-1 mt-0.5 text-yellow-500 flex-shrink-0" />
                  <span>
                    Tu dominio <strong>{domainName}</strong> no utiliza una IP chilena. 
                    Esto puede afectar el rendimiento y SEO local. Nuestras recomendaciones incluirán 
                    opciones para mejorar esto.
                  </span>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {siteType && (
        <>
          {/* Hosting Recommendation */}
          <Card className="shadow-sm">
            <CardHeader className="bg-white py-4">
              <CardTitle className="flex items-center text-lg">
                <Package className="h-5 w-5 mr-2 text-blue-700" />
                Hosting recomendado para {siteType === 'ecommerce' ? 'tu tienda online' : 
                                        siteType === 'blog' ? 'tu blog' : 
                                        siteType === 'corporate' ? 'tu empresa' : 
                                        'tu sitio de alto tráfico'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {activeRecommendation?.hosting && (
                <div className="flex flex-col md:flex-row items-stretch border rounded-md overflow-hidden">
                  <div className="p-4 md:p-6 flex-grow">
                    <h3 className="font-bold text-lg mb-3">{activeRecommendation.hosting.name}</h3>
                    <ul className="space-y-2">
                      {activeRecommendation.hosting.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <Button asChild className="bg-[#EF233C] hover:bg-[#d01d34] text-white">
                        <a href={activeRecommendation.hosting.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <Zap className="mr-1 h-4 w-4" />
                          Ver planes
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 md:p-6 md:w-1/3 flex flex-col justify-center">
                    <h4 className="font-medium mb-2">¿Por qué esta opción?</h4>
                    <p className="text-sm text-gray-700">
                      {!ipChile
                        ? "Al migrar a una IP chilena, mejorarás significativamente la velocidad de carga para visitantes locales y tu posicionamiento en buscadores para Chile."
                        : siteType === 'ecommerce'
                          ? "Las tiendas online necesitan alta velocidad y disponibilidad para maximizar conversiones. Esta opción está optimizada para e-commerce."
                          : siteType === 'blog'
                            ? "Para un blog exitoso, necesitas velocidad de carga óptima y herramientas que faciliten la gestión de contenido."
                            : siteType === 'corporate'
                              ? "Un sitio corporativo requiere alta disponibilidad y profesionalismo. Esta opción garantiza la mejor imagen para tu empresa."
                              : "Los sitios de alto tráfico necesitan recursos dedicados y escalabilidad para mantener una experiencia fluida para todos los usuarios."
                      }
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Educational Resources */}
          <Card className="shadow-sm">
            <CardHeader className="bg-white py-4">
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="h-5 w-5 mr-2 text-blue-700" />
                Recursos educativos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {activeResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeResources.map((resource, index) => (
                    <a 
                      key={index} 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="border rounded-md p-4 hover:bg-blue-50 transition-colors flex items-center"
                    >
                      <BookOpen className="h-5 w-5 mr-3 text-blue-600" />
                      <span>{resource.title}</span>
                      <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No hay recursos disponibles para este tipo de sitio</p>
              )}
            </CardContent>
          </Card>

          {/* Migration CTA if not Chilean IP */}
          {!ipChile && (
            <Card className="shadow-sm border-l-4 border-l-[#EF233C]">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <h3 className="font-bold text-lg">¿Tu IP no es chilena?</h3>
                    <p className="text-gray-700 mt-1">
                      Mejora tu velocidad para usuarios locales y SEO con una migración gratuita a un hosting con IP chilena.
                    </p>
                  </div>
                  <div className="md:ml-auto">
                    <Button asChild className="bg-[#EF233C] hover:bg-[#d01d34] text-white">
                      <a href="/cotiza-hosting" className="whitespace-nowrap">
                        Migrar gratis
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Show this when no selections made */}
      {!siteType && (
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 mx-auto text-blue-200" />
          <p className="mt-3 text-gray-500">
            Selecciona el tipo de sitio para ver recomendaciones personalizadas
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;
