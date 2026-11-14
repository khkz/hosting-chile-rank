import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDataDate, isoDate } from '@/lib/format';

/**
 * Columna lateral de /vota-hosting. Las reseñas están escritas a mano en el
 * código (no vienen de la base) y la promesa de descuentos es comercial: ambas
 * son la decisión pendiente 9 («testimonios y cifras comerciales»), así que se
 * muestran tal cual, solo con el estilo del sistema.
 */
const RESENAS_RECIENTES = [
  {
    id: 1,
    proveedor: 'HostingPlus',
    nombre: 'Carlos Muñoz',
    calificacion: '5',
    comentario:
      'Increíble servicio. El soporte técnico respondió en menos de 5 minutos a mi consulta y logré solucionar un problema que tenía hace días. La velocidad de carga de mi sitio mejoró notablemente al migrar a ellos.',
    fecha: '2026-01-07',
  },
  {
    id: 2,
    proveedor: 'EcoHosting',
    nombre: 'Daniela Vargas',
    calificacion: '4',
    comentario:
      'Me encanta que usen energías renovables. El panel de control es muy intuitivo y todo funciona muy bien. El único inconveniente es que a veces el soporte tarda en responder los fines de semana.',
    fecha: '2026-01-05',
  },
  {
    id: 3,
    proveedor: '1Hosting',
    nombre: 'Felipe Araya',
    calificacion: '5',
    comentario:
      'Relación precio/calidad inmejorable. Tengo mi tienda online con ellos y nunca he tenido problemas de disponibilidad. El servidor es rápido y tienen un excelente plan de precios.',
    fecha: '2026-01-03',
  },
];

const RAZONES = [
  'Ayudas a otros a tomar mejores decisiones',
  'Contribuyes a mejorar la calidad del servicio',
  'Generas transparencia en el mercado de hosting',
  'Recibes descuentos exclusivos en futuras contrataciones',
];

const VotaAside = () => (
  <div className="space-y-6">
    <section aria-labelledby="resenas-recientes" className="rounded-xl border border-rule bg-white p-5 md:p-6">
      <h2 id="resenas-recientes" className="t-h3 text-ink">
        Reseñas recientes
      </h2>
      <p className="t-small mt-1 text-ink-2">Opiniones de otros usuarios</p>
      <ul className="mt-4 divide-y divide-rule">
        {RESENAS_RECIENTES.map((r) => (
          <li key={r.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-ink">{r.proveedor}</h3>
                <p className="t-meta mt-0.5 flex flex-wrap gap-x-3">
                  <span>{r.nombre}</span>
                  <time dateTime={isoDate(r.fecha)}>{formatDataDate(r.fecha)}</time>
                </p>
              </div>
              <Badge variant="secondary" className="tabular shrink-0">
                {r.calificacion} de 5
              </Badge>
            </div>
            <p className="t-small mt-2 text-ink-2">{r.comentario}</p>
          </li>
        ))}
      </ul>
    </section>

    <section aria-labelledby="por-que-votar" className="rounded-xl border border-rule bg-white p-5 md:p-6">
      <h2 id="por-que-votar" className="t-h3 text-ink">
        ¿Por qué votar?
      </h2>
      <p className="t-small mt-2 text-ink-2">
        Tu opinión es muy valiosa para otros usuarios que están buscando un proveedor de hosting confiable. Al compartir
        tu experiencia:
      </p>
      <ul className="mt-3 space-y-2">
        {RAZONES.map((r) => (
          <li key={r} className="t-small flex items-start gap-2 text-ink">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" aria-hidden />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </section>
  </div>
);

export default VotaAside;
