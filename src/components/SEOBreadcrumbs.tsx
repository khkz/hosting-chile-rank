
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItemType {
  name: string;
  href: string;
}

interface SEOBreadcrumbsProps {
  items: BreadcrumbItemType[];
  pageName?: string;
}

const linkClass =
  'inline-flex min-h-11 items-center rounded-sm text-ink-2 underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/40 md:min-h-0';

const Separator = () => <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink-3" aria-hidden />;

/**
 * Migas de pan: texto de 13–14 px alineado a la izquierda, sin caja ni íconos.
 * La página actual va en tinta y con aria-current. Emite el JSON-LD
 * BreadcrumbList (sin cambios respecto de la versión anterior).
 */
const SEOBreadcrumbs = ({ items, pageName }: SEOBreadcrumbsProps) => {
  const location = useLocation();

  // Drop a leading "Inicio" / "/" item if the caller included it — el
  // componente ya renderiza Inicio por sí mismo y de lo contrario salía
  // duplicado (ej. en /sobre-nosotros).
  const normalizedItems = items.filter(
    (item, idx) => !(idx === 0 && (item.href === '/' || item.name.toLowerCase() === 'inicio'))
  );

  // Build breadcrumb chain starting with home
  const breadcrumbs = [
    { name: "Inicio", href: "/" },
    ...normalizedItems
  ];

  // Add current page if provided
  if (pageName) {
    breadcrumbs.push({ name: pageName, href: window.location.pathname });
  }

  const isCurrentPage = (href: string) => location.pathname === href;

  return (
    <>
      {/* BreadcrumbList Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `${window.location.origin}${item.href}`
          }))
        })}
      </script>

      <nav aria-label="Ruta de navegación" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-1.5 text-[13px] md:text-sm">
          <li className="inline-flex items-center gap-1.5">
            <Link to="/" aria-current={isCurrentPage('/') ? 'page' : undefined} className={linkClass}>
              Inicio
            </Link>
            <Separator />
          </li>

          {normalizedItems.map((item, index) => {
            const isLast = index === normalizedItems.length - 1 && !pageName;
            return (
              <li key={index} className="inline-flex min-w-0 items-center gap-1.5">
                {isLast ? (
                  <span aria-current="page" className="inline-flex min-h-11 items-center font-medium text-ink md:min-h-0">
                    {item.name}
                  </span>
                ) : (
                  <Link to={item.href} aria-current={isCurrentPage(item.href) ? 'page' : undefined} className={linkClass}>
                    {item.name}
                  </Link>
                )}
                {!isLast && <Separator />}
              </li>
            );
          })}

          {pageName && (
            <li className="inline-flex min-w-0 items-center">
              <span aria-current="page" className="inline-flex min-h-11 items-center font-medium text-ink md:min-h-0">
                {pageName}
              </span>
            </li>
          )}
        </ol>
      </nav>
    </>
  );
};

export default SEOBreadcrumbs;
