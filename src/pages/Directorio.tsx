import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, Clock, Cpu } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import PageHeader from '@/components/system/PageHeader';
import CatalogList, { CatalogLegend } from '@/components/catalogo/CatalogList';
import CatalogRow from '@/components/catalogo/CatalogRow';
import { isHiddenProvider } from '@/lib/providerLinks';

const CURRENT_YEAR = new Date().getFullYear();

interface DirectoryCompany {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  overall_rating: number | null;
  is_curated: boolean | null;
  is_verified: boolean | null;
  contact_phone: string | null;
  contact_address: string | null;
  contact_hours: string | null;
  datacenter_location: string | null;
  corporate_group: string | null;
  legal_name: string | null;
  technologies: string[] | null;
  year_founded: number | null;
}

const hasEditorialRating = (c: DirectoryCompany) => c.is_curated === true && (c.overall_rating ?? 0) > 0;

/** Razón social y contacto: lo propio del directorio completo. */
const Details: React.FC<{ c: DirectoryCompany }> = ({ c }) => {
  const techs = Array.isArray(c.technologies) ? c.technologies.filter((t) => typeof t === 'string') : [];
  const items: Array<{ icon?: typeof Phone; label: string; text: string }> = [];
  if (c.contact_phone) items.push({ icon: Phone, label: 'Teléfono', text: c.contact_phone });
  if (c.contact_address) items.push({ icon: MapPin, label: 'Dirección', text: c.contact_address });
  if (c.contact_hours) items.push({ icon: Clock, label: 'Horario', text: c.contact_hours });
  if (techs.length > 0) items.push({ icon: Cpu, label: 'Tecnología', text: techs.slice(0, 6).join(', ') });
  if (!c.legal_name && items.length === 0) return null;
  return (
    <div className="mt-1 space-y-0.5 t-meta">
      {c.legal_name && <p className="text-ink-2">{c.legal_name}</p>}
      {items.length > 0 && (
        <p className="flex flex-wrap gap-x-4 gap-y-0.5">
          {items.map(({ icon: Icon, label, text }) => (
            <span key={label} className="inline-flex min-w-0 items-start gap-1">
              {Icon && <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />}
              <span className="sr-only">{label}: </span>
              <span className="min-w-0 [overflow-wrap:anywhere]">{text}</span>
            </span>
          ))}
        </p>
      )}
    </div>
  );
};

const Directorio: React.FC = () => {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['directorio-completo-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, website, overall_rating, is_curated, is_verified, contact_phone, contact_address, contact_hours, datacenter_location, corporate_group, legal_name, technologies, year_founded')
        .eq('country', getActiveCountryCode())
        .range(0, 999);
      if (error) throw error;
      return (data || []) as DirectoryCompany[];
    },
  });

  const sorted = useMemo(() => {
    const list = (companies || []).filter((c) => !isHiddenProvider(c.slug, c.website));
    const curated = list.filter(hasEditorialRating).sort((a, b) => (b.overall_rating || 0) - (a.overall_rating || 0));
    const rest = list.filter((c) => !hasEditorialRating(c)).sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return [...curated, ...rest];
  }, [companies]);

  return (
    <>
      <DynamicMetaTags
        title={`Directorio completo de hosting Chile ${CURRENT_YEAR} | EligeTuHosting`}
        description="Listado completo de proveedores de hosting en Chile con datos verificables: contacto, dirección, datacenter, grupo corporativo y tecnologías."
        canonical="https://eligetuhosting.cl/directorio"
      />
      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={<SEOBreadcrumbs items={[{ name: 'Directorio completo', href: '/directorio' }]} />}
          title="Directorio completo de hosting en Chile"
          lead={`${sorted.length ? `${sorted.length} proveedores` : 'Todos los proveedores'}: primero los que tienen nota editorial y después el resto, de la A a la Z, con su razón social y su contacto.`}
        />

        <section aria-labelledby="lista-directorio" className="bg-white py-8 md:py-12">
          <div className="container">
            <h2 id="lista-directorio" className="sr-only">Lista de proveedores</h2>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="t-small text-ink-2" aria-live="polite">
                {isLoading ? 'Cargando proveedores…' : `${sorted.length} proveedores`}
              </p>
              <CatalogLegend />
            </div>
            <div className="mt-6">
              {!isLoading && (
                <CatalogList label="Directorio de proveedores de hosting en Chile">
                  {sorted.map((c) => (
                    <CatalogRow
                      key={c.id}
                      location="directorio"
                      details={<Details c={c} />}
                      row={{
                        slug: c.slug,
                        name: c.name,
                        rating: hasEditorialRating(c) ? c.overall_rating : null,
                        datacenter: c.datacenter_location,
                        group: c.corporate_group,
                        yearFounded: c.year_founded,
                        website: c.website,
                      }}
                    />
                  ))}
                </CatalogList>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Directorio;
