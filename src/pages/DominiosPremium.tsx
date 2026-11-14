import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/system/PageHeader";
import Section from "@/components/system/Section";
import { DomainGrid } from "@/components/domain-marketplace/DomainGrid";
import { DomainFilters } from "@/components/domain-marketplace/DomainFilters";
import { MarketplaceFAQ } from "@/components/domain-marketplace/MarketplaceFAQ";
import { Globe, Shield, Headset } from "lucide-react";
import { Helmet } from "react-helmet-async";

const MAX_PRICE = 10000000;

export default function DominiosPremium() {
  const [tldFilter, setTldFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: domains, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketplace-domains"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("my_domain_portfolio")
        .select("id,domain_name,tld,listing_price,is_for_sale,sale_status,page_views,inquiries_count,created_at")
        .eq("is_for_sale", true)
        .order("listing_price", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const filteredDomains = domains?.filter((domain) => {
    if (tldFilter !== "all" && domain.tld !== tldFilter) return false;
    const price = domain.listing_price || 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    if (searchQuery && !domain.domain_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const availableTlds = [...new Set(domains?.map((d) => d.tld).filter(Boolean) || [])];
  const hasFilters = tldFilter !== "all" || priceRange[0] > 0 || priceRange[1] < MAX_PRICE || searchQuery.trim() !== "";
  const clearFilters = () => {
    setTldFilter("all");
    setPriceRange([0, MAX_PRICE]);
    setSearchQuery("");
  };

  return (
    <>
      <Helmet>
        <title>Dominios Premium Chile | Compra Nombres de Dominio Únicos</title>
        <meta
          name="description"
          content="Encuentra dominios premium .cl y .com para tu negocio. Nombres únicos, memorables y con alto potencial comercial. Compra segura y transferencia inmediata."
        />
        <meta
          name="keywords"
          content="dominios premium chile, comprar dominio .cl, nombres de dominio, dominios para empresas, dominios pyme"
        />
        <link rel="canonical" href="https://eligetuhosting.cl/dominios-premium" />
      </Helmet>

      <div className="min-h-screen bg-white text-ink">
        <Navbar />

        <main>
          <PageHeader
            title="Dominios Premium para tu Negocio"
            lead="Encuentra el nombre perfecto para tu marca. Dominios únicos, memorables y listos para usar."
            meta={
              <>
                <span className="inline-flex items-center gap-1.5"><Globe aria-hidden className="h-4 w-4 text-ink-2" />Transferencia inmediata</span>
                <span className="inline-flex items-center gap-1.5"><Shield aria-hidden className="h-4 w-4 text-ink-2" />Compra segura</span>
                <span className="inline-flex items-center gap-1.5"><Headset aria-hidden className="h-4 w-4 text-ink-2" />Soporte 24/7</span>
              </>
            }
          />

          <Section title="Dominios en venta" density="tight">
            <DomainFilters
              tldFilter={tldFilter}
              onTldChange={setTldFilter}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              availableTlds={availableTlds as string[]}
            />
            <div className="mt-8">
              <DomainGrid
                domains={filteredDomains || []}
                isLoading={isLoading}
                isError={isError}
                onRetry={() => refetch()}
                hasFilters={hasFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </Section>

          <Section tone="paper" density="tight" aria-label="Preguntas frecuentes">
            <MarketplaceFAQ />
          </Section>
        </main>

        <Footer />
      </div>
    </>
  );
}
