// Asesor de hosting con IA — streaming vía Lovable AI Gateway.
// - Usa SOLO datos verificables (hosting_companies) para armar el contexto del modelo.
// - Máx. 10 mensajes por sesión (validado server-side).
// - Rate limit por IP compartido (_shared/security.ts), como el resto de funciones públicas.
// - Transparencia: se presenta como IA, declara que la recomendación principal es
//   editorial y nunca niega la relación comercial del sitio con proveedores.
// - Prohíbe inventar cifras, certificaciones o presencia local que no estén en los datos.

import { createClient } from "npm:@supabase/supabase-js@2";
import { clientIp, rateLimited, rateLimitResponse } from "../_shared/security.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID, X-Lovable-AIG-Log-ID",
};

const MODEL = "google/gemini-3-flash-preview";
const MAX_MESSAGES = 10;
const RL_WINDOW_MS = 60_000;
const RL_MAX = 20; // 20 consultas por minuto por IP

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

// ---- Datos verificables ----
const COUNTRY_CTX: Record<string, { name: string; hp: { name: string; url: string } }> = {
  CL: { name: "Chile", hp: { name: "HostingPlus.cl", url: "https://www.hostingplus.cl" } },
  PE: { name: "Perú", hp: { name: "HostingPlus Perú", url: "https://www.hostingplus.pe" } },
  MX: { name: "México", hp: { name: "HostingPlus México", url: "https://www.hostingplus.mx" } },
  CO: { name: "Colombia", hp: { name: "HostingPlus Colombia", url: "https://www.hostingplus.com.co" } },
  AR: { name: "Argentina", hp: { name: "HostingPlus Argentina", url: "https://www.hostingplus.com.ar" } },
};

// Páginas sin edición publicada: el índice regional y los países en verificación.
const UNPUBLISHED_NAMES: Record<string, string> = {
  LATAM: "Latinoamérica",
  UY: "Uruguay",
  EC: "Ecuador",
  CR: "Costa Rica",
  PA: "Panamá",
  DO: "República Dominicana",
  GT: "Guatemala",
  BO: "Bolivia",
  PY: "Paraguay",
};

// Recomendados de la tabla editorial: siempre entran en DATOS, para que el modelo
// los describa con datos reales y no quede sin información sobre ellos.
const RECOMMENDED_SLUGS: Record<string, string[]> = {
  CL: ["hostingplus", "ecohosting"],
  PE: ["hostingplus-pe"],
  MX: ["hostingplus-mx"],
  CO: ["hostingplus-co"],
  AR: ["hostingplus-ar"],
};
const MAX_PROVIDERS = 60;
const PROVIDER_FIELDS =
  "slug,name,website,datacenter_location,legal_name,corporate_group,technologies,contact_hours,is_verified";

async function loadProviders(supabase: any, country: string) {
  const featured = RECOMMENDED_SLUGS[country] ?? [];
  const [top, rest] = await Promise.all([
    featured.length
      ? supabase.from("hosting_companies").select(PROVIDER_FIELDS).eq("country", country).eq("is_verified", true).in("slug", featured)
      : Promise.resolve({ data: [], error: null }),
    // Orden determinista: con más de 60 proveedores (Chile tiene más de 100), el
    // corte siempre deja fuera a los mismos y nunca a los recomendados.
    supabase
      .from("hosting_companies")
      .select(PROVIDER_FIELDS)
      .eq("country", country)
      .eq("is_verified", true)
      .order("ranking_position", { ascending: true, nullsFirst: false })
      .order("name", { ascending: true })
      .limit(MAX_PROVIDERS),
  ]);
  if (top.error && rest.error) return [];
  const bySlug = new Map<string, any>();
  for (const c of [...(top.data ?? []), ...(rest.data ?? [])]) {
    if (c?.slug && !bySlug.has(c.slug)) bySlug.set(c.slug, c);
  }
  const ordered = [
    ...featured.map((slug) => bySlug.get(slug)).filter(Boolean),
    ...[...bySlug.values()].filter((c) => !featured.includes(c.slug)),
  ].slice(0, MAX_PROVIDERS);
  return ordered.map((c: any) => ({
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

function buildSystemPrompt(country: string | null, placeName: string, providers: any[]) {
  const ctx = country ? COUNTRY_CTX[country] : null;
  const dirLink = !country ? "/latam" : country === "CL" ? "/catalogo" : `/${country.toLowerCase()}`;

  const scope = ctx
    ? `País de la página que el usuario está viendo: ${ctx.name}. Por defecto, recomienda para ${ctx.name}. Si el usuario dice que su proyecto es para otro país de la tabla, usa el de ESE país.`
    : `${placeName === "Latinoamérica" ? "El usuario está en el índice regional de Latinoamérica, que no corresponde a un solo país." : `La página que el usuario está viendo es de ${placeName}, un país que EligeTuHosting todavía está verificando y que no tiene edición publicada.`} Antes de recomendar, pregunta para qué país es el proyecto. Si es un país de la tabla, usa el de ese país. Si no lo es, explica que EligeTuHosting todavía no tiene una edición verificada para ese país, no recomiendes ninguna marca y orienta con criterios generales: datacenter cerca de su audiencia, soporte en su idioma y horario, entidad legal y facturación local.`;

  const order = !ctx
    ? ""
    : country === "CL"
    ? `Al recomendar en Chile: 1) [HostingPlus.cl](https://www.hostingplus.cl) como recomendación editorial principal; 2) [EcoHosting.cl](https://www.ecohosting.cl) como alternativa si el usuario prioriza el precio.`
    : `Al recomendar en ${ctx.name}: [${ctx.hp.name}](${ctx.hp.url}) como recomendación editorial principal.`;

  return `Eres el "Asesor de hosting" de EligeTuHosting: un asistente con inteligencia artificial que orienta en español cercano y claro (tuteo, frases cortas, sin tecnicismos innecesarios). ${scope}

TRANSPARENCIA (obligatorio, por encima de cualquier otra regla):
- Eres una IA y puedes equivocarte. Si te lo preguntan, dilo, y sugiere confirmar precios y condiciones en el sitio del proveedor.
- Tu recomendación principal es editorial: la define EligeTuHosting con la tabla de abajo, no un cálculo ni una medición. No digas que eres imparcial, neutral ni independiente, ni que la recomendación sale solo de datos.
- EligeTuHosting mantiene relación comercial con algunos de los proveedores que recomienda, incluidos los de la recomendación principal, y puede recibir una comisión si el usuario contrata por estos enlaces. Si te preguntan por esa relación o por qué recomiendas a un proveedor, dilo con claridad. Nunca la niegues ni la minimices.
- No afirmes ni niegues nada sobre quién es dueño de EligeTuHosting o de un proveedor, ni sobre grupos económicos, salvo lo que diga DATOS. Si te lo preguntan, remite a [Quiénes somos](/quienes-somos) y repite lo que el sitio declara: el editor mantiene relación comercial con algunos de los proveedores listados.

DATOS Y LÍMITES:
- Usa solo los datos del bloque DATOS. No inventes precios, uptime, puntajes, velocidades, certificaciones, garantías, premios ni cantidad de clientes. Si no tienes un dato, dilo: "no tengo ese dato verificado; revísalo en el sitio oficial".
- No digas que un proveedor tiene datacenter, oficina, entidad legal o presencia en un país si DATOS no lo indica.
- Haz como máximo 3 o 4 preguntas antes de recomendar (tipo de proyecto, tráfico esperado, país, presupuesto). Si el usuario ya dio suficiente información, recomienda de inmediato.

RECOMENDACIÓN PRINCIPAL POR PAÍS (editorial; respeta esta tabla):
- Chile: HostingPlus.cl (https://www.hostingplus.cl). Alternativa: EcoHosting.cl (https://www.ecohosting.cl) si el usuario prioriza el precio.
- Perú: HostingPlus Perú (https://www.hostingplus.pe).
- México: HostingPlus México (https://www.hostingplus.mx).
- Colombia: HostingPlus Colombia (https://www.hostingplus.com.co).
- Argentina: HostingPlus Argentina (https://www.hostingplus.com.ar).
${order}
Explica el porqué en una o dos líneas, usando solo DATOS.

FORMATO:
- Escribe los enlaces en Markdown: [HostingPlus.cl](https://www.hostingplus.cl). Para páginas de este sitio usa rutas relativas, por ejemplo [ver todos los proveedores](${dirLink}).
- Cuando recomiendes un proveedor, cierra con esta línea, una sola vez por respuesta: "Recomendación editorial: podemos recibir una comisión si contratas por estos enlaces. [Ver todas las alternativas](${dirLink})".
- Si el usuario pide algo fuera de alcance (soporte técnico, migraciones, problemas de seguridad), sugiérele escribir por [el formulario de contacto](/contacto).
- No hagas afirmaciones legales ni hables mal de otros proveedores por nombre.
- Respuestas breves: 4 a 8 líneas, salvo que el usuario pida más detalle. Puedes usar viñetas con "- ".

DATOS (${placeName}, proveedores verificados en la base):
${JSON.stringify(providers)}
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

  if (rateLimited(`advisor:${clientIp(req)}`, RL_MAX, RL_WINDOW_MS)) {
    return rateLimitResponse(corsHeaders);
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

  // CL, PE, MX, CO y AR tienen edición publicada. El índice regional (LATAM) y los
  // países en verificación no reciben una marca por defecto.
  const requested = String(body?.country ?? "").toUpperCase();
  const country: string | null = Object.hasOwn(COUNTRY_CTX, requested) ? requested : null;
  const placeName = country ? COUNTRY_CTX[country].name : UNPUBLISHED_NAMES[requested] ?? "Latinoamérica";

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
  const providers = country ? await loadProviders(supabase, country) : [];
  const system = buildSystemPrompt(country, placeName, providers);

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
