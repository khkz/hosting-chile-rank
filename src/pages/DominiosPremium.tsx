import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DomainGrid } from "@/components/domain-marketplace/DomainGrid";
import { DomainFilters } from "@/components/domain-marketplace/DomainFilters";
import { MarketplaceFAQ } from "@/components/domain-marketplace/MarketplaceFAQ";
import { Badge } from "@/components/ui/badge";
import { Globe, Sparkles, Shield, Zap } from "lucide-react";
import { Helmet } from "react-helmet";

export default function DominiosPremium() {
  const [tldFilter, setTldFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: domains, isLoading } = useQuery({
    queryKey: ["marketplace-domains"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("my_domain_portfolio")
        .select("*")
        .eq("is_for_sale", true)
        .order("listing_price", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Filter domains
  const filteredDomains = domains?.filter((domain) => {
    // TLD filter
    if (tldFilter !== "all" && domain.tld !== tldFilter) return false;
    
    // Price filter
    const price = domain.listing_price || 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    
    // Search filter
    if (searchQuery && !domain.domain_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get unique TLDs for filter
  const availableTlds = [...new Set(domains?.map((d) => d.tld).filter(Boolean) || [])];

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

      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navbar />

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Dominios Exclusivos
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Dominios Premium para tu
                <span className="text-primary"> Negocio</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Encuentra el nombre perfecto para tu marca. Dominios únicos,
                memorables y listos para usar.
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Transferencia Inmediata</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Compra Segura</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Soporte 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 -mt-8">
          <DomainFilters
            tldFilter={tldFilter}
            onTldChange={setTldFilter}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            availableTlds={availableTlds as string[]}
          />
        </section>

        {/* Domain Grid */}
        <section className="container mx-auto px-4 py-12">
          <DomainGrid domains={filteredDomains || []} isLoading={isLoading} />
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-12">
          <MarketplaceFAQ />
        </section>

        <Footer />
      </div>
    </>
  );
}
