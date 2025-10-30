import React from 'react';
import { Helmet } from 'react-helmet';

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
  const fullTitle = `${title} | EligeTuHosting.cl`;
  const url = canonical || `https://eligetuhosting.cl${window.location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="EligeTuHosting.cl" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default DynamicMetaTags;
