import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShieldCheck, ThumbsUp, MessageSquare, Download } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'service_quality', label: 'Calidad del servicio' },
  { value: 'support', label: 'Soporte técnico' },
  { value: 'billing', label: 'Facturación / cobros' },
  { value: 'downtime', label: 'Caídas / downtime' },
  { value: 'cancellation', label: 'Problemas de cancelación' },
  { value: 'misleading_advertising', label: 'Publicidad engañosa' },
  { value: 'other', label: 'Otro' },
];

const Reclamos = () => {
  const [form, setForm] = useState({
    company_id: '',
    reporter_email: '',
    reporter_name: '',
    title: '',
    description: '',
    category: 'service_quality',
    severity: 3,
    evidence_url: '',
    incident_date: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const { data: companies } = useQuery({
    queryKey: ['companies-for-complaints'],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('id, name, slug')
        .eq('is_verified', true)
        .order('name');
      return data ?? [];
    },
  });

  const { data: complaints, refetch } = useQuery({
    queryKey: ['public-complaints'],
    queryFn: async () => {
      const { data } = await supabase
        .from('public_complaints')
        .select('*, hosting_companies(name, slug)')
        .in('status', ['verified', 'resolved'])
        .order('created_at', { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-complaint', { body: form });
      if (error) throw error;
      if ((data as any).error) throw new Error((data as any).error);
      toast.success('Reclamo recibido. Revisa tu email para verificarlo.');
      setForm({ ...form, title: '', description: '', evidence_url: '', reporter_email: '', reporter_name: '' });
      refetch();
    } catch (err: any) {
      toast.error(err.message ?? 'Error al enviar reclamo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (complaintId: string) => {
    const { error } = await supabase.from('complaint_votes').insert({
      complaint_id: complaintId,
      ip_hash: 'client-' + Math.random().toString(36).slice(2),
    });
    if (error) toast.error('Ya votaste este reclamo');
    else { toast.success('Voto registrado'); refetch(); }
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
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <SEOBreadcrumbs items={[{ name: 'Reclamos', href: '/reclamos' }]} />

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Reclamos Públicos de Hosting</h1>
          <p className="text-muted-foreground text-lg">
            Sistema abierto, verificado por email y con datos públicos. Cualquier persona puede reportar problemas con proveedores de hosting en Chile.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="gap-1"><ShieldCheck className="w-3 h-3" /> Verificación por email</Badge>
            <Badge variant="outline" className="gap-1"><MessageSquare className="w-3 h-3" /> Respuesta del proveedor</Badge>
            <Badge variant="outline">Open Data</Badge>
          </div>
        </header>

        <Card className="p-6 mb-8 border-primary/30">
          <h2 className="text-2xl font-bold mb-4">Enviar un reclamo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Proveedor *</Label>
                <Select value={form.company_id} onValueChange={(v) => setForm({ ...form, company_id: v })}>
                  <SelectTrigger id="company"><SelectValue placeholder="Selecciona un proveedor" /></SelectTrigger>
                  <SelectContent>
                    {companies?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email (para verificar) *</Label>
                <Input id="email" type="email" required value={form.reporter_email} onChange={e => setForm({ ...form, reporter_email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="name">Tu nombre (opcional)</Label>
                <Input id="name" value={form.reporter_name} onChange={e => setForm({ ...form, reporter_name: e.target.value })} maxLength={100} />
              </div>
            </div>

            <div>
              <Label htmlFor="title">Título del reclamo * <span className="text-xs text-muted-foreground">(10-200 caracteres)</span></Label>
              <Input id="title" required minLength={10} maxLength={200} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="desc">Descripción detallada * <span className="text-xs text-muted-foreground">(50-5000 caracteres)</span></Label>
              <Textarea id="desc" required minLength={50} maxLength={5000} rows={6} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="severity">Severidad (1-5) *</Label>
                <Select value={String(form.severity)} onValueChange={(v) => setForm({ ...form, severity: parseInt(v) })}>
                  <SelectTrigger id="severity"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Menor</SelectItem>
                    <SelectItem value="2">2 - Leve</SelectItem>
                    <SelectItem value="3">3 - Moderado</SelectItem>
                    <SelectItem value="4">4 - Grave</SelectItem>
                    <SelectItem value="5">5 - Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="incident">Fecha del incidente</Label>
                <Input id="incident" type="date" value={form.incident_date} onChange={e => setForm({ ...form, incident_date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="evidence">URL de evidencia (opcional)</Label>
                <Input id="evidence" type="url" placeholder="https://..." value={form.evidence_url} onChange={e => setForm({ ...form, evidence_url: e.target.value })} />
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded text-xs text-muted-foreground">
              Al enviar, recibirás un email para verificar tu reclamo. Solo se publican reclamos verificados. Datos personales no se exponen públicamente.
            </div>

            <Button type="submit" disabled={submitting || !form.company_id} className="w-full md:w-auto">
              {submitting ? 'Enviando...' : 'Enviar reclamo'}
            </Button>
          </form>
        </Card>

        <section className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold">Reclamos verificados ({complaints?.length ?? 0})</h2>
          <Button variant="outline" size="sm" onClick={exportJson} className="gap-2">
            <Download className="w-4 h-4" /> Exportar JSON
          </Button>
        </section>

        <div className="space-y-4">
          {complaints?.length === 0 && (
            <Card className="p-8 text-center text-muted-foreground">
              Aún no hay reclamos verificados. Sé el primero en compartir tu experiencia.
            </Card>
          )}
          {complaints?.map((c: any) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div>
                  <h3 className="font-bold text-lg">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Sobre <strong>{c.hosting_companies?.name}</strong> · {new Date(c.created_at).toLocaleDateString('es-CL')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={c.severity >= 4 ? 'destructive' : 'secondary'}>
                    Severidad {c.severity}/5
                  </Badge>
                  <Badge variant="outline">{CATEGORIES.find(x => x.value === c.category)?.label}</Badge>
                  {c.status === 'resolved' && <Badge className="bg-green-600">Resuelto</Badge>}
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap mb-3">{c.description}</p>
              {c.evidence_url && (
                <a href={c.evidence_url} target="_blank" rel="nofollow noopener" className="text-xs text-primary underline block mb-3">
                  Ver evidencia →
                </a>
              )}
              {c.provider_response && (
                <div className="bg-muted/50 p-3 rounded mb-3 border-l-2 border-primary">
                  <p className="text-xs font-semibold mb-1">Respuesta del proveedor:</p>
                  <p className="text-sm">{c.provider_response}</p>
                </div>
              )}
              <div className="flex items-center gap-3 pt-2 border-t">
                <Button variant="ghost" size="sm" onClick={() => handleVote(c.id)} className="gap-1">
                  <ThumbsUp className="w-4 h-4" /> Me pasó lo mismo ({c.votes_count})
                </Button>
              </div>
              {/* Schema.org Review */}
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Review',
                'itemReviewed': { '@type': 'Organization', 'name': c.hosting_companies?.name },
                'reviewBody': c.description,
                'reviewRating': { '@type': 'Rating', 'ratingValue': 6 - c.severity, 'bestRating': 5, 'worstRating': 1 },
                'datePublished': c.created_at,
                'name': c.title,
              })}} />
            </Card>
          ))}
        </div>

        <Card className="mt-12 p-6 bg-muted/30">
          <h3 className="font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Política de moderación</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Verificación obligatoria por email (token mágico, expira en 48h).</li>
            <li>Anti-spam: máximo 3 reclamos por IP/empresa cada 24h.</li>
            <li>Los proveedores pueden responder a reclamos sobre su empresa.</li>
            <li>Reclamos con datos sensibles, ofensas o falsos son rechazados.</li>
            <li>Datos abiertos: descarga JSON disponible para investigación.</li>
          </ul>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Reclamos;
