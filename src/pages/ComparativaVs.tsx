import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import { ProvenanceLegend } from '@/components/data/Provenance';
import Crumbs from '@/components/comparar/Crumbs';
import CompareTable from '@/components/comparar/CompareTable';
import VsVerdict from '@/components/comparar/VsVerdict';
import VsRecommendation from '@/components/comparar/VsRecommendation';
import FaqList from '@/components/comparar/FaqList';
import { buildVsRows } from '@/components/comparar/vsRows';
import { useCompaniesBySlug, type CompareCompany } from '@/components/comparar/useCompareData';
import { useLatestBenchmarkForCompany, useProviderScore } from '@/hooks/useProviderScore';
import { useCompanyReputation } from '@/hooks/useCompanyReputation';
import { formatDataDate, formatScore } from '@/lib/format';
import {
  parsePair, canonicalPair, isValidSlug, isAnchorSlug,
  ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING,
} from '@/lib/vsPairs';

const ORIGIN = 'https://eligetuhosting.cl';

/** Datos medidos y subpuntajes de un lado (hooks existentes, sin consultas nuevas). */
const useSide = (c: CompareCompany | null) => {
  const score = useProviderScore({
    companyId: c?.id,
    supportRating: c?.support_rating ?? null,
    priceRating: c?.price_rating ?? null,
  });
  const bench = useLatestBenchmarkForCompany(c?.id);
  const rep = useCompanyReputation(c?.id);
  return {
    subScores: score.subScores,
    bench: bench.data,
    verifiedReviews: rep.data?.verified_reviews_count ?? c?.verified_reviews ?? null,
    loading: !!c && (score.isLoading || bench.isLoading || rep.isLoading),
  };
};

const LoadingShell = () => (
  <>
    <Navbar />
    <main className="container py-16">
      <p role="status" className="t-body text-ink-2">Cargando la comparativa…</p>
    </main>
    <Footer />
  </>
);

const ComparativaVs: React.FC = () => {
  const { rival } = useParams<{ rival: string }>();
  const parsed = rival ? parsePair(rival) : null;
  const valid = !!parsed && isValidSlug(parsed.a) && isValidSlug(parsed.b) && parsed.a !== parsed.b;

  const slugs = valid && parsed
    ? Array.from(new Set([parsed.a, parsed.b, ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING]))
    : [];
  const { data: companies, isLoading } = useCompaniesBySlug(slugs, valid);
  const a = (parsed && companies?.find((d) => d.slug === parsed.a)) || null;
  const b = (parsed && companies?.find((d) => d.slug === parsed.b)) || null;
  const sideA = useSide(a);
  const sideB = useSide(b);

  if (!parsed || !valid) return <Navigate to="/comparativa" replace />;

  const involvesAnchor = isAnchorSlug(parsed.a) || isAnchorSlug(parsed.b);

  // Canonical URL — if user landed on a non-canonical ordering, render the canonical url tag.
  const canonicalPairStr = canonicalPair(parsed.a, parsed.b);
  const canonical = `${ORIGIN}/comparativa/${canonicalPairStr}`;

  if (isLoading) return <LoadingShell />;
  if (!a || !b) return <Navigate to="/comparativa" replace />;

  const hostingplus = companies?.find((l) => l.slug === ANCHOR_HOSTINGPLUS);
  const ecohosting = companies?.find((l) => l.slug === ANCHOR_ECOHOSTING);

  const title = `${a.name} vs ${b.name}: ¿cuál es mejor en 2026?`;
  const description = `Comparativa ${a.name} vs ${b.name} 2026 con datos verificables: nota, precio, datacenter, año de fundación, grupo corporativo y reseñas.`;
  const lead = `Te mostramos en qué se parecen y en qué difieren ${a.name} y ${b.name}, con la procedencia de cada dato. Las filas marcadas «Difieren» son las que más pesan al decidir.`;

  // Solo para las preguntas frecuentes (mismo texto que el JSON-LD FAQPage).
  const winner = (a.overall_rating ?? 0) >= (b.overall_rating ?? 0) ? a : b;
  const cheaper = a.promo_price && b.promo_price ? (a.promo_price < b.promo_price ? a : b) : null;

  // Veredicto visible: la nota se llama nota editorial y no hay ganador sin las dos notas.
  const scoreOf = (c: CompareCompany) => `${formatScore(c.overall_rating)}/10`;
  const missing = [a, b].filter((c) => c.overall_rating == null).map((c) => c.name);
  let noteSentence: string;
  if (missing.length > 0) {
    noteSentence = `Aún no hay nota editorial para ${missing.join(' ni para ')}, así que no te diremos cuál queda por encima.`;
  } else if (Number(a.overall_rating) === Number(b.overall_rating)) {
    noteSentence = `${a.name} y ${b.name} tienen la misma nota editorial (${scoreOf(a)}).`;
  } else if (involvesAnchor) {
    noteSentence = `Según nuestra nota editorial, ${winner.name} obtiene la nota más alta (${scoreOf(winner)}) frente a su rival.`;
  } else {
    noteSentence = `Comparando la nota editorial de ${a.name} y ${b.name}, ${winner.name} queda por encima (${scoreOf(winner)}).`;
  }
  const priceSentence = cheaper
    ? involvesAnchor
      ? `En precio, ${cheaper.name} publica el plan de entrada más económico de los dos; consulta el valor vigente en su sitio.`
      : `${cheaper.name} es el más económico de los dos en su plan de entrada.`
    : '';
  const leaderSentence = involvesAnchor ? '' : 'Sin embargo, ninguno alcanza al líder del ranking: HostingPlus.cl (9,9/10).';
  const verdict = [noteSentence, priceSentence, leaderSentence].filter(Boolean).join(' ');

  const faqs = [
    {
      q: `¿Cuál es mejor, ${a.name} o ${b.name}?`,
      a: `${winner.name} obtiene mejor nota global (${Number(winner.overall_rating ?? 0).toFixed(1)}/10) según nuestras mediciones de ASN, benchmark y reputación pública. ${involvesAnchor ? '' : 'Aun así, HostingPlus.cl (9.9/10) lidera el ranking general y suele ser una mejor alternativa para la mayoría de proyectos en Chile.'}`,
    },
    {
      q: `¿Cuál es más barato, ${a.name} o ${b.name}?`,
      a: cheaper
        ? `${cheaper.name} ofrece el plan de entrada más económico de los dos. Consulta el valor vigente en su sitio: el precio más bajo no siempre implica mejor relación calidad-precio.`
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

  const rows = buildVsRows(
    [
      { company: a, bench: sideA.bench, subScores: sideA.subScores, verifiedReviews: sideA.verifiedReviews },
      { company: b, bench: sideB.bench, subScores: sideB.subScores, verifiedReviews: sideB.verifiedReviews },
    ],
    sideA.loading || sideB.loading,
  );
  const updated = [a.updated_at, b.updated_at].filter(Boolean).sort().pop() ?? null;

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
      <main>
        <PageHeader
          breadcrumbs={
            <Crumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Comparativa', href: '/comparativa' }, { name: `${a.name} vs ${b.name}` }]} />
          }
          title={title}
          lead={lead}
          meta={
            <>
              {updated && <span>Fichas actualizadas al {formatDataDate(updated)}</span>}
              <Link to="/metodologia" className="underline decoration-ink/30 underline-offset-4 hover:text-ink">
                Cómo evaluamos
              </Link>
            </>
          }
        />

        <Section id="lado-a-lado" title="Lado a lado" density="tight">
          <CompareTable
            caption={`Comparación de ${a.name} y ${b.name}`}
            columns={[
              { key: a.slug, name: a.name, href: `/catalogo/${a.slug}` },
              { key: b.slug, name: b.name, href: `/catalogo/${b.slug}` },
            ]}
            rows={rows}
          />
          <p className="t-meta mt-4 measure">
            Marcamos «Difieren» solo cuando los dos tienen el dato y no coincide. «Sin medir» y «Sin dato» significan
            que aún no lo tenemos: nunca lo rellenamos.
          </p>
          <ProvenanceLegend compact className="mt-8 max-w-4xl" />
        </Section>

        <Section id="veredicto" title="Veredicto editorial" tone="paper" density="tight">
          <p className="t-lead mb-8">{verdict}</p>
          <VsVerdict
            a={{ slug: a.slug, name: a.name, pros: a.pros ?? [], cons: a.cons ?? [] }}
            b={{ slug: b.slug, name: b.name, pros: b.pros ?? [], cons: b.cons ?? [] }}
          />
        </Section>

        <Section id="recomendacion" title="Nuestra recomendación" density="tight">
          <VsRecommendation
            a={a}
            b={b}
            involvesAnchor={involvesAnchor}
            hostingplus={hostingplus}
            ecohosting={ecohosting}
          />
        </Section>

        <Section id="preguntas" title="Preguntas frecuentes" density="tight" className="border-t border-rule">
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

export default ComparativaVs;
