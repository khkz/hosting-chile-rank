import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, RefreshCw, ExternalLink, AlertTriangle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

interface SubRow { id: string; plan: string; status: string; domains_quota: number; keywords_quota: number; audit_frequency: string; }
interface DomainRow { id: string; domain: string; current_score: number | null; last_audited_at: string | null; }
interface AuditRow { id: string; domain: string; status: string; score_total: number | null; created_at: string; report_data: any; }
interface IssueRow { id: string; severity: string; category: string; title: string; recommendation: string; }

const SEV_STYLES: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-blue-500 text-white",
  info: "bg-muted text-muted-foreground",
};

export default function SeoDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<SubRow | null>(null);
  const [domains, setDomains] = useState<DomainRow[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [audits, setAudits] = useState<AuditRow[]>([]);
  const [issues, setIssues] = useState<IssueRow[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [running, setRunning] = useState(false);

  const loadAll = async () => {
    if (!user) return;
    setLoading(true);
    const { data: subs } = await supabase
      .from("seo_audit_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);
    setSub(subs?.[0] ?? null);

    const { data: ds } = await supabase
      .from("seo_audit_domains")
      .select("id, domain, current_score, last_audited_at")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    setDomains(ds ?? []);
    if (ds?.[0] && !selectedDomain) setSelectedDomain(ds[0].id);
    setLoading(false);
  };

  const loadAudits = async (domainId: string) => {
    const { data } = await supabase
      .from("seo_audits")
      .select("id, domain, status, score_total, created_at, report_data")
      .eq("domain_id", domainId)
      .eq("is_mini", false)
      .order("created_at", { ascending: false })
      .limit(20);
    setAudits((data ?? []) as AuditRow[]);
    if (data?.[0]) {
      const { data: iss } = await supabase
        .from("seo_audit_issues")
        .select("id, severity, category, title, recommendation")
        .eq("audit_id", data[0].id)
        .order("severity");
      setIssues((iss ?? []) as IssueRow[]);
    } else {
      setIssues([]);
    }
  };

  useEffect(() => { loadAll(); }, [user]);
  useEffect(() => { if (selectedDomain) loadAudits(selectedDomain); }, [selectedDomain]);

  const startTrial = async () => {
    if (!user) return;
    const { error } = await supabase.from("seo_audit_subscriptions").insert({
      user_id: user.id,
      plan: "starter",
      status: "trialing",
      domains_quota: 1,
      keywords_quota: 50,
      audit_frequency: "monthly",
      trial_ends_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Prueba activada", description: "14 días gratis con plan Starter" });
    loadAll();
  };

  const addDomain = async () => {
    if (!sub || !user || !newDomain.trim()) return;
    if (domains.length >= sub.domains_quota) {
      toast({ title: "Cuota alcanzada", description: `Tu plan ${sub.plan} permite ${sub.domains_quota} dominio(s). Haz upgrade.`, variant: "destructive" });
      return;
    }
    const clean = newDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
    const { error } = await supabase.from("seo_audit_domains").insert({
      user_id: user.id,
      subscription_id: sub.id,
      domain: clean,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setNewDomain("");
    toast({ title: "Dominio añadido" });
    loadAll();
  };

  const runAudit = async () => {
    const selected = domains.find((d) => d.id === selectedDomain);
    if (!selected) return;
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("seo-audit-full", { body: { domain: selected.domain } });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Error en auditoría");
      toast({ title: "Auditoría completada", description: `Score ${data.scores.total}/100 · ${data.issues_count} problemas detectados` });
      loadAudits(selected.id);
      loadAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!sub) {
    return (
      <div>
        <Navbar />
        <div className="container max-w-2xl mx-auto p-8 pt-20">
          <Card>
            <CardHeader>
              <CardTitle>Activa tu prueba SEO Audit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">No tienes una suscripción activa. Comienza con 14 días gratis del plan Starter.</p>
              <div className="flex gap-3">
                <Button onClick={startTrial}>Activar prueba 14 días</Button>
                <Button variant="outline" asChild><Link to="/seo-audit">Ver planes</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const lastAudit = audits[0];

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <div className="container max-w-7xl mx-auto p-4 md:p-8 pt-20 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Dashboard SEO</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Plan <Badge variant="secondary">{sub.plan}</Badge> · {domains.length}/{sub.domains_quota} dominios · Auditoría {sub.audit_frequency}
            </p>
          </div>
          <Button asChild variant="outline" size="sm"><Link to="/seo-audit">Cambiar plan</Link></Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mis dominios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input placeholder="tudominio.cl" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} disabled={domains.length >= sub.domains_quota} />
              <Button onClick={addDomain} disabled={domains.length >= sub.domains_quota}><Plus className="w-4 h-4 mr-1" /> Añadir</Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {domains.map((d) => (
                <button key={d.id} onClick={() => setSelectedDomain(d.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${selectedDomain === d.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <div className="font-semibold truncate">{d.domain}</div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-muted-foreground">{d.last_audited_at ? `Auditado ${new Date(d.last_audited_at).toLocaleDateString()}` : "Sin auditar"}</span>
                    {d.current_score != null && <Badge variant={d.current_score >= 70 ? "default" : "destructive"}>{d.current_score}</Badge>}
                  </div>
                </button>
              ))}
              {domains.length === 0 && <p className="text-muted-foreground text-sm col-span-full">Añade tu primer dominio para comenzar.</p>}
            </div>
          </CardContent>
        </Card>

        {selectedDomain && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Auditoría · {domains.find((d) => d.id === selectedDomain)?.domain}</CardTitle>
              <Button onClick={runAudit} disabled={running} size="sm">
                {running ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1" />}
                Ejecutar audit ahora
              </Button>
            </CardHeader>
            <CardContent>
              {!lastAudit ? (
                <p className="text-muted-foreground text-sm">Aún no se ha ejecutado una auditoría. Pulsa "Ejecutar audit ahora".</p>
              ) : (
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
                    <TabsTrigger value="keywords">Keywords</TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      {["total", "technical", "content", "backlinks", "ux", "serp"].map((k) => {
                        const v = k === "total" ? lastAudit.score_total : lastAudit.report_data?.scores?.[k];
                        return (
                          <Card key={k}><CardContent className="p-4 text-center"><div className="text-xs text-muted-foreground uppercase">{k}</div><div className="text-3xl font-bold mt-1">{v ?? "-"}</div></CardContent></Card>
                        );
                      })}
                    </div>
                    {lastAudit.report_data?.performance && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted/40 rounded-lg">
                        <div><div className="text-xs text-muted-foreground">Performance</div><div className="text-2xl font-bold">{lastAudit.report_data.performance.performance}</div></div>
                        <div><div className="text-xs text-muted-foreground">LCP</div><div className="text-2xl font-bold">{(lastAudit.report_data.performance.lcp_ms / 1000).toFixed(1)}s</div></div>
                        <div><div className="text-xs text-muted-foreground">CLS</div><div className="text-2xl font-bold">{lastAudit.report_data.performance.cls}</div></div>
                        <div><div className="text-xs text-muted-foreground">SEO</div><div className="text-2xl font-bold">{lastAudit.report_data.performance.seo}</div></div>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="issues" className="mt-4 space-y-2">
                    {issues.map((i) => (
                      <div key={i.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Badge className={SEV_STYLES[i.severity]}>{i.severity}</Badge>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{i.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{i.recommendation}</div>
                          <Badge variant="outline" className="mt-2 text-xs">{i.category}</Badge>
                        </div>
                      </div>
                    ))}
                    {issues.length === 0 && <p className="text-muted-foreground text-sm">Sin issues. ¡Excelente!</p>}
                  </TabsContent>
                  <TabsContent value="keywords" className="mt-4">
                    {lastAudit.report_data?.keywords?.top?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-left text-xs text-muted-foreground border-b">
                            <tr><th className="py-2 pr-4">Keyword</th><th className="py-2 pr-4">Pos.</th><th className="py-2 pr-4">Volumen</th><th className="py-2 pr-4">CPC</th><th className="py-2 pr-4">Dif.</th><th className="py-2">URL</th></tr>
                          </thead>
                          <tbody>
                            {lastAudit.report_data.keywords.top.slice(0, 50).map((k: any, i: number) => (
                              <tr key={i} className="border-b last:border-0">
                                <td className="py-2 pr-4 font-medium">{k.keyword}</td>
                                <td className="py-2 pr-4"><Badge variant={k.position <= 10 ? "default" : "outline"}>#{k.position}</Badge></td>
                                <td className="py-2 pr-4">{k.search_volume?.toLocaleString() ?? "-"}</td>
                                <td className="py-2 pr-4">${k.cpc?.toFixed(2) ?? "-"}</td>
                                <td className="py-2 pr-4">{k.difficulty ?? "-"}</td>
                                <td className="py-2"><a href={k.url} target="_blank" rel="noopener" className="text-primary inline-flex items-center gap-1 text-xs"><ExternalLink className="w-3 h-3" /></a></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : <p className="text-muted-foreground text-sm">Sin keywords (requiere DataForSEO configurado).</p>}
                  </TabsContent>
                  <TabsContent value="history" className="mt-4 space-y-2">
                    {audits.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="text-sm">{new Date(a.created_at).toLocaleString()}</div>
                          <Badge variant="outline" className="text-xs mt-1">{a.status}</Badge>
                        </div>
                        <div className="text-2xl font-bold">{a.score_total ?? "-"}</div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
