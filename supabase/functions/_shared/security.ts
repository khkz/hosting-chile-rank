// Helpers de seguridad compartidos por edge functions.
// - requireAdmin: valida JWT + rol admin server-side (tabla user_roles) o secreto de servicio para cron.
// - rateLimited: rate limit por IP en memoria (sliding window, por instancia edge).

import { createClient } from "npm:@supabase/supabase-js@2";

export type AdminCheck = { ok: true; via: "service" | "admin"; userId?: string } | { ok: false; status: number; error: string };

export async function requireAdmin(req: Request): Promise<AdminCheck> {
  // 1) Invocaciones de cron / servidor: secreto sólo del lado servidor.
  const serviceSecret = Deno.env.get("ADMIN_SECRET_KEY");
  const provided = req.headers.get("x-service-secret") ?? req.headers.get("x-admin-api-key");
  if (serviceSecret && provided && provided === serviceSecret) {
    return { ok: true, via: "service" };
  }

  // 2) Usuario autenticado con rol admin verificado server-side.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, status: 401, error: "No autorizado" };
  }
  const token = authHeader.slice("Bearer ".length);

  const anon = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );
  const { data, error } = await anon.auth.getClaims(token);
  const userId = data?.claims?.sub as string | undefined;
  if (error || !userId) {
    return { ok: false, status: 401, error: "No autorizado" };
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: role } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (!role) {
    return { ok: false, status: 403, error: "Requiere rol admin" };
  }
  return { ok: true, via: "admin", userId };
}

export function adminDenied(check: Extract<AdminCheck, { ok: false }>, headers: Record<string, string>): Response {
  return new Response(JSON.stringify({ error: check.error }), {
    status: check.status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

// ---- Rate limit por IP (memoria por instancia edge) ----
const buckets = new Map<string, number[]>();

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  buckets.set(key, arr);
  if (buckets.size > 1000) {
    for (const [k, v] of buckets) {
      if (!v.length || now - v[v.length - 1] > windowMs) buckets.delete(k);
    }
  }
  return arr.length > max;
}

export function rateLimitResponse(headers: Record<string, string>): Response {
  return new Response(
    JSON.stringify({ error: "rate_limited", message: "Demasiadas consultas. Intenta de nuevo en unos minutos." }),
    { status: 429, headers: { ...headers, "Content-Type": "application/json" } },
  );
}
