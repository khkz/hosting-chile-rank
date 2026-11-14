import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, ExternalLink, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { formatInteger } from '@/lib/format';
import type { NicDomain } from './useNicLatestDomains';
import { formatToolDateTime, isoDateTime } from './dataTime';

const HOUR = 1000 * 60 * 60;

// Tiempo desde la inscripción, respecto de la hora de quien mira.
const hoursSince = (date: string) => (Date.now() - new Date(date).getTime()) / HOUR;
const timeAgo = (date: string) => {
  const h = hoursSince(date);
  if (h < 1) return `hace ${Math.max(0, Math.floor(h * 60))} min`;
  if (h < 24) return `hace ${Math.floor(h)} h`;
  return `hace ${Math.floor(h / 24)} d`;
};
const freshness = (date: string): string | null => {
  const h = hoursSince(date);
  if (h <= 1) return 'Nuevo';
  if (h <= 6) return 'Reciente';
  return null;
};
const slugOf = (d: string) => `/domain/${d.replace(/\./g, '-')}/`;

const linkClass = 'text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink';

interface NicDomainListProps {
  domains: NicDomain[];
  /** Posición del primer dominio de la página (para numerar). */
  offset: number;
}

/** Lista en móvil y tabla en escritorio; acciones siempre visibles. */
const NicDomainList: React.FC<NicDomainListProps> = ({ domains, offset }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const copy = async (domain: string) => {
    try {
      await navigator.clipboard.writeText(domain);
      setCopied(domain);
      setTimeout(() => setCopied((c) => (c === domain ? null : c)), 2000);
    } catch {
      toast({ title: 'No pudimos copiar', description: 'Tu navegador bloqueó el portapapeles. Selecciona el dominio y cópialo a mano.' });
    }
  };

  const CopyButton = ({ domain }: { domain: string }) => (
    <Button variant="ghost" size="icon" onClick={() => copy(domain)} aria-label={`Copiar ${domain}`} title="Copiar dominio">
      {copied === domain ? <Check aria-hidden className="text-ink" /> : <Copy aria-hidden className="text-ink-2" />}
    </Button>
  );
  const OpenLink = ({ domain }: { domain: string }) => (
    <Button variant="ghost" size="icon" asChild>
      <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${domain} en otra pestaña`} title="Abrir sitio">
        <ExternalLink aria-hidden className="text-ink-2" />
      </a>
    </Button>
  );

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {copied ? `${copied} copiado al portapapeles` : ''}
      </p>

      <ol className="divide-y divide-rule border-y border-rule md:hidden">
        {domains.map((domain, i) => {
          const tag = freshness(domain.date);
          return (
            <li key={domain.d} className="py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="t-body min-w-0 break-all font-semibold text-ink">{domain.d}</span>
                <span className="t-meta tabular shrink-0">{formatInteger(offset + i + 1)}</span>
              </div>
              <div className="t-meta mt-0.5 flex flex-wrap items-center gap-2">
                <time dateTime={isoDateTime(domain.date)}>{formatToolDateTime(domain.date)}</time>
                <span>({timeAgo(domain.date)})</span>
                {tag && <Badge variant="outline">{tag}</Badge>}
              </div>
              <div className="mt-1 flex items-center gap-1">
                <Button variant="outline" size="sm" asChild className="h-11">
                  <Link to={slugOf(domain.d)}>
                    <Search aria-hidden />
                    Analizar
                  </Link>
                </Button>
                <CopyButton domain={domain.d} />
                <OpenLink domain={domain.d} />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="hidden md:block">
        <Table>
          <TableCaption>Dominios .cl inscritos, según la lista pública de NIC Chile.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">N.º</TableHead>
              <TableHead>Dominio</TableHead>
              <TableHead>Inscrito</TableHead>
              <TableHead className="w-48 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain, i) => {
              const tag = freshness(domain.date);
              return (
                <TableRow key={domain.d}>
                  <TableCell className="text-ink-3">{formatInteger(offset + i + 1)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={slugOf(domain.d)} className={`font-semibold ${linkClass}`}>
                        {domain.d}
                      </Link>
                      {tag && <Badge variant="outline">{tag}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <time dateTime={isoDateTime(domain.date)} className="block text-ink">
                      {formatToolDateTime(domain.date)}
                    </time>
                    <span className="t-meta">{timeAgo(domain.date)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={slugOf(domain.d)} aria-label={`Analizar ${domain.d}`}>
                          <Search aria-hidden />
                          Analizar
                        </Link>
                      </Button>
                      <CopyButton domain={domain.d} />
                      <OpenLink domain={domain.d} />
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default NicDomainList;
