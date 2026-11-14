import React, { useState } from 'react';
import { Building2, ChevronLeft, PenLine, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Section from '@/components/system/Section';
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

const optionClass =
  'flex w-full min-h-[44px] items-start gap-3 rounded-lg border border-rule bg-white p-4 text-left transition-colors hover:border-ink hover:bg-paper touch-manipulation';

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button variant="ghost" onClick={onClick} className="mt-5 px-2 text-ink-2">
    <ChevronLeft aria-hidden />
    Volver
  </Button>
);

const HostingQuiz = () => {
  const [step, setStep] = useState<QuizStep>(1);
  const [projectType, setProjectType] = useState<ProjectType>('');
  const [traffic, setTrafficLevel] = useState<TrafficLevel>('');
  const [budget, setBudget] = useState<Budget>('');

  // Lógica de recomendación sin cambios (decisión pendiente 7).
  const getRecommendation = (): QuizResult => {
    // Lógica de recomendación basada en respuestas
    if (projectType === 'blog' && budget === 'economy') {
      return {
        provider: 'EcoHosting',
        reason: 'Ideal para blogs personales con excelente relación precio-calidad',
        price: 'planes a consultar',
        features: ['WordPress optimizado', 'SSL gratis', 'Backups diarios'],
        cta: 'Ver planes EcoHosting',
        link: '/catalogo/ecohosting'
      };
    }

    if (projectType === 'ecommerce') {
      return {
        provider: 'HostingPlus',
        reason: 'El #1 en velocidad y soporte para tiendas online',
        price: 'planes a consultar',
        features: ['Datacenter en Santiago', 'Soporte 24/7 en español', 'Migración gratis'],
        cta: 'Probar HostingPlus 30 días',
        link: '/catalogo/hostingplus'
      };
    }

    if (traffic === 'high' || budget === 'premium') {
      return {
        provider: 'HostingPlus',
        reason: 'Máximo rendimiento para sitios con alto tráfico',
        price: 'planes a consultar',
        features: ['Servidores en Santiago', 'CDN incluido', 'Recursos dedicados'],
        cta: 'Ver planes premium',
        link: '/catalogo/hostingplus'
      };
    }

    // Default recomendación
    return {
      provider: 'HostingPlus',
      reason: 'La mejor opción para la mayoría de proyectos chilenos',
      price: 'planes a consultar',
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
  // Solo se muestra un bloque de precio si el resultado trae un precio real (con cifras).
  const hasPrice = !!result && /\d/.test(result.price);
  const progress = step === 'result' ? 100 : Math.round((Number(step) / 3) * 100);

  return (
    <Section
      id="quiz"
      title="¿Qué hosting necesitas?"
      lead="Responde tres preguntas y te mostramos una recomendación para tu proyecto."
    >
      <div className="max-w-3xl rounded-xl border border-rule bg-white p-5 md:p-8">
        {/* Progreso */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between">
            <span className="t-label">{step === 'result' ? 'Resultado' : `Pregunta ${step} de 3`}</span>
            <span className="t-meta tabular">{progress} %</span>
          </div>
          <div className="h-1 w-full rounded-sm bg-paper-deep" aria-hidden>
            <div className="h-1 rounded-sm bg-ink transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Paso 1: tipo de proyecto */}
        {step === 1 && (
          <div>
            <h3 className="t-h3 mb-4 text-ink">¿Qué tipo de proyecto tienes?</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { value: 'blog', label: 'Blog o sitio personal', Icon: PenLine },
                { value: 'ecommerce', label: 'Tienda online', Icon: ShoppingCart },
                { value: 'business', label: 'Sitio empresarial', Icon: Building2 }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    trackEvent('quiz_start', { quiz: 'hosting_recommender', option: option.value });
                    setProjectType(option.value as ProjectType);
                    setStep(2);
                  }}
                  className={`${optionClass} items-center`}
                >
                  <option.Icon className="h-5 w-5 shrink-0 text-ink-2" aria-hidden />
                  <span className="font-semibold text-ink">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Paso 2: tráfico */}
        {step === 2 && (
          <div>
            <h3 className="t-h3 mb-4 text-ink">¿Cuánto tráfico esperas?</h3>
            <div className="space-y-3">
              {[
                { value: 'low', label: 'Hasta 1.000 visitas al mes', subtitle: 'Ideal para empezar' },
                { value: 'medium', label: 'De 1.000 a 10.000 visitas al mes', subtitle: 'Crecimiento estable' },
                { value: 'high', label: 'Más de 10.000 visitas al mes', subtitle: 'Alto tráfico' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setTrafficLevel(option.value as TrafficLevel);
                    setStep(3);
                  }}
                  className={optionClass}
                >
                  <span>
                    <span className="block font-semibold text-ink">{option.label}</span>
                    <span className="mt-0.5 block text-sm text-ink-2">{option.subtitle}</span>
                  </span>
                </button>
              ))}
            </div>
            <BackButton onClick={() => setStep(1)} />
          </div>
        )}

        {/* Paso 3: presupuesto */}
        {step === 3 && (
          <div>
            <h3 className="t-h3 mb-4 text-ink">¿Cuál es tu presupuesto mensual?</h3>
            <div className="space-y-3">
              {[
                { value: 'economy', label: 'Lo más económico', subtitle: 'Máximo ahorro' },
                { value: 'balanced', label: 'Gama media', subtitle: 'Equilibrio precio-calidad' },
                { value: 'premium', label: 'Gama alta', subtitle: 'Máximo rendimiento' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    const finalBudget = option.value as Budget;
                    setBudget(finalBudget);
                    setStep('result');
                    // compute recommendation from current state + this selection
                    const rec = (() => {
                      if (projectType === 'blog' && finalBudget === 'economy') return 'EcoHosting';
                      if (projectType === 'ecommerce') return 'HostingPlus';
                      if (traffic === 'high' || finalBudget === 'premium') return 'HostingPlus';
                      return 'HostingPlus';
                    })();
                    trackEvent('quiz_complete', {
                      quiz: 'hosting_recommender',
                      project_type: projectType,
                      traffic,
                      budget: finalBudget,
                      recomendacion: rec,
                    });
                  }}
                  className={optionClass}
                >
                  <span>
                    <span className="block font-semibold text-ink">{option.label}</span>
                    <span className="mt-0.5 block text-sm text-ink-2">{option.subtitle}</span>
                  </span>
                </button>
              ))}
            </div>
            <BackButton onClick={() => setStep(2)} />
          </div>
        )}

        {/* Resultado */}
        {step === 'result' && result && (
          <div aria-live="polite">
            <h3 className="t-h3 text-ink">¡Tu hosting ideal es {result.provider}!</h3>
            <p className="mt-1 text-base text-ink-2">{result.reason}</p>

            {hasPrice && (
              <p className="mt-4 text-ink">
                <span className="t-meta block">Precio inicial</span>
                <span className="text-2xl font-bold tabular">{result.price}</span>
              </p>
            )}

            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-base text-ink marker:text-ink-3">
              {result.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to={result.link}>{result.cta}</Link>
              </Button>
              <Button onClick={resetQuiz} variant="outline" size="lg">
                Volver a empezar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default HostingQuiz;
