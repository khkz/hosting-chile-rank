import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { NavGroup } from '@/lib/siteNav';
import SmartLink from './SmartLink';

/**
 * Menú «Guías y herramientas» (desde 768 px). Funciona con teclado: Enter o
 * Espacio lo abren, las flechas recorren los 20 enlaces, Enter navega y Esc cierra.
 * Solo usa piezas de menú de Radix (grupos con su rótulo), sin listas dentro
 * de role="menu".
 */
const GuidesMenu: React.FC<{ guides: NavGroup[]; crossGuides: boolean }> = ({ guides, crossGuides }) => {
  const baseId = React.useId();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="hidden h-11 items-center gap-1 whitespace-nowrap rounded-lg px-3 text-[15px] font-medium text-ink-2 hover:bg-paper hover:text-ink data-[state=open]:bg-paper data-[state=open]:text-ink md:inline-flex"
        >
          Guías y herramientas
          <ChevronDown className="h-4 w-4" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-[min(92vw,760px)] rounded-xl border-rule bg-white p-0 shadow-overlay">
        {crossGuides && (
          <DropdownMenuLabel className="border-b border-rule px-4 py-2.5 text-[13px] font-normal text-ink-3">
            Guías y herramientas de la edición Chile: se abren en eligetuhosting.cl.
          </DropdownMenuLabel>
        )}
        <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-rule">
          {guides.map((group, gi) => {
            const labelId = `${baseId}-grupo-${gi}`;
            return (
              <DropdownMenuGroup key={group.title} aria-labelledby={labelId} className="p-3">
                <DropdownMenuLabel id={labelId} className="px-2 pb-1.5 pt-1 text-[13px] font-semibold text-ink-3">
                  {group.title}
                </DropdownMenuLabel>
                {group.items.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="min-h-11 cursor-pointer rounded-lg px-2 text-sm text-ink focus:bg-paper focus:text-ink xl:min-h-9"
                  >
                    <SmartLink item={item} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GuidesMenu;
