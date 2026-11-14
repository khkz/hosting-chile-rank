import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, ExternalLink, Globe, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getReverseIpData, classifyDomain } from '@/services/reverseIpService';
import { formatInteger } from '@/lib/format';
import { formatToolDate, isoDateTime } from '@/components/herramientas/dataTime';

interface ReverseIpLookupProps {
  prefix: string;
}

interface ReverseIpResult {
  domain: string;
  ip: string;
  type?: string;
}

type Status = 'idle' | 'loading' | 'ready' | 'error';

/** «Ver sitios» de un prefijo /24 o menor: dominios que apuntan a ese rango (IP inversa). */
export function ReverseIpLookup({ prefix }: ReverseIpLookupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [domains, setDomains] = useState<ReverseIpResult[]>([]);
  const [cachedAt, setCachedAt] = useState<string | null>(null);

  const load = async () => {
    setStatus('loading');
    try {
      const result = await getReverseIpData(prefix);
      // null = la consulta no respondió (no es lo mismo que «no hay sitios»).
      if (!result) {
        setStatus('error');
        return;
      }
      setDomains(result.domains || []);
      setCachedAt(result.cached_at || null);
      setStatus('ready');
    } catch (error) {
      console.error('Error loading reverse IP data:', error);
      setStatus('error');
    }
  };

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    if (open && status === 'idle') load();
  };

  // Solo rangos /24 o menores: en bloques grandes la búsqueda no es útil.
  const maskNum = parseInt(prefix.split('/')[1]);
  if (maskNum < 24) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={handleToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="h-11 px-2 text-ink-2 hover:text-ink sm:h-9">
          <Globe aria-hidden />
          {status === 'loading' ? 'Buscando…' : 'Ver sitios'}
          <span className="sr-only"> del rango {prefix}</span>
          {isOpen ? <ChevronDown aria-hidden /> : <ChevronRight aria-hidden />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 max-w-md">
        {status === 'loading' && <p className="t-meta" role="status">Buscando sitios web en este rango…</p>}

        {status === 'error' && (
          <div className="t-small text-ink-2">
            <p>No pudimos consultar los sitios de este rango.</p>
            <Button variant="outline" size="sm" className="mt-2 h-11 sm:h-9" onClick={load}>
              <RefreshCw aria-hidden />
              Reintentar
            </Button>
          </div>
        )}

        {status === 'ready' && domains.length === 0 && (
          <div className="t-small text-ink-2">
            <p>No encontramos sitios web en este rango de IP.</p>
            <p className="t-meta mt-1">Es posible que estas IP no tengan sitios activos o se usen para otros servicios de red.</p>
          </div>
        )}

        {status === 'ready' && domains.length > 0 && (
          <div className="rounded-xl border border-rule bg-white p-3">
            <p className="t-meta">
              {formatInteger(domains.length)} sitio{domains.length !== 1 ? 's' : ''} encontrado{domains.length !== 1 ? 's' : ''}
              {cachedAt && (
                <>
                  {' '}en la búsqueda de IP inversa del <time dateTime={isoDateTime(cachedAt)}>{formatToolDate(cachedAt)}</time>
                </>
              )}
              .
            </p>
            <ul className="mt-2 divide-y divide-rule">
              {domains.slice(0, 10).map((d) => (
                <li key={`${d.domain}-${d.ip}`} className="flex items-center justify-between gap-2 py-1.5">
                  <span className="flex min-w-0 items-center gap-2">
                    <Link
                      to={`/domain/${d.domain.replace(/\./g, '-').toLowerCase()}/`}
                      className="t-small truncate text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
                      title={d.domain}
                    >
                      {d.domain}
                    </Link>
                    <Badge variant="outline" className="shrink-0">{classifyDomain(d.domain)}</Badge>
                  </span>
                  <a
                    href={`https://${d.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-2 hover:bg-paper hover:text-ink sm:h-9 sm:w-9"
                    aria-label={`Abrir ${d.domain} en otra pestaña`}
                  >
                    <ExternalLink aria-hidden className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
            {domains.length > 10 && (
              <p className="t-meta mt-2 border-t border-rule pt-2">y {formatInteger(domains.length - 10)} sitios más</p>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
