// Verificación técnica automática para proveedores LATAM.
// Para cada proveedor LATAM (PE/MX/CO/AR, is_verified=true, website not null):
//   - resuelve IP via Google DNS-over-HTTPS
//   - obtiene ASN + org via bgpview.io
//   - obtiene certificado SSL (emisor + vigencia) via ssl-checker.io
//   - mide TTFB haciendo un GET real al sitio
// Guarda un snapshot en latam_site_checks y devuelve el resumen.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return await Promise.race([
    p.catch(() => null as any),
    new Promise<T | null>((res) => setTimeout(() => res(null), ms)),
  ]);
}

async function resolveIP(hostname: string): Promise<string | null> {
  const r = await withTimeout(
    fetch(`https://dns.google/resolve?name=${hostname}&type=A`).then((x) => x.json()),
    5000,
  );
  const ans = r?.Answer?.find((a: any) => a.type === 1);
  return ans?.data ?? null;
}

async function getAsn(ip: string): Promise<{ asn: string | null; asn_org: string | null }> {
  // Primary: ipapi.co (free tier, returns org+asn)
  const r: any = await withTimeout(
    fetch(`https://ipapi.co/${ip}/json/`).then((x) => x.json()),
    7000,
  );
  if (r?.asn) {
    return { asn: r.asn, asn_org: r.org ?? null };
  }
  // Fallback: bgpview
  const b: any = await withTimeout(
    fetch(`https://api.bgpview.io/ip/${ip}`).then((x) => x.json()),
    7000,
  );
  const p = b?.data?.prefixes?.[0];
  return {
    asn: p?.asn?.asn ? `AS${p.asn.asn}` : null,
    asn_org: p?.asn?.description ?? p?.asn?.name ?? null,
  };
}

async function getSsl(hostname: string): Promise<{ issuer: string | null; from: string | null; to: string | null }> {
  // Usa Deno.connectTls para obtener certificado directamente del sitio.
  try {
    const conn: any = await Deno.connectTls({ hostname, port: 443 });
    // @ts-ignore - handshake() may return { peerCertificates? }
    const info = typeof conn.handshake === 'function' ? await conn.handshake() : null;
    let issuer: string | null = null, from: string | null = null, to: string | null = null;
    const certs = info?.peerCertificates ?? [];
    if (certs.length > 0) {
      const c = certs[0];
      issuer = c.issuer?.commonName ?? c.issuer?.organizationName ?? null;
      from = c.notBefore ? new Date(c.notBefore).toISOString() : null;
      to = c.notAfter ? new Date(c.notAfter).toISOString() : null;
    }
    try { conn.close(); } catch { /* ignore */ }
    if (issuer || to) return { issuer, from, to };
  } catch { /* fall through */ }
  // Fallback: crt.sh
  const r: any = await withTimeout(
    fetch(`https://crt.sh/?q=${hostname}&output=json&exclude=expired`).then((x) => x.json()),
    9000,
  );
  if (Array.isArray(r) && r.length > 0) {
    const latest = r.sort((a: any, b: any) => new Date(b.not_before).getTime() - new Date(a.not_before).getTime())[0];
    return {
      issuer: latest.issuer_name?.split(',').find((s: string) => s.startsWith('O='))?.slice(2) ?? latest.issuer_name ?? null,
      from: latest.not_before ? new Date(latest.not_before).toISOString() : null,
      to: latest.not_after ? new Date(latest.not_after).toISOString() : null,
    };
  }
  return { issuer: null, from: null, to: null };
}

async function measureTtfb(url: string): Promise<{ ttfb: number | null; status: number | null }> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);
    const t0 = performance.now();
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EligeTuHostingBot/1.0)" },
    });
    const ttfb = Math.round(performance.now() - t0);
    clearTimeout(t);
    // drain body
    try { await res.text(); } catch { /* ignore */ }
    return { ttfb, status: res.status };
  } catch {
    return { ttfb: null, status: null };
  }
}

async function checkOne(company: { id: string; website: string; name: string }) {
  const url = company.website;
  let host: string;
  try { host = new URL(url).hostname; } catch { return { error: "invalid_url" }; }

  const [ip, ssl, http] = await Promise.all([
    resolveIP(host),
    getSsl(host),
    measureTtfb(url),
  ]);
  const asn = ip ? await getAsn(ip) : { asn: null, asn_org: null };

  const row = {
    company_id: company.id,
    checked_url: url,
    resolved_ip: ip,
    asn: asn.asn,
    asn_org: asn.asn_org,
    ssl_issuer: ssl.issuer,
    ssl_valid_from: ssl.from,
    ssl_valid_to: ssl.to,
    ttfb_ms: http.ttfb,
    http_status: http.status,
    error: null as string | null,
    checked_at: new Date().toISOString(),
  };

  await supa.from("latam_site_checks").insert(row);
  return row;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const only: string | undefined = body?.slug;
    const countryFilter: string[] = body?.countries ?? ["PE", "MX", "CO", "AR"];

    let q = supa
      .from("hosting_companies")
      .select("id, slug, name, website, country")
      .in("country", countryFilter)
      .eq("is_verified", true)
      .not("website", "is", null);
    if (only) q = q.eq("slug", only);

    const { data: companies, error } = await q;
    if (error) throw error;

    const results: any[] = [];
    const BATCH = 12;
    for (let i = 0; i < (companies?.length ?? 0); i += BATCH) {
      const batch = companies!.slice(i, i + BATCH);
      const r = await Promise.all(batch.map((c: any) => checkOne(c).catch((e) => ({ error: String(e), slug: c.slug }))));
      results.push(...r);
    }

    return new Response(
      JSON.stringify({ ok: true, processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String((e as Error).message ?? e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
