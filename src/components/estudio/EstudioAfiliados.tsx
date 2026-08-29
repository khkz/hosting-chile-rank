import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { AFFILIATE_CASES, SELF_PROMO } from '@/data/estudio2026';

/**
 * Sección de comparadores con vínculo comercial.
 * Solo se publican casos que resisten verificación literal; cuando la evidencia
 * acredita monetización pero no titularidad, hablamos de vínculo comercial y no
 * de operación. No se publican nombres de personas naturales (Ley 21.719).
 */
const EstudioAfiliados: React.FC = () => (
  <section id="alerta" className="mb-14 scroll-mt-20">
    <div className="flex items-center gap-3 mb-6">
      <AlertTriangle className="w-7 h-7 text-destructive" />
      <h2 className="text-2xl md:text-3xl font-bold">6. Comparadores con vínculo comercial</h2>
    </div>
    <p className="text-muted-foreground mb-6">
      Varios sitios que aparecen primero en Google.cl al buscar «mejor hosting Chile» monetizan mediante enlaces
      de afiliado hacia los proveedores que comparan. Publicamos solo los casos cuya evidencia pudimos verificar
      de forma directa, y distinguimos entre <strong>vínculo comercial acreditado</strong> y titularidad u
      operación, que no damos por probada.
    </p>

    <h3 className="text-xl font-semibold mb-4">6.1 Casos documentados</h3>
    <div className="space-y-5 mb-8">
      {AFFILIATE_CASES.map((c) => (
        <Card key={c.domain} className="p-5 border-l-4 border-l-destructive">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <h4 className="text-lg font-bold font-mono">{c.domain}</h4>
            <Badge variant={c.status === 'verificado' ? 'destructive' : 'secondary'}>
              {c.status === 'verificado' ? 'AFILIACIÓN VERIFICADA' : 'VÍNCULO COMERCIAL'}
            </Badge>
          </div>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-semibold inline">Vinculado comercialmente a: </dt>
              <dd className="inline">{c.link}</dd>
            </div>
            <div>
              <dt className="font-semibold inline">Evidencia: </dt>
              <dd className="inline">{c.evidence}</dd>
            </div>
            <div>
              <dt className="font-semibold inline">Patrón del top: </dt>
              <dd className="inline italic">{c.topPattern}</dd>
            </div>
            <div className="pt-2 text-xs text-muted-foreground border-t mt-3">
              <span className="font-semibold">Evidencia citable:</span> {c.citation}
            </div>
          </dl>
        </Card>
      ))}
    </div>

    <h3 className="text-xl font-semibold mb-4">6.2 Auto-promoción disfrazada de comparativa</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Proveedores que publican «rankings de los mejores hosting de Chile» en su propio dominio, posicionándose a sí
      mismos como #1. No son comparadores: son artículos SEO con disclosure ausente o débil.
    </p>
    <ul className="space-y-2 text-sm mb-6">
      {SELF_PROMO.map((s) => (
        <li key={s.site} className="flex items-start gap-2 p-3 bg-muted/40 rounded">
          <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <span>
            <strong className="font-mono">{s.site}</strong> — {s.conflict}
          </span>
        </li>
      ))}
    </ul>

    <Card className="p-5 bg-primary/5 border-primary/20">
      <h4 className="font-semibold mb-2 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        Qué debería exigirse a un comparador
      </h4>
      <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
        <li>Razón social, RUT chileno y datos de contacto visibles.</li>
        <li>Sección «Transparencia» que declare la política de afiliados y las relaciones comerciales.</li>
        <li>Metodología con pesos publicados.</li>
        <li>Declaración explícita de qué proveedores patrocinan o anuncian.</li>
        <li>Mecanismo público de derecho a réplica.</li>
      </ol>
      <p className="text-sm mt-3">
        Ver nuestra implementación en{' '}
        <Link to="/transparencia-hosting-chile" className="text-primary underline">
          /transparencia-hosting-chile
        </Link>{' '}
        y{' '}
        <Link to="/metodologia" className="text-primary underline">
          /metodologia
        </Link>
        .
      </p>
    </Card>
  </section>
);

export default EstudioAfiliados;
