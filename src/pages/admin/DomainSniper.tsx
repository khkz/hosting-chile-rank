import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OpportunitiesTable } from "@/components/domain-sniper/OpportunitiesTable";
import { PortfolioList } from "@/components/domain-sniper/PortfolioList";
import { InquiriesList } from "@/components/domain-sniper/InquiriesList";
import { SniperSettings } from "@/components/domain-sniper/SniperSettings";
import {
  Crosshair,
  Briefcase,
  MessageSquare,
  Settings,
  Plus,
  TrendingUp,
  Eye,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DomainSniper() {
  const { role, loading } = useAuth();
  const { toast } = useToast();
  const [newDomain, setNewDomain] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Stats query
  const { data: stats } = useQuery({
    queryKey: ["domain-sniper-stats"],
    queryFn: async () => {
      const [opportunities, portfolio, inquiries] = await Promise.all([
        supabase.from("domain_opportunities").select("id, status, ai_score"),
        supabase.from("my_domain_portfolio").select("id"),
        supabase.from("domain_inquiries").select("id, status"),
      ]);

      const opps = opportunities.data || [];
      const pending = opps.filter((o) => o.status === "pending_analysis").length;
      const highScore = opps.filter((o) => o.ai_score && o.ai_score >= 8).length;
      const newInquiries = (inquiries.data || []).filter((i) => i.status === "new").length;

      return {
        totalOpportunities: opps.length,
        pendingAnalysis: pending,
        highScoreDomains: highScore,
        portfolioCount: portfolio.data?.length || 0,
        newInquiries,
      };
    },
  });

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;

    setIsAdding(true);
    try {
      // Extract TLD
      const parts = newDomain.split(".");
      const tld = parts.length > 1 ? `.${parts[parts.length - 1]}` : null;

      const { error } = await supabase.from("domain_opportunities").insert({
        domain_name: newDomain.toLowerCase().trim(),
        tld,
        source: "manual",
        status: "pending_analysis",
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Dominio duplicado",
            description: "Este dominio ya está en el radar",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Dominio agregado al radar" });
        setNewDomain("");
      }
    } catch (error) {
      console.error("Add domain error:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar el dominio",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Crosshair className="w-8 h-8 text-primary" />
              Domain Sniper
            </h1>
            <p className="text-muted-foreground mt-1">
              Detecta, analiza y compra dominios de alto valor
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="ejemplo.cl"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
              className="w-48"
            />
            <Button onClick={handleAddDomain} disabled={isAdding}>
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">En Radar</p>
                <p className="text-2xl font-bold">{stats?.totalOpportunities ?? 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{stats?.pendingAnalysis ?? 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Score ≥8</p>
                <p className="text-2xl font-bold">{stats?.highScoreDomains ?? 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">En Cartera</p>
                <p className="text-2xl font-bold">{stats?.portfolioCount ?? 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Consultas Nuevas</p>
                <p className="text-2xl font-bold">{stats?.newInquiries ?? 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="radar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="radar" className="gap-2">
              <Crosshair className="w-4 h-4" />
              <span className="hidden sm:inline">Radar</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Cartera</span>
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Consultas</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="radar" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Crosshair className="w-5 h-5" />
                Radar de Oportunidades
              </h2>
              <OpportunitiesTable />
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Mi Cartera de Dominios
              </h2>
              <PortfolioList />
            </Card>
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Consultas de Compradores
              </h2>
              <InquiriesList />
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SniperSettings />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
