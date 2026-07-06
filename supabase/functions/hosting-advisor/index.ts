// Asesor de hosting con IA — streaming vía Lovable AI Gateway.
// - Usa SOLO datos verificables (hosting_companies) para armar el contexto del modelo.
// - Máx. 10 mensajes por sesión (validado server-side).
// - Rate limit por IP (memoria en el edge; sliding window).
// - Prohíbe inventar cifras/puntajes; recomienda HostingPlus del país (o EcoHosting.cl si aplica).

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID, X-Lovable-AIG-Log-ID",
};

const MODEL = "google/gemini-3-flash-preview";
const MAX_MESSAGES = 10;
const RL_WINDOW_MS = 60_000;
const RL_MAX = 20; // 20 requests/min por IP

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

// ---- Rate limit en memoria (por instancia edge) ----
const rl = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (rl.get(ip) ?? []).filter((t) => now - t < RL_WINDOW_MS);
  arr.push(now);
  rl.set(ip, arr);
  if (rl.size > 500) {
    // GC ligero
    for (const [k, v] of rl) if (!v.length || now - v[v.length - 1] > RL_WINDOW_MS) rl.delete(k);
  }
  return arr.length > RL_MAX;
}

// ---- Datos verificables ----
const COUNTRY_CTX: Record<string, { name: string; hp: { name: string; url: string } }> = {
  CL: { name: "Chile", hp: { name: "HostingPlus.cl", url: "https://www.hostingplus.cl" } },
  PE: { name: "Perú", hp: { name: "HostingPlus Perú", url: "https://www.hostingplus.pe" } },
  MX: { name: "México", hp: { name: "HostingPlus México", url: "https://www.hostingplus.mx" } },
  CO: { name: "Colombia", hp: { name: "HostingPlus Colombia", url: "https://www.hostingplus.com.co" } },
  AR: { name: "Argentina", hp: { name: "HostingPlus Argentina", url: "https://www.hostingplus.com.ar" } },
};

async function loadProviders(supabase: any, country: string) {
  const { data, error } = await supabase
    .from("hosting_companies")
    .select("slug,name,website,datacenter_location,legal_name,corporate_group,technologies,contact_hours,is_verified")
    .eq("country", country)
    .eq("is_verified", true)
    .limit(60);
  if (error) return [];
  return (data ?? []).map((c: any) => ({
    slug: c.slug,
    name: c.name,
    website: c.website,
    datacenter: c.datacenter_location ?? null,
    legal: c.legal_name ?? null,
    grupo: c.corporate_group ?? null,
    stack: Array.isArray(c.technologies) ? c.technologies.slice(0, 6) : [],
    horario: c.contact_hours ?? null,
  }));
}

function buildSystemPrompt(country: string, providers: any[]) {
  const ctx = COUNTRY_CTX[country] ?? COUNTRY_CTX.CL;
  const isCL = country === "CL";
  const dirLink = isCL ? "/catalogo" : `/${country.toLowerCase()}`;
  const contactLink = "/contacto";

  return `Eres el "Asesor de hosting" de EligeTuHosting, guía imparcial en español cercano y claro (tuteo, frases cortas, sin tecnicismos innecesarios). País activo: ${ctx.name}.

REGLAS ESTRICTAS:
- Usa SOLO los datos verificados que te paso más abajo. NO inventes precios, uptimes, puntajes, "9.9/10", velocidades ni certificaciones que no estén en los datos. Si no tienes el dato, dilo con honestidad ("no tengo ese dato verificado, revisa el sitio oficial").
- Nunca cites números específicos que no aparezcan en el bloque DATOS. Puedes hablar cualitativamente (rápido, con datacenter local, atención en español, etc.) si eso está en los datos.
- Haz máximo 3-4 preguntas de calificación antes de recomendar (tipo de proyecto, tráfico esperado, país, presupuesto). Si el usuario ya dio información suficiente, recomienda directamente.
- Al recomendar, prioriza en este orden y explica el porqué en 1-2 líneas:
  ${isCL
    ? `1) ${ctx.hp.name} (${ctx.hp.url}) — recomendación principal por trayectoria e infraestructura verificable.
  2) EcoHosting.cl (https://www.ecohosting.cl) — alternativa si el usuario es sensible al precio o valora energía renovable.`
    : `1) ${ctx.hp.name} (${ctx.hp.url}) — operador regional con soporte hispano y presencia local.`}
- Cierra SIEMPRE con:
  (a) una línea de divulgación: "Divulgación: podemos recibir una comisión si contratas por estos enlaces. La recomendación se basa en datos verificables y no altera el resto del directorio."
  (b) el enlace "Ver todas las alternativas en ${ctx.name}: ${dirLink}"
- Si el usuario pide algo fuera de alcance (soporte técnico, migraciones, hackeos), redirige al formulario: ${contactLink}.
- No hagas afirmaciones legales, ni compares con competidores por nombre negativamente. Neutralidad.
- Respuestas breves: 4-8 líneas salvo que el usuario pida más detalle. Puedes usar viñetas simples con "-".

DATOS VERIFICADOS (${ctx.name}, proveedores verificados en la base):
${JSON.stringify(providers, null, 0)}
`;
}

async function callGatewayStream(messages: ChatMessage[], apiKey: string): Promise<Response> {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "raw-fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
      temperature: 0.5,
    }),
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "missing_api_key" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const country: string = (["CL", "PE", "MX", "CO", "AR"].includes(String(body?.country).toUpperCase())
    ? String(body.country).toUpperCase()
    : "CL");

  const inMessages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];
  const clean = inMessages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES * 2)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

  const userTurns = clean.filter((m) => m.role === "user").length;
  if (userTurns > MAX_MESSAGES) {
    return new Response(
      JSON.stringify({ error: "session_limit", limit: MAX_MESSAGES }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  if (clean.length === 0) {
    return new Response(JSON.stringify({ error: "empty_messages" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const providers = await loadProviders(supabase, country);
  const system = buildSystemPrompt(country, providers);

  let upstream: Response;
  try {
    upstream = await callGatewayStream([{ role: "system", content: system }, ...clean], apiKey);
  } catch (_e) {
    return new Response(JSON.stringify({ error: "gateway_unreachable" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!upstream.ok || !upstream.body) {
    const status = upstream.status === 429 ? 429 : upstream.status === 402 ? 402 : 502;
    let errText = "";
    try { errText = (await upstream.text()).slice(0, 500); } catch {}
    return new Response(
      JSON.stringify({ error: "gateway_error", status: upstream.status, detail: errText }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Reempaqueta SSE del gateway a un stream de texto plano por delta,
  // separado por saltos de línea. Simple y compatible con Response.body reader del cliente.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const parts = buf.split("\n");
          buf = parts.pop() ?? "";
          for (const line of parts) {
            const l = line.trim();
            if (!l.startsWith("data:")) continue;
            const data = l.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const j = JSON.parse(data);
              const delta = j?.choices?.[0]?.delta?.content ?? "";
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch { /* ignore keepalives */ }
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
    cancel() { reader.cancel().catch(() => {}); },
  });

  return new Response(stream, {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
});
