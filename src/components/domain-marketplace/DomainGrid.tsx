import { DomainCard } from "./DomainCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe } from "lucide-react";

interface Domain {
  id: string;
  domain_name: string;
  tld: string | null;
  listing_price: number | null;
}

interface DomainGridProps {
  domains: Domain[];
  isLoading: boolean;
}

export function DomainGrid({ domains, isLoading }: DomainGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!domains.length) {
    return (
      <div className="text-center py-16">
        <Globe className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No hay dominios disponibles</h3>
        <p className="text-muted-foreground">
          No encontramos dominios que coincidan con tus filtros.
          Intenta ajustar tu búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {domains.map((domain) => (
        <DomainCard key={domain.id} domain={domain} />
      ))}
    </div>
  );
}
