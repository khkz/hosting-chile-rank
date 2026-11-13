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
      <h2 className="type-wide mb-3 text-xl font-bold text-ink md:text-2xl">
        ¿Qué necesitas para tu proyecto en {countryName}?
      </h2>
      <ul className="grid grid-cols-1 border-t border-rule md:grid-cols-2 md:gap-x-8">
        {routes.map((r) => {
          const Icon = r.icon;
          return (
            <li key={r.title} className="border-b border-rule">
              <Link to={r.to} className="group flex items-start gap-3 py-4">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink group-hover:underline underline-offset-4">{r.title}</span>
                  <span className="mt-0.5 block text-sm text-ink-2">{r.desc}</span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
