import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import HowToSchema from '@/components/SEO/HowToSchema';
import SEOFAQSchema from '@/components/SEO/SEOFAQSchema';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, TrendingUp, Shield, Zap, DollarSign, Users, Clock } from 'lucide-react';

const GuiaCompletaElegirHosting = () => {
  const steps = [
    {
      name: "Define tus necesidades y presupuesto",
      text: "Identifica el tipo de sitio web que necesitas (blog, e-commerce, corporativo), estima el tráfico mensual esperado y establece un presupuesto realista considerando costos iniciales y renovaciones.",
      icon: DollarSign
    },
    {
      name: "Evalúa el rendimiento y velocidad",
      text: "Verifica que el hosting ofrezca discos SSD o NVMe, tecnología LiteSpeed o similar, y ubicación de servidores cercana a tu audiencia (idealmente en Chile para sitios chilenos).",
      icon: Zap
    },
    {
      name: "Revisa el soporte técnico",
      text: "Confirma que haya soporte 24/7 en español, tiempo de respuesta rápido (menos de 30 minutos), y múltiples canales (chat, ticket, teléfono).",
      icon: Users
    },
    {
      name: "Analiza características de seguridad",
      text: "Asegúrate de que incluyan SSL gratuito, backups automáticos diarios, protección anti-DDoS, y actualizaciones de seguridad regulares.",
      icon: Shield
    },
    {
      name: "Verifica escalabilidad y garantías",
      text: "Revisa la facilidad para upgrades, garantía de uptime (mínimo 99.9%), política de reembolso, y lee opiniones reales de usuarios chilenos.",
      icon: TrendingUp
    }
  ];

  const faqs = [
    {
      question: "¿Cuánto debería invertir en hosting para mi primer sitio web?",
      answer: "Para un sitio web básico o blog personal, puedes empezar con planes desde $2.000-$5.000 CLP mensuales. Para e-commerce o sitios corporativos, considera invertir entre $10.000-$30.000 CLP mensuales para asegurar rendimiento y seguridad adecuados."
    },
    {
      question: "¿Es mejor hosting compartido o VPS para empezar?",
      answer: "El hosting compartido es ideal para comenzar si esperas menos de 10.000 visitas mensuales y tienes presupuesto limitado. Un VPS es recomendable cuando superes las 20.000 visitas mensuales o necesites recursos dedicados para aplicaciones específicas."
    },
    {
      question: "¿Por qué es importante que el servidor esté en Chile?",
      answer: "Los servidores en Chile reducen la latencia entre 80-200ms comparado con servidores en USA o Europa, lo que mejora la velocidad de carga hasta en un 40%. Esto impacta directamente en el SEO, experiencia de usuario y tasas de conversión."
    },
    {
      question: "¿Qué significa uptime del 99.9% en la práctica?",
      answer: "Un uptime del 99.9% permite hasta 43 minutos de inactividad al mes. El 99.95% permite 21 minutos, y el 99.99% solo 4 minutos. Para sitios de negocio, busca mínimo 99.95% con compensación en caso de incumplimiento."
    },
    {
      question: "¿Cómo puedo verificar la reputación de un proveedor de hosting?",
      answer: "Revisa rankings independientes como EligeTuHosting.cl, busca opiniones en redes sociales chilenas, consulta en Reclamos.cl, prueba el soporte antes de contratar, y verifica certificaciones de calidad y tiempo en el mercado."
    }
  ];

  const checklist = [
    "Disco SSD o NVMe",
    "Certificado SSL gratuito incluido",
    "Backups automáticos diarios",
    "Panel de control en español (cPanel/Plesk)",
    "Soporte técnico 24/7 en español",
    "Servidores en Chile o Latinoamérica",
    "Garantía de uptime mínimo 99.9%",
    "Política de reembolso (14-30 días)",
    "Migración gratuita desde otro hosting",
    "Protección anti-malware y firewall",
    "Emails corporativos incluidos",
    "Facilidad para escalar recursos"
  ];

  const commonMistakes = [
    {
      title: "Elegir solo por precio bajo",
      description: "El hosting más barato suele tener recursos limitados, soporte deficiente y muchas restricciones ocultas.",
      icon: AlertCircle
    },
    {
      title: "No leer la letra pequeña de renovación",
      description: "Muchos proveedores ofrecen precios promocionales que se duplican o triplican al renovar.",
      icon: AlertCircle
    },
    {
      title: "Ignorar la ubicación del servidor",
      description: "Un servidor en Europa puede añadir 200-300ms de latencia a visitantes chilenos, afectando SEO.",
      icon: AlertCircle
    },
    {
      title: "No verificar límites de recursos",
      description: "El 'almacenamiento ilimitado' suele tener restricciones de inodos o ancho de banda ocultas.",
      icon: AlertCircle
    }
  ];

  return (
    <>
      <DynamicMetaTags
        title="Guía Completa para Elegir Hosting en Chile 2025"
        description="Guía paso a paso con checklist, errores comunes a evitar y recomendaciones de expertos para elegir el mejor hosting para tu sitio web en Chile."
        keywords="guía elegir hosting, cómo elegir hosting chile, checklist hosting, errores hosting"
      />
      
      <HowToSchema
        name="Cómo Elegir el Mejor Hosting en Chile - Guía Completa 2025"
        description="Guía paso a paso para seleccionar el hosting ideal según tus necesidades, presupuesto y objetivos de negocio en Chile."
        totalTime="PT20M"
        steps={steps}
      />

      <SEOFAQSchema faqs={faqs} />

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-12">
          {/* Header */}
          <header className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Guía Completa para Elegir Hosting en Chile 2025
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Todo lo que necesitas saber para tomar la decisión correcta
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Lectura: 20 min
              </span>
              <span>•</span>
              <span>Actualizado: Enero 2025</span>
            </div>
          </header>

          {/* Intro */}
          <section className="max-w-4xl mx-auto mb-16">
            <Card className="p-8 bg-primary/5 border-primary/20">
              <h2 className="text-2xl font-semibold mb-4">¿Por qué esta guía es diferente?</h2>
              <p className="text-lg leading-relaxed mb-4">
                Después de analizar más de 50 proveedores de hosting en Chile y revisar miles de opiniones reales, 
                hemos creado esta guía práctica basada en datos verificables y experiencias documentadas.
              </p>
              <p className="text-lg leading-relaxed">
                No encontrarás promociones comerciales aquí, solo información objetiva para ayudarte a elegir 
                el hosting que realmente necesitas.
              </p>
            </Card>
          </section>

          {/* Paso a Paso */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">Proceso de Selección en 5 Pasos</h2>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          Paso {index + 1}: {step.name}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Checklist */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">Checklist: ¿Qué debe incluir tu hosting?</h2>
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {checklist.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Errores Comunes */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">Errores Comunes a Evitar</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {commonMistakes.map((mistake, index) => (
                <Card key={index} className="p-6 border-destructive/20 bg-destructive/5">
                  <div className="flex gap-3 mb-3">
                    <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-foreground">{mistake.title}</h3>
                  </div>
                  <p className="text-muted-foreground pl-9">
                    {mistake.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">Preguntas Frecuentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-4xl mx-auto text-center">
            <Card className="p-8 bg-primary text-primary-foreground">
              <h2 className="text-2xl font-bold mb-4">¿Listo para elegir tu hosting?</h2>
              <p className="text-lg mb-6 opacity-90">
                Consulta nuestro ranking actualizado con análisis detallados de cada proveedor
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/mejor-hosting-chile-2025"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Ver Ranking 2025
                </Link>
                <Link 
                  to="/comparativa"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary-foreground/10 text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/20 transition-colors"
                >
                  Comparar Proveedores
                </Link>
              </div>
            </Card>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default GuiaCompletaElegirHosting;