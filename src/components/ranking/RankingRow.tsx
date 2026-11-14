import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrustSignalBadge from '../TrustSignalBadge';
import { lookupHostDc } from '../DatacenterBadge';
import { ProvenanceTag } from '../data/Provenance';
import { Button } from '@/components/ui/button';
import { getProviderLink } from '@/lib/providerLinks';
import { track } from '@/lib/track';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { formatScore } from '@/lib/format';
import { useReviewStatsForSlug } from '@/hooks/useReviewStats';
import { cleanBadges, cleanFeatures } from './rankingText';

/**
 * Fila de los tres primeros puestos del ranking de Chile. Separada de
 * HostingRanking para respetar el máximo de 400 líneas por archivo.
 * Rojo solo en el número y la marca del puesto 1; el resto, en tinta.
 */

// ── Types mapped to Supabase columns ────────────────────────────
export interface RankingCompany {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  logo_url: string | null;
  overall_rating: number;
  speed_rating: number;
  price_rating: number;
  is_independent: boolean | null;
  corporate_group: string | null;
  legal_name: string | null;
  foundation_year: number | null;
  ranking_position: number;
  is_recommended: boolean;
  ranking_features: string[];
  ranking_badges: string[];
  cta_text: string | null;
  cta_micro_copy: string | null;
  button_color: string | null;
  border_color: string | null;
  display_name_first: string | null;
  display_name_second: string | null;
  display_name_first_color: string | null;
  display_name_second_color: string | null;
  promo_price: number | null;
  original_price: number | null;
  price_period: string;
  updated_at?: string | null;
  // derived
  sortPosition: number;
}

// ── Fila del ranking (puestos 1 a 3) ───────────────────────────
interface RankingRowProps {
  provider: RankingCompany;
  ratingLabel: string;
  /** Qué nota muestra la cifra: general, velocidad o precio y valor. */
  metricLabel: string;
  isWinner: boolean;
}

const DC_TEXT: Record<string, string> = {
  certificado: 'Datacenter certificado',
  autodeclarado: 'Datacenter autodeclarado',
  extranjero: 'Infraestructura extranjera',
  no_divulga: 'No divulga datacenter',
};

const RankingRow: React.FC<RankingRowProps> = ({ provider, ratingLabel, metricLabel, isWinner }) => {
  const { data: userStats } = useReviewStatsForSlug(provider.slug);
  const dc = lookupHostDc(provider.name);
  const features = cleanFeatures(provider.ranking_features);
  const badges = cleanBadges(provider.ranking_badges);
  const link = provider.slug && provider.website ? getProviderLink(provider.slug, provider.website) : null;
  const name = `${provider.display_name_first || provider.name}${provider.display_name_second || ''}`;
  const rating = Number(ratingLabel.replace('/10', ''));

  return (
    <article
      className={`relative grid gap-x-8 gap-y-5 border-b border-rule py-7 lg:grid-cols-[88px_minmax(0,1fr)_248px] ${
        isWinner ? 'lg:-mx-4 lg:rounded-xl lg:border lg:border-rule lg:bg-paper lg:px-4' : ''
      }`}
      aria-label={`Puesto ${provider.sortPosition}: ${provider.name}`}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      <meta itemProp="name" content={provider.name} />
      <meta itemProp="applicationCategory" content="Web Hosting Service" />
      <meta itemProp="operatingSystem" content="Linux" />

      {isWinner && <span className="absolute bottom-7 left-0 top-7 hidden w-1 rounded-r bg-brand lg:block" aria-hidden />}

      <div className="flex items-center gap-4 lg:block">
        <span
          className={`type-display block text-5xl tabular lg:text-6xl ${isWinner ? 'text-brand' : 'text-ink-3'}`}
          aria-hidden
        >
          {provider.sortPosition}
        </span>
        <h3 className="text-2xl font-bold text-ink lg:hidden">{name}</h3>
      </div>

      <div className="min-w-0">
        <h3 className="hidden text-[1.7rem] font-bold leading-tight text-ink lg:block">{name}</h3>

        <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[15px] text-ink-2 md:text-sm">
          {provider.corporate_group && (
            <div className="flex gap-1">
              <dt className="text-ink-3">Grupo:</dt>
              <dd>{formatCorporateGroup(provider.corporate_group)}</dd>
            </div>
          )}
          {dc && (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Datacenter:</dt>
              <dd className="inline-flex items-center gap-1.5">
                <span>
                  {DC_TEXT[dc.estado] ?? 'Datacenter'}
                  {dc.operador && <span className="text-ink-3"> ({dc.operador})</span>}
                </span>
                <ProvenanceTag kind="declared" variant="glyph" />
              </dd>
            </div>
          )}
          <div>
            <dt className="sr-only">Verificación y reclamos:</dt>
            <dd>
              <TrustSignalBadge companyId={provider.id} />
            </dd>
          </div>
        </dl>

        {features.length > 0 && (
          <ul className="mt-5 grid list-disc gap-x-8 gap-y-1.5 pl-5 text-base text-ink marker:text-ink-3 sm:grid-cols-2 md:text-[15px]">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}

        {badges.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ProvenanceTag kind="editorial" variant="glyph" />
            <ul className="flex flex-wrap gap-2" aria-label="Distinciones editoriales">
              {badges.map((badge, idx) => (
                <li key={idx} className="rounded-sm border border-rule bg-white px-2 py-0.5 text-xs font-medium text-ink-2">
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:max-w-sm lg:max-w-none lg:items-end lg:text-right">
        <div>
          <p className="flex items-baseline gap-1 lg:justify-end">
            <span
              className="text-4xl font-bold text-ink tabular"
              itemProp="aggregateRating"
              itemScope
              itemType="https://schema.org/AggregateRating"
            >
              <meta itemProp="ratingValue" content={String(provider.overall_rating)} />
              <meta itemProp="bestRating" content="10" />
              <meta itemProp="ratingCount" content="1" />
              {Number.isFinite(rating) ? formatScore(rating) : '—'}
            </span>
            <span className="text-ink-3">/10</span>
          </p>
          <p className="t-meta mt-1 flex items-center gap-2 lg:justify-end">
            {metricLabel}
            <ProvenanceTag kind="editorial" />
          </p>
          {userStats && userStats.count > 0 && (
            <p className="t-meta mt-2 tabular">
              Usuarios: {userStats.avg.toFixed(1).replace('.', ',')} de 5 en {userStats.count} reseña{userStats.count === 1 ? '' : 's'}
            </p>
          )}
        </div>

        {link && (
          <Button asChild size="lg" className="w-full lg:w-auto lg:min-w-[200px]">
            <a
              href={link.href}
              target="_blank"
              rel={link.rel}
              referrerPolicy="no-referrer"
              onClick={() => track('click_visitar_sitio', { slug: provider.slug, location: 'ranking_top3', position: provider.ranking_position ?? undefined })}
            >
              Ir al sitio<span className="sr-only"> de {provider.name} (se abre en otra pestaña)</span>
              <ExternalLink aria-hidden />
            </a>
          </Button>
        )}
        {provider.cta_micro_copy && <p className="t-meta">{provider.cta_micro_copy}</p>}
        {provider.slug && (
          <Link
            to={`/catalogo/${provider.slug}`}
            aria-label={`Ver ficha de ${provider.name}`}
            className="inline-flex min-h-[44px] items-center self-start text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink lg:min-h-0 lg:self-end"
            onClick={() => track('click_ver_ficha', { slug: provider.slug, location: 'ranking_top3' })}
          >
            Ver ficha
          </Link>
        )}
        <p className="t-meta">Enlace de afiliado: puede generarnos una comisión sin costo extra para ti.</p>
      </div>
    </article>
  );
};

export default RankingRow;
