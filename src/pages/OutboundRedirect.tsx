import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const isValidUrl = (u: string | null | undefined) => {
  if (!u) return false;
  try {
    const url = new URL(u);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const OutboundRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [name, setName] = useState<string>('');
  const [target, setTarget] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) return setNotFound(true);
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('name, website')
        .eq('slug', slug)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data || !isValidUrl(data.website)) {
        setNotFound(true);
        return;
      }
      setName(data.name);
      setTarget(data.website);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => {
      window.location.replace(target);
    }, 600);
    return () => clearTimeout(t);
  }, [target]);

  return (
    <>
      <Helmet>
        <meta name="referrer" content="no-referrer" />
        <meta name="robots" content="noindex, nofollow" />
        {target && <meta httpEquiv="refresh" content={`0;url=${target}`} />}
        <title>Redirigiendo… | EligeTuHosting.cl</title>
      </Helmet>
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center">
          {notFound ? (
            <>
              <h1 className="text-2xl font-bold mb-3">Enlace no disponible</h1>
              <p className="text-muted-foreground mb-6">
                No pudimos encontrar el destino de este proveedor.
              </p>
              <Link
                to="/ranking"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold"
              >
                Volver al ranking
              </Link>
            </>
          ) : (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <h1 className="text-xl font-semibold mb-2">
                Te llevamos a {name || 'el proveedor'}…
              </h1>
              <p className="text-sm text-muted-foreground">
                Redirección anónima de EligeTuHosting.cl
              </p>
              {target && (
                <p className="mt-6 text-xs text-muted-foreground">
                  Si no eres redirigido,{' '}
                  <a
                    href={target}
                    rel="noopener noreferrer nofollow"
                    referrerPolicy="no-referrer"
                    className="underline"
                  >
                    haz click aquí
                  </a>
                  .
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default OutboundRedirect;
