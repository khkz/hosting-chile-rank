import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { hreflangAlternates } from '@/lib/countries';

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
 * react-helmet-async no acepta Fragments ni false/undefined como hijos del
 * <Helmet>: un hijo inválido puede hacer que descarte TODO el bloque (bug
 * detectado: sin canonical, sin hreflang, title sin sufijo). Los arrays de
 * elementos (.map) sí son válidos. Por eso hay dos ramas completas y el
 * hreflang sale del registro de países como array.
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
        {hreflangAlternates().map((a) => (
          <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
        ))}
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
