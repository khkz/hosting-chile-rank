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
      const listItem: any = {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": item.name,
          "url": item.url
        }
      };

      // Add optional fields
      if (item.description) {
        listItem.item.description = item.description;
      }

      if (item.image) {
        listItem.item.image = item.image;
      }

      if (item.brand) {
        listItem.item.brand = {
          "@type": "Brand",
          "name": item.brand
        };
      }

      // Add offers if price is available
      if (item.price) {
        listItem.item.offers = {
          "@type": "Offer",
          "price": item.price,
          "priceCurrency": item.priceCurrency || "CLP",
          "availability": "https://schema.org/InStock",
          "url": item.url
        };
      }

      // Add aggregateRating if rating is available
      if (item.rating && item.reviewCount) {
        listItem.item.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": item.rating.toFixed(1),
          "reviewCount": item.reviewCount,
          "bestRating": "10",
          "worstRating": "1"
        };
      }

      return listItem;
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
