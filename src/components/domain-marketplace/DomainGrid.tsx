import { RefreshCw } from "lucide-react";
import { DomainCard } from "./DomainCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Callout from "@/components/system/Callout";

interface Domain {
  id: string;
  domain_name: string;
  tld: string | null;
  listing_price: number | null;
}

interface DomainGridProps {
  domains: Domain[];
  isLoading: boolean;
  /** La consulta falló: no es lo mismo que «no hay dominios». */
  isError?: boolean;
  onRetry?: () => void;
  /** Hay filtros o búsqueda activos. */
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function DomainGrid({ domains, isLoading, isError, onRetry, hasFilters, onClearFilters }: DomainGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
        <p className="sr-only" role="status">Cargando dominios en venta…</p>
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl bg-paper-deep" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Callout tone="caution" title="No pudimos cargar los dominios en venta" className="my-0 max-w-[62ch]">
        <p>La consulta no respondió. No es que no haya dominios: vuelve a intentarlo en unos minutos.</p>
        {onRetry && (
          <Button variant="default" className="mt-3" onClick={onRetry}>
            <RefreshCw aria-hidden />
            Reintentar
          </Button>
        )}
      </Callout>
    );
  }

  if (!domains.length) {
    return (
      <div className="max-w-[62ch] rounded-xl border border-rule bg-paper p-6">
        {hasFilters ? (
          <>
            <h3 className="t-h3 text-ink">Ningún dominio coincide con tus filtros</h3>
            <p className="t-small mt-1 text-ink-2">Prueba con otra extensión, amplía el rango de precio o borra la búsqueda.</p>
            {onClearFilters && (
              <Button variant="outline" className="mt-4" onClick={onClearFilters}>
                Quitar filtros
              </Button>
            )}
          </>
        ) : (
          <>
            <h3 className="t-h3 text-ink">Por ahora no hay dominios a la venta</h3>
            <p className="t-small mt-1 text-ink-2">Vuelve pronto: publicamos nuevos dominios cuando están disponibles.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {domains.map((domain) => (
        <DomainCard key={domain.id} domain={domain} />
      ))}
    </div>
  );
}
