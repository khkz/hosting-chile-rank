import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import { functionErrorText } from '@/lib/functionError';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Download, MessageSquare, ShieldCheck } from 'lucide-react';
import ReclamoForm, { type CompanyOption, type ComplaintPayload } from '@/components/marco/reclamos/ReclamoForm';
import ReclamoCard, { type PublicComplaint } from '@/components/marco/reclamos/ReclamoCard';

/** Identificador aleatorio del voto (sin Math.random). La deduplicación real debe hacerla el servidor. */
const voteToken = (): string =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');

const Reclamos = () => {
  const activeCountry = getActiveCountryCode();
  // En Chile mostramos solo Chile (comportamiento actual, no cambia lo visible).
  // Desde cualquier otro dominio LATAM incluimos los 55 proveedores LATAM
  // agrupados por país en el selector — necesario para reclamos regionales.
  const includeLatam = activeCountry !== 'CL';
  const { data: companies } = useQuery({
    queryKey: ['companies-for-complaints', activeCountry, includeLatam],
    queryFn: async () => {
      let q = supabase
        .from('hosting_companies')
        .select('id, name, slug, country')
        .eq('is_verified', true)
        .order('country')
        .order('name');
      if (!includeLatam) q = q.eq('country', activeCountry);
      else q = q.in('country', ['CL', 'PE', 'MX', 'CO', 'AR']);
      const { data } = await q;
      return (data ?? []) as Array<{ id: string; name: string; slug: string; country: string }>;
    },
  });

  const { data: complaints, refetch, isError: complaintsError } = useQuery({
    queryKey: ['public-complaints'],
    queryFn: async () => {
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- vista sin tipos generados (igual que antes)
        .from('public_complaints_public' as any)
        .select('*, hosting_companies(name, slug)')
        .in('status', ['verified', 'resolved'])
        .order('created_at', { ascending: false })
        .limit(50);
      // Un error de lectura no es "no hay reclamos": se lanza para mostrar el aviso de error.
      if (error) throw error;
      return (data ?? []) as unknown as PublicComplaint[];
    },
  });

  const submitComplaint = async (payload: ComplaintPayload) => {
    const { data, error } = await supabase.functions.invoke('submit-complaint', { body: payload });
    if (error) throw error;
    const fnError = (data as { error?: string } | null)?.error;
    if (fnError) throw new Error(fnError);
    refetch();
  };

  const handleVote = async (complaintId: string) => {
    const { error } = await supabase.from('complaint_votes').insert({
      complaint_id: complaintId,
      ip_hash: 'client-' + voteToken(),
    });
    if (!error) {
      toast({ title: 'Voto registrado. Gracias por sumar tu experiencia.' });
      refetch();
    } else if ((error as { code?: string }).code === '23505') {
      // Solo la restricción única (complaint_id, ip_hash) significa que ya votaste.
      toast({ title: 'Ya habías marcado este reclamo.' });
    } else {
      toast({ title: 'No pudimos registrar tu voto', description: await functionErrorText(error), variant: 'destructive' });
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(complaints, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'reclamos-hosting-chile.json'; a.click();
  };

  useEffect(() => { document.title = 'Reclamos Públicos de Hosting Chile | EligeTuHosting'; }, []);

  return (
    <>
      <DynamicMetaTags
        title="Reclamos Públicos de Hosting en Chile 2026"
        description="Sistema abierto y transparente de reclamos verificados sobre proveedores de hosting en Chile. Comparte tu experiencia, vota reclamos similares, accede a datos abiertos."
        canonical="https://eligetuhosting.cl/reclamos"
      />
      <Navbar />
      <main>
        <PageHeader
          breadcrumbs={<SEOBreadcrumbs items={[{ name: 'Reclamos', href: '/reclamos' }]} />}
          title="Reclamos Públicos de Hosting"
          lead="Sistema abierto, verificado por email y con datos públicos. Cualquier persona puede reportar problemas con proveedores de hosting en Chile."
          meta={
            <>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-ink-2" aria-hidden /> Verificación por email
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-ink-2" aria-hidden /> Respuesta del proveedor
              </span>
            </>
          }
        />

        <Section id="enviar-reclamo" tone="paper" title="Enviar un reclamo">
          <div className="max-w-3xl">
            <ReclamoForm companies={(companies ?? []) as CompanyOption[]} onSubmit={submitComplaint} />
          </div>
        </Section>

        <Section
          id="reclamos-verificados"
          title={`Reclamos verificados${complaints ? ` (${complaints.length})` : ''}`}
          action={
            <Button variant="outline" onClick={exportJson}>
              <Download aria-hidden /> Exportar JSON
            </Button>
          }
        >
          <div className="max-w-3xl space-y-4">
            {complaintsError && !complaints && (
              <div role="alert" className="rounded-xl border border-rule border-l-4 border-l-ink bg-paper p-5">
                <p className="t-h3 text-ink">No pudimos cargar los reclamos</p>
                <p className="t-small mt-1 text-ink-2">
                  Es un problema de conexión con nuestra base de datos, no significa que no haya reclamos.{' '}
                  <button type="button" onClick={() => refetch()} className="rounded-sm font-semibold text-ink underline underline-offset-2">
                    Reintentar
                  </button>
                </p>
              </div>
            )}
            {complaints?.length === 0 && (
              <div className="rounded-xl border border-rule bg-white p-5 md:p-6">
                <p className="t-h3 text-ink">Todavía no hay reclamos verificados publicados</p>
                <p className="t-small mt-1 text-ink-2">
                  Si tuviste una mala experiencia con un proveedor y puedes adjuntar evidencia (correo, ticket,
                  captura), tu reclamo ayuda a otras personas a decidir mejor.
                </p>
                <a
                  href="#enviar-reclamo"
                  className="mt-3 inline-flex min-h-11 items-center rounded-sm text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                >
                  Enviar un reclamo
                </a>
              </div>
            )}
            {complaints?.map((c) => (
              <ReclamoCard key={c.id} c={c} onVote={handleVote} />
            ))}
          </div>
        </Section>

        <Section tone="paper" density="tight" title="Política de moderación">
          <ul className="t-body measure list-disc space-y-1.5 pl-5 text-ink-2">
            <li>Verificación obligatoria por email (token mágico, expira en 48h).</li>
            <li>Anti-spam: máximo 3 reclamos por IP/empresa cada 24h.</li>
            <li>Los proveedores pueden responder a reclamos sobre su empresa.</li>
            <li>Reclamos con datos sensibles, ofensas o falsos son rechazados.</li>
            <li>Datos abiertos: descarga JSON disponible para investigación.</li>
          </ul>
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default Reclamos;
