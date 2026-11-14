import React from 'react';
import { Link } from 'react-router-dom';
import Section from '@/components/system/Section';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RANKING_FACTORS, FORMULA_TEXT } from '@/lib/rankingWeights';
import { COMMERCIAL_DISCLOSURE } from '@/data/verified2026';
import { formatPercent } from '@/lib/format';

/** «Uptime & Disponibilidad» pasa a «Uptime y disponibilidad» (solo presentación). */
const sentenceLabel = (label: string) =>
  label.replace(/\s*&\s*(\S)/g, (_m, c: string) => ` y ${c.toLowerCase()}`);

/** Fórmula publicada con coma decimal y signo de multiplicación, en la letra del texto. */
const formulaText = FORMULA_TEXT.replace(/^score_final/, 'Nota final')
  .replace(/(\d)\.(\d)/g, '$1,$2')
  .replace(/\s*\u00B7\s*/g, ' × ');

const Methodology: React.FC<{ tone?: 'white' | 'paper' }> = ({ tone = 'white' }) => (
  <Section id="metodologia" tone={tone} title="Puntuación y metodología">
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="t-body space-y-4 text-ink-2 lg:col-span-6">
        <p className="measure">
          Cada proveedor recibe un puntaje de 0 a 10 a partir de cinco factores con pesos publicados. Las fuentes son
          mediciones propias de uptime y TTFB, reclamos públicos y documentación declarada por cada proveedor. Los
          puntajes compuestos que provienen de benchmarks en escala 0–100 se normalizan a 0–10 antes de combinarse.
        </p>
        <p className="measure rounded-xl border border-rule bg-paper p-4 text-ink">
          <span className="t-label block">Fórmula</span>
          <span className="mt-1 block break-words tabular">{formulaText}</span>
        </p>
        <p className="measure">
          Detalle de fuentes, frecuencias y normalización en la{' '}
          <Link to="/metodologia" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            metodología
          </Link>
          .
        </p>
        <p className="t-small measure text-ink-3">{COMMERCIAL_DISCLOSURE}</p>
      </div>
      <div className="lg:col-span-6">
        <Table className="text-[15px]">
          <TableHeader>
            <TableRow>
              <TableHead>Factor</TableHead>
              <TableHead className="text-right">Peso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RANKING_FACTORS.map((factor) => (
              <TableRow key={factor.key} className="hover:bg-transparent">
                <TableCell className="font-medium">{sentenceLabel(factor.label)}</TableCell>
                <TableCell className="text-right font-semibold tabular">{formatPercent(factor.weight, 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </Section>
);

export default Methodology;
