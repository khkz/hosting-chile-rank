import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, ExternalLink, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

type Option = { label: string; risk: 0 | 1 | 2 | 3 };
type Question = { id: string; question: string; options: Option[]; tag: string };

const questions: Question[] = [
  {
    id: 'cms',
    tag: 'CMS',
    question: '¿Qué CMS o tecnología usa tu sitio?',
    options: [
      { label: 'HTML estático o framework moderno (Next, Astro)', risk: 0 },
      { label: 'WordPress con pocos plugins', risk: 1 },
      { label: 'WordPress con muchos plugins o WooCommerce', risk: 3 },
      { label: 'Joomla, Drupal, Magento u otro PHP', risk: 2 },
    ],
  },
  {
    id: 'data',
    tag: 'Datos',
    question: '¿Qué tipo de datos maneja tu sitio?',
    options: [
      { label: 'Solo contenido público (blog, landing)', risk: 0 },
      { label: 'Formularios de contacto / leads', risk: 1 },
      { label: 'Cuentas de usuario con login', risk: 2 },
      { label: 'Pagos, tarjetas o datos sensibles', risk: 3 },
    ],
  },
  {
    id: 'updates',
    tag: 'Actualizaciones',
    question: '¿Cada cuánto actualizas plugins, temas y core?',
    options: [
      { label: 'Auto-update activado siempre', risk: 0 },
      { label: 'Mensualmente, manual', risk: 1 },
      { label: 'Cada varios meses', risk: 2 },
      { label: 'Casi nunca / no sé', risk: 3 },
    ],
  },
  {
    id: 'backups',
    tag: 'Backups',
    question: '¿Tienes backups recientes de tu sitio?',
    options: [
      { label: 'Diarios fuera del servidor + propios', risk: 0 },
      { label: 'Diarios en el mismo hosting', risk: 1 },
      { label: 'Semanales o esporádicos', risk: 2 },
      { label: 'Ninguno o no estoy seguro', risk: 3 },
    ],
  },
  {
    id: 'auth',
    tag: 'Acceso',
    question: '¿Cómo proteges tus accesos administrativos?',
    options: [
      { label: '2FA en todo + gestor de contraseñas', risk: 0 },
      { label: 'Contraseñas fuertes únicas', risk: 1 },
      { label: 'Contraseñas decentes pero repetidas', risk: 2 },
      { label: 'admin/admin o similar', risk: 3 },
    ],
  },
  {
    id: 'waf',
    tag: 'WAF',
    question: '¿Tu hosting tiene WAF (firewall de aplicación)?',
    options: [
      { label: 'Sí: BitNinja, Imunify360 o equivalente', risk: 0 },
      { label: 'Solo plugin de seguridad en el CMS', risk: 2 },
      { label: 'No tengo nada', risk: 3 },
      { label: 'No sé qué es eso', risk: 3 },
    ],
  },
  {
    id: 'incidents',
    tag: 'Historial',
    question: '¿Tu sitio ha sido hackeado o desfigurado antes?',
    options: [
      { label: 'Nunca', risk: 0 },
      { label: 'Una vez, hace mucho', risk: 1 },
      { label: 'Sí, en el último año', risk: 2 },
      { label: 'Sí, varias veces o ahora mismo', risk: 3 },
    ],
  },
  {
    id: 'traffic',
    tag: 'Tráfico',
    question: '¿Cuánto tráfico recibe tu sitio al mes?',
    options: [
      { label: 'Menos de 1.000 visitas', risk: 0 },
      { label: '1.000 a 10.000', risk: 1 },
      { label: '10.000 a 100.000', risk: 2 },
      { label: 'Más de 100.000 o picos altos', risk: 3 },
    ],
  },
  {
    id: 'monitoring',
    tag: 'Monitoreo',
    question: '¿Tienes monitoreo de uptime y alertas?',
    options: [
      { label: 'Sí, con alertas a mi celular', risk: 0 },
      { label: 'Solo el del hosting', risk: 1 },
      { label: 'Reviso manualmente', risk: 2 },
      { label: 'No tengo monitoreo', risk: 3 },
    ],
  },
  {
    id: 'support',
    tag: 'Soporte',
    question: 'Si tu sitio cae a las 3 AM, ¿qué pasa?',
    options: [
      { label: 'Mi hosting responde 24/7 con sysadmin', risk: 0 },
      { label: 'Tickets que responden al día siguiente', risk: 2 },
      { label: 'Solo email, respuesta lenta', risk: 3 },
      { label: 'No tengo idea', risk: 3 },
    ],
  },
];

const MAX_SCORE = questions.length * 3;

type Tier = {
  level: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  /** Posición del nivel (1 a 4) para el medidor; sin colores: el texto dice el nivel. */
  step: 1 | 2 | 3 | 4;
  headline: string;
  summary: string;
  features: string[];
};

const getTier = (score: number): Tier => {
  const pct = (score / MAX_SCORE) * 100;
  if (pct < 25) {
    return {
      level: 'Bajo',
      step: 1,
      headline: 'Riesgo bajo: vas bien',
      summary:
        'Tu postura de seguridad es sólida. Mantén lo que tienes y agrega capas extra solo si tu sitio crece o cambia de naturaleza.',
      features: [
        'WAF a nivel de servidor (recomendado, opcional según uso)',
        'Backups diarios con retención de al menos 7 días',
        'SSL gratuito Let\'s Encrypt o superior',
        'Monitoreo de uptime básico',
      ],
    };
  }
  if (pct < 50) {
    return {
      level: 'Medio',
      step: 2,
      headline: 'Riesgo medio: te falta una o dos capas',
      summary:
        'Estás expuesto a ataques automatizados. Reforzar el hosting es la inversión con mejor retorno antes de tocar el CMS.',
      features: [
        'WAF con BitNinja o ModSecurity con OWASP CRS',
        'Escaneo de malware automático (Imunify AV+ o similar)',
        'Backups diarios fuera del servidor, retención 14–30 días',
        '2FA obligatorio en el panel del cliente',
        'Aislamiento por cuenta (CageFS o equivalente)',
      ],
    };
  }
  if (pct < 75) {
    return {
      level: 'Alto',
      step: 3,
      headline: 'Riesgo alto: actúa esta semana',
      summary:
        'Tu sitio es un blanco fácil para bots y exploits. Necesitas un hosting con seguridad gestionada de inmediato.',
      features: [
        'Imunify360 con parcheo virtual de CVEs',
        'BitNinja o WAF distribuido con reputación de IPs',
        'Firewall Enterprise perimetral con anti-DDoS',
        'Backups diarios + snapshots externos (30 días)',
        'Soporte 24/7 con acceso a sysadmin',
        'Hardening automático de WordPress / cPanel',
      ],
    };
  }
  return {
    level: 'Crítico',
    step: 4,
    headline: 'Riesgo crítico: migra ya',
    summary:
      'Tu combinación de exposición y falta de defensa es la receta para un hackeo grave. Mover el sitio a un hosting con seguridad enterprise no es opcional.',
    features: [
      'Stack completo: BitNinja + Imunify360 + Firewall Enterprise',
      'Parcheo virtual automático de vulnerabilidades',
      'Backups diarios externos con retención 30+ días y restauración granular',
      'SLA de respuesta a incidentes < 1 hora',
      'Soporte 24/7 con sysadmin certificado',
      'Plugin de seguridad propio del proveedor + 2FA forzado',
      'WAF con reglas personalizadas para WordPress / WooCommerce',
    ],
  };
};

const LEVELS: Tier['level'][] = ['Bajo', 'Medio', 'Alto', 'Crítico'];

/** Medidor de 4 tramos en tinta: la forma y el texto dicen el nivel, no el color. */
const RiskMeter: React.FC<{ step: Tier['step'] }> = ({ step }) => (
  <div aria-hidden className="mt-3 grid max-w-xs grid-cols-4 gap-1">
    {LEVELS.map((l, i) => (
      <div key={l}>
        <div className={cn('h-1.5 rounded-sm', i < step ? 'bg-ink' : 'bg-paper-deep')} />
        <p className={cn('mt-1 text-xs', i + 1 === step ? 'font-semibold text-ink' : 'text-ink-3')}>{l}</p>
      </div>
    ))}
  </div>
);

/**
 * Test de riesgo de seguridad (10 preguntas). Preguntas, niveles y
 * recomendación sin cambios (pendiente 7 del dueño); solo presentación.
 */
const SecurityRiskQuiz: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const current = questions[step];
  const progress = (step / questions.length) * 100;

  const handleAnswer = (risk: number) => {
    if (step === 0 && Object.keys(answers).length === 0) {
      trackEvent('quiz_start', { quiz: 'security_risk' });
    }
    const next = { ...answers, [current.id]: risk };
    setAnswers(next);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      const score = Object.values(next).reduce((a, b) => a + b, 0);
      const tier = getTier(score);
      trackEvent('quiz_complete', { quiz: 'security_risk', score, recomendacion: tier.level });
      setDone(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
  };

  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const tier = getTier(score);

  return (
    <div aria-live="polite" className="rounded-xl border border-rule bg-white p-5 md:p-6">
      {done ? (
        <>
          <p className="t-label">Tu nivel de riesgo</p>
          <h3 className="t-h3 mt-1 text-ink">
            {tier.level}: {score} de {MAX_SCORE} puntos
          </h3>
          <RiskMeter step={tier.step} />
          <p className="mt-5 font-semibold text-ink">{tier.headline}</p>
          <p className="t-body mt-2 text-ink-2">{tier.summary}</p>

          <h4 className="t-label mt-6">Funciones de seguridad que tu hosting debe tener</h4>
          <ul className="mt-3 space-y-2">
            {tier.features.map((f) => (
              <li key={f} className="t-body flex items-start gap-2 text-ink-2">
                <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-ink-3" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a
                href="https://www.hostingplus.cl/hosting/?utm_source=eligetuhosting&utm_medium=quiz&utm_campaign=hosting-seguro"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver hosting que cumple este nivel
                <ExternalLink aria-hidden />
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw aria-hidden />
              Repetir test
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="secondary">{current.tag}</Badge>
            <span className="t-meta">
              Pregunta {step + 1} de {questions.length}
            </span>
          </div>
          <Progress value={progress} aria-label="Avance del test" className="mt-3 h-1.5 bg-paper-deep" />
          <h3 className="t-h3 mt-5 text-ink">{current.question}</h3>
          <div className="mt-4 grid gap-2">
            {current.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleAnswer(opt.risk)}
                className="min-h-11 rounded-lg border border-rule bg-white px-4 py-3 text-left text-[15px] text-ink transition-colors hover:border-ink/40 hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SecurityRiskQuiz;
