import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
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
  color: string;
  bg: string;
  headline: string;
  summary: string;
  features: string[];
};

const getTier = (score: number): Tier => {
  const pct = (score / MAX_SCORE) * 100;
  if (pct < 25) {
    return {
      level: 'Bajo',
      color: 'text-green-700',
      bg: 'bg-green-50 border-green-200',
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
      color: 'text-yellow-700',
      bg: 'bg-yellow-50 border-yellow-200',
      headline: 'Riesgo medio: te falta una o dos capas',
      summary:
        'Estás expuesto a ataques automatizados. Reforzar el hosting es la inversión con mejor retorno antes de tocar el CMS.',
      features: [
        'WAF con BitNinja o ModSecurity con OWASP CRS',
        'Escaneo de malware automático (Imunify AV+ o similar)',
        'Backups diarios fuera del servidor, retención 14-30 días',
        '2FA obligatorio en el panel del cliente',
        'Aislamiento por cuenta (CageFS o equivalente)',
      ],
    };
  }
  if (pct < 75) {
    return {
      level: 'Alto',
      color: 'text-orange-700',
      bg: 'bg-orange-50 border-orange-200',
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
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
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

const SecurityRiskQuiz: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const current = questions[step];
  const progress = (step / questions.length) * 100;

  const handleAnswer = (risk: number) => {
    const next = { ...answers, [current.id]: risk };
    setAnswers(next);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
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

  if (done) {
    return (
      <Card className={`border-2 ${tier.bg}`}>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm">
              <Shield className={`w-6 h-6 ${tier.color}`} />
            </div>
            <div>
              <CardDescription className="text-xs uppercase tracking-wider">
                Tu nivel de riesgo
              </CardDescription>
              <CardTitle className={`text-2xl ${tier.color}`}>
                {tier.level} · {score}/{MAX_SCORE} puntos
              </CardTitle>
            </div>
          </div>
          <p className="text-base font-medium">{tier.headline}</p>
          <p className="text-sm text-muted-foreground mt-2">{tier.summary}</p>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
            Funciones de seguridad que tu hosting debe tener
          </h3>
          <ul className="space-y-2 mb-6">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.hostingplus.cl/hosting/?utm_source=eligetuhosting&utm_medium=quiz&utm_campaign=hosting-seguro"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="min-h-[44px]">
                Ver hosting que cumple este nivel
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Button variant="outline" onClick={reset} className="min-h-[44px]">
              <RotateCcw className="w-4 h-4 mr-2" />
              Repetir test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
            <AlertTriangle className="w-3 h-3" />
            {current.tag}
          </span>
          <span className="text-xs text-muted-foreground">
            Pregunta {step + 1} de {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        <CardTitle className="text-xl leading-snug">{current.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {current.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleAnswer(opt.risk)}
              className="text-left min-h-[44px] px-4 py-3 rounded-lg border border-border bg-background hover:bg-primary/5 hover:border-primary/40 transition-colors text-sm"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityRiskQuiz;
