import React from 'react';

export interface ListItemProduct {
  name: string;
  description?: string;
  url: string;
  image?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  price?: number;
  priceCurrency?: string;
}

interface ItemListSchemaProps {
  name?: string;
  description?: string;
  items: ListItemProduct[];
  listType?: 'ranking' | 'comparison' | 'catalog';
}

const ItemListSchema: React.FC<ItemListSchemaProps> = ({
  name,
  description,
  items,
  listType = 'ranking'
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(name && { "name": name }),
    ...(description && { "description": description }),
    "numberOfItems": items.length,
    "itemListOrder": listType === 'ranking' ? "https://schema.org/ItemListOrderDescending" : "https://schema.org/ItemListUnordered",
    "itemListElement": items.map((item, index) => {
      const itemData: Record<string, unknown> = {
        "@type": "SoftwareApplication",
        "name": item.name,
        "url": item.url,
        "description": item.description || `Servicio de hosting web ${item.name} en Chile`,
        "applicationCategory": "WebApplication",
        "operatingSystem": "Linux"
      };

      if (item.image) {
        itemData.image = item.image;
      }

      if (item.brand) {
        itemData.brand = {
          "@type": "Brand",
          "name": item.brand
        };
      }

      if (item.price) {
        itemData.offers = {
          "@type": "Offer",
          "price": item.price,
          "priceCurrency": item.priceCurrency || "CLP",
          "availability": "https://schema.org/InStock",
          "url": item.url,
          "priceValidUntil": new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]
        };
      }

      if (item.rating) {
        itemData.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": item.rating.toFixed(1),
          "ratingCount": item.reviewCount || 1,
          "bestRating": "10",
          "worstRating": "1"
        };
      }

      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": itemData
      };
    })
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
};

export default ItemListSchema;
