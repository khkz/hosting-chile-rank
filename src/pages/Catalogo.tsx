import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import TechnicalGlossary from '@/components/TechnicalGlossary';
import RelatedContent from '@/components/RelatedContent';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import { Button } from '@/components/ui/button';
import CatalogList, { CatalogLegend } from '@/components/catalogo/CatalogList';
import CatalogRow from '@/components/catalogo/CatalogRow';
import { useReviewStats } from '@/hooks/useReviewStats';
import { filterVisibleProviders } from '@/lib/providerLinks';
import type { Tables } from '@/integrations/supabase/types';

const CURRENT_YEAR = new Date().getFullYear();

type Company = Tables<'hosting_companies'>;

const REASONS: Array<{ title: string; text: string }> = [
  {
    title: 'Mejor velocidad para usuarios locales',
    text: 'Los servidores ubicados en Chile ofrecen tiempos de respuesta más rápidos para visitantes locales, mejorando la experiencia del usuario y el SEO para búsquedas desde Chile.',
  },
  {
    title: 'Soporte técnico en español',
    text: 'Contar con atención al cliente en tu idioma y en tu zona horaria facilita la resolución de problemas técnicos y mejora la comunicación con tu proveedor.',
  },
  {
    title: 'IP local para SEO',
    text: 'Una dirección IP chilena puede mejorar el posicionamiento en buscadores para las búsquedas realizadas desde Chile, especialmente para negocios locales.',
  },
  {
    title: 'Facturación local',
    text: 'La facturación en pesos chilenos y la posibilidad de emitir documentos tributarios locales simplifican la contabilidad para empresas y emprendedores del país.',
  },
];

const normalized = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const CatalogoPage = () => {
  // Orden y búsqueda viven en la URL: se conservan al volver de una ficha y al compartir el enlace.
  const [params, setParams] = useSearchParams();
  const sortBy: 'rating' | 'name' = params.get('orden') === 'nombre' ? 'name' : 'rating';
  const query = params.get('q') ?? '';
  const updateParam = (key: string, value: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );

  const { data: companies, isLoading } = useQuery({
    queryKey: ['hosting-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(`
          *,
          hosting_plans(*)
        `)
        .eq('country', getActiveCountryCode())
        .eq('is_verified', true)
        .order('overall_rating', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Orden: por nota (sin nota, al final y de la A a la Z) o de la A a la Z sobre la lista completa.
  const visibleCompanies = React.useMemo<Company[]>(
    () => (companies ? filterVisibleProviders([...companies]) : []),
    [companies],
  );
  const sortedCompanies = React.useMemo(() => {
    const byName = (a: Company, b: Company) => a.name.localeCompare(b.name, 'es');
    if (sortBy === 'name') return [...visibleCompanies].sort(byName);
    const hasRating = (c: Company) => (c.overall_rating ?? 0) > 0;
    return [
      ...visibleCompanies.filter(hasRating).sort((a, b) => (b.overall_rating || 0) - (a.overall_rating || 0)),
      ...visibleCompanies.filter((c) => !hasRating(c)).sort(byName),
    ];
  }, [visibleCompanies, sortBy]);

  const shownCompanies = React.useMemo(() => {
    const q = normalized(query.trim());
    if (!q) return sortedCompanies;
    return sortedCompanies.filter((c) =>
      [c.name, c.legal_name, c.slug, c.website].some((field) => normalized(field).includes(q))
    );
  }, [sortedCompanies, query]);

  const { data: reviewStats } = useReviewStats(sortedCompanies.map((c) => c.slug));
  const total = visibleCompanies.length;

  return (
    <>
      <DynamicMetaTags
        title={`Catálogo Hosting Chile ${CURRENT_YEAR} | Proveedores Verificados`}
        description="Directorio completo de proveedores de hosting en Chile. Información detallada, planes actualizados, precios y datos de contacto de las mejores empresas de hosting."
        canonical="https://eligetuhosting.cl/catalogo"
        keywords="hosting chile, proveedores hosting, catálogo hosting, hosting verificado, mejor hosting chile"
      />

      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={<SEOBreadcrumbs items={[{ name: 'Catálogo', href: '/catalogo' }]} />}
          title="Proveedores de hosting en Chile"
          lead={`${total ? `${total} proveedores` : 'Los proveedores'} con su nota editorial, el datacenter que declaran, su grupo y desde cuándo operan. Entra a cada ficha para ver de dónde sale cada dato.`}
        />

        <section aria-labelledby="lista-proveedores" className="bg-white py-8 md:py-12">
          <div className="container">
            <h2 id="lista-proveedores" className="sr-only">Lista de proveedores</h2>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="w-full max-w-md">
                <label htmlFor="buscar-proveedor" className="t-label mb-1.5 block text-ink">
                  Buscar proveedor
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
                  <input
                    id="buscar-proveedor"
                    type="search"
                    value={query}
                    onChange={(e) => updateParam('q', e.target.value || null)}
                    placeholder="Nombre o razón social"
                    className="h-11 w-full rounded-lg border border-ink/25 bg-white pl-9 pr-3 text-base text-ink placeholder:text-ink-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <div role="group" aria-labelledby="ordenar-rotulo" className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
                <span id="ordenar-rotulo" className="t-label text-ink md:font-normal md:text-ink-2">
                  Ordenar
                </span>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'rating' ? 'default' : 'outline'}
                    onClick={() => updateParam('orden', null)}
                    aria-pressed={sortBy === 'rating'}
                    className="flex-1 px-4 md:flex-none"
                  >
                    Por nota editorial
                  </Button>
                  <Button
                    variant={sortBy === 'name' ? 'default' : 'outline'}
                    onClick={() => updateParam('orden', 'nombre')}
                    aria-pressed={sortBy === 'name'}
                    className="flex-1 px-4 md:flex-none"
                  >
                    De la A a la Z
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-rule pt-4 md:flex-row md:items-center md:justify-between">
              <p className="t-small text-ink-2" aria-live="polite">
                {isLoading ? 'Cargando proveedores…' : `Mostrando ${shownCompanies.length} de ${total}`}
              </p>
              <CatalogLegend />
            </div>

            <div className="mt-6">
              {isLoading ? null : shownCompanies.length === 0 ? (
                <div className="max-w-xl rounded-xl border border-rule bg-paper p-6">
                  <p className="font-semibold text-ink">Ningún proveedor coincide con «{query}».</p>
                  <p className="mt-1 t-small text-ink-2">Prueba con otra parte del nombre o con la razón social.</p>
                  <Button type="button" variant="outline" className="mt-4" onClick={() => updateParam('q', null)}>
                    Borrar búsqueda
                  </Button>
                </div>
              ) : (
                <CatalogList label="Proveedores de hosting en Chile">
                  {shownCompanies.map((company) => (
                    <CatalogRow
                      key={company.id}
                      location="catalogo"
                      row={{
                        slug: company.slug,
                        name: company.name,
                        rating: company.overall_rating,
                        datacenter: company.datacenter_location,
                        group: company.corporate_group,
                        yearFounded: company.year_founded,
                        website: company.website,
                        reviews: reviewStats?.[company.slug] ?? null,
                      }}
                    />
                  ))}
                </CatalogList>
              )}
            </div>
          </div>
        </section>

        <Section
          id="glosario"
          tone="paper"
          density="tight"
          className="border-t border-rule"
          title="Glosario técnico"
          lead="Entiende las especificaciones técnicas antes de comparar planes."
        >
          <TechnicalGlossary />
        </Section>

        <section className="border-t border-rule bg-white py-10 md:py-14">
          <div className="container max-w-4xl">
            <RelatedContent currentPage="general" />
          </div>
        </section>

        <Section id="por-que-chile" tone="paper" density="tight" className="border-t border-rule" title="¿Por qué elegir un hosting chileno?">
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {REASONS.map((r) => (
              <div key={r.title} className="max-w-[62ch]">
                <h3 className="t-h3 text-ink">{r.title}</h3>
                <p className="t-body mt-2 text-ink-2">{r.text}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>

      <StickyCTA />
      <Footer />
    </>
  );
};

export default CatalogoPage;
