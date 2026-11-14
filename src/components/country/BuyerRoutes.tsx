import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, List, MessageSquare, Server, type LucideIcon } from 'lucide-react';
import Section from '@/components/system/Section';
import { ProvenanceTag } from '@/components/data/Provenance';
import { RANKING_YEAR, getEditionBySlug, rankingPath } from '@/lib/countries';
import { registryName, routesTitle, voiceFor, type ComSlug } from '@/components/country/edicion/editionVoice';

/**
 * Rutas por proyecto de cada edición. Enlazan a páginas que ya existen bajo
 * /{país} y describen lo que esas páginas muestran, con su procedencia:
 * la lista de datacenter local sale de lo que declara cada proveedor.
 */
interface Route {
  icon: LucideIcon;
  title: string;
  desc: React.ReactNode;
  to: string;
}

export default function BuyerRoutes({ country, countryName }: { country: ComSlug; countryName: string }) {
  const edition = getEditionBySlug(country);
  const registry = registryName(voiceFor(country).registry);
  const routes: Route[] = [
    {
      icon: Server,
      title: 'Necesito latencia mínima dentro del país',
      desc: (
        <>
          Proveedores que declaran datacenter en{' '}
          <span className="whitespace-nowrap">
            {countryName} <ProvenanceTag kind="declared" variant="glyph" />
          </span>
        </>
      ),
      to: `/${country}/hosting-con-datacenter-local`,
    },
    {
      icon: Building2,
      title: `Quiero comparar el ranking de ${countryName} ${RANKING_YEAR}`,
      desc: 'Ranking ordenado por calidad del datacenter, latencia, entidad local y antigüedad.',
      to: edition ? rankingPath(edition) : `/${country}`,
    },
    {
      icon: MessageSquare,
      title: 'Quiero ver la reputación de cada proveedor',
      desc: `Reseñas de usuarios moderadas y el enlace a ${registry}, el registro oficial de consumo.`,
      to: `/${country}/benchmark`,
    },
    {
      icon: List,
      title: 'Quiero ver todos los proveedores',
      desc: `El directorio completo de ${countryName}, con filtros por datacenter local y soporte.`,
      to: '#directorio',
    },
  ];

  return (
    <Section id="rutas" title={routesTitle(country, countryName)} density="tight">
      <ul className="grid border-t border-rule md:grid-cols-2 md:gap-x-10">
        {routes.map((r) => {
          const Icon = r.icon;
          const body = (
            <>
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink underline-offset-4 group-hover:underline">{r.title}</span>
                <span className="t-small mt-0.5 block text-ink-2">{r.desc}</span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
            </>
          );
          const cls = 'group flex min-h-[44px] items-start gap-3 py-4';
          return (
            <li key={r.title} className="border-b border-rule">
              {r.to.startsWith('#') ? (
                <a href={r.to} className={cls}>
                  {body}
                </a>
              ) : (
                <Link to={r.to} className={cls}>
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
