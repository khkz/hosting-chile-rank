import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/system/PageHeader';
import { Button } from '@/components/ui/button';
import { formatDataDate, formatInteger, isoDate } from '@/lib/format';

interface Entry {
  loc: string;
  lastmod: string | null;
}

/** Nombre legible de cada sitemap del índice. */
const NAMES: Record<string, string> = {
  'sitemap-main.xml': 'Páginas principales',
  'sitemap-wiki.xml': 'Wiki de hosting',
  'sitemap-asn.xml': 'Redes (ASN)',
  'sitemap-domains.xml': 'Dominios analizados',
  'sitemap-pe.xml': 'Edición Perú',
  'sitemap-mx.xml': 'Edición México',
  'sitemap-co.xml': 'Edición Colombia',
  'sitemap-ar.xml': 'Edición Argentina',
};

const fileOf = (loc: string) => loc.split('/').pop() ?? loc;

/** Lee un sitemap o un índice de sitemaps: devuelve cada <loc> con su <lastmod>. */
function parseSitemap(xml: string): Entry[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) return [];
  const nodes = [...doc.getElementsByTagName('sitemap'), ...doc.getElementsByTagName('url')];
  return nodes
    .map((n) => ({
      loc: n.getElementsByTagName('loc')[0]?.textContent?.trim() ?? '',
      lastmod: n.getElementsByTagName('lastmod')[0]?.textContent?.trim() || null,
    }))
    .filter((e) => e.loc);
}

const Sitemap = () => {
  const [xmlContent, setXmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const response = await fetch('/sitemap.xml');
        if (!response.ok) {
          throw new Error(`el servidor respondió ${response.status}`);
        }
        setXmlContent(await response.text());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchSitemap();
  }, []);

  const entries = parseSitemap(xmlContent);
  const latest = entries
    .map((e) => e.lastmod)
    .filter((d): d is string => Boolean(d))
    .sort()
    .pop();

  return (
    <>
      <Helmet>
        <title>Sitemap | EligeTuHosting.cl</title>
        <meta name="description" content="Sitemap completo de Elige tu Hosting con todas las páginas y URLs disponibles." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Navbar />

      <main>
        <PageHeader
          title="Sitemap - Elige tu Hosting"
          lead="Todas las secciones del sitio que publicamos para buscadores. Para uso programático, usa directamente el archivo XML."
          meta={
            latest ? (
              <span>
                Última actualización del sitemap: <time dateTime={isoDate(latest)}>{formatDataDate(latest)}</time>
              </span>
            ) : undefined
          }
          actions={
            <Button asChild variant="outline">
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                Abrir /sitemap.xml
                <ExternalLink aria-hidden />
              </a>
            </Button>
          }
        />

        <div className="container py-10 md:py-14">
          {loading ? (
            <p role="status" className="t-body text-ink-2">
              Cargando el sitemap…
            </p>
          ) : error ? (
            <div role="alert" className="max-w-[62ch] rounded-xl border border-rule bg-paper p-6">
              <p className="font-semibold text-ink">No pudimos cargar el sitemap</p>
              <p className="t-body mt-2 text-ink-2">
                Causa: {error}. Vuelve a intentarlo; si sigue fallando, abre /sitemap.xml directamente.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          ) : (
            <>
              <h2 className="t-h2 text-ink">
                {formatInteger(entries.length)} {entries.length === 1 ? 'sección' : 'secciones'}
              </h2>
              <ul className="mt-6 divide-y divide-rule border-y border-rule">
                {entries.map((e) => (
                  <li key={e.loc} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                    <a
                      href={e.loc}
                      className="min-w-0 font-semibold text-ink underline decoration-ink/30 underline-offset-4 [overflow-wrap:anywhere] hover:decoration-ink"
                    >
                      {NAMES[fileOf(e.loc)] ?? fileOf(e.loc)}
                      <span className="t-meta ml-2 font-normal no-underline">{fileOf(e.loc)}</span>
                    </a>
                    {e.lastmod && (
                      <span className="t-meta">
                        Actualizado el <time dateTime={isoDate(e.lastmod)}>{formatDataDate(e.lastmod)}</time>
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <details className="mt-8 rounded-xl border border-rule p-4">
                <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-ink">Ver el XML</summary>
                <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg bg-paper p-4 text-xs leading-relaxed text-ink-2 [overflow-wrap:anywhere]">
                  {xmlContent}
                </pre>
              </details>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Sitemap;
