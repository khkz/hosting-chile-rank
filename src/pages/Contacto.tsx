
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Esquema para la validación del formulario
const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Ingresa un email válido" }),
  asunto: z.string().min(5, { message: "El asunto debe tener al menos 5 caracteres" }),
  mensaje: z.string().min(20, { message: "El mensaje debe tener al menos 20 caracteres" }).max(1000, { message: "El mensaje no puede exceder 1000 caracteres" }),
  tipoConsulta: z.enum(["consulta_general", "soporte_tecnico", "colaboracion", "reportar_error", "sugerencia", "otro"], {
    required_error: "Selecciona el tipo de consulta",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Contacto = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Configuración del formulario
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      asunto: "",
      mensaje: "",
      tipoConsulta: undefined,
    },
  });

  useEffect(() => {
    document.title = "Contacto | eligetuhosting.cl";
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // En un caso real, aquí enviarías los datos a tu backend
      console.log("Datos del formulario:", data);
      
      // Simulamos una demora en el proceso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Mensaje enviado con éxito",
        description: "Responderemos a tu consulta lo antes posible. ¡Gracias por contactarnos!",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error al enviar el formulario",
        description: "Por favor intenta nuevamente más tarde.",
        variant: "destructive"
      });
      console.error("Error al enviar formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contacto | eligetuhosting.cl</title>
        <meta 
          name="description" 
          content="Contáctanos para resolver tus dudas sobre hosting en Chile. Estamos aquí para ayudarte a encontrar el mejor servicio para tu sitio web." 
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "contacto@eligetuhosting.cl",
              "telephone": "+56912345678",
              "areaServed": "CL",
              "availableLanguage": ["Spanish"]
            }
          })}
        </script>
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#F7F9FC] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-4">
              Contacto
            </h1>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">
              ¿Tienes preguntas o sugerencias? Estamos aquí para ayudarte.
              Completa el formulario y nos pondremos en contacto contigo lo antes posible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {/* Formulario de contacto */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Envíanos un mensaje</CardTitle>
                <CardDescription>
                  Responderemos a tu consulta en menos de 24 horas
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
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Tu nombre" {...field} />
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
                              <Input placeholder="tu@email.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="tipoConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de consulta</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo de consulta" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="consulta_general">Consulta general</SelectItem>
                              <SelectItem value="soporte_tecnico">Soporte técnico</SelectItem>
                              <SelectItem value="colaboracion">Propuesta de colaboración</SelectItem>
                              <SelectItem value="reportar_error">Reportar un error</SelectItem>
                              <SelectItem value="sugerencia">Sugerencia</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="asunto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asunto</FormLabel>
                          <FormControl>
                            <Input placeholder="Asunto de tu mensaje" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mensaje"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensaje</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Escribe tu mensaje aquí..." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Máximo 1000 caracteres
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#EF233C]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Información de contacto */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#EDF2F4] p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF233C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Teléfono</h3>
                      <p className="text-gray-600">+56 9 1234 5678</p>
                      <p className="text-xs text-gray-500 mt-1">Lunes a viernes: 9:00 - 18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-[#EDF2F4] p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF233C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">contacto@eligetuhosting.cl</p>
                      <p className="text-xs text-gray-500 mt-1">Respuesta en menos de 24 horas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-[#EDF2F4] p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF233C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Dirección</h3>
                      <p className="text-gray-600">Av. Providencia 1650, Of. 303</p>
                      <p className="text-gray-600">Santiago, Chile</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preguntas frecuentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">¿Cuánto tiempo tardan en responder?</h3>
                    <p className="text-sm text-gray-600">Respondemos todas las consultas en un plazo máximo de 24 horas hábiles.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">¿Ofrecen asesoría técnica personalizada?</h3>
                    <p className="text-sm text-gray-600">Sí, contamos con un equipo técnico especializado que puede ayudarte con consultas específicas sobre hosting y dominios.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">¿Cómo puedo colaborar con el sitio?</h3>
                    <p className="text-sm text-gray-600">Estamos abiertos a colaboraciones. Envíanos tu propuesta a través del formulario seleccionando "Propuesta de colaboración".</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Síguenos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <a 
                      href="https://twitter.com/eligetuhosting" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#EDF2F4] p-2 rounded-full hover:bg-gray-200"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4.01C21 4.5 20.02 4.84 19 5C18.05 4.13 16.77 3.56 15.36 3.56C12.78 3.56 10.67 5.67 10.67 8.24C10.67 8.63 10.7 9.01 10.76 9.36C6.83 9.15 3.33 7.28 1.08 4.45C0.8 5.06 0.67 5.75 0.67 6.46C0.67 7.79 1.3 9.01 2.28 9.72C1.68 9.7 1.13 9.55 0.67 9.31V9.35C0.67 11.64 2.26 13.53 4.37 13.96C4.01 14.05 3.63 14.11 3.24 14.11C3.05 14.11 2.87 14.09 2.69 14.06C3.06 15.92 4.74 17.31 6.77 17.35C5.23 18.63 3.24 19.39 1.08 19.39C0.81 19.39 0.54 19.38 0.27 19.35C2.32 20.68 4.76 21.46 7.38 21.46C15.36 21.46 19.76 14.4 19.76 8.35C19.76 8.13 19.76 7.92 19.75 7.7C20.76 6.95 21.63 6.01 22.27 4.95L22 4.01Z" fill="#EF233C"/>
                      </svg>
                    </a>
                    <a 
                      href="https://facebook.com/eligetuhosting" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#EDF2F4] p-2 rounded-full hover:bg-gray-200"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12.06C22 6.53 17.5 2 12 2C6.5 2 2 6.53 2 12.06C2 17 5.66 21.09 10.44 21.87V14.89H7.9V12.06H10.44V9.91C10.44 7.42 11.93 5.99 14.22 5.99C15.31 5.99 16.45 6.19 16.45 6.19V8.67H15.19C13.95 8.67 13.56 9.52 13.56 10.39V12.06H16.34L15.89 14.89H13.56V21.87C18.34 21.09 22 17 22 12.06Z" fill="#EF233C"/>
                      </svg>
                    </a>
                    <a 
                      href="https://linkedin.com/company/eligetuhosting" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#EDF2F4] p-2 rounded-full hover:bg-gray-200"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" fill="#EF233C"/>
                      </svg>
                    </a>
                    <a 
                      href="https://instagram.com/eligetuhosting" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#EDF2F4] p-2 rounded-full hover:bg-gray-200"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" fill="#EF233C"/>
                      </svg>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Contacto;
