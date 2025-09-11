
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';

// Datos simulados de posts del blog
const blogPosts = [
  {
    id: 1,
    slug: 'mejores-servidores-web-2025',
    title: 'Los 5 mejores servidores web en 2025',
    excerpt: 'Una comparativa detallada de los servidores web más eficientes y seguros para tu sitio. Analizamos LiteSpeed, Nginx, Apache y alternativas emergentes.',
    date: '2 de mayo, 2025',
    author: 'Ana Martínez',
    category: 'Tecnología',
    image: '/placeholder.svg',
    readTime: '8 min'
  },
  {
    id: 2,
    slug: 'optimizacion-wordpress-hosting',
    title: 'Cómo optimizar tu WordPress en cualquier hosting',
    excerpt: 'Guía paso a paso para mejorar el rendimiento de tu sitio WordPress independientemente del proveedor de hosting que utilices.',
    date: '28 de abril, 2025',
    author: 'Carlos Vega',
    category: 'WordPress',
    image: '/placeholder.svg',
    readTime: '12 min'
  },
  {
    id: 3,
    slug: 'hosting-ecologico-tendencia',
    title: 'Hosting ecológico: La tendencia que está cambiando la industria',
    excerpt: 'Conoce cómo los proveedores de hosting están adoptando prácticas sostenibles y por qué deberías considerarlo para tu próximo proyecto.',
    date: '15 de abril, 2025',
    author: 'María González',
    category: 'Sostenibilidad',
    image: '/placeholder.svg',
    readTime: '6 min'
  },
  {
    id: 4,
    slug: 'seguridad-sitio-web-hosting',
    title: '10 medidas de seguridad esenciales para tu sitio web',
    excerpt: 'Protege tu sitio web de amenazas con estas estrategias de seguridad fundamentales que todo administrador web debería implementar.',
    date: '5 de abril, 2025',
    author: 'Diego Rojas',
    category: 'Seguridad',
    image: '/placeholder.svg',
    readTime: '9 min'
  },
  {
    id: 5,
    slug: 'migracion-hosting-sin-problemas',
    title: 'Cómo migrar de hosting sin perder SEO ni visitas',
    excerpt: 'Guía completa para cambiar de proveedor de hosting manteniendo intacto tu posicionamiento en buscadores y evitando tiempos de inactividad.',
    date: '22 de marzo, 2025',
    author: 'Laura Castro',
    category: 'SEO',
    image: '/placeholder.svg',
    readTime: '10 min'
  },
  {
    id: 6,
    slug: 'crecimiento-hosting-latinoamerica',
    title: 'El crecimiento del mercado de hosting en Latinoamérica',
    excerpt: 'Análisis del rápido desarrollo de la industria de hosting web en la región y las oportunidades que presenta para emprendedores digitales.',
    date: '10 de marzo, 2025',
    author: 'Roberto Sánchez',
    category: 'Mercado',
    image: '/placeholder.svg',
    readTime: '7 min'
  }
];

// Categorías populares
const popularCategories = [
  { name: 'WordPress', count: 12 },
  { name: 'Seguridad', count: 9 },
  { name: 'Rendimiento', count: 8 },
  { name: 'SEO', count: 7 },
  { name: 'Tecnología', count: 6 },
  { name: 'Mercado', count: 5 },
  { name: 'Sostenibilidad', count: 4 },
];

const Blog = () => {
  useEffect(() => {
    document.title = "Blog sobre hosting | eligetuhosting.cl";
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog Hosting Chile | EligeTuHosting.cl</title>
        <meta 
          name="description" 
          content="Información actualizada sobre hosting, WordPress, seguridad web y tecnologías para tu sitio. Guías, tutoriales y consejos de expertos." 
        />
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#F7F9FC]">
        {/* Hero section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-6">
                Blog de eligetuhosting.cl
              </h1>
              <p className="text-lg text-[#555]">
                Guías, tutoriales y consejos sobre hosting, WordPress y desarrollo web para ayudarte a 
                mejorar tu presencia online.
              </p>
            </div>
          </div>
        </section>
        
        {/* Blog posts grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main content - Posts */}
              <div className="md:col-span-2 space-y-8">
                <h2 className="text-2xl font-bold mb-6">Artículos recientes</h2>
                
                {blogPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <CardHeader>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span className="bg-[#EDF2F4] px-2 py-0.5 rounded">{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>
                          <CardTitle className="text-xl">
                            <Link to={`/blog/${post.slug}`} className="hover:text-[#EF233C]">
                              {post.title}
                            </Link>
                          </CardTitle>
                          <CardDescription>
                            {post.excerpt}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Por {post.author} • {post.readTime} de lectura
                          </div>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-[#EF233C] text-sm font-medium hover:underline"
                          >
                            Leer más →
                          </Link>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {/* Paginación */}
                <div className="flex justify-center pt-6">
                  <nav className="flex items-center gap-1">
                    <button className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-gray-100">
                      <span className="sr-only">Anterior</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-md border bg-[#EF233C] text-white">1</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-gray-100">2</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-gray-100">3</button>
                    <span className="w-10 h-10 flex items-center justify-center">...</span>
                    <button className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-gray-100">8</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-gray-100">
                      <span className="sr-only">Siguiente</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-8">
                {/* Search */}
                <Card>
                  <CardHeader>
                    <CardTitle>Buscar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar artículos..."
                        className="w-full py-2 px-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF233C] focus:border-[#EF233C]"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-2.5">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.3-4.3"/>
                      </svg>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Categorías</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {popularCategories.map((category, index) => (
                        <li key={index}>
                          <Link 
                            to={`/blog/categoria/${category.name.toLowerCase()}`}
                            className="flex justify-between items-center py-1.5 hover:text-[#EF233C]"
                          >
                            <span>{category.name}</span>
                            <span className="bg-[#EDF2F4] text-gray-600 text-xs px-2 py-0.5 rounded-full">{category.count}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                {/* Popular posts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Artículos populares</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {blogPosts.slice(0, 3).map(post => (
                      <div key={post.id} className="flex gap-3">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm line-clamp-2">
                            <Link to={`/blog/${post.slug}`} className="hover:text-[#EF233C]">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Newsletter */}
                <Card className="bg-[#EDF2F4] border-0">
                  <CardHeader>
                    <CardTitle>¿Quieres recibir noticias?</CardTitle>
                    <CardDescription>
                      Suscríbete a nuestro boletín y recibe las últimas noticias y consejos sobre hosting y desarrollo web.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        className="w-full py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF233C] focus:border-[#EF233C]"
                      />
                      <button className="w-full bg-[#EF233C] text-white py-2 rounded-md hover:bg-red-700 transition-colors">
                        Suscribirme
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Blog;
