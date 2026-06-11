import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { PublicReviewForm } from './PublicReviewForm';

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSlug?: string;
}

export function ReviewModal({ open, onOpenChange, initialSlug }: ReviewModalProps) {
  const [slug, setSlug] = useState<string | undefined>(initialSlug);

  const { data: companies } = useQuery({
    queryKey: ['companies-for-review-modal'],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('slug, name, ranking_position, overall_rating')
        .eq('is_verified', true)
        .order('ranking_position', { ascending: true, nullsFirst: false })
        .order('overall_rating', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const selected = companies?.find((c) => c.slug === slug);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deja tu reseña</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="rm-provider">Proveedor</Label>
            <Select value={slug} onValueChange={setSlug}>
              <SelectTrigger id="rm-provider">
                <SelectValue placeholder="Selecciona un proveedor..." />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {companies?.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.ranking_position ? `#${c.ranking_position} · ` : ''}{c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected ? (
            <PublicReviewForm
              key={selected.slug}
              providerSlug={selected.slug}
              providerName={selected.name}
              onSuccess={() => setTimeout(() => onOpenChange(false), 2500)}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              Selecciona un proveedor para comenzar.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewModal;
