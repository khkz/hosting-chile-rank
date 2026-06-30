import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface DynamicMetaTagsProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
  type?: 'website' | 'article';
}

const DynamicMetaTags: React.FC<DynamicMetaTagsProps> = ({
  title,
  description,
  canonical,
  ogImage = 'https://eligetuhosting.cl/images/ranking-comparison.png',
  keywords,
  type = 'website'
}) => {
  const location = useLocation();
  const fullTitle = `${title} | EligeTuHosting.cl`;
  // Always self-referential canonical based on current route unless explicitly overridden.
  const normalizedPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '');
  const clPath = normalizedPath === '/' ? '' : normalizedPath;
  const url = canonical || `https://eligetuhosting.cl${normalizedPath}`;

  // Programmatic hreflang cluster:
  // - Chile vive en .cl (no /cl en .com)
  // - Países LATAM viven en .com/<país>
  // - x-default apunta al .com raíz
  const hreflangs: Array<{ lang: string; href: string }> = [
    { lang: 'es-CL', href: `https://eligetuhosting.cl${normalizedPath}` },
    { lang: 'es-PE', href: `https://eligetuhosting.com/pe${clPath}` },
    { lang: 'es-MX', href: `https://eligetuhosting.com/mx${clPath}` },
    { lang: 'es-CO', href: `https://eligetuhosting.com/co${clPath}` },
    { lang: 'es-AR', href: `https://eligetuhosting.com/ar${clPath}` },
    { lang: 'x-default', href: `https://eligetuhosting.com/` },
  ];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical self-referencial */}
      <link rel="canonical" href={url} />

      {/* hreflang cluster bidireccional y autorreferencial */}
      {hreflangs.map(h => (
        <link key={h.lang} rel="alternate" hrefLang={h.lang} href={h.href} />
      ))}

      {/* Open Graph — og:type/site_name/locale viven en index.html (sitewide).
          Aquí solo emitimos los que varían por ruta para evitar duplicados. */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Card */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default DynamicMetaTags;
