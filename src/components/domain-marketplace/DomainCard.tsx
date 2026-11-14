import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InquiryDialog } from "./InquiryDialog";
import { formatMoney } from "@/lib/format";

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
  const isPremium = (domain.listing_price || 0) >= 500000;

  return (
    <>
      <Card className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="t-h3 min-w-0 break-all text-ink">{domain.domain_name}</h3>
          {isPremium && <Badge variant="outline">Premium</Badge>}
        </div>
        {domain.tld && <p className="t-meta mt-1">Extensión {domain.tld}</p>}

        <div className="mt-4 border-t border-rule pt-3">
          <p className="t-label">Precio</p>
          <p className="tabular mt-0.5 text-2xl font-bold text-ink">
            {domain.listing_price ? formatMoney(domain.listing_price, "CLP") : "Consultar"}
          </p>
        </div>

        <Button className="mt-5 w-full" variant="default" onClick={() => setShowInquiry(true)}>
          {domain.listing_price ? "Comprar" : "Hacer una oferta"}
          <span className="sr-only"> {domain.domain_name}</span>
        </Button>
      </Card>

      <InquiryDialog open={showInquiry} onOpenChange={setShowInquiry} domain={domain} />
    </>
  );
}
