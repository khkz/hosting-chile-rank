import React from 'react';
import type { EditionCode } from '@/lib/countries';

/**
 * Banderas en SVG (3:2). Los emojis de bandera no se dibujan en Windows,
 * donde aparecen como letras sueltas; estas se ven igual en todo sistema.
 * Los escudos se simplifican a un emblema mínimo a tamaño de icono.
 */

const star = (cx: number, cy: number, r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.4;
    pts.push(`${(cx + rr * Math.cos(rad)).toFixed(2)},${(cy + rr * Math.sin(rad)).toFixed(2)}`);
  }
  return pts.join(' ');
};

const hBands = (colors: string[]) => {
  const h = 20 / colors.length;
  return colors.map((c, i) => <rect key={i} x={0} y={i * h} width={30} height={h + 0.01} fill={c} />);
};

const vBands = (colors: string[]) => {
  const w = 30 / colors.length;
  return colors.map((c, i) => <rect key={i} x={i * w} y={0} width={w + 0.01} height={20} fill={c} />);
};

const FLAGS: Record<EditionCode, React.ReactNode> = {
  CL: (
    <>
      <rect width={30} height={10} fill="#FFFFFF" />
      <rect y={10} width={30} height={10} fill="#D52B1E" />
      <rect width={10} height={10} fill="#0039A6" />
      <polygon points={star(5, 5, 3)} fill="#FFFFFF" />
    </>
  ),
  PE: <>{vBands(['#D91023', '#FFFFFF', '#D91023'])}</>,
  MX: (
    <>
      {vBands(['#006847', '#FFFFFF', '#CE1126'])}
      <circle cx={15} cy={10} r={2.4} fill="#7A5230" />
    </>
  ),
  CO: (
    <>
      <rect width={30} height={10} fill="#FCD116" />
      <rect y={10} width={30} height={5} fill="#003893" />
      <rect y={15} width={30} height={5} fill="#CE1126" />
    </>
  ),
  AR: (
    <>
      {hBands(['#74ACDF', '#FFFFFF', '#74ACDF'])}
      <circle cx={15} cy={10} r={2.2} fill="#F6B40E" />
    </>
  ),
  UY: (
    <>
      {hBands(['#FFFFFF', '#0038A8', '#FFFFFF', '#0038A8', '#FFFFFF', '#0038A8', '#FFFFFF', '#0038A8', '#FFFFFF'])}
      <rect width={11.1} height={11.1} fill="#FFFFFF" />
      <circle cx={5.55} cy={5.55} r={3} fill="#FCD116" stroke="#7B3F00" strokeWidth={0.4} />
    </>
  ),
  EC: (
    <>
      <rect width={30} height={10} fill="#FFDD00" />
      <rect y={10} width={30} height={5} fill="#034EA2" />
      <rect y={15} width={30} height={5} fill="#ED1C24" />
      <ellipse cx={15} cy={10} rx={2.2} ry={2.8} fill="#6B4A2B" stroke="#FFFFFF" strokeWidth={0.5} />
    </>
  ),
  CR: (
    <>
      <rect width={30} height={20} fill="#002B7F" />
      <rect y={3.33} width={30} height={13.34} fill="#FFFFFF" />
      <rect y={6.67} width={30} height={6.66} fill="#CE1126" />
    </>
  ),
  PA: (
    <>
      <rect width={30} height={20} fill="#FFFFFF" />
      <rect x={15} width={15} height={10} fill="#D21034" />
      <rect y={10} width={15} height={10} fill="#005293" />
      <polygon points={star(7.5, 5, 2.6)} fill="#005293" />
      <polygon points={star(22.5, 15, 2.6)} fill="#D21034" />
    </>
  ),
  DO: (
    <>
      <rect width={30} height={20} fill="#FFFFFF" />
      <rect width={13.4} height={8.4} fill="#002D62" />
      <rect x={16.6} width={13.4} height={8.4} fill="#CE1126" />
      <rect y={11.6} width={13.4} height={8.4} fill="#CE1126" />
      <rect x={16.6} y={11.6} width={13.4} height={8.4} fill="#002D62" />
      <circle cx={15} cy={10} r={1.3} fill="#006300" />
    </>
  ),
  GT: (
    <>
      {vBands(['#4997D0', '#FFFFFF', '#4997D0'])}
      <circle cx={15} cy={10} r={2} fill="none" stroke="#3C7B3C" strokeWidth={0.9} />
    </>
  ),
  BO: <>{hBands(['#D52B1E', '#F9E300', '#007934'])}</>,
  PY: (
    <>
      {hBands(['#D52B1E', '#FFFFFF', '#0038A8'])}
      <circle cx={15} cy={10} r={2} fill="none" stroke="#007934" strokeWidth={0.8} />
      <circle cx={15} cy={10} r={0.7} fill="#F9E300" />
    </>
  ),
};

interface FlagProps {
  code: EditionCode;
  /** Ancho en px; el alto se calcula a 3:2. */
  size?: number;
  className?: string;
  /** Texto alternativo; por defecto decorativa (el nombre del país va al lado). */
  title?: string;
}

const Flag: React.FC<FlagProps> = ({ code, size = 18, className = '', title }) => (
  <svg
    viewBox="0 0 30 20"
    width={size}
    height={(size * 2) / 3}
    className={`inline-block shrink-0 rounded-[2px] ${className}`}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    aria-label={title}
  >
    {FLAGS[code]}
    <rect x={0.25} y={0.25} width={29.5} height={19.5} fill="none" stroke="rgb(15 34 56 / 0.28)" strokeWidth={1} vectorEffect="non-scaling-stroke" rx={0.6} />
  </svg>
);

export default Flag;
