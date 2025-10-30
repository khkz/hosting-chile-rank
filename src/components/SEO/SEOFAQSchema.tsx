import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOFAQSchemaProps {
  faqs: FAQItem[];
}

export default function SEOFAQSchema({ faqs }: SEOFAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
