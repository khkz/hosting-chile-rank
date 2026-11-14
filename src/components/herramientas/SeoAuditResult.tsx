import React from 'react';
import { Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Callout from '@/components/system/Callout';
import { ProvenanceTag } from '@/components/data/Provenance';
import { formatInteger, formatMoney, formatScore } from '@/lib/format';
import { SEVERITY_LABEL } from './seoAuditContent';
import type { MiniAuditResult } from './useSeoMiniAudit';
import { formatToolDateTime, isoDateTime } from './dataTime';

/** Resultado de la mini-auditoría: puntajes, rendimiento, keywords y problemas, con fuente y hora. */
const SeoAuditResult: React.FC<{ result: MiniAuditResult; checkedAt: string | null }> = ({ result, checkedAt }) => {
  const sources = [result.data_sources.pagespeed && 'PageSpeed Insights', result.data_sources.dataforseo && 'DataForSEO'].filter(Boolean);
  const subscores = [
    { label: 'Técnico', value: result.scores.technical },
    { label: 'Contenido', value: result.scores.content },
    { label: 'UX', value: result.scores.ux },
    { label: 'SERP', value: result.scores.serp },
    { label: 'Backlinks', value: result.scores.backlinks, locked: true },
  ];
  const perf = result.performance;
  const top = result.keywords?.top ?? [];

  return (
    <article aria-labelledby="mini-audit-titulo" className="rounded-xl border border-rule bg-white">
      <header className="flex flex-col gap-4 border-b border-rule bg-paper p-5 md:flex-row md:items-end md:justify-between md:p-6">
        <div className="min-w-0">
          <p className="t-meta">Mini-audit de</p>
          <h2 id="mini-audit-titulo" className="t-h2 break-all text-ink">{result.domain}</h2>
          <p className="t-meta mt-2 flex flex-wrap items-center gap-2">
            <ProvenanceTag kind="measured" />
            <span>
              {sources.length ? `Fuente: ${sources.join(' y ')}` : 'Fuente: análisis propio'}
              {checkedAt && (
                <>
                  , consultado el <time dateTime={isoDateTime(checkedAt)}>{formatToolDateTime(checkedAt)}</time>
                </>
              )}
              .
            </span>
          </p>
        </div>
        <div className="shrink-0">
          <p className="t-label">Score SEO</p>
          <p className="tabular text-5xl font-extrabold leading-none text-ink">{formatInteger(result.scores.total)}</p>
        </div>
      </header>

      <div className="space-y-8 p-5 md:p-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-5">
          {subscores.map((s) => (
            <div key={s.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <dt className="t-small text-ink-2">{s.label}</dt>
                <dd className="tabular font-bold text-ink">
                  {s.locked ? <Lock aria-label="Disponible en el informe completo" className="h-3.5 w-3.5 text-ink-3" /> : formatInteger(s.value)}
                </dd>
              </div>
              <Progress value={s.locked ? 0 : s.value} className="h-2 bg-paper-deep" aria-hidden />
            </div>
          ))}
        </dl>

        {perf && (
          <dl className="grid grid-cols-2 gap-4 border-y border-rule py-4 md:grid-cols-4">
            {[
              { label: 'Performance', value: formatInteger(perf.performance) },
              { label: 'LCP', value: `${formatScore(perf.lcp_ms / 1000)} s` },
              { label: 'CLS', value: formatScore(perf.cls, 2) },
              { label: 'SEO Lighthouse', value: formatInteger(perf.seo) },
            ].map((m) => (
              <div key={m.label}>
                <dt className="t-label">{m.label}</dt>
                <dd className="tabular mt-1 text-2xl font-bold text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {top.length > 0 && (
          <section aria-labelledby="mini-audit-keywords">
            <h3 id="mini-audit-keywords" className="t-h3 text-ink">Top keywords en Google Chile</h3>
            <div className="mt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Posición</TableHead>
                    <TableHead>Volumen</TableHead>
                    <TableHead>CPC</TableHead>
                    <TableHead>Dificultad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {top.map((k, i) => (
                    <TableRow key={`${k.keyword}-${i}`}>
                      <TableCell className="font-semibold">{k.keyword}</TableCell>
                      <TableCell>#{k.position}</TableCell>
                      <TableCell>{k.search_volume != null ? formatInteger(k.search_volume) : 'Sin dato'}</TableCell>
                      <TableCell>{k.cpc != null ? formatMoney(k.cpc, 'USD') : 'Sin dato'}</TableCell>
                      <TableCell>{k.difficulty ?? 'Sin dato'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {(result.keywords?.total_keywords ?? 0) > 5 && (
              <p className="t-meta mt-2">
                Mostrando 5 de {formatInteger(result.keywords?.total_keywords)} keywords totales. Suscríbete para ver todas.
              </p>
            )}
          </section>
        )}

        <section aria-labelledby="mini-audit-problemas">
          <h3 id="mini-audit-problemas" className="t-h3 text-ink">Problemas detectados ({formatInteger(result.issues.length)})</h3>
          <ul className="mt-3 divide-y divide-rule border-y border-rule">
            {result.issues.slice(0, 5).map((issue, i) => (
              <li key={`${issue.title}-${i}`} className="flex items-start gap-3 py-3">
                <Badge variant={issue.severity === 'critical' || issue.severity === 'high' ? 'ink' : 'outline'} className="shrink-0">
                  {SEVERITY_LABEL[issue.severity] ?? issue.severity}
                </Badge>
                <div className="min-w-0">
                  <p className="t-small font-semibold text-ink">{issue.title}</p>
                  <p className="t-meta mt-0.5">{issue.recommendation}</p>
                </div>
              </li>
            ))}
          </ul>
          {result.issues.length > 5 && (
            <div className="mt-4 rounded-xl border border-dashed border-rule bg-paper p-4">
              <p className="t-small font-semibold text-ink">y {formatInteger(result.issues.length - 5)} problemas más</p>
              <p className="t-meta mt-0.5">Más backlinks, competidores y plan de acción priorizado</p>
              <Button asChild size="sm" variant="outline" className="mt-3 h-11 sm:h-9">
                <a href="#planes">Ver informe completo</a>
              </Button>
            </div>
          )}
        </section>

        {!result.data_sources.dataforseo && (
          <Callout className="my-0">
            <p>Mini-audit corriendo sin datos SERP en vivo. El informe completo tras suscripción incluye keywords y backlinks reales de DataForSEO.</p>
          </Callout>
        )}
      </div>
    </article>
  );
};

export default SeoAuditResult;
