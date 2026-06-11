import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PublicReviewFormProps {
  providerSlug: string;
  providerName: string;
  onSuccess?: () => void;
}

const schema = z.object({
  author_name: z.string().trim().min(2, 'Nombre muy corto').max(80),
  author_email: z.string().trim().email('Email inválido').max(160),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10, 'Mínimo 10 caracteres').max(1000),
});

export function PublicReviewForm({ providerSlug, providerName, onSuccess }: PublicReviewFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [done, setDone] = useState(false);

  const submit = useMutation({
    mutationFn: async () => {
      if (website) throw new Error('spam');
      const parsed = schema.safeParse({
        author_name: name,
        author_email: email,
        rating,
        comment,
      });
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0]?.message ?? 'Datos inválidos');
      }
      const { error } = await supabase.from('reviews').insert({
        provider_slug: providerSlug,
        author_name: parsed.data.author_name,
        author_email: parsed.data.author_email.toLowerCase(),
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        status: 'pending',
      });
      if (error) {
        if (error.code === '23505') {
          throw new Error('Ya enviaste una reseña para este proveedor.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      setDone(true);
      toast.success('¡Gracias! Tu reseña será publicada tras ser revisada por nuestro equipo.');
      onSuccess?.();
    },
    onError: (e: any) => toast.error(e.message ?? 'Error al enviar reseña'),
  });

  if (done) {
    return (
      <div className="rounded-lg border bg-secondary/30 p-6 text-center">
        <p className="text-lg font-semibold mb-2">¡Gracias por tu reseña!</p>
        <p className="text-sm text-muted-foreground">
          Tu reseña sobre <strong>{providerName}</strong> será publicada tras ser revisada por nuestro equipo.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit.mutate();
      }}
      className="space-y-4"
    >
      {/* honeypot */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rv-name">Nombre</Label>
          <Input id="rv-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
        </div>
        <div>
          <Label htmlFor="rv-email">Email</Label>
          <Input id="rv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={160} />
        </div>
      </div>

      <div>
        <Label className="mb-1 block">Tu valoración</Label>
        <div className="flex gap-1" role="radiogroup" aria-label="Valoración con estrellas">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
              className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Star
                className={cn(
                  'w-7 h-7 transition',
                  (hover || rating) >= n ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="rv-comment">Comentario</Label>
        <Textarea
          id="rv-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          required
          maxLength={1000}
          placeholder={`Cuéntanos tu experiencia con ${providerName}...`}
        />
        <p className="text-xs text-muted-foreground mt-1">{comment.length}/1000</p>
      </div>

      <Button type="submit" disabled={submit.isPending || rating === 0} className="w-full min-h-[44px]">
        {submit.isPending ? 'Enviando...' : 'Enviar reseña'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Tu reseña será revisada antes de publicarse. Solo permitimos 1 reseña por email y proveedor.
      </p>
    </form>
  );
}

export default PublicReviewForm;
