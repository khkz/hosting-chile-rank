import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Server,
  Package,
  ShoppingCart,
  Layers,
  Cloud,
  Cpu,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Mail,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import RankingPositions4to10 from '@/components/RankingPositions4to10';
import RankingAuthorityBlock from '@/components/RankingAuthorityBlock';
import TopProvidersPodium from '@/components/ranking/TopProvidersPodium';
import Section from '@/components/system/Section';
import RankingHeader from '@/components/hubs/RankingHeader';
import RankingFaq from '@/components/hubs/RankingFaq';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import SEOFAQSchema from '@/components/SEO/SEOFAQSchema';
import { useLatestDomains } from '@/features/ranking';
import { RANKING_TESTIMONIALS as testimonials, RANKING_FAQ as faqItems } from '@/data/rankingContent';
import { VERIFICATION_DATE_ISO } from '@/data/verified2026';
import { formatDataDate, formatInteger, formatShortDate, isoDate, parseDataDate } from '@/lib/format';
import { cn } from '@/lib/utils';

// El Top 3 se construye desde `hosting_companies` (ver TopProvidersPodium):
// el orden lo determina el dato, no un array escrito a mano.

// Planes por tipo de servicio (enlaces existentes, sin cambios de destino ni rel).
const categories = [
  { title: 'Web hosting SSD', icon: Server, url: 'https://clientes.hostingplus.cl/cart.php?gid=13' },
  { title: 'WordPress Turbo', icon: Package, url: 'https://clientes.hostingplus.cl/cart.php?gid=14' },
  { title: 'E-commerce', icon: ShoppingCart, url: 'https://clientes.hostingplus.cl/cart.php?gid=15' },
  { title: 'Reseller', icon: Layers, url: 'https://clientes.hostingplus.cl/cart.php?gid=16' },
  { title: 'VPS cloud', icon: Cloud, url: 'https://clientes.hostingplus.cl/cart.php?gid=17' },
  { title: 'Servidor dedicado', icon: Cpu, url: 'https://clientes.hostingplus.cl/cart.php?gid=18' },
  { title: 'Dominios .cl y .com', icon: Globe, url: 'https://clientes.hostingplus.cl/cart.php?a=add&domain=register' },
];

const DOMAINS_PER_PAGE = 10;

const timeOf = (value: string) =>
  parseDataDate(value)?.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) ?? '';

const linkClass = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const RankingPage = () => {
  const { domains: latestDomains, updatedAt: domainUpdateTime, isLoading: domainsLoading, error: domainsError } = useLatestDomains(200);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastDomain = currentPage * DOMAINS_PER_PAGE;
  const indexOfFirstDomain = indexOfLastDomain - DOMAINS_PER_PAGE;
  const currentDomains = latestDomains.slice(indexOfFirstDomain, indexOfLastDomain);
  const totalPages = Math.ceil(latestDomains.length / DOMAINS_PER_PAGE);

  // Paginación: cinco números alrededor de la página actual.
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    const base = 'inline-flex h-11 min-w-11 items-center justify-center rounded-lg px-3 text-sm font-semibold tabular';
    return (
      <nav aria-label="Páginas de dominios" className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Página anterior"
          className={cn(base, 'border border-rule bg-white text-ink hover:border-ink disabled:opacity-40')}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        {pages.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setCurrentPage(n)}
            aria-current={currentPage === n ? 'page' : undefined}
            aria-label={`Página ${n}`}
            className={cn(base, currentPage === n ? 'bg-ink text-white' : 'border border-rule bg-white text-ink hover:border-ink')}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
          className={cn(base, 'border border-rule bg-white text-ink hover:border-ink disabled:opacity-40')}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
        <span className="t-meta ml-1">
          Página {currentPage} de {totalPages}
        </span>
      </nav>
    );
  };

  return (
    <>
      <Helmet>
        <title>Ranking Hosting Chile 2026 | EligeTuHosting.cl</title>
        <meta name="description" content="Comparativa actualizada de los mejores hosting en Chile. Evaluamos velocidad, soporte local y seguridad para tu sitio web." />
        <link rel="canonical" href="https://eligetuhosting.cl/ranking" />
        <link rel="alternate" hrefLang="es-cl" href="https://eligetuhosting.cl/ranking" />
        <meta property="og:url" content="https://eligetuhosting.cl/ranking" />
        <meta property="og:image" content="https://eligetuhosting.cl/images/ranking-comparison.png" />
        <link rel="alternate" type="application/rss+xml" href="/feed/latest-domains.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <style type="text/css">{`
          /* Critical CSS */
          .critical-css {
            display: block;
            content-visibility: auto;
          }
        `}</style>
      </Helmet>

      <Navbar />

      <main>
        <RankingHeader
          crumbs={[]}
          pageName="Ranking"
          title="Ranking Hosting Chile 2026"
          lead="Ordenamos los proveedores de hosting de Chile por velocidad, soporte, seguridad y dónde guardan tus datos. Cada nota dice de dónde sale y cuándo la revisamos."
          reviewedAt={VERIFICATION_DATE_ISO}
          actions={
            <>
              <Button asChild>
                <Link to="/comparativa">Comparar proveedores</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/metodologia">Ver la metodología</Link>
              </Button>
            </>
          }
        />

        <Section
          id="ranking"
          title="Top 3 proveedores de hosting"
          lead={
            <>
              El orden es editorial. Los criterios que usamos están en la{' '}
              <Link to="/metodologia" className={linkClass}>
                metodología
              </Link>
              .
            </>
          }
        >
          <RankingAuthorityBlock className="mb-8" />
          <TopProvidersPodium />
          <RankingPositions4to10 />
        </Section>

        <Section
          id="categories"
          tone="paper"
          title="Explora por tipo de servicio"
          lead="Elige el tipo de servicio y revisa sus planes."
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <li key={category.title}>
                  <a
                    href={category.url}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="flex min-h-[64px] items-center gap-3 rounded-xl border border-rule bg-white p-4 text-ink transition-colors hover:border-ink"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper">
                      <Icon className="h-5 w-5 text-ink-2" aria-hidden />
                    </span>
                    <span className="flex-1 font-semibold">{category.title}</span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                    <span className="sr-only">(abre otro sitio)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section id="testimonials" title="Lo que dicen nuestros usuarios">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => (
              <li key={testimonial.author}>
                <figure className="flex h-full flex-col rounded-xl border border-rule bg-white p-5">
                  <blockquote className="flex-1 text-ink">«{testimonial.quote}»</blockquote>
                  <figcaption className="t-meta mt-4">{testimonial.author}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="domains"
          tone="paper"
          title="Últimos dominios .cl registrados"
          lead={
            domainUpdateTime ? (
              <>
                Datos actualizados el{' '}
                <time dateTime={isoDate(domainUpdateTime)} className="font-semibold text-ink">
                  {formatDataDate(domainUpdateTime)}
                </time>
                . Mostramos los {formatInteger(latestDomains.length)} registros más recientes.
              </>
            ) : domainsLoading ? (
              'Cargando la fecha de los datos…'
            ) : undefined
          }
        >
          <div className="max-w-3xl">
            {domainsLoading ? (
              <p className="rounded-xl border border-rule bg-white p-4 text-ink-2" aria-busy="true">
                Cargando los dominios…
              </p>
            ) : domainsError ? (
              <p role="alert" className="rounded-xl border border-rule bg-white p-4 text-ink-2">
                No pudimos cargar los dominios: la consulta a nuestra base falló. Recarga la página; si sigue igual, vuelve
                en unos minutos.
              </p>
            ) : latestDomains.length === 0 ? (
              <p className="rounded-xl border border-rule bg-white p-4 text-ink-2">
                Todavía no hay dominios registrados para mostrar. Vuelve más tarde.
              </p>
            ) : (
              <>
                <Table className="text-[15px]">
                  <TableCaption>Dominios .cl más recientes, del más nuevo al más antiguo. Hora local.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 px-2 sm:w-16 sm:px-3">N°</TableHead>
                      <TableHead className="px-2 sm:px-3">Dominio</TableHead>
                      <TableHead className="px-2 text-right sm:px-3">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentDomains.map((item, index) => (
                      <TableRow key={indexOfFirstDomain + index}>
                        <TableCell className="px-2 text-ink-3 sm:px-3">{indexOfFirstDomain + index + 1}</TableCell>
                        <TableCell className="break-all px-2 font-medium sm:px-3">{item.d}</TableCell>
                        <TableCell className="px-2 text-right text-ink-2 sm:px-3">
                          <time dateTime={item.date} className="flex flex-col items-end sm:flex-row sm:justify-end sm:gap-2">
                            <span className="whitespace-nowrap">{formatShortDate(item.date)}</span>
                            <span className="whitespace-nowrap text-ink-3">{timeOf(item.date)}</span>
                          </time>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {renderPagination()}
              </>
            )}
          </div>
        </Section>

        <SEOFAQSchema faqs={faqItems} />
        <RankingFaq id="faq" items={faqItems.map((item) => ({ question: item.question, answer: item.answer }))} />

        <Section id="contact" tone="paper" title="¿Necesitas ayuda para elegir?">
          <p className="t-lead">Escríbenos y nuestro equipo te ayuda a encontrar el hosting que calza con tu proyecto.</p>
          <Button asChild className="mt-6">
            <a href="mailto:contacto@eligetuhosting.cl">
              <Mail aria-hidden />
              Escríbenos
            </a>
          </Button>
        </Section>
      </main>

      <Footer />
    </>
  );
};

export default RankingPage;
