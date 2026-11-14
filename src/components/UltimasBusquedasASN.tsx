import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useASNSearchHistory } from '@/hooks/useASNSearchHistory';
import { isChileanASN } from '@/utils/ipDetection';

// Historial guardado en este navegador; el tiempo se cuenta desde ahora.
const formatTimeAgo = (dateString: string) => {
  const searchDate = new Date(dateString);
  const diffInMinutes = Math.floor((Date.now() - searchDate.getTime()) / (1000 * 60));
  if (diffInMinutes < 1) return 'hace un momento';
  if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `hace ${diffInHours} h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `hace ${diffInDays} d`;
  return searchDate.toLocaleDateString('es-CL');
};

/** Últimas búsquedas de ASN hechas en este navegador. */
const UltimasBusquedasASN: React.FC = () => {
  const { history, clearHistory } = useASNSearchHistory();
  if (history.length === 0) return null;

  return (
    <section aria-labelledby="ultimas-asn-titulo" className="max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <h2 id="ultimas-asn-titulo" className="t-h3 text-ink">Tus últimas búsquedas de ASN</h2>
        <Button variant="ghost" size="sm" className="h-11 sm:h-9" onClick={clearHistory}>
          <Trash2 aria-hidden />
          Borrar historial
        </Button>
      </div>
      <p className="t-meta mt-1">Se guardan solo en este navegador.</p>
      <ul className="mt-3 divide-y divide-rule border-y border-rule">
        {history.map((item) => (
          <li key={item.asn}>
            <Link
              to={`/asn/AS${item.asn}`}
              className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 hover:bg-paper"
            >
              <span className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="tabular font-semibold text-ink underline decoration-ink/20 underline-offset-4">AS{item.asn}</span>
                <span className="t-small min-w-0 truncate text-ink-2">{item.name}</span>
                {isChileanASN(item.asn.toString()) ? (
                  <Badge variant="outline">Chile</Badge>
                ) : (
                  item.countryCode && <Badge variant="outline">{item.countryCode}</Badge>
                )}
              </span>
              <span className="t-meta">{formatTimeAgo(item.searchedAt)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default UltimasBusquedasASN;
