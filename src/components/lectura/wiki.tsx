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
  SignalHigh,
  SignalLow,
  SignalMedium,
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

const LEVEL_ICON: Record<WikiTerm['level'], LucideIcon> = {
  basico: SignalLow,
  medio: SignalMedium,
  avanzado: SignalHigh,
};

const tag = 'inline-flex items-center gap-1 rounded-sm border border-rule bg-white px-2 py-0.5 text-xs font-semibold leading-5 text-ink-2';

/** Nivel del término: etiqueta neutra con barras (sin color de alerta). */
export const LevelTag: React.FC<{ level: WikiTerm['level']; className?: string }> = ({ level, className }) => {
  const Icon = LEVEL_ICON[level] ?? SignalLow;
  return (
    <span className={cn(tag, className)}>
      <Icon aria-hidden className="h-3.5 w-3.5 text-ink-3" />
      <span className="sr-only">Nivel </span>
      {LEVEL_LABEL[level] ?? level}
    </span>
  );
};

/** CMS o plataforma del término, con su nombre bien escrito. */
export const CmsTag: React.FC<{ cms: WikiTerm['cms']; className?: string }> = ({ cms, className }) => (
  <span className={cn(tag, 'bg-paper', className)}>{CMS_LABEL[cms] ?? cms}</span>
);
