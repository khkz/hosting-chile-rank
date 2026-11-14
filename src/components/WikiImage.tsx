import React from 'react';

interface WikiImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

/** Imagen dentro de un artículo de la wiki, con pie alineado a la izquierda. */
const WikiImage: React.FC<WikiImageProps> = ({ src, alt, caption, className = '' }) => (
  <figure className={`my-8 ${className}`}>
    <div className="overflow-hidden rounded-xl border border-rule bg-paper">
      <img src={src} alt={alt} className="h-auto w-full object-cover" loading="lazy" />
    </div>
    {caption && <figcaption className="t-meta mt-3">{caption}</figcaption>}
  </figure>
);

export default WikiImage;
