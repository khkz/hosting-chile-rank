import React from 'react';

const SEOOrganization: React.FC = () => {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EligeTuHosting",
    url: "https://eligetuhosting.cl",
    logo: "https://eligetuhosting.cl/favicon-logo.svg",
    contactPoint: [{
      "@type": "ContactPoint",
      email: "contacto@eligetuhosting.cl",
      contactType: "customer support",
      areaServed: "CL",
      availableLanguage: ["es"]
    }]
  };

  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EligeTuHosting.cl",
    url: "https://eligetuhosting.cl",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://eligetuhosting.cl/domain/{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }} />
    </>
  );
};

export default SEOOrganization;
