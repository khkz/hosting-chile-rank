import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import PageHeader from '@/components/system/PageHeader';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { functionErrorText } from '@/lib/functionError';
import RatingField from '@/components/marco/votacion/RatingField';
import VotaAside from '@/components/marco/votacion/VotaAside';

// Esquema de validación para el formulario
const formSchema = z
  .object({
    nombreProveedor: z.string().min(1, { message: 'Elige tu proveedor de la lista o «Otro».' }),
    otroProveedor: z.string().optional(),
    calificacionGeneral: z.string().min(1, { message: 'Califica tu experiencia general, de 1 a 5.' }),
    calificacionSoporte: z.string().min(1, { message: 'Califica el soporte técnico, de 1 a 5.' }),
    calificacionVelocidad: z.string().min(1, { message: 'Califica la velocidad, de 1 a 5.' }),
    calificacionPrecio: z.string().min(1, { message: 'Califica la relación precio/calidad, de 1 a 5.' }),
    comentario: z
      .string()
      .min(10, { message: 'Escribe al menos 10 caracteres sobre tu experiencia.' })
      .max(500, { message: 'El comentario puede tener hasta 500 caracteres.' }),
    email: z.string().email({ message: 'Escribe un email válido (ejemplo: nombre@dominio.cl).' }),
    nombre: z.string().min(2, { message: 'Escribe tu nombre o un apodo.' }),
    autorizacion: z.boolean().refine((val) => val === true, {
      message: 'Para enviarla, autoriza la publicación de tu reseña.',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.nombreProveedor === 'Otro' && (data.otroProveedor ?? '').trim().length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['otroProveedor'], message: 'Escribe el nombre del proveedor.' });
    }
  });

// Lista de proveedores de hosting (escrita a mano; ver informe: debería venir de la base).
const proveedoresHosting = [
  "HostingPlus",
  "EcoHosting",
  "1Hosting",
  "Hosting.cl",
  "PlanetaHosting",
  "Hostname",
  "WebHosting.cl",
  "HostingPro",
  "ChileHosting",
  "HostingFacil",
  "DonWeb",
  "GoDaddy",
  "Otro"
];

const RATINGS = [
  { name: 'calificacionGeneral', label: 'Experiencia general' },
  { name: 'calificacionSoporte', label: 'Soporte técnico' },
  { name: 'calificacionVelocidad', label: 'Velocidad del servicio' },
  { name: 'calificacionPrecio', label: 'Relación precio/calidad' },
] as const;

const VotaHosting = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuración del formulario con React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreProveedor: "",
      otroProveedor: "",
      calificacionGeneral: "",
      calificacionSoporte: "",
      calificacionVelocidad: "",
      calificacionPrecio: "",
      comentario: "",
      email: "",
      nombre: "",
      autorizacion: false,
    },
  });

  useEffect(() => {
    document.title = "Vota por tu Hosting | EligeTuHosting.cl";
  }, []);

  const otroProveedorVisible = form.watch("nombreProveedor") === "Otro";
  const comentarioLength = form.watch("comentario").length;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const proveedor = data.nombreProveedor === "Otro" ? (data.otroProveedor ?? "").trim() : data.nombreProveedor;

      const { data: result, error } = await supabase.functions.invoke('submit-review', {
        body: {
          proveedor,
          nombre: data.nombre,
          email: data.email,
          comentario: data.comentario,
          calificacionGeneral: data.calificacionGeneral,
          calificacionSoporte: data.calificacionSoporte,
          calificacionVelocidad: data.calificacionVelocidad,
          calificacionPrecio: data.calificacionPrecio,
        },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      toast({
        title: "¡Gracias por tu reseña!",
        description: "Tu reseña fue enviada y será revisada antes de publicarse. Recibirás un email de confirmación.",
      });

      form.reset();
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      toast({
        title: "No pudimos enviar tu reseña",
        description: await functionErrorText(error),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Vota por tu Hosting | EligeTuHosting.cl</title>
        <meta
          name="description"
          content="Comparte tu experiencia con tu proveedor de hosting y ayuda a otros usuarios a tomar mejores decisiones. Tu opinión es importante."
        />
      </Helmet>

      <Navbar />

      <main>
        <PageHeader
          title="Vota por tu hosting favorito"
          lead="Cuéntanos cómo te ha ido con tu proveedor de hosting. Tu experiencia ayuda a otras personas a elegir mejor."
        />

        <div className="bg-paper">
          <div className="container grid gap-8 py-12 md:py-16 lg:grid-cols-12">
            {/* Formulario de votación */}
            <section aria-labelledby="comparte-experiencia" className="rounded-xl border border-rule bg-white p-5 md:p-8 lg:col-span-7">
              <h2 id="comparte-experiencia" className="t-h2 text-ink">Comparte tu experiencia</h2>
              <p className="t-small mt-2 text-ink-2">Evalúa a tu proveedor de hosting actual. Todos los campos son obligatorios.</p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="nombreProveedor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proveedor de hosting</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger aria-required className="h-11 rounded-lg border-input">
                              <SelectValue placeholder="Elige tu proveedor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {proveedoresHosting.map((proveedor) => (
                              <SelectItem key={proveedor} value={proveedor}>
                                {proveedor}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {otroProveedorVisible && (
                    <FormField
                      control={form.control}
                      name="otroProveedor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del proveedor</FormLabel>
                          <FormControl>
                            <Input placeholder="Por ejemplo, el nombre que aparece en tu factura" aria-required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div role="group" aria-labelledby="calificaciones-titulo" className="space-y-5 border-t border-rule pt-6">
                    <div>
                      <h3 id="calificaciones-titulo" className="t-h3 text-ink">Calificaciones</h3>
                      <p id="ayuda-escala" className="t-meta mt-1">
                        1 es muy malo y 5, excelente.
                      </p>
                    </div>
                    {RATINGS.map((r) => (
                      <RatingField key={r.name} control={form.control} name={r.name} label={r.label} helpId="ayuda-escala" />
                    ))}
                  </div>

                  <FormField
                    control={form.control}
                    name="comentario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tu comentario</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="¿Qué te gustó y qué no? Soporte, velocidad, precio…"
                            className="resize-none"
                            maxLength={500}
                            aria-required
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription className="t-meta flex justify-between gap-3">
                          <span>De 10 a 500 caracteres.</span>
                          <span className="tabular" aria-hidden>{comentarioLength} / 500</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 border-t border-rule pt-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre o apodo" autoComplete="name" aria-required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="tu@email.com" type="email" autoComplete="email" aria-required {...field} />
                          </FormControl>
                          <FormDescription className="t-meta">No se publica.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="autorizacion"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            aria-required
                            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-sm border-input accent-ink"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="cursor-pointer leading-snug">Autorizo la publicación de mi reseña</FormLabel>
                          <FormDescription className="t-meta">
                            Tu email no se publicará. Nos reservamos el derecho de editar contenido inapropiado.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" variant="brand" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando…" : "Enviar mi valoración"}
                  </Button>
                </form>
              </Form>
            </section>

            {/* Reseñas recientes y por qué votar */}
            <div className="lg:col-span-5">
              <VotaAside />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VotaHosting;
