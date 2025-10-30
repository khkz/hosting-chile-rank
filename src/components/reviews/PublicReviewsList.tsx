import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, ThumbsUp, Zap, Headphones, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface PublicReviewsListProps {
  companyId: string;
  companyName: string;
}

type FilterType = 'recent' | 'rating' | 'helpful';

export function PublicReviewsList({ companyId, companyName }: PublicReviewsListProps) {
  const [filter, setFilter] = useState<FilterType>('recent');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const queryClient = useQueryClient();

  // Fetch approved reviews
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['public-reviews', companyId, filter, page],
    queryFn: async () => {
      let query = supabase
        .from('hosting_reviews')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'approved')
        .range((page - 1) * perPage, page * perPage - 1);

      if (filter === 'recent') query = query.order('created_at', { ascending: false });
      if (filter === 'rating') query = query.order('overall_rating', { ascending: false });
      if (filter === 'helpful') query = query.order('helpful_count', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.overall_rating, 0) / totalReviews;
    const distribution = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(r => r.overall_rating === rating).length,
      percentage: (reviews.filter(r => r.overall_rating === rating).length / totalReviews) * 100
    }));

    return { totalReviews, avgRating, distribution };
  }, [reviews]);

  // Mark review as helpful
  const markHelpfulMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('review_helpful_votes')
        .insert({
          review_id: reviewId,
          user_id: user?.id || null,
          ip_address: null // IP will be handled server-side if needed
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-reviews', companyId] });
      toast.success('¡Gracias por tu voto!');
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate')) {
        toast.error('Ya has marcado esta opinión como útil');
      } else {
        toast.error('Error al votar');
      }
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No hay opiniones públicas disponibles aún.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Sé el primero en compartir tu experiencia con {companyName}.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-primary">{stats.avgRating.toFixed(1)}/10</div>
              <div className="text-sm text-muted-foreground mt-2">
                Basado en {stats.totalReviews} opinión{stats.totalReviews !== 1 ? 'es' : ''}
              </div>
              <div className="flex gap-1 mt-2 justify-center md:justify-start">
                {[...Array(10)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.round(stats.avgRating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} 
                  />
                ))}
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1">
              {stats.distribution.slice(0, 5).map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2 mb-1">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={filter === 'recent' ? 'default' : 'outline'}
          onClick={() => setFilter('recent')}
          size="sm"
        >
          Más Recientes
        </Button>
        <Button 
          variant={filter === 'rating' ? 'default' : 'outline'}
          onClick={() => setFilter('rating')}
          size="sm"
        >
          Mejor Calificadas
        </Button>
        <Button 
          variant={filter === 'helpful' ? 'default' : 'outline'}
          onClick={() => setFilter('helpful')}
          size="sm"
        >
          Más Útiles
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                A
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-semibold">
                    Usuario Anónimo
                  </span>
                  {review.is_verified_customer && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Cliente Verificado
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: es })}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-2 items-center">
                  {[...Array(10)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.overall_rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} 
                    />
                  ))}
                  <span className="ml-2 font-semibold">{review.overall_rating}/10</span>
                </div>

                {/* Title */}
                {review.title && (
                  <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                )}

                {/* Comment */}
                <p className="text-foreground mb-4 whitespace-pre-wrap">{review.comment}</p>

                {/* Sub-ratings */}
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  {review.speed_rating && (
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>Velocidad: {review.speed_rating}/10</span>
                    </div>
                  )}
                  {review.support_rating && (
                    <div className="flex items-center gap-1">
                      <Headphones className="w-4 h-4 text-green-500" />
                      <span>Soporte: {review.support_rating}/10</span>
                    </div>
                  )}
                  {review.price_rating && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      <span>Precio: {review.price_rating}/10</span>
                    </div>
                  )}
                </div>

                {/* Customer Duration */}
                {review.customer_duration && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Cliente por: {review.customer_duration === '0-1' ? 'Menos de 1 año' : 
                                 review.customer_duration === '1-3' ? '1-3 años' : 
                                 'Más de 3 años'}
                  </p>
                )}

                {/* Helpful button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => markHelpfulMutation.mutate(review.id)}
                  disabled={markHelpfulMutation.isPending}
                >
                  <ThumbsUp className="w-4 h-4" />
                  ¿Fue útil? ({review.helpful_count || 0})
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
