import { useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, ShieldCheck, ArrowRight } from 'lucide-react';
import { LATAM_META, LATAM_OG_IMAGE, hasLocalDatacenter, isLatamSlug, type LatamSlug } from '@/lib/latamCountry';
import { isHiddenProvider } from '@/lib/providerLinks';

const CountryDatacenterLocal = () => {
  const location = useLocation();
  const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (!isLatamSlug(first)) return <Navigate to="/latam" replace />;
  const slug = first as LatamSlug;
  const meta = LATAM_META[slug];

  const { data: providers } = useQuery({
    queryKey: ['country-datacenter-local', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, website, legal_name, datacenter_location, year_founded, technologies')
        .eq('country', meta.code)
        .eq('is_verified', true)
        .range(0, 999);
      return (data ?? []).filter((c: any) =>
        !isHiddenProvider(c.slug, c.website) && hasLocalDatacenter(slug, c.datacenter_location),
      );
    },
  });

  // Últimos site checks para incluir ASN si disponible
  const { data: siteChecks } = useQuery({
    queryKey: ['dc-local-checks', slug, providers?.map((p: any) => p.id).join(',')],
    enabled: !!providers?.length,
    queryFn: async () => {
      const ids = (providers ?? []).map((p: any) => p.id);
      const { data } = await supabase
        .from('latam_site_checks' as any)
        .select('company_id, resolved_ip, asn, asn_org, checked_at')
        .in('company_id', ids)
        .order('checked_at', { ascending: false });
      const map = new Map<string, any>();
      for (const r of (data ?? []) as any[]) if (!map.has(r.company_id)) map.set(r.company_id, r);
      return map;
    },
  });

  const canonical = `https://eligetuhosting.com/${slug}/hosting-con-datacenter-local`;
  const title = `Hosting con datacenter local en ${meta.name} · Verificado por ASN | EligeTuHosting`;
  const description = `Proveedores de hosting con datacenter físicamente en ${meta.name}, verificado por ASN, BGP y declaraciones del proveedor. Diferenciador de datos abiertos.`;

  const list = providers ?? [];
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: list.length,
    itemListElement: list.map((p: any, i: number) => ({
      '@type': 'ListItem', position: i + 1,
      url: `https://eligetuhosting.com/${slug}/${p.slug}`, name: p.name,
    })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${meta.name}`, item: `https://eligetuhosting.com/${slug}` },
      { '@type': 'ListItem', position: 3, name: 'Datacenter local', item: canonical },
    ],
  };

  return (
    <>
      <Helmet>
        <html lang={meta.locale} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content={meta.locale.replace('-', '_')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={LATAM_OG_IMAGE[slug]} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={LATAM_OG_IMAGE[slug]} />
        <meta name="robots" content="index,follow" />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="breadcrumb">
          <Link to="/" className="hover:underline">Inicio</Link><span className="mx-2">/</span>
          <Link to={`/${slug}`} className="hover:underline">Hosting en {meta.name}</Link><span className="mx-2">/</span>
          <span className="text-foreground font-medium">Datacenter local</span>
        </nav>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2B2D42]">
            Hosting con datacenter local en {meta.name} {meta.flag}
          </h1>
          <p className="mt-3 text-[#2B2D42]/75">
            Únicamente proveedores cuyo datacenter está físicamente en {meta.name} y lo declaran públicamente. Este es nuestro diferenciador de datos: cruzamos declaraciones oficiales con verificación técnica (IP → ASN → BGP) por proveedor.
          </p>
        </header>

        <section className="mb-6 bg-white border border-[#2B2D42]/10 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-2 text-[#2B2D42] flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Cómo verificamos "datacenter local"
          </h2>
          <ul className="text-sm text-[#2B2D42]/80 space-y-1.5 list-disc pl-5">
            <li><strong>Declaración del proveedor</strong>: revisamos el sitio oficial (página de infraestructura, planes o TOS) buscando la ubicación física del datacenter.</li>
            <li><strong>ASN + BGP</strong>: resolvemos la IP del sitio oficial y consultamos el ASN dueño de esa IP. Si el ASN está anunciado desde {meta.name}, sube la confianza; si está en un ASN de Cloudflare/AWS/GCP, indicamos que la latencia depende del PoP más cercano.</li>
            <li><strong>Registro mercantil</strong>: verificamos que exista razón social local que respalde la operación declarada.</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Ver <Link to="/metodologia" className="underline">metodología completa</Link> · Datos abiertos en <a className="underline" href={`/data/proveedores-${slug}.json`} target="_blank" rel="noopener">proveedores-{slug}.json</a>
          </p>
        </section>

        {list.length === 0 ? (
          <Card><CardContent className="pt-6 text-sm text-muted-foreground text-center">
            Aún no hay proveedores con datacenter local <em>declarado y verificable</em> en {meta.name} dentro del directorio. Estamos ampliando la lista.
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((p: any) => {
              const check = siteChecks?.get(p.id);
              return (
                <Card key={p.id}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{p.name}</h3>
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px]">
                        <Server className="h-3 w-3 mr-1" /> DC local
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div><span className="font-medium text-foreground">Datacenter declarado:</span> {p.datacenter_location}</div>
                      {p.legal_name && <div><span className="font-medium text-foreground">Razón social:</span> {p.legal_name}</div>}
                      {p.year_founded && <div><span className="font-medium text-foreground">Antigüedad:</span> desde {p.year_founded}</div>}
                      {check?.asn && (
                        <div className="text-xs">
                          <span className="font-medium text-foreground">ASN detectado:</span> {check.asn}
                          {check.asn_org ? ` · ${check.asn_org}` : ''}
                          {check.resolved_ip ? ` · IP ${check.resolved_ip}` : ''}
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <Link to={`/${slug}/${p.slug}`} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                        Ver ficha completa <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-sm">
          <Link to={`/${slug}`} className="text-primary hover:underline">← Volver al directorio de {meta.name}</Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CountryDatacenterLocal;
