import React, { useState } from 'react';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { ShieldCheck, MapPin, Building2, Calendar, CheckCircle2, ArrowRight, MessageSquarePlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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

// Build trust signals from REAL data only. Never invent — if the field is missing, the signal is skipped.
const buildSignals = (c: CompanyRow): { icon: React.ReactNode; label: string }[] => {
  const signals: { icon: React.ReactNode; label: string }[] = [];

  if (c.datacenter_location && /chile|santiago|providencia/i.test(c.datacenter_location)) {
    signals.push({ icon: <MapPin className="w-3.5 h-3.5" />, label: 'Datacenter en Chile' });
  }

  const founded = c.foundation_year ?? c.year_founded;
  if (founded && founded > 1990 && founded <= new Date().getFullYear()) {
    const years = new Date().getFullYear() - founded;
    if (years >= 1) {
      signals.push({ icon: <Calendar className="w-3.5 h-3.5" />, label: `${years}+ años en el mercado` });
    }
  }

  if (c.is_independent === true) {
    signals.push({ icon: <Building2 className="w-3.5 h-3.5" />, label: 'Empresa independiente' });
  } else if (c.is_independent === false && c.corporate_group) {
    signals.push({ icon: <Building2 className="w-3.5 h-3.5" />, label: formatCorporateGroup(c.corporate_group) });
  }

  if (c.has_migration_free) {
    signals.push({ icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Migración gratuita' });
  }

  // Pull up to 2 verified facts from curated ranking_features that aren't already covered
  const extra = (c.ranking_features ?? []).filter(Boolean).slice(0, 2);
  for (const f of extra) {
    if (signals.length >= 5) break;
    signals.push({ icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: f });
  }

  return signals.slice(0, 5);
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
    <section className="bg-gradient-to-b from-[#F7F9FC] to-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#EF233C]/10 text-[#EF233C] px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            Señales públicas verificables
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-4">
            Reputación verificada de los proveedores
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Combinamos fuentes públicas y datos curados de cada proveedor: ubicación del datacenter,
            años en el mercado, independencia corporativa y servicios incluidos. Sin estrellas inventadas.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#EF233C] to-pink-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Trust cards for top 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 mb-12 max-w-6xl mx-auto">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <Skeleton className="h-10 w-10 rounded mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-1.5" />
                  <Skeleton className="h-3 w-full mb-1.5" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))
            : (top5 ?? []).map((c) => {
                const signals = buildSignals(c);
                return (
                  <article
                    key={c.slug}
                    className="group relative bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#EF233C]/30 transition-all duration-300 flex flex-col"
                  >
                    {c.ranking_position && (
                      <span className="absolute -top-2 -left-2 inline-flex items-center justify-center w-7 h-7 bg-[#2B2D42] text-white text-xs font-bold rounded-full shadow">
                        #{c.ranking_position}
                      </span>
                    )}

                    <div className="flex items-center gap-3 mb-3 min-h-[40px]">
                      {c.logo_url ? (
                        <img
                          src={c.logo_url}
                          alt={`Logo ${c.name}`}
                          className="h-8 max-w-[110px] object-contain"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <h3 className="font-bold text-[#2B2D42] text-sm">{c.name}</h3>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-[#2B2D42] mb-2">{c.name}</p>

                    {signals.length > 0 ? (
                      <ul className="space-y-1.5 mb-4 flex-1">
                        {signals.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-700">
                            <span className="text-green-600 mt-0.5 flex-shrink-0">{s.icon}</span>
                            <span className="leading-snug">{s.label}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-500 italic mb-4 flex-1">
                        Datos en proceso de verificación.
                      </p>
                    )}

                    <Link
                      to={`/resenas/${c.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#EF233C] hover:text-[#b3001b] mt-auto group-hover:gap-2 transition-all"
                    >
                      Ver análisis completo
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </article>
                );
              })}
        </div>

        {/* CTA: deja tu reseña */}
        <div className="text-center mb-16">
          <div className="inline-flex flex-col items-center gap-3 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm max-w-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-[#EDF2F4] to-gray-200 rounded-full flex items-center justify-center">
              <MessageSquarePlus className="w-6 h-6 text-[#2B2D42]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2B2D42]">
              ¿Usaste alguno de estos hostings?
            </h3>
            <Button
              asChild
              className="cta-primary px-6 py-3 rounded-xl font-semibold"
            >
              <Link to="/vota-hosting">
                Deja tu reseña
                <span className="ml-2">→</span>
              </Link>
            </Button>
            <p className="text-xs text-gray-500 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Las opiniones se verifican antes de publicarse.
            </p>
          </div>
        </div>

        {/* Partners Section */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-[#2B2D42] mb-8">
            Proveedores verificados en Chile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center max-w-6xl mx-auto">
            {loadingCompanies ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))
            ) : (
              companies?.map((company) => (
                <Link
                  key={company.slug}
                  to={`/catalogo/${company.slug}`}
                  className="group flex items-center justify-center h-12 w-full"
                  title={`Ver ficha de ${company.name}`}
                >
                  <img
                    src={company.logo_url || '/placeholder.svg'}
                    className="max-h-10 max-w-full object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                    alt={`Logo de ${company.name} - Hosting verificado en Chile`}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      <ReviewModal open={reviewOpen} onOpenChange={setReviewOpen} />
    </section>
  );
};

export default Testimonial;
