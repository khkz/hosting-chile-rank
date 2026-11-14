import React, { useState } from 'react';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Section from '@/components/system/Section';
import { ProvenanceTag, type Provenance } from '@/components/data/Provenance';
import { ReviewModal } from '@/components/reviews/ReviewModal';

interface CompanyRow {
  name: string;
  slug: string;
  logo_url: string | null;
  ranking_position: number | null;
  datacenter_location: string | null;
  foundation_year: number | null;
  year_founded: number | null;
  is_independent: boolean | null;
  corporate_group: string | null;
  has_migration_free: boolean | null;
  has_ssl_free: boolean | null;
  uptime_guarantee: string | null;
  ranking_features: string[] | null;
  ranking_badges: string[] | null;
  technologies: string[] | null;
}

interface Signal {
  label: string;
  /** Procedencia del campo, cuando se conoce. */
  kind?: Provenance;
}

// Build trust signals from REAL data only. Never invent — if the field is missing, the signal is skipped.
const buildSignals = (c: CompanyRow): Signal[] => {
  const signals: Signal[] = [];

  if (c.datacenter_location && /chile|santiago|providencia/i.test(c.datacenter_location)) {
    signals.push({ label: 'Datacenter en Chile', kind: 'declared' });
  }

  if (c.is_independent === true) {
    signals.push({ label: 'Empresa independiente' });
  } else if (c.is_independent === false && c.corporate_group) {
    signals.push({ label: formatCorporateGroup(c.corporate_group) });
  }

  if (c.has_migration_free) {
    signals.push({ label: 'Migración gratuita', kind: 'declared' });
  }

  // Pull up to 2 verified facts from curated ranking_features that aren't already covered
  const extra = (c.ranking_features ?? []).filter(Boolean).slice(0, 2);
  for (const f of extra) {
    if (signals.length >= 5) break;
    signals.push({ label: f });
  }

  return signals.slice(0, 5);
};

const textLink = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

/** Logo del proveedor; si no hay o no carga, su nombre (nunca un recuadro vacío). */
const LogoOrName: React.FC<{ name: string; logo: string | null }> = ({ name, logo }) => {
  const [failed, setFailed] = useState(false);
  if (!logo || failed) return <>{name}</>;
  return <img src={logo} alt="" loading="lazy" className="max-h-9 max-w-full object-contain" onError={() => setFailed(true)} />;
};

const Testimonial = () => {
  const [reviewOpen, setReviewOpen] = useState(false);

  const { data: top5, isLoading } = useQuery({
    queryKey: ['reputacion-verificada-top5'],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('name, slug, logo_url, ranking_position, datacenter_location, foundation_year, year_founded, is_independent, corporate_group, has_migration_free, has_ssl_free, uptime_guarantee, ranking_features, ranking_badges, technologies')
        .eq('country', getActiveCountryCode())
        .eq('is_verified', true)
        .eq('is_curated', true)
        .not('ranking_position', 'is', null)
        .order('ranking_position', { ascending: true })
        .limit(5);
      return (data ?? []) as unknown as CompanyRow[];
    },
    staleTime: 1000 * 60 * 30,
  });

  const { data: companies, isLoading: loadingCompanies } = useQuery({
    queryKey: ['verified-companies-logos'],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('name, slug, logo_url')
        .eq('country', getActiveCountryCode())
        .eq('is_verified', true)
        .order('overall_rating', { ascending: false })
        .limit(8);
      return data ?? [];
    },
    staleTime: 1000 * 60 * 30,
  });

  return (
    <Section
      id="reputacion"
      title="Reputación verificada de los proveedores"
      lead="Combinamos fuentes públicas y datos curados de cada proveedor: ubicación del datacenter, independencia corporativa y servicios incluidos. Sin estrellas inventadas."
    >
      {/* Señales de los primeros puestos curados: filas con reglas */}
      {isLoading ? (
        <div aria-busy="true" aria-label="Cargando proveedores" className="space-y-3 border-t-2 border-ink pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-sm bg-paper-deep" />
          ))}
        </div>
      ) : top5 && top5.length > 0 ? (
        <ol className="divide-y divide-rule border-y-2 border-ink">
          {top5.map((c) => {
            const signals = buildSignals(c);
            return (
              <li key={c.slug} className="grid gap-3 py-5 md:grid-cols-12 md:gap-8">
                <p className="flex items-baseline gap-3 md:col-span-3">
                  {c.ranking_position && (
                    <span className="w-6 shrink-0 text-lg font-bold text-ink-3 tabular">
                      <span className="sr-only">Puesto </span>
                      {c.ranking_position}
                    </span>
                  )}
                  <span className="font-semibold text-ink">{c.name}</span>
                </p>
                {signals.length > 0 ? (
                  <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-base text-ink-2 md:col-span-7 md:text-[15px]">
                    {signals.map((s) => (
                      <li key={s.label} className="inline-flex items-center gap-1.5">
                        {s.kind ? (
                          <ProvenanceTag kind={s.kind} variant="glyph" />
                        ) : (
                          <span aria-hidden className="h-1 w-1 shrink-0 rounded-sm bg-ink-3" />
                        )}
                        {s.label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-base text-ink-3 md:col-span-7 md:text-[15px]">Datos en proceso de verificación.</p>
                )}
                <Link
                  to={`/resenas/${c.slug}`}
                  aria-label={`Ver análisis completo de ${c.name}`}
                  className={`inline-flex min-h-[44px] items-center text-[15px] md:col-span-2 md:min-h-0 md:justify-end ${textLink}`}
                >
                  Ver análisis completo
                </Link>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="measure border-t-2 border-ink pt-4 text-base text-ink-2">
          Todavía no publicamos señales curadas para esta edición. Mientras tanto, revisa los{' '}
          <Link to="/reclamos" className={textLink}>
            reclamos verificados
          </Link>{' '}
          y las fichas del{' '}
          <Link to="/catalogo" className={textLink}>
            catálogo
          </Link>
          .
        </p>
      )}

      {/* Reseñas de usuarios */}
      <div className="mt-10 flex flex-col gap-4 border-t border-rule pt-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="t-h3 text-ink">¿Usaste alguno de estos hostings?</h3>
          <p className="t-meta mt-1 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-ink-3" aria-hidden />
            Las opiniones se verifican antes de publicarse.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/vota-hosting">Deja tu reseña</Link>
        </Button>
      </div>

      {/* Proveedores verificados: logo si existe; si no, el nombre */}
      <div className="mt-10">
        <h3 className="t-h3 text-ink">Proveedores verificados en Chile</h3>
        <ul className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-4 lg:grid-cols-8">
          {loadingCompanies
            ? Array.from({ length: 8 }).map((_, i) => <li key={i} aria-hidden className="h-16 bg-white" />)
            : companies?.map((company) => (
                <li key={company.slug} className="bg-white">
                  <Link
                    to={`/catalogo/${company.slug}`}
                    className="flex h-16 items-center px-4 text-sm font-semibold text-ink hover:bg-paper"
                    aria-label={`Ver ficha de ${company.name}`}
                  >
                    <LogoOrName name={company.name} logo={company.logo_url} />
                  </Link>
                </li>
              ))}
        </ul>
      </div>
      <ReviewModal open={reviewOpen} onOpenChange={setReviewOpen} />
    </Section>
  );
};

export default Testimonial;
