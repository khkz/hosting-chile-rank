import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import { ExternalLink, Star, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { parsePair, ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING, ALL_CATALOG_SLUGS } from '@/lib/vsPairs';

const ORIGIN = 'https://eligetuhosting.cl';

interface Company {
  slug: string;
  name: string;
  logo_url: string | null;
  overall_rating: number | null;
  promo_price: number | null;
  year_founded?: number | null;
  foundation_year: number | null;
  datacenter_location: string | null;
  corporate_group: string | null;
  total_reviews: number | null;
}

const formatPrice = (p: number | null) => (p ? `$${Number(p).toLocaleString('es-CL')}/mes` : 'Consultar');

const ComparativaVs: React.FC = () => {
  const { rival } = useParams<{ rival: string }>();
  const parsed = rival ? parsePair(rival) : null;
  const [a, setA] = useState<Company | null>(null);
  const [b, setB] = useState<Company | null>(null);
  const [next, setNext] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parsed) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('slug,name,logo_url,overall_rating,promo_price,foundation_year,datacenter_location,corporate_group,total_reviews')
        .in('slug', [parsed.competitor, parsed.anchor]);
      const comp = data?.find(d => d.slug === parsed.competitor) || null;
      const anc = data?.find(d => d.slug === parsed.anchor) || null;
      setA(comp);
      setB(anc);
      // next provider in ranking (after anchor)
      const { data: nxt } = await supabase
        .from('hosting_companies')
        .select('slug,name,logo_url,overall_rating,promo_price,foundation_year,datacenter_location,corporate_group,total_reviews')
        .eq('is_verified', true)
        .eq('is_curated', true)
        .not('slug', 'in', `(${parsed.competitor},${parsed.anchor})`)
        .order('overall_rating', { ascending: false })
        .limit(1)
        .maybeSingle();
      setNext(nxt as Company | null);
      setLoading(false);
    })();
  }, [parsed?.competitor, parsed?.anchor]);

  if (!parsed) return <Navigate to="/comparativa" replace />;
  if (loading) return <div className="p-10 text-center text-gray-500">Cargando comparativa…</div>;
  if (!a || !b) return <Navigate to="/comparativa" replace />;

  // Validate anchor must be hostingplus or ecohosting
  if (parsed.anchor !== ANCHOR_HOSTINGPLUS && parsed.anchor !== ANCHOR_ECOHOSTING) {
    return <Navigate to="/comparativa" replace />;
  }
  if (!ALL_CATALOG_SLUGS.includes(parsed.competitor as typeof ALL_CATALOG_SLUGS[number])) {
    return <Navigate to="/comparativa" replace />;
  }

  const title = `${a.name} vs ${b.name}: ¿cuál es mejor en 2026?`;
  const description = `Comparativa ${a.name} vs ${b.name} 2026 con datos verificables: nota, precio, datacenter, año de fundación, grupo corporativo y reseñas.`;
  const canonical = `${ORIGIN}/comparativa/${parsed.competitor}-vs-${parsed.anchor}`;

  const winner = (a.overall_rating ?? 0) > (b.overall_rating ?? 0) ? a : b;
  const cheaper = a.promo_price && b.promo_price ? (a.promo_price < b.promo_price ? a : b) : null;

  const verdict = `Según mediciones verificables, ${winner.name} obtiene la mejor nota global (${Number(winner.overall_rating ?? 0).toFixed(1)}/10) frente a su rival. ${cheaper ? `En precio, ${cheaper.name} es la opción más económica (${formatPrice(cheaper.promo_price)}).` : ''} Si buscas equilibrio entre rendimiento, soporte y datacenter local, ${b.name} sigue siendo nuestra recomendación editorial.`;

  const faqs = [
    {
      q: `¿Cuál es mejor, ${a.name} o ${b.name}?`,
      a: `${winner.name} obtiene mejor nota global (${Number(winner.overall_rating ?? 0).toFixed(1)}/10) según nuestras mediciones de ASN, benchmark y reputación pública. ${b.name} es nuestra recomendación editorial por su soporte 24/7 y datacenter en Chile.`,
    },
    {
      q: `¿Cuál es más barato, ${a.name} o ${b.name}?`,
      a: cheaper
        ? `${cheaper.name} ofrece el plan más económico (${formatPrice(cheaper.promo_price)}). Recuerda que el precio más bajo no siempre implica mejor relación calidad-precio.`
        : `Ambos proveedores manejan precios bajo consulta. Solicita una cotización en cada uno para comparar planes equivalentes.`,
    },
  ];

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: ORIGIN },
        { '@type': 'ListItem', position: 2, name: 'Comparativa', item: `${ORIGIN}/comparativa` },
        { '@type': 'ListItem', position: 3, name: `${a.name} vs ${b.name}`, item: canonical },
      ],
    },
  ];

  const renderCell = (label: string, av: React.ReactNode, bv: React.ReactNode) => (
    <tr className="border-t">
      <th scope="row" className="text-left py-3 px-3 text-xs uppercase text-gray-500 font-medium">{label}</th>
      <td className="py-3 px-3 text-sm">{av}</td>
      <td className="py-3 px-3 text-sm">{bv}</td>
    </tr>
  );

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
        {schemas.map((s, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
        ))}
      </Helmet>

      <Navbar />
      <main className="bg-gradient-to-b from-[#F7F9FC] to-white">
        <section className="container mx-auto px-4 py-10 max-w-4xl">
          <nav aria-label="breadcrumbs" className="text-xs text-gray-500 mb-3">
            <Link to="/" className="hover:underline">Inicio</Link> /{' '}
            <Link to="/comparativa" className="hover:underline">Comparativa</Link> /{' '}
            <span>{a.name} vs {b.name}</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold text-[#2B2D42]">{title}</h1>
          <p className="mt-3 text-gray-600 text-base md:text-lg">{description}</p>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-4xl">
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F7F9FC]">
                  <th className="text-left py-3 px-3 text-xs uppercase text-gray-500">Característica</th>
                  <th className="text-left py-3 px-3">
                    <div className="font-bold text-[#2B2D42]">{a.name}</div>
                  </th>
                  <th className="text-left py-3 px-3 bg-[#EF233C]/5">
                    <div className="font-bold text-[#EF233C] flex items-center gap-1">
                      <Trophy className="h-4 w-4" /> {b.name}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderCell('Nota global', (
                  <span className="flex items-center gap-1 font-semibold"><Star className="h-4 w-4 text-amber-500 fill-amber-500" />{Number(a.overall_rating ?? 0).toFixed(1)}/10</span>
                ), (
                  <span className="flex items-center gap-1 font-semibold"><Star className="h-4 w-4 text-amber-500 fill-amber-500" />{Number(b.overall_rating ?? 0).toFixed(1)}/10</span>
                ))}
                {renderCell('Precio desde', formatPrice(a.promo_price), formatPrice(b.promo_price))}
                {renderCell('Datacenter', a.datacenter_location || 'No informado', b.datacenter_location || 'No informado')}
                {renderCell('Año de fundación', a.foundation_year || '—', b.foundation_year || '—')}
                {renderCell('Grupo corporativo', a.corporate_group || 'Independiente', b.corporate_group || 'Independiente')}
                {renderCell('Reseñas verificadas', a.total_reviews ?? 0, b.total_reviews ?? 0)}
              </tbody>
            </table>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3">Veredicto editorial</h2>
          <p className="text-gray-700 leading-relaxed">{verdict}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/catalogo/${a.slug}`} className="px-4 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50">Ver ficha {a.name}</Link>
            <Link to={`/catalogo/${b.slug}`} className="px-4 py-2 rounded border border-[#EF233C] text-[#EF233C] text-sm hover:bg-[#EF233C] hover:text-white">Ver ficha {b.name}</Link>
            <a href={`/ir/${b.slug}`} className="px-4 py-2 rounded bg-[#EF233C] text-white text-sm hover:bg-red-700 flex items-center gap-1">Visitar {b.name} <ExternalLink className="h-3 w-3" /></a>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3">Mejores alternativas a {a.name}</h2>
          <ul className="space-y-2">
            <li>
              🥇 <Link to="/catalogo/hostingplus" className="text-[#EF233C] hover:underline font-semibold">HostingPlus.cl</Link> — 9.9/10, líder verificado
            </li>
            <li>
              🥈 <Link to="/catalogo/ecohosting" className="text-[#EF233C] hover:underline font-semibold">EcoHosting.cl</Link> — 9.6/10, mejor relación precio-rendimiento
            </li>
            {next && (
              <li>
                🥉 <Link to={`/catalogo/${next.slug}`} className="text-[#EF233C] hover:underline font-semibold">{next.name}</Link> — {Number(next.overall_rating ?? 0).toFixed(1)}/10
              </li>
            )}
          </ul>
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

export default ComparativaVs;
