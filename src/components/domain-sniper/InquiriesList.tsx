import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Mail, Phone, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

type InquiryStatus = "new" | "contacted" | "negotiating" | "closed" | "rejected";

interface DomainInquiry {
  id: string;
  domain_id: string;
  name: string | null;
  email: string;
  phone: string | null;
  offer_amount: number | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
  my_domain_portfolio?: {
    domain_name: string;
  };
}

const statusConfig: Record<InquiryStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "Nuevo", variant: "default" },
  contacted: { label: "Contactado", variant: "secondary" },
  negotiating: { label: "Negociando", variant: "default" },
  closed: { label: "Cerrado", variant: "outline" },
  rejected: { label: "Rechazado", variant: "destructive" },
};

export function InquiriesList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ["domain-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domain_inquiries")
        .select(`
          *,
          my_domain_portfolio (
            domain_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DomainInquiry[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InquiryStatus }) => {
      const { error } = await supabase
        .from("domain_inquiries")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domain-inquiries"] });
      toast({ title: "Estado actualizado" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!inquiries?.length) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Sin consultas</h3>
        <p className="text-muted-foreground">
          Las consultas de compradores interesados aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dominio</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Oferta</TableHead>
            <TableHead>Mensaje</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((inquiry) => {
            const status = statusConfig[inquiry.status];
            return (
              <TableRow key={inquiry.id}>
                <TableCell className="font-medium">
                  {inquiry.my_domain_portfolio?.domain_name || "-"}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{inquiry.name || "Anónimo"}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {inquiry.email}
                    </div>
                    {inquiry.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {inquiry.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {inquiry.offer_amount ? (
                    <span className="font-medium text-green-600">
                      {formatCurrency(inquiry.offer_amount)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Sin oferta</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-muted-foreground truncate">
                    {inquiry.message || "-"}
                  </p>
                </TableCell>
                <TableCell>
                  <Select
                    value={inquiry.status}
                    onValueChange={(value) =>
                      updateStatusMutation.mutate({
                        id: inquiry.id,
                        status: value as InquiryStatus,
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(inquiry.created_at), "dd MMM yyyy", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`mailto:${inquiry.email}`, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
