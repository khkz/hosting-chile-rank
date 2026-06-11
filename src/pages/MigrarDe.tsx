import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MIGRATION_COMPETITORS, ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING } from '@/lib/vsPairs';

const ORIGIN = 'https://eligetuhosting.cl';

interface Company {
  slug: string;
  name: string;
  overall_rating: number | null;
  promo_price: number | null;
  datacenter_location: string | null;
  has_migration_free: boolean | null;
}

const fmt = (p: number | null) => (p ? `$${Number(p).toLocaleString('es-CL')}/mes` : 'Consultar');

const MigrarDe: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [target, setTarget] = useState<Company | null>(null);
  const [hp, setHp] = useState<Company | null>(null);
  const [eh, setEh] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const isValid = !!slug && (MIGRATION_COMPETITORS as readonly string[]).includes(slug);

  useEffect(() => {
    if (!isValid) return;
    (async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('slug,name,overall_rating,promo_price,datacenter_location,has_migration_free')
        .in('slug', [slug!, ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING]);
      setTarget((data?.find(d => d.slug === slug) as Company) || null);
      setHp((data?.find(d => d.slug === ANCHOR_HOSTINGPLUS) as Company) || null);
      setEh((data?.find(d => d.slug === ANCHOR_ECOHOSTING) as Company) || null);
      setLoading(false);
    })();
  }, [slug, isValid]);

  if (!isValid) return <Navigate to="/catalogo" replace />;
  if (loading) return <div className="p-10 text-center text-gray-500">Cargando…</div>;
  if (!target) return <Navigate to="/catalogo" replace />;

  const canonical = `${ORIGIN}/migrar-de/${slug}`;
  const title = `Migrar de ${target.name} a un hosting más rápido (Chile 2026)`;
  const description = `Guía paso a paso para migrar desde ${target.name} a HostingPlus.cl o EcoHosting.cl en Chile: checklist, migración gratuita sin downtime y comparativa.`;

  const checklist = [
    { t: '1. Respaldo completo', d: `Descarga un backup completo de tu cuenta en ${target.name} (archivos + base de datos + emails). Si el panel lo permite, exporta también un volcado SQL.` },
    { t: '2. Provisionar el nuevo hosting', d: 'Crea la cuenta en HostingPlus.cl o EcoHosting.cl, valida el plan correcto (PHP, RAM, disco) y entrega el respaldo al equipo de migración.' },
    { t: '3. Migración asistida sin downtime', d: 'El equipo técnico restaura todo en el nuevo servidor y valida que el sitio funcione 1:1 en una URL de previsualización. Tu sitio actual sigue online mientras tanto.' },
    { t: '4. Cambio de DNS y verificación', d: 'Actualizas los nameservers (o registros A/MX). En 4-24 h propaga; validamos SSL, correos, formularios y velocidad antes de dar de baja el antiguo.' },
  ];

  const faqs = [
    {
      q: `¿Cuánto tarda migrar desde ${target.name}?`,
      a: `Migrar de ${target.name} a HostingPlus.cl o EcoHosting.cl toma entre 4 y 24 horas, según el tamaño del sitio. La migración es asistida y sin downtime: tu sitio actual sigue online hasta que la propagación DNS termine.`,
    },
    {
      q: `¿La migración tiene costo?`,
      a: `No. Tanto HostingPlus.cl como EcoHosting.cl ofrecen migración gratuita asistida al contratar cualquier plan anual.`,
    },
    {
      q: `¿Pierdo emails o datos al migrar de ${target.name}?`,
      a: `No, si la migración la hace el equipo técnico del nuevo proveedor. Se traspasan archivos, base de datos y buzones de correo. Se valida todo en una URL de previsualización antes del cambio de DNS.`,
    },
    {
      q: `¿Cómo cancelo mi cuenta en ${target.name} después?`,
      a: `Recomendamos esperar 7-14 días tras la migración para confirmar que todo funciona en el nuevo proveedor. Luego solicitas la baja por el panel o por correo, según las políticas de ${target.name}.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    step: checklist.map((c, i) => ({ '@type': 'HowToStep', position: i + 1, name: c.t, text: c.d })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Guías', item: `${ORIGIN}/guia-migrar-hosting` },
      { '@type': 'ListItem', position: 3, name: `Migrar de ${target.name}`, item: canonical },
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
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Navbar />
      <main className="bg-gradient-to-b from-[#F7F9FC] to-white">
        <section className="container mx-auto px-4 py-10 max-w-4xl">
          <nav aria-label="breadcrumbs" className="text-xs text-gray-500 mb-3">
            <Link to="/" className="hover:underline">Inicio</Link> /{' '}
            <Link to="/guia-migrar-hosting" className="hover:underline">Migrar hosting</Link> /{' '}
            <span>Migrar de {target.name}</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold text-[#2B2D42]">{title}</h1>
          <p className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed">
            Si tu sitio está en {target.name} y notas lentitud, soporte tardío o quieres datacenter local en Chile, esta guía te muestra cómo migrar sin downtime a un proveedor verificado del ranking: <strong>HostingPlus.cl (9.9/10)</strong> o <strong>EcoHosting.cl (9.6/10)</strong>. Ambos ofrecen migración gratuita asistida.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/ir/hostingplus" className="px-5 py-3 rounded bg-[#EF233C] text-white text-sm hover:bg-red-700 flex items-center gap-1">
              Solicitar migración gratuita a HostingPlus <ExternalLink className="h-3 w-3" />
            </a>
            <Link to="/cotiza-hosting" className="px-5 py-3 rounded border-2 border-[#EF233C] text-[#EF233C] text-sm hover:bg-[#EF233C] hover:text-white">
              Cotizar primero
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-5">Checklist de migración en 4 pasos</h2>
          <ol className="space-y-4">
            {checklist.map(s => (
              <li key={s.t} className="rounded-xl border bg-white p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#EF233C] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-[#2B2D42]">{s.t}</div>
                    <p className="text-sm text-gray-700 mt-1">{s.d}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3">Qué incluye la migración gratuita</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
            {[
              'Traspaso completo de archivos y base de datos',
              'Migración de buzones de correo y reglas de filtrado',
              'Configuración de SSL gratuito (Let\'s Encrypt o equivalente)',
              'Validación de URLs, formularios y SEO',
              'Coordinación del cambio de DNS sin downtime',
              'Soporte 24/7 en español durante el traspaso',
            ].map(x => (
              <li key={x} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" /> {x}</li>
            ))}
          </ul>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-4xl">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3">Comparativa breve</h2>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] text-xs uppercase text-gray-500">
                <tr>
                  <th className="text-left py-3 px-3">Característica</th>
                  <th className="text-left py-3 px-3">{target.name}</th>
                  {hp && <th className="text-left py-3 px-3">HostingPlus.cl</th>}
                  {eh && <th className="text-left py-3 px-3">EcoHosting.cl</th>}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-t"><th scope="row" className="text-left py-3 px-3 text-xs uppercase text-gray-500 font-medium">Nota</th>
                  <td className="py-3 px-3">{Number(target.overall_rating ?? 0).toFixed(1)}/10</td>
                  {hp && <td className="py-3 px-3 font-semibold">{Number(hp.overall_rating ?? 0).toFixed(1)}/10</td>}
                  {eh && <td className="py-3 px-3 font-semibold">{Number(eh.overall_rating ?? 0).toFixed(1)}/10</td>}
                </tr>
                <tr className="border-t"><th scope="row" className="text-left py-3 px-3 text-xs uppercase text-gray-500 font-medium">Precio desde</th>
                  <td className="py-3 px-3">{fmt(target.promo_price)}</td>
                  {hp && <td className="py-3 px-3">{fmt(hp.promo_price)}</td>}
                  {eh && <td className="py-3 px-3">{fmt(eh.promo_price)}</td>}
                </tr>
                <tr className="border-t"><th scope="row" className="text-left py-3 px-3 text-xs uppercase text-gray-500 font-medium">Datacenter</th>
                  <td className="py-3 px-3">{target.datacenter_location || '—'}</td>
                  {hp && <td className="py-3 px-3">{hp.datacenter_location || 'Chile'}</td>}
                  {eh && <td className="py-3 px-3">{eh.datacenter_location || 'Chile'}</td>}
                </tr>
                <tr className="border-t"><th scope="row" className="text-left py-3 px-3 text-xs uppercase text-gray-500 font-medium">Migración gratuita</th>
                  <td className="py-3 px-3">{target.has_migration_free ? 'Sí' : 'Consultar'}</td>
                  {hp && <td className="py-3 px-3 font-semibold">Sí, asistida</td>}
                  {eh && <td className="py-3 px-3 font-semibold">Sí, asistida</td>}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-sm">
            <Link to={`/comparativa/${slug}-vs-hostingplus`} className="text-[#EF233C] hover:underline">Ver comparativa completa {target.name} vs HostingPlus →</Link>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-8 max-w-3xl">
          <div className="rounded-xl border-2 border-[#EF233C] bg-gradient-to-br from-[#EF233C]/5 to-white p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-[#2B2D42]">Solicita tu migración gratuita</h2>
            <p className="text-gray-700 mt-2">Sin downtime, 100% asistida por el equipo técnico.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link to="/cotiza-hosting" className="px-5 py-3 rounded bg-[#EF233C] text-white text-sm hover:bg-red-700">
                Solicitar migración gratuita
              </Link>
              <a href="/ir/hostingplus" className="px-5 py-3 rounded border-2 border-[#EF233C] text-[#EF233C] text-sm hover:bg-[#EF233C] hover:text-white flex items-center gap-1">
                Ir a HostingPlus.cl <ExternalLink className="h-3 w-3" />
              </a>
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

export default MigrarDe;
