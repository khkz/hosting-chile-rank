import React from 'react';
import { Link } from 'react-router-dom';
import type { NavLinkItem } from '@/lib/siteNav';

type SmartLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { item: NavLinkItem };

/**
 * Enlace de navegación: usa el router si la ruta es del mismo sitio y <a> si
 * cruza de dominio. Reenvía la ref y el resto de props: los menús de Radix
 * (DropdownMenuItem asChild) la necesitan para mover el foco con el teclado.
 */
const SmartLink = React.forwardRef<HTMLAnchorElement, SmartLinkProps>(({ item, children, ...rest }, ref) =>
  item.external ? (
    <a ref={ref} href={item.href} {...rest}>
      {children ?? item.label}
    </a>
  ) : (
    <Link ref={ref} to={item.href} {...rest}>
      {children ?? item.label}
    </Link>
  )
);
SmartLink.displayName = 'SmartLink';

export default SmartLink;
