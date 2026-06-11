import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type ReviewRow = {
  id: string;
  provider_slug: string;
  author_name: string;
  author_email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export default function AdminPublicReviews() {
  const { role, loading } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const { data: rows, isLoading } = useQuery({
    queryKey: ['admin-public-reviews', tab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', tab)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as ReviewRow[];
    },
  });

  const { data: pendingCount } = useQuery({
    queryKey: ['admin-public-reviews-pending-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      if (error) throw error;
      return count ?? 0;
    },
  });

  const moderate = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('reviews')
        .update({
          status,
          moderated_at: new Date().toISOString(),
          moderated_by: user?.id ?? null,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Reseña actualizada');
      qc.invalidateQueries({ queryKey: ['admin-public-reviews'] });
      qc.invalidateQueries({ queryKey: ['admin-public-reviews-pending-count'] });
      qc.invalidateQueries({ queryKey: ['public-reviews-v2'] });
      qc.invalidateQueries({ queryKey: ['review-stats'] });
      qc.invalidateQueries({ queryKey: ['review-stats-slug'] });
    },
    onError: (e: any) => toast.error(e.message ?? 'Error'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Reseña eliminada');
      qc.invalidateQueries({ queryKey: ['admin-public-reviews'] });
      qc.invalidateQueries({ queryKey: ['admin-public-reviews-pending-count'] });
    },
    onError: (e: any) => toast.error(e.message ?? 'Error'),
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Moderación de reseñas públicas</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Reseñas enviadas por visitantes (sin login) en /catalogo/[slug] y el home.
            </p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {pendingCount ?? 0} pendiente{pendingCount === 1 ? '' : 's'}
          </Badge>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="pending">Pendientes {pendingCount ? `(${pendingCount})` : ''}</TabsTrigger>
            <TabsTrigger value="approved">Aprobadas</TabsTrigger>
            <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-6 space-y-4">
            {isLoading && <p className="text-muted-foreground">Cargando...</p>}
            {!isLoading && (!rows || rows.length === 0) && (
              <Card className="p-8 text-center text-muted-foreground">No hay reseñas en este estado.</Card>
            )}
            {rows?.map((r) => (
              <Card key={r.id} className="p-5">
                <div className="flex justify-between flex-wrap gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{r.author_name}</span>
                      <span className="text-xs text-muted-foreground">· {r.author_email}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Proveedor: <code>{r.provider_slug}</code> ·{' '}
                      {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: es })}
                    </div>
                  </div>
                  <div className="flex" aria-label={`${r.rating} de 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn(
                          'w-4 h-4',
                          n <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap mb-4">{r.comment}</p>
                <div className="flex gap-2 flex-wrap">
                  {r.status !== 'approved' && (
                    <Button
                      size="sm"
                      onClick={() => moderate.mutate({ id: r.id, status: 'approved' })}
                      disabled={moderate.isPending}
                    >
                      <Check className="w-4 h-4 mr-1" /> Aprobar
                    </Button>
                  )}
                  {r.status !== 'rejected' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moderate.mutate({ id: r.id, status: 'rejected' })}
                      disabled={moderate.isPending}
                    >
                      <X className="w-4 h-4 mr-1" /> Rechazar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm('¿Eliminar esta reseña?')) remove.mutate(r.id);
                    }}
                    disabled={remove.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
