import React, { useState, useMemo } from 'react';
import { Calculator, Clock, DollarSign, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Section from '@/components/system/Section';
import { formatMoney } from '@/lib/format';

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

const clp = (n: number) => formatMoney(n, 'CLP');

const COST_TYPES = [
  { icon: DollarSign, title: 'Costos directos', text: 'Plan base, extras, renovaciones' },
  { icon: Clock, title: 'Costos de tiempo', text: 'Configuración, mantenimiento, migraciones' },
  { icon: Shield, title: 'Costos de riesgo', text: 'Caídas, seguridad, respaldos' },
];

/** Calculadora de costo total: solo usa los precios que escribe la persona. */
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
      // Momento en que la persona exportó su cálculo (no es una fecha de datos del sitio).
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
    <>
      <Section density="tight" aria-label="Calculadora">
        <div className="grid gap-10 lg:grid-cols-2">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()} aria-labelledby="tco-config">
            <div>
              <h2 id="tco-config" className="t-h3 text-ink">Tu plan</h2>
              <p className="t-small mt-1 text-ink-2">Escribe el proveedor, el plan y los precios que te dieron.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="provider">Proveedor (opcional)</Label>
                <Input id="provider" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Ej.: nombre del proveedor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan (opcional)</Label>
                <Input id="plan" value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="Ej.: plan básico" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="monthlyPrice">Precio mensual del plan (CLP)</Label>
                <Input id="monthlyPrice" type="number" min={0} inputMode="numeric" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} placeholder="0" />
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
                  placeholder="Igual al anterior"
                  aria-describedby="renewal-help"
                />
                <p id="renewal-help" className="t-meta">Si no lo sabes, usamos el mismo precio.</p>
              </div>
            </div>

            <fieldset className="border-t border-rule pt-6">
              <legend className="t-label text-ink">Servicios adicionales (CLP al mes)</legend>
              <p className="t-small mt-1 text-ink-2">Deja en 0 lo que no contrates o lo que venga incluido.</p>
              <div className="mt-4 divide-y divide-rule border-y border-rule">
                {(Object.keys(EXTRA_LABELS) as ExtraKey[]).map((key) => (
                  <div key={key} className="flex items-center justify-between gap-3 py-2">
                    <Label htmlFor={`extra-${key}`} className="cursor-pointer text-ink">
                      {EXTRA_LABELS[key]}
                    </Label>
                    <Input
                      id={`extra-${key}`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      className="w-32 shrink-0"
                      value={extras[key] === 0 ? '' : String(extras[key])}
                      onChange={(e) => setExtra(key, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          </form>

          <section aria-labelledby="tco-resultado" className="rounded-xl border border-rule bg-paper p-5 md:p-6" aria-live="polite">
            <h2 id="tco-resultado" className="t-h3 text-ink">Costo total</h2>
            <p className="t-small mt-1 text-ink-2">Proyección a 1, 3 y 5 años.</p>
            {results ? (
              <div className="mt-5 space-y-6">
                <dl className="t-small divide-y divide-rule border-y border-rule">
                  {[
                    ['Plan base', `${clp(results.base)}/mes`],
                    ['Extras', `+${clp(results.extrasTotal)}/mes`],
                    ['Al renovar', `${clp(results.renewalMonthly)}/mes`],
                    ['Total mensual', `${clp(results.monthlyTotal)}/mes`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 py-2">
                      <dt className="text-ink-2">{label}</dt>
                      <dd className="tabular font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="space-y-3">
                  {[
                    { period: '1 año', cost: results.year1, description: `12 meses × ${clp(results.monthlyTotal)}` },
                    { period: '3 años', cost: results.year3, description: `12 meses × ${clp(results.monthlyTotal)} + 24 × ${clp(results.renewalMonthly)}` },
                    { period: '5 años', cost: results.year5, description: `12 meses × ${clp(results.monthlyTotal)} + 48 × ${clp(results.renewalMonthly)}` },
                  ].map(({ period, cost, description }) => (
                    <li key={period} className="flex items-center justify-between gap-4 rounded-xl border border-rule bg-white p-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{period}</p>
                        <p className="t-meta tabular">{description}</p>
                      </div>
                      <p className="tabular shrink-0 text-xl font-bold text-ink">{clp(cost)}</p>
                    </li>
                  ))}
                </ul>

                <p className="t-small text-ink-2">
                  Repite el cálculo con los precios de otro proveedor y compara el total a 3 y 5 años: la diferencia entre ambos totales
                  es tu ahorro real.
                </p>

                <Button onClick={exportResults} className="w-full" variant="outline">
                  <Download aria-hidden />
                  Exportar el cálculo (JSON)
                </Button>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-start gap-3">
                <Calculator aria-hidden className="h-8 w-8 text-ink-3" />
                <p className="t-body text-ink-2">Escribe el precio mensual del plan para ver cuánto pagarás en total.</p>
              </div>
            )}
          </section>
        </div>
      </Section>

      <Section tone="paper" title="¿Qué es el TCO (Total Cost of Ownership)?" density="tight">
        <p className="t-body measure text-ink-2">
          El TCO incluye todos los costos asociados con tu hosting durante su vida útil, no solo el precio mensual. Esto incluye servicios
          adicionales, migraciones, tiempo de inactividad y costos ocultos.
        </p>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {COST_TYPES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" />
              <div>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="t-small text-ink-2">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
};

export default TCOCalculator;
