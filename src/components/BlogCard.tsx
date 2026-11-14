import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BlogCardProps {
  title: string;
  href: string;
  imageSrc: string;
}

/** Tarjeta de artículo: portada en su proporción (40/21, sin recorte) y título enlazado. */
const BlogCard: React.FC<BlogCardProps> = ({ title, href, imageSrc }) => (
  <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-rule bg-white transition-colors hover:border-ink/40 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
    <img
      src={imageSrc}
      alt=""
      width={1200}
      height={630}
      loading="lazy"
      className="aspect-[40/21] w-full border-b border-rule object-cover"
    />
    <div className="flex flex-1 flex-col p-4">
      <h3 className="font-semibold leading-snug text-ink">
        <Link to={href} className="after:absolute after:inset-0 focus-visible:outline-none">
          {title}
        </Link>
      </h3>
      <p className="t-small mt-auto inline-flex items-center gap-1.5 pt-3 font-semibold text-ink-2">
        Leer el artículo
        <ArrowRight className="h-4 w-4" aria-hidden />
      </p>
    </div>
  </article>
);

export default BlogCard;
