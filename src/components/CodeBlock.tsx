import React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

/**
 * Bloque de código de la wiki. El código sí va en monoespaciada (conserva la
 * sangría); el bloque se desplaza dentro de sí mismo y no ensancha la página.
 */
const CodeBlock: React.FC<CodeBlockProps> = ({ children, language = '', className = '' }) => (
  <div className={cn('not-prose my-6 overflow-hidden rounded-xl border border-rule bg-paper', className)}>
    {language && (
      <div className="t-meta border-b border-rule px-4 py-2">
        <span className="sr-only">Código en </span>
        {language}
      </div>
    )}
    <pre
      tabIndex={0}
      aria-label={language ? `Código en ${language}` : 'Código'}
      className="overflow-x-auto p-4 text-sm leading-relaxed text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    >
      <code className="whitespace-pre font-mono">{children}</code>
    </pre>
  </div>
);

export default CodeBlock;
