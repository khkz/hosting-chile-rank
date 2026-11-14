import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatInteger } from '@/lib/format';
import { functionErrorText } from '@/lib/functionError';
import FormNotice, { type FormNoticeStatus } from '../FormNotice';
import { CATEGORIES } from './categorias';

const SEVERITIES = [
  { value: '1', label: '1 - Menor' },
  { value: '2', label: '2 - Leve' },
  { value: '3', label: '3 - Moderado' },
  { value: '4', label: '4 - Grave' },
  { value: '5', label: '5 - Crítico' },
];

export interface CompanyOption {
  id: string;
  name: string;
  country: string;
}

/** Cuerpo que espera la función submit-complaint (mismos campos que antes). */
export interface ComplaintPayload {
  company_id: string;
  reporter_email: string;
  reporter_name: string;
  title: string;
  description: string;
  category: string;
  severity: number;
  evidence_url: string;
  incident_date: string;
}

type Field = 'company_id' | 'reporter_email' | 'title' | 'description' | 'severity' | 'evidence_url';
type Errors = Partial<Record<Field, string>>;

/** Orden de los campos en pantalla: el foco va al primero con error. */
const FIELD_IDS: Record<Field, string> = {
  company_id: 'company',
  reporter_email: 'email',
  title: 'title',
  description: 'desc',
  severity: 'severity',
  evidence_url: 'evidence',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRY_LABELS: Record<string, string> = { CL: 'Chile', PE: 'Perú', MX: 'México', CO: 'Colombia', AR: 'Argentina' };

const EMPTY = {
  company_id: '',
  reporter_email: '',
  reporter_name: '',
  title: '',
  description: '',
  category: 'service_quality',
  severity: '',
  evidence_url: '',
  incident_date: '',
};

const between = (n: number, min: number, max: number) => n >= min && n <= max;

function validate(f: typeof EMPTY): Errors {
  const e: Errors = {};
  if (!f.company_id) e.company_id = 'Elige el proveedor del reclamo.';
  const email = f.reporter_email.trim();
  if (!email) e.reporter_email = 'Escribe tu email: ahí te llega el enlace para verificar el reclamo.';
  else if (!EMAIL_RE.test(email)) e.reporter_email = 'Revisa el email: parece incompleto (ejemplo: nombre@dominio.cl).';
  const t = f.title.trim().length;
  if (!between(t, 10, 200)) e.title = t === 0 ? 'Escribe un título de 10 a 200 caracteres.' : `El título debe tener de 10 a 200 caracteres (tiene ${t}).`;
  const d = f.description.trim().length;
  if (!between(d, 50, 5000))
    e.description = d === 0 ? 'Cuenta qué pasó, en 50 a 5.000 caracteres.' : `La descripción debe tener de 50 a 5.000 caracteres (tiene ${formatInteger(d)}).`;
  const sev = Number(f.severity);
  if (!Number.isInteger(sev) || !between(sev, 1, 5)) e.severity = 'Elige la severidad, de 1 a 5.';
  const url = f.evidence_url.trim();
  if (url && !/^https?:\/\/\S+\.\S+/.test(url)) e.evidence_url = 'El enlace debe empezar con https:// (o déjalo en blanco).';
  return e;
}

const Optional = () => <span className="font-normal text-ink-3">(opcional)</span>;

const ErrorText: React.FC<{ id: string; text?: string }> = ({ id, text }) =>
  text ? (
    <p id={id} className="text-sm font-medium text-destructive">
      {text}
    </p>
  ) : null;

interface ReclamoFormProps {
  companies: CompanyOption[];
  /** Envía el reclamo; lanza el error de la función si falla. */
  onSubmit: (payload: ComplaintPayload) => Promise<void>;
}

/**
 * Formulario de reclamo: el botón siempre está activo y la validación se hace
 * al enviar, con el mensaje junto a cada campo y el foco en el primero con error.
 * Obligatorios sin marca; los opcionales dicen «(opcional)».
 */
const ReclamoForm: React.FC<ReclamoFormProps> = ({ companies, onSubmit }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<FormNoticeStatus>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k as Field]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const grouped = companies.reduce<Record<string, CompanyOption[]>>((acc, c) => {
    (acc[c.country] ??= []).push(c);
    return acc;
  }, {});
  const countries = Object.keys(grouped);

  // Atributos de accesibilidad de cada campo: ayuda + error.
  const a11y = (field: Field, help?: string) => {
    const ids = [help, errors[field] ? `${FIELD_IDS[field]}-error` : undefined].filter(Boolean).join(' ');
    return { 'aria-invalid': errors[field] ? true : undefined, 'aria-describedby': ids || undefined };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const found = validate(form);
    setErrors(found);
    const first = (Object.keys(FIELD_IDS) as Field[]).find((k) => found[k]);
    if (first) {
      document.getElementById(FIELD_IDS[first])?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const email = form.reporter_email.trim();
      await onSubmit({ ...form, severity: Number(form.severity) });
      setStatus({
        kind: 'success',
        text: `Recibimos tu reclamo. Te enviamos un correo a ${email} para verificarlo: se publica cuando abras ese enlace.`,
      });
      setForm((f) => ({ ...f, title: '', description: '', evidence_url: '', reporter_email: '', reporter_name: '', severity: '', incident_date: '' }));
    } catch (err) {
      setStatus({ kind: 'error', text: await functionErrorText(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const field = 'space-y-2';
  const t = form.title.trim().length;
  const d = form.description.trim().length;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-xl border border-rule bg-white p-5 md:p-8">
      <p className="t-meta">Todos los campos son obligatorios, salvo los que dicen «(opcional)».</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className={field}>
          <Label htmlFor="company">Proveedor</Label>
          <Select value={form.company_id} onValueChange={(v) => set('company_id', v)}>
            <SelectTrigger id="company" aria-required className="h-11 rounded-lg border-input" {...a11y('company_id')}>
              <SelectValue placeholder="Elige un proveedor" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((cc) => (
                <SelectGroup key={cc}>
                  {countries.length > 1 && (
                    <SelectLabel className="text-xs font-semibold text-ink-3">{COUNTRY_LABELS[cc] || cc}</SelectLabel>
                  )}
                  {grouped[cc].map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <ErrorText id="company-error" text={errors.company_id} />
        </div>
        <div className={field}>
          <Label htmlFor="category">Categoría</Label>
          <Select value={form.category} onValueChange={(v) => set('category', v)}>
            <SelectTrigger id="category" aria-required className="h-11 rounded-lg border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={field}>
          <Label htmlFor="email">Tu email</Label>
          <Input id="email" type="email" autoComplete="email" aria-required value={form.reporter_email} onChange={(e) => set('reporter_email', e.target.value)} {...a11y('reporter_email', 'email-help')} />
          <p id="email-help" className="t-meta">Te enviamos ahí el enlace para verificar. No se publica.</p>
          <ErrorText id="email-error" text={errors.reporter_email} />
        </div>
        <div className={field}>
          <Label htmlFor="name">
            Tu nombre <Optional />
          </Label>
          <Input id="name" autoComplete="name" maxLength={100} value={form.reporter_name} onChange={(e) => set('reporter_name', e.target.value)} />
        </div>
      </div>

      <div className={field}>
        <Label htmlFor="title">Título del reclamo</Label>
        <Input id="title" aria-required maxLength={200} value={form.title} onChange={(e) => set('title', e.target.value)} {...a11y('title', 'title-help')} />
        <p className="t-meta flex justify-between gap-3">
          <span id="title-help">De 10 a 200 caracteres.</span>
          <span className="tabular" aria-hidden>
            {t} / 200
          </span>
        </p>
        <ErrorText id="title-error" text={errors.title} />
      </div>

      <div className={field}>
        <Label htmlFor="desc">Descripción detallada</Label>
        <Textarea id="desc" aria-required maxLength={5000} rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} {...a11y('description', 'desc-help')} />
        <p className="t-meta flex justify-between gap-3">
          <span id="desc-help">De 50 a 5.000 caracteres. Cuenta qué pasó, cuándo y qué respuesta recibiste.</span>
          <span className="tabular shrink-0" aria-hidden>
            {formatInteger(d)} / 5.000
          </span>
        </p>
        <ErrorText id="desc-error" text={errors.description} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className={field}>
          <Label htmlFor="severity">Severidad</Label>
          <Select value={form.severity} onValueChange={(v) => set('severity', v)}>
            <SelectTrigger id="severity" aria-required className="h-11 rounded-lg border-input" {...a11y('severity', 'severity-help')}>
              <SelectValue placeholder="Elige de 1 a 5" />
            </SelectTrigger>
            <SelectContent>
              {SEVERITIES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p id="severity-help" className="t-meta">1 es menor y 5, crítico.</p>
          <ErrorText id="severity-error" text={errors.severity} />
        </div>
        <div className={field}>
          <Label htmlFor="incident">
            Fecha del incidente <Optional />
          </Label>
          <Input id="incident" type="date" value={form.incident_date} onChange={(e) => set('incident_date', e.target.value)} />
        </div>
        <div className={field}>
          <Label htmlFor="evidence">
            Enlace a la evidencia <Optional />
          </Label>
          <Input id="evidence" type="url" inputMode="url" placeholder="https://…" value={form.evidence_url} onChange={(e) => set('evidence_url', e.target.value)} {...a11y('evidence_url')} />
          <ErrorText id="evidence-error" text={errors.evidence_url} />
        </div>
      </div>

      <p className="t-meta">
        Al enviar, recibirás un email para verificar tu reclamo. Solo se publican reclamos verificados. Datos personales no
        se exponen públicamente.
      </p>
      <FormNotice status={status} />
      <Button type="submit" variant="brand" disabled={submitting} className="w-full md:w-auto">
        {submitting ? 'Enviando…' : 'Enviar reclamo'}
      </Button>
    </form>
  );
};

export default ReclamoForm;
