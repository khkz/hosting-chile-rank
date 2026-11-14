import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import EvidenceCard from '@/components/system/EvidenceCard';
import EditorialImage from '@/components/media/EditorialImage';
import { Button } from '@/components/ui/button';
import { ProvenanceLegend } from '@/components/data/Provenance';
import Crumbs from '@/components/comparar/Crumbs';
import CompareTable, { type CompareRow } from '@/components/comparar/CompareTable';
import FaqList from '@/components/comparar/FaqList';
import { useCompaniesBySlug, type CompareCompany } from '@/components/comparar/useCompareData';
import { formatScore } from '@/lib/format';
import { MIGRATION_COMPETITORS, ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING } from '@/lib/vsPairs';

const ORIGIN = 'https://eligetuhosting.cl';

const INCLUYE = [
  'Traspaso completo de archivos y base de datos',
  'Migración de buzones de correo y reglas de filtrado',
  'Configuración de SSL gratuito (Let\'s Encrypt o equivalente)',
  'Validación de URLs, formularios y SEO',
  'Coordinación del cambio de DNS sin downtime',
  'Soporte 24/7 en español durante el traspaso',
];

/** «1. Respaldo completo» → «Respaldo completo» (el número lo dibuja la lista). */
const stepTitle = (t: string) => t.replace(/^\d+\.\s*/, '');
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

const MigrarDe: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const isValid = !!slug && (MIGRATION_COMPETITORS as readonly string[]).includes(slug);
  const { data, isLoading } = useCompaniesBySlug(slug ? [slug, ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING] : [], isValid);

  if (!isValid) return <Navigate to="/catalogo" replace />;
  if (isLoading) return <LoadingShell />;
  const target = data?.find(d => d.slug === slug) ?? null;
  const hp = data?.find(d => d.slug === ANCHOR_HOSTINGPLUS) ?? null;
  const eh = data?.find(d => d.slug === ANCHOR_ECOHOSTING) ?? null;
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

  const sides = [target, hp, eh].filter(Boolean) as CompareCompany[];
  const rows: CompareRow[] = [
    { id: 'nota', label: 'Nota editorial', kind: 'editorial', empty: 'Sin nota', cells: sides.map((c) => ({ value: scoreText(c), raw: c.overall_rating })) },
    { id: 'precio', label: 'Precio desde', note: 'En reverificación: consulta el valor vigente en su sitio.', cells: sides.map(() => ({ value: 'Consultar', raw: null })) },
    { id: 'datacenter', label: 'Datacenter', kind: 'declared', cells: sides.map((c) => ({ value: c.datacenter_location, raw: c.datacenter_location })) },
    {
      id: 'migracion', label: 'Migración gratuita',
      cells: sides.map((c) => ({ value: c.slug === slug ? (c.has_migration_free ? 'Sí' : 'Consultar') : 'Sí, asistida', raw: null })),
    },
  ];

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
      <main>
        <PageHeader
          breadcrumbs={<Crumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Migrar hosting', href: '/guia-migrar-hosting' }, { name: `Migrar de ${target.name}` }]} />}
          title={title}
          lead={
            <>
              Si tu sitio está en {target.name} y notas lentitud, soporte tardío o quieres datacenter local en Chile, esta
              guía te muestra cómo migrar sin downtime a un proveedor verificado del ranking:{' '}
              <strong className="tabular font-semibold text-ink">HostingPlus.cl (9,9/10)</strong> o{' '}
              <strong className="tabular font-semibold text-ink">EcoHosting.cl (9,6/10)</strong>. Ambos ofrecen migración
              gratuita asistida.
            </>
          }
          actions={
            <>
              <Button asChild variant="brand" size="lg">
                <a href="/ir/hostingplus">Solicitar migración gratuita a HostingPlus <ExternalLink aria-hidden /></a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/cotiza-hosting">Cotizar primero</Link>
              </Button>
            </>
          }
          aside={
            <EditorialImage
              name="migracion"
              className="aspect-[4/3]"
              sizes="(min-width:1024px) 45vw, 100vw"
              priority
              fallback={
                <EvidenceCard
                  title="Tu migración en 4 pasos"
                  subtitle={`Desde ${target.name}`}
                  rows={checklist.map((c, i) => ({ label: `Paso ${i + 1}`, value: stepTitle(c.t) }))}
                />
              }
            />
          }
        />

        <Section id="pasos" title="Checklist de migración en 4 pasos" density="tight">
          <ol className="max-w-3xl divide-y divide-rule border-y border-rule">
            {checklist.map((s, i) => (
              <li key={s.t} className="flex gap-4 py-5">
                <span aria-hidden className="tabular flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-paper-deep font-bold text-ink">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="t-h3 text-ink"><span className="sr-only">Paso {i + 1}: </span>{stepTitle(s.t)}</h3>
                  <p className="t-body mt-1 text-ink-2">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="incluye" title="Qué incluye la migración gratuita" tone="paper" density="tight">
          <ul className="grid max-w-4xl gap-x-8 gap-y-3 sm:grid-cols-2">
            {INCLUYE.map((x) => (
              <li key={x} className="t-body flex items-start gap-2.5 text-ink">
                <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-ink-2" />
                {x}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="comparativa" title="Comparativa breve" density="tight">
          <CompareTable caption={`${target.name} frente a HostingPlus.cl y EcoHosting.cl`} columns={sides.map((c) => ({ key: c.slug, name: c.name, href: `/catalogo/${c.slug}` }))} rows={rows} />
          <Link
            to={`/comparativa/${slug}-vs-hostingplus`}
            className="t-small mt-5 inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            Ver comparativa completa {target.name} vs HostingPlus <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
          <ProvenanceLegend compact className="mt-8 max-w-4xl" />
        </Section>

        <Section id="solicitar" title="Solicita tu migración gratuita" tone="paper" density="tight">
          <p className="t-body measure text-ink-2">Sin downtime, 100% asistida por el equipo técnico.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="brand">
              <Link to="/cotiza-hosting">Solicitar migración gratuita</Link>
            </Button>
            <Button asChild variant="outline">
              <a href="/ir/hostingplus">Ir al sitio de HostingPlus.cl <ExternalLink aria-hidden /></a>
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

export default MigrarDe;
