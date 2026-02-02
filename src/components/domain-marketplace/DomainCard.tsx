import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InquiryDialog } from "./InquiryDialog";
import { Globe, ArrowRight, Sparkles } from "lucide-react";

interface Domain {
  id: string;
  domain_name: string;
  tld: string | null;
  listing_price: number | null;
}

interface DomainCardProps {
  domain: Domain;
}

export function DomainCard({ domain }: DomainCardProps) {
  const [showInquiry, setShowInquiry] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isPremium = (domain.listing_price || 0) >= 500000;

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {isPremium && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                {domain.domain_name}
              </h3>
              {domain.tld && (
                <Badge variant="outline" className="text-xs">
                  {domain.tld}
                </Badge>
              )}
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-1">Precio</p>
            <p className="text-2xl font-bold text-primary">
              {domain.listing_price
                ? formatPrice(domain.listing_price)
                : "Consultar"}
            </p>
          </div>

          <Button
            className="w-full group-hover:bg-primary"
            onClick={() => setShowInquiry(true)}
          >
            {domain.listing_price ? "Comprar" : "Hacer Oferta"}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>

      <InquiryDialog
        open={showInquiry}
        onOpenChange={setShowInquiry}
        domain={domain}
      />
    </>
  );
}
