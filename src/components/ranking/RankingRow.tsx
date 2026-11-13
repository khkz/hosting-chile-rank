import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrustSignalBadge from '../TrustSignalBadge';
import { lookupHostDc } from '../DatacenterBadge';
import { ProvenanceTag } from '../data/Provenance';
import { getProviderLink } from '@/lib/providerLinks';
import { track } from '@/lib/track';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { useReviewStatsForSlug } from '@/hooks/useReviewStats';
import { cleanCtaText, cleanFeatures } from './rankingText';

/**
 * Fila de los tres primeros puestos del ranking de Chile. Separada de
 * HostingRanking para respetar el máximo de 400 líneas por archivo.
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
  const link = provider.slug && provider.website ? getProviderLink(provider.slug, provider.website) : null;
  const name = `${provider.display_name_first || provider.name}${provider.display_name_second || ''}`;

  return (
    <article
      className={`relative grid gap-x-8 gap-y-5 border-b border-rule py-8 md:grid-cols-[88px_minmax(0,1fr)_240px] ${
        isWinner ? 'md:-mx-4 md:rounded-lg md:border md:border-ink/15 md:bg-paper md:px-4' : ''
      }`}
      aria-label={`Puesto ${provider.sortPosition}: ${provider.name}`}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      <meta itemProp="name" content={provider.name} />
      <meta itemProp="applicationCategory" content="Web Hosting Service" />
      <meta itemProp="operatingSystem" content="Linux" />

      {isWinner && <span className="absolute left-0 top-8 bottom-8 hidden w-1 rounded-r bg-brand md:block" aria-hidden />}

      <div className="flex items-center gap-4 md:block">
        <span
          className={`type-display block text-5xl tabular md:text-6xl ${isWinner ? 'text-brand' : 'text-ink-3'}`}
          aria-hidden
        >
          {provider.sortPosition}
        </span>
        <h3 className="text-2xl font-bold text-ink md:hidden">{name}</h3>
      </div>

      <div className="min-w-0">
        <h3 className="hidden text-[1.7rem] font-bold leading-tight text-ink md:block">{name}</h3>

        <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-2">
          {provider.corporate_group && (
            <div className="flex gap-1">
              <dt className="text-ink-3">Grupo:</dt>
              <dd>{formatCorporateGroup(provider.corporate_group)}</dd>
            </div>
          )}
          {dc && (
            <div className="flex gap-1">
              <dt className="sr-only">Datacenter:</dt>
              <dd>
                {DC_TEXT[dc.estado] ?? 'Datacenter'}
                {dc.operador && <span className="text-ink-3"> ({dc.operador})</span>}
              </dd>
            </div>
          )}
          <div>
            <dt className="sr-only">Verificación y reclamos:</dt>
            <dd><TrustSignalBadge companyId={provider.id} /></dd>
          </div>
        </dl>

        {features.length > 0 && (
          <ul className="mt-5 grid gap-x-6 gap-y-2 text-[15px] text-ink sm:grid-cols-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className={`mt-1 h-4 w-4 shrink-0 ${isWinner ? 'text-brand' : 'text-ok'}`} aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {provider.ranking_badges?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Distinciones editoriales">
            {provider.ranking_badges.map((badge, idx) => (
              <li key={idx} className="rounded border border-ink/15 bg-white px-2 py-0.5 text-xs font-medium text-ink-2">
                {badge}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3 md:items-end md:text-right">
        <div>
          <p className="flex items-baseline gap-1 md:justify-end">
            <span
              className="text-4xl font-bold text-ink tabular"
              itemProp="aggregateRating"
              itemScope
              itemType="https://schema.org/AggregateRating"
            >
              <meta itemProp="ratingValue" content={String(provider.overall_rating)} />
              <meta itemProp="bestRating" content="10" />
              <meta itemProp="ratingCount" content="1" />
              {ratingLabel.replace('/10', '').replace('.', ',')}
            </span>
            <span className="text-ink-3">/10</span>
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs text-ink-2 md:justify-end">
            {metricLabel}
            <ProvenanceTag kind="editorial" />
          </p>
          {userStats && userStats.count > 0 && (
            <p className="mt-2 text-xs text-ink-2 tabular">
              Usuarios: {userStats.avg.toFixed(1).replace('.', ',')} de 5 en {userStats.count} reseña{userStats.count === 1 ? '' : 's'}
            </p>
          )}
        </div>

        {link && (
          <a
            href={link.href}
            target="_blank"
            rel={link.rel}
            referrerPolicy="no-referrer"
            onClick={() => track('click_visitar_sitio', { slug: provider.slug, location: 'ranking_top3', position: provider.ranking_position ?? undefined })}
            className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-md px-5 text-base font-semibold md:w-auto md:min-w-[200px] ${
              isWinner ? 'bg-brand text-white hover:bg-brand-ink' : 'bg-ink text-white hover:bg-ink-soft'
            }`}
          >
            {cleanCtaText(provider.cta_text)}
          </a>
        )}
        {provider.cta_micro_copy && <p className="text-xs text-ink-3">{provider.cta_micro_copy}</p>}
        {provider.slug && (
          <Link
            to={`/catalogo/${provider.slug}`}
            className="text-sm font-semibold text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
            onClick={() => track('click_ver_ficha', { slug: provider.slug, location: 'ranking_top3' })}
          >
            Análisis completo de {provider.name}
          </Link>
        )}
        <p className="text-[11px] leading-snug text-ink-3">Enlace de afiliado: puede generarnos una comisión sin costo extra para ti.</p>
      </div>
    </article>
  );
};

export default RankingRow;
