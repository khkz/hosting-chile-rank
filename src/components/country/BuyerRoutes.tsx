import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowRight, Server, ShoppingCart, Building2, Cpu } from 'lucide-react';
import type { LatamDcSlug } from '@/lib/dcLocal';

/**
 * "Rutas por proyecto" — buyer journeys por país. Enlaza a páginas
 * ya existentes bajo /{pais}. NADA inventado: son solo rutas útiles.
 */
export default function BuyerRoutes({
  country,
  countryName,
}: {
  country: Exclude<LatamDcSlug, 'cl'>;
  countryName: string;
}) {
  const longSlug = ({ pe: 'peru', mx: 'mexico', co: 'colombia', ar: 'argentina' } as const)[country];
  const routes = [
    {
      icon: Server,
      title: 'Necesito latencia mínima dentro del país',
      desc: 'Solo proveedores con datacenter dentro de ' + countryName + ' (verificado por IP/ASN).',
      to: `/${country}/hosting-con-datacenter-local`,
      cta: 'Ver DC local',
    },
    {
      icon: Building2,
      title: 'Quiero comparar el top verificado ' + countryName + ' 2026',
      desc: 'Ranking ordenado por calidad del datacenter, latencia, entidad local y antigüedad.',
      to: `/${country}/mejor-hosting-${longSlug}-2026`,
      cta: 'Ver top 2026',
    },
    {
      icon: Cpu,
      title: 'Quiero ver benchmarks reales (uptime + TTFB)',
      desc: 'Monitoreo continuo de los sitios oficiales. Sin puntajes inventados.',
      to: `/${country}/benchmark`,
      cta: 'Ver benchmark',
    },
    {
      icon: ShoppingCart,
      title: 'Quiero ver las comparativas 1-a-1',
      desc: 'Fichas comparadas por pares con los datos verificables lado a lado.',
      to: `/${country}#directorio`,
      cta: 'Ver directorio',
    },
  ];

  return (
    <section className="mb-10" aria-label={`Rutas por proyecto en ${countryName}`}>
      <h2 className="text-lg md:text-xl font-bold text-[#2B2D42] mb-3">
        ¿Qué necesitas para tu proyecto en {countryName}?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {routes.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.title} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#EF233C]/10 p-2 shrink-0">
                  <Icon className="h-4 w-4 text-[#EF233C]" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#2B2D42] leading-snug">
                    {r.title}
                  </h3>
                  <p className="text-xs text-[#2B2D42]/70 mt-1">{r.desc}</p>
                  <Link
                    to={r.to}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-[#EF233C] font-medium hover:underline"
                  >
                    {r.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
