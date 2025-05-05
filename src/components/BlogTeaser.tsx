
import React from 'react';
import BlogCard from './BlogCard';

const BlogTeaser = () => {
  return (
    <section id="blog" className="container mx-auto py-16 px-4">
      <h2 className="text-2xl font-semibold text-center mb-8 text-[#2B2D42]">Últimos artículos</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <BlogCard 
          title="LiteSpeed vs Apache 2025" 
          href="/blog/litespeed-vs-apache" 
          imageSrc="/img/post1.webp" 
        />
        <BlogCard 
          title="Cómo migrar tu web a un hosting chileno" 
          href="/blog/migrar-web-chile" 
          imageSrc="/img/post2.webp" 
        />
        <BlogCard 
          title="5 errores al elegir hosting" 
          href="/blog/errores-elegir-hosting" 
          imageSrc="/img/post3.webp" 
        />
      </div>
    </section>
  );
};

export default BlogTeaser;
