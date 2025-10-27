import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Star, Zap, Headphones, DollarSign } from 'lucide-react';

interface ReviewFormProps {
  companyId: string;
  companyName: string;
  onSuccess?: () => void;
}

export function ReviewForm({ companyId, companyName, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    overall_rating: 8,
    speed_rating: 8,
    support_rating: 8,
    price_rating: 8,
    title: '',
    comment: '',
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Debes estar autenticado para dejar una review');

      const { error } = await supabase.from('hosting_reviews').insert({
        company_id: companyId,
        user_id: user.id,
        ...formData,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('¡Review enviada! La revisaremos pronto.');
      queryClient.invalidateQueries({ queryKey: ['reviews', companyId] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message ?? 'Error al enviar review');
    },
  });

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-4">
          Debes iniciar sesión para dejar una valoración
        </p>
        <Button asChild>
          <a href="/auth">Iniciar Sesión</a>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-6">
        Deja tu valoración para {companyName}
      </h3>

      <div className="space-y-6 mb-6">
        {/* Overall Rating */}
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Rating General: {formData.overall_rating}/10
          </Label>
          <Slider
            value={[formData.overall_rating]}
            onValueChange={([value]) => setFormData({ ...formData, overall_rating: value })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        {/* Speed Rating */}
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-500" />
            Velocidad: {formData.speed_rating}/10
          </Label>
          <Slider
            value={[formData.speed_rating]}
            onValueChange={([value]) => setFormData({ ...formData, speed_rating: value })}
            min={1}
            max={10}
            step={1}
          />
        </div>

        {/* Support Rating */}
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Headphones className="w-4 h-4 text-green-500" />
            Soporte: {formData.support_rating}/10
          </Label>
          <Slider
            value={[formData.support_rating]}
            onValueChange={([value]) => setFormData({ ...formData, support_rating: value })}
            min={1}
            max={10}
            step={1}
          />
        </div>

        {/* Price Rating */}
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-purple-500" />
            Precio/Calidad: {formData.price_rating}/10
          </Label>
          <Slider
            value={[formData.price_rating]}
            onValueChange={([value]) => setFormData({ ...formData, price_rating: value })}
            min={1}
            max={10}
            step={1}
          />
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <Label className="mb-2">Título</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Resumen de tu experiencia"
        />
      </div>

      {/* Comment */}
      <div className="mb-6">
        <Label className="mb-2">Tu experiencia</Label>
        <Textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Cuéntanos tu experiencia con este hosting..."
          rows={6}
        />
      </div>

      <Button
        onClick={() => submitReview.mutate()}
        disabled={!formData.comment || submitReview.isPending}
        className="w-full"
      >
        {submitReview.isPending ? 'Enviando...' : 'Enviar Valoración'}
      </Button>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Tu review será verificada antes de publicarse para garantizar su autenticidad.
      </p>
    </Card>
  );
}
