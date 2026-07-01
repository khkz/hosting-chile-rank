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
  includeHreflang?: boolean;
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
  const url = canonical || `https://eligetuhosting.cl${normalizedPath}`;

  // NOTE: hreflang cluster is intentionally NOT emitted here.
  // Fase 2 SEO: solo el home de Chile (Index), el hub LATAM (LatamHub)
  // y la página /pe (CountryLanding) llevan el bloque hreflang, y cada
  // una lo declara localmente para evitar contaminar el resto del .cl.

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical self-referencial */}
      <link rel="canonical" href={url} />


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
