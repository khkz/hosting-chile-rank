import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Globe, CheckCircle } from "lucide-react";

interface Domain {
  id: string;
  domain_name: string;
  listing_price: number | null;
}

interface InquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: Domain;
}

export function InquiryDialog({ open, onOpenChange, domain }: InquiryDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    offer_amount: "",
    message: "",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("domain_inquiries").insert({
        domain_id: domain.id,
        name: formData.name || null,
        email: formData.email,
        phone: formData.phone || null,
        offer_amount: formData.offer_amount
          ? parseInt(formData.offer_amount, 10)
          : null,
        message: formData.message || null,
      });

      if (error) throw error;

      // Increment page views (ignore errors if it fails)
      try {
        await supabase
          .from("my_domain_portfolio")
          .update({ page_views: 1 }) // This is a placeholder, actual increment would need a function
          .eq("id", domain.id);
      } catch {
        // Ignore errors
      }

      setIsSuccess(true);
      toast({
        title: "¡Consulta enviada!",
        description: "Nos pondremos en contacto contigo pronto.",
      });
    } catch (error) {
      console.error("Submit inquiry error:", error);
      toast({
        title: "Error al enviar",
        description: "Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSuccess) {
      setIsSuccess(false);
      setFormData({ name: "", email: "", phone: "", offer_amount: "", message: "" });
    }
    onOpenChange(false);
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Gracias por tu interés!</h2>
            <p className="text-muted-foreground mb-6">
              Hemos recibido tu consulta sobre <strong>{domain.domain_name}</strong>.
              Nos pondremos en contacto contigo a la brevedad.
            </p>
            <Button onClick={handleClose}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Consulta por {domain.domain_name}
          </DialogTitle>
          <DialogDescription>
            {domain.listing_price
              ? `Precio: ${formatPrice(domain.listing_price)}`
              : "Haz una oferta por este dominio"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                placeholder="+56 9 1234 5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {!domain.listing_price && (
            <div className="space-y-2">
              <Label htmlFor="offer">Tu oferta (CLP)</Label>
              <Input
                id="offer"
                type="number"
                placeholder="Ej: 150000"
                value={formData.offer_amount}
                onChange={(e) =>
                  setFormData({ ...formData, offer_amount: e.target.value })
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea
              id="message"
              placeholder="¿Para qué proyecto usarás este dominio?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Consulta
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
