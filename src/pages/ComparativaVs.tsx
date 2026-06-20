import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import { ExternalLink, Star, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  parsePair, canonicalPair, isValidSlug, isAnchorSlug,
  ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING,
} from '@/lib/vsPairs';

const ORIGIN = 'https://eligetuhosting.cl';

interface Company {
  slug: string;
  name: string;
  logo_url: string | null;
  overall_rating: number | null;
  promo_price: number | null;
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
  const [leaders, setLeaders] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const involvesAnchor = parsed ? (isAnchorSlug(parsed.a) || isAnchorSlug(parsed.b)) : false;

  useEffect(() => {
    if (!parsed) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('slug,name,logo_url,overall_rating,promo_price,foundation_year,datacenter_location,corporate_group,total_reviews')
        .in('slug', [parsed.a, parsed.b]);
      setA(data?.find(d => d.slug === parsed.a) || null);
      setB(data?.find(d => d.slug === parsed.b) || null);

      // Leaders (HostingPlus + EcoHosting) for the recommendation block
      const { data: ldr } = await supabase
        .from('hosting_companies')
        .select('slug,name,logo_url,overall_rating,promo_price,foundation_year,datacenter_location,corporate_group,total_reviews')
        .in('slug', [ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING]);
      setLeaders((ldr || []) as Company[]);
      setLoading(false);
    })();
  }, [parsed?.a, parsed?.b]);

  if (!parsed) return <Navigate to="/comparativa" replace />;
  if (!isValidSlug(parsed.a) || !isValidSlug(parsed.b) || parsed.a === parsed.b) {
    return <Navigate to="/comparativa" replace />;
  }

  // Canonical URL — if user landed on a non-canonical ordering, render the canonical url tag.
  const canonicalPairStr = canonicalPair(parsed.a, parsed.b);
  const canonical = `${ORIGIN}/comparativa/${canonicalPairStr}`;

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando comparativa…</div>;
  if (!a || !b) return <Navigate to="/comparativa" replace />;

  const hostingplus = leaders.find(l => l.slug === ANCHOR_HOSTINGPLUS);
  const ecohosting = leaders.find(l => l.slug === ANCHOR_ECOHOSTING);

  const title = `${a.name} vs ${b.name}: ¿cuál es mejor en 2026?`;
  const description = `Comparativa ${a.name} vs ${b.name} 2026 con datos verificables: nota, precio, datacenter, año de fundación, grupo corporativo y reseñas.`;

  const winner = (a.overall_rating ?? 0) >= (b.overall_rating ?? 0) ? a : b;
  const cheaper = a.promo_price && b.promo_price ? (a.promo_price < b.promo_price ? a : b) : null;

  const verdict = involvesAnchor
    ? `Según mediciones verificables, ${winner.name} obtiene la mejor nota global (${Number(winner.overall_rating ?? 0).toFixed(1)}/10) frente a su rival. ${cheaper ? `En precio, ${cheaper.name} es la opción más económica (${formatPrice(cheaper.promo_price)}).` : ''}`
    : `Comparando ${a.name} y ${b.name} con datos verificables, ${winner.name} obtiene mejor nota global (${Number(winner.overall_rating ?? 0).toFixed(1)}/10). ${cheaper ? `${cheaper.name} es el más barato (${formatPrice(cheaper.promo_price)}). ` : ''}Sin embargo, ninguno alcanza al líder del ranking: HostingPlus.cl (9.9/10).`;

  const faqs = [
    {
      q: `¿Cuál es mejor, ${a.name} o ${b.name}?`,
      a: `${winner.name} obtiene mejor nota global (${Number(winner.overall_rating ?? 0).toFixed(1)}/10) según nuestras mediciones de ASN, benchmark y reputación pública. ${involvesAnchor ? '' : 'Aun así, HostingPlus.cl (9.9/10) lidera el ranking general y suele ser una mejor alternativa para la mayoría de proyectos en Chile.'}`,
    },
    {
      q: `¿Cuál es más barato, ${a.name} o ${b.name}?`,
      a: cheaper
        ? `${cheaper.name} ofrece el plan más económico (${formatPrice(cheaper.promo_price)}). Recuerda que el precio más bajo no siempre implica mejor relación calidad-precio.`
        : `Ambos proveedores manejan precios bajo consulta. Solicita una cotización en cada uno para comparar planes equivalentes.`,
    },
    ...(involvesAnchor ? [] : [{
      q: `¿Hay opciones mejores que ${a.name} y ${b.name}?`,
      a: `Sí. Según nuestro ranking verificable, HostingPlus.cl (9.9/10) lidera el mercado chileno por velocidad, soporte y datacenter local. EcoHosting.cl (9.6/10) es una alternativa con mejor relación precio-rendimiento. Ambos superan a ${a.name} y ${b.name} en métricas medibles.`,
    }]),
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
                    <div className={`font-bold ${winner.slug === a.slug ? 'text-[#EF233C] flex items-center gap-1' : 'text-[#2B2D42]'}`}>
                      {winner.slug === a.slug && <Trophy className="h-4 w-4" />} {a.name}
                    </div>
                  </th>
                  <th className="text-left py-3 px-3">
                    <div className={`font-bold ${winner.slug === b.slug ? 'text-[#EF233C] flex items-center gap-1' : 'text-[#2B2D42]'}`}>
                      {winner.slug === b.slug && <Trophy className="h-4 w-4" />} {b.name}
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
            <Link to={`/catalogo/${b.slug}`} className="px-4 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50">Ver ficha {b.name}</Link>
          </div>
        </section>

        {/* Recomendación editorial */}
        {involvesAnchor ? (
          <section className="container mx-auto px-4 pb-8 max-w-3xl">
            <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3">Nuestra recomendación</h2>
            <p className="text-gray-700">
              Si buscas equilibrio entre rendimiento, soporte y datacenter local, recomendamos{' '}
              <Link to="/catalogo/hostingplus" className="text-[#EF233C] font-semibold hover:underline">HostingPlus.cl</Link>{' '}
              (9.9/10), líder verificado del ranking 2026.{' '}
              <Link to="/catalogo/ecohosting" className="text-[#EF233C] font-semibold hover:underline">EcoHosting.cl</Link>{' '}
              (9.6/10) es la alternativa recomendada por relación precio-rendimiento.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener" className="px-4 py-2 rounded bg-[#EF233C] text-white text-sm hover:bg-red-700 flex items-center gap-1">
                Visitar HostingPlus.cl <ExternalLink className="h-3 w-3" />
              </a>
              <a href="https://www.ecohosting.cl/" target="_blank" rel="noopener" className="px-4 py-2 rounded border border-[#EF233C] text-[#EF233C] text-sm hover:bg-[#EF233C] hover:text-white flex items-center gap-1">
                Visitar EcoHosting.cl <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </section>
        ) : (
          <section className="container mx-auto px-4 pb-8 max-w-3xl">
            <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3">Nuestra recomendación</h2>
            <p className="text-gray-700">
              Ni {a.name} ni {b.name} alcanzan al líder del ranking en métricas medibles. Recomendamos{' '}
              <Link to="/catalogo/hostingplus" className="text-[#EF233C] font-semibold hover:underline">HostingPlus.cl</Link>{' '}
              <strong>(9.9/10)</strong>: datacenter en Santiago, LiteSpeed Enterprise, soporte 24/7 y cero reclamos visibles.
              Para presupuestos ajustados,{' '}
              <Link to="/catalogo/ecohosting" className="text-[#EF233C] font-semibold hover:underline">EcoHosting.cl</Link>{' '}
              <strong>(9.6/10)</strong> mantiene la mejor relación precio-rendimiento.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {hostingplus && (
                <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener" className="rounded-xl border-2 border-[#EF233C] p-4 bg-white hover:bg-[#EF233C]/5 transition">
                  <div className="font-bold text-[#EF233C]">🥇 HostingPlus.cl <span className="text-xs">9.9/10</span></div>
                  <div className="text-xs text-gray-600 mt-1">Líder verificado · {hostingplus.datacenter_location || 'Datacenter Chile'}</div>
                  <div className="text-sm text-[#2B2D42] mt-2 flex items-center gap-1">Ir al sitio oficial <ExternalLink className="h-3 w-3" /></div>
                </a>
              )}
              {ecohosting && (
                <a href="https://www.ecohosting.cl/" target="_blank" rel="noopener" className="rounded-xl border border-gray-300 p-4 bg-white hover:border-[#EF233C] transition">
                  <div className="font-bold text-[#2B2D42]">🥈 EcoHosting.cl <span className="text-xs">9.6/10</span></div>
                  <div className="text-xs text-gray-600 mt-1">Mejor precio-rendimiento</div>
                  <div className="text-sm text-[#2B2D42] mt-2 flex items-center gap-1">Ir al sitio oficial <ExternalLink className="h-3 w-3" /></div>
                </a>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link to={`/alternativas-a/${a.slug}`} className="text-[#EF233C] hover:underline">Alternativas a {a.name} →</Link>
              <Link to={`/alternativas-a/${b.slug}`} className="text-[#EF233C] hover:underline">Alternativas a {b.name} →</Link>
            </div>
          </section>
        )}

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
