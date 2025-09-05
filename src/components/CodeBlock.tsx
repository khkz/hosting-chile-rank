import React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  children, 
  language = '', 
  className = '' 
}) => {
  return (
    <div className={cn("my-6", className)}>
      <div className="relative">
        {language && (
          <div className="bg-muted px-4 py-2 text-xs text-muted-foreground border border-b-0 rounded-t-lg">
            {language}
          </div>
        )}
        <pre className={cn(
          "overflow-x-auto p-4 bg-muted/50 border rounded-lg font-mono text-sm",
          language && "rounded-t-none"
        )}>
          <code className="text-foreground whitespace-pre">
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;