// Minimal analytics helper - pushes to window.dataLayer.
// No external libraries, no cookies, no PII. Safe in prerender.

type Params = Record<string, string | number | boolean | undefined | null>;

export function trackEvent(name: string, params: Params = {}): void {
  // Prerender / SSR guard
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  try {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: name,
      ts: Date.now(),
      page_path: window.location?.pathname,
      ...params,
    });
    if (import.meta && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', name, params);
    }
  } catch {
    // never throw from analytics
  }
}

export default trackEvent;
