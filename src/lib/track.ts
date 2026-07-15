// Lightweight, dependency-free conversion tracker.
// Pushes to window.dataLayer (creating it if missing). No cookies, no PII, no network.

type TrackProps = Record<string, string | number | boolean | undefined | null>;

export function track(event: string, props: TrackProps = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    if (!Array.isArray(w.dataLayer)) w.dataLayer = [];
    const payload: Record<string, unknown> = {
      event,
      ts: Date.now(),
      page_path: typeof window.location !== 'undefined' ? window.location.pathname : undefined,
      ...props,
    };
    w.dataLayer.push(payload);
    if (import.meta && (import.meta as any).env && (import.meta as any).env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[track]', event, payload);
    }
  } catch {
    // Never throw from tracking.
  }
}

export default track;
