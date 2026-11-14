import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import ReadingLayout from '@/components/reading/ReadingLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Migas from '@/components/lectura/Migas';
import { withHeadingIds } from '@/components/lectura/headings';
import { BLOG_POSTS, findBlogAlias, findBlogPost, type BlogPostData } from '@/components/lectura/blogPosts';
import { formatDataDate, isoDate } from '@/lib/format';

const PostDate: React.FC<{ date: string }> = ({ date }) => (
  <time dateTime={isoDate(date)}>{formatDataDate(date)}</time>
);

/** Slug que no corresponde a ningún artículo publicado. */
const BlogNotFound: React.FC = () => (
  <>
    <DynamicMetaTags
      title="Artículo no encontrado"
      description="Este artículo del blog no existe o cambió de dirección. Revisa los artículos publicados en el blog de EligeTuHosting."
    />
    <Helmet>
      <meta name="robots" content="noindex" />
    </Helmet>
    <Navbar />
    <main>
      <ReadingLayout
        breadcrumbs={<Migas items={[{ name: 'Inicio', href: '/' }, { name: 'Blog', href: '/blog' }, { name: 'Artículo no encontrado' }]} />}
        title="No encontramos este artículo"
        lead="Puede que el enlace esté mal escrito o que el artículo ya no exista. Estos son los que tenemos publicados."
      >
        <ul>
          {BLOG_POSTS.map((p) => (
            <li key={p.slug}>
              <Link to={`/blog/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
        <p>
          <Link to="/blog">Ver todos los artículos del blog</Link>
        </p>
      </ReadingLayout>
    </main>
    <Footer />
  </>
);

const Relacionados: React.FC<{ posts: BlogPostData[] }> = ({ posts }) => (
  <section aria-labelledby="relacionados">
    <h2 id="relacionados" className="t-h3 text-ink">
      Sigue leyendo
    </h2>
    <ul className="mt-4 divide-y divide-rule border-y border-rule">
      {posts.map((p) => (
        <li key={p.slug} className="flex items-center gap-4 py-4">
          <img
            src={p.image}
            alt=""
            width={1200}
            height={630}
            loading="lazy"
            className="aspect-[40/21] w-28 shrink-0 rounded-lg border border-rule object-cover sm:w-36"
          />
          <div className="min-w-0">
            <Link
              to={`/blog/${p.slug}`}
              className="font-semibold text-ink underline decoration-ink/20 underline-offset-[3px] hover:decoration-ink"
            >
              {p.title}
            </Link>
            <p className="t-meta mt-1">
              <PostDate date={p.date} />
            </p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

const BlogPost = () => {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const post = findBlogPost(slug);
  if (!post) {
    const alias = findBlogAlias(slug);
    if (alias) return <Navigate to={`/blog/${alias.slug}`} replace />;
    return <BlogNotFound />;
  }

  const { html, toc } = withHeadingIds(post.content);
  const seoImage = post.seoImage ?? post.image;
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <DynamicMetaTags
        title={post.title}
        description={post.excerpt}
        type="article"
        ogImage={seoImage.startsWith('http') ? seoImage : `https://eligetuhosting.cl${seoImage}`}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.excerpt,
            "image": `https://eligetuhosting.cl${seoImage}`,
            "datePublished": post.date,
            "dateModified": post.date,
            "author": {
              "@type": "Person",
              "name": post.author,
              "jobTitle": post.authorPosition
            },
            "publisher": {
              "@type": "Organization",
              "name": "EligeTuHosting.cl",
              "logo": {
                "@type": "ImageObject",
                "url": "https://eligetuhosting.cl/favicon-logo.svg",
                "width": "512",
                "height": "512"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://eligetuhosting.cl/blog/${slug || 'default'}`
            },
            "articleSection": post.category,
            "wordCount": post.content.split(' ').length,
            "timeRequired": post.readTime,
            "about": ["hosting", "chile", "tecnología web", "servidores"],
            "inLanguage": "es"
          })}
        </script>
      </Helmet>

      <Navbar />

      <main>
        <ReadingLayout
          breadcrumbs={<Migas items={[{ name: 'Inicio', href: '/' }, { name: 'Blog', href: '/blog' }, { name: post.title }]} />}
          title={post.title}
          lead={post.excerpt}
          meta={
            <>
              <Badge variant="outline">{post.category}</Badge>
              <span>
                Por <span className="font-semibold text-ink-2">{post.author}</span>, {post.authorPosition}
              </span>
              <PostDate date={post.date} />
              <span>{post.readTime} de lectura</span>
            </>
          }
          image={
            <img
              src={post.image}
              alt=""
              width={1200}
              height={630}
              className="aspect-[40/21] w-full max-w-3xl rounded-xl border border-rule object-cover"
            />
          }
          toc={toc}
          footer={
            <div className="space-y-12">
              <section aria-labelledby="comparar" className="rounded-xl border border-rule bg-paper p-6 md:p-8">
                <h2 id="comparar" className="t-h3 text-ink">
                  ¿Necesitas un hosting confiable?
                </h2>
                <p className="t-body mt-2 max-w-[62ch] text-ink-2">
                  Compara los mejores proveedores de hosting en Chile y encuentra el ideal para tu proyecto.
                </p>
                <Button asChild variant="brand" className="mt-5">
                  <Link to="/comparativa">
                    Comparar
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </section>
              {related.length > 0 && <Relacionados posts={related} />}
              <RecommendedByData />
            </div>
          }
        >
          <div className="[&_h2]:scroll-mt-24" dangerouslySetInnerHTML={{ __html: html }} />
        </ReadingLayout>
      </main>

      <Footer />
    </>
  );
};

export default BlogPost;
