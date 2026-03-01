import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BGPVIEW_BASE = "https://api.bgpview.io";

// ── Known conglomerate / large infra keywords ──
const CONGLOMERATE_MAP: Record<string, string> = {
  amazon: "Amazon (AWS)",
  aws: "Amazon (AWS)",
  google: "Google Cloud (Alphabet)",
  gcp: "Google Cloud (Alphabet)",
  microsoft: "Microsoft (Azure)",
  azure: "Microsoft (Azure)",
  ovh: "OVH / OVHcloud",
  ovhcloud: "OVH / OVHcloud",
  hetzner: "Hetzner Online GmbH",
  newfold: "Newfold Digital (EIG)",
  endurance: "Newfold Digital (EIG)",
  bluehost: "Newfold Digital (EIG)",
  hostgator: "Newfold Digital (EIG)",
  eig: "Newfold Digital (EIG)",
  linode: "Akamai (Linode)",
  akamai: "Akamai (Linode)",
  digitalocean: "DigitalOcean",
  cloudflare: "Cloudflare",
  godaddy: "GoDaddy Group",
  namecheap: "Namecheap",
  hostinger: "Hostinger International",
  ionos: "IONOS (United Internet)",
  "united internet": "IONOS (United Internet)",
  vultr: "Vultr / Constant Contact",
  contabo: "Contabo GmbH",
  oracle: "Oracle Cloud",
  alibaba: "Alibaba Cloud",
  tencent: "Tencent Cloud",
  // ── Grupo Hosting.cl (Chile) ──
  "hosting.cl": "Grupo Casamayor",
  ninjahosting: "Grupo Casamayor",
  planetahosting: "Grupo Casamayor",
  hostingcenter: "Grupo Casamayor",
  comparahosting: "Grupo Casamayor",
  ihost: "Grupo Casamayor",
  todohosting: "Grupo Casamayor",
  "iswl": "Grupo Casamayor",
  // ── Grupo Hostname ──
  hostname: "Grupo Hostname",
  "host.cl": "Grupo Hostname",
  "hn.cl": "Grupo Hostname",
  "inc.cl": "Grupo Hostname",
};

interface MonopolyResult {
  ip: string | null;
  asn_number: number | null;
  asn_name: string | null;
  suggest_is_independent: boolean;
  suggest_corporate_group: string | null;
}

// ── Known brand aliases (domain → group) ──
const BRAND_ALIASES: Record<string, string> = {
  "hosting.cl": "Grupo Casamayor",
  "ninjahosting.cl": "Grupo Casamayor",
  "planetahosting.cl": "Grupo Casamayor",
  "hostingcenter.cl": "Grupo Casamayor",
  "comparahosting.cl": "Grupo Casamayor",
  "ihost.cl": "Grupo Casamayor",
  "todohosting.cl": "Grupo Casamayor",
  // ── Grupo Hostname ──
  "hostname.cl": "Grupo Hostname",
  "hn.cl": "Grupo Hostname",
  "host.cl": "Grupo Hostname",
  "inc.cl": "Grupo Hostname",
  "mejorhosting.cl": "Grupo Hostname",
  // ── Grupo HostingNet ──
  "rankinghosting.cl": "Grupo HostingNet",
  "hostingnet.cl": "Grupo HostingNet",
  "unhosting.cl": "Grupo HostingNet",
  // ── Grupo BlueHosting ──
  "bluehosting.cl": "Grupo BlueHosting",
  "www.bluehosting.cl": "Grupo BlueHosting",
  "hosty.cl": "Grupo BlueHosting",
  "solutionhost.cl": "Grupo BlueHosting",
  "livehost.cl": "Grupo BlueHosting",
  "boxhosting.cl": "Grupo BlueHosting",
};

// ── Detect conglomerate from ASN description ──
function detectConglomerate(asnName: string, domain?: string): { independent: boolean; group: string | null } {
  // First check domain-level brand aliases
  if (domain) {
    const cleanDomain = domain.replace(/^www\./, "").toLowerCase();
    if (BRAND_ALIASES[cleanDomain]) {
      return { independent: false, group: BRAND_ALIASES[cleanDomain] };
    }
  }
  // Then check ASN name
  const lower = asnName.toLowerCase();
  for (const [keyword, group] of Object.entries(CONGLOMERATE_MAP)) {
    if (lower.includes(keyword)) {
      return { independent: false, group };
    }
  }
  return { independent: true, group: null };
}

// ── Resolve domain → IPv4 ──
async function resolveIPv4(domain: string): Promise<string | null> {
  try {
    const records = await Deno.resolveDns(domain, "A");
    return records.length > 0 ? records[0] : null;
  } catch (err) {
    console.error(`[DNS] Failed to resolve ${domain}:`, err);
    return null;
  }
}

// ── Fetch ASN info from bgpview.io ──
async function fetchAsnFromBgpView(ip: string): Promise<{ asn: number; name: string } | null> {
  try {
    const res = await fetch(`${BGPVIEW_BASE}/ip/${ip}`);
    if (!res.ok) { await res.text(); return null; }
    const json = await res.json();
    const prefixes = json?.data?.prefixes;
    if (prefixes && prefixes.length > 0) {
      const first = prefixes[0].asn;
      return { asn: first.asn, name: first.description || first.name || "Unknown" };
    }
    return null;
  } catch (err) {
    console.error("[bgpview] Error:", err);
    return null;
  }
}

// ── Fallback 1: ipapi.co ──
async function fetchAsnFromIpApi(ip: string): Promise<{ asn: number; name: string } | null> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!res.ok) { await res.text(); return null; }
    const json = await res.json();
    if (json.asn) {
      const asnNum = parseInt(String(json.asn).replace(/^AS/i, ""), 10);
      return { asn: asnNum, name: json.org || "Unknown" };
    }
    return null;
  } catch (err) {
    console.error("[ipapi.co] Error:", err);
    return null;
  }
}

// ── Fallback 2: ip-api.com (no key, 45 req/min) ──
async function fetchAsnFromIpApiCom(ip: string): Promise<{ asn: number; name: string } | null> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=as,org,isp`);
    if (!res.ok) { await res.text(); return null; }
    const json = await res.json();
    if (json.as) {
      const match = json.as.match(/^AS(\d+)/);
      if (match) {
        return { asn: parseInt(match[1], 10), name: json.org || json.isp || "Unknown" };
      }
    }
    return null;
  } catch (err) {
    console.error("[ip-api.com] Error:", err);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // ── NEW: Monopoly detection mode ──
    if (body.domain && body.mode === "monopoly") {
      const domain: string = body.domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      console.log(`🔍 [MONOPOLY] Analyzing ${domain}`);

      const ip = await resolveIPv4(domain);

      if (!ip) {
        const result: MonopolyResult = {
          ip: null,
          asn_number: null,
          asn_name: null,
          suggest_is_independent: true,
          suggest_corporate_group: null,
        };
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`🌐 [MONOPOLY] ${domain} → ${ip}`);

      // Try bgpview → ipapi.co → ip-api.com
      let asnInfo = await fetchAsnFromBgpView(ip);
      if (!asnInfo) {
        console.log("[MONOPOLY] bgpview failed, trying ipapi.co");
        asnInfo = await fetchAsnFromIpApi(ip);
      }
      if (!asnInfo) {
        console.log("[MONOPOLY] ipapi.co failed, trying ip-api.com");
        asnInfo = await fetchAsnFromIpApiCom(ip);
      }

      const asnNumber = asnInfo?.asn ?? null;
      const asnName = asnInfo?.name ?? null;

      let suggestIndependent = true;
      let suggestGroup: string | null = null;

      const detection = detectConglomerate(asnName || "", domain);
      suggestIndependent = detection.independent;
      suggestGroup = detection.group;

      const result: MonopolyResult = {
        ip,
        asn_number: asnNumber,
        asn_name: asnName,
        suggest_is_independent: suggestIndependent,
        suggest_corporate_group: suggestGroup,
      };

      console.log(`✅ [MONOPOLY] Result:`, JSON.stringify(result));

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── EXISTING: BGPView proxy mode ──
    const { endpoint } = body;
    if (typeof endpoint !== "string") {
      return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allowed = /^\/(asn\/\d+(?:\/(?:peers|prefixes))?|ip\/[^\s]+|search\?query_term=[^\s]{1,256})$/i;
    if (!allowed.test(endpoint)) {
      return new Response(JSON.stringify({ error: "Not allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch(`${BGPVIEW_BASE}${endpoint}`);

    if (!res.ok) {
      console.error(`BGPView API error: ${res.status} ${res.statusText}`);
      return new Response(
        JSON.stringify({
          error: `BGPView API unavailable (${res.status})`,
          details: "Failed to fetch data from BGPView API",
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "BGPView API error", details: "Invalid response format" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("asn-proxy error:", error?.message || error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
