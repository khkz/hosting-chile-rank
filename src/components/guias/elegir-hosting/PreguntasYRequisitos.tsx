import React from 'react';
import { H2 } from '../GuideBlocks';
import GuideTable from '../GuideTable';

interface Faq {
  question: string;
  answer: string;
}

/**
 * Guía «elegir hosting»: preguntas, requisitos por tipo de sitio y errores.
 * Las preguntas llegan del mismo arreglo que alimenta el JSON-LD de la página,
 * para que el texto visible y el marcado digan lo mismo.
 */
export const Preguntas: React.FC<{ faqs: Faq[] }> = ({ faqs }) => (
  <>
    <H2 id="preguntas">3. Preguntas que debes hacerte</H2>
    {faqs.map((f) => (
      <React.Fragment key={f.question}>
        <h3>{f.question}</h3>
        <p>{f.answer}</p>
      </React.Fragment>
    ))}
  </>
);

const REQUISITOS = [
  {
    key: 'blog',
    tipo: 'Blog personal',
    requisitos: ['1–5 GB de espacio', 'SSL gratuito', 'Soporte para WordPress'],
    sugerido: 'Hosting compartido básico',
  },
  {
    key: 'empresa',
    tipo: 'Sitio empresarial',
    requisitos: ['10–20 GB de espacio', 'SSL gratuito', 'Correos corporativos', 'Backups diarios'],
    sugerido: 'Hosting compartido premium',
  },
  {
    key: 'tienda',
    tipo: 'Tienda online',
    requisitos: ['20+ GB de espacio', 'SSL wildcard', 'Certificación PCI', 'Backups diarios', 'IP dedicada'],
    sugerido: 'VPS o hosting e-commerce',
  },
  {
    key: 'app',
    tipo: 'Aplicación web',
    requisitos: ['Recursos dedicados', 'Control de configuración', 'Escalabilidad on-demand', 'Alta disponibilidad'],
    sugerido: 'VPS o servidor dedicado',
  },
];

export const Requisitos: React.FC = () => (
  <>
    <H2 id="websiterequisitos">4. Requisitos según tipo de sitio web</H2>
    <GuideTable
      caption="Requisitos recomendados y hosting sugerido según el tipo de sitio"
      columns={['Tipo de sitio', 'Requisitos recomendados', 'Hosting sugerido']}
      rows={REQUISITOS.map((r) => ({
        key: r.key,
        cells: [
          r.tipo,
          <ul key="req">
            {r.requisitos.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>,
          r.sugerido,
        ],
      }))}
    />
  </>
);

const ERRORES = [
  {
    t: 'Elegir solo por precio',
    d: 'El hosting más barato suele ofrecer recursos limitados, soporte deficiente y tiempos de carga lentos, afectando negativamente la experiencia del usuario y el SEO.',
  },
  {
    t: 'No verificar las políticas de respaldo',
    d: 'Muchos proveedores económicos no realizan backups automáticos o cobran extra por restaurarlos. Asegúrate que incluyan respaldos automáticos y gratuitos.',
  },
  {
    t: 'Ignorar la ubicación del servidor',
    d: 'Para sitios orientados al público chileno, un servidor ubicado en Chile o al menos en Latinoamérica ofrecerá mejor velocidad que uno en Europa o Estados Unidos.',
  },
  {
    t: 'No considerar la escalabilidad',
    d: 'Tu proyecto web probablemente crecerá con el tiempo. Asegúrate que tu proveedor permita escalar fácilmente a planes superiores sin complicaciones o costos ocultos.',
  },
  {
    t: 'Desatender los términos de servicio',
    d: 'Algunos proveedores tienen políticas restrictivas sobre contenido, uso de recursos o cancelación. Lee siempre los términos de servicio antes de contratar.',
  },
];

export const ErroresComunes: React.FC = () => (
  <>
    <H2 id="errorescomunes">5. Errores comunes al elegir hosting</H2>
    {ERRORES.map((e) => (
      <React.Fragment key={e.t}>
        <h3>{e.t}</h3>
        <p>{e.d}</p>
      </React.Fragment>
    ))}
  </>
);
