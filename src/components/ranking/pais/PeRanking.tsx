import React from 'react';
import { ExternalLink, Minus, Plus } from 'lucide-react';
import EvidenceCard from '@/components/system/EvidenceCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/track';
import { displayText, isOwnSite, priceText, splitName, type PeProvider } from './peTypes';

const yesNo = (v: boolean) => (v ? 'Sí' : 'No');

const ProsCons: React.FC<{ title: string; items: string[]; icon: typeof Plus }> = ({ title, items, icon: Icon }) => (
  <div className="min-w-0">
    <p className="t-label">{title}</p>
    <ul className="mt-2 space-y-1.5">
      {items.map((x) => (
        <li key={x} className="t-small flex gap-2 text-ink-2">
          <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" />
          <span className="min-w-0">{x}</span>
        </li>
      ))}
    </ul>
  </div>
);

/** Enlace al proveedor: rojo solo en el puesto 1; el resto, con borde. */
export const ProviderLink: React.FC<{ p: PeProvider; rank: number; location: string; className?: string }> = ({
  p,
  rank,
  location,
  className,
}) => {
  const { title } = splitName(p.name);
  const own = isOwnSite(p.url);
  return (
    <Button asChild variant={rank === 1 ? 'brand' : 'outline'} className={className}>
      <a
        href={p.url}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        onClick={() => track('click_visitar_sitio', { slug: p.slug || p.name.toLowerCase(), location })}
      >
        {own ? 'Ver el directorio de Perú' : `Ir al sitio de ${title}`}
        <ExternalLink aria-hidden />
      </a>
    </Button>
  );
};

/**
 * Ranking de Perú con la ficha de evidencia del sistema. Notas, precios y
 * textos son los de la página (pendiente 6): aquí solo cambia la forma.
 */
const PeRanking: React.FC<{ providers: PeProvider[] }> = ({ providers }) => (
  <ol className="grid gap-6 lg:grid-cols-2">
    {providers.map((p, i) => {
      const { title, subtitle } = splitName(p.name);
      return (
        <li key={p.name} className="min-w-0">
          <EvidenceCard
            className="h-full"
            rank={i + 1}
            title={title}
            subtitle={subtitle}
            score={p.rating}
            scoreKind="editorial"
            rows={[
              { label: 'Precio', value: priceText(p.price), kind: 'declared' },
              { label: 'En resumen', value: displayText(p.precioNota), kind: 'editorial' },
              { label: 'Datacenter', value: p.datacenter, kind: 'declared' },
              { label: 'Factura peruana', value: yesNo(p.facturaLocal) },
              { label: 'Soporte en Perú', value: yesNo(p.soporteLocal) },
              { label: 'LiteSpeed', value: yesNo(p.litespeed) },
            ]}
            footer={
              <>
                {p.destacado && (
                  <Badge variant="outline" className="w-fit">
                    Recomendado editorial
                  </Badge>
                )}
                <div className="grid w-full gap-5 sm:grid-cols-2">
                  <ProsCons title="A favor" items={p.pros} icon={Plus} />
                  <ProsCons title="En contra" items={p.contras} icon={Minus} />
                </div>
                <ProviderLink p={p} rank={i + 1} location="pe_ranking" className="w-full sm:w-auto" />
              </>
            }
          />
        </li>
      );
    })}
  </ol>
);

export default PeRanking;
