/**
 * Convierte el error de una edge function de Supabase (o de Auth) en un
 * mensaje en español con la causa real y el paso siguiente.
 * Nunca devuelve el texto genérico de la librería en inglés.
 */

interface FunctionsLikeError {
  name?: string;
  message?: string;
  status?: number;
  code?: string;
  context?: { status?: number; json?: () => Promise<unknown>; clone?: () => Response } | Response;
}

const AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: 'El email o la contraseña no coinciden.',
  'Invalid login credentials': 'El email o la contraseña no coinciden.',
  email_not_confirmed: 'Confirma tu email antes de ingresar: te enviamos un enlace.',
  'Email not confirmed': 'Confirma tu email antes de ingresar: te enviamos un enlace.',
  user_already_exists: 'Ya existe una cuenta con ese email. Ingresa o recupera tu contraseña.',
  'User already registered': 'Ya existe una cuenta con ese email. Ingresa o recupera tu contraseña.',
  weak_password: 'La contraseña es muy débil: usa al menos 8 caracteres.',
  over_email_send_rate_limit: 'Enviamos varios correos seguidos. Espera un minuto y vuelve a intentarlo.',
};

function byStatus(status?: number): string {
  if (status === 429) return 'Hiciste varios intentos seguidos. Espera un minuto y vuelve a intentarlo.';
  if (status === 400 || status === 422) return 'Revisa los datos del formulario y vuelve a intentarlo.';
  if (status === 401 || status === 403) return 'Tu sesión no tiene permiso para esto. Ingresa de nuevo.';
  if (status === 404) return 'No encontramos lo que buscabas. Revisa el enlace.';
  return 'No pudimos completar el envío. Intenta de nuevo en unos minutos.';
}

/** Mensaje para mostrar a la persona. Lee el cuerpo JSON `{ error }` si existe. */
export async function functionErrorText(err: unknown): Promise<string> {
  const e = (err ?? {}) as FunctionsLikeError;
  // Errores de Supabase Auth
  if (e.code && AUTH_MESSAGES[e.code]) return AUTH_MESSAGES[e.code];
  if (e.message && AUTH_MESSAGES[e.message]) return AUTH_MESSAGES[e.message];

  // FunctionsHttpError: el cuerpo trae { error: "…" } en español
  const ctx = e.context as FunctionsLikeError['context'];
  let status = e.status;
  try {
    if (ctx && typeof (ctx as Response).clone === 'function') {
      const res = (ctx as Response).clone();
      status = status ?? res.status;
      const body = (await res.json().catch(() => null)) as { error?: unknown; message?: unknown } | null;
      const text = body?.error ?? body?.message;
      if (typeof text === 'string' && text.trim() && !/non-2xx|status code/i.test(text)) return text.trim();
    } else if (ctx && typeof (ctx as { json?: () => Promise<unknown> }).json === 'function') {
      status = status ?? (ctx as { status?: number }).status;
      const body = (await (ctx as { json: () => Promise<unknown> }).json().catch(() => null)) as { error?: unknown } | null;
      if (typeof body?.error === 'string' && body.error.trim()) return body.error.trim();
    }
  } catch {
    // sin cuerpo legible: seguimos con el estado
  }

  if (e.message && !/non-2xx|status code|fetch|network/i.test(e.message) && /[áéíóúñ¿¡]|\b(el|la|de|que|no)\b/i.test(e.message)) {
    // Ya viene en español desde nuestra función
    return e.message;
  }
  if (e.message && /fetch|network/i.test(e.message)) return 'No hay conexión con el servidor. Revisa tu internet y vuelve a intentarlo.';
  return byStatus(status);
}
