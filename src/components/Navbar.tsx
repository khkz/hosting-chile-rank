import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Logo from './Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEdition } from '@/hooks/useEdition';
import { editionHref } from '@/lib/countries';
import { guideGroups, guidesCrossEdition, sectionsFor, type NavLinkItem } from '@/lib/siteNav';
import EditionBar from './marco/EditionBar';
import GuidesMenu from './marco/GuidesMenu';
import MobileMenu from './marco/MobileMenu';
import SmartLink from './marco/SmartLink';
import { CONTENT_ID } from './marco/SkipLink';

/**
 * Marco superior de todas las páginas: barra de ediciones, cabecera fija con
 * las secciones de la edición (desde 1280 px; antes, en el menú lateral), el
 * menú de guías (desde 768 px) y la cuenta. Termina con el destino del enlace
 * «Saltar al contenido» (#contenido), que se monta una sola vez en App.
 */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const { key, label } = useEdition();
  const sections = sectionsFor(key);
  const guides = guideGroups();
  const crossGuides = guidesCrossEdition();
  const homeHref = editionHref(key);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const dashboardLink = role === 'admin' ? '/admin/dashboard' : role === 'hosting_provider' ? '/provider/dashboard' : '/';

  // Sección activa: la de ruta más específica que contiene a la página actual
  // (en /mx/mejor-hosting-mexico-2026 gana "Ranking", no "Proveedores" (/mx)).
  // Un enlace con ancla (/pe#como-ordenamos) solo es la activa si la URL lleva esa ancla.
  const here = `${location.pathname}${location.hash}`;
  const activeHref = sections
    .filter((item) => !item.external)
    .filter((item) =>
      item.href.includes('#')
        ? here === item.href
        : location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(`${item.href}/`))
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const isCurrent = (item: NavLinkItem) => !item.external && item.href === activeHref;

  return (
    <>
      <EditionBar active={key} pathname={location.pathname} />
      <header className="sticky top-0 z-50 border-b border-rule bg-white">
        <div className="container flex h-16 items-center gap-6">
          <a href={homeHref} className="shrink-0 rounded-sm" aria-label={`EligeTuHosting ${label}, portada`}>
            <Logo edition={label} />
          </a>

          {/* Secciones de la edición: desde 1280 px (a 1024 no caben junto al menú de guías). */}
          <nav aria-label={`Secciones de ${label}`} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {sections.map((item) => {
                const current = isCurrent(item);
                return (
                  <li key={item.label}>
                    <SmartLink
                      item={item}
                      aria-current={current ? 'page' : undefined}
                      className={`inline-flex h-16 items-center whitespace-nowrap border-b-2 px-3 text-[15px] font-medium transition-colors ${
                        current ? 'border-ink text-ink' : 'border-transparent text-ink-2 hover:text-ink'
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <GuidesMenu guides={guides} crossGuides={crossGuides} />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-2 hover:bg-paper hover:text-ink"
                    aria-label="Tu cuenta"
                  >
                    <User className="h-5 w-5" aria-hidden />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-xl border-rule bg-white shadow-overlay">
                  <div className="px-2 py-1.5">
                    <p className="truncate text-sm font-medium text-ink">{user.email}</p>
                    <p className="t-meta">{role === 'admin' ? 'Administrador' : role === 'hosting_provider' ? 'Proveedor' : 'Usuario'}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate(dashboardLink)} className="min-h-11 cursor-pointer rounded-lg focus:bg-paper focus:text-ink">
                    <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden />
                    Mi panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="min-h-11 cursor-pointer rounded-lg focus:bg-paper focus:text-ink">
                    <LogOut className="mr-2 h-4 w-4" aria-hidden />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="hidden h-11 items-center whitespace-nowrap rounded-lg px-3 text-[15px] font-medium text-ink-2 hover:bg-paper hover:text-ink md:inline-flex"
              >
                Ingresar
              </Link>
            )}

            <MobileMenu
              editionKey={key}
              label={label}
              pathname={location.pathname}
              sections={sections}
              isCurrent={isCurrent}
              guides={guides}
              crossGuides={crossGuides}
              userEmail={user?.email}
              onDashboard={() => navigate(dashboardLink)}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      </header>
      {/* Destino de «Saltar al contenido»: lo que sigue a la cabecera es el contenido de la página. */}
      <div id={CONTENT_ID} tabIndex={-1} className="outline-none" />
    </>
  );
};

export default Navbar;
