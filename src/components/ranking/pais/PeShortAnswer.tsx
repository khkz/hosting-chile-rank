import React from 'react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { formatScore } from '@/lib/format';
import { money } from './peTypes';

/**
 * «Respuesta corta» de Perú. Mismo contenido que antes (pendiente 6: notas
 * de Perú); cambia la forma: nota en tinta con procedencia editorial y los
 * datos sueltos como filas con su procedencia, sin verde.
 */
const PeShortAnswer: React.FC<{ year: number; rating: number }> = ({ year, rating }) => (
  <div className="max-w-3xl">
    <p className="text-lg leading-relaxed text-ink">
      El mejor hosting de Perú {year} es{' '}
      <strong className="font-semibold">HostingPlus.pe ({formatScore(rating)}/10)</strong>{' '}
      <ProvenanceTag kind="editorial" className="align-middle" />: es el{' '}
      <strong className="font-semibold">único proveedor del directorio PE con datacenter local Tier III certificado</strong>{' '}
      (<strong className="font-semibold">GTD Lima, Perú</strong>), <strong className="font-semibold">0 reclamos INDECOPI</strong> en
      «Mira a Quién le Compras», razón social peruana{' '}
      <strong className="font-semibold">Hostingplus Datacenter S.A.C. (RUC 20611867108)</strong>, soporte 24/7 desde Lima (
      <a href="tel:+5116409409" className="underline underline-offset-4">
        (01) 640 9409
      </a>
      ), <strong className="font-semibold">NVMe RAID 10 + LiteSpeed Enterprise</strong>, planes desde{' '}
      <strong className="font-semibold">{money(70, 'PEN')} al año</strong>, 10 días de prueba y 30 días de garantía.
    </p>

    <dl className="mt-6 grid gap-x-8 gap-y-4 border-y border-rule py-5 sm:grid-cols-3">
      <div>
        <dt className="t-meta flex flex-wrap items-center gap-2">
          Datacenter <ProvenanceTag kind="declared" />
        </dt>
        <dd className="mt-1 font-semibold text-ink">GTD Tier III (Lima)</dd>
      </div>
      <div>
        <dt className="t-meta">Reclamos en INDECOPI</dt>
        <dd className="mt-1 font-semibold text-ink tabular">0</dd>
      </div>
      <div>
        <dt className="t-meta flex flex-wrap items-center gap-2">
          Almacenamiento <ProvenanceTag kind="declared" />
        </dt>
        <dd className="mt-1 font-semibold text-ink">NVMe</dd>
      </div>
    </dl>

    <p className="t-small mt-5 text-ink-2">
      Divulgación honesta: para servidores <strong className="font-semibold text-ink">dedicados</strong> opcionales HostingPlus
      declara datacenter <strong className="font-semibold text-ink">Hivelocity en Tampa, FL (EE.UU.)</strong>. El grupo opera
      además Ascenty Santiago (Tier III) como respaldo regional y es Google Cloud Partner con instancias en São Paulo.
    </p>
    <p className="t-meta mt-3">
      Divulgación de comisión: podemos recibir una comisión si contratas por nuestros enlaces. No altera el orden del ranking.
    </p>
  </div>
);

export default PeShortAnswer;
