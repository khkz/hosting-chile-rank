import React from 'react';
import { Link } from 'react-router-dom';
import EvidenceCard from '@/components/system/EvidenceCard';
import { lookupHostDc } from '@/components/DatacenterBadge';
import { formatDataDate } from '@/lib/format';
import { track } from '@/lib/track';
import { VERIFICATION_DATE_ISO } from '@/data/verified2026';

export interface HeroTopProvider {
  name: string;
  slug: string;
  overall_rating: number | string | null;
}

interface HeroTopCardProps {
  provider: HeroTopProvider | null | undefined;
  loading: boolean;
}

/**
 * Ficha de evidencia del puesto 1 en la portada (respaldo de la imagen del hero).
 * Usa los datos que ya carga el hero: nota editorial, datacenter que declara el
 * proveedor (registro de datacenters) y la fecha de revisión del ranking.
 */
const HeroTopCard: React.FC<HeroTopCardProps> = ({ provider, loading }) => {
  if (loading) {
    // Reserva el alto de la ficha mientras carga: la columna no salta.
    return (
      <div aria-hidden className="min-h-[296px] rounded-xl border border-rule bg-white p-5 md:p-6">
        <div className="h-3 w-10 rounded-sm bg-paper-deep" />
        <div className="mt-3 h-5 w-1/2 rounded-sm bg-paper-deep" />
        <div className="mt-8 h-4 w-full rounded-sm bg-paper-deep" />
        <div className="mt-5 h-4 w-3/4 rounded-sm bg-paper-deep" />
      </div>
    );
  }
  if (!provider) return null;

  const dc = lookupHostDc(provider.name);
  const score = provider.overall_rating != null ? Number(provider.overall_rating) : null;

  return (
    <>
      <h2 className="sr-only">Primer lugar del ranking de Chile</h2>
      <EvidenceCard
        rank={1}
        title={provider.name}
        subtitle="Primer lugar en Chile"
        score={Number.isFinite(score) ? score : null}
        scoreKind="editorial"
        rows={[
          {
            label: 'Datacenter',
            value: dc?.dc_declarado ?? 'Sin dato',
            kind: dc?.dc_declarado ? 'declared' : undefined,
          },
          { label: 'Revisión del ranking', value: formatDataDate(VERIFICATION_DATE_ISO) },
        ]}
        footer={
          <Link
            to={`/catalogo/${provider.slug}`}
            aria-label={`Ver ficha de ${provider.name}`}
            onClick={() => track('click_ver_ficha', { slug: provider.slug, location: 'hero_card' })}
            className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            Ver ficha
          </Link>
        }
      />
    </>
  );
};

export default HeroTopCard;
