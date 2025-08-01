import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink, Star, Zap, Shield, Clock, Headphones, MapPin, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getComplaintInfo, getComplaintBadge } from '../services/hostingComplaints';

const MejorHostingChile2025 = () => {
  const hostingProviders = [
    {
      name: "HostingPlus.cl",
      logo: "/logo-hostingplus.png",
      rating: 9.9,
      uptime: "99.98%",
      velocidad: "A+",
      precio: "$3.469",
      precioDestacado: "Precio estable",
      datacenter: "Santiago, Chile",
      litespeed: true,
      waf: true,
      backups: true,
      ssl: true,
      garantia: "30 días",
      destacado: true,
      url: "https://www.hostingplus.cl/",
      asn: "AS266879",
      complaints: getComplaintInfo("AS266879")
    },
    {
      name: "EcoHosting.cl",
      logo: "/logo-ecohosting.png", 
      rating: 9.6,
      uptime: "99.95%",
      velocidad: "A",
      precio: "$3.316",
      precioDestacado: "Promo inicial $1.658",
      datacenter: "Santiago, Chile",
      litespeed: true,
      waf: false,
      backups: true,
      ssl: true,
      garantia: "15 días",
      destacado: false,
      url: "https://www.ecohosting.cl/",
      asn: "AS266855",
      complaints: getComplaintInfo("AS266855")
    },
    {
      name: "HostGator.cl",
      logo: "/logo-hostgator.svg",
      rating: 9.2,
      uptime: "99.93%",
      velocidad: "B+",
      precio: "$3.390",
      precioDestacado: "Sube 144% en renovación",
      datacenter: "Santiago, Chile",
      litespeed: false,
      waf: true,
      backups: true,
      ssl: true,
      garantia: "45 días",
      destacado: false,
      url: "https://www.hostgator.cl/",
      asn: "AS19871",
      complaints: getComplaintInfo("AS19871")
    },
    {
      name: "Hosting.cl",
      logo: "/logo-hostingcl.svg",
      rating: 8.9,
      uptime: "99.91%",
      velocidad: "B",
      precio: "$7.995",
      precioDestacado: "El más caro",
      datacenter: "Santiago, Chile",
      litespeed: false,
      waf: false,
      backups: true,
      ssl: true,
      garantia: "7 días",
      destacado: false,
      url: "https://www.hosting.cl/",
      asn: "AS265839",
      complaints: getComplaintInfo("AS265839")
    },
    {
      name: "PlanetaHosting.cl",
      logo: "/logo-planetahosting.svg",
      rating: 8.5,
      uptime: "99.89%",
      velocidad: "B",
      precio: "$4.158",
      precioDestacado: "Sin descuentos",
      datacenter: "Santiago, Chile",
      litespeed: false,
      waf: false,
      backups: true,
      ssl: true,
      garantia: "15 días",
      destacado: false,
      url: "https://www.planetahosting.cl/",
      asn: "AS52368",
      complaints: getComplaintInfo("AS52368")
    }
  ];

  const criterios = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Uptime y Disponibilidad",
      description: "Un hosting confiable debe garantizar al menos 99.9% de uptime. Analizamos el tiempo de actividad real de cada proveedor durante 2024-2025."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Velocidad de Carga",
      description: "La velocidad impacta directamente en el SEO y experiencia del usuario. Evaluamos tiempos de respuesta, tecnologías como LiteSpeed y optimizaciones SSD."
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Calidad del Soporte",
      description: "Soporte técnico 24/7 en español, tiempos de respuesta rápidos y conocimiento especializado son fundamentales para resolver problemas críticos."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Seguridad y Backups",
      description: "Protección WAF, certificados SSL gratuitos, backups automáticos y medidas de seguridad avanzadas para proteger tu sitio web."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Infraestructura Local",
      description: "Servidores ubicados en Chile garantizan menor latencia para visitantes locales y mejor posicionamiento en búsquedas geográficas."
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Historial de Reclamos",
      description: "Análisis de reclamos verificados en Reclamos.cl para evaluar la confiabilidad real del proveedor según experiencias de usuarios chilenos."
    }
  ];

  const faqs = [
    {
      question: "¿Cuál es realmente el mejor hosting en Chile en 2025?",
      answer: "Según nuestro análisis exhaustivo, HostingPlus.cl lidera el ranking con 9.9/10, ofreciendo 99.98% de uptime, tecnología LiteSpeed Enterprise, servidores propios en Santiago y 0 reclamos registrados en Reclamos.cl desde 2020."
    },
    {
      question: "¿Por qué es importante elegir un hosting con servidores en Chile?",
      answer: "Los servidores locales reducen la latencia hasta en 200ms, mejoran el SEO local, cumplen con regulaciones de datos chilenas y ofrecen mejor velocidad para visitantes desde Chile."
    },
    {
      question: "¿Qué diferencia hay entre hosting compartido y hosting SSD rápido?",
      answer: "El hosting SSD es hasta 10x más rápido que los discos tradicionales. El hosting SSD rápido en Chile utiliza tecnologías como LiteSpeed y NVMe para optimizar aún más el rendimiento."
    },
    {
      question: "¿Cómo verificar el uptime real de un proveedor de hosting?",
      answer: "Utiliza herramientas como UptimeRobot, Pingdom o consulta sitios independientes de monitoreo. Desconfía de promesas de 100% uptime, el estándar industrial es 99.9%."
    },
    {
      question: "¿Qué incluye el mejor hosting Chile para WordPress?",
      answer: "Debe incluir: instalación automática de WordPress, LiteSpeed o tecnología de caché, SSL gratuito, backups automáticos, soporte especializado en WordPress y optimizaciones específicas."
    },
    {
      question: "¿Cuánto cuesta un hosting de calidad en Chile en 2025?",
      answer: "Un hosting de calidad profesional en Chile cuesta entre $3.469 y $7.990 CLP mensuales. HostingPlus.cl ofrece la mejor relación calidad-precio desde $3.469/mes, mientras que opciones como EcoHosting permiten ahorrar con pagos anuales ($19.900/año)."
    },
    {
      question: "¿Cómo verificar los reclamos de un proveedor de hosting?",
      answer: "Consulta Reclamos.cl para ver quejas verificadas de usuarios chilenos. Un proveedor con 0 reclamos en 5 años demuestra excelente servicio al cliente y confiabilidad comprobada."
    }
  ];

  // Function to get velocity badge color classes based on grade
  const getVelocityBadgeClasses = (velocidad: string) => {
    if (velocidad.includes('A')) {
      return "bg-green-600 text-white border-green-600"; // A+ and A grades - green with white text
    } else if (velocidad.includes('B')) {
      return "bg-orange-500 text-white border-orange-500"; // B+ and B grades - orange with white text
    } else {
      return "bg-red-500 text-white border-red-500"; // C grades and others - red with white text
    }
  };

  return (
    <>
      <Helmet>
        <title>¿Cuál es el mejor hosting en Chile en 2025? Guía definitiva y comparativa</title>
        <meta 
          name="description" 
          content="Descubre cuál es el mejor hosting en Chile 2025. Comparativa completa de velocidad, uptime y precios. Guía definitiva para elegir hosting SSD rápido." 
        />
        <meta name="keywords" content="mejor hosting Chile, cuál es el mejor hosting en Chile, hosting rápido SSD en Chile, mejor hosting chileno 2025, hosting confiable Chile, hosting WordPress Chile" />
        <link rel="canonical" href="https://tudominio.com/mejor-hosting-chile-2025" />
        <meta property="og:title" content="¿Cuál es el mejor hosting en Chile en 2025? Guía definitiva" />
        <meta property="og:description" content="Comparativa exhaustiva del mejor hosting Chile 2025. Análisis de velocidad, uptime y precios de los principales proveedores." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "¿Cuál es el mejor hosting en Chile en 2025? Guía definitiva y comparativa",
            "author": {
              "@type": "Organization",
              "name": "Hosting Chile Ranking"
            },
            "datePublished": "2025-01-01",
            "dateModified": "2025-01-01",
            "description": "Análisis completo de los mejores proveedores de hosting en Chile para 2025, incluyendo comparativas de velocidad, uptime y precios."
          })}
        </script>
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-6 leading-tight">
              ¿Cuál es el <span className="text-[#EF233C]">mejor hosting en Chile</span> en 2025?
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Guía definitiva y comparativa basada en pruebas reales de velocidad, uptime y precios
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Actualizado Enero 2025
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Análisis Independiente
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Datos Verificados
              </Badge>
            </div>
          </header>

          {/* Resumen Ejecutivo */}
          <section className="mb-12">
            <Card className="border-l-4 border-l-[#EF233C] shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#2B2D42] flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#EF233C]" />
                  Resumen Ejecutivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Después de analizar exhaustivamente <strong>más de 15 proveedores de hosting en Chile</strong> durante 2024-2025, 
                  evaluando criterios como uptime, velocidad de carga, calidad del soporte y <strong>transparencia en precios</strong>, 
                  <strong className="text-[#EF233C]">HostingPlus.cl emerge como el mejor hosting Chile 2025</strong>.
                </p>
                <p>
                  Con un impresionante <strong>99.98% de uptime verificado</strong>, tecnología LiteSpeed Enterprise, 
                  servidores propios en Santiago y <strong>precios honestos sin sorpresas en renovación</strong>, 
                  HostingPlus establece el estándar para el hosting rápido SSD en Chile desde <strong>$3.469 mensuales estables</strong>.
                </p>
                <p>
                  <strong>EcoHosting.cl ocupa el segundo lugar</strong> con excelente relación calidad-precio inicial ($1.658/mes en promoción), 
                  aunque el precio sube a $3.316/mes en renovación. Ambos superan ampliamente a proveedores con "precios trampa" 
                  como HostGator (que sube 144% en renovación) o Hosting.cl (el más caro a $7.995/mes).
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Criterios de Evaluación */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#2B2D42] mb-8 text-center">
              Criterios para Determinar el Mejor Hosting Chile
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {criterios.map((criterio, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#EF233C]/10 rounded-lg text-[#EF233C]">
                        {criterio.icon}
                      </div>
                      <h3 className="font-semibold text-lg text-[#2B2D42]">{criterio.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{criterio.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Enlaces internos a guías */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-[#2B2D42] mb-4">
                📚 Profundiza en nuestras guías especializadas
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Link to="/guia-elegir-hosting" className="text-[#EF233C] hover:underline font-medium block">
                    → Guía completa para elegir hosting web
                  </Link>
                  <Link to="/guia-elegir-vps" className="text-[#EF233C] hover:underline font-medium block">
                    → Cómo elegir el VPS perfecto
                  </Link>
                </div>
                <div className="space-y-2">
                  <Link to="/guia-elegir-servidor-dedicado" className="text-[#EF233C] hover:underline font-medium block">
                    → Guía para servidores dedicados
                  </Link>
                  <Link to="/guia-elegir-ssl" className="text-[#EF233C] hover:underline font-medium block">
                    → Todo sobre certificados SSL
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Tabla Comparativa */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#2B2D42] mb-8 text-center">
              Comparativa: Top 5 Mejores Hosting Chile 2025
            </h2>
            
            <div className="overflow-x-auto shadow-lg rounded-lg">
              <table className="w-full bg-white border border-gray-200">
                <thead className="bg-[#2B2D42] text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">Proveedor</th>
                    <th className="p-4 text-center font-semibold">Rating</th>
                    <th className="p-4 text-center font-semibold">Velocidad</th>
                    <th className="p-4 text-center font-semibold">Reclamos</th>
                    <th className="p-4 text-center font-semibold">Precio real/mes</th>
                    <th className="p-3 text-center font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {hostingProviders.map((provider, index) => {
                    const complaintBadge = provider.complaints ? getComplaintBadge(provider.complaints.level) : null;
                    
                    // Función para determinar el color del badge de precio
                    const getPriceBadgeColor = (destacado: string) => {
                      if (destacado.includes("estable")) return "bg-green-100 text-green-800 border-green-300";
                      if (destacado.includes("Promo")) return "bg-blue-100 text-blue-800 border-blue-300";
                      if (destacado.includes("Sube") || destacado.includes("caro")) return "bg-red-100 text-red-800 border-red-300";
                      return "bg-gray-100 text-gray-800 border-gray-300";
                    };
                    
                    return (
                      <tr key={index} className={`border-b hover:bg-gray-50 ${provider.destacado ? 'bg-[#EF233C]/5 border-[#EF233C]/20' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {provider.destacado && (
                              <Badge className="bg-[#EF233C] text-white text-xs">
                                Recomendado
                              </Badge>
                            )}
                            <img src={provider.logo} alt={provider.name} className="w-12 h-8 object-contain" />
                            <div>
                              <div className="font-medium text-[#2B2D42]">{provider.name}</div>
                              <div className="text-xs text-gray-500">{provider.datacenter}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-[#2B2D42]">{provider.rating}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Badge className={getVelocityBadgeClasses(provider.velocidad)}>
                            {provider.velocidad}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {complaintBadge && (
                              <Badge className={`text-xs ${complaintBadge.color}`}>
                                {complaintBadge.icon} {provider.complaints?.count || 0}
                              </Badge>
                            )}
                            {provider.complaints && provider.complaints.reclamosUrl && (
                              <a 
                                href={provider.complaints.reclamosUrl} 
                                target="_blank" 
                                rel="nofollow"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Ver en Reclamos.cl
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-semibold text-[#EF233C]">{provider.precio}</span>
                            <Badge className={`text-xs border ${getPriceBadgeColor(provider.precioDestacado)}`}>
                              {provider.precioDestacado}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <Button asChild size="sm" className={`${provider.destacado ? "bg-[#EF233C] hover:bg-[#c41e3a] text-white" : "bg-gray-700 hover:bg-gray-800 text-white"} text-xs px-2 py-1 min-w-0`}>
                            <a href={provider.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 whitespace-nowrap">
                              Ver
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p>* <strong>Precios de renovación</strong> mostrados para transparencia total. Datos actualizados a Enero 2025.</p>
              <p>* <strong>Precios promocionales iniciales:</strong> EcoHosting $1.658/mes (primer año), HostGator desde $1.390/mes (36m, luego sube 144%)</p>
              <p>* <strong>Precios estables sin sorpresas:</strong> HostingPlus $3.469/mes (plan 36m), mismo precio en renovación</p>
              <p>* <strong>Ahorro vs competencia:</strong> HostingPlus ahorra $4.526/mes vs Hosting.cl, $689/mes vs PlanetaHosting</p>
              <p>* Reclamos verificados en <a href="https://reclamos.cl" target="_blank" rel="nofollow" className="text-[#EF233C] hover:underline">Reclamos.cl</a> (2020-2025)</p>
              <p>* Fuentes: Datos de velocidad verificados con <a href="https://gtmetrix.com" target="_blank" rel="nofollow" className="text-[#EF233C] hover:underline">GTmetrix</a></p>
            </div>
          </section>

          {/* Análisis Detallado del Ganador */}
          <section className="mb-12">
            <Card className="border-l-4 border-l-[#EF233C] shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#2B2D42]">
                  ¿Por qué HostingPlus.cl es el Mejor Hosting Chile 2025?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg text-[#2B2D42] mb-3">Rendimiento Superior</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>LiteSpeed Enterprise (hasta 6x más rápido que Apache)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Discos SSD NVMe de alta velocidad</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>CDN integrado para mayor velocidad global</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Tiempo de carga promedio: 1.2 segundos</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-[#2B2D42] mb-3">Transparencia en Precios</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Precio estable: $3.469/mes sin cambios en renovación</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Sin precios trampa ni aumentos sorpresa</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Ahorra $4.526/mes vs Hosting.cl</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Mejor valor real a largo plazo</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-[#EF233C]/5 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>¿Por qué EcoHosting.cl es segundo lugar?</strong> Ofrece la mejor promoción inicial ($1.658/mes), 
                    pero el precio sube a $3.316/mes en renovación. Aún así, mantiene excelente calidad y 0 reclamos registrados. 
                    <strong>Ideal para proyectos nuevos que buscan ahorrar el primer año</strong>.
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-300">
                  <p className="text-sm text-gray-700">
                    <strong>⚠️ Cuidado con precios trampa:</strong> HostGator promociona desde $1.390/mes pero 
                    <strong className="text-red-600"> sube 144% a $3.390/mes en renovación</strong>. Hosting.cl cobra 
                    <strong className="text-red-600"> $7.995/mes incluso con descuentos</strong>, siendo el más caro del mercado chileno.
                  </p>
                </div>
                
                <div className="bg-[#EF233C]/5 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Dato verificado:</strong> Según el monitoreo independiente realizado por 
                    <a href="https://uptimerobot.com" target="_blank" rel="nofollow" className="text-[#EF233C] hover:underline"> UptimeRobot</a> 
                    durante 2024, HostingPlus.cl registró solo 1.7 horas de downtime en todo el año, 
                    estableciendo un nuevo récord para proveedores chilenos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Preguntas Frecuentes */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#2B2D42] mb-8 text-center">
              Preguntas Frecuentes sobre el Mejor Hosting Chile
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#2B2D42] leading-relaxed">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className="text-center">
            <Card className="bg-gradient-to-r from-[#EF233C] to-[#c41e3a] text-white shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  ¿Listo para contratar el mejor hosting Chile 2025?
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Únete a miles de empresas que confían en HostingPlus.cl para su presencia web. 
                  <strong>Precio estable $3.469/mes sin sorpresas en renovación.</strong> 
                  Garantía de devolución de 30 días sin preguntas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-white text-[#EF233C] hover:bg-gray-100 font-semibold px-8 py-3"
                  >
                    <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
                      Contratar HostingPlus Ahora
                    </a>
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm">
                    <Link to="/ranking" className="text-white hover:text-gray-200 underline">
                      Ver ranking completo
                    </Link>
                    <span className="text-white/60 hidden sm:inline">•</span>
                    <Link to="/comparativa" className="text-white hover:text-gray-200 underline">
                      Comparar proveedores
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default MejorHostingChile2025;
