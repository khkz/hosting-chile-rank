
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItemType {
  name: string;
  href: string;
}

interface SEOBreadcrumbsProps {
  items: BreadcrumbItemType[];
  pageName?: string;
}

const SEOBreadcrumbs = ({ items, pageName }: SEOBreadcrumbsProps) => {
  // Build breadcrumb chain starting with home
  const breadcrumbs = [
    { name: "Inicio", href: "/" },
    ...items
  ];

  // Add current page if provided
  if (pageName) {
    breadcrumbs.push({ name: pageName, href: window.location.pathname });
  }

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

      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {index === items.length - 1 && !pageName ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {(index < items.length - 1 || pageName) && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}

          {pageName && (
            <BreadcrumbItem>
              <BreadcrumbPage>{pageName}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default SEOBreadcrumbs;
