import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import { Star, ExternalLink, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { HubConfig } from '@/lib/segmentHubs';

interface Provider {
  slug: string;
  name: string;
  logo_url: string | null;
  overall_rating: number | null;
  promo_price: number | null;
  datacenter_location: string | null;
  total_reviews: number | null;
}

const ORIGIN = 'https://eligetuhosting.cl';

const IntentHub: React.FC<{ config: HubConfig }> = ({ config }) => {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('slug,name,logo_url,overall_rating,promo_price,datacenter_location,total_reviews')
        .in('slug', config.providerSlugs);
      if (!mounted || !data) return;
      // preserve config order
      const ordered = config.providerSlugs
        .map(s => data.find(d => d.slug === s))
        .filter(Boolean) as Provider[];
      setProviders(ordered);
    })();
    return () => { mounted = false; };
  }, [config]);

  const canonical = `${ORIGIN}${config.path}`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.h1,
    numberOfItems: providers.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: providers.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${ORIGIN}/catalogo/${p.slug}`,
      name: p.name,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Guías', item: `${ORIGIN}/guia-elegir-hosting` },
      { '@type': 'ListItem', position: 3, name: config.h1, item: canonical },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={config.metaTitle} />
        <meta property="og:description" content={config.metaDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Navbar />
      <main className="bg-gradient-to-b from-[#F7F9FC] to-white">
        <section className="container mx-auto px-4 py-10 md:py-14 max-w-5xl">
          <nav aria-label="breadcrumbs" className="text-xs text-gray-500 mb-3">
            <Link to="/" className="hover:underline">Inicio</Link> / <span>{config.h1}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-4">{config.h1}</h1>
          <p className="text-base md:text-lg text-[#444] leading-relaxed">{config.intro}</p>
        </section>

        <section className="container mx-auto px-4 pb-10 max-w-5xl">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-5">Top 5 — {config.h1}</h2>
          <ol className="space-y-4">
            {providers.map((p, i) => (
              <li key={p.slug} className={`rounded-xl border p-4 md:p-5 bg-white shadow-sm ${i === 0 ? 'border-[#EF233C] border-2' : 'border-gray-200'}`}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 md:w-1/3">
                    <span className={`text-2xl font-bold ${i === 0 ? 'text-[#EF233C]' : 'text-gray-400'}`}>#{i + 1}</span>
                    {p.logo_url ? (
                      <img src={p.logo_url} alt={`Logo ${p.name}`} className="h-10 w-auto" loading="lazy" />
                    ) : null}
                    <div>
                      <div className="font-semibold text-[#2B2D42]">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.datacenter_location || 'Chile'}</div>
                    </div>
                  </div>
                  <div className="md:w-1/4 text-sm">
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="h-4 w-4 fill-amber-500" />
                      {Number(p.overall_rating ?? 0).toFixed(1)}/10
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {config.priceLabel}: {p.promo_price ? `$${Number(p.promo_price).toLocaleString('es-CL')}/mes` : 'Consultar'}
                    </div>
                  </div>
                  <ul className="md:w-1/4 text-xs text-gray-600 space-y-1">
                    {config.features.map(f => (
                      <li key={f} className="flex items-center gap-1"><Check className="h-3 w-3 text-green-600" />{f}</li>
                    ))}
                  </ul>
                  <div className="md:w-1/6 flex flex-col gap-2 min-w-[150px]">
                    <Link
                      to={`/catalogo/${p.slug}`}
                      className="text-center text-sm px-3 py-2 rounded border border-[#EF233C] text-[#EF233C] hover:bg-[#EF233C] hover:text-white transition min-h-[44px] flex items-center justify-center"
                    >
                      Ver review
                    </Link>
                    <a
                      href={`/ir/${p.slug}`}
                      className="text-center text-sm px-3 py-2 rounded bg-[#EF233C] text-white hover:bg-red-700 transition min-h-[44px] flex items-center justify-center gap-1"
                    >
                      Visitar sitio <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="container mx-auto px-4 pb-12 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-5">Preguntas frecuentes — {config.keyword}</h2>
          <div className="space-y-4">
            {config.faqs.map((f, i) => (
              <details key={i} className="border rounded-lg p-4 bg-white">
                <summary className="font-semibold cursor-pointer text-[#2B2D42]">{f.q}</summary>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">{f.a}</p>
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

export default IntentHub;
