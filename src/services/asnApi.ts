import { supabase } from '@/integrations/supabase/client';

// ASN API wrapper with database caching for faster performance

export interface ASNOverview {
  asn: number;
  name?: string;
  description?: string;
  country_code?: string;
  prefixes_count?: number;
  peers_count?: number;
  rir_allocation?: string;
  website?: string | null;
}

export interface ASNPrefix {
  prefix: string; // e.g., "190.110.0.0/16" or "2a00:xxx/32"
  description?: string | null;
  country_code?: string | null;
  parent?: string | null;
}

export interface ASNDetails {
  overview: ASNOverview;
  ipv4_prefixes: ASNPrefix[];
  ipv6_prefixes: ASNPrefix[];
  peers?: Array<{ asn: number; name?: string }>; // optional for future use
}

const BGPVIEW_BASE = 'https://api.bgpview.io';

async function fetchJSON<T = any>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ASN API error ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchBGViewJSON<T = any>(path: string): Promise<T> {
  try {
    return await fetchJSON<T>(`${BGPVIEW_BASE}${path}`);
  } catch (err: any) {
    const { data, error } = await supabase.functions.invoke('asn-proxy', {
      body: { endpoint: path },
    });
    if (error) throw new Error(error.message || 'ASN proxy error');
    return data as T;
  }
}


export function normalizeASN(input: string): number | null {
  if (!input) return null;
  const m = input.toUpperCase().match(/AS?(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

export async function getASNOverview(asn: number): Promise<ASNOverview> {
  try {
    // Check cache first
    const { data: cachedData } = await supabase
      .from('asn_data_cache')
      .select('*')
      .eq('asn', asn)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (cachedData) {
      console.log(`ASN data cache hit for: AS${asn}`);
      return {
        asn: cachedData.asn,
        name: cachedData.name || undefined,
        description: cachedData.description || undefined,
        country_code: cachedData.country_code || undefined,
        prefixes_count: cachedData.prefixes_count || undefined,
        peers_count: cachedData.peers_count || undefined,
        rir_allocation: cachedData.rir_allocation || undefined,
        website: cachedData.website || null,
      };
    }
  } catch (error) {
    console.log(`ASN data cache miss for: AS${asn}`);
  }
  
  // Cache miss or expired, fetch from API
  const json = await fetchBGViewJSON<{ status: string; data: any }>(`/asn/${asn}`);
  const d = json?.data || {};
  const overview: ASNOverview = {
    asn: d.asn ?? asn,
    name: d.name ?? d.description_short ?? undefined,
    description: d.description ?? d.description_short ?? undefined,
    country_code: d.country_code ?? d.country ?? undefined,
    prefixes_count: d.prefixes_count ?? d.total_prefixes ?? undefined,
    peers_count: d.peers_count ?? undefined,
    rir_allocation: d.rir_allocation ?? undefined,
    website: d.website ?? null,
  };
  
  // Cache the data
  try {
    await supabase
      .from('asn_data_cache')
      .upsert({
        asn: overview.asn,
        name: overview.name,
        description: overview.description,
        country_code: overview.country_code,
        prefixes_count: overview.prefixes_count,
        peers_count: overview.peers_count,
        rir_allocation: overview.rir_allocation,
        website: overview.website,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      });
    console.log(`Cached ASN data for: AS${asn}`);
  } catch (error) {
    console.warn('Failed to cache ASN data:', error);
  }
  
  return overview;
}

export async function getASNPrefixes(asn: number): Promise<{ ipv4_prefixes: ASNPrefix[]; ipv6_prefixes: ASNPrefix[] }> {
  const json = await fetchBGViewJSON<{ status: string; data: any }>(`/asn/${asn}/prefixes`);
  const d = json?.data || {};
  const mapPrefix = (p: any): ASNPrefix => ({
    prefix: p.prefix || p.cidr || p.ip || '',
    description: p.name || p.description || null,
    country_code: p.country_code || p.country || null,
    parent: p.parent || null,
  });
  return {
    ipv4_prefixes: Array.isArray(d.ipv4_prefixes) ? d.ipv4_prefixes.map(mapPrefix) : [],
    ipv6_prefixes: Array.isArray(d.ipv6_prefixes) ? d.ipv6_prefixes.map(mapPrefix) : [],
  };
}

export async function getASNPeers(asn: number): Promise<Array<{ asn: number; name?: string }>> {
  try {
    const json = await fetchBGViewJSON<{ status: string; data: any }>(`/asn/${asn}/peers`);
    const d = json?.data || {};
    const peers: Array<{ asn: number; name?: string }> = (d.ipv4_peers || []).concat(d.ipv6_peers || []).map((p: any) => ({
      asn: p.asn || p.peer_asn,
      name: p.name || p.peer_name,
    }));
    // Deduplicate by ASN
    const seen = new Set<number>();
    return peers.filter(pe => (seen.has(pe.asn) ? false : (seen.add(pe.asn), true)));
  } catch (e) {
    return [];
  }
}

export async function getASNDetails(asnInput: string): Promise<ASNDetails> {
  const asn = normalizeASN(asnInput);
  if (!asn) throw new Error('ASN inválido');

  const [overview, prefixes, peers] = await Promise.all([
    getASNOverview(asn),
    getASNPrefixes(asn),
    getASNPeers(asn),
  ]);

  return { overview, ipv4_prefixes: prefixes.ipv4_prefixes, ipv6_prefixes: prefixes.ipv6_prefixes, peers };
}

export interface ASNSearchResult {
  asn: number;
  name?: string;
  description?: string;
  country_code?: string;
}

export async function searchASN(query: string): Promise<ASNSearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  
  const searchTerm = query.trim().toLowerCase();
  
  try {
    // Check cache first
    const { data: cachedResult } = await supabase
      .from('asn_search_cache')
      .select('results, expires_at')
      .eq('search_term', searchTerm)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();
    
    if (cachedResult) {
      console.log(`ASN search cache hit for: ${searchTerm}`);
      return cachedResult.results as any as ASNSearchResult[];
    }
  } catch (error) {
    console.log(`ASN search cache miss for: ${searchTerm}`);
  }
  
  // Cache miss or expired, fetch from API
  const q = encodeURIComponent(query.trim());
  const json = await fetchBGViewJSON<{ status: string; data: any }>(`/search?query_term=${q}`);
  const asns = json?.data?.asns || [];
  const results: ASNSearchResult[] = asns.map((a: any) => ({
    asn: a.asn,
    name: a.name || a.description_short,
    description: a.description || a.description_long,
    country_code: a.country_code || a.country,
  }));
  
  // Cache the results with proper conflict resolution
  try {
    await supabase
      .from('asn_search_cache')
      .upsert({
        search_term: searchTerm,
        results: results as any,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }, {
        onConflict: 'search_term'
      });
    console.log(`Cached ASN search results for: ${searchTerm}`);
  } catch (error) {
    console.warn('Failed to cache ASN search results:', error);
  }
  
  return results;
}

export function estimatePrefixSize(prefix: string): number {
  // Simple estimation for IPv4 only; IPv6 is large; we can rank by CIDR.
  try {
    const [ip, maskStr] = prefix.split('/');
    const mask = parseInt(maskStr, 10);
    if (ip.includes(':')) return 0; // ignore IPv6 for size chart
    const size = Math.pow(2, 32 - mask);
    return size;
  } catch {
    return 0;
  }
}
