import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Save, Shield, ShieldAlert, Building2, Globe, DollarSign, FileText } from "lucide-react";

interface OsintData {
  // whois
  legal_name: string | null;
  foundation_year: number | null;
  // asn monopoly
  ip: string | null;
  asn_number: number | null;
  asn_name: string | null;
  suggest_is_independent: boolean;
  suggest_corporate_group: string | null;
  // ai scraper
  mission_statement: string | null;
  cheapest_plan_clp: number | null;
}

type ScanPhase = "idle" | "scanning" | "done" | "error";

const PHASE_MESSAGES = [
  "🔎 Consultando registro NIC Chile...",
  "🌐 Trazando rutas BGP y detectando ASN...",
  "🤖 Analizando semántica web con IA...",
];

const OSINTScanner = () => {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [data, setData] = useState<OsintData | null>(null);
  const [editData, setEditData] = useState<OsintData | null>(null);
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState("");

  const extractDomain = (input: string): string => {
    return input.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
  };

  const runScan = async () => {
    if (!url.trim()) {
      toast.error("Ingresa una URL para analizar");
      return;
    }

    setPhase("scanning");
    setData(null);
    setEditData(null);

    const domain = extractDomain(url);
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    try {
      const [whoisRes, asnRes, scraperRes] = await Promise.all([
        supabase.functions.invoke("whois-lookup", {
          body: { domain, mode: "osint" },
        }),
        supabase.functions.invoke("asn-proxy", {
          body: { domain, mode: "monopoly" },
        }),
        supabase.functions.invoke("ai-web-scraper", {
          body: { url: fullUrl },
        }),
      ]);

      const whois = whoisRes.data || {};
      const asn = asnRes.data || {};
      const scraper = scraperRes.data || {};

      const result: OsintData = {
        legal_name: whois.legal_name || null,
        foundation_year: whois.foundation_year || null,
        ip: asn.ip || null,
        asn_number: asn.asn_number || null,
        asn_name: asn.asn_name || null,
        suggest_is_independent: asn.suggest_is_independent ?? true,
        suggest_corporate_group: asn.suggest_corporate_group || null,
        mission_statement: scraper.mission_statement || null,
        cheapest_plan_clp: scraper.cheapest_plan_clp || null,
      };

      setData(result);
      setEditData({ ...result });
      setSlug(domain.replace(/\./g, "-").replace(/[^a-z0-9-]/gi, "").toLowerCase());
      setPhase("done");
      toast.success("Auditoría OSINT completada");
    } catch (err) {
      console.error("OSINT scan error:", err);
      setPhase("error");
      toast.error("Error durante la auditoría OSINT");
    }
  };

  const handleSave = async () => {
    if (!editData || !slug) return;

    setSaving(true);
    try {
      const domain = extractDomain(url);
      const name = domain.split(".")[0];
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      const { error } = await supabase
        .from("hosting_companies")
        .upsert(
          {
            slug,
            name: capitalizedName,
            legal_name: editData.legal_name,
            foundation_year: editData.foundation_year,
            is_independent: editData.suggest_is_independent,
            corporate_group: editData.suggest_corporate_group,
            description: editData.mission_statement,
            website: `https://${domain}`,
            is_verified: false,
            is_curated: true,
            curated_at: new Date().toISOString(),
          },
          { onConflict: "slug" }
        );

      if (error) throw error;

      toast.success(`✅ ${capitalizedName} guardado en hosting_companies`);
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5" />
          Escáner OSINT — Auditoría Automática de Proveedores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input */}
        <div className="flex gap-3">
          <Input
            placeholder="https://proveedor.cl o proveedor.cl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="text-lg h-12"
            onKeyDown={(e) => e.key === "Enter" && runScan()}
          />
          <Button
            onClick={runScan}
            disabled={phase === "scanning"}
            size="lg"
            className="h-12 px-6 whitespace-nowrap"
          >
            🔍 Ejecutar Auditoría OSINT Completa
          </Button>
        </div>

        {/* Scanning state */}
        {phase === "scanning" && (
          <div className="space-y-4 animate-pulse">
            {PHASE_MESSAGES.map((msg, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <span className="text-sm text-muted-foreground">{msg}</span>
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {phase === "error" && (
          <div className="text-center py-8 text-destructive">
            <p className="font-medium">Error durante la auditoría. Verifica la URL e intenta de nuevo.</p>
          </div>
        )}

        {/* Results */}
        {phase === "done" && editData && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileText className="h-4 w-4" /> WHOIS / NIC Chile
                  </div>
                  <p className="font-semibold text-sm">{editData.legal_name || "No detectado"}</p>
                  <p className="text-xs text-muted-foreground">
                    Fundado: {editData.foundation_year || "N/D"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Globe className="h-4 w-4" /> ASN / BGP
                  </div>
                  <p className="font-semibold text-sm">
                    AS{editData.asn_number || "?"} — {editData.asn_name || "Desconocido"}
                  </p>
                  <p className="text-xs text-muted-foreground">IP: {editData.ip || "N/D"}</p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <DollarSign className="h-4 w-4" /> IA / Web Scraper
                  </div>
                  <p className="font-semibold text-sm">
                    {editData.cheapest_plan_clp
                      ? `$${editData.cheapest_plan_clp.toLocaleString("es-CL")} CLP/mes`
                      : "No detectado"}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {editData.mission_statement || "Sin misión detectada"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Editable form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Datos para Aprobar — Revisión Humana
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Razón Social (legal_name)</Label>
                    <Input
                      value={editData.legal_name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, legal_name: e.target.value || null })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Año de Fundación</Label>
                    <Input
                      type="number"
                      value={editData.foundation_year || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          foundation_year: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug (hosting_companies)</Label>
                    <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Grupo Corporativo</Label>
                    <Input
                      value={editData.suggest_corporate_group || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          suggest_corporate_group: e.target.value || null,
                        })
                      }
                      placeholder="Ninguno (independiente)"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Misión / Descripción</Label>
                    <Input
                      value={editData.mission_statement || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, mission_statement: e.target.value || null })
                      }
                    />
                  </div>
                </div>

                {/* Independence toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {editData.suggest_is_independent ? (
                      <Shield className="h-5 w-5 text-primary" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium text-sm">Estado de Independencia</p>
                      <p className="text-xs text-muted-foreground">
                        {editData.suggest_is_independent
                          ? "Infraestructura propia / independiente"
                          : `Parte de: ${editData.suggest_corporate_group || "Grupo corporativo"}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={editData.suggest_is_independent ? "default" : "destructive"}
                    >
                      {editData.suggest_is_independent ? "Independiente" : "Conglomerado"}
                    </Badge>
                    <Switch
                      checked={editData.suggest_is_independent}
                      onCheckedChange={(checked) =>
                        setEditData({ ...editData, suggest_is_independent: checked })
                      }
                    />
                  </div>
                </div>

                {/* Save button */}
                <Button
                  onClick={handleSave}
                  disabled={saving || !slug}
                  size="lg"
                  className="w-full h-12 text-base"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {saving ? "Guardando..." : "💾 Aprobar y Guardar en Base de Datos"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OSINTScanner;
