import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RANKING_FACTORS, FORMULA_TEXT } from '@/lib/rankingWeights';
import { COMMERCIAL_DISCLOSURE } from '@/data/verified2026';

const Methodology = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Puntuación y Metodología</h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-6">
            Cada proveedor recibe un puntaje de 0 a 10 a partir de cinco factores con pesos publicados.
            Las fuentes son mediciones propias de uptime y TTFB, reclamos públicos y documentación
            declarada por cada proveedor. Los puntajes compuestos que provienen de benchmarks en escala
            0–100 se normalizan a 0–10 antes de combinarse.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factor</TableHead>
                  <TableHead className="text-right">Peso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RANKING_FACTORS.map((factor) => (
                  <TableRow key={factor.key}>
                    <TableCell className="font-medium">{factor.label}</TableCell>
                    <TableCell className="text-right">{factor.weight} %</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-4 font-mono break-words">{FORMULA_TEXT}</p>
          <p className="text-sm text-muted-foreground mt-4">
            Detalle de fuentes, frecuencias y normalización en{' '}
            <Link to="/metodologia" className="text-primary hover:underline">
              /metodologia
            </Link>
            .
          </p>
          <p className="text-xs text-muted-foreground mt-2">{COMMERCIAL_DISCLOSURE}</p>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
