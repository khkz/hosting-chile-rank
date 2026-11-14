import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, LayoutDashboard, LogOut, Menu } from 'lucide-react';
import Logo from '@/components/Logo';
import Flag from '@/components/data/Flag';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { EditionKey } from '@/lib/countries';
import { editionSwitchHref, type NavGroup, type NavLinkItem } from '@/lib/siteNav';
import { EDITION_ORDER, editionName } from './editions';
import SmartLink from './SmartLink';

interface MobileMenuProps {
  editionKey: EditionKey;
  label: string;
  pathname: string;
  sections: NavLinkItem[];
  isCurrent: (item: NavLinkItem) => boolean;
  guides: NavGroup[];
  crossGuides: boolean;
  userEmail?: string | null;
  onDashboard: () => void;
  onSignOut: () => void;
}

const groupTitle = 't-label mb-1 text-ink-3';

/** Menú lateral bajo 1280 px: secciones de la edición, ediciones, guías y cuenta. Objetivos de 44 px. */
const MobileMenu: React.FC<MobileMenuProps> = ({
  editionKey,
  label,
  pathname,
  sections,
  isCurrent,
  guides,
  crossGuides,
  userEmail,
  onDashboard,
  onSignOut,
}) => {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-paper xl:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88%] max-w-sm overflow-y-auto p-0">
        <SheetTitle className="sr-only">Menú de EligeTuHosting</SheetTitle>
        <div className="flex min-h-16 items-center border-b border-rule py-3 pl-5 pr-14">
          <Logo edition={label} />
        </div>
        <nav aria-label="Menú" className="space-y-7 p-5">
          <section>
            <h3 className={groupTitle}>{label}</h3>
            <ul>
              {sections.map((item) => {
                const current = isCurrent(item);
                return (
                  <li key={item.label}>
                    <SmartLink
                      item={item}
                      onClick={close}
                      aria-current={current ? 'page' : undefined}
                      className={`flex min-h-11 items-center border-b border-rule text-base ${
                        current ? 'font-semibold text-ink' : 'font-medium text-ink-2 hover:text-ink'
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h3 className={groupTitle}>Ediciones</h3>
            <ul className="grid grid-cols-2 gap-x-4">
              {EDITION_ORDER.map((k) => (
                <li key={k}>
                  <a
                    href={editionSwitchHref(k, editionKey, pathname)}
                    aria-current={k === editionKey ? 'page' : undefined}
                    className={`flex min-h-11 items-center gap-2 text-[15px] ${k === editionKey ? 'font-semibold text-ink' : 'text-ink-2 hover:text-ink'}`}
                  >
                    {k === 'LATAM' ? <Globe className="h-4 w-4" aria-hidden /> : <Flag code={k} size={18} />}
                    {editionName(k)}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-5">
            {crossGuides && <p className="t-meta">Guías y herramientas de la edición Chile (eligetuhosting.cl):</p>}
            {guides.map((group) => (
              <section key={group.title}>
                <h3 className={groupTitle}>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <SmartLink item={item} onClick={close} className="flex min-h-11 items-center text-[15px] text-ink-2 hover:text-ink" />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="border-t border-rule pt-4">
            {userEmail ? (
              <div className="space-y-1">
                <p className="truncate text-sm text-ink-2">{userEmail}</p>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    onDashboard();
                  }}
                  className="flex min-h-11 items-center gap-2 text-base font-medium text-ink"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden /> Mi panel
                </button>
                <button type="button" onClick={onSignOut} className="flex min-h-11 items-center gap-2 text-base font-medium text-ink">
                  <LogOut className="h-4 w-4" aria-hidden /> Cerrar sesión
                </button>
              </div>
            ) : (
              <Link to="/auth" onClick={close} className="flex min-h-11 items-center text-base font-medium text-ink">
                Ingresar
              </Link>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
