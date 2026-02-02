import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Eye, MessageSquare, Calendar, DollarSign, Save, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

type DomainSaleStatus = "available" | "negotiating" | "sold" | "not_for_sale";

interface PortfolioDomain {
  id: string;
  domain_name: string;
  tld: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  renewal_date: string | null;
  listing_price: number | null;
  is_for_sale: boolean;
  sale_status: DomainSaleStatus;
  page_views: number;
  inquiries_count: number;
  notes: string | null;
}

const saleStatusLabels: Record<DomainSaleStatus, string> = {
  available: "Disponible",
  negotiating: "Negociando",
  sold: "Vendido",
  not_for_sale: "No en venta",
};

export function PortfolioList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");

  const { data: domains, isLoading } = useQuery({
    queryKey: ["domain-portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("my_domain_portfolio")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PortfolioDomain[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<PortfolioDomain>;
    }) => {
      const { error } = await supabase
        .from("my_domain_portfolio")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domain-portfolio"] });
      toast({ title: "Dominio actualizado" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el dominio",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleToggleForSale = (id: string, currentValue: boolean) => {
    updateMutation.mutate({
      id,
      updates: {
        is_for_sale: !currentValue,
        sale_status: !currentValue ? ("available" as DomainSaleStatus) : ("not_for_sale" as DomainSaleStatus),
      },
    });
  };

  const handleSavePrice = (id: string) => {
    const price = parseInt(editPrice, 10);
    if (isNaN(price) || price < 0) {
      toast({
        title: "Precio inválido",
        description: "Ingresa un precio válido",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate({
      id,
      updates: { listing_price: price },
    });
    setEditingId(null);
    setEditPrice("");
  };

  const startEditing = (id: string, currentPrice: number | null) => {
    setEditingId(id);
    setEditPrice(currentPrice?.toString() || "");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (!domains?.length) {
    return (
      <div className="text-center py-12">
        <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Sin dominios en tu cartera</h3>
        <p className="text-muted-foreground">
          Los dominios que compres aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {domains.map((domain) => (
        <Card key={domain.id} className="p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg">{domain.domain_name}</h3>
              <Badge
                variant={domain.is_for_sale ? "default" : "outline"}
                className="mt-1"
              >
                {saleStatusLabels[domain.sale_status]}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">En venta</span>
              <Switch
                checked={domain.is_for_sale}
                onCheckedChange={() =>
                  handleToggleForSale(domain.id, domain.is_for_sale)
                }
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Precio de venta:
              </span>
              {editingId === domain.id ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-24 h-8 text-right"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSavePrice(domain.id)}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="link"
                  className="h-auto p-0"
                  onClick={() => startEditing(domain.id, domain.listing_price)}
                >
                  {domain.listing_price
                    ? formatCurrency(domain.listing_price)
                    : "Establecer precio"}
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Renovación:
              </span>
              <span>
                {domain.renewal_date
                  ? format(new Date(domain.renewal_date), "dd MMM yyyy", {
                      locale: es,
                    })
                  : "-"}
              </span>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{domain.page_views}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span>{domain.inquiries_count}</span>
              </div>
              {domain.purchase_price && (
                <div className="ml-auto text-muted-foreground">
                  Costo: {formatCurrency(domain.purchase_price)}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
