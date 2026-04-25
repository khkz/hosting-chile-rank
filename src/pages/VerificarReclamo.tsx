import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerificarReclamo = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setState('error'); setMessage('Token no proporcionado'); return; }
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-complaint', { body: { token } });
        if (error) throw error;
        if ((data as any).error) throw new Error((data as any).error);
        setState('success');
        setMessage('Tu reclamo fue verificado y publicado correctamente.');
      } catch (e: any) {
        setState('error');
        setMessage(e.message ?? 'Error al verificar');
      }
    })();
  }, [token]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-xl">
        <Card className="p-8 text-center">
          {state === 'loading' && (<><Loader2 className="w-12 h-12 mx-auto animate-spin text-primary mb-4" /><p>Verificando...</p></>)}
          {state === 'success' && (
            <>
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h1 className="text-2xl font-bold mb-2">¡Reclamo verificado!</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <Link to="/reclamos"><Button>Ver reclamos públicos</Button></Link>
            </>
          )}
          {state === 'error' && (
            <>
              <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
              <h1 className="text-2xl font-bold mb-2">No se pudo verificar</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <Link to="/reclamos"><Button variant="outline">Volver</Button></Link>
            </>
          )}
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default VerificarReclamo;
