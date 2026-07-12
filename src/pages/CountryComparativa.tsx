import { useLocation, useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { LATAM_META, LATAM_LONG_SLUG, LATAM_OG_IMAGE, hasLocalDatacenter, isLatamSlug, type LatamSlug } from '@/lib/latamCountry';

// /pe/comparativa/:pair  ·  :pair debe tener la forma slug-a-vs-slug-b
const CountryComparativa = () => {
  const location = useLocation();
  const { pair } = useParams<{ pair: string }>();
  const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (!isLatamSlug(first)) return <Navigate to="/latam" replace />;
  const slug = first as LatamSlug;
  const meta = LATAM_META[slug];

  const parts = (pair ?? '').split('-vs-');
  if (parts.length !== 2) return <Navigate to={`/${slug}`} replace />;
  const [a, b] = parts;

  const { data: providers, isLoading } = useQuery({
    queryKey: ['country-comparativa', slug, a, b],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('*')
        .eq('country', meta.code)
        .in('slug', [a, b]);
      return data ?? [];
    },
  });

  if (!isLoading && (!providers || providers.length !== 2)) return <Navigate to={`/${slug}`} replace />;
  if (isLoading || !providers) {
    return (
      <><Navbar />
        <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Cargando comparativa…</div>
      <Footer /></>
    );
  }

  const [p1, p2] = a < b ? [providers.find(p => p.slug === a)!, providers.find(p => p.slug === b)!]
                          : [providers.find(p => p.slug === a)!, providers.find(p => p.slug === b)!];

  const canonicalSlug = a < b ? `${a}-vs-${b}` : `${b}-vs-${a}`;
  const canonical = `https://eligetuhosting.com/${slug}/comparativa/${canonicalSlug}`;
  const title = `${p1.name} vs ${p2.name} — Comparativa hosting ${meta.name} | EligeTuHosting`;
  const description = `Comparativa objetiva entre ${p1.name} y ${p2.name} para hosting en ${meta.name}: datacenter, razón social, antigüedad, tecnologías. Datos verificables, sin puntajes inventados.`;

  const localA = hasLocalDatacenter(slug, (p1 as any).datacenter_location);
  const localB = hasLocalDatacenter(slug, (p2 as any).datacenter_location);

  const rows: Array<{ label: string; a: React.ReactNode; b: React.ReactNode }> = [
    { label: 'Razón social', a: (p1 as any).legal_name || '—', b: (p2 as any).legal_name || '—' },
    { label: 'Datacenter declarado', a: (p1 as any).datacenter_location || '—', b: (p2 as any).datacenter_location || '—' },
    { label: `Datacenter en ${meta.name}`, a: localA ? 'Sí' : 'No', b: localB ? 'Sí' : 'No' },
    { label: 'Año de fundación', a: (p1 as any).year_founded ?? '—', b: (p2 as any).year_founded ?? '—' },
    { label: 'Grupo corporativo', a: (p1 as any).corporate_group || '—', b: (p2 as any).corporate_group || '—' },
    { label: 'Teléfono', a: (p1 as any).contact_phone || '—', b: (p2 as any).contact_phone || '—' },
    { label: 'Dirección', a: (p1 as any).contact_address || '—', b: (p2 as any).contact_address || '—' },
    { label: 'Tecnologías declaradas', a: Array.isArray((p1 as any).technologies) ? (p1 as any).technologies.slice(0, 6).join(', ') || '—' : '—', b: Array.isArray((p2 as any).technologies) ? (p2 as any).technologies.slice(0, 6).join(', ') || '—' : '—' },
  ];

  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${meta.name}`, item: `https://eligetuhosting.com/${slug}` },
      { '@type': 'ListItem', position: 3, name: `${p1.name} vs ${p2.name}`, item: canonical },
    ],
  };

  return (
    <>
      <Helmet>
        <html lang={meta.locale} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content={meta.locale.replace('-', '_')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta name="robots" content="index,follow" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="breadcrumb">
          <Link to="/" className="hover:underline">Inicio</Link><span className="mx-2">/</span>
          <Link to={`/${slug}`} className="hover:underline">Hosting en {meta.name}</Link><span className="mx-2">/</span>
          <span className="text-foreground font-medium">{p1.name} vs {p2.name}</span>
        </nav>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2B2D42]">
            {p1.name} vs {p2.name}
          </h1>
          <p className="mt-2 text-[#2B2D42]/75">
            Comparativa lado a lado con datos verificables en {meta.name}. Sin puntajes inventados: solo lo que declara cada proveedor y se puede auditar.
          </p>
        </header>

        <Card className="mb-6">
          <CardContent className="pt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3 font-medium">Criterio</th>
                  <th className="py-2 px-3 font-medium">
                    <Link to={`/${slug}/${p1.slug}`} className="hover:underline text-primary">{p1.name}</Link>
                  </th>
                  <th className="py-2 px-3 font-medium">
                    <Link to={`/${slug}/${p2.slug}`} className="hover:underline text-primary">{p2.name}</Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-2 pr-3 font-medium text-[#2B2D42]/80">{r.label}</td>
                    <td className="py-2 px-3">{r.a}</td>
                    <td className="py-2 px-3">{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="text-sm space-x-3">
          <Link to={`/${slug}`} className="text-primary hover:underline">← Directorio {meta.name}</Link>
          <Link to={`/${slug}/mejor-hosting-${meta.name.toLowerCase().replace(/[éí]/g, m => m === 'é' ? 'e' : 'i')}-2026`} className="text-primary hover:underline">Mejor hosting {meta.name} 2026</Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CountryComparativa;
