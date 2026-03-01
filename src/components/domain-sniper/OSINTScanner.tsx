import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Search, Save, Shield, ShieldAlert, Building2, Globe, DollarSign, FileText,
  AlertTriangle, CheckCircle2, XCircle, Users, MapPin, Phone, Mail,
  Zap, RefreshCw
} from "lucide-react";

interface ScraperData {
  mission_statement: string | null;
  description_seo: string | null;
  cheapest_plan_clp: number | null;
  plans: { name: string; price_clp: number; storage: string; bandwidth: string; domains: number }[];
  contact_phone: string | null;
  contact_email: string | null;
  contact_address: string | null;
  social_media: Record<string, string> | null;
  technologies: string[] | null;
  datacenter_location: string | null;
  team_info: string | null;
  rut_detected: string | null;
  years_experience: number | null;
  total_clients: number | null;
  uptime_guarantee: string | null;
  has_ssl_free: boolean | null;
  has_migration_free: boolean | null;
  payment_methods: string[] | null;
}

interface ComplaintsData {
  has_complaints: boolean;
  complaint_count: number;
  severity: "none" | "low" | "medium" | "high" | "critical";
  summary: string;
  main_issues: string[];
  sentiment_score: number;
  recent_complaints: boolean;
  response_rate: string;
}

interface OsintData {
  legal_name: string | null;
  foundation_year: number | null;
  ip: string | null;
  asn_number: number | null;
  asn_name: string | null;
  suggest_is_independent: boolean;
  suggest_corporate_group: string | null;
  scraper: ScraperData | null;
  complaints: ComplaintsData | null;
}

type ScanPhase = "idle" | "scanning" | "done" | "error";

const SEVERITY_CONFIG = {
  none: { color: "bg-green-500/10 text-green-700 border-green-500/30", icon: CheckCircle2, label: "Sin reclamos" },
  low: { color: "bg-blue-500/10 text-blue-700 border-blue-500/30", icon: CheckCircle2, label: "Baja" },
  medium: { color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30", icon: AlertTriangle, label: "Media" },
  high: { color: "bg-orange-500/10 text-orange-700 border-orange-500/30", icon: AlertTriangle, label: "Alta" },
  critical: { color: "bg-red-500/10 text-red-700 border-red-500/30", icon: XCircle, label: "Crítica" },
};

const OSINTScanner = () => {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [data, setData] = useState<OsintData | null>(null);
  const [editData, setEditData] = useState<OsintData | null>(null);
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState("");
  const [scanProgress, setScanProgress] = useState<string[]>([]);

  // Batch mode
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState("");
  const [batchResults, setBatchResults] = useState<{ name: string; status: "success" | "blocked" | "error"; pages?: number }[]>([]);

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
    setScanProgress([]);

    const domain = extractDomain(url);
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const companyName = domain.split(".")[0];

    try {
      setScanProgress(["🔎 Consultando registro NIC Chile..."]);

      // Phase 1: WHOIS + ASN + AI Scraper (parallel)
      const [whoisRes, asnRes, scraperRes] = await Promise.all([
        supabase.functions.invoke("whois-lookup", {
          body: { domain, mode: "osint" },
        }),
        supabase.functions.invoke("asn-proxy", {
          body: { domain, mode: "monopoly" },
        }),
        (async () => {
          setScanProgress(p => [...p, "🌐 Trazando rutas BGP y detectando ASN..."]);
          setScanProgress(p => [...p, "🤖 Analizando web con IA (homepage, planes, nosotros, contacto)..."]);
          return supabase.functions.invoke("ai-web-scraper", {
            body: { url: fullUrl, mode: "full" },
          });
        })(),
      ]);

      setScanProgress(p => [...p, "⚖️ Verificando reclamos en reclamos.cl y SERNAC..."]);

      // Phase 2: Complaints (after we have the company name)
      const complaintsRes = await supabase.functions.invoke("complaints-checker", {
        body: { company_name: companyName, domain },
      });

      const whois = whoisRes.data || {};
      const asn = asnRes.data || {};
      const scraper = scraperRes.data || {};
      const complaints = complaintsRes.data || {};

      const result: OsintData = {
        legal_name: whois.legal_name || scraper.rut_detected ? `${whois.legal_name || ''} ${scraper.rut_detected ? `(RUT: ${scraper.rut_detected})` : ''}`.trim() : null,
        foundation_year: whois.foundation_year || (scraper.years_experience ? new Date().getFullYear() - scraper.years_experience : null),
        ip: asn.ip || null,
        asn_number: asn.asn_number || null,
        asn_name: asn.asn_name || null,
        suggest_is_independent: asn.suggest_is_independent ?? true,
        suggest_corporate_group: asn.suggest_corporate_group || null,
        scraper: {
          mission_statement: scraper.mission_statement || null,
          description_seo: scraper.description_seo || null,
          cheapest_plan_clp: scraper.cheapest_plan_clp || null,
          plans: scraper.plans || [],
          contact_phone: scraper.contact_phone || null,
          contact_email: scraper.contact_email || null,
          contact_address: scraper.contact_address || null,
          social_media: scraper.social_media || null,
          technologies: scraper.technologies || null,
          datacenter_location: scraper.datacenter_location || null,
          team_info: scraper.team_info || null,
          rut_detected: scraper.rut_detected || null,
          years_experience: scraper.years_experience || null,
          total_clients: scraper.total_clients || null,
          uptime_guarantee: scraper.uptime_guarantee || null,
          has_ssl_free: scraper.has_ssl_free || null,
          has_migration_free: scraper.has_migration_free || null,
          payment_methods: scraper.payment_methods || null,
        },
        complaints: complaints.success ? {
          has_complaints: complaints.has_complaints || false,
          complaint_count: complaints.complaint_count || 0,
          severity: complaints.severity || "none",
          summary: complaints.summary || "",
          main_issues: complaints.main_issues || [],
          sentiment_score: complaints.sentiment_score || 5,
          recent_complaints: complaints.recent_complaints || false,
          response_rate: complaints.response_rate || "sin datos",
        } : null,
      };

      setData(result);
      setEditData({ ...result });
      setSlug(domain.replace(/\./g, "").replace(/[^a-z0-9-]/gi, "").toLowerCase());
      setPhase("done");
      setScanProgress(p => [...p, "✅ Auditoría OSINT completa — 4 fuentes cruzadas"]);
      toast.success("Auditoría OSINT completa con 4 fuentes");
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
      const s = editData.scraper;

      // Upsert company
      const { data: companyData, error } = await supabase
        .from("hosting_companies")
        .upsert(
          {
            slug,
            name: `${capitalizedName}.cl`,
            legal_name: editData.legal_name,
            foundation_year: editData.foundation_year,
            is_independent: editData.suggest_is_independent,
            corporate_group: editData.suggest_corporate_group,
            description: s?.description_seo || s?.mission_statement || null,
            website: `https://${domain}`,
            contact_phone: s?.contact_phone || null,
            contact_email: s?.contact_email || null,
            contact_address: s?.contact_address || null,
            datacenter_location: s?.datacenter_location || null,
            technologies: s?.technologies || [],
            social_media: s?.social_media || {},
            is_verified: true,
            is_curated: true,
            curated_at: new Date().toISOString(),
            curation_notes: `OSINT auto-audit ${new Date().toISOString()}. Complaints: ${editData.complaints?.severity || 'N/A'}. Sources: WHOIS+ASN+AI+Reclamos.`,
          },
          { onConflict: "slug" }
        )
        .select()
        .single();

      if (error) throw error;

      // Upsert plans if available
      if (s?.plans && s.plans.length > 0 && companyData?.id) {
        for (let i = 0; i < s.plans.length; i++) {
          const plan = s.plans[i];
          await supabase
            .from("hosting_plans")
            .upsert(
              {
                company_id: companyData.id,
                name: plan.name || `Plan ${i + 1}`,
                price_monthly: plan.price_clp || null,
                storage_gb: plan.storage ? parseInt(plan.storage) || null : null,
                bandwidth: plan.bandwidth || null,
                domains_allowed: plan.domains || 1,
                display_order: i,
                is_active: true,
              },
              { onConflict: "company_id,name" as any }
            );
        }
      }

      toast.success(`✅ ${capitalizedName}.cl guardado con ${s?.plans?.length || 0} planes`);
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const runBatchAudit = async () => {
    setBatchRunning(true);
    setBatchResults([]);
    try {
      const { data: companies, error } = await supabase
        .from("hosting_companies")
        .select("id, slug, website, name")
        .eq("is_verified", true)
        .order("name");

      if (error) throw error;
      if (!companies || companies.length === 0) {
        toast.error("No hay empresas verificadas para auditar");
        return;
      }

      for (let i = 0; i < companies.length; i++) {
        const c = companies[i];
        setBatchProgress(`[${i + 1}/${companies.length}] Auditando ${c.name}...`);

        try {
          const domain = c.website?.replace(/^https?:\/\//, "").replace(/\/$/, "") || `${c.slug}.cl`;
          const fullUrl = c.website || `https://${c.slug}.cl`;

          const [scraperRes, complaintsRes] = await Promise.all([
            supabase.functions.invoke("ai-web-scraper", { body: { url: fullUrl, mode: "full" } }),
            supabase.functions.invoke("complaints-checker", { body: { company_name: c.name, domain } }),
          ]);

          const s = scraperRes.data || {};
          const comp = complaintsRes.data || {};

          // Insert into audit log instead of direct update
          await supabase
            .from("company_audit_log")
            .insert({
              company_id: c.id,
              scraped_data: s as any,
              complaints_data: comp as any,
              status: (s.success && s.pages_scraped > 0) ? 'pending' : 'blocked',
            } as any);

          if (s.success && s.pages_scraped > 0) {
            setBatchResults(prev => [...prev, { name: c.name, status: "success", pages: s.pages_scraped }]);
          } else {
            setBatchResults(prev => [...prev, { name: c.name, status: "blocked", pages: 0 }]);
          }

          await new Promise(r => setTimeout(r, 3000));
        } catch (e) {
          console.error(`Error auditing ${c.name}:`, e);
          setBatchResults(prev => [...prev, { name: c.name, status: "error" }]);
        }
      }

      const successCount = batchResults.filter(r => r.status === "success").length + 1; // approximate
      toast.success(`✅ Batch completo: ${companies.length} empresas procesadas`);
    } catch (err: any) {
      toast.error(err.message || "Error en batch");
    } finally {
      setBatchRunning(false);
      setBatchProgress("");
    }
  };

  const severityConfig = editData?.complaints?.severity
    ? SEVERITY_CONFIG[editData.complaints.severity]
    : SEVERITY_CONFIG.none;
  const SeverityIcon = severityConfig.icon;

  return (
    <Card className="border-2 border-dashed border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" />
            Escáner OSINT v2 — Auditoría Completa + Reclamos
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={runBatchAudit}
            disabled={batchRunning}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${batchRunning ? "animate-spin" : ""}`} />
            {batchRunning ? batchProgress || "Procesando..." : "⚡ Auditar Todo el Catálogo"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Batch Results */}
        {batchResults.length > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">Resultados del Batch</h4>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-600" /> {batchResults.filter(r => r.status === "success").length} OK</span>
                <span className="flex items-center gap-1"><ShieldAlert className="h-3 w-3 text-yellow-600" /> {batchResults.filter(r => r.status === "blocked").length} Bloqueados</span>
                <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-600" /> {batchResults.filter(r => r.status === "error").length} Error</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
              {batchResults.map((r, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded ${
                  r.status === "success" ? "bg-green-500/10 text-green-700" :
                  r.status === "blocked" ? "bg-yellow-500/10 text-yellow-700" :
                  "bg-red-500/10 text-red-700"
                }`}>
                  {r.status === "success" ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> :
                   r.status === "blocked" ? <ShieldAlert className="h-3.5 w-3.5 shrink-0" /> :
                   <XCircle className="h-3.5 w-3.5 shrink-0" />}
                  <span className="truncate font-medium">{r.name}</span>
                  {r.status === "success" && r.pages && <span className="ml-auto text-[10px] opacity-70">{r.pages}p</span>}
                  {r.status === "blocked" && <span className="ml-auto text-[10px] opacity-70">anti-bot</span>}
                </div>
              ))}
            </div>
          </div>
        )}

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
            🔍 Auditoría OSINT Completa
          </Button>
        </div>

        {/* Scanning state */}
        {phase === "scanning" && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            {scanProgress.map((msg, i) => (
              <div key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm">{msg}</span>
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
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
            {/* 4 Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileText className="h-4 w-4" /> WHOIS
                  </div>
                  <p className="font-semibold text-sm">{editData.legal_name || "No detectado"}</p>
                  <p className="text-xs text-muted-foreground">
                    Fundado: {editData.foundation_year || "N/D"}
                  </p>
                  {editData.scraper?.rut_detected && (
                    <Badge variant="outline" className="text-xs">RUT: {editData.scraper.rut_detected}</Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Globe className="h-4 w-4" /> ASN / BGP
                  </div>
                  <p className="font-semibold text-sm">
                    AS{editData.asn_number || "?"} — {editData.asn_name || "Desc."}
                  </p>
                  <p className="text-xs text-muted-foreground">IP: {editData.ip || "N/D"}</p>
                  <Badge variant={editData.suggest_is_independent ? "default" : "destructive"} className="text-xs">
                    {editData.suggest_is_independent ? "Independiente" : editData.suggest_corporate_group || "Conglomerado"}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <DollarSign className="h-4 w-4" /> IA Scraper
                  </div>
                  <p className="font-semibold text-sm">
                    {editData.scraper?.cheapest_plan_clp
                      ? `Desde $${editData.scraper.cheapest_plan_clp.toLocaleString("es-CL")}/mes`
                      : "Sin precio"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {editData.scraper?.plans?.length || 0} planes · {editData.scraper?.technologies?.length || 0} techs
                  </p>
                </CardContent>
              </Card>

              <Card className={`border ${severityConfig.color}`}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <SeverityIcon className="h-4 w-4" /> Reclamos
                  </div>
                  <p className="font-semibold text-sm">
                    {editData.complaints?.complaint_count || 0} reclamos · Severidad: {severityConfig.label}
                  </p>
                  <p className="text-xs">
                    Sentimiento: {editData.complaints?.sentiment_score || "N/D"}/10
                    {editData.complaints?.recent_complaints && (
                      <span className="text-destructive ml-2">⚠️ Recientes</span>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Complaints detail alert */}
            {editData.complaints?.has_complaints && (
              <div className={`p-4 rounded-lg border ${severityConfig.color}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Alerta de Reclamos — {editData.complaints.summary}</p>
                    {editData.complaints.main_issues.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editData.complaints.main_issues.map((issue, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{issue}</Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs">
                      Respuesta de empresa: <strong>{editData.complaints.response_rate}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Scraped info cards */}
            {editData.scraper && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {editData.scraper.contact_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {editData.scraper.contact_phone}
                  </div>
                )}
                {editData.scraper.contact_email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {editData.scraper.contact_email}
                  </div>
                )}
                {editData.scraper.contact_address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {editData.scraper.contact_address}
                  </div>
                )}
                {editData.scraper.total_clients && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {editData.scraper.total_clients.toLocaleString()} clientes
                  </div>
                )}
                {editData.scraper.uptime_guarantee && (
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    Uptime: {editData.scraper.uptime_guarantee}
                  </div>
                )}
                {editData.scraper.datacenter_location && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    DC: {editData.scraper.datacenter_location}
                  </div>
                )}
              </div>
            )}

            {/* Technologies */}
            {editData.scraper?.technologies && editData.scraper.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {editData.scraper.technologies.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                ))}
              </div>
            )}

            {/* Plans detected */}
            {editData.scraper?.plans && editData.scraper.plans.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Planes Detectados por IA</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {editData.scraper.plans.map((plan, i) => (
                    <Card key={i} className="bg-muted/30">
                      <CardContent className="pt-3 space-y-1">
                        <p className="font-medium text-sm">{plan.name}</p>
                        <p className="text-primary font-bold">
                          ${(plan.price_clp || 0).toLocaleString("es-CL")}/mes
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {plan.storage} · {plan.bandwidth} · {plan.domains} dom.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Team info */}
            {editData.scraper?.team_info && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium mb-1">👤 Información de Equipo/Dueños</p>
                <p className="text-sm text-muted-foreground">{editData.scraper.team_info}</p>
              </div>
            )}

            <Separator />

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
                    <Label>Razón Social</Label>
                    <Input
                      value={editData.legal_name || ""}
                      onChange={(e) => setEditData({ ...editData, legal_name: e.target.value || null })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Año de Fundación</Label>
                    <Input
                      type="number"
                      value={editData.foundation_year || ""}
                      onChange={(e) => setEditData({ ...editData, foundation_year: e.target.value ? parseInt(e.target.value) : null })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Grupo Corporativo</Label>
                    <Input
                      value={editData.suggest_corporate_group || ""}
                      onChange={(e) => setEditData({ ...editData, suggest_corporate_group: e.target.value || null })}
                      placeholder="Ninguno (independiente)"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Descripción SEO</Label>
                    <Textarea
                      value={editData.scraper?.description_seo || editData.scraper?.mission_statement || ""}
                      onChange={(e) => setEditData({
                        ...editData,
                        scraper: { ...editData.scraper!, description_seo: e.target.value || null },
                      })}
                      rows={3}
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
                  <Switch
                    checked={editData.suggest_is_independent}
                    onCheckedChange={(checked) => setEditData({ ...editData, suggest_is_independent: checked })}
                  />
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
