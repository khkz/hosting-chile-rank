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

/**
 * react-helmet-async requiere que los hijos del <Helmet> sean ELEMENTOS
 * DIRECTOS (no arrays, no Fragments, no false/undefined). Cualquier hijo
 * inválido puede hacer que Helmet descarte silenciosamente TODO el bloque
 * (bug detectado: sin canonical, sin hreflang, title sin sufijo).
 * Por eso aquí construimos dos ramas completas con elementos directos.
 */
const DynamicMetaTags: React.FC<DynamicMetaTagsProps> = ({
  title,
  description,
  canonical,
  ogImage = 'https://eligetuhosting.cl/images/ranking-comparison.png',
  keywords,
  type: _type = 'website',
  includeHreflang = false,
}) => {
  const location = useLocation();
  const fullTitle = `${title} | EligeTuHosting.cl`;
  const normalizedPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '');
  const url = canonical || `https://eligetuhosting.cl${normalizedPath}`;
  const kw = keywords || '';

  if (includeHreflang) {
    return (
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={kw} />
        <link rel="canonical" href={url} />
          <link rel="alternate" hrefLang="es-CL" href="https://eligetuhosting.cl/" />
          <link rel="alternate" hrefLang="es-PE" href="https://eligetuhosting.com/pe" />
          <link rel="alternate" hrefLang="es-MX" href="https://eligetuhosting.com/mx" />
          <link rel="alternate" hrefLang="es-CO" href="https://eligetuhosting.com/co" />
          <link rel="alternate" hrefLang="es-AR" href="https://eligetuhosting.com/ar" />
          <link rel="alternate" hrefLang="x-default" href="https://eligetuhosting.com/latam" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
    );
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={kw} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default DynamicMetaTags;
