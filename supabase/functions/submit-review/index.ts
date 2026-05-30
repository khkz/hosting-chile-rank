import { createClient } from "npm:@supabase/supabase-js@2";

const ADMIN_EMAIL = "khkzulox@gmail.com";
const FROM_EMAIL = "Elige Tu Hosting <onboarding@resend.dev>";
const SITE_NAME = "Elige Tu Hosting";
const SITE_URL = "https://eligetuhosting.cl";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ReviewPayload {
  proveedor?: unknown;
  nombre?: unknown;
  email?: unknown;
  comentario?: unknown;
  calificacionGeneral?: unknown;
  calificacionSoporte?: unknown;
  calificacionVelocidad?: unknown;
  calificacionPrecio?: unknown;
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

function toRating(v: unknown): number | null {
  const n =
    typeof v === "number" ? v : typeof v === "string" ? parseInt(v, 10) : NaN;
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

async function sendEmail(payload: { to: string; subject: string; html: string }) {
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
    const body = (await req.json()) as ReviewPayload;

    const proveedor =
      typeof body.proveedor === "string" ? body.proveedor.trim() : "";
    const nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const comentario =
      typeof body.comentario === "string" ? body.comentario.trim() : "";

    const ratingOverall = toRating(body.calificacionGeneral);
    const ratingSupport = toRating(body.calificacionSoporte);
    const ratingSpeed = toRating(body.calificacionVelocidad);
    const ratingPrice = toRating(body.calificacionPrecio);

    if (
      proveedor.length < 2 ||
      proveedor.length > 100 ||
      nombre.length < 2 ||
      nombre.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 255 ||
      comentario.length < 10 ||
      comentario.length > 1000 ||
      ratingOverall === null
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
      .from("hosting_review_submissions")
      .insert({
        provider_name: proveedor,
        reviewer_name: nombre,
        reviewer_email: email,
        rating_overall: ratingOverall,
        rating_support: ratingSupport,
        rating_speed: ratingSpeed,
        rating_price: ratingPrice,
        comment: comentario,
        ip_hash: ipHash,
        user_agent: req.headers.get("user-agent") ?? null,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "No se pudo guardar la reseña" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stars = (n: number | null) =>
      n === null ? "—" : "★".repeat(n) + "☆".repeat(5 - n);

    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `⭐ Nueva reseña pendiente: ${proveedor} (${ratingOverall}/5)`,
        html: `
          <h2>Nueva reseña pendiente de moderación</h2>
          <p><strong>Proveedor:</strong> ${esc(proveedor)}</p>
          <p><strong>Autor:</strong> ${esc(nombre)} &lt;${esc(email)}&gt;</p>
          <table style="border-collapse:collapse;margin:12px 0;">
            <tr><td><strong>General:</strong></td><td>${stars(ratingOverall)} (${ratingOverall}/5)</td></tr>
            <tr><td><strong>Soporte:</strong></td><td>${stars(ratingSupport)}</td></tr>
            <tr><td><strong>Velocidad:</strong></td><td>${stars(ratingSpeed)}</td></tr>
            <tr><td><strong>Precio:</strong></td><td>${stars(ratingPrice)}</td></tr>
          </table>
          <p><strong>Comentario:</strong></p>
          <blockquote style="border-left:3px solid #EF233C;padding-left:12px;color:#555;white-space:pre-wrap;">${esc(comentario)}</blockquote>
          <p><a href="${SITE_URL}/admin/review-moderation" style="display:inline-block;background:#EF233C;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Moderar reseñas</a></p>
          <hr>
          <p style="color:#888;font-size:12px;">ID: ${inserted.id}</p>
        `,
      });
    } catch (e) {
      console.error("Admin email failed:", e);
    }

    try {
      await sendEmail({
        to: email,
        subject: `Recibimos tu reseña - ${SITE_NAME}`,
        html: `
          <h2>¡Gracias por tu reseña, ${esc(nombre)}!</h2>
          <p>Hemos recibido tu opinión sobre <strong>${esc(proveedor)}</strong>. Antes de publicarla revisaremos que cumpla con nuestras pautas de la comunidad.</p>
          <p>Te notificaremos por email cuando tu reseña esté publicada.</p>
          <p>Saludos,<br>Equipo ${SITE_NAME}</p>
          <hr>
          <p style="color:#888;font-size:12px;">Este es un mensaje automático, no es necesario responderlo.</p>
        `,
      });
    } catch (e) {
      console.error("User confirmation failed:", e);
    }

    return new Response(JSON.stringify({ success: true, id: inserted.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-review error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
