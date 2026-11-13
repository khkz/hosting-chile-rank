import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Globe, LayoutDashboard, LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Logo from './Logo';
import Flag from './data/Flag';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEdition } from '@/hooks/useEdition';
import {
  PUBLISHED_EDITIONS,
  VERIFYING_EDITIONS,
  editionHref,
  getEdition,
  rankingPath,
  type EditionKey,
} from '@/lib/countries';
import { guideGroups, guidesCrossEdition, sectionsFor, type NavLinkItem } from '@/lib/siteNav';

/** Enlace que usa el router si es relativo y <a> si cruza de dominio. */
const SmartLink: React.FC<{ item: NavLinkItem; className?: string; onClick?: () => void; children?: React.ReactNode; 'aria-current'?: 'page' | undefined }> = ({
  item,
  className,
  onClick,
  children,
  ...rest
}) =>
  item.external ? (
    <a href={item.href} className={className} onClick={onClick} {...rest}>
      {children ?? item.label}
    </a>
  ) : (
    <Link to={item.href} className={className} onClick={onClick} {...rest}>
      {children ?? item.label}
    </Link>
  );

const EDITION_ORDER: EditionKey[] = ['LATAM', ...PUBLISHED_EDITIONS.map((e) => e.code)];

const editionName = (key: EditionKey) => (key === 'LATAM' ? 'Latinoamérica' : getEdition(key).name);

/**
 * Página equivalente al cambiar de país: desde un ranking se va al ranking del
 * otro país; en el resto de páginas, a su portada.
 */
const editionTarget = (target: EditionKey, current: EditionKey, pathname: string): string => {
  if (target !== 'LATAM' && current !== 'LATAM') {
    const from = getEdition(current);
    const to = getEdition(target);
    if (from.status === 'published' && to.status === 'published' && pathname === rankingPath(from)) {
      return editionHref(target, rankingPath(to));
    }
  }
  return editionHref(target);
};

/**
 * Barra de ediciones: el país es la primera dimensión del sitio. Siempre
 * visible en .cl y .com; la edición activa lleva el subrayado rojo. En móvil
 * se desplaza: la activa queda centrada y un degradado indica que hay más.
 */
const EditionBar: React.FC<{ active: EditionKey; pathname: string }> = ({ active, pathname }) => {
  const navRef = React.useRef<HTMLElement>(null);
  const [moreRight, setMoreRight] = React.useState(false);
  // Un país en verificación no está en la barra: se añade mientras se visita.
  const keys = EDITION_ORDER.includes(active) ? EDITION_ORDER : [...EDITION_ORDER, active];

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const current = nav.querySelector<HTMLElement>('[aria-current="page"]');
    if (current && nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft = Math.max(0, current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2);
    }
    const update = () => setMoreRight(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 4);
    update();
    nav.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      nav.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [active]);

  return (
    <div className="bg-ink text-white/70">
      <div className="container mx-auto px-4 flex h-9 items-center justify-between gap-6">
        <div className="relative min-w-0">
          <nav
            ref={navRef}
            aria-label="Ediciones por país"
            className="relative -mx-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex items-center gap-1 whitespace-nowrap text-[13px]">
              {keys.map((key) => {
                const isActive = key === active;
                const verifying = key !== 'LATAM' && getEdition(key).status === 'verifying';
                return (
                  <li key={key}>
                    <a
                      href={editionTarget(key, active, pathname)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`relative inline-flex h-9 items-center gap-1.5 px-2 transition-colors ${
                        isActive ? 'font-semibold text-white' : 'hover:text-white'
                      }`}
                    >
                      {key === 'LATAM' ? <Globe className="h-3.5 w-3.5" aria-hidden /> : <Flag code={key} size={16} />}
                      {editionName(key)}
                      {verifying && <span className="font-normal text-white/60">(en verificación)</span>}
                      {isActive && <span className="absolute inset-x-2 bottom-0 h-[2px] bg-brand-on-dark" aria-hidden />}
                    </a>
                  </li>
                );
              })}
              <li className="lg:hidden">
                <a href={`${editionHref('LATAM')}#cobertura`} className="inline-flex h-9 items-center px-2 text-white/60 hover:text-white">
                  +{VERIFYING_EDITIONS.length} en verificación
                </a>
              </li>
            </ul>
          </nav>
          {moreRight && (
            <span
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink to-transparent"
              aria-hidden
            />
          )}
        </div>
        <a
          href={`${editionHref('LATAM')}#cobertura`}
          className="hidden lg:inline text-[13px] text-white/60 hover:text-white whitespace-nowrap"
        >
          {VERIFYING_EDITIONS.length} países más en verificación
        </a>
      </div>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const { key, label } = useEdition();
  const sections = sectionsFor(key);
  const guides = guideGroups();
  const crossGuides = guidesCrossEdition();
  const homeHref = editionHref(key);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const dashboardLink = role === 'admin' ? '/admin/dashboard' : role === 'hosting_provider' ? '/provider/dashboard' : '/';

  // Sección activa: la de ruta más específica que contiene a la página actual
  // (en /mx/mejor-hosting-mexico-2026 gana "Ranking", no "Proveedores" (/mx)).
  const activeHref = sections
    .filter((item) => !item.external)
    .filter((item) => location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(`${item.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const isCurrent = (item: NavLinkItem) => !item.external && item.href === activeHref;

  return (
    <>
      <EditionBar active={key} pathname={location.pathname} />
      <header className="sticky top-0 z-50 border-b border-rule bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="container mx-auto px-4 flex h-16 items-center gap-6">
          <a href={homeHref} className="shrink-0" aria-label={`EligeTuHosting ${label}, portada`}>
            <Logo edition={label} />
          </a>

          {/* Secciones de la edición */}
          <nav aria-label={`Secciones de ${label}`} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {sections.map((item) => {
                const current = isCurrent(item);
                return (
                  <li key={item.label}>
                    <SmartLink
                      item={item}
                      aria-current={current ? 'page' : undefined}
                      className={`inline-flex h-16 items-center px-3 text-[15px] font-medium transition-colors border-b-2 ${
                        current ? 'border-brand text-ink' : 'border-transparent text-ink-2 hover:text-ink'
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:inline-flex h-10 items-center gap-1 rounded-md px-3 text-[15px] font-medium text-ink-2 hover:text-ink hover:bg-paper data-[state=open]:bg-paper data-[state=open]:text-ink">
                  Guías y herramientas
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-[min(92vw,760px)] rounded-lg border-rule p-0 shadow-lg">
                {crossGuides && (
                  <p className="border-b border-rule px-4 py-2.5 text-xs text-ink-3">
                    Guías y herramientas de la edición Chile: se abren en eligetuhosting.cl.
                  </p>
                )}
                <div className="grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-rule">
                  {guides.map((group) => (
                    <div key={group.title} className="p-4">
                      <p className="mb-2 text-xs font-semibold text-ink-3">{group.title}</p>
                      <ul className="space-y-0.5">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <DropdownMenuItem asChild className="cursor-pointer rounded px-2 py-1.5 text-sm text-ink focus:bg-paper">
                              <SmartLink item={item} />
                            </DropdownMenuItem>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-2 hover:bg-paper hover:text-ink" aria-label="Tu cuenta">
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <div className="px-2 py-1.5">
                    <p className="truncate text-sm font-medium text-ink">{user.email}</p>
                    <p className="text-xs text-ink-3">{role === 'admin' ? 'Administrador' : role === 'hosting_provider' ? 'Proveedor' : 'Usuario'}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate(dashboardLink)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Mi panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="hidden md:inline-flex h-10 items-center rounded-md px-3 text-[15px] font-medium text-ink-2 hover:bg-paper hover:text-ink"
              >
                Ingresar
              </Link>
            )}

            {/* Menú móvil */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink lg:hidden" aria-label="Abrir menú">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88%] max-w-sm overflow-y-auto p-0">
                <SheetTitle className="sr-only">Menú de EligeTuHosting</SheetTitle>
                <div className="border-b border-rule p-5">
                  <Logo edition={label} />
                </div>
                <nav aria-label="Secciones" className="p-5">
                  <p className="mb-2 text-xs font-semibold text-ink-3">{label}</p>
                  <ul className="mb-6">
                    {sections.map((item) => (
                      <li key={item.label}>
                        <SmartLink
                          item={item}
                          onClick={() => setMobileOpen(false)}
                          className={`flex min-h-[44px] items-center border-b border-rule/70 text-base font-medium ${isCurrent(item) ? 'text-brand-ink' : 'text-ink'}`}
                        />
                      </li>
                    ))}
                  </ul>

                  <p className="mb-2 text-xs font-semibold text-ink-3">Ediciones</p>
                  <ul className="mb-6 grid grid-cols-2 gap-x-4">
                    {EDITION_ORDER.map((k) => (
                      <li key={k}>
                        <a
                          href={editionTarget(k, key, location.pathname)}
                          aria-current={k === key ? 'page' : undefined}
                          className={`flex min-h-[44px] items-center gap-2 text-[15px] ${k === key ? 'font-semibold text-ink' : 'text-ink-2'}`}
                        >
                          {k === 'LATAM' ? <Globe className="h-4 w-4" aria-hidden /> : <Flag code={k} size={18} />}
                          {editionName(k)}
                        </a>
                      </li>
                    ))}
                  </ul>

                  {crossGuides && (
                    <p className="mb-3 text-xs text-ink-3">Guías y herramientas de la edición Chile (eligetuhosting.cl):</p>
                  )}
                  {guides.map((group) => (
                    <div key={group.title} className="mb-5">
                      <p className="mb-1 text-xs font-semibold text-ink-3">{group.title}</p>
                      <ul>
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <SmartLink
                              item={item}
                              onClick={() => setMobileOpen(false)}
                              className="flex min-h-[40px] items-center text-[15px] text-ink-2 hover:text-ink"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="border-t border-rule pt-4">
                    {user ? (
                      <div className="space-y-1">
                        <p className="truncate text-sm text-ink-2">{user.email}</p>
                        <button onClick={() => { setMobileOpen(false); navigate(dashboardLink); }} className="flex min-h-[44px] items-center gap-2 text-base font-medium text-ink">
                          <LayoutDashboard className="h-4 w-4" /> Mi panel
                        </button>
                        <button onClick={handleSignOut} className="flex min-h-[44px] items-center gap-2 text-base font-medium text-ink">
                          <LogOut className="h-4 w-4" /> Cerrar sesión
                        </button>
                      </div>
                    ) : (
                      <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex min-h-[44px] items-center text-base font-medium text-ink">
                        Ingresar
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
