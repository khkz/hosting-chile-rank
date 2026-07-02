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
  FileText, Cpu, Globe, ShieldCheck, Calendar, Hash,
} from 'lucide-react';
import { COUNTRIES, type CountryCode } from '@/lib/country';
import { getProviderLink, isHiddenProvider } from '@/lib/providerLinks';
import { formatCorporateGroup } from '@/lib/formatGroup';

const COUNTRY_MAP: Record<string, CountryCode> = { pe: 'PE', mx: 'MX', co: 'CO', ar: 'AR' };

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

  // JSON-LD Organization
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

  const techs: string[] = Array.isArray((company as any).technologies)
    ? (company as any).technologies.filter((t: any) => typeof t === 'string') : [];

  return (
    <>
      <Helmet>
        <html lang={info.locale} />
        <title>{title}</title>
        <meta name="description" content={descParts} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={descParts} />
        <meta property="og:url" content={canonical} />
        <meta name="robots" content="index,follow" />
        <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
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

        {company.website && (
          <div className="mb-8">
            <Button asChild className="cta-primary gap-2">
              <a href={link.href} target="_blank" rel={link.rel} referrerPolicy="no-referrer">
                Visitar sitio oficial <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
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
