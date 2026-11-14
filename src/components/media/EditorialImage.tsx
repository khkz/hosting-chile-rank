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
 * Solo en desarrollo: con `?img-demo` en la URL, las imágenes no publicadas se
 * dibujan como un bloque gris con su proporción, para revisar el diseño con imagen.
 */
const demoMode = (): boolean =>
  import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('img-demo');

/** true si `node` es un <EditorialImage> que hoy no dibujaría nada. */
export function isEmptyEditorial(node: React.ReactNode): boolean {
  if (!React.isValidElement(node) || node.type !== EditorialImage) return false;
  const props = node.props as EditorialImageProps;
  return !EDITORIAL_IMAGES[props.name]?.available && !demoMode() && (props.fallback == null || props.fallback === false);
}

/**
 * Imagen editorial con srcset WebP. Si la imagen no está publicada
 * (`available: false` en el manifiesto), muestra `fallback` y no rompe el diseño.
 */
function EditorialImage({
  name,
  className,
  imgClassName,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  fallback = null,
  alt,
}: EditorialImageProps) {
  const meta = EDITORIAL_IMAGES[name];
  if (!meta?.available) {
    if (demoMode()) {
      return (
        <div
          className={cn('flex items-end overflow-hidden rounded-xl bg-paper-deep p-4', className)}
          style={{ aspectRatio: String(meta?.ratio ?? 16 / 9) }}
          role="img"
          aria-label={`Imagen pendiente: ${name}`}
        >
          <span className="t-meta">Imagen: {name}</span>
        </div>
      );
    }
    return <>{fallback}</>;
  }
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
}

export default EditorialImage;
