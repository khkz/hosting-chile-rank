import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Migas from '@/components/lectura/Migas';
import { BLOG_POSTS, blogCategories, type BlogPostData } from '@/components/lectura/blogPosts';
import { formatDataDate, formatInteger, isoDate } from '@/lib/format';

const ArticleRow: React.FC<{ post: BlogPostData }> = ({ post }) => (
  <article className="grid gap-5 py-8 first:pt-0 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-8">
    <img
      src={post.image}
      alt=""
      width={1200}
      height={630}
      loading="lazy"
      className="aspect-[40/21] w-full rounded-xl border border-rule object-cover"
    />
    <div className="min-w-0">
      <div className="t-meta flex flex-wrap items-center gap-x-3 gap-y-1">
        <Badge variant="outline">{post.category}</Badge>
        <time dateTime={isoDate(post.date)}>{formatDataDate(post.date)}</time>
        <span>{post.readTime} de lectura</span>
      </div>
      <h3 className="t-h3 mt-3 text-ink">
        <Link to={`/blog/${post.slug}`} className="hover:underline hover:decoration-ink/40 hover:underline-offset-4">
          {post.title}
        </Link>
      </h3>
      <p className="t-body mt-2 max-w-[62ch] text-ink-2">{post.excerpt}</p>
      <p className="t-meta mt-3">
        Por <span className="font-semibold text-ink-2">{post.author}</span>
      </p>
      <Link
        to={`/blog/${post.slug}`}
        className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
      >
        Leer el artículo
        <span className="sr-only">: {post.title}</span>
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  </article>
);

const Blog = () => {
  const [category, setCategory] = useState<string | null>(null);
  const categories = blogCategories();
  const posts = category ? BLOG_POSTS.filter((p) => p.category === category) : BLOG_POSTS;
  const total = BLOG_POSTS.length;

  const chip = (active: boolean) =>
    cn(
      'inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors',
      active ? 'border-ink bg-ink text-white' : 'border-rule bg-white text-ink hover:border-ink',
    );

  return (
    <>
      <DynamicMetaTags
        title="Blog Hosting Chile"
        description="Información actualizada sobre hosting, WordPress, seguridad web y tecnologías para tu sitio. Guías, tutoriales y consejos de expertos."
        keywords="blog hosting, wordpress chile, seguridad web, tutoriales hosting, guías web"
      />

      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={<Migas items={[{ name: 'Inicio', href: '/' }, { name: 'Blog' }]} />}
          title="Blog de eligetuhosting.cl"
          lead="Guías, tutoriales y consejos sobre hosting, WordPress y desarrollo web para ayudarte a mejorar tu presencia online."
          meta={
            <span>
              {formatInteger(total)} {total === 1 ? 'artículo publicado' : 'artículos publicados'}
            </span>
          }
        />

        <Section title="Artículos recientes" density="tight">
          <div role="group" aria-label="Filtrar por categoría" className="mb-8 flex flex-wrap gap-2">
            <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)} className={chip(category === null)}>
              Todas
              <span className="tabular opacity-75">{formatInteger(total)}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                type="button"
                aria-pressed={category === c.name}
                onClick={() => setCategory(c.name)}
                className={chip(category === c.name)}
              >
                {c.name}
                <span className="tabular opacity-75">{formatInteger(c.count)}</span>
              </button>
            ))}
          </div>

          <div className="divide-y divide-rule" aria-live="polite">
            {posts.map((post) => (
              <ArticleRow key={post.slug} post={post} />
            ))}
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
