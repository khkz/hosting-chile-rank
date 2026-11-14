import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { functionErrorText } from '@/lib/functionError';
import { CharCount, FormAlert, FormSuccess, RequiredNote } from './campos';
import { asSentence, fieldLabel, selectTrigger } from './formStyles';
import { CONTACT_EMAIL, CONTACT_RESPONSE_TIME } from './contacto';

const ASUNTO_MIN = 5;
const ASUNTO_MAX = 200;
const MENSAJE_MIN = 20;
const MENSAJE_MAX = 1000;

// Nombres y valores: los espera la función submit-contact.
const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Revisa el email: debe tener la forma nombre@dominio.cl" }),
  asunto: z.string().min(ASUNTO_MIN, { message: `El asunto debe tener al menos ${ASUNTO_MIN} caracteres` }),
  mensaje: z.string()
    .min(MENSAJE_MIN, { message: `El mensaje debe tener al menos ${MENSAJE_MIN} caracteres` })
    .max(MENSAJE_MAX, { message: "El mensaje no puede exceder 1.000 caracteres" }),
  tipoConsulta: z.enum(["consulta_general", "soporte_tecnico", "colaboracion", "reportar_error", "sugerencia", "otro"], {
    required_error: "Selecciona el tipo de consulta",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULTS: FormValues = {
  nombre: "",
  email: "",
  asunto: "",
  mensaje: "",
  tipoConsulta: undefined as unknown as FormValues['tipoConsulta'],
};

const TIPOS = [
  { value: 'consulta_general', label: 'Consulta general' },
  { value: 'soporte_tecnico', label: 'Soporte técnico' },
  { value: 'colaboracion', label: 'Propuesta de colaboración' },
  { value: 'reportar_error', label: 'Reportar un error' },
  { value: 'sugerencia', label: 'Sugerencia' },
  { value: 'otro', label: 'Otro' },
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Formulario de contacto: envío a submit-contact; error y éxito en la misma tarjeta. */
const ContactoForm: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');
  const [sentTo, setSentTo] = useState('');
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: DEFAULTS });
  const refocus = useRef(false);

  useEffect(() => {
    // Al volver de la confirmación, el foco va al primer campo.
    if (status === 'idle' && refocus.current) {
      refocus.current = false;
      form.setFocus('nombre');
    }
  }, [status, form]);

  const onSubmit = async (data: FormValues) => {
    setStatus('sending');
    try {
      const { data: result, error } = await supabase.functions.invoke('submit-contact', { body: data });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setSentTo(data.email);
      form.reset(DEFAULTS);
      setStatus('sent');
    } catch (err) {
      console.error('Error al enviar formulario:', err);
      setErrorText(asSentence(await functionErrorText(err)));
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <FormSuccess title="Recibimos tu mensaje" resetLabel="Enviar otro mensaje" onReset={() => { refocus.current = true; setStatus('idle'); }}>
        <p>
          Te responderemos en un plazo de {CONTACT_RESPONSE_TIME}. Te enviamos una confirmación a{' '}
          <strong className="font-semibold text-ink">{sentTo}</strong>.
        </p>
        <p>Si no la ves, revisa la carpeta de spam o promociones.</p>
      </FormSuccess>
    );
  }

  const sending = status === 'sending';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
        <RequiredNote />
        <div className="grid gap-6 md:grid-cols-2">
          <FormField control={form.control} name="nombre" render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldLabel}>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" autoComplete="name" aria-required="true" maxLength={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldLabel}>Email</FormLabel>
              <FormControl>
                <Input placeholder="tu@email.com" type="email" inputMode="email" autoComplete="email" aria-required="true" maxLength={255} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="tipoConsulta" render={({ field }) => (
          <FormItem>
            <FormLabel className={fieldLabel}>Tipo de consulta</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ''}>
              <FormControl>
                <SelectTrigger className={selectTrigger} aria-required="true">
                  <SelectValue placeholder="Selecciona el tipo de consulta" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TIPOS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="asunto" render={({ field }) => (
          <FormItem>
            <FormLabel className={fieldLabel}>Asunto</FormLabel>
            <FormControl>
              <Input placeholder="De qué se trata, en pocas palabras" aria-required="true" maxLength={ASUNTO_MAX} {...field} />
            </FormControl>
            <FormDescription className="t-meta">
              <CharCount value={field.value} min={ASUNTO_MIN} max={ASUNTO_MAX} />
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="mensaje" render={({ field }) => (
          <FormItem>
            <FormLabel className={fieldLabel}>Mensaje</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Cuéntanos tu duda o el dato a corregir. Si es sobre un proveedor, incluye su sitio."
                className="min-h-[140px] resize-y"
                maxLength={MENSAJE_MAX}
                aria-required="true"
                {...field}
              />
            </FormControl>
            <FormDescription className="t-meta">
              <CharCount value={field.value} min={MENSAJE_MIN} max={MENSAJE_MAX} />
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        {status === 'error' && (
          <FormAlert title="No pudimos enviar tu mensaje">
            <p>
              {errorText} Tu mensaje sigue en el formulario. Si el problema continúa, escríbenos a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-ink underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </FormAlert>
        )}

        <Button type="submit" variant="brand" size="lg" className="w-full sm:w-auto" disabled={sending}>
          {sending ? 'Enviando…' : 'Enviar mensaje'}
        </Button>
      </form>
    </Form>
  );
};

export default ContactoForm;
