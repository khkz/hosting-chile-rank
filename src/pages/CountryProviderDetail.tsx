import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import { ProvenanceTag } from '@/components/data/Provenance';
import Flag from '@/components/data/Flag';
import { Badge } from '@/components/ui/badge';
import SourcesConsulted from '@/components/catalogo/SourcesConsulted';
import FichaBreadcrumbs from '@/components/ficha/FichaBreadcrumbs';
import ProviderEvidence from '@/components/ficha/ProviderEvidence';
import SiteLink from '@/components/ficha/SiteLink';
import { Alternatives, Complaints, DeclaredData, FaqList, TechnicalCheck } from '@/components/ficha/CountryFichaParts';
import type { EvidenceRow } from '@/components/system/EvidenceCard';
import { COUNTRIES, type CountryCode } from '@/lib/country';
import { isHiddenProvider } from '@/lib/providerLinks';
import { buildCountryFichaSeo } from '@/components/ficha/buildCountryFichaSeo';
import { formatDataDate, formatInteger, formatMs, isoDate } from '@/lib/format';

const COUNTRY_MAP: Record<string, CountryCode> = { pe: 'PE', mx: 'MX', co: 'CO', ar: 'AR' };

const linkClass = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const CountryProviderDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const country = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  const code = country ? COUNTRY_MAP[country] : undefined;
  const info = code ? COUNTRIES[code] : null;

  const { data: company, isLoading } = useQuery({
    queryKey: ['country-provider-detail', code, slug],
    enabled: !!code && !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('*')
        .eq('country', code!)
        .eq('slug', slug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Última verificación técnica (latam_site_checks)
  const { data: siteCheck } = useQuery({
    queryKey: ['latam-site-check', company?.id],
    enabled: !!company?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('latam_site_checks' as any)
        .select('*')
        .eq('company_id', company!.id)
        .order('checked_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as any;
    },
  });

  // Alternativas del mismo país (excluyendo esta ficha)
  const { data: alternatives } = useQuery({
    queryKey: ['country-alternatives', code, company?.slug],
    enabled: !!code && !!company?.slug,
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('slug, name, datacenter_location, corporate_group')
        .eq('country', code!)
        .eq('is_verified', true)
        .neq('slug', company!.slug)
        .limit(20);
      return data ?? [];
    },
  });

  // Reclamos verificados sobre el proveedor
  const { data: complaintsStats } = useQuery({
    queryKey: ['company-complaints-count', company?.id],
    enabled: !!company?.id,
    queryFn: async () => {
      const { count } = await supabase
        .from('public_complaints_public' as any)
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company!.id)
        .in('status', ['verified', 'resolved']);
      return { count: count ?? 0 };
    },
  });

  useEffect(() => {
    if (!code) { navigate('/', { replace: true }); return; }
    if (slug && isHiddenProvider(slug, null)) { navigate(`/${country}`, { replace: true }); return; }
    if (!isLoading && !company && slug) navigate(`/${country}`, { replace: true });
  }, [code, company, isLoading, slug, country, navigate]);

  if (!info) return null;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Cargando información…</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!company) return null;

  const dc = (company as any).data_confidence || {};
  const idFiscal: string | null = dc?.id_fiscal || null;
  const isGlobal: boolean = String(dc?.global || '').toLowerCase() === 'true';
  const estado: string | null = dc?.estado || null;
  const isCurated: boolean = company.is_curated === true;

  const { canonical, title, descParts, orgLd, breadcrumbLd, rawUpdated, techs, ogLocale, countryName, editorialSummary, faq, faqLd } =
    buildCountryFichaSeo(company, info, code!, idFiscal, isGlobal);

  // Ordenar alternativas: datacenter local primero
  const isLocalDc = (loc?: string | null) => !!loc && new RegExp(countryName, 'i').test(loc);
  const altsSorted = (alternatives ?? [])
    .slice()
    .sort((a, b) => (isLocalDc(b.datacenter_location) ? 1 : 0) - (isLocalDc(a.datacenter_location) ? 1 : 0))
    .slice(0, 4);

  const complaintsCount = complaintsStats?.count ?? 0;
  const startDateDisplay = '2025-01-01'; // fecha de inicio de registro público

  // Fecha visible: solo la que trae la base (nunca la de hoy).
  const dataDate: string | null = rawUpdated;
  const dcShort = company.datacenter_location?.split(/\s+—\s+|\.\s/)[0] ?? null;
  const evidenceRows: EvidenceRow[] = [
    dcShort
      ? { label: 'Datacenter', value: dcShort, kind: 'declared', date: dataDate }
      : { label: 'Datacenter', value: 'No lo declara' },
    ...(idFiscal ? [{ label: 'ID fiscal', value: idFiscal, kind: 'declared' as const, date: dataDate }] : []),
    company.year_founded
      ? { label: 'Opera desde', value: String(company.year_founded), kind: 'declared', date: dataDate }
      : { label: 'Opera desde', value: 'No lo declara' },
    typeof siteCheck?.ttfb_ms === 'number' && siteCheck?.checked_at
      ? { label: 'TTFB medido', value: formatMs(siteCheck.ttfb_ms), kind: 'measured', date: siteCheck.checked_at }
      : { label: 'TTFB medido', value: 'sin medir' },
    { label: 'Reclamos verificados', value: formatInteger(complaintsCount) },
  ];

  return (
    <>
      <Helmet>
        <html lang={info.locale} />
        <title>{title}</title>
        <meta name="description" content={descParts} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={descParts} />
        <meta property="og:url" content={canonical} />
        <meta name="robots" content="index,follow" />
        <link rel="alternate" type="text/markdown" href={`/${info.slug}/${company.slug}.md`} title={`${company.name} — datos en Markdown (CC-BY-4.0)`} />
        <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={
            <FichaBreadcrumbs
              items={[{ name: 'Inicio', href: '/' }, { name: `Hosting en ${info.name}`, href: `/${info.slug}` }, { name: company.name }]}
            />
          }
          title={company.name}
          lead={
            <>
              <span className="inline-flex items-center gap-2 align-baseline">
                <Flag code={code!} size={20} />
                Hosting en {info.name}.
              </span>{' '}
              Lo que declara {company.name} y lo que hemos medido, cada dato con su fuente y su fecha.
            </>
          }
          actions={<SiteLink slug={company.slug} website={company.website} name={company.name} location="ficha_pais_cabecera" />}
          meta={
            <>
              {dataDate && (
                <span>
                  Datos actualizados el <time dateTime={isoDate(dataDate)}>{formatDataDate(dataDate)}</time>
                </span>
              )}
              {isGlobal && (
                <Badge variant="outline">
                  <Globe className="h-3.5 w-3.5" aria-hidden /> Marca global
                </Badge>
              )}
              {estado && <Badge variant="outline">{estado}</Badge>}
            </>
          }
          aside={
            <ProviderEvidence
              name={company.name}
              subtitle={company.legal_name || `Hosting en ${info.name}`}
              rating={null}
              showRating={false}
              rows={evidenceRows}
            />
          }
        />

        {(isCurated || editorialSummary) && (
          <Section id="contexto" density="tight" title="Contexto">
            {isCurated && (
              <Callout tone="note" title="Recomendado por EligeTuHosting" className="mt-0 max-w-[72ch]">
                <p>
                  {company.name} es la recomendación editorial de EligeTuHosting en {info.name}: operador regional con soporte en español. Más abajo están el datacenter que declara y la entidad que factura.
                </p>
                <p>
                  <strong>Divulgación:</strong> tenemos una relación comercial con este proveedor y podemos recibir una comisión si contratas por este enlace. La recomendación se basa en trayectoria verificable y no altera el resto del directorio.
                </p>
              </Callout>
            )}
            {editorialSummary && (
              <div className={isCurated ? 'mt-8' : undefined}>
                <p className="flex items-center gap-2 t-meta">
                  <ProvenanceTag kind="editorial" />
                  Criterio del equipo editorial
                </p>
                <p className="t-body mt-3 max-w-[62ch] whitespace-pre-line text-ink">{editorialSummary}</p>
              </div>
            )}
          </Section>
        )}

        <Section
          id="datos-declarados"
          tone="paper"
          density="tight"
          className="border-t border-rule"
          title="Datos declarados por el proveedor"
          lead={`Lo que ${company.name} publica sobre sí mismo. No lo hemos comprobado: por eso lleva la marca Declarado.`}
          action={<ProvenanceTag kind="declared" />}
        >
          <DeclaredData company={company} idFiscal={idFiscal} techs={techs} />
          <SourcesConsulted fuentes={company.fuentes} fechaVerificacion={company.fecha_verificacion} />
        </Section>

        {siteCheck && (
          <Section
            id="verificacion-tecnica"
            density="tight"
            className="border-t border-rule"
            title="Verificación técnica"
            lead="Lo medimos nosotros desde el sitio oficial del proveedor: IP, ASN, certificado SSL y tiempo de respuesta."
            action={<ProvenanceTag kind="measured" />}
          >
            <TechnicalCheck check={siteCheck} />
          </Section>
        )}

        <Section id="reputacion" tone="paper" density="tight" className="border-t border-rule" title="Reputación">
          <Complaints name={company.name} count={complaintsCount} since={startDateDisplay} />
        </Section>

        <Section id="preguntas" density="tight" className="border-t border-rule" title="Preguntas frecuentes">
          <FaqList items={faq} />
        </Section>

        <Section
          id="alternativas"
          tone="paper"
          density="tight"
          className="border-t border-rule"
          title={altsSorted.length > 0 ? `Alternativas en ${info.name}` : 'Sigue comparando'}
        >
          {altsSorted.length > 0 && (
            <Alternatives company={company} items={altsSorted} countrySlug={info.slug} isLocalDc={isLocalDc} />
          )}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 t-small">
            <Link to={`/${info.slug}`} className={linkClass}>
              Ver todo el directorio de {info.name}
            </Link>
            <Link to="/latam" className={linkClass}>
              Hosting en Latinoamérica
            </Link>
          </div>
          <Link to={`/${info.slug}`} className="mt-8 inline-flex min-h-[44px] items-center gap-1.5 t-small font-semibold text-ink-2 hover:text-ink">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Volver al directorio de {info.name}
          </Link>
        </Section>
      </main>

      <Footer />
    </>
  );
};

export default CountryProviderDetail;
