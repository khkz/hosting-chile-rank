import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, CheckCircle2, TrendingUp, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ReputationData {
  provider: string;
  reclamosCount: number;
  yearsMonitored: number;
  uptimeVerified: number;
  speedGrade: string;
  totalReviews?: number;
  averageRating?: number;
}

interface TrustReportProps {
  topProviders?: ReputationData[];
  showMethodology?: boolean;
}

const defaultProviders: ReputationData[] = [
  {
    provider: "HostingPlus",
    reclamosCount: 0,
    yearsMonitored: 5,
    uptimeVerified: 99.98,
    speedGrade: "A+",
    totalReviews: 247,
    averageRating: 9.8
  },
  {
    provider: "EcoHosting",
    reclamosCount: 2,
    yearsMonitored: 4,
    uptimeVerified: 99.95,
    speedGrade: "A",
    totalReviews: 189,
    averageRating: 9.5
  },
  {
    provider: "Hostname",
    reclamosCount: 1,
    yearsMonitored: 6,
    uptimeVerified: 99.92,
    speedGrade: "A",
    totalReviews: 156,
    averageRating: 9.2
  }
];

const TrustReport: React.FC<TrustReportProps> = ({ 
  topProviders = defaultProviders,
  showMethodology = true 
}) => {
  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-semibold">Verificación Independiente</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Reputación Verificada con Datos Reales
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nuestro ranking se basa en datos verificables de{' '}
            <a 
              href="https://www.reclamos.cl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
            >
              Reclamos.cl <ExternalLink className="h-3 w-3" />
            </a>
            {' '}y monitoreo continuo de uptime y velocidad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {topProviders.map((provider, index) => (
            <Card key={index} className="relative overflow-hidden">
              {index === 0 && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                  #1 Verificado
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{provider.provider}</CardTitle>
                <CardDescription>
                  Monitoreado durante {provider.yearsMonitored} años
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Reclamos.cl Badge */}
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">Reclamos.cl</p>
                      <p className="text-xs text-green-700">Fuente verificada</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{provider.reclamosCount}</p>
                    <p className="text-xs text-green-700">reclamos</p>
                  </div>
                </div>

                {/* Uptime Metric */}
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Uptime</p>
                      <p className="text-xs text-blue-700">Último año</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{provider.uptimeVerified}%</p>
                    <p className="text-xs text-blue-700">verificado</p>
                  </div>
                </div>

                {/* Speed Grade */}
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900">Velocidad</p>
                      <p className="text-xs text-yellow-700">PageSpeed Score</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">{provider.speedGrade}</p>
                    <p className="text-xs text-yellow-700">calificación</p>
                  </div>
                </div>

                {/* User Reviews */}
                {provider.totalReviews && (
                  <div className="text-center pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold text-primary">★ {provider.averageRating}/10</span>
                      {' '}({provider.totalReviews} opiniones reales)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Methodology CTA */}
        {showMethodology && (
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/nuestro-metodo">
                <Shield className="h-4 w-4" />
                Ver Metodología Completa
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              100% transparente • Datos públicos • Actualización mensual
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrustReport;
