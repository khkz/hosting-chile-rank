import React from 'react';

interface Review {
  id: string;
  author: string;
  datePublished: string;
  ratingValue: number;
  reviewBody: string;
  title?: string;
}

interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string;
  website: string;
  rating: number;
  reviewCount: number;
  description?: string;
  priceRange?: {
    min: string;
    max: string;
  };
}

interface AggregateData {
  averageRating: number;
  totalReviews: number;
  bestRating?: number;
  worstRating?: number;
}

interface SEOReviewSchemaProps {
  type: 'aggregate' | 'company' | 'product';
  company?: Company;
  reviews?: Review[];
  aggregateData?: AggregateData;
}

const SEOReviewSchema: React.FC<SEOReviewSchemaProps> = ({ 
  type, 
  company, 
  reviews = [], 
  aggregateData 
}) => {
  const generateAggregateSchema = () => {
    if (!aggregateData) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "EligeTuHosting",
      "url": "https://eligetuhosting.cl",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregateData.averageRating.toFixed(1),
        "reviewCount": aggregateData.totalReviews.toString(),
        "bestRating": (aggregateData.bestRating || 10).toString(),
        "worstRating": (aggregateData.worstRating || 1).toString()
      }
    };
  };

  const generateCompanySchema = () => {
    if (!company) return null;

    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": company.name,
      "description": `Proveedor de hosting profesional en Chile - ${company.name}`,
      "image": `https://eligetuhosting.cl${company.logo}`,
      "url": `https://eligetuhosting.cl/catalogo/${company.slug}`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": company.rating.toFixed(1),
        "reviewCount": company.reviewCount.toString(),
        "bestRating": "10",
        "worstRating": "1"
      },
      ...(reviews.length > 0 && {
        "review": reviews.map(review => ({
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": review.author
          },
          "datePublished": new Date(review.datePublished).toISOString().split('T')[0],
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": review.ratingValue.toString(),
            "bestRating": "10",
            "worstRating": "1"
          },
          "reviewBody": review.reviewBody,
          ...(review.title && { "name": review.title })
        }))
      })
    };
  };

  const generateProductSchema = () => {
    if (!company) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `Hosting ${company.name}`,
      "image": `https://eligetuhosting.cl${company.logo}`,
      "description": `Servicio de hosting profesional en Chile por ${company.name}`,
      "brand": {
        "@type": "Brand",
        "name": company.name
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": company.rating.toFixed(1),
        "reviewCount": company.reviewCount.toString(),
        "bestRating": "10",
        "worstRating": "1"
      }
    };
  };

  const getSchema = () => {
    switch (type) {
      case 'aggregate':
        return generateAggregateSchema();
      case 'company':
        return generateCompanySchema();
      case 'product':
        return generateProductSchema();
      default:
        return null;
    }
  };

  const schema = getSchema();

  if (!schema) return null;

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
};

export default SEOReviewSchema;
