import React from 'react';
import { Shield, CheckCircle2, Eye, Zap } from 'lucide-react';

const items = [
  {
    icon: Shield,
    title: 'Transparencia total',
    desc: 'Metodología pública y datos verificables. Cada nota se basa en mediciones reales o curaduría documentada.',
  },
  {
    icon: CheckCircle2,
    title: 'Hosting que cumple',
    desc: 'Solo recomendamos proveedores verificados con datacenter activo y soporte real en Chile.',
  },
  {
    icon: Eye,
    title: 'Sin sesgos comerciales',
    desc: 'Las comisiones no influyen en el ranking. Mostramos pros y contras reales de cada proveedor.',
  },
  {
    icon: Zap,
    title: 'Datos actualizados',
    desc: 'Velocidad, uptime y reputación se actualizan periódicamente desde mediciones automatizadas.',
  },
];

const WhyTrustUs: React.FC = () => {
  return (
    <section
      aria-label="Por qué confiar en Elige Tu Hosting"
      className="py-12 md:py-16 bg-muted/30"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Por qué confiar en Elige Tu Hosting
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Transparencia, mediciones reales y cero favoritismo comercial.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyTrustUs;
