
import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

// Esquema de validación para el formulario
const formSchema = z.object({
  nombreProveedor: z.string({
    required_error: "Por favor selecciona un proveedor o ingresa uno nuevo",
  }),
  otroProveedor: z.string().optional(),
  calificacionGeneral: z.string().min(1, {
    message: "Por favor califica tu experiencia general",
  }),
  calificacionSoporte: z.string().min(1, {
    message: "Por favor califica el soporte técnico",
  }),
  calificacionVelocidad: z.string().min(1, {
    message: "Por favor califica la velocidad",
  }),
  calificacionPrecio: z.string().min(1, {
    message: "Por favor califica la relación precio/calidad",
  }),
  comentario: z.string().min(10, {
    message: "Por favor escribe un comentario de al menos 10 caracteres",
  }).max(500),
  email: z.string().email({
    message: "Por favor ingresa un email válido",
  }),
  nombre: z.string().min(2, {
    message: "Por favor ingresa tu nombre",
  }),
  autorizacion: z.boolean().refine(val => val === true, {
    message: "Debes autorizar la publicación de tu reseña",
  }),
});

// Lista de proveedores de hosting
const proveedoresHosting = [
  "HostingPlus",
  "EcoHosting",
  "1Hosting",
  "Hosting.cl",
  "PlanetaHosting",
  "NinjaHosting",
  "WebHosting.cl",
  "HostingPro",
  "ChileHosting",
  "HostingFacil",
  "DonWeb",
  "GoDaddy",
  "Otro"
];

const VotaHosting = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otroProveedorVisible, setOtroProveedorVisible] = useState(false);
  const [reseñasRecientes, setReseñasRecientes] = useState([
    {
      id: 1,
      proveedor: "HostingPlus",
      nombre: "Carlos Muñoz",
      calificacion: "5",
      comentario: "Increíble servicio. El soporte técnico respondió en menos de 5 minutos a mi consulta y logré solucionar un problema que tenía hace días. La velocidad de carga de mi sitio mejoró notablemente al migrar a ellos.",
      fecha: "Mayo 2, 2025"
    },
    {
      id: 2,
      proveedor: "EcoHosting",
      nombre: "Daniela Vargas",
      calificacion: "4",
      comentario: "Me encanta que usen energías renovables. El panel de control es muy intuitivo y todo funciona muy bien. El único inconveniente es que a veces el soporte tarda en responder los fines de semana.",
      fecha: "Abril 28, 2025"
    },
    {
      id: 3,
      proveedor: "1Hosting",
      nombre: "Felipe Araya",
      calificacion: "5",
      comentario: "Relación precio/calidad inmejorable. Tengo mi tienda online con ellos y nunca he tenido problemas de disponibilidad. El servidor es rápido y tienen un excelente plan de precios.",
      fecha: "Abril 25, 2025"
    }
  ]);

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
    document.title = "Vota por tu hosting favorito | eligetuhosting.cl";
  }, []);

  const watchProveedor = form.watch("nombreProveedor");

  useEffect(() => {
    setOtroProveedorVisible(watchProveedor === "Otro");
  }, [watchProveedor]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica para enviar los datos a tu backend
      console.log("Datos del formulario:", data);
      
      // Simulamos una demora en el procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Crear una nueva reseña para mostrar inmediatamente (simulación)
      const nuevaReseña = {
        id: reseñasRecientes.length + 1,
        proveedor: data.nombreProveedor === "Otro" ? data.otroProveedor! : data.nombreProveedor,
        nombre: data.nombre,
        calificacion: data.calificacionGeneral,
        comentario: data.comentario,
        fecha: "Hoy"
      };
      
      // Actualizar la lista de reseñas recientes
      setReseñasRecientes([nuevaReseña, ...reseñasRecientes.slice(0, 2)]);
      
      toast({
        title: "¡Gracias por tu reseña!",
        description: "Tu experiencia ayudará a otros usuarios a elegir mejor su hosting.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error al enviar el formulario",
        description: "Por favor intenta nuevamente más tarde.",
        variant: "destructive"
      });
      console.error("Error al enviar reseña:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Vota por tu hosting favorito | eligetuhosting.cl</title>
        <meta 
          name="description" 
          content="Comparte tu experiencia con tu proveedor de hosting y ayuda a otros usuarios a tomar mejores decisiones. Tu opinión es importante." 
        />
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#F7F9FC] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-4">
              Vota por tu hosting favorito
            </h1>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">
              Comparte tu experiencia y ayuda a otros usuarios a elegir el mejor servicio de hosting.
              Tu opinión es muy valiosa para la comunidad.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Formulario de votación */}
            <Card>
              <CardHeader>
                <CardTitle>Comparte tu experiencia</CardTitle>
                <CardDescription>
                  Evalúa a tu proveedor de hosting actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="nombreProveedor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proveedor de hosting</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona tu proveedor" />
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
                              <Input placeholder="Ingresa el nombre del proveedor" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Calificaciones</h3>
                      
                      <FormField
                        control={form.control}
                        name="calificacionGeneral"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Experiencia general</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-2"
                              >
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <FormItem key={value} className="flex flex-col items-center space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={String(value)} className="sr-only" />
                                    </FormControl>
                                    <FormLabel className={`w-10 h-10 flex items-center justify-center rounded-full border-2 cursor-pointer ${field.value === String(value) ? 'bg-[#EF233C] text-white border-[#EF233C]' : 'hover:bg-gray-100'}`}>
                                      {value}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="calificacionSoporte"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Soporte técnico</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-2"
                              >
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <FormItem key={value} className="flex flex-col items-center space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={String(value)} className="sr-only" />
                                    </FormControl>
                                    <FormLabel className={`w-10 h-10 flex items-center justify-center rounded-full border-2 cursor-pointer ${field.value === String(value) ? 'bg-[#EF233C] text-white border-[#EF233C]' : 'hover:bg-gray-100'}`}>
                                      {value}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="calificacionVelocidad"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Velocidad del servicio</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-2"
                              >
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <FormItem key={value} className="flex flex-col items-center space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={String(value)} className="sr-only" />
                                    </FormControl>
                                    <FormLabel className={`w-10 h-10 flex items-center justify-center rounded-full border-2 cursor-pointer ${field.value === String(value) ? 'bg-[#EF233C] text-white border-[#EF233C]' : 'hover:bg-gray-100'}`}>
                                      {value}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="calificacionPrecio"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Relación precio/calidad</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-2"
                              >
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <FormItem key={value} className="flex flex-col items-center space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={String(value)} className="sr-only" />
                                    </FormControl>
                                    <FormLabel className={`w-10 h-10 flex items-center justify-center rounded-full border-2 cursor-pointer ${field.value === String(value) ? 'bg-[#EF233C] text-white border-[#EF233C]' : 'hover:bg-gray-100'}`}>
                                      {value}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="comentario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tu comentario</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Comparte tu experiencia con este proveedor" 
                              className="resize-none" 
                              {...field} 
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            Entre 10 y 500 caracteres
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Tu nombre o nickname" {...field} />
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
                              <Input 
                                placeholder="Tu email (no se publicará)" 
                                type="email" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="autorizacion"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 mt-1 rounded border-gray-300 text-[#EF233C] focus:ring-[#EF233C]"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Autorizo la publicación de mi reseña
                            </FormLabel>
                            <FormDescription>
                              Tu email no se publicará. Nos reservamos el derecho de editar contenido inapropiado.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#EF233C]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar mi valoración"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Reseñas recientes */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reseñas recientes</CardTitle>
                  <CardDescription>
                    Opiniones de otros usuarios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {reseñasRecientes.map((reseña) => (
                    <div key={reseña.id} className="space-y-3 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{reseña.proveedor}</h3>
                          <p className="text-sm text-gray-500">{reseña.nombre} • {reseña.fecha}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-[#EF233C] text-white text-xs px-2 py-1 rounded font-medium">
                            {reseña.calificacion}/5
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">{reseña.comentario}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>¿Por qué votar?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Tu opinión es muy valiosa para otros usuarios que están buscando un proveedor de hosting confiable. 
                    Al compartir tu experiencia:
                  </p>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF233C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <span className="text-sm">Ayudas a otros a tomar mejores decisiones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF233C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <span className="text-sm">Contribuyes a mejorar la calidad del servicio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF233C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <span className="text-sm">Generas transparencia en el mercado de hosting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF233C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <span className="text-sm">Recibes descuentos exclusivos en futuras contrataciones</span>
                    </li>
                  </ul>
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

export default VotaHosting;
