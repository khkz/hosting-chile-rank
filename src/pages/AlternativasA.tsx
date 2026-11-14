import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import { Button } from '@/components/ui/button';
import { ProvenanceLegend, ProvenanceTag } from '@/components/data/Provenance';
import Crumbs from '@/components/comparar/Crumbs';
import CompareTable, { type CompareRow } from '@/components/comparar/CompareTable';
import FaqList from '@/components/comparar/FaqList';
import { useCompaniesBySlug, useCuratedLeaders, type CompareCompany } from '@/components/comparar/useCompareData';
import { formatScore } from '@/lib/format';
import {
  isValidSlug, isAnchorSlug,
  ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING, MIGRATION_COMPETITORS,
} from '@/lib/vsPairs';
import { getProviderLink } from '@/lib/providerLinks';

const ORIGIN = 'https://eligetuhosting.cl';

const scoreText = (c: CompareCompany) => (c.overall_rating != null ? `${formatScore(c.overall_rating)}/10` : null);

const LoadingShell = () => (
  <>
    <Navbar />
    <main className="container py-16">
      <p role="status" className="t-body text-ink-2">Cargando…</p>
    </main>
    <Footer />
  </>
);

const AlternativasA: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const valid = !!slug && isValidSlug(slug) && !isAnchorSlug(slug);
  const targetQ = useCompaniesBySlug(slug ? [slug] : [], valid);
  const leadersQ = useCuratedLeaders(valid);

  if (!slug || !valid) return <Navigate to="/catalogo" replace />;
  if (targetQ.isLoading || leadersQ.isLoading) return <LoadingShell />;
  const target = targetQ.data?.find((c) => c.slug === slug) ?? null;
  if (!target) return <Navigate to="/catalogo" replace />;

  const ranked = leadersQ.data ?? [];
  const hp = ranked.find(c => c.slug === ANCHOR_HOSTINGPLUS);
  const eh = ranked.find(c => c.slug === ANCHOR_ECOHOSTING);
  const third = ranked.find(c => c.slug !== ANCHOR_HOSTINGPLUS && c.slug !== ANCHOR_ECOHOSTING && c.slug !== slug);
  const top = [hp, eh, third].filter(Boolean) as CompareCompany[];

  const canonical = `${ORIGIN}/alternativas-a/${slug}`;
  const title = `Mejores alternativas a ${target.name} en Chile 2026`;
  const description = `Las mejores alternativas a ${target.name} para sitios y empresas en Chile 2026: ranking verificable, comparativa lado a lado y migración gratuita.`;

  const canMigrate = (MIGRATION_COMPETITORS as readonly string[]).includes(slug);

  // Texto del JSON-LD FAQPage (no cambia con el diseño).
  const reasonsToSwitch: string[] = [];
  if ((target.overall_rating ?? 0) < 9) reasonsToSwitch.push(`nota global ${Number(target.overall_rating ?? 0).toFixed(1)}/10 inferior al líder del ranking`);
  if (target.corporate_group) reasonsToSwitch.push(`pertenece al grupo corporativo ${target.corporate_group}, lo que reduce la independencia operativa`);
  if (!target.datacenter_location || !/chile|santiago/i.test(target.datacenter_location)) reasonsToSwitch.push('datacenter no local (mayor latencia para visitas chilenas)');
  if (reasonsToSwitch.length === 0) reasonsToSwitch.push('busca mejor relación precio-rendimiento o un soporte 24/7 más rápido');

  // Versión visible: nota editorial con coma decimal y sin afirmar «no local» cuando falta el dato.
  const motivos: string[] = [];
  if (target.overall_rating != null && target.overall_rating < 9) motivos.push(`Su nota editorial (${scoreText(target)}) está por debajo del líder del ranking.`);
  if (target.corporate_group) motivos.push(`Pertenece al grupo corporativo ${target.corporate_group}, lo que reduce la independencia operativa.`);
  if (!target.datacenter_location) motivos.push('No informa dónde está su datacenter.');
  else if (!/chile|santiago/i.test(target.datacenter_location)) motivos.push('Su datacenter declarado no está en Chile: más latencia para visitas desde Chile.');
  if (motivos.length === 0) motivos.push('Buscas mejor relación precio-rendimiento o un soporte 24/7 más rápido.');

  const faqs = [
    {
      q: `¿Cuál es la mejor alternativa a ${target.name} en Chile?`,
      a: `Según nuestra nota editorial (ASN, benchmark y reputación pública), la mejor alternativa a ${target.name} es HostingPlus.cl (9.9/10): datacenter en Santiago, LiteSpeed Enterprise y soporte 24/7. EcoHosting.cl (9.6/10) es una segunda alternativa con mejor relación precio-rendimiento.`,
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

  const columns = [target, ...top].map((c) => ({ key: c.slug, name: c.name, href: `/catalogo/${c.slug}` }));
  const rows: CompareRow[] = [
    { id: 'nota', label: 'Nota editorial', kind: 'editorial', empty: 'Sin nota', cells: [target, ...top].map((c) => ({ value: scoreText(c), raw: c.overall_rating })) },
    { id: 'precio', label: 'Precio desde', note: 'En reverificación: consulta el valor vigente en su sitio.', cells: [target, ...top].map(() => ({ value: 'Consultar', raw: null })) },
    { id: 'datacenter', label: 'Datacenter', kind: 'declared', cells: [target, ...top].map((c) => ({ value: c.datacenter_location, raw: c.datacenter_location })) },
    { id: 'migracion', label: 'Migración gratuita', cells: [{ value: 'Consultar', raw: null }, ...top.map(() => ({ value: 'Sí, asistida', raw: null }))] },
  ];

  const datosTarget = [
    target.foundation_year ? `opera desde ${target.foundation_year}` : null,
    target.datacenter_location ? `datacenter ${target.datacenter_location}` : null,
    target.corporate_group ? `parte del grupo ${target.corporate_group}` : null,
  ].filter(Boolean).join(', ');

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
      <main>
        <PageHeader
          breadcrumbs={<Crumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Catálogo', href: '/catalogo' }, { name: `Alternativas a ${target.name}` }]} />}
          title={title}
          lead={
            <>
              {target.name}
              {datosTarget ? ` (${datosTarget})` : ''}{' '}
              {target.overall_rating != null ? (
                <>tiene una nota editorial de <strong className="tabular font-semibold text-ink">{scoreText(target)}</strong> en nuestro ranking.</>
              ) : (
                'aún no tiene nota editorial en nuestro ranking.'
              )}{' '}
              Los proveedores de abajo lo superan en métricas medibles (velocidad, soporte, reputación pública). Todos cuentan con datacenter local y migración gratuita asistida.
            </>
          }
        />

        <Section id="motivos" title="Motivos para mirar alternativas" density="tight">
          <ul className="measure space-y-2">
            {motivos.map((m) => (
              <li key={m} className="t-body flex gap-2.5 text-ink-2">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-ink-3" />
                {m}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="top" title={`Top 3 alternativas a ${target.name}`} tone="paper" density="tight">
          {top.length === 0 ? (
            <div className="max-w-[62ch] rounded-xl border border-rule bg-white p-6">
              <p className="t-body text-ink">Aún no tenemos alternativas curadas para mostrarte aquí.</p>
              <p className="t-small mt-1 text-ink-2">Mientras tanto, revisa el ranking completo: ahí está el orden con su metodología.</p>
              <Button asChild variant="outline" className="mt-4"><Link to="/ranking">Ver el ranking</Link></Button>
            </div>
          ) : (
            <ol className="divide-y divide-rule border-y border-rule bg-white">
              {top.map((p, i) => {
                const link = getProviderLink(p.slug, p.website);
                return (
                  <li key={p.slug} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 md:px-5">
                    <span className="tabular w-6 text-xl font-bold text-ink-3"><span className="sr-only">Puesto </span>{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="t-h3 text-ink">{p.name}</p>
                      <p className="t-meta flex items-center gap-1.5">
                        <ProvenanceTag kind="declared" variant="glyph" />
                        {p.datacenter_location || 'Datacenter sin dato'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="flex items-center justify-end gap-1.5">
                        <span className="tabular text-lg font-bold text-ink">{scoreText(p) ?? 'Sin nota'}</span>
                        <ProvenanceTag kind="editorial" variant="glyph" />
                      </p>
                      <p className="t-meta">Precio: consultar</p>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                      <Button asChild variant="outline"><Link to={`/catalogo/${p.slug}`}>Ver ficha</Link></Button>
                      <Button asChild variant="ghost">
                        <a href={link.href} target="_blank" rel={link.rel}>Ir al sitio de {p.name} <ExternalLink aria-hidden /></a>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Section>

        <Section id="comparativa" title={`Comparativa vs ${target.name}`} density="tight">
          <CompareTable caption={`${target.name} frente a sus alternativas`} columns={columns} rows={rows} />
          <ProvenanceLegend compact className="mt-8 max-w-4xl" />
        </Section>

        <Section id="migrar" tone="paper" density="tight" title={`¿Quieres migrar desde ${target.name}?`}>
          <p className="t-body measure text-ink-2">HostingPlus.cl y EcoHosting.cl te migran gratis y sin downtime.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {canMigrate && (
              <Button asChild variant="brand">
                <Link to={`/migrar-de/${slug}`}>Guía para migrar de {target.name} <ArrowRight aria-hidden /></Link>
              </Button>
            )}
            <Button asChild variant={canMigrate ? 'outline' : 'brand'}>
              <Link to="/cotiza-hosting">Solicitar migración gratuita</Link>
            </Button>
          </div>
        </Section>

        <Section id="preguntas" title="Preguntas frecuentes" density="tight">
          <FaqList items={faqs} />
        </Section>

        <div className="container pb-16">
          <RecommendedByData className="max-w-4xl" />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AlternativasA;
