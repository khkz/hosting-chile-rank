import React from 'react';

interface Props {
  values: (number | null)[];
  daysWithData: number;
  width?: number;
  height?: number;
  ariaLabel?: string;
}

/**
 * Sparkline SVG de TTFB (30 días). Si hay menos de 7 días con datos,
 * muestra un placeholder amable en lugar de una curva engañosa.
 */
const Sparkline: React.FC<Props> = ({
  values,
  daysWithData,
  width = 120,
  height = 32,
  ariaLabel = 'Tendencia de TTFB 30 días',
}) => {
  if (daysWithData < 7) {
    return (
      <span className="text-[11px] text-muted-foreground italic">
        Acumulando histórico ({daysWithData}/7 días)
      </span>
    );
  }
  const nums = values.map((v) => (typeof v === 'number' ? v : null));
  const definedVals = nums.filter((v): v is number => v != null);
  const min = Math.min(...definedVals);
  const max = Math.max(...definedVals);
  const range = max - min || 1;
  const n = nums.length;
  const step = n > 1 ? width / (n - 1) : width;
  const pad = 2;
  const yFor = (v: number) => height - pad - ((v - min) / range) * (height - pad * 2);

  // Path que se corta cuando faltan datos (evita interpolar días vacíos).
  let d = '';
  let penDown = false;
  nums.forEach((v, i) => {
    if (v == null) {
      penDown = false;
      return;
    }
    const x = i * step;
    const y = yFor(v);
    d += `${penDown ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)} `;
    penDown = true;
  });

  const lastIdx = nums.map((v, i) => (v != null ? i : -1)).filter((i) => i >= 0).pop();
  const lastX = lastIdx != null ? lastIdx * step : 0;
  const lastY = lastIdx != null ? yFor(nums[lastIdx] as number) : 0;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${ariaLabel}: mediana entre ${min} y ${max} ms en ${daysWithData} de 30 días`}
      className="inline-block align-middle"
    >
      <path d={d.trim()} fill="none" stroke="#EF233C" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {lastIdx != null && <circle cx={lastX} cy={lastY} r={2} fill="#EF233C" />}
    </svg>
  );
};

export default Sparkline;
