import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { functionErrorText } from '@/lib/functionError';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

type Result = { state: 'loading' } | { state: 'success'; message: string } | { state: 'error'; message: string; resend: boolean };

const NO_TOKEN = 'Al enlace le falta el código de verificación. Ábrelo tal como llegó en el correo que te enviamos.';

/**
 * Causas que devuelve la función verify-complaint, con el paso siguiente.
 * «Token ya utilizado» no es un fallo para la persona: su reclamo ya estaba verificado.
 */
const CAUSES: Record<string, Result> = {
  'Token requerido': { state: 'error', message: NO_TOKEN, resend: false },
  'Token inválido': {
    state: 'error',
    message: 'No reconocemos este enlace. Ábrelo tal como llegó en el correo o envía el reclamo otra vez.',
    resend: true,
  },
  'Token expirado': {
    state: 'error',
    message: 'El enlace de verificación venció. Envía el reclamo otra vez y verifícalo desde el correo nuevo.',
    resend: true,
  },
  'Token ya utilizado': { state: 'success', message: 'Este enlace ya se había usado: tu reclamo ya estaba verificado.' },
};

const VerificarReclamo = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [result, setResult] = useState<Result>({ state: 'loading' });

  useEffect(() => {
    if (!token) {
      setResult({ state: 'error', message: NO_TOKEN, resend: false });
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-complaint', { body: { token } });
        if (error) throw error;
        const fnError = (data as { error?: string } | null)?.error;
        if (fnError) throw new Error(fnError);
        setResult({ state: 'success', message: 'Tu reclamo fue verificado y publicado correctamente.' });
      } catch (e) {
        const text = await functionErrorText(e);
        setResult(CAUSES[text] ?? { state: 'error', message: text, resend: false });
      }
    })();
  }, [token]);

  return (
    <>
      <Helmet>
        <title>Verificar reclamo | EligeTuHosting</title>
      </Helmet>
      <Navbar />
      <main className="bg-white">
        <div className="container py-12 md:py-20">
          <div className="max-w-xl" aria-live="polite">
            {result.state === 'loading' && (
              <p className="t-body flex items-center gap-3 text-ink-2">
                <Loader2 className="h-5 w-5 animate-spin text-ink-3" aria-hidden />
                Verificando tu reclamo…
              </p>
            )}
            {result.state === 'success' && (
              <>
                <CheckCircle2 className="h-10 w-10 text-ink" aria-hidden />
                <h1 className="t-h1 mt-5 text-ink">¡Reclamo verificado!</h1>
                <p className="t-lead mt-4">{result.message}</p>
                <div className="mt-7">
                  <Button asChild>
                    <Link to="/reclamos#reclamos-verificados">Ver reclamos públicos</Link>
                  </Button>
                </div>
              </>
            )}
            {result.state === 'error' && (
              <>
                <XCircle className="h-10 w-10 text-ink-2" aria-hidden />
                <h1 className="t-h1 mt-5 text-ink">No se pudo verificar</h1>
                <p className="t-lead mt-4">{result.message}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to={result.resend ? '/reclamos#enviar-reclamo' : '/reclamos'}>
                      {result.resend ? 'Enviar el reclamo otra vez' : 'Ir a reclamos'}
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contacto">Escribirnos</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VerificarReclamo;
