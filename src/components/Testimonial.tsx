
import React from 'react';
import { Star, Quote, MessageSquarePlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Testimonial = () => {
  const { data: companies, isLoading: loadingCompanies } = useQuery({
    queryKey: ['verified-companies-logos'],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('name, slug, logo_url')
        .eq('is_verified', true)
        .order('overall_rating', { ascending: false })
        .limit(8);
      return data ?? [];
    },
    staleTime: 1000 * 60 * 30,
  });

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['approved-reviews-home'],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_reviews')
        .select(`
          id, overall_rating, comment, title, created_at, pros,
          hosting_companies!inner(name, slug)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(4);
      return data ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const hasReviews = reviews && reviews.length > 0;

  return (
    <section className="bg-gradient-to-b from-[#F7F9FC] to-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-4">
            Opiniones reales de usuarios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {hasReviews
              ? 'Reseñas verificadas de clientes reales de hosting en Chile'
              : 'Sé el primero en compartir tu experiencia con hosting en Chile'}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#EF233C] to-pink-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {hasReviews ? (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {reviews.map((review: any) => (
              <div key={review.id} className="group relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#EF233C]/20 transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#EF233C] to-[#c41e3a] rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(Math.min(review.overall_rating, 10))].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{review.overall_rating}/10</span>
                </div>
                {review.title && (
                  <h3 className="font-semibold text-[#2B2D42] mb-2">{review.title}</h3>
                )}
                <p className="text-[#2B2D42] text-lg mb-6 italic leading-relaxed">
                  "{review.comment.length > 200 ? review.comment.slice(0, 200) + '...' : review.comment}"
                </p>
                <div className="flex items-center">
                  <div className="ml-0">
                    <p className="font-bold text-[#2B2D42] text-lg">
                      {review.hosting_companies?.name}
                    </p>
                    <p className="text-gray-600 text-sm">Reseña verificada</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#EF233C] to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[#EDF2F4] to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquarePlus className="w-10 h-10 text-[#2B2D42]" />
            </div>
            <h3 className="text-2xl font-semibold text-[#2B2D42] mb-3">
              ¿Ya usas hosting en Chile?
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Comparte tu experiencia real y ayuda a otros a elegir mejor. Tu opinión será revisada y publicada aquí.
            </p>
            <Button asChild className="cta-primary px-8 py-4 text-lg rounded-xl font-semibold">
              <Link to="/vota-hosting">
                Deja tu reseña
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        )}
        
        {/* Partners Section */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-[#2B2D42] mb-8">
            Proveedores verificados en Chile
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 hover:opacity-100 transition-opacity duration-300">
            {loadingCompanies ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-28 rounded" />
              ))
            ) : (
              companies?.map((company) => (
                <Link
                  key={company.slug}
                  to={`/catalogo/${company.slug}`}
                  className="group"
                  title={`Ver ficha de ${company.name}`}
                >
                  <img
                    src={company.logo_url || '/placeholder.svg'}
                    className="h-7 grayscale group-hover:grayscale-0 transition-all duration-300"
                    alt={`Logo de ${company.name} - Hosting verificado en Chile`}
                    loading="lazy"
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
