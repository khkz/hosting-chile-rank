import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface WhoisData {
  registrar: string;
  created_date: string;
  expires_date: string;
  status: string;
  owner_name: string;
  organization: string;
  email: string;
  dnssec_status: string;
}

interface OsintResult {
  legal_name: string | null;
  foundation_year: number | null;
}

// ── TCP WHOIS query to NIC Chile with robust timeout ──
const queryNicChile = async (domain: string, timeoutMs = 10000): Promise<string | null> => {
  let conn: Deno.Conn | null = null;
  try {
    console.log(`[TCP] Connecting to whois.nic.cl:43 for ${domain}`);

    // Race between connection + read and a timeout
    const result = await Promise.race([
      (async () => {
        conn = await Deno.connect({ hostname: "whois.nic.cl", port: 43 });
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        await conn.write(encoder.encode(`${domain}\r\n`));

        const chunks: string[] = [];
        const buffer = new Uint8Array(4096);
        while (true) {
          const n = await conn.read(buffer);
          if (n === null) break;
          chunks.push(decoder.decode(buffer.subarray(0, n)));
          if (n < buffer.length) break;
        }
        return chunks.join('');
      })(),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('WHOIS TCP timeout')), timeoutMs)
      ),
    ]);

    if (result && result.length > 50) {
      console.log(`[TCP] Got ${result.length} bytes`);
      return result;
    }
    return null;
  } catch (err) {
    console.error('[TCP] Error:', err);
    return null;
  } finally {
    try { conn?.close(); } catch { /* already closed */ }
  }
};

// ── Fallback: HackerTarget free API ──
const queryHackerTarget = async (domain: string): Promise<string | null> => {
  try {
    console.log(`[HackerTarget] Querying ${domain}`);
    const res = await fetch(`https://api.hackertarget.com/whois/?q=${domain}`);
    if (!res.ok) { await res.text(); return null; }
    const text = await res.text();
    if (text.startsWith('error') || text.length < 50) return null;
    console.log(`[HackerTarget] Got ${text.length} bytes`);
    return text;
  } catch (err) {
    console.error('[HackerTarget] Error:', err);
    return null;
  }
};

// ── Acquire raw WHOIS text (TCP first, then fallback) ──
const getRawWhois = async (domain: string): Promise<string | null> => {
  if (domain.endsWith('.cl')) {
    const tcp = await queryNicChile(domain);
    if (tcp) return tcp;
  }
  return await queryHackerTarget(domain);
};

// ── OSINT structured parser: extracts legal_name + foundation_year ──
const parseOsint = (raw: string): OsintResult => {
  let legal_name: string | null = null;
  let foundation_year: number | null = null;

  // legal_name — "Registrant name:" or "Titular:"
  const nameMatch = raw.match(/(?:Registrant\s+name|Titular)\s*:\s*(.+)/i);
  if (nameMatch) {
    const val = nameMatch[1].trim();
    if (val && val.toLowerCase() !== 'no disponible') {
      legal_name = val;
    }
  }

  // If no registrant name, try "Registrant organisation:"
  if (!legal_name) {
    const orgMatch = raw.match(/(?:Registrant\s+organisation|Organización)\s*:\s*(.+)/i);
    if (orgMatch) {
      const val = orgMatch[1].trim();
      if (val && val.toLowerCase() !== 'no disponible') {
        legal_name = val;
      }
    }
  }

  // foundation_year — "Creation date:" or "Fecha de creación:"
  const dateMatch = raw.match(/(?:Creation\s+date|Fecha\s+de\s+creación)\s*:\s*(\d{4})/i);
  if (dateMatch) {
    foundation_year = parseInt(dateMatch[1], 10);
  }

  return { legal_name, foundation_year };
};

// ── Full WHOIS parser (existing behavior) ──
const parseNicChileWhois = (whoisText: string): WhoisData => {
  const lines = whoisText.split('\n');
  const data: WhoisData = {
    registrar: 'No disponible',
    created_date: 'No disponible',
    expires_date: 'No disponible',
    status: 'No disponible',
    owner_name: 'No disponible',
    organization: 'No disponible',
    email: 'No disponible',
    dnssec_status: 'No disponible',
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('%')) continue;

    if (/Creation date:|Fecha de creación:/i.test(t)) {
      const m = t.match(/:\s*(.+)/);
      if (m) data.created_date = m[1].replace(/\s*CLST?$/, '').trim();
    }
    if (/Expiration date:|Fecha de expiración:/i.test(t)) {
      const m = t.match(/:\s*(.+)/);
      if (m) data.expires_date = m[1].replace(/\s*CLST?$/, '').trim();
    }
    if (/Registrant name:|Titular:/i.test(t)) {
      const m = t.match(/:\s*(.+)/);
      if (m && m[1].trim()) data.owner_name = m[1].trim();
    }
    if (/Registrant organisation:|Organización:/i.test(t)) {
      const m = t.match(/:\s*(.+)/);
      if (m && m[1].trim()) data.organization = m[1].trim();
    }
    if (/Registrar name:|Registrador:/i.test(t)) {
      const m = t.match(/:\s*(.+)/);
      if (m && m[1].trim()) data.registrar = m[1].trim();
    }
    if (/Email:/i.test(t) && !t.includes('abuse@nic.cl')) {
      const m = t.match(/:\s*(.+)/);
      if (m && m[1].trim()) data.email = m[1].trim();
    }
    if (/Status:|Estado:/i.test(t)) {
      const m = t.match(/:\s*(.+)/);
      if (m && m[1].trim()) data.status = m[1].trim();
    }
  }

  return data;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const domain: string = body.domain;
    const mode: string | undefined = body.mode; // 'osint' for structured output

    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🚀 WHOIS REQUEST: domain=${domain} mode=${mode || 'full'}`);
    const start = Date.now();

    const raw = await getRawWhois(domain);

    if (!raw) {
      console.log('❌ No WHOIS data obtained from any source');
      const fallback = mode === 'osint'
        ? { legal_name: null, foundation_year: null }
        : {
            registrar: 'NIC Chile',
            created_date: 'No disponible',
            expires_date: 'No disponible',
            status: 'No disponible',
            owner_name: 'Información privada (NIC Chile)',
            organization: 'Información privada (NIC Chile)',
            email: 'Información privada (NIC Chile)',
            dnssec_status: 'No configurado',
          };
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result: OsintResult | WhoisData;

    if (mode === 'osint') {
      result = parseOsint(raw);
      console.log('🔍 OSINT result:', JSON.stringify(result));
    } else {
      result = parseNicChileWhois(raw);
      console.log('📋 Full WHOIS result:', JSON.stringify(result));
    }

    console.log(`⏱️ Completed in ${Date.now() - start}ms`);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('💥 ERROR:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch WHOIS data', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
