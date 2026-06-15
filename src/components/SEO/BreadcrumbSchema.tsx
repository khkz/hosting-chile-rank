import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface BreadcrumbCrumb {
  name: string;
  url: string; // absolute or root-relative
}

interface Props {
  items: BreadcrumbCrumb[];
  origin?: string;
}

/**
 * Emite un JSON-LD BreadcrumbList con jerarquía Inicio > Sección > Página.
 * Pasa SIEMPRE los crumbs SIN incluir "Inicio" — se agrega automáticamente.
 */
const BreadcrumbSchema: React.FC<Props> = ({ items, origin = 'https://eligetuhosting.cl' }) => {
  const abs = (u: string) => (u.startsWith('http') ? u : `${origin}${u.startsWith('/') ? '' : '/'}${u}`);
  const list = [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: origin },
    ...items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: c.name,
      item: abs(c.url),
    })),
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list,
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default BreadcrumbSchema;
