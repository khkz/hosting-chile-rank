import React from 'react';
import {
  GraduationCap,
  Globe,
  LayoutTemplate,
  Lock,
  Palette,
  Search,
  Server,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WikiCategoryIconName, WikiTerm } from '@/data/wiki/terms';
import { CMS_LABEL, LEVEL_LABEL } from '@/components/lectura/wikiLabels';

const ICONS: Record<WikiCategoryIconName, LucideIcon> = {
  Wrench,
  Palette,
  Search,
  Zap,
  ShieldCheck,
  ShoppingCart,
  GraduationCap,
  LayoutTemplate,
  TrendingUp,
  Server,
  Globe,
  Lock,
};

/** Ícono lucide de una categoría de la wiki (decorativo: el nombre va en texto al lado). */
export const WikiCategoryIcon: React.FC<{ name: WikiCategoryIconName; className?: string }> = ({ name, className }) => {
  const Icon = ICONS[name] ?? Search;
  return <Icon aria-hidden className={cn('h-5 w-5 shrink-0 text-ink-2', className)} />;
};

const LEVEL_STEP: Record<WikiTerm['level'], number> = { basico: 1, medio: 2, avanzado: 3 };

/** Tres barras de alto creciente; se rellenan tantas como el nivel. Decorativas: el nivel va en texto. */
const LevelBars: React.FC<{ step: number }> = ({ step }) => (
  <svg viewBox="0 0 11 10" width={11} height={10} aria-hidden className="shrink-0">
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={i * 4}
        y={6 - i * 3}
        width={3}
        height={4 + i * 3}
        rx={0.5}
        className={i < step ? 'fill-ink-2' : 'fill-rule'}
      />
    ))}
  </svg>
);

const tag = 'inline-flex items-center gap-1.5 rounded-sm border border-rule bg-white px-2 py-0.5 text-xs font-semibold leading-5 text-ink-2';

/** Nivel del término: etiqueta neutra con barras (sin color de alerta). */
export const LevelTag: React.FC<{ level: WikiTerm['level']; className?: string }> = ({ level, className }) => (
  <span className={cn(tag, className)}>
    <LevelBars step={LEVEL_STEP[level] ?? 1} />
    <span className="sr-only">Nivel </span>
    {LEVEL_LABEL[level] ?? level}
  </span>
);

/** CMS o plataforma del término, con su nombre bien escrito. */
export const CmsTag: React.FC<{ cms: WikiTerm['cms']; className?: string }> = ({ cms, className }) => (
  <span className={cn(tag, 'bg-paper', className)}>{CMS_LABEL[cms] ?? cms}</span>
);
