import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReviewableCompanies } from '@/components/ficha/providerQueries';
import { PublicReviewForm } from './PublicReviewForm';

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSlug?: string;
}

export function ReviewModal({ open, onOpenChange, initialSlug }: ReviewModalProps) {
  const [slug, setSlug] = useState<string | undefined>(initialSlug);

  const { data: companies } = useReviewableCompanies(open);

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
                <SelectValue placeholder="Elige un proveedor" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {companies?.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                    {c.ranking_position ? ` (puesto ${c.ranking_position})` : ''}
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
            <p className="py-6 text-center t-small text-ink-2">
              Elige el proveedor que usas para escribir tu reseña.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewModal;
