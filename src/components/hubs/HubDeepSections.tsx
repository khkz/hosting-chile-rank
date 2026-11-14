import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import type { HubKey } from '@/lib/segmentHubs';
import { HUB_DEEP } from '@/lib/hubDeepContent';
import Section from '@/components/system/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaqAccordion } from '@/components/hubs/RankingFaq';

/**
 * Contenido de fondo de cada hub (problema, cómo evaluamos, plan, casos,
 * objeciones y enlaces), en el mismo orden de siempre. La divulgación y la
 * frase de entrada se dibujan en IntentHub, antes de estas secciones.
 */

const linkClass = 'font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const HubDeepSections: React.FC<{ hubKey: HubKey }> = ({ hubKey }) => {
  const d = HUB_DEEP[hubKey];
  if (!d) return null;

  return (
    <>
      <Section id="problema" tone="paper" title={d.problem.title}>
        <p className="t-body measure text-ink-2">{d.problem.body}</p>
        <ul className="mt-5 max-w-[62ch] space-y-2">
          {d.problem.pains.map((pain) => (
            <li key={pain} className="flex gap-2 text-ink">
              <X className="mt-1 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
              <span>{pain}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="como-evaluamos" title={d.guide.title} lead={d.guide.body}>
        <ul className="grid gap-4 md:grid-cols-3">
          {d.guide.pillars.map((pillar) => (
            <li key={pillar.h} className="rounded-xl border border-rule bg-white p-5">
              <h3 className="t-h3 text-ink">{pillar.h}</h3>
              <p className="t-small mt-2 text-ink-2">{pillar.p}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <p className="t-label">Datos que verificamos</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {d.criteria.map((criterion) => (
              <li key={criterion}>
                <Badge variant="outline" className="text-[13px] font-medium">
                  {criterion}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="plan" tone="paper" density="tight" title={d.plan.title}>
        <ol className="max-w-[62ch] space-y-3">
          {d.plan.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-ink">
              <span className="w-6 shrink-0 font-bold tabular text-ink-3">{i + 1}.</span>
              <span className="t-body">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="casos" title="¿En qué caso estás?">
        <ul className="grid gap-4 md:grid-cols-3">
          {d.journeys.map((j) => (
            <li key={j.persona} className="flex flex-col rounded-xl border border-rule bg-white p-5">
              <h3 className="t-h3 text-ink">{j.persona}</h3>
              <p className="t-small mt-2 flex-1 text-ink-2">{j.scenario}</p>
              <p className="t-small mt-4 text-ink-2">
                Recomendado: <span className="font-semibold text-ink">{j.recommendation}</span>
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Button asChild variant="outline" size="sm" className="h-11">
                  <Link to={`/catalogo/${j.slug}`}>Ver ficha</Link>
                </Button>
                {j.guide && (
                  <Link to={j.guide.href} className={`${linkClass} t-small inline-flex min-h-[44px] items-center`}>
                    {j.guide.label}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="objeciones" tone="paper" title="Objeciones frecuentes (respondidas con datos)">
        <FaqAccordion items={d.objections.map((o) => ({ question: o.q, answer: o.a }))} idPrefix="objeciones" />
      </Section>

      <Section id="sigue-investigando" density="tight" title="Sigue investigando">
        <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
          {d.internalLinks.map((l) => (
            <li key={l.href}>
              <Link to={l.href} className={`${linkClass} inline-flex min-h-[44px] items-center`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
};

export default HubDeepSections;
