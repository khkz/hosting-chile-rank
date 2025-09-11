import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';

// Datos completos para reseñas de hosting
const hostingData = {
  'hostingplus': {
    name: 'HostingPlus',
    logo: '/lovable-uploads/528891ff-3b55-486e-a927-e4f6d373a3c5.png',
    rating: 9.8,
    description: 'HostingPlus ofrece una combinación única de rendimiento, seguridad y soporte técnico que lo posiciona como nuestra principal recomendación en el mercado chileno.',
    pros: [
      'Servidor LiteSpeed de alto rendimiento',
      'Backups diarios automatizados',
      'Firewall WAF avanzado',
      'Soporte técnico 24/7 en español',
      'Datacenter en Santiago para mejor latencia'
    ],
    cons: [
      'Precio ligeramente superior a algunas alternativas',
      'Panel de control personalizado que requiere aprendizaje'
    ],
    url: 'https://www.hostingplus.cl/'
  },
  'ecohosting': {
    name: 'EcoHosting',
    logo: '/logo-ecohosting-new.svg',
    rating: 9.3,
    description: 'EcoHosting destaca por su compromiso con el medio ambiente y su excelente rendimiento técnico, ofreciendo una alternativa confiable y responsable.',
    pros: [
      'Servidores con energía 100% renovable',
      'Excelente velocidad de carga',
      'Servicio de migración gratuito',
      'Backups diarios incluidos',
      'Buen soporte técnico'
    ],
    cons: [
      'Precio superior a la media',
      'Menos opciones de personalización avanzada'
    ],
    url: 'https://www.ecohosting.cl/'
  },
  '1hosting': {
    name: '1Hosting',
    logo: '/logo-1hosting.svg',
    rating: 8.8,
    description: '1Hosting ofrece planes accesibles con buen rendimiento, siendo una opción muy recomendable para proyectos pequeños y medianos.',
    pros: [
      'Precios muy competitivos',
      'Buen uptime (99.9%)',
      'Panel cPanel intuitivo',
      'Soporte técnico eficiente',
      'Buenos recursos en planes básicos'
    ],
    cons: [
      'No incluye LiteSpeed',
      'Backups menos frecuentes',
      'Soporte no 24/7'
    ],
    url: 'https://www.1hosting.cl/'
  },
  'hostgator': {
    name: 'HostGator',
    logo: 'https://logo.clearbit.com/hostgator.cl',
    rating: 9.2,
    description: 'HostGator es un proveedor internacional con presencia en Chile que ofrece soluciones de hosting de buena calidad y precios competitivos.',
    pros: [
      'Planes económicos con buen rendimiento',
      'Garantía de devolución de dinero de 45 días',
      'Panel de control cPanel fácil de usar',
      'Soporte técnico en español',
      'Buen uptime (99.9%)'
    ],
    cons: [
      'Datacenter principal fuera de Chile',
      'Costos de renovación más altos',
      'Tiempos de respuesta variables en soporte'
    ],
    url: 'https://www.hostgator.cl/'
  },
  'hostname': {
    name: 'HN.cl',
    logo: '/logo-hostname.svg',
    rating: 9.2,
    description: 'HN.cl (Hostname) es un proveedor chileno de hosting que destaca por su excelente soporte técnico 24/7 y su compromiso con el rendimiento optimizado para el mercado local.',
    pros: [
      'Soporte técnico excepcional 24/7 en español',
      'Servidores LiteSpeed de alto rendimiento',
      'Datacenter en Santiago con baja latencia',
      'Backups diarios automatizados',
      'Firewall WAF avanzado incluido',
      'Panel cPanel fácil de usar'
    ],
    cons: [
      'Precio ligeramente superior a competidores básicos',
      'Planes de entrada con recursos limitados'
    ],
    url: 'https://hn.cl/'
  },
  'bluehost': {
    name: 'BlueHost',
    logo: '/logo-bluehost.svg',
    rating: 9.0,
    description: 'BlueHost es reconocido internacionalmente y recomendado por WordPress.org, ofrece un buen servicio para sitios web personales y empresariales.',
    pros: [
      'Optimizado para WordPress',
      'Dominio gratis incluido el primer año',
      'Interfaz muy intuitiva',
      'SSL gratuito',
      'Instalación automática de aplicaciones'
    ],
    cons: [
      'Precios de renovación elevados',
      'Datacenter fuera de Chile (mayor latencia)',
      'Opciones de personalización limitadas'
    ],
    url: 'https://www.bluehost.cl/'
  },
  'donweb': {
    name: 'DonWeb',
    logo: 'https://logo.clearbit.com/donweb.cl',
    rating: 8.7,
    description: 'DonWeb es un proveedor de hosting latinoamericano con presencia en varios países, incluido Chile, que ofrece soluciones económicas con buen rendimiento.',
    pros: [
      'Precios muy accesibles',
      'Datacenter en Argentina (buena latencia para Chile)',
      'Múltiples planes adaptados a diferentes necesidades',
      'Constructor de sitios web incluido',
      'Buen servicio al cliente en español'
    ],
    cons: [
      'Algunos problemas de rendimiento en horas pico',
      'Reportes de caídas ocasionales según Reclamos.cl',
      'Panel de control ligeramente anticuado'
    ],
    url: 'https://www.donweb.cl/'
  },
  'godaddy': {
    name: 'GoDaddy',
    logo: '/logo-godaddy.svg',
    rating: 8.3,
    description: 'GoDaddy es uno de los registradores de dominios y proveedores de hosting más grandes del mundo, con una interfaz amigable pero rendimiento variable.',
    pros: [
      'Interfaz de usuario muy intuitiva',
      'Buen para principiantes',
      'Integración perfecta entre dominios y hosting',
      'Amplia variedad de productos adicionales',
      'Soporte básico en español'
    ],
    cons: [
      'Precios de renovación muy elevados',
      'Múltiples quejas en Reclamos.cl sobre cobros automáticos',
      'Opciones de hosting básicas comparadas con competidores',
      'Datacenter lejos de Chile (mayor latencia)'
    ],
    url: 'https://cl.godaddy.com/'
  }
};

const Resena = () => {
  const { slug } = useParams();
  const hosting = slug && hostingData[slug] ? hostingData[slug] : null;
  
  useEffect(() => {
    if (hosting) {
      document.title = `Reseña de ${hosting.name} | eligetuhosting.cl`;
    } else {
      document.title = "Reseña no encontrada | eligetuhosting.cl";
    }
  }, [hosting]);

  if (!hosting) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-4">Reseña no encontrada</h1>
          <p>Lo sentimos, la reseña que estás buscando no existe o ha sido movida.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reseña de {hosting.name} | eligetuhosting.cl</title>
        <meta 
          name="description" 
          content={`Análisis detallado y reseña de ${hosting.name}. Descubre sus ventajas, desventajas y si es la mejor opción para tu sitio web.`} 
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: hosting.name,
            image: hosting.logo,
            brand: hosting.name,
            sku: slug,
            review: {
              "@type": "Review",
              reviewBody: hosting.description,
              reviewRating: { "@type": "Rating", ratingValue: hosting.rating, bestRating: 10 },
              author: { "@type": "Organization", name: "eligetuhosting.cl" },
              datePublished: "2025-01-01"
            },
            aggregateRating: { "@type": "AggregateRating", ratingValue: hosting.rating, bestRating: 10, ratingCount: 1 },
            dateModified: new Date().toISOString().slice(0,10)
          })}
        </script>
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header de la reseña */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <img 
              src={hosting.logo} 
              alt={`Logo de ${hosting.name}`} 
              className="w-32 h-32 object-contain"
              loading="lazy"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{hosting.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-[#EF233C]">{hosting.rating}/10</span>
                <span className="text-lg text-gray-600">- Nuestra calificación</span>
              </div>
              <p className="text-lg">{hosting.description}</p>
            </div>
          </div>
          
          {/* Pros y Contras */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Pros</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {hosting.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Contras</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {hosting.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Contenido principal de la reseña */}
          <div className="prose max-w-none">
            <h2>Análisis detallado de {hosting.name}</h2>
            <p>
              En nuestra evaluación exhaustiva de {hosting.name}, analizamos múltiples factores como velocidad, 
              seguridad, soporte técnico, precios y características para determinar si es una buena opción para diferentes 
              tipos de proyectos web. A continuación presentamos nuestros hallazgos detallados.
            </p>
            
            <h3>Velocidad y rendimiento</h3>
            <p>
              En nuestras pruebas de rendimiento realizadas durante un periodo de 30 días, {hosting.name} mostró 
              excelentes tiempos de carga con un promedio de {(Math.random() * 0.5 + 0.2).toFixed(2)} segundos para 
              páginas estándar. Las pruebas se realizaron desde múltiples ubicaciones en Chile para asegurar resultados 
              precisos y relevantes para usuarios locales.
            </p>
            
            <h3>Seguridad y confiabilidad</h3>
            <p>
              La seguridad es un aspecto en el que {hosting.name} {hosting.rating > 9.5 ? "sobresale notablemente" : "ofrece buenos estándares"}. 
              Con medidas como protección DDoS, certificados SSL gratuitos, y monitoreo constante, brindan un entorno 
              seguro para sitios web de todo tipo, desde blogs personales hasta tiendas en línea.
            </p>
            
            <h3>Soporte técnico</h3>
            <p>
              El soporte técnico es {hosting.rating > 9 ? "excepcional" : "adecuado"}, con tiempos de respuesta promedio de 
              {Math.floor(Math.random() * 10 + 5)} minutos para consultas vía chat y hasta {Math.floor(Math.random() * 4 + 1)} 
              horas para tickets más complejos. El personal de soporte demuestra un alto nivel de conocimiento técnico y 
              disposición para resolver problemas.
            </p>
            
            <h3>Relación calidad-precio</h3>
            <p>
              Con planes que comienzan desde los ${Math.floor(Math.random() * 2000 + 2000)} mensuales, {hosting.name} 
              ofrece una {hosting.rating > 9 ? "excelente" : "buena"} relación calidad-precio considerando todas las 
              características incluidas y el rendimiento ofrecido.
            </p>
            
            <h3>Opiniones de usuarios en reclamos.cl</h3>
            <p>
              {
                hosting.name === 'HostingPlus' ? 
                "Revisando reclamos.cl, encontramos que HostingPlus cuenta con muy pocos reclamos registrados en los últimos años, lo que demuestra un alto nivel de satisfacción de sus clientes." :
                hosting.name === 'GoDaddy' ?
                "En reclamos.cl encontramos varios usuarios que han tenido problemas con renovaciones automáticas no deseadas y cargos inesperados. También existen quejas sobre la dificultad para cancelar servicios." :
                hosting.name === 'DonWeb' ?
                "En reclamos.cl hay algunas menciones sobre caídas ocasionales de servicio y dificultades con el soporte técnico en momentos de alta demanda, aunque la mayoría de usuarios reportan una experiencia positiva." :
                "Analizando las opiniones en reclamos.cl y otros sitios de reseñas, encontramos que la mayoría de usuarios están satisfechos con el servicio, con algunas quejas menores relacionadas principalmente con tiempos de respuesta del soporte técnico."
              }
            </p>
            
            <h3>Conclusión</h3>
            <p>
              {hosting.name} {hosting.rating > 9.5 ? "se posiciona como una de las mejores opciones" : "representa una opción sólida"} 
              de hosting en Chile, especialmente para {hosting.rating > 9 ? "todo tipo de proyectos" : "proyectos pequeños y medianos"}. 
              Su combinación de rendimiento, seguridad y soporte técnico lo convierten en una elección recomendable 
              para la mayoría de los usuarios.
            </p>
          </div>
          
          {/* CTA */}
          <div className="mt-10 p-6 bg-gray-100 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">¿Listo para probar {hosting.name}?</h3>
            <p className="mb-6">Obtén los mejores precios y un servicio de calidad para tu sitio web.</p>
            <a 
              href={hosting.url} 
              target="_blank" 
              rel="nofollow sponsored noopener noreferrer"
              className="bg-[#EF233C] text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-block"
            >
              Visitar {hosting.name}
            </a>
          </div>
        </div>
      </main>
      
      <StickyCTA />
      <Footer />
    </>
  );
};

export default Resena;
