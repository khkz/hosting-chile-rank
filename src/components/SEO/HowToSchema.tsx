import React from 'react';

interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  image?: string;
  totalTime?: string; // ISO 8601 duration format (e.g., "PT20M" for 20 minutes)
  estimatedCost?: {
    currency: string;
    value: string;
  };
  steps: HowToStep[];
}

const HowToSchema: React.FC<HowToSchemaProps> = ({
  name,
  description,
  image,
  totalTime,
  estimatedCost,
  steps
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => {
      const stepData: any = {
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text
      };

      if (step.image) {
        stepData.image = step.image;
      }

      if (step.url) {
        stepData.url = step.url;
      }

      return stepData;
    })
  };

  if (image) {
    schema.image = image;
  }

  if (totalTime) {
    schema.totalTime = totalTime;
  }

  if (estimatedCost) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      "currency": estimatedCost.currency,
      "value": estimatedCost.value
    };
  }

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
};

export default HowToSchema;
