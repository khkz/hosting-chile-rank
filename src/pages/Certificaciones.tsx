import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Award, ArrowRight, ChevronRight } from 'lucide-react';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import { Button } from '@/components/ui/button';
import Section from '@/components/system/Section';
import RankingHeader from '@/components/hubs/RankingHeader';
import { useAuth } from '@/providers/AuthProvider';
import { formatInteger } from '@/lib/format';
import { toast } from 'sonner';

/**
 * /certificaciones con la cabecera de la familia «ranking». Sin el menú de
 * tarjetas antiguo ni degradados; el ícono de cada categoría que trae la base
 * (suele ser un emoji) no se dibuja: se usa un ícono lucide en tinta.
 * La fecha es la de la última distinción otorgada (granted_at), si existe.
 */
export default function Certificaciones() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleCertificationRequest = () => {
    if (!user) {
      navigate('/auth?redirect=/provider/certifications');
    } else if (role !== 'hosting_provider') {
      toast.error('Debes tener una cuenta de proveedor de hosting para solicitar certificaciones');
    } else {
      navigate('/provider/certifications');
    }
  };

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['certification-categories-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('certification_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      return data;
    },
  });

  const { data: activeCertifications } = useQuery({
    queryKey: ['active-certifications'],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_certifications')
        .select(`
          *,
          hosting_companies (name, slug, logo_url, overall_rating, total_reviews),
          certification_categories (name, icon, slug)
        `)
        .eq('status', 'active')
        .order('position', { ascending: true });
      return data;
    },
  });

  const grantedDates = (activeCertifications ?? [])
    .map((cert) => cert.granted_at)
    .filter((d): d is string => Boolean(d))
    .sort();
  const latestGranted = grantedDates.length > 0 ? grantedDates[grantedDates.length - 1] : null;

  const requestLabel = !user
    ? 'Inicia sesión para certificar'
    : role !== 'hosting_provider'
      ? 'Solo para proveedores'
      : 'Solicitar certificación';

  return (
    <>
      <DynamicMetaTags
        title="Certificaciones de Hosting en Chile 2026"
        description="Descubre las empresas de hosting certificadas en Chile. Reconocimientos oficiales por excelencia en servicio, soporte, seguridad y más."
        keywords="certificaciones hosting chile, mejor hosting certificado, hosting premium chile, reconocimientos hosting"
      />

      <Navbar />

      <main className="bg-white">
        <RankingHeader
          crumbs={[{ name: 'Certificaciones', href: '/certificaciones' }]}
          title="Certificaciones de Hosting Chile 2026"
          lead="Reconocemos a proveedores de hosting en Chile por categoría. Cada distinción enlaza a la ficha del proveedor para que revises sus datos."
          reviewedAt={latestGranted}
          reviewedLabel="Última distinción otorgada el"
          undatedNote={activeCertifications ? 'Todavía no hay distinciones publicadas' : 'Cargando las distinciones…'}
          legend={false}
        />

        <Section id="categorias" title="Categorías de certificación">
          {categoriesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Cargando categorías">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-48 rounded-xl border border-rule bg-paper" />
              ))}
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="max-w-[62ch] rounded-xl border border-rule bg-paper p-5 text-ink-2">
              <p className="font-semibold text-ink">Todavía no hay categorías de certificación publicadas.</p>
              <p className="mt-1">
                Mientras tanto, compara proveedores con datos en el{' '}
                <Link to="/ranking" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                  ranking
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const certs = (activeCertifications ?? []).filter((cert) => cert.category_id === category.id);
                return (
                  <li key={category.id} className="flex flex-col rounded-xl border border-rule bg-white p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper">
                        <Award className="h-5 w-5 text-ink-2" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="t-h3 text-ink">{category.name}</h3>
                        <p className="t-meta mt-0.5 tabular">
                          {formatInteger(certs.length)} {certs.length === 1 ? 'empresa certificada' : 'empresas certificadas'}
                        </p>
                      </div>
                    </div>
                    {category.description && <p className="t-small mt-3 text-ink-2">{category.description}</p>}

                    {certs.length > 0 && (
                      <ol className="mt-4 divide-y divide-rule border-t border-rule">
                        {certs.slice(0, 3).map((cert) => (
                          <li key={cert.id}>
                            <Link
                              to={`/catalogo/${cert.hosting_companies?.slug}`}
                              className="flex min-h-[44px] items-center gap-3 py-2 text-ink hover:underline"
                            >
                              {cert.position != null && (
                                <span className="w-8 shrink-0 font-semibold tabular text-ink-3">#{cert.position}</span>
                              )}
                              <span className="min-w-0 flex-1 truncate font-medium">{cert.hosting_companies?.name}</span>
                              <ChevronRight className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                            </Link>
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        <Section
          id="proveedores"
          tone="paper"
          title="¿Eres proveedor de hosting?"
          lead="Solicita certificaciones para destacar tu empresa y demostrar tu excelencia en el mercado chileno."
        >
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={handleCertificationRequest}>
              {requestLabel}
              <ArrowRight aria-hidden />
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/directorio-hosting-chile">Ver el directorio</Link>
            </Button>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
