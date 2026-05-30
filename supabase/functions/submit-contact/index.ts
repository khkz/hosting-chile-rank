import { createClient } from "npm:@supabase/supabase-js@2";

const ADMIN_EMAIL = "khkzulox@gmail.com";
const FROM_EMAIL = "Elige Tu Hosting <onboarding@resend.dev>";
const SITE_NAME = "Elige Tu Hosting";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ContactPayload {
  nombre?: unknown;
  email?: unknown;
  asunto?: unknown;
  mensaje?: unknown;
  tipoConsulta?: unknown;
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
  reply_to?: string;
}) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY not configured");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      reply_to: payload.reply_to,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error("Resend error", res.status, txt);
    throw new Error(`Resend failed: ${res.status}`);
  }
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as ContactPayload;

    const nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const asunto =
      typeof body.asunto === "string" ? body.asunto.trim() : "";
    const mensaje =
      typeof body.mensaje === "string" ? body.mensaje.trim() : "";
    const tipoConsulta =
      typeof body.tipoConsulta === "string" ? body.tipoConsulta : "consulta_general";

    if (
      nombre.length < 2 ||
      nombre.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 255 ||
      mensaje.length < 10 ||
      mensaje.length > 2000 ||
      asunto.length > 200
    ) {
      return new Response(
        JSON.stringify({ error: "Datos inválidos" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    const ipHash = await crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(ip))
      .then((buf) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      );

    const { data: inserted, error: insertError } = await supabase
      .from("contact_submissions")
      .insert({
        name: nombre,
        email,
        subject: `[${tipoConsulta}] ${asunto}`,
        message: mensaje,
        ip_hash: ipHash,
        user_agent: req.headers.get("user-agent") ?? null,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "No se pudo guardar el mensaje" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 1) Notify admin
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `📨 Nuevo contacto: ${asunto || tipoConsulta}`,
        reply_to: email,
        html: `
          <h2>Nuevo mensaje desde el formulario de contacto</h2>
          <p><strong>Nombre:</strong> ${esc(nombre)}</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          <p><strong>Tipo:</strong> ${esc(tipoConsulta)}</p>
          <p><strong>Asunto:</strong> ${esc(asunto)}</p>
          <hr>
          <p style="white-space: pre-wrap;">${esc(mensaje)}</p>
          <hr>
          <p style="color:#888;font-size:12px;">ID: ${inserted.id}</p>
        `,
      });
    } catch (e) {
      console.error("Admin email failed:", e);
    }

    // 2) Auto-reply to user
    try {
      await sendEmail({
        to: email,
        subject: `Recibimos tu mensaje - ${SITE_NAME}`,
        html: `
          <h2>Hola ${esc(nombre)},</h2>
          <p>Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos en un plazo de 24 a 48 horas hábiles.</p>
          <p><strong>Resumen de tu consulta:</strong></p>
          <blockquote style="border-left:3px solid #EF233C;padding-left:12px;color:#555;">
            ${esc(mensaje)}
          </blockquote>
          <p>Saludos cordiales,<br>Equipo ${SITE_NAME}</p>
          <hr>
          <p style="color:#888;font-size:12px;">Este es un mensaje automático, no es necesario responderlo.</p>
        `,
      });
    } catch (e) {
      console.error("User auto-reply failed:", e);
    }

    return new Response(JSON.stringify({ success: true, id: inserted.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-contact error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
