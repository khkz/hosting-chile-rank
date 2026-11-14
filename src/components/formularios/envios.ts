import emailjs from '@emailjs/browser';
import { supabase } from '@/integrations/supabase/client';
import { functionErrorText } from '@/lib/functionError';

/*
 * Envíos de los formularios de cotización y contacto. Los componentes no
 * llaman a Supabase ni a EmailJS directamente: usan estas funciones.
 * PENDIENTE (AGENTS.md): mover a src/features junto con comparar/useCompareData.
 */

// EmailJS configuration
const SERVICE_ID = "service_rlq4gaf";
const TEMPLATE_ID = "template_uzxrs2d";
const PUBLIC_KEY = "9wS_UPfV9q3-ZJeBZ";

/** Solicitud de cotización por EmailJS (los nombres de campo los usa la plantilla). */
export async function enviarCotizacion(params: Record<string, unknown>): Promise<void> {
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
}

/**
 * EmailJS rechaza con { status, text } en inglés. Solo dos causas le sirven a
 * la persona: la red y el límite de envíos (429). Cualquier otro estado es un
 * problema nuestro, no de sus datos ni de una sesión que no existe aquí.
 */
export async function cotizacionErrorText(err: unknown): Promise<string> {
  const e = (err ?? {}) as { status?: number; message?: string };
  if (e.status === 429) return functionErrorText({ status: 429 });
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  if (offline || e.status === 0 || (e.message && /fetch|network/i.test(e.message))) {
    return functionErrorText({ message: 'network' });
  }
  return functionErrorText({ status: 500 });
}

/** Mensaje de contacto a la función submit-contact. */
export async function enviarContacto(body: Record<string, unknown>): Promise<void> {
  const { data, error } = await supabase.functions.invoke('submit-contact', { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
}
