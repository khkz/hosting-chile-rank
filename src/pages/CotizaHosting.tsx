
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// EmailJS configuration
const SERVICE_ID = "service_rlq4gaf";
const TEMPLATE_ID = "template_uzxrs2d";
const PUBLIC_KEY = "9wS_UPfV9q3-ZJeBZ";

// Schema de validación para el formulario
const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefono: z.string().min(1, { message: "El teléfono es obligatorio" }),
  tipoProyecto: z.enum(["sitio_personal", "sitio_empresa", "tienda_online", "aplicacion", "otro"], {
    required_error: "Selecciona el tipo de proyecto",
  }),
  descripcion: z.string().min(10, { message: "Por favor describe brevemente tu proyecto" }).max(500),
  presupuestoMensual: z.enum(["menos_5000", "5000_10000", "10000_20000", "mas_20000"], {
    required_error: "Selecciona un rango de presupuesto",
  }),
  caracteristicas: z.array(z.string()).optional(),
  urgencia: z.enum(["baja", "media", "alta"], {
    required_error: "Selecciona el nivel de urgencia",
  }),
  condiciones: z.boolean().refine(val => val === true, {
    message: "Debes aceptar las condiciones",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CotizaHosting = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlParams, setUrlParams] = useState(new URLSearchParams());
  const [caracteristicas, setCaracteristicas] = useState([
    { id: "ssl", label: "Certificado SSL" },
    { id: "litespeed", label: "Servidor LiteSpeed" },
    { id: "backups", label: "Backups diarios" },
    { id: "cdn", label: "CDN incluido" },
    { id: "emails", label: "Correos corporativos" },
    { id: "waf", label: "Firewall WAF" },
    { id: "soporte24", label: "Soporte 24/7" }
  ]);

  // Configuración del formulario con React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      tipoProyecto: undefined,
      descripcion: "",
      presupuestoMensual: undefined,
      caracteristicas: [],
      urgencia: undefined,
      condiciones: false,
    },
  });

  useEffect(() => {
    document.title = "Cotiza tu hosting ideal | eligetuhosting.cl";
    // Capture URL parameters for lead tracking
    setUrlParams(new URLSearchParams(window.location.search));
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
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
      toast({
        title: "¡Cotización enviada con éxito!",
        description: "Te responderemos en las próximas 24 h con opciones personalizadas.",
      });
      form.reset();
    } catch (err) {
      toast({
        title: "Error al enviar",
        description: "Intenta nuevamente más tarde.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Cotiza tu hosting ideal | eligetuhosting.cl</title>
        <meta 
          name="description" 
          content="Solicita una cotización personalizada de hosting para tu proyecto web. Compara las mejores opciones del mercado chileno adaptadas a tus necesidades." 
        />
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#F7F9FC] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-4">
              Cotiza tu hosting ideal
            </h1>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">
              Completa el formulario y nuestro equipo te enviará una cotización personalizada 
              con las mejores opciones que se ajusten a tus necesidades específicas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Formulario de cotización */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Solicitud de cotización</CardTitle>
                <CardDescription>
                  Cuéntanos sobre tu proyecto para recomendarte el mejor servicio de hosting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Juan Pérez" {...field} />
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
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input placeholder="juan@ejemplo.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="telefono"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="+56 9 1234 5678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tipoProyecto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de proyecto</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo de proyecto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sitio_personal">Sitio web personal</SelectItem>
                              <SelectItem value="sitio_empresa">Sitio web empresarial</SelectItem>
                              <SelectItem value="tienda_online">Tienda online</SelectItem>
                              <SelectItem value="aplicacion">Aplicación web</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción del proyecto</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Por favor describe brevemente tu proyecto y tus requisitos específicos" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Máximo 500 caracteres
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="presupuestoMensual"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Presupuesto mensual aproximado</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="menos_5000" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Menos de $5.000
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="5000_10000" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  $5.000 - $10.000
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="10000_20000" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  $10.000 - $20.000
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="mas_20000" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Más de $20.000
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="caracteristicas"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Características deseadas</FormLabel>
                            <FormDescription>
                              Selecciona todas las que apliquen
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {caracteristicas.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="caracteristicas"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], item.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="urgencia"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Nivel de urgencia</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="baja" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Baja (1-2 semanas)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="media" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Media (Esta semana)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="alta" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Alta (Lo antes posible)
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="condiciones"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Acepto las condiciones de uso y política de privacidad
                            </FormLabel>
                            <FormDescription>
                              Nos contactaremos contigo por email con la cotización personalizada.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#EF233C]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando solicitud..." : "Solicitar cotización"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Aside con información adicional */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>¿Por qué cotizar con nosotros?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#EF233C] p-2 rounded-full text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Comparativa imparcial</h3>
                      <p className="text-sm text-gray-600">Analizamos múltiples proveedores para recomendarte la mejor opción.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-[#EF233C] p-2 rounded-full text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Asesoría gratuita</h3>
                      <p className="text-sm text-gray-600">Te explicamos las ventajas y desventajas de cada opción.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-[#EF233C] p-2 rounded-full text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Descuentos exclusivos</h3>
                      <p className="text-sm text-gray-600">Conseguimos mejores precios que contratando directamente.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-[#EF233C] p-2 rounded-full text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Soporte post-contratación</h3>
                      <p className="text-sm text-gray-600">Te ayudamos si surgen problemas después de contratar el servicio.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recomendación destacada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="/lovable-uploads/528891ff-3b55-486e-a927-e4f6d373a3c5.png" 
                      alt="HostingPlus" 
                      className="h-12"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Velocidad</span>
                      <span className="font-medium">9.8/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#EF233C] h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Soporte técnico</span>
                      <span className="font-medium">9.9/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#EF233C] h-2 rounded-full" style={{ width: '99%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Relación calidad/precio</span>
                      <span className="font-medium">9.6/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#EF233C] h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <a 
                      href="https://www.hostingplus.cl/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Ver planes
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Sección de testimonios */}
          <section className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-[#2B2D42] mb-8">
              Lo que dicen nuestros clientes
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "Encontraron exactamente lo que necesitaba para mi tienda online. 
                    El proceso fue muy fácil y transparente."
                  </p>
                  <div>
                    <p className="font-medium">María González</p>
                    <p className="text-sm text-gray-500">Dueña de Mi Tienda Online</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "Me ahorraron horas de investigación. La recomendación fue perfecta 
                    y conseguí un descuento que no habría obtenido solo."
                  </p>
                  <div>
                    <p className="font-medium">Carlos Mendoza</p>
                    <p className="text-sm text-gray-500">Desarrollador Web</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "Excelente servicio post-contratación. Cuando tuve problemas 
                    técnicos me ayudaron a resolverlos rápidamente."
                  </p>
                  <div>
                    <p className="font-medium">Ana Silva</p>
                    <p className="text-sm text-gray-500">Emprendedora Digital</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Sección de proveedores destacados */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-[#2B2D42] text-center mb-8">
              Proveedores que recomendamos
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <img 
                    src="/lovable-uploads/528891ff-3b55-486e-a927-e4f6d373a3c5.png"
                    alt="HostingPlus"
                    className="h-12 mx-auto mb-4"
                    loading="lazy"
                  />
                  <h3 className="font-semibold mb-2">HostingPlus</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Líder en velocidad y soporte técnico
                  </p>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Puntuación:</span>
                      <span className="font-bold text-[#EF233C]">9.8/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desde:</span>
                      <span className="font-bold">$2.990/mes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <img 
                    src="/logo-hostgator.svg"
                    alt="HostGator"
                    className="h-12 mx-auto mb-4"
                    loading="lazy"
                  />
                  <h3 className="font-semibold mb-2">HostGator</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Mejor relación calidad/precio
                  </p>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Puntuación:</span>
                      <span className="font-bold text-[#EF233C]">9.2/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desde:</span>
                      <span className="font-bold">$1.990/mes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <img 
                    src="/logo-bluehost.svg"
                    alt="Bluehost"
                    className="h-12 mx-auto mb-4"
                    loading="lazy"
                  />
                  <h3 className="font-semibold mb-2">Bluehost</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Especialista en WordPress
                  </p>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Puntuación:</span>
                      <span className="font-bold text-[#EF233C]">9.0/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desde:</span>
                      <span className="font-bold">$2.490/mes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <img 
                    src="/logo-godaddy.svg"
                    alt="GoDaddy"
                    className="h-12 mx-auto mb-4"
                    loading="lazy"
                  />
                  <h3 className="font-semibold mb-2">GoDaddy</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Solución integral con dominios
                  </p>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Puntuación:</span>
                      <span className="font-bold text-[#EF233C]">8.8/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desde:</span>
                      <span className="font-bold">$2.190/mes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-[#2B2D42] text-center mb-8">
              Preguntas frecuentes
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">¿Es gratuito solicitar una cotización?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Sí, completamente gratuito. Nuestro servicio de asesoría no tiene costo y 
                    solo cobramos comisiones a los proveedores, nunca al cliente final.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">¿En cuánto tiempo recibo la cotización?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Normalmente respondemos en menos de 24 horas con opciones personalizadas. 
                    En casos urgentes podemos responder el mismo día.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">¿Qué incluye la asesoría?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Incluye comparativa de proveedores, recomendación personalizada, negociación 
                    de descuentos exclusivos y soporte post-contratación sin costo adicional.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">¿Puedo cambiar de proveedor después?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Sí, te ayudamos con migraciones gratuitas si no estás conforme con tu 
                    proveedor actual. Tenemos acuerdos especiales para facilitar el proceso.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* CTA final */}
          <section className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-[#EF233C] to-[#D90429] text-white">
              <CardContent className="py-12">
                <h2 className="text-3xl font-bold mb-4">
                  ¿Listo para encontrar tu hosting ideal?
                </h2>
                <p className="text-xl mb-6 opacity-90">
                  Más de 2,500 empresas han confiado en nosotros
                </p>
                <div className="flex justify-center space-x-8 text-center">
                  <div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm opacity-80">Satisfacción</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">24h</div>
                    <div className="text-sm opacity-80">Respuesta promedio</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">30%</div>
                    <div className="text-sm opacity-80">Ahorro promedio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CotizaHosting;
