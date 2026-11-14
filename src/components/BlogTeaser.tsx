import React from 'react';
import BlogCard from './BlogCard';
import { BLOG_POSTS } from '@/components/lectura/blogPosts';

/** Últimos artículos del blog: lee la misma lista que /blog, así que nunca enlaza a un artículo inexistente. */
const BlogTeaser = () => (
  <section id="blog" aria-labelledby="blog-teaser" className="container py-14 md:py-20">
    <h2 id="blog-teaser" className="t-h2 mb-8 text-ink">
      Últimos artículos
    </h2>
    <div className="grid gap-6 md:grid-cols-3">
      {BLOG_POSTS.slice(0, 3).map((p) => (
        <BlogCard key={p.slug} title={p.title} href={`/blog/${p.slug}`} imageSrc={p.image} />
      ))}
    </div>
  </section>
);

export default BlogTeaser;
