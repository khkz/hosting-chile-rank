import React, { useState, useMemo } from 'react';
import { Calculator, Download, Zap, Shield, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { hostingCompanies } from '@/data/hostingCompanies';

interface TCOResult {
  year1: number;
  year3: number;
  year5: number;
  savings: number;
  bestAlternative: string;
}

const TCOCalculator = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [extras, setExtras] = useState({
    ssl: false,
    backup: false,
    security: false,
    domain: false,
    siteBuilder: false,
    email: false
  });

  const extraCosts = {
    ssl: 2990,
    backup: 1990,
    security: 3990,
    domain: 1290,
    siteBuilder: 1990,
    email: 2490
  };

  const providers = Object.values(hostingCompanies);
  const selectedProviderData = selectedProvider ? hostingCompanies[selectedProvider] : null;
  const selectedPlanData = selectedProviderData?.plans.find(plan => plan.name === selectedPlan);

  const tcoResults = useMemo(() => {
    if (!selectedPlanData) return null;

    const baseCost = selectedPlanData.price;
    const monthlyCosts = Object.entries(extras)
      .filter(([_, enabled]) => enabled)
      .reduce((total, [extra]) => total + extraCosts[extra as keyof typeof extraCosts], 0);
    
    const monthlyTotal = baseCost + monthlyCosts;
    
    // Calculate costs for different periods
    const year1 = monthlyTotal * 12;
    const year3 = monthlyTotal * 36;
    const year5 = monthlyTotal * 60;
    
    // Find best alternative for comparison
    let bestAlternative = '';
    let bestPrice = Infinity;
    
    providers.forEach(provider => {
      provider.plans.forEach(plan => {
        if (provider.id !== selectedProvider && plan.price < bestPrice) {
          bestPrice = plan.price;
          bestAlternative = `${provider.name} - ${plan.name}`;
        }
      });
    });
    
    const savings = year5 - (bestPrice * 60);
    
    return {
      year1,
      year3,
      year5,
      savings,
      bestAlternative,
      monthlyTotal,
      baseCost,
      extrasTotal: monthlyCosts
    };
  }, [selectedPlanData, extras, selectedProvider]);

  const exportResults = () => {
    if (!tcoResults || !selectedProviderData || !selectedPlanData) return;
    
    const data = {
      provider: selectedProviderData.name,
      plan: selectedPlanData.name,
      analysis: {
        basePrice: tcoResults.baseCost,
        extrasPrice: tcoResults.extrasTotal,
        monthlyTotal: tcoResults.monthlyTotal,
        year1: tcoResults.year1,
        year3: tcoResults.year3,
        year5: tcoResults.year5,
        bestAlternative: tcoResults.bestAlternative,
        savings: tcoResults.savings
      },
      extras: Object.entries(extras)
        .filter(([_, enabled]) => enabled)
        .map(([extra]) => extra),
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tco-analysis-${selectedProviderData.name.toLowerCase().replace(/\s+/g, '-')}.json`;
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
              Selecciona tu proveedor, plan y servicios adicionales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="provider">Proveedor de Hosting</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center gap-2">
                        <img src={provider.logo} alt={provider.name} className="w-4 h-4" />
                        {provider.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProviderData && (
              <div className="space-y-2">
                <Label htmlFor="plan">Plan de Hosting</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProviderData.plans.map(plan => (
                      <SelectItem key={plan.name} value={plan.name}>
                        <div className="flex items-center justify-between w-full">
                          <span>{plan.name}</span>
                          <Badge variant="outline">${plan.price.toLocaleString()}/mes</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <Label className="text-base font-semibold">Servicios Adicionales</Label>
              
              <div className="grid grid-cols-1 gap-3">
                {Object.entries({
                  ssl: { label: 'Certificado SSL Premium', icon: Shield },
                  backup: { label: 'Backups Automáticos', icon: Clock },
                  security: { label: 'Seguridad Avanzada', icon: Shield },
                  domain: { label: 'Dominio Premium', icon: Zap },
                  siteBuilder: { label: 'Constructor de Sitios', icon: Zap },
                  email: { label: 'Email Profesional', icon: Zap }
                }).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={key}
                          checked={extras[key as keyof typeof extras]}
                          onCheckedChange={(checked) => 
                            setExtras(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={key} className="cursor-pointer">
                          {config.label}
                        </Label>
                      </div>
                      <Badge variant="secondary">
                        +${extraCosts[key as keyof typeof extraCosts].toLocaleString()}/mes
                      </Badge>
                    </div>
                  );
                })}
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
            {tcoResults && selectedPlanData ? (
              <div className="space-y-6">
                {/* Current Selection Summary */}
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Configuración Actual</h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Plan base:</span>
                      <span>${tcoResults.baseCost.toLocaleString()}/mes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Extras:</span>
                      <span>+${tcoResults.extrasTotal.toLocaleString()}/mes</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total mensual:</span>
                      <span>${tcoResults.monthlyTotal.toLocaleString()}/mes</span>
                    </div>
                  </div>
                </div>

                {/* TCO Projection */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Proyección de Costos</h3>
                  
                  {[
                    { period: '1 año', cost: tcoResults.year1, months: 12 },
                    { period: '3 años', cost: tcoResults.year3, months: 36 },
                    { period: '5 años', cost: tcoResults.year5, months: 60 }
                  ].map(({ period, cost, months }) => (
                    <div key={period} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{period}</div>
                        <div className="text-sm text-muted-foreground">
                          {months} meses × ${tcoResults.monthlyTotal.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${cost.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">CLP</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Savings Analysis */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Análisis de Ahorro
                  </h3>
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <div>Mejor alternativa: {tcoResults.bestAlternative}</div>
                    <div className="font-medium mt-1">
                      {tcoResults.savings > 0 
                        ? `Podrías ahorrar $${Math.abs(tcoResults.savings).toLocaleString()} en 5 años`
                        : `Costo adicional de $${Math.abs(tcoResults.savings).toLocaleString()} vs la opción más económica`
                      }
                    </div>
                  </div>
                </div>

                <Button onClick={exportResults} className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Análisis Completo
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecciona un proveedor y plan para ver el análisis de costos TCO</p>
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