import React from 'react';
import { cn } from '@/lib/utils';
import { EDITORIAL_IMAGES, editorialSrc, type EditorialImageKey } from '@/lib/editorialImages';

interface EditorialImageProps {
  name: EditorialImageKey;
  /** Clases del contenedor (proporción, radio, ancho). Por defecto: rounded-xl. */
  className?: string;
  /** Clases extra para <img>. */
  imgClassName?: string;
  /** Atributo sizes del srcset. */
  sizes?: string;
  /** true solo para la imagen principal de la primera pantalla. */
  priority?: boolean;
  /** Qué mostrar si la imagen todavía no está publicada. Por defecto, nada. */
  fallback?: React.ReactNode;
  /** Texto alternativo propio; si no, el del manifiesto. Usa '' si es decorativa. */
  alt?: string;
}

/**
 * Imagen editorial con srcset WebP. Si la imagen no está publicada
 * (`available: false` en el manifiesto), muestra `fallback` y no rompe el diseño.
 */
const EditorialImage: React.FC<EditorialImageProps> = ({
  name,
  className,
  imgClassName,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  fallback = null,
  alt,
}) => {
  const meta = EDITORIAL_IMAGES[name];
  if (!meta?.available) return <>{fallback}</>;
  const largest = meta.widths[meta.widths.length - 1];
  return (
    <div className={cn('overflow-hidden rounded-xl bg-paper-deep', className)}>
      <img
        src={editorialSrc(name, largest)}
        srcSet={meta.widths.map((w) => `${editorialSrc(name, w)} ${w}w`).join(', ')}
        sizes={sizes}
        alt={alt ?? meta.alt}
        width={largest}
        height={Math.round(largest / meta.ratio)}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // @ts-expect-error fetchpriority aún no está en los tipos de React 18
        fetchpriority={priority ? 'high' : 'auto'}
        style={meta.position ? { objectPosition: meta.position } : undefined}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  );
};

export default EditorialImage;
