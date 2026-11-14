import React from 'react';
import type { Components } from 'react-markdown';
import CodeBlock from '@/components/CodeBlock';
import { splitHeading, textOf } from '@/components/lectura/headings';

type Level = 'h2' | 'h3' | 'h4';

/**
 * Encabezados del Markdown de la wiki con ancla estable: respeta «{#ancla}»
 * y, si no hay, la deriva del texto (la misma función arma el índice).
 */
const heading = (Tag: Level) => {
  const Heading = ({ children }: { children?: React.ReactNode }) => {
    const { clean, id } = splitHeading(textOf(children).trim());
    if (!clean) return null;
    return (
      <Tag id={id} className="scroll-mt-24">
        {clean}
      </Tag>
    );
  };
  return Heading;
};

/** Componentes de ReactMarkdown para el cuerpo de un término (dentro de `prose`). */
export const WIKI_MD_COMPONENTS: Components = {
  // La página ya tiene su H1: el «#» del contenido baja a h2.
  h1: heading('h2'),
  h2: heading('h2'),
  h3: heading('h3'),
  h4: heading('h4'),
  // Las imágenes del contenido heredado no tienen fuente confiable: no se dibujan.
  img: () => null,
  pre: ({ children }) => {
    const child = React.Children.toArray(children)[0] as
      | React.ReactElement<{ className?: string; children?: React.ReactNode }>
      | undefined;
    const lang = /language-([\w-]+)/.exec(child?.props?.className ?? '')?.[1];
    return <CodeBlock language={lang}>{textOf(child?.props?.children).replace(/\n$/, '')}</CodeBlock>;
  },
  table: ({ children }) => (
    <div
      className="overflow-x-auto rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      role="region"
      aria-label="Tabla; desplázate de lado si no ves todas las columnas"
      tabIndex={0}
    >
      <table>{children}</table>
    </div>
  ),
};
