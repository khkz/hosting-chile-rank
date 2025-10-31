
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home, BarChart2, GitCompare, Award, BookOpen } from 'lucide-react';

interface BreadcrumbItemType {
  name: string;
  href: string;
}

interface SEOBreadcrumbsProps {
  items: BreadcrumbItemType[];
  pageName?: string;
}

const SEOBreadcrumbs = ({ items, pageName }: SEOBreadcrumbsProps) => {
  const location = useLocation();
  
  // Build breadcrumb chain starting with home
  const breadcrumbs = [
    { name: "Inicio", href: "/" },
    ...items
  ];

  // Add current page if provided
  if (pageName) {
    breadcrumbs.push({ name: pageName, href: window.location.pathname });
  }

  // Get icon for breadcrumb based on href
  const getIcon = (href: string) => {
    if (href === '/') return <Home className="h-4 w-4 mr-1" />;
    if (href === '/ranking') return <BarChart2 className="h-4 w-4 mr-1" />;
    if (href === '/comparativa') return <GitCompare className="h-4 w-4 mr-1" />;
    if (href === '/certificaciones') return <Award className="h-4 w-4 mr-1" />;
    if (href === '/wiki') return <BookOpen className="h-4 w-4 mr-1" />;
    return null;
  };

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

      <Breadcrumb className="mb-6 bg-muted/30 p-3 rounded-lg">
        <BreadcrumbList className="flex-wrap">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link 
                to="/" 
                className={`flex items-center font-medium transition-colors ${
                  isCurrentPage('/') 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {getIcon('/')}
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </BreadcrumbSeparator>
          
          {items.map((item, index) => (
            <span key={index} className="contents">
              <BreadcrumbItem>
                {index === items.length - 1 && !pageName ? (
                  <BreadcrumbPage className="flex items-center font-semibold text-primary">
                    {getIcon(item.href)}
                    {item.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link 
                      to={item.href}
                      className={`flex items-center font-medium transition-colors ${
                        isCurrentPage(item.href)
                          ? 'text-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {getIcon(item.href)}
                      {item.name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {(index < items.length - 1 || pageName) && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </BreadcrumbSeparator>
              )}
            </span>
          ))}

          {pageName && (
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-primary">
                {pageName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default SEOBreadcrumbs;
