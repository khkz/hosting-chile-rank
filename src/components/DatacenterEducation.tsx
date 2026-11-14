import React from 'react';
import { Building2, House } from 'lucide-react';
import Section from '@/components/system/Section';
import EditorialImage from '@/components/media/EditorialImage';
import { HostsFold, OperatorsFold } from '@/components/home/DatacenterRegistry';
import { VERIFICATION_DATE_HUMAN } from '@/data/verified2026';

/**
 * «¿Dónde vive realmente tu sitio?»: qué es un datacenter real, operadores
 * certificados, datacenter por proveedor, preguntas antes de contratar y fuentes.
 * Todo sale de src/data/datacenters.ts, con su fuente pública.
 */

const REAL = [
  'Edificio diseñado desde los cimientos para alojar servidores: pisos, paredes y techo con especificaciones técnicas.',
  'Estructura pensada para carga de racks, aislamiento acústico, rutas de cableado y acceso controlado.',
  'Redundancia N+1 en energía y enfriamiento, con certificaciones o auditorías de terceros publicadas por el operador.',
  'Control de acceso biométrico, CCTV y documentación pública de tier y certificaciones.',
];

const ADAPTED = [
  'Casa, oficina o bodega diseñada originalmente para personas, adaptada después para poner servidores.',
  'Pisos, paredes y techo no construidos para soportar racks, calor constante ni ruido industrial.',
  'Mayor exposición a riesgos locales: sismos, cortes de energía, humedad y refrigeración doméstica no redundante.',
  'Sin auditoría de terceros ni certificación pública de tier. «Homologable» no es lo mismo que certificado.',
];

const CHECKLIST = [
  '¿En qué datacenter físico está alojado? (nombre y ciudad)',
  '¿Quién opera ese datacenter y qué certificación tiene?',
  '¿La certificación es «Design», «Constructed Facility» u «Operational Sustainability»?',
  '¿El proveedor es dueño del datacenter o hace colocation?',
  '¿Puede compartir el enlace público a la certificación?',
  '¿Qué SLA de disponibilidad ofrece y cómo se compensa?',
  '¿Tiene entidad legal local para emitir factura?',
  '¿Publica métricas reales de uptime y latencia?',
];

const textLink = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const Comparison: React.FC<{ Icon: React.ComponentType<{ className?: string }>; title: string; items: string[] }> = ({
  Icon,
  title,
  items,
}) => (
  <article className="border-t-2 border-ink pt-4">
    <h3 className="t-h3 flex items-center gap-2 text-ink">
      <Icon className="h-5 w-5 shrink-0 text-ink-2" aria-hidden />
      {title}
    </h3>
    <ul className="mt-3 divide-y divide-rule">
      {items.map((item) => (
        <li key={item} className="py-2.5 text-base leading-relaxed text-ink-2 md:text-[15px]">
          {item}
        </li>
      ))}
    </ul>
  </article>
);

const DatacenterEducation: React.FC = () => (
  <Section
    id="dc-education"
    tone="paper"
    title="¿Dónde vive realmente tu sitio?"
    lead="No todo lo que se llama «datacenter» lo es. La diferencia clave está en la construcción: un datacenter real se diseña desde los cimientos para alojar servidores; una oficina o casa adaptada conserva los riesgos de una vivienda u oficina común."
  >
    {/* 1) Datacenter real frente a «datacenter propio», con una sola imagen */}
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
        <Comparison Icon={Building2} title="Datacenter real" items={REAL} />
        <Comparison Icon={House} title="«Datacenter propio»" items={ADAPTED} />
      </div>
      <figure className="min-w-0 lg:col-span-5">
        <EditorialImage
          name="datacenter"
          className="aspect-[4/3]"
          sizes="(min-width: 1024px) 40vw, 100vw"
          fallback={
            <>
              <img
                src="/img/datacenter-real.jpg?v=ascenty2"
                alt="Foto aérea del datacenter Ascenty en Santiago, Chile: edificio industrial con equipos de enfriamiento redundantes"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <figcaption className="t-meta mt-2">Ascenty SCL2 en Quilicura, Santiago, Chile.</figcaption>
            </>
          }
        />
      </figure>
    </div>

    {/* 2) y 3) Registro de operadores y de datacenter por proveedor (plegables) */}
    <div className="mt-12 border-t border-rule">
      <OperatorsFold />
      <HostsFold />
    </div>

    {/* 4) Preguntas antes de contratar y 5) metodología y fuentes */}
    <div className="mt-12 grid gap-10 lg:grid-cols-2">
      <div>
        <h3 className="t-h3 border-t-2 border-ink pt-4 text-ink">
          Checklist antes de contratar
        </h3>
        <ol className="mt-3 divide-y divide-rule">
          {CHECKLIST.map((item, i) => (
            <li key={item} className="flex gap-3 py-2.5 text-base text-ink-2 md:text-[15px]">
              <span className="w-5 shrink-0 font-semibold text-ink-3 tabular">{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="t-h3 border-t-2 border-ink pt-4 text-ink">
          Metodología y fuentes
        </h3>
        <ul className="mt-3 divide-y divide-rule text-base leading-relaxed text-ink-2 md:text-[15px]">
          <li className="py-2.5">
            <strong className="font-semibold text-ink">Certificaciones:</strong> Uptime Institute Awards Chile (
            <a
              className={textLink}
              href="https://uptimeinstitute.com/uptime-institute-awards/country/id/CL"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              lista oficial pública
            </a>
            ), página pública de certificaciones de Ascenty (ISO/IEC 27001, PCI-DSS, SOC 1/2/3 Type II).
          </li>
          <li className="py-2.5">
            <strong className="font-semibold text-ink">Datacenter declarado por host:</strong> únicamente lo declarado en
            el sitio oficial del proveedor a la fecha de última revisión.
          </li>
          <li className="py-2.5">
            <strong className="font-semibold text-ink">Regla dura:</strong> sin fuente pública verificable, el estado
            queda como «no divulga». «Tier III homologable» u otras autodeclaraciones sin auditoría de tercero se marcan
            como <em>autodeclarado</em>.
          </li>
          <li className="py-2.5">
            <strong className="font-semibold text-ink">HostingPlus:</strong> se lista como colocation dentro de Ascenty
            SCL2, no como datacenter propio.
          </li>
          <li className="py-2.5">
            Última revisión de fuentes: {VERIFICATION_DATE_HUMAN}. Si detectas un cambio, escríbenos a{' '}
            <a className={textLink} href="mailto:contacto@eligetuhosting.cl">
              contacto@eligetuhosting.cl
            </a>{' '}
            y lo corregimos con evidencia.
          </li>
        </ul>
      </div>
    </div>

    {/* 6) Divulgación de comisión */}
    <p className="measure mt-10 border-t border-rule pt-4 text-base text-ink-2 md:text-sm">
      <strong className="font-semibold text-ink">Divulgación:</strong> algunos enlaces a proveedores pueden generar
      comisión si contratas por nuestra recomendación. Eso no cambia el estado de certificación declarado en esta tabla:
      el estado depende únicamente de fuentes públicas del operador o del proveedor, no de acuerdos comerciales con
      nosotros.
    </p>
  </Section>
);

export default DatacenterEducation;
