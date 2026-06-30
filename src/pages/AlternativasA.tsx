import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import { ExternalLink, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import {
  isValidSlug, isAnchorSlug,
  ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING, MIGRATION_COMPETITORS,
} from '@/lib/vsPairs';
import { getProviderLink, filterVisibleProviders } from '@/lib/providerLinks';

const ORIGIN = 'https://eligetuhosting.cl';

interface Company {
  slug: string;
  name: string;
  logo_url: string | null;
  overall_rating: number | null;
  promo_price: number | null;
  datacenter_location: string | null;
  corporate_group: string | null;
  foundation_year: number | null;
  total_reviews: number | null;
  website: string | null;
}

const fmtPrice = (p: number | null) => (p ? `$${Number(p).toLocaleString('es-CL')}/mes` : 'Consultar');

const AlternativasA: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [target, setTarget] = useState<Company | null>(null);
  const [top, setTop] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: t } = await supabase
        .from('hosting_companies')
        .select('slug,name,logo_url,overall_rating,promo_price,datacenter_location,corporate_group,foundation_year,total_reviews,website')
        .eq('country', getActiveCountryCode())
        .eq('slug', slug)
        .maybeSingle();
      setTarget((t as Company) || null);

      const { data: leaders } = await supabase
        .from('hosting_companies')
        .select('slug,name,logo_url,overall_rating,promo_price,datacenter_location,corporate_group,foundation_year,total_reviews,website')
        .eq('country', getActiveCountryCode())
        .eq('is_verified', true)
        .eq('is_curated', true)
        .order('overall_rating', { ascending: false })
        .limit(6);
      const ranked = filterVisibleProviders((leaders || []) as Company[]);
      const hp = ranked.find(c => c.slug === ANCHOR_HOSTINGPLUS);
      const eh = ranked.find(c => c.slug === ANCHOR_ECOHOSTING);
      const third = ranked.find(c => c.slug !== ANCHOR_HOSTINGPLUS && c.slug !== ANCHOR_ECOHOSTING && c.slug !== slug);
      setTop([hp, eh, third].filter(Boolean) as Company[]);
      setLoading(false);
    })();
  }, [slug]);

  if (!slug || !isValidSlug(slug) || isAnchorSlug(slug)) return <Navigate to="/catalogo" replace />;
  if (loading) return <div className="p-10 text-center text-gray-500">Cargando…</div>;
  if (!target) return <Navigate to="/catalogo" replace />;

  const canonical = `${ORIGIN}/alternativas-a/${slug}`;
  const title = `Mejores alternativas a ${target.name} en Chile 2026`;
  const description = `Las mejores alternativas a ${target.name} para sitios y empresas en Chile 2026: ranking verificable, comparativa lado a lado y migración gratuita.`;

  const canMigrate = (MIGRATION_COMPETITORS as readonly string[]).includes(slug);

  const reasonsToSwitch: string[] = [];
  if ((target.overall_rating ?? 0) < 9) reasonsToSwitch.push(`nota global ${Number(target.overall_rating ?? 0).toFixed(1)}/10 inferior al líder del ranking`);
  if (target.corporate_group) reasonsToSwitch.push(`pertenece al grupo corporativo ${target.corporate_group}, lo que reduce la independencia operativa`);
  if (!target.datacenter_location || !/chile|santiago/i.test(target.datacenter_location)) reasonsToSwitch.push('datacenter no local (mayor latencia para visitas chilenas)');
  if (reasonsToSwitch.length === 0) reasonsToSwitch.push('busca mejor relación precio-rendimiento o un soporte 24/7 más rápido');

  const faqs = [
    {
      q: `¿Cuál es la mejor alternativa a ${target.name} en Chile?`,
      a: `Según mediciones verificables (ASN, benchmark y reputación pública), la mejor alternativa a ${target.name} es HostingPlus.cl (9.9/10): datacenter en Santiago, LiteSpeed Enterprise y soporte 24/7. EcoHosting.cl (9.6/10) es una segunda alternativa con mejor relación precio-rendimiento.`,
    },
    {
      q: `¿Cómo migro mi sitio desde ${target.name}?`,
      a: `La migración desde ${target.name} se hace en 4 pasos: respaldo completo, traspaso de archivos y base de datos, configuración del DNS y verificación final. HostingPlus.cl y EcoHosting.cl ofrecen migración gratuita asistida sin downtime.${canMigrate ? ` Revisa nuestra guía dedicada: /migrar-de/${slug}.` : ''}`,
    },
    {
      q: `¿Vale la pena cambiar de ${target.name}?`,
      a: `Depende de tus métricas actuales (uptime real, latencia desde Chile, tickets resueltos). Si ${reasonsToSwitch.join(', ')}, conviene evaluar alternativas verificadas como las del top 3.`,
    },
  ];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: top.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: top.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${ORIGIN}/catalogo/${p.slug}`,
      name: p.name,
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${ORIGIN}/catalogo` },
      { '@type': 'ListItem', position: 3, name: `Alternativas a ${target.name}`, item: canonical },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Navbar />
      <main className="bg-gradient-to-b from-[#F7F9FC] to-white">
        <section className="container mx-auto px-4 py-10 max-w-4xl">
          <nav aria-label="breadcrumbs" className="text-xs text-gray-500 mb-3">
            <Link to="/" className="hover:underline">Inicio</Link> /{' '}
            <Link to="/catalogo" className="hover:underline">Catálogo</Link> /{' '}
            <span>Alternativas a {target.name}</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold text-[#2B2D42]">{title}</h1>
          <p className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed">
            {target.name}{target.foundation_year ? ` (opera desde ${target.foundation_year})` : ''}{target.datacenter_location ? `, datacenter ${target.datacenter_location}` : ''}{target.corporate_group ? `, parte del grupo ${target.corporate_group}` : ''}, obtiene una nota global de <strong>{Number(target.overall_rating ?? 0).toFixed(1)}/10</strong> en nuestro ranking verificable.
            {' '}Hay alternativas mejor evaluadas en el mercado chileno: si {reasonsToSwitch.join(', ')}, los proveedores listados abajo superan a {target.name} en métricas medibles (velocidad, soporte, reputación pública). Todos cuentan con datacenter local y migración gratuita asistida.
          </p>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-4xl">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-5">Top 3 alternativas a {target.name}</h2>
          <ol className="space-y-4">
            {top.map((p, i) => (
              <li key={p.slug} className={`rounded-xl border p-4 md:p-5 bg-white shadow-sm ${i === 0 ? 'border-[#EF233C] border-2' : 'border-gray-200'}`}>
                <div className="flex flex-wrap items-center gap-4 justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${i === 0 ? 'text-[#EF233C]' : 'text-gray-400'}`}>#{i + 1}</span>
                    <div>
                      <div className="font-semibold text-[#2B2D42]">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.datacenter_location || 'Chile'}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="h-4 w-4 fill-amber-500" />{Number(p.overall_rating ?? 0).toFixed(1)}/10
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{fmtPrice(p.promo_price)}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/catalogo/${p.slug}`} className="text-sm px-3 py-2 rounded border border-[#EF233C] text-[#EF233C] hover:bg-[#EF233C] hover:text-white">Ver ficha</Link>
                    {(() => { const link = getProviderLink(p.slug, p.website); return (
                      <a href={link.href} target="_blank" rel={link.rel} className="text-sm px-3 py-2 rounded bg-[#EF233C] text-white hover:bg-red-700 flex items-center gap-1">Visitar <ExternalLink className="h-3 w-3" /></a>
                    ); })()}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-4xl">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3">Comparativa vs {target.name}</h2>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] text-xs uppercase text-gray-500">
                <tr>
                  <th className="text-left py-3 px-3">Característica</th>
                  <th className="text-left py-3 px-3">{target.name}</th>
                  {top.map(p => <th key={p.slug} className="text-left py-3 px-3">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t"><th scope="row" className="text-left py-3 px-3 text-xs uppercase text-gray-500 font-medium">Nota</th>
                  <td className="py-3 px-3 text-sm">{Number(target.overall_rating ?? 0).toFixed(1)}/10</td>
                  {top.map(p => <td key={p.slug} className="py-3 px-3 text-sm font-semibold">{Number(p.overall_rating ?? 0).toFixed(1)}/10</td>)}
                </tr>
                <tr className="border-t"><th scope="row" className="text-left py-3 px-3 text-xs uppercase text-gray-500 font-medium">Precio desde</th>
                  <td className="py-3 px-3 text-sm">{fmtPrice(target.promo_price)}</td>
                  {top.map(p => <td key={p.slug} className="py-3 px-3 text-sm">{fmtPrice(p.promo_price)}</td>)}
                </tr>
                <tr className="border-t"><th scope="row" className="text-left py-3 px-3 text-xs uppercase text-gray-500 font-medium">Datacenter</th>
                  <td className="py-3 px-3 text-sm">{target.datacenter_location || '—'}</td>
                  {top.map(p => <td key={p.slug} className="py-3 px-3 text-sm">{p.datacenter_location || '—'}</td>)}
                </tr>
                <tr className="border-t"><th scope="row" className="text-left py-3 px-3 text-xs uppercase text-gray-500 font-medium">Migración gratuita</th>
                  <td className="py-3 px-3 text-sm">Consultar</td>
                  {top.map(p => <td key={p.slug} className="py-3 px-3 text-sm">Sí, asistida</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-3xl">
          <div className="rounded-xl border-2 border-[#EF233C] bg-gradient-to-br from-[#EF233C]/5 to-white p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-[#2B2D42]">¿Quieres migrar desde {target.name}?</h2>
            <p className="text-gray-700 mt-2">HostingPlus.cl y EcoHosting.cl te migran gratis y sin downtime.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {canMigrate && (
                <Link to={`/migrar-de/${slug}`} className="px-5 py-3 rounded bg-[#EF233C] text-white text-sm hover:bg-red-700">
                  Guía: Migrar de {target.name} →
                </Link>
              )}
              <Link to="/cotiza-hosting" className="px-5 py-3 rounded border-2 border-[#EF233C] text-[#EF233C] text-sm hover:bg-[#EF233C] hover:text-white">
                Solicitar migración gratuita
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="border rounded-lg p-4 bg-white">
                <summary className="font-semibold cursor-pointer text-[#2B2D42]">{f.q}</summary>
                <p className="mt-2 text-sm text-gray-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12 max-w-3xl">
          <RecommendedByData />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AlternativasA;
