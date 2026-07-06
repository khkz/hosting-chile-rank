import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink, Phone, Mail, MapPin, Clock, Server, Building2,
  FileText, Cpu, Globe, ShieldCheck, Calendar, Hash, Activity, HelpCircle, AlertTriangle,
} from 'lucide-react';
import { COUNTRIES, type CountryCode } from '@/lib/country';
import { getProviderLink, isHiddenProvider } from '@/lib/providerLinks';
import { formatCorporateGroup } from '@/lib/formatGroup';

const COUNTRY_MAP: Record<string, CountryCode> = { pe: 'PE', mx: 'MX', co: 'CO', ar: 'AR' };
const COUNTRY_FULLNAME: Record<CountryCode, string> = { PE: 'Perú', MX: 'México', CO: 'Colombia', AR: 'Argentina', CL: 'Chile' };

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
  const isCurated: boolean = (company as any).is_curated === true;

  const link = getProviderLink(company.slug, company.website);
  const canonical = `https://eligetuhosting.com/${info.slug}/${company.slug}`;
  const title = `${company.name} — Hosting en ${info.name} | EligeTuHosting`;
  const descParts = [
    company.name,
    (company as any).legal_name ? `(${(company as any).legal_name})` : null,
    `— hosting en ${info.name}.`,
    (company as any).datacenter_location ? `Datacenter: ${(company as any).datacenter_location}.` : null,
    (company as any).year_founded ? `Opera desde ${(company as any).year_founded}.` : null,
    idFiscal ? `ID fiscal: ${idFiscal}.` : null,
  ].filter(Boolean).join(' ').slice(0, 158);

  const orgLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: company.website || canonical,
  };
  if (company.contact_phone) orgLd.telephone = company.contact_phone;
  if (company.contact_email) orgLd.email = company.contact_email;
  if (company.contact_address) {
    orgLd.address = {
      '@type': 'PostalAddress',
      streetAddress: company.contact_address,
      addressCountry: info.code,
    };
  }
  if ((company as any).year_founded) orgLd.foundingDate = String((company as any).year_founded);
  if (company.corporate_group) {
    const g = String(company.corporate_group).trim();
    orgLd.parentOrganization = { '@type': 'Organization', name: /^grupo\s/i.test(g) ? g : `Grupo ${g}` };
  }
  if ((company as any).legal_name) orgLd.legalName = (company as any).legal_name;
  if (idFiscal) orgLd.taxID = idFiscal;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${info.name}`, item: `https://eligetuhosting.com/${info.slug}` },
      { '@type': 'ListItem', position: 3, name: company.name, item: canonical },
    ],
  };

  const rawUpdated = (company as any).updated_at || (company as any).created_at || null;
  const dateModified = rawUpdated ? new Date(rawUpdated).toISOString() : new Date().toISOString();
  const dateModifiedDisplay = dateModified.slice(0, 10);
  orgLd.dateModified = dateModified;
  (breadcrumbLd as any).dateModified = dateModified;

  const techs: string[] = Array.isArray((company as any).technologies)
    ? (company as any).technologies.filter((t: any) => typeof t === 'string') : [];

  const ogLocale = info.locale.replace('-', '_');
  const countryName = COUNTRY_FULLNAME[code!];
  const editorialSummary: string | null = (company as any).editorial_summary || null;

  // FAQ dinámico desde datos verificables
  const hasLocalDc = (company as any).datacenter_location && (
    (code === 'PE' && /per[uú]/i.test((company as any).datacenter_location)) ||
    (code === 'MX' && /m[eé]xico/i.test((company as any).datacenter_location)) ||
    (code === 'CO' && /colombia/i.test((company as any).datacenter_location)) ||
    (code === 'AR' && /argentina/i.test((company as any).datacenter_location))
  );
  const faq: Array<{ q: string; a: string }> = [
    {
      q: `¿${company.name} tiene datacenter en ${countryName}?`,
      a: hasLocalDc
        ? `Sí, declara datacenter en ${countryName} (${(company as any).datacenter_location}), lo que reduce latencia para audiencias locales.`
        : (company as any).datacenter_location
          ? `No. Su datacenter declarado está en ${(company as any).datacenter_location}, es decir opera como revendedor internacional para clientes locales.`
          : `${company.name} no publica ubicación de datacenter en su sitio oficial. La latencia y jurisdicción de los datos deben verificarse antes de contratar.`,
    },
    {
      q: `¿Cuál es la razón social e ID fiscal de ${company.name}?`,
      a: [
        (company as any).legal_name ? `Razón social registrada: ${(company as any).legal_name}.` : `${company.name} no publica razón social en su sitio oficial.`,
        idFiscal ? `Identificador fiscal declarado: ${idFiscal}.` : null,
      ].filter(Boolean).join(' '),
    },
    {
      q: `¿Qué tecnologías declara ${company.name}?`,
      a: techs.length > 0
        ? `Tecnologías declaradas por el proveedor: ${techs.join(', ')}.`
        : `${company.name} no publica un stack técnico detallado en su sitio oficial.`,
    },
    {
      q: `¿${company.name} es una marca global o regional?`,
      a: isGlobal
        ? `Es una marca global con presencia comercial en ${countryName}.`
        : (company as any).corporate_group
          ? `Forma parte del grupo ${formatCorporateGroup((company as any).corporate_group)}, con operación regional.`
          : `Opera principalmente en ${countryName} según los datos declarados.`,
    },
  ];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    dateModified,
    mainEntity: faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  // Ordenar alternativas: datacenter local primero
  const isLocalDc = (loc?: string | null) => !!loc && new RegExp(countryName, 'i').test(loc);
  const altsSorted = (alternatives ?? [])
    .slice()
    .sort((a: any, b: any) => (isLocalDc(b.datacenter_location) ? 1 : 0) - (isLocalDc(a.datacenter_location) ? 1 : 0))
    .slice(0, 4);

  const complaintsCount = complaintsStats?.count ?? 0;
  const startDateDisplay = '2025-01-01'; // fecha de inicio de registro público

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
        <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="breadcrumb">
          <Link to="/" className="hover:underline">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to={`/${info.slug}`} className="hover:underline">Hosting en {info.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{company.name}</span>
        </nav>

        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2B2D42]">
              {company.name}
            </h1>
            {isGlobal && (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                <Globe className="h-3 w-3 mr-1" /> Marca global
              </Badge>
            )}
            {estado && (
              <Badge variant="outline" className="text-xs">{estado}</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Hosting en {info.name} {info.flag} — datos verificables.
          </p>
          <p className="mt-2 text-xs text-[#2B2D42]/60">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Datos verificados: <time dateTime={dateModified}>{dateModifiedDisplay}</time>
            </span>
          </p>
        </header>

        {isCurated && (
          <Card className="mb-6 border-[#EF233C]/40 bg-[#EF233C]/5">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-[#EF233C] mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-[#EF233C] font-semibold mb-1">
                    Recomendado por EligeTuHosting
                  </div>
                  <p className="text-sm text-[#2B2D42]/80">
                    {company.name} es la recomendación editorial de EligeTuHosting en {info.name}: operador regional con infraestructura propia y soporte hispano.
                  </p>
                  <p className="text-[11px] text-[#2B2D42]/60 mt-2 leading-snug">
                    <strong>Divulgación:</strong> tenemos una relación comercial con este proveedor y podemos recibir una comisión si contratas por este enlace. La recomendación se basa en trayectoria verificable y no altera el resto del directorio.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {(company as any).legal_name && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><span className="font-medium">Razón social:</span> {(company as any).legal_name}</div>
              </div>
            )}
            {idFiscal && (
              <div className="flex items-start gap-2">
                <Hash className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><span className="font-medium">Identificador fiscal:</span> {idFiscal}</div>
              </div>
            )}
            {company.website && (
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Sitio web:</span>{' '}
                  <a href={link.href} target="_blank" rel={link.rel} referrerPolicy="no-referrer" className="text-primary hover:underline inline-flex items-center gap-1">
                    {company.website.replace(/^https?:\/\//, '')} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
            {company.contact_phone && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><span className="font-medium">Teléfono:</span> <a className="text-primary hover:underline" href={`tel:${company.contact_phone}`}>{company.contact_phone}</a></div>
              </div>
            )}
            {company.contact_email && (
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><span className="font-medium">Email:</span> <a className="text-primary hover:underline" href={`mailto:${company.contact_email}`}>{company.contact_email}</a></div>
              </div>
            )}
            {company.contact_address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><span className="font-medium">Dirección:</span> {company.contact_address}</div>
              </div>
            )}
            {company.contact_hours && (
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><span className="font-medium">Horario:</span> {company.contact_hours}</div>
              </div>
            )}
            {(company as any).datacenter_location && (
              <div className="flex items-start gap-2">
                <Server className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><span className="font-medium">Datacenter:</span> {(company as any).datacenter_location}</div>
              </div>
            )}
            {(company as any).year_founded && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><span className="font-medium">Año de fundación:</span> {(company as any).year_founded}</div>
              </div>
            )}
            {company.corporate_group && (
              <div className="flex items-start gap-2 md:col-span-2">
                <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><span className="font-medium">Grupo corporativo:</span> {formatCorporateGroup(company.corporate_group)}</div>
              </div>
            )}
            {techs.length > 0 && (
              <div className="flex items-start gap-2 md:col-span-2">
                <Cpu className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Tecnologías:</span>{' '}
                  <span className="inline-flex flex-wrap gap-1 align-middle">
                    {techs.map((t, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contexto editorial */}
        {editorialSummary && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-[#2B2D42]">
              <FileText className="h-5 w-5" /> Contexto
            </h2>
            <Card>
              <CardContent className="pt-6 text-sm text-[#2B2D42]/90 whitespace-pre-line leading-relaxed">
                {editorialSummary}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Verificación técnica */}
        {siteCheck && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-[#2B2D42]">
              <Activity className="h-5 w-5" /> Verificación técnica
            </h2>
            <Card>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {siteCheck.resolved_ip && (
                  <div><span className="font-medium">IP del sitio:</span> <code className="text-xs">{siteCheck.resolved_ip}</code></div>
                )}
                {siteCheck.asn && (
                  <div><span className="font-medium">ASN:</span> {siteCheck.asn}{siteCheck.asn_org ? ` — ${siteCheck.asn_org}` : ''}</div>
                )}
                {siteCheck.ssl_issuer && (
                  <div><span className="font-medium">Certificado SSL:</span> emitido por {siteCheck.ssl_issuer}</div>
                )}
                {siteCheck.ssl_valid_to && (
                  <div><span className="font-medium">SSL vigente hasta:</span> {new Date(siteCheck.ssl_valid_to).toISOString().slice(0, 10)}</div>
                )}
                {typeof siteCheck.ttfb_ms === 'number' && (
                  <div><span className="font-medium">TTFB medido:</span> {siteCheck.ttfb_ms} ms</div>
                )}
                {typeof siteCheck.http_status === 'number' && (
                  <div><span className="font-medium">Estado HTTP:</span> {siteCheck.http_status}</div>
                )}
                <div className="md:col-span-2 text-xs text-muted-foreground pt-2 border-t">
                  Medición automática realizada el <time dateTime={siteCheck.checked_at}>{new Date(siteCheck.checked_at).toISOString().slice(0, 10)}</time>. Datos técnicos verificables desde el sitio oficial del proveedor.
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Reputación */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-[#2B2D42]">
            <AlertTriangle className="h-5 w-5" /> Reputación
          </h2>
          <Card>
            <CardContent className="pt-6 text-sm">
              <p>
                <strong>{complaintsCount}</strong>{' '}
                {complaintsCount === 1 ? 'reclamo verificado' : 'reclamos verificados'} sobre {company.name} desde el <time dateTime={startDateDisplay}>{startDateDisplay}</time>.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Los reclamos se verifican por email antes de publicarse. <Link to="/reclamos" className="text-primary hover:underline">Reportar un problema</Link>.
              </p>
            </CardContent>
          </Card>
        </section>

        {company.website && (
          <div className="mb-8">
            <Button asChild className="cta-primary gap-2">
              <a href={link.href} target="_blank" rel={link.rel} referrerPolicy="no-referrer">
                Visitar sitio oficial <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-[#2B2D42]">
            <HelpCircle className="h-5 w-5" /> Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <Card key={i}>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-semibold text-sm mb-1">{f.q}</h3>
                  <p className="text-sm text-[#2B2D42]/80">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Alternativas en {pais} */}
        {altsSorted.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-[#2B2D42]">
              Alternativas en {info.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {altsSorted.map((a: any) => {
                const pair = company.slug < a.slug ? `${company.slug}-vs-${a.slug}` : `${a.slug}-vs-${company.slug}`;
                return (
                  <div key={a.slug} className="p-4 border rounded-md hover:bg-muted/50 transition">
                    <Link to={`/${info.slug}/${a.slug}`} className="block">
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {isLocalDc(a.datacenter_location) ? `Datacenter local (${a.datacenter_location})` : (a.datacenter_location || 'Datacenter no publicado')}
                      </div>
                    </Link>
                    <Link
                      to={`/${info.slug}/comparativa/${pair}`}
                      className="text-xs text-primary hover:underline inline-block mt-2"
                    >
                      Comparar {company.name} vs {a.name} →
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-sm">
              <Link to={`/${info.slug}`} className="text-primary hover:underline">
                Ver todo el directorio de {info.name}
              </Link>
              <span className="mx-2 text-muted-foreground">·</span>
              <Link to="/latam" className="text-primary hover:underline">
                Hosting en Latinoamérica
              </Link>
            </div>
          </section>
        )}

        <div className="text-sm">
          <Link to={`/${info.slug}`} className="text-primary hover:underline">
            ← Volver al directorio de {info.name}
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CountryProviderDetail;
