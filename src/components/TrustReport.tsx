import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, CheckCircle2, TrendingUp, Award, ExternalLink, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useBenchmarkTopProviders } from '@/hooks/useBenchmarkTopProviders';

interface TrustReportProps {
  showMethodology?: boolean;
}

const TrustReport: React.FC<TrustReportProps> = ({ showMethodology = true }) => {
  const { data: providers = [], isLoading } = useBenchmarkTopProviders(3);

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-semibold">Datos verificables</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Top proveedores según mediciones reales
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ranking calculado con TTFB, Lighthouse y uptime medidos automáticamente.
            Cada cifra puede reproducirse desde{' '}
            <Link to="/benchmark" className="text-primary font-semibold hover:underline">
              /benchmark
            </Link>
            {' '}y la metodología está publicada.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Cargando datos del último benchmark…</p>
        ) : providers.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Aún no hay un run publicado</CardTitle>
              <CardDescription>
                El sistema de medición está activo. La primera ejecución completa se publicará en{' '}
                <Link to="/benchmark" className="text-primary hover:underline">/benchmark</Link>.
                No mostramos cifras inventadas.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {providers.map((p, index) => (
              <Card key={p.company_id} className="relative overflow-hidden">
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                    #1 medido
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{p.name}</CardTitle>
                  <CardDescription>
                    Score compuesto:{' '}
                    <span className="font-bold text-foreground">
                      {p.composite_score?.toFixed(1) ?? '—'}/100
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold">TTFB mediana</p>
                    </div>
                    <p className="text-lg font-bold">
                      {p.ttfb_median_ms != null ? `${p.ttfb_median_ms} ms` : '—'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold">Uptime 30 días</p>
                    </div>
                    <p className="text-lg font-bold">
                      {p.uptime_30d_pct != null ? `${p.uptime_30d_pct.toFixed(2)}%` : 'sin datos aún'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold">Lighthouse</p>
                    </div>
                    <p className="text-lg font-bold">
                      {p.lighthouse_perf != null ? `${p.lighthouse_perf}/100` : '—'}
                    </p>
                  </div>
                  <div className="text-center pt-2 border-t">
                    <Link
                      to={`/benchmark`}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Ver detalle y reproducibilidad <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {showMethodology && (
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/metodologia-benchmark">
                <CheckCircle2 className="h-4 w-4" />
                Ver metodología completa
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Pesos públicos · Datos descargables · Mediciones mensuales
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrustReport;
