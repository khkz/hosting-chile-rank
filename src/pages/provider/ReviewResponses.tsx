import { useAuth } from '@/providers/AuthProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ReviewResponses() {
  const { user, role, loading } = useAuth();
  const queryClient = useQueryClient();
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const { data: company } = useQuery({
    queryKey: ['provider-company', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('*')
        .eq('claimed_by', user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: reviews } = useQuery({
    queryKey: ['company-reviews', company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_reviews')
        .select(`
          *,
          review_responses (*)
        `)
        .eq('company_id', company!.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      return data;
    },
    enabled: !!company?.id,
  });

  const respondMutation = useMutation({
    mutationFn: async ({ reviewId, text }: { reviewId: string; text: string }) => {
      const { error } = await supabase
        .from('review_responses')
        .insert({
          review_id: reviewId,
          company_id: company!.id,
          responded_by: user!.id,
          response_text: text,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-reviews'] });
      setRespondingTo(null);
      setResponseText('');
      toast.success('Respuesta publicada');
    },
    onError: () => {
      toast.error('Error al publicar respuesta');
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || role !== 'hosting_provider' || !company) {
    return <Navigate to="/provider/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Helmet>
        <title>Reviews | Panel de Proveedor</title>
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Reviews de Clientes</h1>
          </div>
          <p className="text-muted-foreground">
            Responde a las opiniones de tus clientes sobre {company.name}
          </p>
        </div>

        <div className="space-y-6">
          {reviews?.map((review) => {
            const hasResponse = review.review_responses && Array.isArray(review.review_responses) && review.review_responses.length > 0;

            return (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.overall_rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {review.is_verified_customer && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Cliente Verificado
                        </Badge>
                      )}
                    </div>
                    {review.title && <h3 className="font-bold mb-2">{review.title}</h3>}
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                </div>

                {hasResponse ? (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="text-sm font-semibold mb-1">Respuesta de {company.name}</p>
                    <p className="text-sm">{review.review_responses[0].response_text}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.review_responses[0].created_at).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                ) : (
                  <>
                    {respondingTo === review.id ? (
                      <div className="mt-4 space-y-2">
                        <Textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Escribe tu respuesta..."
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => respondMutation.mutate({ reviewId: review.id, text: responseText })}
                            disabled={!responseText.trim()}
                          >
                            Publicar Respuesta
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setRespondingTo(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-4"
                        onClick={() => setRespondingTo(review.id)}
                      >
                        Responder
                      </Button>
                    )}
                  </>
                )}
              </Card>
            );
          })}
        </div>

        {!reviews || reviews.length === 0 && (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay reviews todavía</h3>
            <p className="text-muted-foreground">
              Las reviews aparecerán aquí cuando los usuarios califiquen tu servicio
            </p>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
