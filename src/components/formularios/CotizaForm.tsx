import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/format';
import { functionErrorText } from '@/lib/functionError';
import { CharCount, FormAlert, FormSuccess, Optional, RequiredNote } from './campos';
import { CONTACT_EMAIL } from './contacto';
import { asSentence, choiceControl, choiceLabel, choiceRow, fieldLabel, selectTrigger } from './formStyles';

// EmailJS configuration
const SERVICE_ID = "service_rlq4gaf";
const TEMPLATE_ID = "template_uzxrs2d";
const PUBLIC_KEY = "9wS_UPfV9q3-ZJeBZ";

const DESCRIPCION_MIN = 10;
const DESCRIPCION_MAX = 500;

// Schema de validación (nombres y valores: los usa la plantilla de EmailJS).
const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Revisa el email: debe tener la forma nombre@dominio.cl" }),
  telefono: z.string().min(1, { message: "Escribe un teléfono para coordinar la cotización" }),
  tipoProyecto: z.enum(["sitio_personal", "sitio_empresa", "tienda_online", "aplicacion", "otro"], {
    required_error: "Selecciona el tipo de proyecto",
  }),
  descripcion: z.string()
    .min(DESCRIPCION_MIN, { message: `Cuéntanos un poco más: al menos ${DESCRIPCION_MIN} caracteres` })
    .max(DESCRIPCION_MAX),
  presupuestoMensual: z.enum(["menos_5000", "5000_10000", "10000_20000", "mas_20000"], {
    required_error: "Selecciona un rango de presupuesto",
  }),
  caracteristicas: z.array(z.string()).optional(),
  urgencia: z.enum(["baja", "media", "alta"], {
    required_error: "Selecciona el nivel de urgencia",
  }),
  condiciones: z.boolean().refine(val => val === true, {
    message: "Para enviar la solicitud tienes que aceptar las condiciones",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULTS: FormValues = {
  nombre: "",
  email: "",
  telefono: "",
  tipoProyecto: undefined as unknown as FormValues['tipoProyecto'],
  descripcion: "",
  presupuestoMensual: undefined as unknown as FormValues['presupuestoMensual'],
  caracteristicas: [],
  urgencia: undefined as unknown as FormValues['urgencia'],
  condiciones: false,
};

const PROYECTOS = [
  { value: 'sitio_personal', label: 'Sitio web personal' },
  { value: 'sitio_empresa', label: 'Sitio web empresarial' },
  { value: 'tienda_online', label: 'Tienda online' },
  { value: 'aplicacion', label: 'Aplicación web' },
  { value: 'otro', label: 'Otro' },
];

const PRESUPUESTOS = [
  { value: 'menos_5000', label: `Menos de ${formatMoney(5000)} al mes` },
  { value: '5000_10000', label: `Entre ${formatMoney(5000)} y ${formatMoney(10000)} al mes` },
  { value: '10000_20000', label: `Entre ${formatMoney(10000)} y ${formatMoney(20000)} al mes` },
  { value: 'mas_20000', label: `Más de ${formatMoney(20000)} al mes` },
];

const URGENCIAS = [
  { value: 'baja', label: 'Baja (1 a 2 semanas)' },
  { value: 'media', label: 'Media (esta semana)' },
  { value: 'alta', label: 'Alta (lo antes posible)' },
];

const CARACTERISTICAS = [
  { id: "ssl", label: "Certificado SSL" },
  { id: "litespeed", label: "Servidor LiteSpeed" },
  { id: "backups", label: "Backups diarios" },
  { id: "cdn", label: "CDN incluido" },
  { id: "emails", label: "Correos corporativos" },
  { id: "waf", label: "Firewall WAF" },
  { id: "soporte24", label: "Soporte 24/7" },
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Formulario de cotización: envío por EmailJS, error y éxito en la misma tarjeta. */
const CotizaForm: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [urlParams, setUrlParams] = useState(new URLSearchParams());

  const form = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: DEFAULTS });
  const refocus = useRef(false);

  useEffect(() => {
    // Al volver de la confirmación, el foco va al primer campo.
    if (status === 'idle' && refocus.current) {
      refocus.current = false;
      form.setFocus('nombre');
    }
  }, [status, form]);

  useEffect(() => {
    // Captura los parámetros de la URL para el seguimiento del lead
    setUrlParams(new URLSearchParams(window.location.search));
  }, []);

  const onSubmit = async (data: FormValues) => {
    setStatus('sending');
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          ...data,
          caracteristicas: (data.caracteristicas || []).join(", "),
          // Include UTM and ASN tracking data
          utm_source: urlParams.get('utm_source') || '',
          utm_campaign: urlParams.get('utm_campaign') || '',
          provider: urlParams.get('provider') || '',
          referral_page: window.location.href,
        },
        PUBLIC_KEY
      );
      setSentTo(data.email);
      form.reset(DEFAULTS);
      setStatus('sent');
    } catch (err) {
      console.error(err);
      setErrorText(asSentence(await functionErrorText(err)));
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <FormSuccess title="Recibimos tu solicitud" resetLabel="Enviar otra solicitud" onReset={() => { refocus.current = true; setStatus('idle'); }}>
        <p>
          Te responderemos en las próximas 24 horas con opciones personalizadas, al email{' '}
          <strong className="font-semibold text-ink">{sentTo}</strong>.
        </p>
        <p>Si no lo ves, revisa la carpeta de spam o promociones.</p>
      </FormSuccess>
    );
  }

  const sending = status === 'sending';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-7">
        <RequiredNote />
        <div className="grid gap-6 md:grid-cols-2">
          <FormField control={form.control} name="nombre" render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldLabel}>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" autoComplete="name" aria-required="true" maxLength={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldLabel}>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="juan@ejemplo.com" type="email" inputMode="email" autoComplete="email" aria-required="true" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="telefono" render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldLabel}>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="+56 9 1234 5678" type="tel" inputMode="tel" autoComplete="tel" aria-required="true" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="tipoProyecto" render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldLabel}>Tipo de proyecto</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger className={selectTrigger} aria-required="true">
                    <SelectValue placeholder="Selecciona el tipo de proyecto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROYECTOS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="descripcion" render={({ field }) => (
          <FormItem>
            <FormLabel className={fieldLabel}>Descripción del proyecto</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Qué vas a publicar, cuántas visitas esperas y qué necesitas (correo, tienda, WordPress…)"
                className="min-h-[120px] resize-y"
                maxLength={DESCRIPCION_MAX}
                aria-required="true"
                {...field}
              />
            </FormControl>
            <FormDescription className="t-meta">
              <CharCount value={field.value} min={DESCRIPCION_MIN} max={DESCRIPCION_MAX} />
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="presupuestoMensual" render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel id="cotiza-presupuesto" className={fieldLabel}>Presupuesto mensual aproximado</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value ?? ''} aria-labelledby="cotiza-presupuesto" aria-required="true" className="gap-0">
                {PRESUPUESTOS.map((o) => (
                  <div key={o.value} className={choiceRow}>
                    <RadioGroupItem id={`cotiza-presupuesto-${o.value}`} value={o.value} className={choiceControl} />
                    <Label htmlFor={`cotiza-presupuesto-${o.value}`} className={choiceLabel}>{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="caracteristicas" render={({ field }) => (
          <FormItem>
            <fieldset>
              <legend className={fieldLabel}>Características deseadas<Optional /></legend>
              <p className="t-meta mt-1">Marca todas las que te sirvan.</p>
              <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
                {CARACTERISTICAS.map((item) => (
                  <div key={item.id} className={choiceRow}>
                    <Checkbox
                      id={`cotiza-car-${item.id}`}
                      className={choiceControl}
                      checked={field.value?.includes(item.id) ?? false}
                      onCheckedChange={(checked) =>
                        checked
                          ? field.onChange([...(field.value || []), item.id])
                          : field.onChange((field.value || []).filter((value) => value !== item.id))
                      }
                    />
                    <Label htmlFor={`cotiza-car-${item.id}`} className={choiceLabel}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </fieldset>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="urgencia" render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel id="cotiza-urgencia" className={fieldLabel}>Nivel de urgencia</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value ?? ''} aria-labelledby="cotiza-urgencia" aria-required="true" className="gap-0">
                {URGENCIAS.map((o) => (
                  <div key={o.value} className={choiceRow}>
                    <RadioGroupItem id={`cotiza-urgencia-${o.value}`} value={o.value} className={choiceControl} />
                    <Label htmlFor={`cotiza-urgencia-${o.value}`} className={choiceLabel}>{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="condiciones" render={({ field }) => (
          <FormItem className="rounded-xl border border-rule p-4">
            <div className="flex items-start gap-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} aria-required="true" className={`${choiceControl} mt-0.5`} />
              </FormControl>
              <div className="min-w-0 space-y-1">
                <FormLabel className="cursor-pointer text-base font-semibold leading-snug text-ink md:text-[15px]">
                  Acepto las condiciones de uso y política de privacidad
                </FormLabel>
                <FormDescription className="t-meta">
                  Nos contactaremos contigo por email con la cotización personalizada.
                </FormDescription>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )} />

        {status === 'error' && (
          <FormAlert title="No pudimos enviar tu solicitud">
            <p>
              {errorText} Tus datos siguen en el formulario: puedes reintentar sin escribir nada de nuevo. Si el
              problema continúa, escríbenos a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-ink underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </FormAlert>
        )}

        <Button type="submit" variant="brand" size="lg" className="w-full" disabled={sending}>
          {sending ? 'Enviando solicitud…' : 'Solicitar cotización'}
        </Button>
      </form>
    </Form>
  );
};

export default CotizaForm;
