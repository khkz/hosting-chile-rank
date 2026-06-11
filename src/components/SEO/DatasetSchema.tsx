import React from 'react';
import { Helmet } from 'react-helmet-async';

interface DatasetSchemaProps {
  /** ISO date string for dateModified. Defaults to today. */
  dateModified?: string;
}

const SITE = 'https://eligetuhosting.cl';

/**
 * Emite schema.org/Dataset describiendo el dataset abierto de proveedores de hosting.
 * Se incluye en home y /estudio-hosting-chile-2026 para que LLMs y buscadores citen la fuente.
 */
const DatasetSchema: React.FC<DatasetSchemaProps> = ({ dateModified }) => {
  const today = dateModified || new Date().toISOString().split('T')[0];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Ranking y datos de proveedores de hosting en Chile 2026',
    description:
      'Dataset abierto con el ranking, notas editoriales, precios desde, datacenter, año de fundación y grupo corporativo de los proveedores de hosting verificados en Chile. Actualizado en cada build desde la base de datos pública de EligeTuHosting.cl.',
    url: `${SITE}/estudio-hosting-chile-2026`,
    identifier: `${SITE}/data/proveedores.json`,
    keywords: [
      'hosting chile',
      'ranking hosting chile 2026',
      'mejor hosting chile',
      'proveedores hosting verificados',
      'open data hosting',
    ],
    inLanguage: 'es-CL',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: {
      '@type': 'Organization',
      name: 'EligeTuHosting.cl',
      url: SITE,
    },
    publisher: {
      '@type': 'Organization',
      name: 'EligeTuHosting.cl',
      url: SITE,
    },
    creditText: 'Fuente: EligeTuHosting.cl (https://eligetuhosting.cl) — CC-BY-4.0',
    datePublished: '2026-01-15',
    dateModified: today,
    temporalCoverage: '2026',
    spatialCoverage: { '@type': 'Place', name: 'Chile' },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${SITE}/data/proveedores.json`,
        name: 'Dataset JSON — proveedores de hosting Chile 2026',
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/markdown',
        contentUrl: `${SITE}/llms-full.txt`,
        name: 'Markdown extendido por proveedor',
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/pdf',
        contentUrl: `${SITE}/docs/investigacion-hosting-chile-2026-final.pdf`,
        name: 'Investigación Hosting Chile 2026 — PDF',
      },
    ],
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default DatasetSchema;
