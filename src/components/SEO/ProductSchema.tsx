import React from 'react';

interface ProductOffer {
  name: string;
  price: number;
  priceCurrency?: string;
  url?: string;
}

interface ProductSchemaProps {
  name: string;
  description: string;
  brand: string;
  image?: string;
  url?: string;
  offers?: ProductOffer[];
  aggregateOffer?: {
    lowPrice: number;
    highPrice?: number;
    offerCount?: number;
  };
  rating?: {
    value: number;
    count: number;
    bestRating?: number;
    worstRating?: number;
  };
  sku?: string;
  category?: string;
}

const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  brand,
  image,
  url,
  offers,
  aggregateOffer,
  rating,
  sku,
  category
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "manufacturer": {
      "@type": "Organization",
      "name": brand
    }
  };

  if (image) {
    schema.image = image;
  }

  if (url) {
    schema.url = url;
  }

  if (sku) {
    schema.sku = sku;
  }

  if (category) {
    schema.category = category;
  }

  // Add offers or aggregateOffer
  if (offers && offers.length > 0) {
    if (offers.length === 1) {
      schema.offers = {
        "@type": "Offer",
        "name": offers[0].name,
        "price": offers[0].price,
        "priceCurrency": offers[0].priceCurrency || "CLP",
        "availability": "https://schema.org/InStock",
        "url": offers[0].url || url,
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      };
    } else {
      schema.offers = {
        "@type": "AggregateOffer",
        "lowPrice": Math.min(...offers.map(o => o.price)),
        "highPrice": Math.max(...offers.map(o => o.price)),
        "priceCurrency": offers[0].priceCurrency || "CLP",
        "offerCount": offers.length,
        "availability": "https://schema.org/InStock",
        "url": url
      };
    }
  } else if (aggregateOffer) {
    schema.offers = {
      "@type": "AggregateOffer",
      "lowPrice": aggregateOffer.lowPrice,
      "highPrice": aggregateOffer.highPrice || aggregateOffer.lowPrice,
      "priceCurrency": "CLP",
      "offerCount": aggregateOffer.offerCount || 1,
      "availability": "https://schema.org/InStock",
      "url": url
    };
  }

  // Add rating if provided
  if (rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": rating.value.toFixed(1),
      "reviewCount": rating.count,
      "bestRating": rating.bestRating || 10,
      "worstRating": rating.worstRating || 1
    };
  }

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
};

export default ProductSchema;
