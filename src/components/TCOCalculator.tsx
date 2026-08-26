import React, { useState, useMemo } from 'react';
import { Calculator, Download, Zap, Clock, DollarSign, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type ExtraKey = 'ssl' | 'backup' | 'security' | 'domain' | 'siteBuilder' | 'email';

const EXTRA_LABELS: Record<ExtraKey, string> = {
  ssl: 'Certificado SSL premium',
  backup: 'Backups automáticos',
  security: 'Seguridad avanzada / WAF',
  domain: 'Dominio',
  siteBuilder: 'Constructor de sitios',
  email: 'Email profesional',
};

const EMPTY_EXTRAS: Record<ExtraKey, number> = {
  ssl: 0,
  backup: 0,
  security: 0,
  domain: 0,
  siteBuilder: 0,
  email: 0,
};

const clp = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}`;

const TCOCalculator = () => {
  const [providerName, setProviderName] = useState('');
  const [planName, setPlanName] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState<string>('');
  const [renewalPrice, setRenewalPrice] = useState<string>('');
  const [extras, setExtras] = useState<Record<ExtraKey, number>>({ ...EMPTY_EXTRAS });

  const setExtra = (key: ExtraKey, raw: string) => {
    const value = raw === '' ? 0 : Math.max(0, Number(raw) || 0);
    setExtras((prev) => ({ ...prev, [key]: value }));
  };

  const results = useMemo(() => {
    const base = Number(monthlyPrice) || 0;
    if (base <= 0) return null;

    const renewal = Number(renewalPrice) > 0 ? Number(renewalPrice) : base;
    const extrasTotal = (Object.keys(extras) as ExtraKey[]).reduce((sum, k) => sum + extras[k], 0);

    const monthlyTotal = base + extrasTotal;
    const renewalMonthly = renewal + extrasTotal;

    const year1 = monthlyTotal * 12;
    const year3 = year1 + renewalMonthly * 24;
    const year5 = year1 + renewalMonthly * 48;

    return { base, renewal, extrasTotal, monthlyTotal, renewalMonthly, year1, year3, year5 };
  }, [monthlyPrice, renewalPrice, extras]);

  const exportResults = () => {
    if (!results) return;
    const data = {
      provider: providerName || null,
      plan: planName || null,
      inputs: {
        monthlyPrice: results.base,
        renewalMonthlyPrice: results.renewal,
        extras,
      },
      analysis: {
        extrasTotal: results.extrasTotal,
        monthlyTotal: results.monthlyTotal,
        year1: results.year1,
        year3: results.year3,
        year5: results.year5,
      },
      note: 'Cálculo hecho con los precios introducidos por el usuario. EligeTuHosting no precarga precios.',
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tco-analysis-${(providerName || 'hosting').toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Calculadora de TCO de Hosting
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Calcula el Costo Total de Propiedad (TCO) de tu hosting a 1, 3 y 5 años.
          Incluye extras, compara opciones y descubre cuánto puedes ahorrar.
        </p>
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
          Introduce los precios que te entregue cada proveedor. No precargamos precios porque estamos reverificando el catálogo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Configuración del Hosting
            </CardTitle>
            <CardDescription>
              Escribe el proveedor, el plan y los precios que te dieron
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Proveedor (opcional)</Label>
                <Input
                  id="provider"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="Ej: proveedor que estás evaluando"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan (opcional)</Label>
                <Input
                  id="plan"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Ej: plan que estás evaluando"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyPrice">Precio mensual del plan (CLP)</Label>
                <Input
                  id="monthlyPrice"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="renewalPrice">Precio mensual al renovar (CLP)</Label>
                <Input
                  id="renewalPrice"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={renewalPrice}
                  onChange={(e) => setRenewalPrice(e.target.value)}
                  placeholder="Si no lo sabes, se usa el mismo"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-base font-semibold">Servicios adicionales (CLP al mes)</Label>
              <p className="text-sm text-muted-foreground">
                Deja en 0 lo que no contrates o lo que venga incluido.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {(Object.keys(EXTRA_LABELS) as ExtraKey[]).map((key) => (
                  <div key={key} className="flex items-center justify-between gap-3 p-3 border rounded-lg">
                    <Label htmlFor={`extra-${key}`} className="cursor-pointer">
                      {EXTRA_LABELS[key]}
                    </Label>
                    <Input
                      id={`extra-${key}`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      className="w-32"
                      value={extras[key] === 0 ? '' : String(extras[key])}
                      onChange={(e) => setExtra(key, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Análisis de Costos TCO
            </CardTitle>
            <CardDescription>
              Proyección de costos a 1, 3 y 5 años
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Configuración Actual</h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Plan base:</span>
                      <span>{clp(results.base)}/mes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Extras:</span>
                      <span>+{clp(results.extrasTotal)}/mes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Al renovar:</span>
                      <span>{clp(results.renewalMonthly)}/mes</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total mensual:</span>
                      <span>{clp(results.monthlyTotal)}/mes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Proyección de Costos</h3>

                  {[
                    { period: '1 año', cost: results.year1, description: `12 meses × ${clp(results.monthlyTotal)}` },
                    { period: '3 años', cost: results.year3, description: `12 meses × ${clp(results.monthlyTotal)} + 24 × ${clp(results.renewalMonthly)}` },
                    { period: '5 años', cost: results.year5, description: `12 meses × ${clp(results.monthlyTotal)} + 48 × ${clp(results.renewalMonthly)}` },
                  ].map(({ period, cost, description }) => (
                    <div key={period} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{period}</div>
                        <div className="text-sm text-muted-foreground">{description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{clp(cost)}</div>
                        <div className="text-sm text-muted-foreground">CLP</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                  Repite el cálculo con los precios de otro proveedor y compara el total a 3 y 5 años:
                  la diferencia entre ambos totales es tu ahorro real.
                </div>

                <Button onClick={exportResults} className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Análisis Completo
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Introduce el precio mensual del plan para ver el análisis de costos TCO</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>¿Qué es el TCO (Total Cost of Ownership)?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            El TCO incluye todos los costos asociados con tu hosting durante su vida útil, no solo el precio mensual.
            Esto incluye servicios adicionales, migraciones, tiempo de inactividad y costos ocultos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Costos Directos</h3>
              <p className="text-sm text-muted-foreground">Plan base, extras, renovaciones</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Costos de Tiempo</h3>
              <p className="text-sm text-muted-foreground">Configuración, mantenimiento, migraciones</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Costos de Riesgo</h3>
              <p className="text-sm text-muted-foreground">Caídas, seguridad, respaldos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TCOCalculator;
