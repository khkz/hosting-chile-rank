import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProviderLink } from '@/lib/providerLinks';
import { track } from '@/lib/track';
import { cn } from '@/lib/utils';

interface SiteLinkProps {
  slug: string | null | undefined;
  website: string | null | undefined;
  name: string;
  /** Dónde está el enlace, para la analítica. */
  location: string;
  /** brand: acción principal de la vista. link: enlace secundario de texto. */
  variant?: 'brand' | 'outline' | 'link';
  /** Texto visible más corto en filas densas; el nombre accesible sigue completo. */
  short?: boolean;
  className?: string;
}

/**
 * Único rótulo del sitio para ir al proveedor: «Ir al sitio de {marca}».
 * Respeta la política de enlaces (directo o /ir/{slug} con rel sponsored).
 */
const SiteLink: React.FC<SiteLinkProps> = ({ slug, website, name, location, variant = 'brand', short = false, className }) => {
  if (!website) return null;
  const link = getProviderLink(slug, website);
  const onClick = () => track('click_visitar_sitio', { slug, location });
  const label = short ? (
    <>
      Ir al sitio<span className="sr-only"> de {name}</span>
    </>
  ) : (
    <>Ir al sitio de {name}</>
  );

  if (variant === 'link') {
    return (
      <a
        href={link.href}
        target="_blank"
        rel={link.rel}
        referrerPolicy="no-referrer"
        onClick={onClick}
        className={cn(
          'inline-flex min-h-[44px] items-center gap-1.5 t-small font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink md:min-h-0',
          className,
        )}
      >
        {label}
        <ExternalLink className="h-4 w-4 shrink-0 text-ink-2" aria-hidden />
      </a>
    );
  }

  return (
    <Button asChild variant={variant} className={className}>
      <a href={link.href} target="_blank" rel={link.rel} referrerPolicy="no-referrer" onClick={onClick}>
        {label}
        <ExternalLink aria-hidden />
      </a>
    </Button>
  );
};

export default SiteLink;
