import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StickyCTA from '../components/StickyCTA';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import HostingProviderCard from '../components/HostingProviderCard';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import EvidenceCard from '@/components/system/EvidenceCard';
import EditorialImage from '@/components/media/EditorialImage';
import { ProvenanceLegend } from '@/components/data/Provenance';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Crumbs from '@/components/comparar/Crumbs';
import HubTable from '@/components/comparar/HubTable';
import PairDirectory from '@/components/comparar/PairDirectory';
import type { HubProvider } from '@/components/comparar/hubTypes';
import { choiceControl, choiceLabel, choiceRow } from '@/components/formularios/formStyles';
import { useRankingProviders } from '@/features/ranking';
import { ALL_CATALOG_SLUGS, getAllVsPairs } from '@/lib/vsPairs';
import { useCompaniesBySlug } from '@/components/comparar/useCompareData';
import { formatDataDate, formatInteger, formatShortDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  VERIFIED_PRICING, PRICING_FOOTNOTE, COMMERCIAL_DISCLOSURE, VERIFICATION_DATE_HUMAN, VERIFICATION_DATE_ISO,
} from '@/data/verified2026';

// Datos revisados el 28-08-2026 (LACNIC RDAP, RIPEstat, PeeringDB, bgp.tools y webs oficiales).
// Precios de entrada anualizados, netos salvo indicación expresa. El orden es una
// decisión pendiente (3) y alimenta las posiciones del JSON-LD ItemList: no lo cambies.
// La nota y los reclamos no se escriben aquí: se leen de la base.
const hostingProviders: HubProvider[] = [
  {
    id: 'hostingplus', catalogSlug: 'hostingplus', name: 'HostingPlus.cl', logo: '/logo-hostingplus-official.png',
    asn: 'AS266879', datacenter: 'Colocation Ascenty SCL2', datacenterPlace: 'Quilicura',
    backups: 'Diarios (JetBackup)', backupFreq: 'Diaria',
    hasLiteSpeed: true, hasWAF: true, hasBackups: true,
    priceLabel: VERIFIED_PRICING.hostingplus.label, priceCLP: VERIFIED_PRICING.hostingplus.annualNetCLP,
    reseñaUrl: '/reseñas/hostingplus',
  },
  {
    id: 'ecohosting', catalogSlug: 'ecohosting', name: 'EcoHosting.cl', logo: '/logo-ecohosting.png',
    asn: 'AS266855', datacenter: 'Declarado propio', datacenterPlace: 'Chile',
    backups: 'RAID 10 SSD', backupFreq: null,
    hasLiteSpeed: false, hasWAF: true, hasBackups: true,
    priceLabel: VERIFIED_PRICING.ecohosting.label, priceCLP: VERIFIED_PRICING.ecohosting.annualNetCLP,
    reseñaUrl: '/reseñas/ecohosting',
  },
  {
    id: 'powerhost', catalogSlug: 'powerhost', name: 'PowerHost / IxMetro', logo: 'https://logo.clearbit.com/powerhost.cl',
    asn: 'AS263237', datacenter: 'DC propio', datacenterPlace: 'Santiago (+ NY, MOW, AMS)',
    backups: 'Tier III', backupFreq: null,
    hasLiteSpeed: false, hasWAF: true, hasBackups: true,
    priceLabel: VERIFIED_PRICING.powerhost.label, priceCLP: null,
    reseñaUrl: '/reseñas/powerhost',
  },
  {
    id: 'hostname', catalogSlug: 'hn', name: 'Hostname.cl', logo: '/logo-hostname.png',
    asn: 'AS262256', datacenter: 'HN DC propio', datacenterPlace: 'Ñuñoa',
    backups: 'Sí', backupFreq: null,
    hasLiteSpeed: false, hasWAF: true, hasBackups: true,
    priceLabel: VERIFIED_PRICING.hostname.label, priceCLP: null,
    reseñaUrl: '/reseñas/hostname',
  },
  {
    id: 'hostingcl', catalogSlug: 'hostingcl', name: 'Hosting.cl', logo: 'https://logo.clearbit.com/hosting.cl',
    asn: 'AS265839', datacenter: 'Declarado propio', datacenterPlace: 'Santiago',
    backups: 'Sí', backupFreq: null,
    hasLiteSpeed: true, hasWAF: true, hasBackups: true,
    priceLabel: VERIFIED_PRICING.hostingcl.label, priceCLP: VERIFIED_PRICING.hostingcl.annualNetCLP,
    reseñaUrl: '/reseñas/hostingcl',
  },
  {
    id: 'bluehosting', catalogSlug: 'bluehost', name: 'BlueHosting.cl', logo: 'https://logo.clearbit.com/bluehosting.cl',
    asn: 'AS64111', datacenter: 'Infraestructura gestionada con Haulmer', datacenterPlace: 'Curicó',
    backups: 'Sí', backupFreq: null,
    hasLiteSpeed: false, hasWAF: true, hasBackups: true,
    priceLabel: VERIFIED_PRICING.bluehosting.label, priceCLP: VERIFIED_PRICING.bluehosting.annualNetCLP,
    reseñaUrl: '/reseñas/bluehosting',
  },
];

const FILTERS = [
  { key: 'liteSpeed', id: 'filtro-litespeed', label: 'LiteSpeed' },
  { key: 'waf', id: 'filtro-waf', label: 'WAF (firewall)' },
  { key: 'backups', id: 'filtro-backups', label: 'Declara backups' },
] as const;

const ComparativaPage = () => {
  const [filters, setFilters] = useState({ liteSpeed: false, waf: false, backups: false });
  const [showFilters, setShowFilters] = useState(false);

  // Nota editorial e id: de la base (hook del ranking). Nombres de marca de las
  // 171 parejas: de la base también, incluidos proveedores que el ranking oculta.
  const { data: ranking, isLoading: rankingLoading } = useRankingProviders(40);
  const bySlug = new Map((ranking ?? []).map((r) => [r.slug, r]));
  const { data: catalog } = useCompaniesBySlug([...ALL_CATALOG_SLUGS]);
  const names = new Map((catalog ?? []).map((c) => [c.slug, c.name]));
  const nameOf = (slug: string) => names.get(slug) ?? bySlug.get(slug)?.name ?? slug;

  const filteredProviders = hostingProviders.filter((provider) => {
    if (filters.liteSpeed && !provider.hasLiteSpeed) return false;
    if (filters.waf && !provider.hasWAF) return false;
    if (filters.backups && !provider.hasBackups) return false;
    return true;
  });
  const rows = filteredProviders.map((provider) => {
    const db = bySlug.get(provider.catalogSlug);
    return { provider, nota: db?.overall_rating ?? null, companyId: db?.id };
  });

  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };
  const resetFilters = () => setFilters({ liteSpeed: false, waf: false, backups: false });
  const activeCount = Object.values(filters).filter(Boolean).length;
  const totalPairs = getAllVsPairs().length;

  const empty = (
    <div className="rounded-xl border border-rule bg-paper p-6">
      <p className="t-body text-ink">Ningún proveedor de la tabla cumple todos los filtros que marcaste.</p>
      <Button variant="outline" className="mt-4" onClick={resetFilters}>Quitar todos los filtros</Button>
    </div>
  );

  return (
    <>
      <DynamicMetaTags
        title="Comparativa Hosting Chile 2026"
        description="Comparativa de hosting en Chile basada en el Estudio Hosting Chile 2026: ASN, datacenter, backups, reclamos y tecnologías verificables."
      />
      <Helmet>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": [
                ${hostingProviders.map((provider, index) => `{
                  "@type": "ListItem",
                  "position": ${index + 1},
                  "name": "${provider.name}",
                  "url": "https://eligetuhosting.cl${provider.reseñaUrl}"
                }`).join(',')}
              ]
            }
          `}
        </script>
      </Helmet>
      <BreadcrumbSchema items={[{ name: 'Comparativa', url: '/comparativa' }]} />

      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={<Crumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Comparativa' }]} />}
          title="Comparativa Hosting Chile 2026"
          lead={
            <>
              {hostingProviders.length} proveedores lado a lado, con una unidad por columna y la procedencia de cada
              dato. Orden y datos basados en el{' '}
              <a href="/estudio-hosting-chile-2026" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                Estudio Hosting Chile 2026
              </a>
              .
            </>
          }
          meta={<span>Revisado el {formatDataDate(VERIFICATION_DATE_ISO)}</span>}
          aside={
            <EditorialImage
              name="comparar"
              className="aspect-[4/3]"
              sizes="(min-width:1024px) 45vw, 100vw"
              priority
              fallback={
                <EvidenceCard
                  title="Qué hay en esta página"
                  subtitle="Hosting en Chile"
                  rows={[
                    { label: 'Proveedores en la tabla', value: formatInteger(hostingProviders.length) },
                    { label: 'Comparativas 1 a 1', value: formatInteger(totalPairs) },
                    { label: 'Datos revisados', value: formatShortDate(VERIFICATION_DATE_ISO) },
                  ]}
                />
              }
            />
          }
        />

        <Section
          id="lado-a-lado"
          title="Proveedores lado a lado"
          lead="La nota y los reclamos se leen de la base. Lo demás se revisó a mano; si un dato no calza con la unidad de su columna, te mandamos a la ficha."
          density="tight"
        >
          <div className="mb-8">
            <Button
              type="button"
              variant="outline"
              className="md:hidden"
              aria-expanded={showFilters}
              aria-controls="filtros-comparativa"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter aria-hidden />
              {activeCount > 0 ? `Filtros (${activeCount})` : 'Filtros'}
            </Button>
            <fieldset id="filtros-comparativa" className={cn(showFilters ? 'block' : 'hidden', 'mt-3 md:mt-0 md:block')}>
              <legend className="t-label">Filtra por características</legend>
              <div className="mt-2 flex flex-wrap items-center gap-x-6">
                {FILTERS.map((f) => (
                  <div key={f.key} className={choiceRow}>
                    <Checkbox id={f.id} className={choiceControl} checked={filters[f.key]} onCheckedChange={() => handleFilterChange(f.key)} />
                    <Label htmlFor={f.id} className={choiceLabel}>{f.label}</Label>
                  </div>
                ))}
                {activeCount > 0 && (
                  <Button type="button" variant="ghost" onClick={resetFilters}>Quitar filtros</Button>
                )}
              </div>
            </fieldset>
          </div>

          <div className="space-y-4 lg:hidden">
            {rows.length > 0
              ? rows.map((r) => (
                  <HostingProviderCard
                    key={r.provider.id}
                    provider={r.provider}
                    nota={r.nota}
                    companyId={r.companyId}
                    notaLoading={rankingLoading}
                    isHighlighted={r.provider.id === 'hostingplus'}
                  />
                ))
              : empty}
          </div>
          <div className="hidden lg:block">
            {rows.length > 0 ? <HubTable rows={rows} highlightId="hostingplus" notaLoading={rankingLoading} /> : empty}
          </div>

          <p className="t-meta measure mt-5">
            Estudio Hosting Chile 2026. Datos revisados el {VERIFICATION_DATE_HUMAN}. {PRICING_FOOTNOTE}{' '}
            {COMMERCIAL_DISCLOSURE}
          </p>
          <ProvenanceLegend compact className="mt-8 max-w-4xl" />
        </Section>

        <Section id="por-que-lidera" tone="paper" title="¿Por qué HostingPlus encabeza el ranking?" density="tight">
          <p className="t-body measure text-ink-2">
            Según el Estudio Hosting Chile 2026, HostingPlus tiene RUT vigente, infraestructura en
            Ascenty SCL2 bajo modalidad de colocation y 0 prefijos IPv4 originados / 1 IPv6 en AS266879.
            El orden de la comparativa se calcula con la metodología y los pesos publicados.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href="/estudio-hosting-chile-2026">Ver el estudio completo</a>
            </Button>
            <Button asChild variant="brand">
              <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
                Ir al sitio de HostingPlus <ExternalLink aria-hidden />
              </a>
            </Button>
          </div>
        </Section>

        <Section
          id="uno-a-uno"
          title="Comparativas 1 a 1"
          lead={`Todas las parejas del catálogo (${formatInteger(totalPairs)}), con datos verificables. Elige dos y míralos lado a lado.`}
          density="tight"
        >
          <PairDirectory nameOf={nameOf} />
        </Section>
      </main>

      <StickyCTA />
      <Footer />
    </>
  );
};

export default ComparativaPage;
