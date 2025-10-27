import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Check, X, Flag, Star, Zap, Headphones, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ReviewModeration() {
  const { role, loading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const { data: pendingReviews } = useQuery({
    queryKey: ['pending-reviews'],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_reviews')
        .select(`
          *,
          hosting_companies (name, logo_url)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      return data;
    },
  });

  const moderateReview = useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string; status: 'approved' | 'rejected' }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('hosting_reviews')
        .update({
          status,
          moderated_by: user?.id,
          moderated_at: new Date().toISOString(),
          moderation_notes: notes,
        })
        .eq('id', reviewId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Review moderada correctamente');
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] });
      setNotes('');
      setSelectedReview(null);
    },
    onError: (error: any) => {
      toast.error(error.message ?? 'Error al moderar review');
    },
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Moderar Reviews</h1>

        <div className="space-y-6">
          {pendingReviews?.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={review.hosting_companies.logo_url}
                  alt={review.hosting_companies.name}
                  className="w-16 h-16 object-contain"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{review.hosting_companies.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary flex items-center gap-1">
                    <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                    {review.overall_rating}/10
                  </div>
                </div>
              </div>

              {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
              <p className="text-foreground mb-4">{review.comment}</p>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-muted-foreground">Velocidad:</span>{' '}
                  <span className="font-semibold">{review.speed_rating}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Soporte:</span>{' '}
                  <span className="font-semibold">{review.support_rating}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-500" />
                  <span className="text-muted-foreground">Precio:</span>{' '}
                  <span className="font-semibold">{review.price_rating}/10</span>
                </div>
              </div>

              {selectedReview === review.id && (
                <div className="mb-4">
                  <Textarea
                    placeholder="Notas de moderación (opcional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSelectedReview(review.id);
                    moderateReview.mutate({ reviewId: review.id, status: 'approved' });
                  }}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={moderateReview.isPending}
                >
                  <Check className="w-4 h-4 mr-2" /> Aprobar
                </Button>

                <Button
                  onClick={() => {
                    setSelectedReview(review.id);
                    moderateReview.mutate({ reviewId: review.id, status: 'rejected' });
                  }}
                  variant="destructive"
                  disabled={moderateReview.isPending}
                >
                  <X className="w-4 h-4 mr-2" /> Rechazar
                </Button>

                <Button
                  onClick={() => setSelectedReview(selectedReview === review.id ? null : review.id)}
                  variant="outline"
                >
                  <Flag className="w-4 h-4 mr-2" /> Notas
                </Button>
              </div>
            </Card>
          ))}

          {(!pendingReviews || pendingReviews.length === 0) && (
            <Card className="p-12 text-center text-muted-foreground">
              No hay reviews pendientes de moderación
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
