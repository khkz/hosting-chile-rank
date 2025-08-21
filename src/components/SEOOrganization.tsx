import React from 'react';

const SEOOrganization: React.FC = () => {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EligeTuHosting",
    url: "https://eligetuhosting.cl",
    logo: {
      "@type": "ImageObject",
      url: "https://eligetuhosting.cl/favicon-logo.svg",
      width: "512",
      height: "512"
    },
    foundingDate: "2020",
    areaServed: {
      "@type": "Country",
      name: "Chile"
    },
    sameAs: [
      "https://twitter.com/eligetuhosting",
      "https://facebook.com/eligetuhosting",
      "https://linkedin.com/company/eligetuhosting"
    ],
    contactPoint: [{
      "@type": "ContactPoint",
      email: "contacto@eligetuhosting.cl",
      telephone: "+56912345678",
      contactType: "customer support",
      areaServed: "CL",
      availableLanguage: ["es"]
    }],
    publisher: {
      "@type": "Organization",
      name: "EligeTuHosting",
      logo: {
        "@type": "ImageObject",
        url: "https://eligetuhosting.cl/favicon-logo.svg",
        width: "512",
        height: "512"
      }
    }
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
