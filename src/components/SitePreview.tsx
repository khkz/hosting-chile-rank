import React, { useEffect, useState } from 'react';
import { ExternalLink, Globe, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { screenshotService, type ScreenshotResult } from '@/services/screenshotService';

interface SitePreviewProps {
  domain: string;
  className?: string;
}

/** Vista previa del sitio: captura de un servicio externo o, si falla, su favicon. */
const SitePreview: React.FC<SitePreviewProps> = ({ domain, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ScreenshotResult | undefined>();

  const loadPreview = async () => {
    setLoading(true);
    try {
      setResult(await screenshotService.captureScreenshot(domain));
    } catch (error) {
      console.error('Preview error:', error);
      setResult({ success: false, error: 'No pudimos cargar la vista previa' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  const showImage = !loading && result?.success && result.imageUrl;

  return (
    <section aria-labelledby="vista-previa-titulo" className={cn('overflow-hidden rounded-xl border border-rule bg-white', className)}>
      <h2 id="vista-previa-titulo" className="t-h3 px-5 pt-5 text-ink">
        Vista previa del sitio
      </h2>
      <div className="mt-4 aspect-[16/10] border-y border-rule bg-paper">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-2" role="status">
            <Loader2 aria-hidden className="h-6 w-6 animate-spin text-ink-3" />
            <p className="t-meta">Capturando vista previa…</p>
          </div>
        ) : showImage ? (
          <img
            src={result!.imageUrl}
            alt={`Vista previa de ${domain}`}
            className="h-full w-full object-cover object-top"
            onError={() => setResult({ success: false, error: 'No pudimos cargar la imagen' })}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            {result?.fallbackData?.favicon ? (
              <img src={result.fallbackData.favicon} alt="" className="h-10 w-10 rounded-lg" />
            ) : (
              <Globe aria-hidden className="h-8 w-8 text-ink-3" />
            )}
            <p className="t-small mt-3 font-semibold text-ink">{domain}</p>
            <p className="t-meta mt-1">{result?.fallbackData?.description || 'Captura no disponible por ahora.'}</p>
            <Button onClick={loadPreview} variant="outline" size="sm" className="mt-3">
              <RefreshCw aria-hidden />
              Reintentar
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="t-small inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          Abrir {domain}
          <ExternalLink aria-hidden className="h-3.5 w-3.5" />
        </a>
        {showImage && result?.provider && <span className="t-meta">Captura: {result.provider}</span>}
      </div>
    </section>
  );
};

export default SitePreview;
