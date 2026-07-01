import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  ArrowRight,
  Globe,
  ExternalLink,
  Phone,
  MapPin,
  Clock,
  Server,
  Building2,
  FileText,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { COUNTRIES, getCountryFromPath } from '@/lib/country';

import { getProviderLink, isHiddenProvider } from '@/lib/providerLinks';
import { formatCorporateGroup } from '@/lib/formatGroup';

const CountryLanding = () => {
  const location = useLocation();
  const info = getCountryFromPath(location.pathname) ?? COUNTRIES.PE;

  const { data: companies, isLoading } = useQuery({
    queryKey: ['country-directory', info.code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(
          'id, slug, name, website, contact_phone, contact_address, contact_hours, datacenter_location, corporate_group, legal_name, technologies, is_verified, is_curated'
        )
        .eq('country', info.code)
        .eq('is_verified', true)
        .range(0, 999);
      if (error) throw error;
      return (data || []).filter((c: any) => !isHiddenProvider(c.slug, c.website));
    },
  });

  const canonical = `https://eligetuhosting.com/${info.slug}`;
  const title = `Hosting en ${info.name} — Directorio verificado · Elige Tu Hosting`;
  const description = `Directorio verificable de hosting en ${info.name}: proveedores con datos comprobables (razón social, ID fiscal, datacenter, tecnología) y metodología transparente.`;

  const curatedCompany = (companies || []).find((c: any) => c.is_curated === true) || null;
  const recommended = curatedCompany
    ? {
        name: curatedCompany.name,
        url: curatedCompany.website || '#',
        rel: 'noopener',
        claim: `Operador regional con infraestructura propia y soporte hispano 24/7 en ${info.name}.`,
      }
    : null;

  const lastUpdated = new Date().toISOString().slice(0, 10);

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${info.name}`, item: canonical },
    ],
  };

  // JSON-LD: CollectionPage with ItemList of Organizations
  const orgItems = (companies || []).map((c: any, i: number) => {
    const org: any = {
      '@type': 'Organization',
      name: c.name,
      url: c.website || canonical,
    };
    if (c.contact_address) org.address = c.contact_address;
    if (c.contact_phone) org.telephone = c.contact_phone;
    return { '@type': 'ListItem', position: i + 1, item: org };
  });
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    inLanguage: info.locale,
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: orgItems.length,
      itemListElement: orgItems,
    },
  };

  const faqs = [
    {
      q: `¿Qué es este directorio de hosting en ${info.name}?`,
      a: `Es un listado independiente de proveedores de hosting con presencia en ${info.name}, publicado por Elige Tu Hosting. Mostramos únicamente datos comprobables (razón social, contacto, datacenter, tecnología) sin puntajes inventados.`,
    },
    {
      q: '¿Cómo se verifican los datos?',
      a: 'Contrastamos WHOIS, ASN, registros mercantiles, sitios oficiales y respuestas de soporte. No publicamos ranking hasta tener reclamos, benchmarks y trayectoria confirmados con la misma metodología usada en Chile.',
    },
    {
      q: `¿Por qué HostingPlus aparece como recomendado en ${info.name}?`,
      a: 'HostingPlus opera regionalmente con infraestructura propia y soporte 24/7 en español. Divulgación: podemos recibir una comisión si contratas por ese enlace; la recomendación se basa en trayectoria verificable y no altera el resto del directorio.',
    },
    {
      q: '¿Cómo sugerir un proveedor o corregir datos?',
      a: 'Escríbenos desde /contacto indicando el sitio, razón social e ID fiscal. Revisamos cada solicitud y publicamos solo cuando los datos son verificables.',
    },
  ];
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <html lang={info.locale} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta name="robots" content="index,follow" />
        <link rel="alternate" hrefLang="es-CL" href="https://eligetuhosting.cl/" />
        <link rel="alternate" hrefLang="es-PE" href="https://eligetuhosting.com/pe" />
        <link rel="alternate" hrefLang="es-MX" href="https://eligetuhosting.com/mx" />
        <link rel="alternate" hrefLang="es-CO" href="https://eligetuhosting.com/co" />
        <link rel="alternate" hrefLang="es-AR" href="https://eligetuhosting.com/ar" />
        <link rel="alternate" hrefLang="x-default" href="https://eligetuhosting.com/" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <Navbar />

      <main className="min-h-[60vh] container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EF233C]/10 text-[#EF233C] text-sm font-medium mb-4">
              <Globe className="h-4 w-4" />
              {info.flag} Versión {info.name}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-3">
              Hosting en {info.name}
            </h1>
            <p className="text-base md:text-lg text-[#2B2D42]/70 max-w-2xl mx-auto">
              Directorio independiente con datos comprobables (contacto, datacenter,
              razón social, tecnología). No publicamos puntajes hasta verificar
              reclamos, ASN y trayectoria con la misma metodología que en Chile.
            </p>
          </div>

          {recommended && (
            <Card className="mb-10 border-[#EF233C]/40 bg-[#EF233C]/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 flex-wrap">
                  <ShieldCheck className="h-6 w-6 text-[#EF233C] mt-1 shrink-0" />
                  <div className="flex-1 min-w-[240px]">
                    <div className="text-xs uppercase tracking-wide text-[#EF233C] font-semibold mb-1">
                      Recomendado por EligeTuHosting
                    </div>
                    <div className="text-xl font-bold text-[#2B2D42] mb-1">
                      {recommended.name}
                    </div>
                    <p className="text-sm text-[#2B2D42]/70 mb-3">
                      {recommended.claim}
                    </p>
                    <Button asChild size="sm" className="cta-primary">
                      <a
                        href={recommended.url}
                        target="_blank"
                        rel={recommended.rel}
                        referrerPolicy="no-referrer"
                        className="inline-flex items-center gap-2"
                      >
                        Visitar sitio oficial <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-[#2B2D42]/60 mt-4 leading-snug">
                  <strong>Divulgación:</strong> EligeTuHosting puede recibir una
                  comisión si contratas a través de este enlace. La recomendación
                  se basa en trayectoria verificable del grupo en LATAM y no
                  altera el resto del directorio, que se ordena por datos
                  públicos comprobables.
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <p className="text-center text-muted-foreground py-10">
              Cargando proveedores…
            </p>
          ) : (companies && companies.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {companies.map((c: any) => {
                const link = c.slug && c.website ? getProviderLink(c.slug, c.website) : null;
                const techs: string[] = Array.isArray(c.technologies)
                  ? c.technologies.filter((t: any) => typeof t === 'string')
                  : [];
                return (
                  <Card key={c.id} className="flex flex-col hover:shadow-md transition-shadow">
                    <CardContent className="pt-5 flex-grow space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-lg font-semibold leading-tight">
                          {c.name}
                        </h2>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          Datos verificables
                        </Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1.5">
                        {c.legal_name && (
                          <li className="flex items-start gap-2">
                            <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{c.legal_name}</span>
                          </li>
                        )}
                        {c.corporate_group && (
                          <li className="flex items-start gap-2">
                            <Building2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{formatCorporateGroup(c.corporate_group)}</span>
                          </li>
                        )}
                        {c.datacenter_location && (
                          <li className="flex items-start gap-2">
                            <Server className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{c.datacenter_location}</span>
                          </li>
                        )}
                        {c.contact_phone && (
                          <li className="flex items-start gap-2">
                            <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{c.contact_phone}</span>
                          </li>
                        )}
                        {c.contact_address && (
                          <li className="flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{c.contact_address}</span>
                          </li>
                        )}
                        {c.contact_hours && (
                          <li className="flex items-start gap-2">
                            <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{c.contact_hours}</span>
                          </li>
                        )}
                        {techs.length > 0 && (
                          <li className="flex items-start gap-2">
                            <Cpu className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{techs.slice(0, 6).join(', ')}</span>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                    {link && (
                      <div className="border-t bg-muted/40 p-3">
                        <Button asChild size="sm" variant="outline" className="w-full gap-1">
                          <a
                            href={link.href}
                            target="_blank"
                            rel={link.rel}
                            referrerPolicy="no-referrer"
                          >
                            Visitar sitio <ExternalLink size={14} />
                          </a>
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#2B2D42]/10 rounded-xl p-6 md:p-8 text-center">
              <h2 className="text-xl font-semibold text-[#2B2D42] mb-2">
                Próximamente: estamos verificando los proveedores de {info.name}
              </h2>
              <p className="text-sm text-[#2B2D42]/70 mb-5 max-w-xl mx-auto">
                No publicamos rankings sin datos verificables. Estamos auditando
                ASN, datacenter, reclamos y trayectoria con la misma metodología
                que aplicamos en Chile.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild variant="outline">
                  <a href="https://eligetuhosting.cl/ranking" className="flex items-center gap-2">
                    Ver metodología (Chile) <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contacto">Sugerir un proveedor</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Metodología y transparencia */}
          <section className="mt-14 bg-white border border-[#2B2D42]/10 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#2B2D42] mb-3">
              Metodología y transparencia
            </h2>
            <p className="text-sm text-[#2B2D42]/75 leading-relaxed mb-3">
              Este directorio de {info.name} se construye únicamente con datos
              públicos comprobables: razón social, identificador fiscal, sitio
              oficial, datacenter declarado, tecnología del stack y canales de
              contacto. No publicamos puntajes ni "notas" hasta contar con
              benchmarks propios, reclamos verificados y trayectoria auditable,
              con la misma metodología aplicada en Chile.
            </p>
            <p className="text-xs text-[#2B2D42]/60">
              Última actualización de datos: <strong>{lastUpdated}</strong>. Los
              datos se publican bajo licencia CC-BY-4.0 y son de acceso libre.
            </p>
          </section>

          {/* FAQ */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-[#2B2D42] mb-4">
              Preguntas frecuentes
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white border border-[#2B2D42]/10 rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left font-medium">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#2B2D42]/75">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CountryLanding;
