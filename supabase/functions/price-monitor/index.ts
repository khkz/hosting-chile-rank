// Price Monitor — revisión semanal de precios por proveedor.
// Accuracy-first: NUNCA actualiza hosting_companies. Solo registra en price_checks
// y marca needs_review cuando hay cambios >5% o extracción fallida.
// Diseñado para correr vía pg_cron semanal, mismo patrón que uptime-monitor.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const DELTA_THRESHOLD_PCT = 5;
const FETCH_TIMEOUT_MS = 15_000;
const GENERIC_CLP_REGEX = /\$\s?(\d{1,3}(?:[.\s]\d{3})+|\d{4,7})(?!\d)/;

interface Provider {
  id: string;
  slug: string;
  name: string;
  precio_url: string;
  precio_regex: string | null;
  precio_regular_clp: number | null;
}

interface CheckRow {
  provider_id: string;
  source_url: string;
  raw_snippet: string | null;
  precio_detectado_clp: number | null;
  status: "ok" | "sin_cambios" | "cambio_detectado" | "extraccion_fallida";
  delta_pct: number | null;
  needs_review: boolean;
}

function normalizeClp(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = parseInt(digits, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function buildSnippet(html: string, idx: number, len: number): string {
  const start = Math.max(0, idx - 80);
  const end = Math.min(html.length, idx + len + 80);
  return html.slice(start, end).replace(/\s+/g, " ").trim().slice(0, 500);
}

async function checkOne(p: Provider): Promise<CheckRow> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(p.precio_url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "EligeTuHosting-PriceMonitor/1.0",
        "Accept": "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) {
      return {
        provider_id: p.id,
        source_url: p.precio_url,
        raw_snippet: `HTTP ${res.status}`,
        precio_detectado_clp: null,
        status: "extraccion_fallida",
        delta_pct: null,
        needs_review: true,
      };
    }
    const html = await res.text();

    let regex: RegExp = GENERIC_CLP_REGEX;
    if (p.precio_regex) {
      try {
        regex = new RegExp(p.precio_regex);
      } catch {
        regex = GENERIC_CLP_REGEX;
      }
    }
    const match = regex.exec(html);
    if (!match) {
      return {
        provider_id: p.id,
        source_url: p.precio_url,
        raw_snippet: html.replace(/\s+/g, " ").trim().slice(0, 300),
        precio_detectado_clp: null,
        status: "extraccion_fallida",
        delta_pct: null,
        needs_review: true,
      };
    }
    const captured = match[1] ?? match[0];
    const detected = normalizeClp(captured);
    const snippet = buildSnippet(html, match.index, match[0].length);

    if (detected === null) {
      return {
        provider_id: p.id,
        source_url: p.precio_url,
        raw_snippet: snippet,
        precio_detectado_clp: null,
        status: "extraccion_fallida",
        delta_pct: null,
        needs_review: true,
      };
    }

    if (p.precio_regular_clp === null || p.precio_regular_clp <= 0) {
      // Primera lectura — requiere validación humana
      return {
        provider_id: p.id,
        source_url: p.precio_url,
        raw_snippet: snippet,
        precio_detectado_clp: detected,
        status: "ok",
        delta_pct: null,
        needs_review: true,
      };
    }

    const delta = ((detected - p.precio_regular_clp) / p.precio_regular_clp) * 100;
    const absDelta = Math.abs(delta);
    if (absDelta <= DELTA_THRESHOLD_PCT) {
      return {
        provider_id: p.id,
        source_url: p.precio_url,
        raw_snippet: snippet,
        precio_detectado_clp: detected,
        status: "sin_cambios",
        delta_pct: Number(delta.toFixed(2)),
        needs_review: false,
      };
    }
    return {
      provider_id: p.id,
      source_url: p.precio_url,
      raw_snippet: snippet,
      precio_detectado_clp: detected,
      status: "cambio_detectado",
      delta_pct: Number(delta.toFixed(2)),
      needs_review: true,
    };
  } catch (err) {
    const e = err as Error;
    return {
      provider_id: p.id,
      source_url: p.precio_url,
      raw_snippet: e.name === "AbortError" ? "timeout" : (e.message ?? "unknown"),
      precio_detectado_clp: null,
      status: "extraccion_fallida",
      delta_pct: null,
      needs_review: true,
    };
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: providers, error } = await supabase
    .from("hosting_companies")
    .select("id, slug, name, precio_url, precio_regex, precio_regular_clp")
    .not("precio_url", "is", null);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const list = (providers as Provider[]) ?? [];
  const rows: CheckRow[] = [];

  for (const p of list) {
    if (!p.precio_url) continue;
    const row = await checkOne(p);
    rows.push(row);
  }

  if (rows.length > 0) {
    const { error: insErr } = await supabase.from("price_checks").insert(rows);
    if (insErr) {
      return new Response(
        JSON.stringify({ error: insErr.message, attempted: rows.length }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }

  const summary = {
    checked: list.length,
    inserted: rows.length,
    needs_review: rows.filter((r) => r.needs_review).length,
    cambio_detectado: rows.filter((r) => r.status === "cambio_detectado").length,
    extraccion_fallida: rows.filter((r) => r.status === "extraccion_fallida").length,
  };

  return new Response(
    JSON.stringify(summary),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
