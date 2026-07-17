import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';

type QuizStep = 1 | 2 | 3 | 'result';
type ProjectType = 'blog' | 'ecommerce' | 'business' | '';
type TrafficLevel = 'low' | 'medium' | 'high' | '';
type Budget = 'economy' | 'balanced' | 'premium' | '';

interface QuizResult {
  provider: string;
  reason: string;
  price: string;
  features: string[];
  cta: string;
  link: string;
}

const HostingQuiz = () => {
  const [step, setStep] = useState<QuizStep>(1);
  const [projectType, setProjectType] = useState<ProjectType>('');
  const [traffic, setTrafficLevel] = useState<TrafficLevel>('');
  const [budget, setBudget] = useState<Budget>('');

  const getRecommendation = (): QuizResult => {
    // Lógica de recomendación basada en respuestas
    if (projectType === 'blog' && budget === 'economy') {
      return {
        provider: 'EcoHosting',
        reason: 'Ideal para blogs personales con excelente relación precio-calidad',
        price: 'desde $3.325/mes',
        features: ['WordPress optimizado', 'SSL gratis', 'Backups diarios'],
        cta: 'Ver planes EcoHosting',
        link: '/catalogo/ecohosting'
      };
    }
    
    if (projectType === 'ecommerce') {
      return {
        provider: 'HostingPlus',
        reason: 'El #1 en velocidad y soporte para tiendas online',
        price: 'desde $4.219/mes',
        features: ['Datacenter en Santiago', 'Soporte 24/7 en español', 'Migración gratis'],
        cta: 'Probar HostingPlus 30 días',
        link: '/catalogo/hostingplus'
      };
    }

    if (traffic === 'high' || budget === 'premium') {
      return {
        provider: 'HostingPlus',
        reason: 'Máximo rendimiento para sitios con alto tráfico',
        price: 'desde $4.219/mes',
        features: ['Servidores en Santiago', 'CDN incluido', 'Recursos dedicados'],
        cta: 'Ver planes premium',
        link: '/catalogo/hostingplus'
      };
    }

    // Default recomendación
    return {
      provider: 'HostingPlus',
      reason: 'La mejor opción para la mayoría de proyectos chilenos',
      price: 'desde $4.219/mes',
      features: ['Garantía 30 días', 'Soporte en español', 'Sin contratos largos'],
      cta: 'Ver ranking completo',
      link: '/ranking'
    };
  };

  const resetQuiz = () => {
    setStep(1);
    setProjectType('');
    setTrafficLevel('');
    setBudget('');
  };

  const result = step === 'result' ? getRecommendation() : null;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-warm-cream via-white to-warm-peach">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-red/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-brand-red" />
            <span className="text-sm font-semibold text-brand-red">Recomendación Personalizada</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2B2D42] mb-4">
            ¿Qué hosting necesitas?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Responde 3 preguntas y te recomendamos el hosting perfecto para tu proyecto
          </p>
        </div>

        {/* Quiz Card */}
        <Card className="max-w-3xl mx-auto p-8 md:p-12 shadow-xl">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {step === 'result' ? 'Resultado' : `Pregunta ${step} de 3`}
              </span>
              <span className="text-sm font-medium text-brand-red">
                {step === 'result' ? '100%' : `${Math.round((Number(step) / 3) * 100)}%`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-brand-red to-brand-red-dark h-2 rounded-full transition-all duration-500"
                style={{ width: step === 'result' ? '100%' : `${(Number(step) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Tipo de proyecto */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                ¿Qué tipo de proyecto tienes?
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { value: 'blog', label: 'Blog o Sitio Personal', icon: '📝' },
                  { value: 'ecommerce', label: 'Tienda Online', icon: '🛒' },
                  { value: 'business', label: 'Sitio Empresarial', icon: '🏢' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      trackEvent('quiz_start', { quiz: 'hosting_recommender', option: option.value });
                      setProjectType(option.value as ProjectType);
                      setStep(2);
                    }}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-brand-red hover:bg-brand-red/5 transition-all text-center group active:scale-95 min-h-[44px] touch-manipulation"
                  >
                    <div className="text-4xl mb-3">{option.icon}</div>
                    <div className="font-semibold text-gray-800 group-hover:text-brand-red transition-colors">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Nivel de tráfico */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                ¿Cuánto tráfico esperas?
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'low', label: 'Hasta 1,000 visitas/mes', subtitle: 'Ideal para empezar' },
                  { value: 'medium', label: '1,000 - 10,000 visitas/mes', subtitle: 'Crecimiento estable' },
                  { value: 'high', label: 'Más de 10,000 visitas/mes', subtitle: 'Alto tráfico' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTrafficLevel(option.value as TrafficLevel);
                      setStep(3);
                    }}
                    className="w-full p-5 border-2 border-gray-200 rounded-xl hover:border-brand-red hover:bg-brand-red/5 transition-all text-left group active:scale-[0.98] min-h-[44px] touch-manipulation"
                  >
                    <div className="font-semibold text-gray-800 group-hover:text-brand-red transition-colors">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{option.subtitle}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="mt-6 text-sm text-gray-600 hover:text-brand-red transition-colors"
              >
                ← Volver
              </button>
            </div>
          )}

          {/* Step 3: Presupuesto */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                ¿Cuál es tu presupuesto mensual?
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'economy', label: 'Hasta $2,500/mes', subtitle: 'Máximo ahorro' },
                  { value: 'balanced', label: '$2,500 - $5,000/mes', subtitle: 'Equilibrio precio-calidad' },
                  { value: 'premium', label: 'Más de $5,000/mes', subtitle: 'Máximo rendimiento' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setBudget(option.value as Budget);
                      setStep('result');
                    }}
                    className="w-full p-5 border-2 border-gray-200 rounded-xl hover:border-brand-red hover:bg-brand-red/5 transition-all text-left group active:scale-[0.98] min-h-[44px] touch-manipulation"
                  >
                    <div className="font-semibold text-gray-800 group-hover:text-brand-red transition-colors">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{option.subtitle}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-6 text-sm text-gray-600 hover:text-brand-red transition-colors"
              >
                ← Volver
              </button>
            </div>
          )}

          {/* Result */}
          {step === 'result' && result && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  ¡Tu hosting ideal es {result.provider}!
                </h3>
                <p className="text-gray-600">{result.reason}</p>
              </div>

              <div className="bg-gradient-to-br from-brand-red/5 to-brand-red-dark/5 border-2 border-brand-red/20 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-brand-red mb-1">{result.price}</div>
                  <div className="text-sm text-gray-600">Precio inicial</div>
                </div>
                
                <ul className="space-y-3">
                  {result.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  asChild 
                  className="flex-1 bg-gradient-to-r from-brand-red to-brand-red-dark hover:from-brand-red-dark hover:to-brand-red-dark text-white py-6 rounded-xl font-semibold shadow-lg"
                >
                  <Link to={result.link}>
                    {result.cta}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  onClick={resetQuiz}
                  variant="outline"
                  className="flex-1 py-6 rounded-xl font-semibold"
                >
                  Volver a empezar
                </Button>
              </div>
            </div>
          )}

        </Card>

      </div>
    </section>
  );
};

export default HostingQuiz;
