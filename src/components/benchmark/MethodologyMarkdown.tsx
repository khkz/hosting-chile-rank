import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { slugify, stripLeadingH1 } from './markdownUtils';

type HastNode = { type?: string; value?: string; children?: HastNode[] };
const textOf = (n?: HastNode): string =>
  !n ? '' : n.type === 'text' ? n.value ?? '' : (n.children ?? []).map(textOf).join('');

const heading = (level: number, withIds: boolean): Components['h2'] =>
  function Heading({ node, children }) {
    const Tag = `h${Math.min(level, 6)}` as 'h2';
    const id = withIds ? slugify(textOf(node as HastNode)) : undefined;
    return (
      <Tag id={id} className={withIds ? 'scroll-mt-24' : undefined}>
        {children}
      </Tag>
    );
  };

interface MethodologyMarkdownProps {
  markdown: string;
  /** 0: «##» queda como H2 (versión vigente). 1: baja un nivel (versiones anteriores). */
  offset?: 0 | 1;
  className?: string;
}

/**
 * Markdown de la base renderizado con el estilo de lectura (prose), sin
 * mostrar «#», «**» ni cercas. El código va en la letra del texto.
 */
const MethodologyMarkdown: React.FC<MethodologyMarkdownProps> = ({ markdown, offset = 0, className }) => {
  const withIds = offset === 0;
  const components: Components = {
    h1: heading(2 + offset, withIds),
    h2: heading(2 + offset, withIds),
    h3: heading(3 + offset, false),
    h4: heading(4 + offset, false),
  };
  return (
    <div className={cn('prose [&_code]:font-sans [&_pre]:font-sans [&_pre]:whitespace-pre-wrap', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
        {stripLeadingH1(markdown)}
      </ReactMarkdown>
    </div>
  );
};

export default MethodologyMarkdown;
